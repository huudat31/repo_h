import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface GhnCalculateFeeDto {
  fromDistrictId?: number;
  toDistrictId: number;
  toWardCode: string;
  weightInGrams: number;
  insuranceValue?: number;
}

@Injectable()
export class GhnService {
  private readonly logger = new Logger(GhnService.name);

  constructor(private configService: ConfigService) {}

  private getClient() {
    const baseURL = this.configService.get<string>('GHN_API_URL', 'https://dev-online-gateway.ghn.vn/shiip/public-api');
    const token = this.configService.get<string>('GHN_API_TOKEN', 'DEMO_GHN_TOKEN');
    const shopId = this.configService.get<string>('GHN_SHOP_ID', '123456');

    return axios.create({
      baseURL,
      headers: {
        Token: token,
        ShopId: shopId,
        'Content-Type': 'application/json',
      },
    });
  }

  async calculateFee(dto: GhnCalculateFeeDto): Promise<number> {
    try {
      const client = this.getClient();
      const response = await client.post('/v2/shipping-order/fee', {
        service_type_id: 2, // Chuẩn
        from_district_id: dto.fromDistrictId || 1442, // Default Q1, TP HCM
        to_district_id: dto.toDistrictId,
        to_ward_code: dto.toWardCode,
        height: 10,
        length: 20,
        width: 15,
        weight: dto.weightInGrams || 500,
        insurance_value: dto.insuranceValue || 0,
      });

      if (response.data?.code === 200) {
        return response.data.data.total;
      }
      return 35000; // Fallback standard rate
    } catch (err: any) {
      this.logger.warn(`GHN Fee calculation fallback used: ${err.message}`);
      return 35000; // Fallback VND
    }
  }

  async createShippingOrder(orderData: any): Promise<{ trackingCode: string; expectedDelivery: Date; fee: number }> {
    try {
      const client = this.getClient();
      const response = await client.post('/v2/shipping-order/create', {
        payment_type_id: 2, // Người nhận trả phí hoặc Shop trả
        note: orderData.notes || 'Hàng công nghệ giá trị cao, xin nhẹ tay',
        required_note: 'KHONGCHOXEMHANG',
        to_name: orderData.recipientName,
        to_phone: orderData.recipientPhone,
        to_address: orderData.shippingAddress.detailAddress,
        to_ward_code: orderData.shippingAddress.wardCode,
        to_district_id: orderData.shippingAddress.districtId,
        weight: 1000,
        length: 25,
        width: 20,
        height: 10,
        service_type_id: 2,
        items: orderData.items.map((i: any) => ({
          name: i.productName,
          code: i.sku,
          quantity: i.quantity,
          price: i.price,
        })),
      });

      if (response.data?.code === 200) {
        return {
          trackingCode: response.data.data.order_code,
          expectedDelivery: new Date(response.data.data.expected_delivery_time),
          fee: response.data.data.total_fee,
        };
      }
    } catch (err: any) {
      this.logger.warn(`GHN create order sandbox simulator used: ${err.message}`);
    }

    // Mock tracking code for development / test environments
    const mockCode = `GHN${Date.now().toString().slice(-8)}`;
    const nextThreeDays = new Date();
    nextThreeDays.setDate(nextThreeDays.getDate() + 3);

    return {
      trackingCode: mockCode,
      expectedDelivery: nextThreeDays,
      fee: 35000,
    };
  }
}
