import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WarrantyService {
  constructor(private prisma: PrismaService) {}

  async lookup(keyword: string) {
    if (!keyword) {
      throw new NotFoundException('Vui lòng cung cấp Số điện thoại hoặc Mã Serial sản phẩm');
    }

    const clean = keyword.trim();

    const records = await this.prisma.warrantyRecord.findMany({
      where: {
        OR: [
          { customerPhone: clean },
          { serialNumber: { equals: clean, mode: 'insensitive' } },
        ],
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            warrantyMonths: true,
            specs: true,
          },
        },
      },
    });

    if (!records || records.length === 0) {
      throw new NotFoundException(`Không tìm thấy hồ sơ bảo hành điện tử với thông tin: ${clean}`);
    }

    return records.map((record) => {
      const isExpired = new Date() > record.endDate;
      const daysRemaining = Math.max(
        0,
        Math.ceil((record.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      );

      return {
        ...record,
        isExpired,
        daysRemaining,
        statusText: isExpired ? 'ĐÃ HẾT HẠN' : record.status === 'REPAIRING' ? 'ĐANG TIẾP NHẬN BẢO HÀNH' : 'CÒN HIỆU LỰC',
      };
    });
  }

  async findAll() {
    return this.prisma.warrantyRecord.findMany({
      include: {
        product: {
          select: { id: true, name: true, sku: true, warrantyMonths: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async create(data: {
    productId: string;
    serialNumber: string;
    customerName: string;
    customerPhone: string;
    warrantyMonths: number;
  }) {
    const existing = await this.prisma.warrantyRecord.findUnique({
      where: { serialNumber: data.serialNumber.trim() },
    });

    if (existing) {
      throw new BadRequestException('Mã Serial này đã được kích hoạt');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (Number(data.warrantyMonths) || 12));

    return this.prisma.warrantyRecord.create({
      data: {
        productId: data.productId,
        serialNumber: data.serialNumber.trim(),
        customerName: data.customerName.trim(),
        customerPhone: data.customerPhone.trim(),
        startDate,
        endDate,
        status: 'ACTIVE',
      },
      include: { product: true },
    });
  }

  async updateStatus(id: string, status: string, claimNote?: string) {
    const existing = await this.prisma.warrantyRecord.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Hồ sơ bảo hành không tồn tại');
    }

    return this.prisma.warrantyRecord.update({
      where: { id },
      data: {
        status,
        ...(claimNote !== undefined ? { claimNote: claimNote.trim() } : {}),
      },
      include: { product: true },
    });
  }
}
