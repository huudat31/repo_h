import { Controller, Post, Body, Get, Query, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentProvider } from '@prisma/client';
import { Response, Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-url')
  async createUrl(
    @Body('orderId') orderId: string,
    @Body('provider') provider: PaymentProvider,
    @Req() req: Request,
  ) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    return this.paymentsService.createPaymentUrl(orderId, provider, ip);
  }

  @Get('vnpay/return')
  async vnpayReturn(@Query() query: Record<string, any>, @Res() res: Response) {
    const result = await this.paymentsService.handleVnpayReturn(query);
    const redirectUrl = `http://localhost:3000/checkout/success?orderCode=${result.orderCode}&status=${result.success ? 'success' : 'failed'}&message=${encodeURIComponent(result.message)}`;
    return res.redirect(redirectUrl);
  }

  @Post('momo/ipn')
  async momoIpn(@Body() body: any) {
    return this.paymentsService.handleMomoIpn(body);
  }
}
