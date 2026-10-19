import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { SearchModule } from './modules/search/search.module';
import { MailModule } from './modules/notifications/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AddonsModule } from './modules/addons/addons.module';
import { VouchersModule } from './modules/vouchers/vouchers.module';
import { WarrantyModule } from './modules/warranty/warranty.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    PrismaModule,
    RedisModule,
    SearchModule,
    MailModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    ReviewsModule,
    AddonsModule,
    VouchersModule,
    WarrantyModule,
    OrdersModule,
    PaymentsModule,
    ShippingModule,
    AddressesModule,
    AdminModule,
  ],
})
export class AppModule {}
