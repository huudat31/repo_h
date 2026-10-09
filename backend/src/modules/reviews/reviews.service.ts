import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateReviewDto {
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  comment: string;
  images?: string[];
}

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string, hasImagesOnly?: boolean) {
    const where: any = { productId };
    if (hasImagesOnly) {
      where.images = { isEmpty: false };
    }

    const reviews = await this.prisma.productReview.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const total = reviews.length;
    const avgRating = total > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : '5.0';

    return {
      reviews,
      total,
      avgRating: Number(avgRating),
    };
  }

  async create(dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    return this.prisma.productReview.create({
      data: {
        productId: dto.productId,
        userId: dto.userId,
        authorName: dto.authorName,
        rating: Math.min(5, Math.max(1, dto.rating)),
        comment: dto.comment,
        images: dto.images || [],
        isVerified: true,
      },
    });
  }
}
