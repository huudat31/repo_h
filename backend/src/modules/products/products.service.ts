import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SearchService } from '../search/search.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface ProductQueryDto {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  brandSlug?: string;
  brandId?: string;
  hasInverter?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private searchService: SearchService,
  ) {}

  async findAll(query?: ProductQueryDto) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 20;
    const skip = (page - 1) * limit;

    const cacheKey = `products:list:${JSON.stringify(query || {})}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    let productIds: string[] | null = null;
    if (query?.search) {
      productIds = await this.searchService.search(query.search, query.minPrice, query.maxPrice);
    }

    const where: any = { isPublished: true };

    if (productIds && productIds.length > 0) {
      where.id = { in: productIds };
    } else if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query?.categorySlug) {
      where.category = { slug: query.categorySlug };
    } else if (query?.categoryId) {
      if (query.categoryId.length === 36 && query.categoryId.includes('-')) {
        where.categoryId = query.categoryId;
      } else {
        where.category = { slug: query.categoryId };
      }
    }

    if (query?.brandId) {
      where.brandId = query.brandId;
    } else if (query?.brandSlug) {
      where.brand = { slug: query.brandSlug };
    }

    if (query?.minPrice || query?.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = Number(query.minPrice);
      if (query.maxPrice) where.price.lte = Number(query.maxPrice);
    }

    // Lọc theo Inverter trong JSONB specs
    if (query?.hasInverter) {
      where.specs = {
        path: ['inverter'],
        string_contains: 'Có',
      };
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          reviews: {
            select: { rating: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Calculate rating score for listing cards
    const mapped = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? (p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length).toFixed(1)
          : null;
      return {
        ...p,
        avgRating: avgRating ? Number(avgRating) : null,
        reviewCount: p.reviews.length,
      };
    });

    const result = {
      data: mapped,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.redisService.set(cacheKey, result, 120);
    return result;
  }

  async getFacets(categoryId?: string) {
    const [brands, categories] = await Promise.all([
      this.prisma.brand.findMany({
        include: { _count: { select: { products: true } } },
      }),
      this.prisma.category.findMany(),
    ]);

    return {
      brands: brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug, count: b._count.products })),
      categories,
      priceRanges: [
        { label: 'Dưới 2 triệu', min: 0, max: 2000000 },
        { label: 'Từ 2 - 5 triệu', min: 2000000, max: 5000000 },
        { label: 'Từ 5 - 15 triệu', min: 5000000, max: 15000000 },
        { label: 'Trên 15 triệu', min: 15000000, max: 100000000 },
      ],
      features: [
        { key: 'inverter', label: 'Công nghệ tiết kiệm điện (Inverter)' },
      ],
    };
  }

  async findBySlug(slug: string) {
    const cacheKey = `product:slug:${slug}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        variants: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm: ${slug}`);
    }

    // Lấy danh sách phụ kiện mua kèm (cross-sells)
    let crossSells: any[] = [];
    if (product.crossSellIds && product.crossSellIds.length > 0) {
      crossSells = await this.prisma.product.findMany({
        where: { id: { in: product.crossSellIds } },
      });
    }

    const result = {
      ...product,
      crossSells,
    };

    await this.redisService.set(cacheKey, result, 300);
    return result;
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm có id: ${id}`);
    }

    return product;
  }

  async compare(productIds: string[]) {
    if (!productIds || productIds.length === 0) {
      return [];
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds.slice(0, 4) } }, // Tối đa 4 sản phẩm
      include: {
        brand: true,
        category: true,
        variants: true,
      },
    });

    // Thu thập tất cả các key thuộc tính kỹ thuật có mặt giữa các sản phẩm
    const allSpecKeysSet = new Set<string>();
    products.forEach((p) => {
      const specs = (p.specs as Record<string, any>) || {};
      Object.keys(specs).forEach((k) => allSpecKeysSet.add(k));
    });

    const allSpecKeys = Array.from(allSpecKeysSet);

    return {
      products,
      specKeys: allSpecKeys,
    };
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async create(dto: CreateProductDto) {
    let slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.name);
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const { variants, ...productData } = dto;

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        slug,
        specs: (productData.specs as any) || {},
        variants:
          variants && variants.length > 0
            ? {
                create: variants.map((v) => ({
                  name: v.name,
                  sku: v.sku,
                  price: v.price,
                  stock: v.stock,
                  specs: (v.specs as any) || {},
                })),
              }
            : undefined,
      },
      include: {
        category: true,
        brand: true,
        variants: true,
      },
    });

    try {
      await this.searchService.indexProduct(product);
    } catch {
      // Ignored
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    const { variants, ...productData } = dto;

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...(productData as any),
        ...(productData.specs ? { specs: productData.specs as any } : {}),
      },
      include: {
        category: true,
        brand: true,
        variants: true,
      },
    });

    try {
      await this.searchService.indexProduct(product);
    } catch {
      // Ignored
    }

    return product;
  }

  async delete(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    await this.prisma.product.delete({ where: { id } });
    try {
      await this.searchService.removeProduct(id);
    } catch {
      // Ignored
    }

    return { success: true, message: 'Đã xóa sản phẩm thành công' };
  }
}
