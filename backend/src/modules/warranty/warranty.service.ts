import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WarrantyService {
  constructor(private prisma: PrismaService) {}

  async lookup(keyword: string) {
    if (!keyword) {
      throw new NotFoundException('Vui lòng cung cấp Số điện thoại hoặc Mã Serial sản phẩm');
    }

    const clean = keyword.trim();

    // Query either by customerPhone or by serialNumber
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
        statusText: isExpired ? 'ĐÃ HẾT HẠN' : 'CÒN HIỆU LỰC',
      };
    });
  }
}
