import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentProvider, ShippingCarrier } from '@prisma/client';

export class OrderShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  provinceName: string;

  @IsNumber()
  provinceId: number;

  @IsString()
  @IsNotEmpty()
  districtName: string;

  @IsNumber()
  districtId: number;

  @IsString()
  @IsNotEmpty()
  wardName: string;

  @IsString()
  wardCode: string;

  @IsString()
  @IsNotEmpty()
  detailAddress: string;
}

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  variantId?: string;
}

export class AddonItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên người nhận không được để trống' })
  recipientName: string;

  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  recipientPhone: string;

  @IsObject()
  @ValidateNested()
  @Type(() => OrderShippingAddressDto)
  shippingAddress: OrderShippingAddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsEnum(PaymentProvider)
  paymentProvider: PaymentProvider;

  @IsOptional()
  @IsEnum(ShippingCarrier)
  shippingCarrier?: ShippingCarrier;

  @IsOptional()
  @IsNumber()
  shippingFee?: number;

  @IsOptional()
  @IsString()
  voucherCode?: string;

  @IsOptional()
  @IsArray()
  selectedAddons?: AddonItemDto[];

  @IsOptional()
  @IsNumber()
  addonAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
