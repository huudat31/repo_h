import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GhnService } from './ghn.service';
import { GhtkService } from './ghtk.service';
import { ShippingCarrier, OrderStatus } from '@prisma/client';

@Injectable()
export class ShippingService {
  constructor(
    private prisma: PrismaService,
    private ghnService: GhnService,
    private ghtkService: GhtkService,
  ) {}

  async calculateFee(params: {
    carrier: ShippingCarrier;
    provinceName: string;
    districtName: string;
    districtId?: number;
    wardCode?: string;
    weightInGrams?: number;
  }) {
    if (params.carrier === ShippingCarrier.GHN) {
      const fee = await this.ghnService.calculateFee({
        toDistrictId: params.districtId || 1442,
        toWardCode: params.wardCode || '20101',
        weightInGrams: params.weightInGrams || 500,
      });
      return { carrier: ShippingCarrier.GHN, fee, carrierName: 'Giao Hàng Nhanh (GHN)' };
    } else {
      const fee = await this.ghtkService.calculateFee({
        province: params.provinceName,
        district: params.districtName,
        weightInGrams: params.weightInGrams || 500,
      });
      return { carrier: ShippingCarrier.GHTK, fee, carrierName: 'Giao Hàng Tiết Kiệm (GHTK)' };
    }
  }

  async createShippingForOrder(orderId: string, carrier: ShippingCarrier) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    let result: { trackingCode: string; expectedDelivery: Date; fee: number };

    if (carrier === ShippingCarrier.GHN) {
      result = await this.ghnService.createShippingOrder(order);
    } else {
      result = await this.ghtkService.createShippingOrder(order);
    }

    const shippingRecord = await this.prisma.shippingOrder.create({
      data: {
        orderId: order.id,
        carrier,
        trackingCode: result.trackingCode,
        fee: result.fee,
        expectedDeliveryAt: result.expectedDelivery,
        status: 'SHIPPING',
      },
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        shippingCarrier: carrier,
        shippingTrackingCode: result.trackingCode,
        status: OrderStatus.SHIPPING,
      },
    });

    return shippingRecord;
  }
}
