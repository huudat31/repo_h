import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsOptional()
  specs?: Record<string, any>;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Mã SKU không được để trống' })
  sku: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({}, { message: 'Giá bán phải là số' })
  price: number;

  @IsOptional()
  @IsNumber()
  originalPrice?: number;

  @IsNumber({}, { message: 'Số lượng tồn kho phải là số' })
  stock: number;

  @IsArray({ message: 'Danh sách ảnh phải là mảng chuỗi URL' })
  images: string[];

  @IsString({ message: 'Danh mục không được để trống' })
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsNumber()
  warrantyMonths?: number;

  @IsOptional()
  specs?: Record<string, any>;

  @IsOptional()
  @IsArray()
  media360Urls?: string[];

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsArray()
  crossSellIds?: string[];

  @IsOptional()
  @IsArray()
  variants?: CreateVariantDto[];

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
