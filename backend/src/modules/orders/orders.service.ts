import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';

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

  private generateSerialNumber(brandName: string): string {
    const cleanBrand = (brandName || 'TECH').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4);
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `SN-${cleanBrand}-${year}-${random}`;
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Giỏ hàng không có sản phẩm nào');
    }

    // 1. Transaction to guarantee atomic inventory decrement and order creation
    const order = await this.prisma.$transaction(async (tx) => {
      const productIds = dto.items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        include: { brand: true },
      });

      let totalAmount = 0;
      const orderItemsData: any[] = [];

      for (const item of dto.items) {
        const p = products.find((prod) => prod.id === item.productId);
        if (!p) {
          throw new NotFoundException(`Sản phẩm ${item.productId} không tồn tại`);
        }

        // TỒN KHO: Kiểm tra số lượng tồn kho
        if (p.stock < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm "${p.name}" chỉ còn ${p.stock} sản phẩm trong kho (bạn đặt ${item.quantity})`,
          );
        }

        // TỒN KHO: Trừ số lượng tồn kho
        await tx.product.update({
          where: { id: p.id },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        totalAmount += p.price * item.quantity;
        orderItemsData.push({
          productId: p.id,
          productName: p.name,
          sku: p.sku,
          price: p.price,
          quantity: item.quantity,
          specs: (p.specs as any) || {},
        });
      }

      // VOUCHER: Kiểm tra và tính giảm giá chính thức trên server
      let discountAmount = 0;
      let appliedVoucherCode: string | null = null;

      if (dto.voucherCode) {
        const voucher = await tx.voucher.findUnique({
          where: { code: dto.voucherCode.toUpperCase().trim() },
        });

        if (voucher && voucher.isActive) {
          const now = new Date();
          const isValidTime = now >= voucher.validFrom && now <= voucher.validTo;
          const hasRemainingUsage = voucher.usedCount < voucher.usageLimit;
          const meetsMinOrder = totalAmount >= voucher.minOrderValue;

          if (isValidTime && hasRemainingUsage && meetsMinOrder) {
            appliedVoucherCode = voucher.code;
            if (voucher.discountType === 'PERCENT') {
              discountAmount = (totalAmount * voucher.discountValue) / 100;
              if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
                discountAmount = voucher.maxDiscount;
              }
            } else {
              discountAmount = voucher.discountValue;
            }

            // Tăng lượt sử dụng voucher
            await tx.voucher.update({
              where: { id: voucher.id },
              data: { usedCount: { increment: 1 } },
            });
          }
        }
      }

      // DỊCH VỤ ĐI KÈM (ADDONS)
      const addonAmount = dto.addonAmount || 0;
      const selectedAddons = dto.selectedAddons || [];
      const shippingFee = dto.shippingFee !== undefined ? dto.shippingFee : 30000;

      // TÍNH TOÁN FINAL AMOUNT CHUẨN XÁC
      const finalAmount = Math.max(0, totalAmount + addonAmount + shippingFee - discountAmount);
      const orderCode = this.generateOrderCode();

      // TẠO ĐƠN HÀNG
      const createdOrder = await tx.order.create({
        data: {
          orderCode,
          userId,
          recipientName: dto.recipientName.trim(),
          recipientPhone: dto.recipientPhone.trim(),
          shippingAddress: dto.shippingAddress as any,
          totalAmount,
          shippingFee,
          addonAmount,
          selectedAddons: selectedAddons as any,
          voucherCode: appliedVoucherCode,
          discountAmount,
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

      // BẢO HÀNH ĐIỆN TỬ: Tự động khởi tạo hồ sơ bảo hành điện tử theo Serial/IMEI
      const hasGoldWarranty = selectedAddons.some((a) =>
        a.name.toLowerCase().includes('bảo hành') || a.name.toLowerCase().includes('vàng')
      );
      const extraWarrantyMonths = hasGoldWarranty ? 12 : 0;

      for (const item of dto.items) {
        const p = products.find((prod) => prod.id === item.productId);
        if (p) {
          const serialNumber = this.generateSerialNumber(p.brand?.name || 'TECH');
          const months = (p.warrantyMonths || 12) + extraWarrantyMonths;
          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + months);

          await tx.warrantyRecord.create({
            data: {
              serialNumber,
              productId: p.id,
              orderId: createdOrder.id,
              customerPhone: dto.recipientPhone.trim(),
              customerName: dto.recipientName.trim(),
              startDate,
              endDate,
              status: 'ACTIVE',
            },
          });
        }
      }

      return createdOrder;
    });

    // Gửi email xác nhận
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
      include: {
        items: true,
        payments: true,
        shippingOrders: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    // Nếu đơn hàng bị hủy, hoàn trả lại số lượng tồn kho
    if (status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
      for (const item of order.items) {
        if (item.productId) {
          await this.prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async findAllOrders(status?: OrderStatus, search?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderCode: { contains: search, mode: 'insensitive' } },
        { recipientName: { contains: search, mode: 'insensitive' } },
        { recipientPhone: { contains: search } },
      ];
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: true,
        user: { select: { id: true, email: true, fullName: true, phone: true } },
        shippingOrders: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assignStaff(orderId: string, assignedStaff: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { assignedStaff },
    });
  }
}
