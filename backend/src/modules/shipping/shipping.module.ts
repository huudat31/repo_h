import { Module } from '@nestjs/common';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { GhnService } from './ghn.service';
import { GhtkService } from './ghtk.service';

@Module({
  controllers: [ShippingController],
  providers: [ShippingService, GhnService, GhtkService],
  exports: [ShippingService, GhnService, GhtkService],
})
export class ShippingModule {}
