import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface GhtkCalculateFeeDto {
  pickProvince?: string;
  pickDistrict?: string;
  province: string;
  district: string;
  weightInGrams: number;
}

@Injectable()
export class GhtkService {
  private readonly logger = new Logger(GhtkService.name);

  constructor(private configService: ConfigService) {}

  private getClient() {
    const baseURL = this.configService.get<string>(
      'GHTK_API_URL',
      'https://services.giaohangtietkiem.vn/services/shipment',
    );
    const token = this.configService.get<string>('GHTK_API_TOKEN', 'DEMO_GHTK_TOKEN');

    return axios.create({
      baseURL,
      headers: {
        Token: token,
        'Content-Type': 'application/json',
      },
    });
  }

  async calculateFee(dto: GhtkCalculateFeeDto): Promise<number> {
    try {
      const client = this.getClient();
      const response = await client.get('/fee', {
        params: {
          pick_province: dto.pickProvince || 'TP. Hồ Chí Minh',
          pick_district: dto.pickDistrict || 'Quận 1',
          province: dto.province,
          district: dto.district,
          weight: dto.weightInGrams || 500,
          deliver_option: 'none',
        },
      });

      if (response.data?.success && response.data.fee?.fee) {
        return response.data.fee.fee;
      }
      return 30000;
    } catch (err: any) {
      this.logger.warn(`GHTK Fee calculation fallback used: ${err.message}`);
      return 30000; // Fallback VND
    }
  }

  async createShippingOrder(orderData: any): Promise<{ trackingCode: string; expectedDelivery: Date; fee: number }> {
    try {
      const client = this.getClient();
      const payload = {
        products: orderData.items.map((i: any) => ({
          name: i.productName,
          weight: 0.5,
          quantity: i.quantity,
          product_code: i.sku,
        })),
        order: {
          id: orderData.orderCode,
          pick_name: 'TechStore Warehouse',
          pick_address: '123 Nguyen Hue',
          pick_province: 'TP. Hồ Chí Minh',
          pick_district: 'Quận 1',
          pick_tel: '0901234567',
          tel: orderData.recipientPhone,
          name: orderData.recipientName,
          address: orderData.shippingAddress.detailAddress,
          province: orderData.shippingAddress.provinceName,
          district: orderData.shippingAddress.districtName,
          is_freeship: 1,
        },
      };

      const response = await client.post('/order', payload);
      if (response.data?.success && response.data.order) {
        return {
          trackingCode: response.data.order.label,
          expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          fee: response.data.order.fee,
        };
      }
    } catch (err: any) {
      this.logger.warn(`GHTK create order sandbox simulator used: ${err.message}`);
    }

    const mockCode = `GHTK${Date.now().toString().slice(-8)}`;
    const nextThreeDays = new Date();
    nextThreeDays.setDate(nextThreeDays.getDate() + 3);

    return {
      trackingCode: mockCode,
      expectedDelivery: nextThreeDays,
      fee: 30000,
    };
  }
}
