import { Controller, Post, Body } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ShippingCarrier } from '@prisma/client';

@Controller('shipping')
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  @Post('calculate-fee')
  async calculateFee(
    @Body('carrier') carrier: ShippingCarrier,
    @Body('provinceName') provinceName: string,
    @Body('districtName') districtName: string,
    @Body('districtId') districtId?: number,
    @Body('wardCode') wardCode?: string,
    @Body('weightInGrams') weightInGrams?: number,
  ) {
    return this.shippingService.calculateFee({
      carrier,
      provinceName,
      districtName,
      districtId,
      wardCode,
      weightInGrams,
    });
  }

  @Post('create-order')
  async createShippingOrder(
    @Body('orderId') orderId: string,
    @Body('carrier') carrier: ShippingCarrier,
  ) {
    return this.shippingService.createShippingForOrder(orderId, carrier);
  }
}
