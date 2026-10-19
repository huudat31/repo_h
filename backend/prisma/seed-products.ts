import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();

async function seedProducts() {
  console.log('🚀 Bắt đầu thêm danh sách sản phẩm mẫu phong phú vào hệ thống...');

  // 1. Khởi tạo / Cập nhật Thương hiệu (Brands)
  const brandsData = [
    { name: 'Apple', slug: 'apple', origin: 'Hoa Kỳ', logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&q=80' },
    { name: 'Samsung', slug: 'samsung', origin: 'Hàn Quốc', logoUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&q=80' },
    { name: 'Sony', slug: 'sony', origin: 'Nhật Bản', logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&q=80' },
    { name: 'LG', slug: 'lg', origin: 'Hàn Quốc', logoUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80' },
    { name: 'Panasonic', slug: 'panasonic', origin: 'Nhật Bản', logoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&q=80' },
    { name: 'Daikin', slug: 'daikin', origin: 'Nhật Bản', logoUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=200&q=80' },
    { name: 'ASUS ROG', slug: 'asus-rog', origin: 'Đài Loan', logoUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&q=80' },
    { name: 'Philips', slug: 'philips', origin: 'Hà Lan', logoUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=200&q=80' },
    { name: 'Dyson', slug: 'dyson', origin: 'Vương Quốc Anh', logoUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80' },
    { name: 'Bosch', slug: 'bosch', origin: 'Đức', logoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&q=80' },
    { name: 'Sunhouse', slug: 'sunhouse', origin: 'Việt Nam', logoUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200&q=80' },
    { name: 'Ecovacs', slug: 'ecovacs', origin: 'Trung Quốc', logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80' },
    { name: 'Cuckoo', slug: 'cuckoo', origin: 'Hàn Quốc', logoUrl: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=200&q=80' },
    { name: 'Logitech', slug: 'logitech', origin: 'Thụy Sĩ', logoUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&q=80' },
  ];

  const brandMap: Record<string, string> = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, origin: b.origin, logoUrl: b.logoUrl },
      create: b,
    });
    brandMap[b.slug] = brand.id;
  }

  // 2. Khởi tạo / Cập nhật Danh mục (Categories)
  const categoriesData = [
    {
      name: 'Điện Thoại & Máy Tính Bảng',
      slug: 'dien-thoai-tablet',
      description: 'Smartphone cao cấp, iPhone, Samsung Galaxy, iPad chính hãng',
    },
    {
      name: 'Laptop Gaming & Đồ Họa',
      slug: 'laptop-gaming',
      description: 'Laptop hiệu năng cao cho game thủ, lập trình viên và thiết kế đồ họa',
    },
    {
      name: 'Điện Lạnh (Điều Hòa & Tủ Lạnh)',
      slug: 'dien-lanh',
      description: 'Máy giặt, điều hòa không khí, tủ lạnh công nghệ tiết kiệm điện Inverter',
    },
    {
      name: 'Gia Dụng Nhà Bếp',
      slug: 'gia-dung',
      description: 'Nồi chiên không dầu, nồi cơm điện cao tần, lò vi sóng, máy rửa bát',
    },
    {
      name: 'Tivi & Âm Thanh Cao Cấp',
      slug: 'tivi-am-thanh',
      description: 'Tivi OLED, QLED 4K, loa thanh Soundbar, dàn âm thanh rạp hát tại gia',
    },
    {
      name: 'Nhà Thông Minh & Robot',
      slug: 'smart-home',
      description: 'Robot hút bụi lau nhà tự giặt giẻ, máy lọc không khí thông minh',
    },
    {
      name: 'Phụ Kiện Công Nghệ Chính Hãng',
      slug: 'phu-kien',
      description: 'Tai nghe Bluetooth, chuột không dây, củ sạc nhanh GaN, bàn phím cơ',
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    categoryMap[c.slug] = cat.id;
  }

  // 3. Danh sách sản phẩm chi tiết
  const productsList = [
    // --- SMARTPHONES & TABLETS ---
    {
      name: 'iPhone 16 Pro Max 256GB - Titan Tự Nhiên (Chính Hãng VN/A)',
      slug: 'iphone-16-pro-max-256gb-titan',
      sku: 'IPHONE-16PM-256GB',
      shortDescription: 'Khung viền Titan cấp 5, nút Điều khiển Camera hoàn toàn mới, chip Apple A18 Pro hỗ trợ Apple Intelligence',
      description: 'iPhone 16 Pro Max mang đến bước đột phá với viền màn hình mỏng nhất lịch sử Apple, màn hình Super Retina XDR 6.9 inch 120Hz ProMotion, hệ thống camera 48MP Fusion và thời lượng pin vượt bậc lên đến 33 giờ xem video liên tục.',
      price: 34490000,
      originalPrice: 36990000,
      stock: 45,
      categoryId: categoryMap['dien-thoai-tablet'],
      brandId: brandMap['apple'],
      warrantyMonths: 12,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Apple',
        xuat_xu: 'Trung Quốc',
        man_hinh: '6.9 inch OLED Super Retina XDR, 120Hz ProMotion, 2000 nits',
        cpu: 'Apple A18 Pro (6 nhân CPU, 6 nhân GPU, 16 nhân NPU AI)',
        bo_nho_trong: '256 GB NVMe',
        ram: '8 GB LPDDR5X',
        camera_sau: 'Chính 48MP + Góc rộng 48MP + Tele 5X 12MP zoom quang',
        camera_truoc: '12MP TrueDepth tự động lấy nét',
        pin: '4685 mAh, sạc nhanh MagSafe 25W và Type-C PD 3.0',
        trong_luong: '227 g (Khung Titan chuẩn hàng không vũ trụ)',
        tinh_nang: 'Nút Điều khiển Camera (Camera Control), nút Tác Vụ (Action Button)',
        thoi_gian_bao_hanh: '12 tháng chính hãng Apple Care Việt Nam',
      },
      variants: [
        { name: 'Titan Tự Nhiên (256GB)', sku: 'IP16PM-256-NAT', price: 34490000, stock: 25 },
        { name: 'Titan Sa Mạc (512GB)', sku: 'IP16PM-512-DES', price: 40990000, stock: 15 },
        { name: 'Titan Đen (1TB)', sku: 'IP16PM-1TB-BLK', price: 46990000, stock: 5 },
      ],
      reviews: [
        { authorName: 'Hoàng Minh Tuấn', rating: 5, comment: 'Máy cầm rất đầm tay, viền màn hình siêu mỏng, nút chụp ảnh mới dùng quay phim cực tiện!' },
        { authorName: 'Đặng Ngọc Lan', rating: 5, comment: 'Màu Titan tự nhiên sang chảnh, pin dùng từ sáng tới tối muộn còn tận 40%.' },
      ],
    },
    {
      name: 'Samsung Galaxy S24 Ultra 5G 12GB/256GB - Quyền Năng Galaxy AI',
      slug: 'samsung-galaxy-s24-ultra-5g-256gb',
      sku: 'SAM-S24U-256GB',
      shortDescription: 'Khung viền Titan phẳng, bút S-Pen tích hợp, màn hình chống chói Dynamic AMOLED 2X và trí tuệ nhân tạo Galaxy AI',
      description: 'Galaxy S24 Ultra khai mở kỷ nguyên AI di động với tính năng Khoanh tròn để tìm kiếm (Circle to Search), Phiên dịch cuộc gọi trực tiếp hai chiều, bộ vi xử lý Snapdragon 8 Gen 3 for Galaxy và camera 200MP siêu zoom 100x.',
      price: 26990000,
      originalPrice: 33990000,
      stock: 38,
      categoryId: categoryMap['dien-thoai-tablet'],
      brandId: brandMap['samsung'],
      warrantyMonths: 12,
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Samsung',
        xuat_xu: 'Việt Nam',
        man_hinh: '6.8 inch QHD+ Dynamic AMOLED 2X, 120Hz, phủ kính Corning Gorilla Armor chống chói 75%',
        cpu: 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
        ram: '12 GB LPDDR5X',
        bo_nho_trong: '256 GB UFS 4.0',
        camera_sau: '200MP góc rộng + 50MP Periscope 5x + 10MP Tele 3x + 12MP UltraWide',
        pin: '5000 mAh, sạc nhanh siêu tốc 45W',
        phu_kien_kem_theo: 'Bút S-Pen độ trễ 2.8ms cắm trong thân máy',
        thoi_gian_bao_hanh: '12 tháng chính hãng Samsung Vina',
      },
      variants: [
        { name: 'Xám Titan (256GB)', sku: 'S24U-256-GRAY', price: 26990000, stock: 20 },
        { name: 'Đen Titan (512GB)', sku: 'S24U-512-BLACK', price: 30490000, stock: 18 },
      ],
      reviews: [
        { authorName: 'Lê Quốc Bảo', rating: 5, comment: 'Bút S-Pen ghi chú công việc cực kỳ chuẩn xác, tính năng khoanh tìm kiếm AI rất thông minh.' },
      ],
    },
    {
      name: 'iPad Pro M4 11 inch Wi-Fi 256GB - Màn Hình Ultra Retina XDR Tandem OLED',
      slug: 'ipad-pro-m4-11-inch-256gb-wifi',
      sku: 'IPAD-PRO-M4-11',
      shortDescription: 'Độ mỏng kỷ lục 5.3mm, chip Apple M4 thế hệ mới với công nghệ hiển thị 2 lớp OLED xếp chồng đỉnh cao',
      description: 'iPad Pro thế hệ mới mỏng nhất lịch sử Apple, trang bị chip M4 sản xuất trên tiến trình 3nm thế hệ thứ hai cho hiệu năng đồ họa ray-tracing đỉnh cao và hỗ trợ bút Apple Pencil Pro có cảm ứng bóp Haptic.',
      price: 27990000,
      originalPrice: 29990000,
      stock: 22,
      categoryId: categoryMap['dien-thoai-tablet'],
      brandId: brandMap['apple'],
      warrantyMonths: 12,
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Apple',
        man_hinh: '11.0 inch Tandem OLED Ultra Retina XDR, độ sáng đỉnh 1600 nits, ProMotion 10-120Hz',
        cpu: 'Apple M4 (9 nhân CPU, 10 nhân GPU, NPU 38 nghìn tỷ phép tính/giây)',
        ram: '8 GB Unified Memory',
        bo_nho_trong: '256 GB',
        trong_luong: '444 g, độ dày chỉ 5.3 mm',
        thoi_gian_bao_hanh: '12 tháng chính hãng',
      },
      variants: [
        { name: 'Bạc Space (Silver) 256GB', sku: 'IPAD-M4-11-SIL', price: 27990000, stock: 12 },
        { name: 'Đen Không Gian (Space Black) 256GB', sku: 'IPAD-M4-11-BLK', price: 27990000, stock: 10 },
      ],
    },

    // --- LAPTOPS & COMPUTING ---
    {
      name: 'MacBook Pro 14 M3 Pro (18GB RAM / 512GB SSD) - Màu Space Black',
      slug: 'macbook-pro-14-m3-pro-18gb-512gb',
      sku: 'MBP-14-M3PRO-18-512',
      shortDescription: 'Vỏ nhôm Anodized chống bám vân tay, chip Apple M3 Pro 11 nhân CPU, thời lượng pin lên đến 18 giờ',
      description: 'MacBook Pro 14 inch M3 Pro mang lại hiệu suất chuyên nghiệp phi thường cho lập trình viên, kỹ sư đồ họa và dựng phim với màn hình Liquid Retina XDR 120Hz rực rỡ và cổng kết nối HDMI 8K, khe thẻ SDXC, sạc MagSafe 3.',
      price: 48990000,
      originalPrice: 52990000,
      stock: 18,
      categoryId: categoryMap['laptop-gaming'],
      brandId: brandMap['apple'],
      warrantyMonths: 12,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Apple',
        man_hinh: '14.2 inch Liquid Retina XDR (3024 x 1964), 120Hz ProMotion, 1600 nits HDR',
        cpu: 'Apple M3 Pro (11 nhân CPU, 14 nhân GPU)',
        ram: '18 GB Unified Memory băng thông 150 GB/s',
        o_cung: '512 GB SSD NVMe siêu tốc độ đọc 5000 MB/s',
        pin: '70 Wh, kèm củ sạc 70W USB-C',
        cong_ket_noi: '3x Thunderbolt 4 / USB-C, HDMI, Khe thẻ SDXC, Jack 3.5mm, MagSafe 3',
        trong_luong: '1.61 kg nhôm nguyên khối',
        thoi_gian_bao_hanh: '12 tháng chính hãng',
      },
      variants: [
        { name: 'Space Black (18GB / 512GB)', sku: 'MBP14-M3P-BLK', price: 48990000, stock: 10 },
        { name: 'Silver (18GB / 1TB)', sku: 'MBP14-M3P-1TB', price: 54990000, stock: 8 },
      ],
      reviews: [
        { authorName: 'Trần Vũ Hoàng', rating: 5, comment: 'Biên dịch code nhanh khủng khiếp, quạt gần như không bao giờ phải quay, pin dùng cả ngày làm việc!' },
      ],
    },

    // --- ĐIỆN LẠNH (ĐIỀU HÒA, TỦ LẠNH, MÁY GIẶT) ---
    {
      name: 'Điều Hòa Daikin Inverter 1.5 HP FTKZ35VVMV - Lọc Khí Streamer & Mắt Thần Thông Minh',
      slug: 'dieu-hoa-daikin-inverter-1-5-hp-ftkz35vvmv',
      sku: 'DAIKIN-FTKZ35VVMV',
      shortDescription: 'Dòng máy lạnh cao cấp nhất của Daikin, tiết kiệm điện 66% chuẩn 5 sao CSPF 7.24, lọc sạch vi khuẩn virus Streamer',
      description: 'Điều hòa Daikin FTKZ35VVMV là giải pháp điều hòa không khí hoàn hảo với luồng gió thoải mái Coanda không thổi trực tiếp vào người, cảm biến Mắt thần thông minh 2 khu vực tự điều chỉnh hướng gió và công nghệ lọc khí Streamer độc quyền loại bỏ 99.9% nấm mốc.',
      price: 15490000,
      originalPrice: 17990000,
      stock: 25,
      categoryId: categoryMap['dien-lanh'],
      brandId: brandMap['daikin'],
      warrantyMonths: 24,
      images: [
        'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Daikin',
        xuat_xu: 'Thái Lan',
        cong_suat_lam_lanh: '1.5 HP (11.900 BTU)',
        pham_vi_hieu_qua: 'Từ 15 - 20 m² (40 đến 60 m³)',
        inverter: 'Có (Công nghệ Inverter tiết kiệm điện tối đa 66%)',
        cong_nghe_khang_khuan: 'Streamer diệt khuẩn, phin lọc Enzyme Blue tích hợp PM2.5',
        moi_chat_lam_lanh: 'Gas R-32 thân thiện môi trường',
        tieu_thu_dien: '0.85 kW/h (CSPF 7.24 đạt chuẩn 5 sao)',
        thoi_gian_bao_hanh: '24 tháng thân máy, 5 năm máy nén',
      },
      variants: [
        { name: 'Công suất 1.5 HP (12.000 BTU)', sku: 'DAIKIN-15HP', price: 15490000, stock: 15 },
        { name: 'Công suất 1.0 HP (9.000 BTU)', sku: 'DAIKIN-10HP', price: 12990000, stock: 10 },
      ],
      reviews: [
        { authorName: 'Nguyễn Tiến Dũng', rating: 5, comment: 'Máy chạy êm ru không nghe thấy tiếng gió, tiền điện mỗi tháng giảm rõ rệt so với máy cũ.' },
      ],
    },
    {
      name: 'Tủ Lạnh LG Inverter InstaView Door-in-Door 617 Lít GR-X257BG',
      slug: 'tu-lanh-lg-instaview-door-in-door-617l',
      sku: 'LG-GR-X257BG',
      shortDescription: 'Gõ 2 lần sáng màn hình kính InstaView nhìn thấu bên trong, lấy nước và đá ngoài diệt khuẩn UVnano, Linear Inverter êm ái',
      description: 'Tủ lạnh Side by Side LG InstaView Door-in-Door nâng tầm không gian bếp sang trọng với mặt kính tráng gương trong suốt khi gõ nhẹ 2 lần, hạn chế thất thoát khí lạnh tới 41%. Ngăn lấy đá viên, đá xay và nước lạnh trực tiếp bên ngoài khử khuẩn tia cực tím UVnano.',
      price: 28990000,
      originalPrice: 38990000,
      stock: 14,
      categoryId: categoryMap['dien-lanh'],
      brandId: brandMap['lg'],
      warrantyMonths: 24,
      images: [
        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'LG',
        xuat_xu: 'Trung Quốc',
        kieu_tu: 'Side by Side 2 cánh InstaView Door-in-Door',
        dung_tich_tong: '617 Lít (Ngăn đông 205L, Ngăn mát 412L)',
        inverter: 'Có (Smart Inverter tiết kiệm điện năng)',
        tinh_nang_dac_biet: 'Lấy nước ngoài, làm đá tự động, gõ cửa kính 2 lần sáng đèn, diệt khuẩn UVnano',
        cong_nghe_khu_mui: 'Bộ lọc than hoạt tính Hygiene Fresh+ diệt 99.999% vi khuẩn',
        kich_thuoc: 'Cao 179 cm - Rộng 91.3 cm - Sâu 73.5 cm (Trọng lượng 131 kg)',
        thoi_gian_bao_hanh: '24 tháng máy, 10 năm máy nén Inverter',
      },
      variants: [
        { name: 'Màu Đen Ánh Kim (617 Lít)', sku: 'LG-X257-BLK', price: 28990000, stock: 14 },
      ],
      reviews: [
        { authorName: 'Chị Mai Anh', rating: 5, comment: 'Tủ lạnh cực kỳ đẳng cấp, ngăn lấy đá ngoài tiện lợi vô cùng, rau củ để 2 tuần vẫn tươi rói.' },
      ],
    },
    {
      name: 'Tủ Lạnh Panasonic Inverter 540 Lít NR-YW590YMMV - 4 Cánh Mặt Gương Prime Freeze',
      slug: 'tu-lanh-panasonic-inverter-540l-nr-yw590ymmv',
      sku: 'PANA-NR-YW590YMMV',
      shortDescription: 'Cấp đông siêu tốc Prime Freeze nhanh gấp 5 lần, ngăn đông mềm Prime Fresh chuẩn -3°C nấu ngay không cần rã đông',
      description: 'Tủ lạnh cao cấp Panasonic 4 cửa mặt gương đen sang trọng tích hợp công nghệ diệt khuẩn Nanoe-X kháng 99.99% vi khuẩn và giảm dư lượng thuốc trừ sâu, tự động làm đá viên tinh khiết từ khay nước kháng khuẩn riêng biệt.',
      price: 49990000,
      originalPrice: 59900000,
      stock: 8,
      categoryId: categoryMap['dien-lanh'],
      brandId: brandMap['panasonic'],
      warrantyMonths: 24,
      images: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Panasonic',
        xuat_xu: 'Nhật Bản / Việt Nam',
        kieu_tu: 'Multi Door 4 cánh mặt gương',
        dung_tich_tong: '540 Lít',
        inverter: 'Có (Inverter kết hợp 7 cảm biến Econavi thông minh)',
        cong_nghe_lam_lanh: 'Panorama đa chiều, Ngăn đông mềm Prime Fresh -3 độ C',
        cong_nghe_diet_khuan: 'Nanoe-X thế hệ mới độc quyền Panasonic',
        thoi_gian_bao_hanh: '24 tháng toàn máy, Động cơ 12 năm',
      },
      variants: [
        { name: 'Mặt Kính Gương Đen (540 Lít)', sku: 'PANA-590-MIRROR', price: 49990000, stock: 8 },
      ],
    },

    // --- TIVI & ÂM THANH ---
    {
      name: 'Smart Tivi OLED Sony Bravia 65 inch 4K XR-65A80L - Bộ Xử Lý Cognitive Processor XR',
      slug: 'smart-tivi-oled-sony-bravia-65-inch-xr-65a80l',
      sku: 'SONY-XR-65A80L',
      shortDescription: 'Màn hình OLED đen tuyệt đối, âm thanh phát ra trực tiếp từ màn hình Acoustic Surface Audio+, Google TV thông minh',
      description: 'Sony A80L sử dụng tấm nền OLED hàng triệu điểm ảnh tự phát sáng, kết hợp trí tuệ nhận thức Cognitive Processor XR tái tạo độ tương phản sâu thẳm chân thực như mắt người nhìn thấy cùng công nghệ âm thanh vòm Dolby Atmos đỉnh cao rạp chiếu.',
      price: 41900000,
      originalPrice: 49900000,
      stock: 12,
      categoryId: categoryMap['tivi-am-thanh'],
      brandId: brandMap['sony'],
      warrantyMonths: 24,
      images: [
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Sony',
        xuat_xu: 'Malaysia',
        kich_thuoc_man_hinh: '65 inch (Độ phân giải 4K Ultra HD 3840 x 2160)',
        loai_man_hinh: 'OLED đen thuần khiết, tần số quét 120Hz',
        bo_xu_ly: 'Bộ xử lý trí tuệ nhận thức Cognitive Processor XR',
        cong_nghe_am_thanh: 'Acoustic Surface Audio+ (Âm thanh phát ra từ màn hình)',
        cong_suat_loa: '50 W (3 bộ kích hoạt âm thanh + 2 loa siêu trầm)',
        he_dieu_hanh: 'Google TV có điều khiển giọng nói tiếng Việt rảnh tay (Hand-free Voice)',
        thoi_gian_bao_hanh: '24 tháng chính hãng Sony Việt Nam',
      },
      variants: [
        { name: 'Kích thước 65 inch', sku: 'SONY-A80L-65', price: 41900000, stock: 8 },
        { name: 'Kích thước 55 inch', sku: 'SONY-A80L-55', price: 31900000, stock: 4 },
      ],
      reviews: [
        { authorName: 'Trịnh Thăng Bình', rating: 5, comment: 'Xem phim 4K buổi tối màu đen sâu ngút ngàn, loa rung trực tiếp trên màn hình xem phim hành động cực đã!' },
      ],
    },
    {
      name: 'Smart Tivi Samsung Neo QLED 4K 75 inch QA75QN85D - Đèn Nền Quantum Mini LED',
      slug: 'smart-tivi-samsung-neo-qled-4k-75-inch-qa75qn85d',
      sku: 'SAM-QA75QN85D',
      shortDescription: 'Công nghệ đèn nền Mini LED siêu nhỏ, bộ xử lý NQ4 AI Gen2 nâng cấp hình ảnh 4K bằng trí tuệ nhân tạo, tần số quét 120Hz',
      description: 'Samsung Neo QLED 75QN85D tái hiện từng chi tiết ẩn sâu trong vùng tối và vùng sáng nhờ hàng ngàn bóng đèn Quantum Mini LED kết hợp AI Upscaling 4K mượt mà, hỗ trợ chơi game FreeSync Premium Pro độ trễ cực thấp.',
      price: 45990000,
      originalPrice: 55900000,
      stock: 10,
      categoryId: categoryMap['tivi-am-thanh'],
      brandId: brandMap['samsung'],
      warrantyMonths: 24,
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Samsung',
        xuat_xu: 'Việt Nam',
        kich_thuoc_man_hinh: '75 inch (4K 3840 x 2160, 120Hz)',
        cong_nghe_hinh_anh: 'Quantum Matrix Technology với bóng đèn Mini LED',
        bo_xu_ly: 'NQ4 AI Gen2 Processor với 20 mạng mô phỏng thần kinh',
        am_thanh: 'OTS (Object Tracking Sound) âm thanh theo dấu chuyển động, Dolby Atmos',
        thoi_gian_bao_hanh: '24 tháng chính hãng Samsung',
      },
      variants: [
        { name: '75 inch', sku: 'SAM-QN85D-75', price: 45990000, stock: 6 },
        { name: '65 inch', sku: 'SAM-QN85D-65', price: 32990000, stock: 4 },
      ],
    },
    {
      name: 'Loa Thanh Soundbar Sony HT-A7000 7.1.2 Kênh Dolby Atmos - Rạp Hát Tại Gia',
      slug: 'loa-thanh-soundbar-sony-ht-a7000-7-1-2-kenh',
      sku: 'SONY-HT-A7000',
      shortDescription: 'Âm thanh vòm 360 Spatial Sound Mapping, công suất cực đại 500W, hỗ trợ chuẩn Hi-Res Audio và HDMI eARC 8K',
      description: 'Soundbar Flagship Sony HT-A7000 cấu hình 7.1.2 kênh bao gồm 2 loa đánh trần hướng lên, 2 loa tweeter chùm và loa siêu trầm tích hợp mang lại cảm giác âm thanh chân thực bao trùm cả căn phòng.',
      price: 24990000,
      originalPrice: 31990000,
      stock: 15,
      categoryId: categoryMap['tivi-am-thanh'],
      brandId: brandMap['sony'],
      warrantyMonths: 12,
      images: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Sony',
        cong_suat: '500 W',
        he_thong_loa: '7.1.2 kênh với 2 loa hắt trần Up-firing',
        dinh_dang_am_thanh: 'Dolby Atmos, DTS:X, Hi-Res Audio, 360 Reality Audio',
        ket_noi: 'HDMI eARC, Bluetooth 5.0, Wi-Fi, AirPlay 2, Spotify Connect',
        thoi_gian_bao_hanh: '12 tháng chính hãng',
      },
      variants: [
        { name: 'Loa thanh Soundbar đơn', sku: 'HT-A7000-BAR', price: 24990000, stock: 10 },
        { name: 'Bộ kèm Loa Subwoofer không dây SA-SW5', sku: 'HT-A7000-SW5', price: 34990000, stock: 5 },
      ],
    },

    // --- GIA DỤNG NHÀ BẾP ---
    {
      name: 'Máy Rửa Bát Độc Lập Bosch Series 6 SMS6ZCI49E - Sấy Zeolith Tiết Kiệm Năng Lượng',
      slug: 'may-rua-bat-bosch-series-6-sms6zci49e-zeolith',
      sku: 'BOSCH-SMS6ZCI49E',
      shortDescription: 'Công nghệ sấy khoáng chất Zeolith khô hoàn hảo bát đĩa và đồ nhựa, rửa 14 bộ bát đĩa Châu Âu, độ ồn siêu êm 42dB',
      description: 'Máy rửa chén bát Bosch Series 6 nhập khẩu nguyên chiếc từ Đức sở hữu giàn rửa thứ 3 VarioDrawer Pro tiện lợi, 8 chương trình rửa chuyên sâu kết nối điện thoại Home Connect điều khiển từ xa thông minh.',
      price: 26900000,
      originalPrice: 34500000,
      stock: 16,
      categoryId: categoryMap['gia-dung'],
      brandId: brandMap['bosch'],
      warrantyMonths: 36,
      images: [
        'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Bosch',
        xuat_xu: 'Đức (Made in Germany)',
        dung_tich_rua: '14 bộ bát đĩa Châu Âu (Tương đương 3 - 4 bữa ăn Việt Nam)',
        cong_nghe_say: 'Zeolith Drying (Sấy hạt khoáng nhiệt tự nhiên)',
        luong_nuoc_tieu_thu: '9.5 Lít / chu trình Eco',
        do_on: '42 dB (Cực kỳ êm ái với động cơ EcoSilence Drive)',
        kich_thuoc: '84.5 x 60 x 60 cm',
        thoi_gian_bao_hanh: '36 tháng chính hãng',
      },
      variants: [
        { name: 'Inox Bạc Chống Vân Tay', sku: 'BOSCH-S6-INOX', price: 26900000, stock: 16 },
      ],
      reviews: [
        { authorName: 'Nguyễn Thị Hải Yến', rating: 5, comment: 'Đầu tư đáng tiền nhất cho căn bếp! Bát đĩa sạch bóng kin kít, đồ hộp nhựa lấy ra khô ráo hoàn toàn.' },
      ],
    },
    {
      name: 'Nồi Cơm Điện Cao Tần Cuckoo 1.8 Lít CRP-JHR1060FD - Áp Suất Kép Nấu Cơm Ngon Số 1',
      slug: 'noi-com-dien-cao-tan-cuckoo-1-8l-crp-jhr1060fd',
      sku: 'CUCKOO-JHR1060FD',
      shortDescription: 'Áp suất cực cao 2 ATM, lòng nồi phủ men kim cương Xwall Black Shine, công nghệ cảm ứng từ IH nhiệt độ cao',
      description: 'Nồi cơm điện cao tần Cuckoo chuẩn nội địa Hàn Quốc giúp hạt gạo nở đều, giữ nguyên vị ngọt dẻo tự nhiên, nấu xôi, cháo dinh dưỡng và cơm cháy chuẩn vị truyền thống.',
      price: 11490000,
      originalPrice: 14200000,
      stock: 20,
      categoryId: categoryMap['gia-dung'],
      brandId: brandMap['cuckoo'],
      warrantyMonths: 24,
      images: [
        'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Cuckoo',
        xuat_xu: 'Hàn Quốc (Made in Korea)',
        dung_tich: '1.8 Lít (Dành cho gia đình 4 - 8 người)',
        cong_suat: '1455 W',
        cong_nghe_nau: 'Cao tần IH kết hợp áp suất 2.0 atmosphere',
        chat_lieu_long_noi: 'Hợp kim gang đúc phủ men kim cương chống dính cao cấp',
        thoi_gian_bao_hanh: '24 tháng',
      },
      variants: [
        { name: 'Màu Titan Xám Đen (1.8L)', sku: 'CUCKOO-1060-TITAN', price: 11490000, stock: 20 },
      ],
    },

    // --- NHÀ THÔNG MINH & ROBOT ---
    {
      name: 'Robot Hút Bụi Lau Nhà Ecovacs Deebot T30 Pro Omni - Lực Hút 11.000Pa & Giặt Giẻ Nước Nóng 70°C',
      slug: 'robot-hut-bui-ecovacs-deebot-t30-pro-omni',
      sku: 'ECOVACS-T30-PRO',
      shortDescription: 'Trạm sạc Mini Omni toàn năng tự động gom rác, giặt giẻ nước nóng 70 độ C diệt khuẩn và sấy khô bằng khí nóng',
      description: 'Ecovacs Deebot T30 Pro Omni trang bị công nghệ mở rộng giẻ lau TruEdge chạm sát góc tường đến 1mm, công nghệ chống rối tóc ZeroTangle độc quyền và điều khiển chạm chân One-Touch Foot Control tiên tiến.',
      price: 16990000,
      originalPrice: 21990000,
      stock: 28,
      categoryId: categoryMap['smart-home'],
      brandId: brandMap['ecovacs'],
      warrantyMonths: 24,
      images: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Ecovacs',
        luc_hut: '11.000 Pa (Mạnh nhất phân khúc robot hút bụi gia đình)',
        tram_sac: 'Trạm Omni tự động gom rác 90 ngày, giặt giẻ nước nóng 70°C, sấy khí nóng',
        cong_nghe_lau: 'Xoay kép OZMO Turbo 2.0 có tay nâng tự động 9mm khi gặp thảm',
        dieu_huong: 'Laser LiDAR dToF TrueMapping 3.0 và camera AI 3D né vật cản',
        pin: '5200 mAh (Dọn dẹp liên tục tới 200 m²)',
        thoi_gian_bao_hanh: '24 tháng chính hãng',
      },
      variants: [
        { name: 'Bản Trắng Sứ T30 Pro', sku: 'T30PRO-WHITE', price: 16990000, stock: 18 },
        { name: 'Bản Đen Mờ T30 Pro', sku: 'T30PRO-BLACK', price: 16990000, stock: 10 },
      ],
      reviews: [
        { authorName: 'Đoàn Hưng', rating: 5, comment: 'Lực hút quá khỏe, giặt giẻ bằng nước nóng sạch tinh không hề bị mùi hôi ẩm mốc như đời cũ!' },
      ],
    },
    {
      name: 'Máy Lọc Không Khí Kèm Sưởi Dyson Purifier Hot+Cool HP07 - Lọc Bụi Mịn PM0.1 & Khí Độc',
      slug: 'may-loc-khong-khi-dyson-purifier-hot-cool-hp07',
      sku: 'DYSON-HP07-SILVER',
      shortDescription: 'Lọc 99.95% bụi siêu mịn PM0.1 và khử khí độc Formaldehyde, tích hợp quạt mát mùa hè và sưởi ấm mùa đông',
      description: 'Dyson HP07 đạt tiêu chuẩn lọc HEPA H13 kín khít toàn diện, công nghệ khuếch tán Air Multiplier lan tỏa khí sạch đến mọi ngóc ngách, kết nối ứng dụng MyDyson giám sát chất lượng không khí thời gian thực.',
      price: 18490000,
      originalPrice: 22900000,
      stock: 15,
      categoryId: categoryMap['smart-home'],
      brandId: brandMap['dyson'],
      warrantyMonths: 24,
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Dyson',
        xuat_xu: 'Malaysia',
        chuc_nang: 'Lọc không khí + Làm mát không cánh + Sưởi ấm nhiệt độ phòng',
        mang_loc: 'HEPA H13 sợi thủy tinh borosilicate và than hoạt tính',
        goc_quay: 'Lên đến 350 độ lan tỏa đều phòng',
        thoi_gian_bao_hanh: '24 tháng chính hãng Dyson Việt Nam',
      },
      variants: [
        { name: 'Bạc Trắng (White/Silver)', sku: 'DYSON-HP07-WS', price: 18490000, stock: 10 },
        { name: 'Niken Đen (Black/Nickel)', sku: 'DYSON-HP07-BN', price: 18490000, stock: 5 },
      ],
    },

    // --- PHỤ KIỆN CÔNG NGHỆ ---
    {
      name: 'Tai Nghe True Wireless Apple AirPods Pro 2 (Cổng Sạc USB-C / MagSafe)',
      slug: 'tai-nghe-apple-airpods-pro-2-usb-c',
      sku: 'APPLE-AIRPODS-PRO2',
      shortDescription: 'Khử tiếng ồn chủ động ANC gấp 2 lần, chế độ Thích ứng Adaptive Audio, chuẩn kháng nước bụi IP54',
      description: 'AirPods Pro 2 trang bị chip Apple H2 mang đến âm trầm sâu và âm cao trong trẻo, âm thanh không gian Spatial Audio theo dõi chuyển động đầu và thời lượng pin 6 giờ nghe liên tục (30 giờ với hộp sạc).',
      price: 5490000,
      originalPrice: 6190000,
      stock: 50,
      categoryId: categoryMap['phu-kien'],
      brandId: brandMap['apple'],
      warrantyMonths: 12,
      images: [
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Apple',
        chip_am_thanh: 'Apple H2 trên tai nghe, chip U1 trên hộp sạc',
        chong_on: 'Khử tiếng ồn chủ động (Active Noise Cancellation - ANC)',
        chuan_sac: 'USB-C, sạc không dây MagSafe, Apple Watch Charger và chuẩn Qi',
        thoi_luong_pin: '6 giờ nghe (Lên đến 30 giờ khi dùng kèm hộp sạc)',
        thoi_gian_bao_hanh: '12 tháng chính hãng',
      },
      variants: [
        { name: 'Màu Trắng (White) USB-C', sku: 'APP-PRO2-USBC', price: 5490000, stock: 50 },
      ],
      reviews: [
        { authorName: 'Phan Thanh Hải', rating: 5, comment: 'Chống ồn đi máy bay hoặc ngồi quán cà phê cực tốt, âm bass lực hơn đời 1 rất nhiều.' },
      ],
    },
    {
      name: 'Chuột Không Dây Công Thái Học Cao Cấp Logitech MX Master 3S',
      slug: 'chuot-khong-day-logitech-mx-master-3s',
      sku: 'LOGI-MX-MASTER-3S',
      shortDescription: 'Cảm biến quang học 8000 DPI di trên mọi mặt phẳng kể cả kính, cuộn siêu tốc MagSpeed cuộn 1000 dòng/giây',
      description: 'MX Master 3S là chuột không dây chuẩn mực cho giới lập trình viên và sáng tạo nội dung với cú nhấp chuột Silent Clicks giảm 90% tiếng ồn, kết nối cùng lúc 3 thiết bị và hỗ trợ công nghệ Logitech Flow chuyển file mượt mà giữa Windows và Mac.',
      price: 2290000,
      originalPrice: 2890000,
      stock: 40,
      categoryId: categoryMap['phu-kien'],
      brandId: brandMap['logitech'],
      warrantyMonths: 12,
      images: [
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
      ],
      specs: {
        thuong_hieu: 'Logitech',
        do_phan_giai_cam_bien: '200 - 8000 DPI (Cảm biến Darkfield hoạt động trên kính dày từ 4mm)',
        nut_cuon: 'Con lăn MagSpeed bằng thép gia công cơ học, cuộn 1.000 dòng/giây',
        ket_noi: 'Đầu thu Logi Bolt USB hoặc Bluetooth Low Energy (kết nối tối đa 3 thiết bị)',
        pin: 'Pin sạc Li-Po 500mAh, sạc nhanh 1 phút dùng được 3 giờ',
        thoi_gian_bao_hanh: '12 tháng chính hãng',
      },
      variants: [
        { name: 'Màu Đen Graphite', sku: 'MX-M3S-GRAPHITE', price: 2290000, stock: 25 },
        { name: 'Màu Xám Nhạt Pale Grey', sku: 'MX-M3S-GREY', price: 2290000, stock: 15 },
      ],
      reviews: [
        { authorName: 'Lâm Hoàng Phong', rating: 5, comment: 'Con lăn cuộn vô cực sướng nhất từng dùng, thiết kế ôm sát lòng bàn tay không bị mỏi cổ tay khi làm việc cả ngày.' },
      ],
    },
  ];

  // 4. Lưu từng sản phẩm vào cơ sở dữ liệu
  let createdCount = 0;
  for (const item of productsList) {
    const { variants, reviews, ...productData } = item;

    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ sku: item.sku }, { slug: item.slug }],
      },
    });

    let upsertedProduct;
    if (existing) {
      upsertedProduct = await prisma.product.update({
        where: { id: existing.id },
        data: {
          ...productData,
          slug: existing.slug,
          specs: item.specs as any,
          isPublished: true,
        },
      });
    } else {
      upsertedProduct = await prisma.product.create({
        data: {
          ...productData,
          specs: item.specs as any,
          isPublished: true,
        },
      });
    }

    // Thêm các biến thể nếu có
    if (variants && variants.length > 0) {
      for (const v of variants) {
        await prisma.productVariant.upsert({
          where: { sku: v.sku },
          update: {
            name: v.name,
            price: v.price,
            stock: v.stock,
          },
          create: {
            productId: upsertedProduct.id,
            name: v.name,
            sku: v.sku,
            price: v.price,
            stock: v.stock,
          },
        });
      }
    }

    // Thêm đánh giá mẫu nếu có
    if (reviews && reviews.length > 0) {
      for (const r of reviews) {
        const existingReview = await prisma.productReview.findFirst({
          where: { productId: upsertedProduct.id, authorName: r.authorName },
        });
        if (!existingReview) {
          await prisma.productReview.create({
            data: {
              productId: upsertedProduct.id,
              authorName: r.authorName,
              rating: r.rating,
              comment: r.comment,
              isVerified: true,
            },
          });
        }
      }
    }

    createdCount++;
    console.log(`✅ [${createdCount}/${productsList.length}] Đã thêm/cập nhật sản phẩm: ${item.name}`);
  }

  // 5. Xóa Cache Redis để giao diện lập tức cập nhật dữ liệu mới
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

  const total = await prisma.product.count();
  console.log(`🎉 HOÀN TẤT! Tổng số sản phẩm trong hệ thống hiện tại: ${total} sản phẩm.`);
}

seedProducts()
  .catch((e) => {
    console.error('❌ Lỗi khi seed sản phẩm:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
