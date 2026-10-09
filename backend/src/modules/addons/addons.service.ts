import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddonsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.serviceAddon.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }
}
