import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding expanded database for Storefront...');

  // 1. Admin & Customer Users
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

  const customer = await prisma.user.upsert({
    where: { email: 'khachhang@gmail.com' },
    update: {},
    create: {
      email: 'khachhang@gmail.com',
      fullName: 'Nguyễn Văn An',
      password: hashedPassword,
      phone: '0909123456',
      role: Role.CUSTOMER,
    },
  });

  // 2. Brands (Thương hiệu chuyên sâu)
  const brandPana = await prisma.brand.upsert({
    where: { slug: 'panasonic' },
    update: {},
    create: {
      name: 'Panasonic',
      slug: 'panasonic',
      origin: 'Nhật Bản',
      logoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80',
    },
  });

  const brandPhilips = await prisma.brand.upsert({
    where: { slug: 'philips' },
    update: {},
    create: {
      name: 'Philips',
      slug: 'philips',
      origin: 'Hà Lan',
      logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=200&q=80',
    },
  });

  const brandSunhouse = await prisma.brand.upsert({
    where: { slug: 'sunhouse' },
    update: {},
    create: {
      name: 'Sunhouse',
      slug: 'sunhouse',
      origin: 'Việt Nam',
      logoUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=200&q=80',
    },
  });

  const brandApple = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: {
      name: 'Apple',
      slug: 'apple',
      origin: 'Hoa Kỳ',
      logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&q=80',
    },
  });

  // 3. Categories (Điện lạnh, Gia dụng, Thiết bị số, Phụ kiện)
  const catDienLanh = await prisma.category.upsert({
    where: { slug: 'dien-lanh' },
    update: {},
    create: {
      name: 'Điện Lạnh (Điều Hòa & Máy Giặt)',
      slug: 'dien-lanh',
      description: 'Máy giặt, điều hòa không khí, tủ lạnh tiết kiệm điện Inverter',
    },
  });

  const catGiaDung = await prisma.category.upsert({
    where: { slug: 'gia-dung' },
    update: {},
    create: {
      name: 'Gia Dụng Nhà Bếp',
      slug: 'gia-dung',
      description: 'Nồi chiên không dầu, nồi cơm điện cao tần, lò vi sóng',
    },
  });

  const catPhuKien = await prisma.category.upsert({
    where: { slug: 'phu-kien' },
    update: {},
    create: {
      name: 'Phụ Kiện Mua Kèm',
      slug: 'phu-kien',
      description: 'Chân đế máy giặt, nước giặt xả, ống đồng điều hòa',
    },
  });

  // 4. Products: Phụ kiện mua kèm (Cross-sell items)
  const pkChanDe = await prisma.product.upsert({
    where: { slug: 'chan-de-may-giat-chong-rung' },
    update: {},
    create: {
      name: 'Chân Đế Máy Giặt Đa Năng Chống Rung Inox Cao Cấp',
      slug: 'chan-de-may-giat-chong-rung',
      sku: 'PK-CHANDE-01',
      price: 249000,
      originalPrice: 350000,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'],
      categoryId: catPhuKien.id,
      specs: { chat_lieu: 'Inox 304 kết hợp đế cao su giảm chấn', tai_trong: '300 kg' },
    },
  });

  const pkNuocGiat = await prisma.product.upsert({
    where: { slug: 'nuoc-giat-chuyen-dung-may-giat-cua-truoc' },
    update: {},
    create: {
      name: 'Nước Giặt Chuyên Dụng Cửa Trước OMO Matic 3.6kg',
      slug: 'nuoc-giat-chuyen-dung-may-giat-cua-truoc',
      sku: 'PK-NUOCGIAT-OMO',
      price: 189000,
      stock: 200,
      images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'],
      categoryId: catPhuKien.id,
      specs: { dung_tich: '3.6 kg', mui_huong: 'Hương thơm thanh mát Comfort' },
    },
  });

  // 5. Products chính có specs, Inverter, dung tích, công suất, variants, media 360
  // SP 1: Máy giặt sấy Panasonic Inverter
  const pMayGiatPana = await prisma.product.upsert({
    where: { slug: 'may-giat-say-panasonic-inverter-10kg' },
    update: {},
    create: {
      name: 'Máy Giặt Sấy Panasonic Inverter 10.5 kg NA-V105FR1BV',
      slug: 'may-giat-say-panasonic-inverter-10kg',
      sku: 'PANA-NA-V105FR1BV',
      shortDescription: 'Công nghệ giặt nước nóng diệt khuẩn Blue Ag+, sấy tiện ích Hybrid Dry, tiết kiệm điện 3DI Inverter',
      description: 'Máy giặt sấy Panasonic thế hệ mới kết hợp công nghệ sấy nâng niu quần áo, cảm biến 3Di Inverter thông minh đo khối lượng đồ giặt tối ưu điện nước.',
      price: 16490000,
      originalPrice: 19990000,
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      ],
      media360Urls: [
        'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      categoryId: catDienLanh.id,
      brandId: brandPana.id,
      warrantyMonths: 24,
      crossSellIds: [pkChanDe.id, pkNuocGiat.id],
      specs: {
        thuong_hieu: 'Panasonic',
        xuat_xu: 'Việt Nam',
        khoi_luong_giat: '10.5 kg (Giặt) / 6.0 kg (Sấy)',
        cong_nghe_tiet_kiem: '3Di Inverter & Cảm biến Econavi',
        inverter: 'Có (Inverter tiết kiệm 42% điện năng)',
        dong_co: 'Truyền động curoa êm ái',
        cong_suat: '1850 W',
        toc_do_vat: '1400 vòng/phút',
        kich_thuoc: 'Rộng 59.6 cm - Sâu 60 cm - Cao 84.5 cm (Trọng lượng 70kg)',
        tinh_nang_dac_biet: 'Giặt diệt khuẩn nước nóng 90°C Blue Ag+, Tự vệ sinh lồng giặt Auto Tub Care',
        thoi_gian_bao_hanh: '24 tháng toàn máy, Động cơ 12 năm',
      },
      variants: {
        create: [
          { name: 'Xám Đen Titan (10.5 kg)', sku: 'PANA-V105-TITAN', price: 16490000, stock: 20 },
          { name: 'Trắng Pha Lê (9.5 kg)', sku: 'PANA-V095-WHITE', price: 14490000, stock: 15 },
        ],
      },
    },
  });

  // SP 2: Nồi chiên không dầu Philips
  const pNoiChienPhilips = await prisma.product.upsert({
    where: { slug: 'noi-chien-khong-dau-philips-xxl-7-2l' },
    update: {},
    create: {
      name: 'Nồi Chiên Không Dầu Điện Tử Philips Airfryer XXL 7.2 Lít HD9285',
      slug: 'noi-chien-khong-dau-philips-xxl-7-2l',
      sku: 'PHILIPS-HD9285',
      shortDescription: 'Công nghệ Rapid Air giảm đến 90% lượng chất béo, dung tích siêu lớn chiên gà nguyên con',
      description: 'Nồi chiên Philips Airfryer XXL thế hệ mới kết nối ứng dụng NutriU, 16 chức năng nấu nướng đa dạng, lòng nồi phủ chống dính cao cấp dễ vệ sinh.',
      price: 4290000,
      originalPrice: 5690000,
      stock: 45,
      images: [
        'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catGiaDung.id,
      brandId: brandPhilips.id,
      warrantyMonths: 24,
      specs: {
        thuong_hieu: 'Philips',
        xuat_xu: 'Ba Lan',
        dung_tich: '7.2 Lít (Giỏ chiên 1.4 kg)',
        cong_suat: '2000 W',
        cong_nghe_chien: 'Rapid Air xoáy nhiệt tuần hoàn 360 độ',
        nhiet_do: '40 - 200°C',
        hen_gio: 'Lên đến 60 phút',
        bang_dieu_khien: 'Cảm ứng điện tử hiển thị LED, có kết nối Wi-Fi app NutriU',
        kich_thuoc: '41 x 30 x 33 cm (Trọng lượng 6.2 kg)',
        thoi_gian_bao_hanh: '24 tháng chính hãng toàn cầu',
      },
      variants: {
        create: [
          { name: 'Dung tích 7.2L - Màu Đen Đồng', sku: 'PHILIPS-72L-BLACK', price: 4290000, stock: 25 },
          { name: 'Dung tích 5.0L - Màu Đen', sku: 'PHILIPS-50L-BLACK', price: 2990000, stock: 20 },
        ],
      },
    },
  });

  // SP 3: Nồi chiên Sunhouse (để đối chiếu so sánh cùng phân khúc)
  const pNoiChienSunhouse = await prisma.product.upsert({
    where: { slug: 'noi-chien-khong-dau-sunhouse-mama-6l' },
    update: {},
    create: {
      name: 'Nồi Chiên Không Dầu Sunhouse Mama 6.0 Lít SHD4088',
      slug: 'noi-chien-khong-dau-sunhouse-mama-6l',
      sku: 'SUNHOUSE-SHD4088',
      shortDescription: 'Cửa kính trong suốt quan sát thực phẩm, thanh nhiệt đối lưu siêu tốc',
      description: 'Nồi chiên Sunhouse Mama trang bị đèn chiếu khoang nướng, nắp kính cường lực cao cấp dễ quan sát độ chín thực phẩm mà không cần mở nắp.',
      price: 1990000,
      originalPrice: 2890000,
      stock: 60,
      images: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catGiaDung.id,
      brandId: brandSunhouse.id,
      warrantyMonths: 12,
      specs: {
        thuong_hieu: 'Sunhouse',
        xuat_xu: 'Việt Nam',
        dung_tich: '6.0 Lít',
        cong_suat: '1800 W',
        cong_nghe_chien: 'Rapid Air đối lưu nhiệt',
        nhiet_do: '80 - 200°C',
        hen_gio: '60 phút',
        bang_dieu_khien: 'Cảm ứng hiện đại kèm núm xoay',
        thoi_gian_bao_hanh: '12 tháng chính hãng',
      },
    },
  });

  // SP 4: Điều hòa Panasonic Inverter 1.5 HP
  await prisma.product.upsert({
    where: { slug: 'dieu-hoa-panasonic-inverter-1-5-hp' },
    update: {},
    create: {
      name: 'Điều Hòa Panasonic Inverter 1.5 HP CU/CS-XU12ZKH-8',
      slug: 'dieu-hoa-panasonic-inverter-1-5-hp',
      sku: 'PANA-XU12ZKH',
      shortDescription: 'Lọc khí nanoe™ X diệt khuẩn khử mùi thế hệ 3, làm lạnh siêu tốc iAUTO-X, Inverter tiết kiệm điện 65%',
      description: 'Dòng điều hòa cao cấp nhất của Panasonic với công nghệ nanoe X chủ động bảo vệ sức khỏe suốt 24 giờ kể cả khi tắt máy lạnh.',
      price: 15890000,
      originalPrice: 17590000,
      stock: 40,
      images: [
        'https://images.unsplash.com/photo-1614633833026-06203530c33a?auto=format&fit=crop&w=800&q=80',
      ],
      categoryId: catDienLanh.id,
      brandId: brandPana.id,
      warrantyMonths: 12,
      specs: {
        thuong_hieu: 'Panasonic',
        xuat_xu: 'Malaysia',
        cong_suat_lam_lanh: '1.5 HP (11.900 BTU)',
        cong_nghe_tiet_kiem: 'Inverter + Cảm biến ECO tích hợp trí tuệ nhân tạo A.I',
        inverter: 'Có (Inverter cao cấp nhãn năng lượng 5 sao CSPF 6.8)',
        cong_nghe_loc_khi: 'nanoe™ X thế hệ thứ 3 diệt vi khuẩn, nấm mốc và khử mùi',
        moi_chat_lam_lanh: 'Gas R32 thân thiện môi trường',
        pham_vi_hieu_qua: 'Từ 15 - 20 m² (từ 40 đến 60 m³)',
        thoi_gian_bao_hanh: '12 tháng toàn máy, Máy nén 7 năm',
      },
    },
  });

  // 6. Dịch vụ đi kèm (Service Addons)
  await prisma.serviceAddon.upsert({
    where: { code: 'INSTALL_HOME' },
    update: {},
    create: {
      name: 'Dịch vụ giao hàng & lắp đặt tận nơi',
      code: 'INSTALL_HOME',
      price: 250000,
      description: 'Kỹ thuật viên chuyên nghiệp giao và lắp đặt hoàn thiện, hướng dẫn sử dụng tại nhà.',
    },
  });

  await prisma.serviceAddon.upsert({
    where: { code: 'WARRANTY_EXT_24M' },
    update: {},
    create: {
      name: 'Gói bảo hành vàng mở rộng thêm 12 tháng',
      code: 'WARRANTY_EXT_24M',
      price: 390000,
      description: 'Kéo dài thời hạn bảo hành chính hãng thêm 12 tháng, miễn phí 100% công sửa chữa và linh kiện.',
    },
  });

  // 7. Vouchers
  await prisma.voucher.upsert({
    where: { code: 'GIAM50K' },
    update: {},
    create: {
      code: 'GIAM50K',
      title: 'Giảm ngay 50.000đ cho đơn từ 1.000.000đ',
      discountType: 'FIXED',
      discountValue: 50000,
      minOrderValue: 1000000,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.voucher.upsert({
    where: { code: 'INVERTER500' },
    update: {},
    create: {
      code: 'INVERTER500',
      title: 'Giảm 500.000đ cho các dòng máy Inverter tiết kiệm điện',
      discountType: 'FIXED',
      discountValue: 500000,
      minOrderValue: 10000000,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });

  // 8. Đánh giá thực tế kèm ảnh (Product Reviews)
  await prisma.productReview.create({
    data: {
      productId: pMayGiatPana.id,
      userId: customer.id,
      authorName: 'Nguyễn Văn An',
      rating: 5,
      comment: 'Máy giặt cực kỳ êm ái, sấy xong đồ ấm và thơm lừng không bị nhăn. Đáng tiền từng xu!',
      images: [
        'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
      ],
      isVerified: true,
    },
  });

  await prisma.productReview.create({
    data: {
      productId: pNoiChienPhilips.id,
      authorName: 'Trần Thị Thu Trang',
      rating: 5,
      comment: 'Lòng nồi siêu to, nướng gà 2kg thoải mái. Cảm ứng nhạy và vệ sinh rất nhanh chóng.',
      images: [
        'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80',
      ],
      isVerified: true,
    },
  });

  // 9. Dữ liệu Bảo hành điện tử mẫu (E-Warranty)
  await prisma.warrantyRecord.upsert({
    where: { serialNumber: 'SN-PANA-2026-9812' },
    update: {},
    create: {
      serialNumber: 'SN-PANA-2026-9812',
      productId: pMayGiatPana.id,
      customerPhone: '0901234567',
      customerName: 'Nguyễn Văn An',
      startDate: new Date('2026-01-15'),
      endDate: new Date('2028-01-15'),
      status: 'ACTIVE',
    },
  });

  await prisma.warrantyRecord.upsert({
    where: { serialNumber: 'SN-PHILIPS-HD9285-4421' },
    update: {},
    create: {
      serialNumber: 'SN-PHILIPS-HD9285-4421',
      productId: pNoiChienPhilips.id,
      customerPhone: '0909123456',
      customerName: 'Trần Thị Thu Trang',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2028-03-01'),
      status: 'ACTIVE',
    },
  });

  console.log('✅ Seeding completed with household & electronic appliances, reviews, addons, vouchers & warranty records!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
