import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString({ message: 'Tên người nhận phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên người nhận không được để trống' })
  recipientName: string;

  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Tỉnh/Thành phố không được để trống' })
  provinceName: string;

  @IsNumber()
  provinceId: number;

  @IsString()
  @IsNotEmpty({ message: 'Quận/Huyện không được để trống' })
  districtName: string;

  @IsNumber()
  districtId: number;

  @IsString()
  @IsNotEmpty({ message: 'Phường/Xã không được để trống' })
  wardName: string;

  @IsString()
  wardCode: string;

  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ cụ thể không được để trống' })
  detailAddress: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
