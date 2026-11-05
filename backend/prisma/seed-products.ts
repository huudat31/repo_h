import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import * as path from 'path';
import * as fs from 'fs';

const dataFilePath = path.join(__dirname, 'data/curated-products.json');
const { CURATED_PRODUCTS, CURATED_CATEGORIES } = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

const prisma = new PrismaClient();

const BRANDS_METADATA: Record<string, { name: string; origin: string; logoUrl: string }> = {
  apple: { name: 'Apple', origin: 'Hoa Kỳ', logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&q=80' },
  samsung: { name: 'Samsung', origin: 'Hàn Quốc', logoUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&q=80' },
  sony: { name: 'Sony', origin: 'Nhật Bản', logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&q=80' },
  lg: { name: 'LG', origin: 'Hàn Quốc', logoUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80' },
  panasonic: { name: 'Panasonic', origin: 'Nhật Bản', logoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&q=80' },
  daikin: { name: 'Daikin', origin: 'Nhật Bản', logoUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=200&q=80' },
  'asus-rog': { name: 'ASUS ROG', origin: 'Đài Loan', logoUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&q=80' },
  philips: { name: 'Philips', origin: 'Hà Lan', logoUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=200&q=80' },
  dyson: { name: 'Dyson', origin: 'Vương Quốc Anh', logoUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80' },
  bosch: { name: 'Bosch', origin: 'Đức', logoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&q=80' },
  sunhouse: { name: 'Sunhouse', origin: 'Việt Nam', logoUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200&q=80' },
  ecovacs: { name: 'Ecovacs', origin: 'Trung Quốc', logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80' },
  cuckoo: { name: 'Cuckoo', origin: 'Hàn Quốc', logoUrl: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=200&q=80' },
  logitech: { name: 'Logitech', origin: 'Thụy Sĩ', logoUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&q=80' },
  xiaomi: { name: 'Xiaomi', origin: 'Trung Quốc', logoUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80' },
  google: { name: 'Google', origin: 'Hoa Kỳ', logoUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80' },
  lenovo: { name: 'Lenovo', origin: 'Trung Quốc', logoUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&q=80' },
  dell: { name: 'Dell', origin: 'Hoa Kỳ', logoUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&q=80' },
  acer: { name: 'Acer', origin: 'Đài Loan', logoUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&q=80' },
  roborock: { name: 'Roborock', origin: 'Trung Quốc', logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80' },
  aqara: { name: 'Aqara', origin: 'Trung Quốc', logoUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=200&q=80' },
  marshall: { name: 'Marshall', origin: 'Vương Quốc Anh', logoUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&q=80' },
  ugreen: { name: 'UGREEN', origin: 'Trung Quốc', logoUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&q=80' },
};

async function main() {
  console.log('🚀 Đồng bộ toàn bộ 42 sản phẩm cao cấp vào cơ sở dữ liệu PostgreSQL...');

  // 1. Đồng bộ Categories
  const categoryMap: Record<string, string> = {};
  for (const cat of CURATED_CATEGORIES) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: { name: cat.name, slug: cat.slug, description: cat.description },
    });
    categoryMap[cat.slug] = upserted.id;
  }
  console.log(`✅ Đã đồng bộ ${Object.keys(categoryMap).length} danh mục ngành hàng.`);

  // 2. Đồng bộ Brands
  const brandMap: Record<string, string> = {};
  for (const [slug, meta] of Object.entries(BRANDS_METADATA)) {
    const upserted = await prisma.brand.upsert({
      where: { slug },
      update: { name: meta.name, origin: meta.origin, logoUrl: meta.logoUrl },
      create: { name: meta.name, slug, origin: meta.origin, logoUrl: meta.logoUrl },
    });
    brandMap[slug] = upserted.id;
  }
  console.log(`✅ Đã đồng bộ ${Object.keys(brandMap).length} thương hiệu chính hãng.`);

  // 3. Đồng bộ 42 Sản Phẩm
  let count = 0;
  for (const p of CURATED_PRODUCTS) {
    const catId = categoryMap[p.category.slug];
    const bId = p.brand ? brandMap[p.brand.slug] : undefined;

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        sku: p.sku,
        shortDescription: p.shortDescription || p.description?.slice(0, 150),
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice || null,
        stock: p.stock || 20,
        categoryId: catId,
        brandId: bId || null,
        warrantyMonths: p.warrantyMonths || 12,
        images: p.images || [],
        specs: p.specs || {},
      },
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        shortDescription: p.shortDescription || p.description?.slice(0, 150),
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice || null,
        stock: p.stock || 20,
        categoryId: catId,
        brandId: bId || null,
        warrantyMonths: p.warrantyMonths || 12,
        images: p.images || [],
        specs: p.specs || {},
      },
    });

    count++;
    console.log(`  [${count}/${CURATED_PRODUCTS.length}] Upserted: ${p.name}`);
  }

  // 4. Xóa Cache Redis
  try {
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    const keys = await redis.keys('products:*');
    const slugKeys = await redis.keys('product:*');
    const allKeys = [...keys, ...slugKeys];
    if (allKeys.length > 0) {
      await redis.del(...allKeys);
      console.log(`🧹 Đã xóa ${allKeys.length} cache key trên Redis.`);
    }
    await redis.quit();
  } catch (err: any) {
    console.log('⚠️ Không thể kết nối Redis để xóa cache:', err.message);
  }

  const totalProducts = await prisma.product.count();
  console.log(`🎉 HOÀN TẤT ĐỒNG BỘ! Tổng số sản phẩm trong cơ sở dữ liệu: ${totalProducts}`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
