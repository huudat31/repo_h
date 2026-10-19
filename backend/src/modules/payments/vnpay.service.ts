import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as qs from 'querystring';

export interface CreateVnpayUrlParams {
  orderId: string;
  amount: number;
  orderInfo: string;
  ipAddr: string;
  bankCode?: string;
}

@Injectable()
export class VnpayService {
  private readonly logger = new Logger(VnpayService.name);

  constructor(private configService: ConfigService) {}

  private sortObject(obj: Record<string, any>) {
    const sorted: Record<string, any> = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    }
    return sorted;
  }

  createPaymentUrl(params: CreateVnpayUrlParams): string {
    const tmnCode = this.configService.get<string>('VNPAY_TMN_CODE', 'DEMO2026');
    const secretKey = this.configService.get<string>('VNPAY_HASH_SECRET', 'DEMOHASHSECRETKEY2026XYZ');
    const vnpUrl = this.configService.get<string>('VNPAY_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
    const returnUrl = this.configService.get<string>('VNPAY_RETURN_URL', 'http://localhost:3000/checkout/success');

    const date = new Date();
    const createDate =
      date.getFullYear().toString() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2) +
      ('0' + date.getHours()).slice(-2) +
      ('0' + date.getMinutes()).slice(-2) +
      ('0' + date.getSeconds()).slice(-2);

    let vnpParams: Record<string, any> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: params.orderId,
      vnp_OrderInfo: params.orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: params.amount * 100, // VNPAY multiplies amount by 100
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: params.ipAddr || '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    if (params.bankCode) {
      vnpParams.vnp_BankCode = params.bankCode;
    }

    vnpParams = this.sortObject(vnpParams);

    const signData = qs.stringify(vnpParams, '&', '=', { encodeURIComponent: (s: string) => s });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    vnpParams['vnp_SecureHash'] = signed;
    const finalUrl = `${vnpUrl}?${qs.stringify(vnpParams, '&', '=', { encodeURIComponent: (s: string) => s })}`;

    this.logger.log(`Created VNPAY payment URL for order ${params.orderId}`);
    return finalUrl;
  }

  verifyReturnUrl(query: Record<string, any>): { isSuccess: boolean; isValidHash: boolean; orderId: string; amount: number; transactionNo: string } {
    const secretKey = this.configService.get<string>('VNPAY_HASH_SECRET', 'DEMOHASHSECRETKEY2026XYZ');
    const secureHash = query['vnp_SecureHash'];

    const filteredParams: Record<string, any> = {};
    for (const key in query) {
      if (key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType') {
        filteredParams[key] = query[key];
      }
    }

    const sortedParams = this.sortObject(filteredParams);
    const signData = qs.stringify(sortedParams, '&', '=', { encodeURIComponent: (s: string) => s });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    const isValidHash = secureHash === signed;
    const isSuccess = isValidHash && query['vnp_ResponseCode'] === '00';

    return {
      isValidHash,
      isSuccess,
      orderId: query['vnp_TxnRef'],
      amount: Number(query['vnp_Amount']) / 100,
      transactionNo: query['vnp_TransactionNo'],
    };
  }
}
