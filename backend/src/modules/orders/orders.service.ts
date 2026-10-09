import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import { OrderStatus, PaymentProvider, PaymentStatus, ShippingCarrier } from '@prisma/client';

export interface CreateOrderDto {
  userId?: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: {
    provinceName: string;
    provinceId: number;
    districtName: string;
    districtId: number;
    wardName: string;
    wardCode: string;
    detailAddress: string;
  };
  items: {
    productId: string;
    quantity: number;
  }[];
  paymentProvider: PaymentProvider;
  shippingCarrier?: ShippingCarrier;
  shippingFee?: number;
  notes?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  private generateOrderCode(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${Date.now().toString().slice(-6)}-${random}`;
  }

  async createOrder(dto: CreateOrderDto) {
    // Fetch product details for accurate pricing and stock deduction
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalAmount = 0;
    const orderItemsData = dto.items.map((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      if (!p) throw new NotFoundException(`Sản phẩm ${item.productId} không tồn tại`);
      totalAmount += p.price * item.quantity;
      return {
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        price: p.price,
        quantity: item.quantity,
        specs: (p.specs as any) || {},
      };
    });

    const shippingFee = dto.shippingFee || 30000;
    const finalAmount = totalAmount + shippingFee;
    const orderCode = this.generateOrderCode();

    const order = await this.prisma.order.create({
      data: {
        orderCode,
        userId: dto.userId,
        recipientName: dto.recipientName,
        recipientPhone: dto.recipientPhone,
        shippingAddress: dto.shippingAddress,
        totalAmount,
        shippingFee,
        finalAmount,
        status: OrderStatus.PENDING,
        paymentProvider: dto.paymentProvider,
        paymentStatus: PaymentStatus.PENDING,
        shippingCarrier: dto.shippingCarrier,
        notes: dto.notes,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
        user: true,
      },
    });

    // Send confirmation email
    if (order.user?.email) {
      await this.mailService.sendOrderConfirmationEmail(order, order.user.email);
    }

    return order;
  }

  async findByCode(orderCode: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderCode },
      include: {
        items: true,
        payments: true,
        shippingOrders: true,
      },
    });

    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
