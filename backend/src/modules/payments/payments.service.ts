import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VnpayService } from './vnpay.service';
import { MomoService } from './momo.service';
import { PaymentProvider, PaymentStatus, OrderStatus } from '@prisma/client';
import { MailService } from '../notifications/mail.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private vnpayService: VnpayService,
    private momoService: MomoService,
    private mailService: MailService,
  ) {}

  async createPaymentUrl(orderId: string, provider: PaymentProvider, ipAddr = '127.0.0.1') {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, items: true },
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    let paymentUrl = '';
    const orderInfo = `Thanh toan don hang ${order.orderCode} tai TechStore`;

    if (provider === PaymentProvider.VNPAY) {
      paymentUrl = this.vnpayService.createPaymentUrl({
        orderId: order.id,
        amount: order.finalAmount,
        orderInfo,
        ipAddr,
      });
    } else if (provider === PaymentProvider.MOMO) {
      paymentUrl = await this.momoService.createPaymentUrl({
        orderId: order.id,
        amount: order.finalAmount,
        orderInfo,
      });
    }

    return {
      orderId: order.id,
      orderCode: order.orderCode,
      provider,
      paymentUrl,
    };
  }

  async handleVnpayReturn(query: Record<string, any>) {
    const result = this.vnpayService.verifyReturnUrl(query);

    const order = await this.prisma.order.findUnique({
      where: { id: result.orderId },
      include: { user: true, items: true },
    });

    if (!order) return { success: false, message: 'Đơn hàng không tồn tại' };

    if (result.isSuccess) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.SUCCESS,
          status: OrderStatus.CONFIRMED,
        },
      });

      await this.prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          provider: PaymentProvider.VNPAY,
          transactionNo: result.transactionNo,
          amount: result.amount,
          status: PaymentStatus.SUCCESS,
          responseCode: query['vnp_ResponseCode'],
          payload: query,
        },
      });

      // Gửi email xác nhận
      if (order.user?.email) {
        await this.mailService.sendOrderConfirmationEmail(order, order.user.email);
      }

      return { success: true, orderCode: order.orderCode, message: 'Thanh toán thành công' };
    }

    await this.prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        provider: PaymentProvider.VNPAY,
        amount: result.amount,
        status: PaymentStatus.FAILED,
        responseCode: query['vnp_ResponseCode'],
        payload: query,
      },
    });

    return { success: false, orderCode: order.orderCode, message: 'Thanh toán thất bại hoặc đã hủy' };
  }

  async handleVnpayIpn(query: Record<string, any>) {
    const result = this.vnpayService.verifyReturnUrl(query);
    if (!result.isValidHash) {
      return { RspCode: '97', Message: 'Checksum failed' };
    }

    const order = await this.prisma.order.findUnique({
      where: { id: result.orderId },
      include: { user: true, items: true },
    });

    if (!order) {
      return { RspCode: '01', Message: 'Order not found' };
    }

    if (order.paymentStatus === PaymentStatus.SUCCESS) {
      return { RspCode: '02', Message: 'Order already confirmed' };
    }

    if (result.isSuccess) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.SUCCESS,
          status: OrderStatus.CONFIRMED,
        },
      });

      await this.prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          provider: PaymentProvider.VNPAY,
          transactionNo: result.transactionNo,
          amount: result.amount,
          status: PaymentStatus.SUCCESS,
          responseCode: query['vnp_ResponseCode'],
          payload: query,
        },
      });

      if (order.user?.email) {
        await this.mailService.sendOrderConfirmationEmail(order, order.user.email);
      }

      return { RspCode: '00', Message: 'Confirm Success' };
    } else {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });

      return { RspCode: '00', Message: 'Confirm Success' };
    }
  }

  async handleMomoIpn(body: any) {
    const isValid = this.momoService.verifyIpnSignature(body);
    if (!isValid) return { message: 'Invalid signature' };

    const isSuccess = body.resultCode === 0 || body.resultCode === '0';
    const order = await this.prisma.order.findUnique({
      where: { id: body.orderId },
    });

    if (!order) return { message: 'Order not found' };

    if (isSuccess) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.SUCCESS,
          status: OrderStatus.CONFIRMED,
        },
      });

      await this.prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          provider: PaymentProvider.MOMO,
          transactionNo: body.transId?.toString(),
          amount: Number(body.amount),
          status: PaymentStatus.SUCCESS,
          payload: body,
        },
      });
    }

    return { message: 'IPN Processed' };
  }
}
