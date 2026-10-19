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
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUrl = `${appUrl}/checkout/success?orderCode=${result.orderCode}&status=${result.success ? 'success' : 'failed'}&message=${encodeURIComponent(result.message)}`;
    return res.redirect(redirectUrl);
  }

  @Get('vnpay/ipn')
  async vnpayIpn(@Query() query: Record<string, any>) {
    return this.paymentsService.handleVnpayIpn(query);
  }

  @Post('momo/ipn')
  async momoIpn(@Body() body: any) {
    return this.paymentsService.handleMomoIpn(body);
  }
}
