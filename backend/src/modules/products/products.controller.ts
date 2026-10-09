import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('facets')
  async getFacets(@Query('categoryId') categoryId?: string) {
    return this.productsService.getFacets(categoryId);
  }

  @Get('compare')
  async compare(@Query('ids') ids: string) {
    const productIds = ids ? ids.split(',').filter(Boolean) : [];
    return this.productsService.compare(productIds);
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('brandSlug') brandSlug?: string,
    @Query('hasInverter') hasInverter?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.productsService.findAll({
      search,
      categoryId,
      brandSlug,
      hasInverter: hasInverter === 'true',
      minPrice,
      maxPrice,
      page,
      limit,
    });
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
