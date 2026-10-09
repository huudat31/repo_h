import { Controller, Get, Query } from '@nestjs/common';
import { WarrantyService } from './warranty.service';

@Controller('warranty')
export class WarrantyController {
  constructor(private readonly warrantyService: WarrantyService) {}

  @Get('lookup')
  async lookup(@Query('keyword') keyword: string) {
    return this.warrantyService.lookup(keyword);
  }
}
