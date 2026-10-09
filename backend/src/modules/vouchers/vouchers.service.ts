import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VouchersService {
  constructor(private prisma: PrismaService) {}

  async applyVoucher(code: string, orderAmount: number) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!voucher || !voucher.isActive) {
      throw new NotFoundException('Mã giảm giá không tồn tại hoặc đã hết hiệu lực');
    }

    const now = new Date();
    if (now < voucher.validFrom || now > voucher.validTo) {
      throw new BadRequestException('Mã giảm giá đã hết thời gian áp dụng');
    }

    if (voucher.usedCount >= voucher.usageLimit) {
      throw new BadRequestException('Mã giảm giá đã hết lượt sử dụng');
    }

    if (orderAmount < voucher.minOrderValue) {
      throw new BadRequestException(
        `Đơn hàng cần đạt tối thiểu ${voucher.minOrderValue.toLocaleString('vi-VN')} đ để dùng mã này`,
      );
    }

    let discount = 0;
    if (voucher.discountType === 'PERCENT') {
      discount = (orderAmount * voucher.discountValue) / 100;
      if (voucher.maxDiscount && discount > voucher.maxDiscount) {
        discount = voucher.maxDiscount;
      }
    } else {
      discount = voucher.discountValue;
    }

    return {
      valid: true,
      code: voucher.code,
      title: voucher.title,
      discountAmount: discount,
      finalAmount: Math.max(0, orderAmount - discount),
    };
  }
}
