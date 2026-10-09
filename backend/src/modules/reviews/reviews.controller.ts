import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ReviewsService, CreateReviewDto } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  async findByProduct(
    @Param('productId') productId: string,
    @Query('hasImagesOnly') hasImagesOnly?: string,
  ) {
    return this.reviewsService.findByProduct(productId, hasImagesOnly === 'true');
  }

  @Post()
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.create(dto);
  }
}
