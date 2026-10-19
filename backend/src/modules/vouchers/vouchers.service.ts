import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VouchersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.voucher.findMany({
      orderBy: { validFrom: 'desc' },
    });
  }

  async create(data: {
    code: string;
    title: string;
    discountType: 'PERCENT' | 'FIXED';
    discountValue: number;
    minOrderValue?: number;
    maxDiscount?: number;
    usageLimit?: number;
    validFrom?: Date;
    validTo: Date;
    isActive?: boolean;
  }) {
    const existing = await this.prisma.voucher.findUnique({
      where: { code: data.code.toUpperCase().trim() },
    });

    if (existing) {
      throw new BadRequestException('Mã giảm giá đã tồn tại');
    }

    return this.prisma.voucher.create({
      data: {
        code: data.code.toUpperCase().trim(),
        title: data.title.trim(),
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        minOrderValue: Number(data.minOrderValue) || 0,
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
        usageLimit: Number(data.usageLimit) || 100,
        validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
        validTo: new Date(data.validTo),
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  async update(id: string, data: Partial<{
    title: string;
    discountType: 'PERCENT' | 'FIXED';
    discountValue: number;
    minOrderValue: number;
    maxDiscount: number;
    usageLimit: number;
    validTo: Date;
    isActive: boolean;
  }>) {
    const existing = await this.prisma.voucher.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Voucher không tồn tại');
    }

    return this.prisma.voucher.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title.trim() } : {}),
        ...(data.discountType ? { discountType: data.discountType } : {}),
        ...(data.discountValue !== undefined ? { discountValue: Number(data.discountValue) } : {}),
        ...(data.minOrderValue !== undefined ? { minOrderValue: Number(data.minOrderValue) } : {}),
        ...(data.maxDiscount !== undefined ? { maxDiscount: Number(data.maxDiscount) } : {}),
        ...(data.usageLimit !== undefined ? { usageLimit: Number(data.usageLimit) } : {}),
        ...(data.validTo ? { validTo: new Date(data.validTo) } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.voucher.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Voucher không tồn tại');
    }

    await this.prisma.voucher.delete({ where: { id } });
    return { success: true, message: 'Đã xóa voucher thành công' };
  }

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
