import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentProvider, ShippingCarrier, OrderStatus, PaymentStatus } from '@prisma/client';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaMock: any;
  let mailServiceMock: any;

  beforeEach(async () => {
    prismaMock = {
      $transaction: jest.fn((callback) => callback(prismaMock)),
      product: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
      voucher: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      order: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      warrantyRecord: {
        create: jest.fn(),
      },
    };

    mailServiceMock = {
      sendOrderConfirmationEmail: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: MailService, useValue: mailServiceMock },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    const validDto = {
      items: [{ productId: 'prod-1', quantity: 2 }],
      recipientName: 'Nguyễn Văn An',
      recipientPhone: '0901234567',
      shippingAddress: {
        provinceName: 'Hồ Chí Minh',
        provinceId: 202,
        districtName: 'Quận 1',
        districtId: 1442,
        wardName: 'Bến Nghé',
        wardCode: '20101',
        detailAddress: '123 Lê Lợi',
      },
      paymentProvider: PaymentProvider.VNPAY,
      shippingCarrier: ShippingCarrier.GHN,
      shippingFee: 30000,
    };

    const mockProduct = {
      id: 'prod-1',
      name: 'iPhone 16 Pro Max',
      sku: 'IPHONE-16-PM',
      price: 34000000,
      stock: 10,
      warrantyMonths: 12,
      specs: {},
      brand: { name: 'Apple' },
    };

    it('should throw BadRequestException if items array is empty', async () => {
      await expect(
        service.createOrder('user-1', { ...validDto, items: [] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if product is not found', async () => {
      prismaMock.product.findMany.mockResolvedValue([]);

      await expect(service.createOrder('user-1', validDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if stock is insufficient', async () => {
      prismaMock.product.findMany.mockResolvedValue([
        { ...mockProduct, stock: 1 }, // Only 1 in stock, but ordering 2
      ]);

      await expect(service.createOrder('user-1', validDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should successfully create order and decrement stock atomically', async () => {
      prismaMock.product.findMany.mockResolvedValue([mockProduct]);
      prismaMock.product.update.mockResolvedValue({ ...mockProduct, stock: 8 });
      prismaMock.order.create.mockResolvedValue({
        id: 'ord-uuid-1',
        orderCode: 'ORD-123456-7890',
        userId: 'user-1',
        totalAmount: 68000000,
        shippingFee: 30000,
        finalAmount: 68030000,
        status: OrderStatus.PENDING,
        user: { email: 'an.nguyen@example.com' },
      });

      const result = await service.createOrder('user-1', validDto);

      expect(prismaMock.product.update).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: { stock: { decrement: 2 } },
      });
      expect(prismaMock.order.create).toHaveBeenCalled();
      expect(result.finalAmount).toBe(68030000);
      expect(mailServiceMock.sendOrderConfirmationEmail).toHaveBeenCalledWith(
        expect.anything(),
        'an.nguyen@example.com',
      );
    });

    it('should calculate discount correctly with PERCENT voucher and cap at maxDiscount', async () => {
      prismaMock.product.findMany.mockResolvedValue([mockProduct]);
      prismaMock.product.update.mockResolvedValue({ ...mockProduct, stock: 8 });
      prismaMock.voucher.findUnique.mockResolvedValue({
        id: 'v-1',
        code: 'GIAM10',
        isActive: true,
        discountType: 'PERCENT',
        discountValue: 10, // 10% of 68,000,000 is 6,800,000
        maxDiscount: 1000000, // Capped at 1,000,000
        minOrderValue: 500000,
        validFrom: new Date(Date.now() - 100000),
        validTo: new Date(Date.now() + 100000),
        usedCount: 0,
        usageLimit: 100,
      });

      prismaMock.order.create.mockImplementation(({ data }) => ({
        id: 'ord-uuid-2',
        ...data,
      }));

      const result = await service.createOrder('user-1', {
        ...validDto,
        voucherCode: 'GIAM10',
      });

      // Total: 68,000,000, Shipping: 30,000, Discount: 1,000,000 (capped)
      // Final = 68,000,000 + 30,000 - 1,000,000 = 67,030,000
      expect(result.discountAmount).toBe(1000000);
      expect(result.finalAmount).toBe(67030000);
      expect(prismaMock.voucher.update).toHaveBeenCalledWith({
        where: { id: 'v-1' },
        data: { usedCount: { increment: 1 } },
      });
    });
  });

  describe('findByCode', () => {
    it('should return order if found', async () => {
      const mockOrder = { id: 'ord-1', orderCode: 'ORD-123456' };
      prismaMock.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.findByCode('ORD-123456');
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order does not exist', async () => {
      prismaMock.order.findUnique.mockResolvedValue(null);

      await expect(service.findByCode('ORD-NON-EXIST')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
