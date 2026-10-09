import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SearchService } from '../search/search.service';

export interface CreateProductDto {
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  categoryId: string;
  specs?: Record<string, any>; // Flexible technical specifications
}

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private searchService: SearchService,
  ) {}

  async findAll(query?: { search?: string; categoryId?: string; minPrice?: number; maxPrice?: number; page?: number; limit?: number }) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 20;
    const skip = (page - 1) * limit;

    // Cache key for unfiltered listing
    const cacheKey = `products:list:${JSON.stringify(query || {})}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    let productIds: string[] | null = null;
    if (query?.search) {
      // Elasticsearch advanced search query
      productIds = await this.searchService.search(query.search, query.minPrice, query.maxPrice);
    }

    const where: any = { isPublished: true };

    if (productIds && productIds.length > 0) {
      where.id = { in: productIds };
    } else if (query?.search) {
      // Fallback SQL search
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query?.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query?.minPrice || query?.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = Number(query.minPrice);
      if (query.maxPrice) where.price.lte = Number(query.maxPrice);
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const result = {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache in Redis for 120 seconds
    await this.redisService.set(cacheKey, result, 120);

    return result;
  }

  async findBySlug(slug: string) {
    const cacheKey = `product:slug:${slug}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm: ${slug}`);
    }

    // Cache for 10 minutes
    await this.redisService.set(cacheKey, product, 600);
    return product;
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        ...dto,
        specs: dto.specs || {},
      },
      include: { category: true },
    });

    // Invalidate Redis cache
    await this.redisService.delPattern('products:list:*');

    // Index to Elasticsearch
    await this.searchService.indexProduct(product);

    return product;
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    const product = await this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true },
    });

    // Invalidate caches
    await this.redisService.del(`product:slug:${product.slug}`);
    await this.redisService.delPattern('products:list:*');

    // Update Elasticsearch index
    await this.searchService.indexProduct(product);

    return product;
  }

  async delete(id: string) {
    const product = await this.prisma.product.delete({
      where: { id },
    });

    await this.redisService.del(`product:slug:${product.slug}`);
    await this.redisService.delPattern('products:list:*');
    await this.searchService.removeProduct(id);

    return { success: true };
  }
}
