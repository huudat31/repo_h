import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { VnpayService } from './vnpay.service';

describe('VnpayService', () => {
  let service: VnpayService;
  const mockSecret = 'TEST_SECRET_KEY_123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VnpayService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: string) => {
              if (key === 'VNPAY_HASH_SECRET') return mockSecret;
              if (key === 'VNPAY_TMN_CODE') return 'TEST_TMN';
              if (key === 'VNPAY_URL') return 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
              if (key === 'VNPAY_RETURN_URL') return 'http://localhost:3000/checkout/success';
              return defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<VnpayService>(VnpayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPaymentUrl', () => {
    it('should generate a valid payment url with HMAC SHA512 signature and multiplied amount', () => {
      const url = service.createPaymentUrl({
        orderId: 'ORD-123456',
        amount: 500000,
        orderInfo: 'Thanh toan don hang ORD-123456',
        ipAddr: '127.0.0.1',
      });

      expect(url).toContain('https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?');
      expect(url).toContain('vnp_Amount=50000000'); // 500.000 * 100
      expect(url).toContain('vnp_TxnRef=ORD-123456');
      expect(url).toContain('vnp_TmnCode=TEST_TMN');
      expect(url).toContain('vnp_SecureHash=');
    });
  });

  describe('verifyReturnUrl', () => {
    it('should verify return url with correct hash and response code 00', () => {
      // Create url to get valid hash params
      const paymentUrl = service.createPaymentUrl({
        orderId: 'ORD-999',
        amount: 100000,
        orderInfo: 'Test Order',
        ipAddr: '127.0.0.1',
      });

      const parsedUrl = new URL(paymentUrl);
      const queryParams: Record<string, string> = {};
      parsedUrl.searchParams.forEach((val, key) => {
        queryParams[key] = val;
      });

      // Add response code '00' for success
      queryParams['vnp_ResponseCode'] = '00';
      queryParams['vnp_TransactionNo'] = 'TRANS_123456';

      // Re-sign with vnp_ResponseCode and vnp_TransactionNo to simulate VNPAY callback
      const filtered: Record<string, any> = {};
      for (const k in queryParams) {
        if (k !== 'vnp_SecureHash' && k !== 'vnp_SecureHashType') {
          filtered[k] = queryParams[k];
        }
      }
      const sortedKeys = Object.keys(filtered).sort();
      const qs = require('querystring');
      const crypto = require('crypto');
      const sortedObj: Record<string, any> = {};
      for (const k of sortedKeys) {
        sortedObj[k] = encodeURIComponent(filtered[k]).replace(/%20/g, '+');
      }
      const signData = qs.stringify(sortedObj, '&', '=', { encodeURIComponent: (s: string) => s });
      const hmac = crypto.createHmac('sha512', mockSecret);
      queryParams['vnp_SecureHash'] = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      const result = service.verifyReturnUrl(queryParams);
      expect(result.isValidHash).toBe(true);
      expect(result.isSuccess).toBe(true);
      expect(result.orderId).toBe('ORD-999');
      expect(result.amount).toBe(100000);
    });

    it('should fail verification when hash is tampered', () => {
      const queryParams = {
        vnp_Amount: '10000000',
        vnp_TxnRef: 'ORD-TAMPERED',
        vnp_ResponseCode: '00',
        vnp_SecureHash: 'invalid_tampered_hash_value',
      };

      const result = service.verifyReturnUrl(queryParams);
      expect(result.isValidHash).toBe(false);
      expect(result.isSuccess).toBe(false);
    });
  });
});
