import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(userId: string, dto: CreateAddressDto) {
    const count = await this.prisma.address.count({ where: { userId } });
    const isDefault = count === 0 ? true : !!dto.isDefault;

    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        userId,
        recipientName: dto.recipientName.trim(),
        phone: dto.phone.trim(),
        provinceName: dto.provinceName,
        provinceId: dto.provinceId,
        districtName: dto.districtName,
        districtId: dto.districtId,
        wardName: dto.wardName,
        wardCode: dto.wardCode,
        detailAddress: dto.detailAddress.trim(),
        isDefault,
      },
    });
  }

  async update(userId: string, addressId: string, dto: UpdateAddressDto) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Không tìm thấy địa chỉ');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa địa chỉ này');
    }

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: {
        ...(dto.recipientName ? { recipientName: dto.recipientName.trim() } : {}),
        ...(dto.phone ? { phone: dto.phone.trim() } : {}),
        ...(dto.provinceName ? { provinceName: dto.provinceName } : {}),
        ...(dto.provinceId ? { provinceId: dto.provinceId } : {}),
        ...(dto.districtName ? { districtName: dto.districtName } : {}),
        ...(dto.districtId ? { districtId: dto.districtId } : {}),
        ...(dto.wardName ? { wardName: dto.wardName } : {}),
        ...(dto.wardCode ? { wardCode: dto.wardCode } : {}),
        ...(dto.detailAddress ? { detailAddress: dto.detailAddress.trim() } : {}),
        ...(dto.isDefault !== undefined ? { isDefault: dto.isDefault } : {}),
      },
    });
  }

  async delete(userId: string, addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Không tìm thấy địa chỉ');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa địa chỉ này');
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    // Nếu vừa xóa địa chỉ mặc định, đặt địa chỉ đầu tiên còn lại làm mặc định
    if (address.isDefault) {
      const remaining = await this.prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (remaining) {
        await this.prisma.address.update({
          where: { id: remaining.id },
          data: { isDefault: true },
        });
      }
    }

    return { success: true, message: 'Đã xóa địa chỉ thành công' };
  }

  async setDefault(userId: string, addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Không tìm thấy địa chỉ');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền thay đổi địa chỉ này');
    }

    await this.prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}
