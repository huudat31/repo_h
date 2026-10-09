import { Controller, Post, Body } from '@nestjs/common';
import { VouchersService } from './vouchers.service';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post('apply')
  async applyVoucher(
    @Body('code') code: string,
    @Body('orderAmount') orderAmount: number,
  ) {
    return this.vouchersService.applyVoucher(code, Number(orderAmount) || 0);
  }
}
