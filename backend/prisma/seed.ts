import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin & Customer
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@techstore.vn' },
    update: {},
    create: {
      email: 'admin@techstore.vn',
      fullName: 'System Administrator',
      password: hashedPassword,
      phone: '0901234567',
      role: Role.ADMIN,
    },
  });

  // Create Categories
  const catPhone = await prisma.category.upsert({
    where: { slug: 'dien-thoai' },
    update: {},
    create: {
      name: 'Điện thoại thông minh',
      slug: 'dien-thoai',
      description: 'Smartphone chính hãng, bảo hành toàn quốc',
    },
  });

  const catLaptop = await prisma.category.upsert({
    where: { slug: 'laptop' },
    update: {},
    create: {
      name: 'Laptop & Máy tính xách tay',
      slug: 'laptop',
      description: 'Laptop gaming, văn phòng, đồ họa cao cấp',
    },
  });

  // Create Products with Flexible JSONB Specifications (Thuộc tính kỹ thuật linh hoạt)
  await prisma.product.upsert({
    where: { slug: 'iphone-15-pro-max-256gb' },
    update: {},
    create: {
      name: 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên',
      slug: 'iphone-15-pro-max-256gb',
      sku: 'IPHONE-15PM-256-NAT',
      shortDescription: 'Chip Apple A17 Pro siêu mạnh, khung vỏ Titan chuẩn hàng không vũ trụ',
      description: 'iPhone 15 Pro Max đem đến thiết kế khung viền titan siêu bền nhẹ, hệ thống camera 5x telephoto chuyên nghiệp và cổng sạc USB-C tốc độ cao.',
      price: 29490000,
      originalPrice: 34990000,
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catPhone.id,
      specs: {
        man_hinh: '6.7 inch, Super Retina XDR OLED, 120Hz ProMotion',
        cpu: 'Apple A17 Pro (3nm)',
        ram: '8 GB',
        bo_nho_trong: '256 GB',
        camera_sau: 'Chính 48MP + Góc siêu rộng 12MP + Tele 12MP (Zoom quang 5x)',
        camera_truoc: '12MP TrueDepth',
        pin_sac: '4.422 mAh, Sạc nhanh 20W, MagSafe 15W',
        trong_luong: '221 g',
        chat_lieu: 'Khung viền Titan, mặt lưng kính nhám',
        ket_noi: '5G, Wi-Fi 6E, USB-C 3.0',
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: 'macbook-pro-14-m3-pro' },
    update: {},
    create: {
      name: 'MacBook Pro 14 inch M3 Pro (18GB RAM / 512GB SSD)',
      slug: 'macbook-pro-14-m3-pro',
      sku: 'MBP-14-M3PRO-18-512',
      shortDescription: 'Hiệu năng đột phá với chip M3 Pro, màn hình Liquid Retina XDR sáng 1600 nits',
      description: 'MacBook Pro 14 inch mới nhất trang bị vi xử lý Apple M3 Pro 11-core CPU, 14-core GPU cùng thời lượng pin lên đến 18 giờ liên tục.',
      price: 49990000,
      originalPrice: 52990000,
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catLaptop.id,
      specs: {
        cpu: 'Apple M3 Pro (11-core CPU, 14-core GPU)',
        ram: '18 GB Unified Memory',
        o_cung: '512 GB SSD siêu tốc',
        man_hinh: '14.2 inch Liquid Retina XDR (3024 x 1964), 120Hz ProMotion',
        cong_ket_noi: '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3, Jack 3.5mm',
        pin: '70Wh, sạc nhanh 70W USB-C',
        trong_luong: '1.61 kg',
      },
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
