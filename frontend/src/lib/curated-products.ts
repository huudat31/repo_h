export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice: number;
  stock?: number;
  images: string[];
  category?: { name: string; slug: string };
  brand?: { name: string; slug: string };
  shortDescription?: string;
  description?: string;
  specs?: Record<string, any>;
  avgRating?: number;
  reviewCount?: number;
  warrantyMonths?: number;
  variants?: Array<{ name: string; sku: string; price: number }>;
  media360Urls?: string[];
  videoUrl?: string;
  crossSells?: Array<{ id: string; name: string; slug: string; price: number; images: string[]; specs?: any }>;
}

export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  savingText: string;
  highlightSpecs: string[];
  productSlug: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  imageAlt: string;
  themeGradient: string;
  accentGlow: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-iphone-16-pro-max',
    badge: 'FLAGSHIP CHIẾN LƯỢC · CHÍNH HÃNG VN/A',
    title: 'iPhone 16 Pro Max',
    subtitle: 'Titan Tự Nhiên · Chip Apple A18 Pro 3nm',
    description:
      'Trang bị chip Apple A18 Pro 3nm cực mạnh, phím Camera Control cảm ứng lực và khung viền Titan cấp 5 siêu nhẹ bền bỉ. Màn hình Super Retina XDR 6.9 inch ProMotion 120Hz viền mỏng nhất lịch sử Apple.',
    price: 34490000,
    originalPrice: 36990000,
    savingText: 'Tiết kiệm 2.500.000₫',
    highlightSpecs: ['Chip A18 Pro 3nm', 'Màn 6.9" 120Hz', 'Camera 48MP Zoom 5x', 'Trả góp 0%'],
    productSlug: 'iphone-16-pro-max-256gb-titan',
    primaryCtaText: 'Mua Ngay Nhận Ưu Đãi',
    secondaryCtaText: 'Hệ sinh thái Apple',
    secondaryCtaLink: '/products?brandSlug=apple',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/IPhone_16_Pro_Max_Desert_Titanium_Rear.png',
    imageAlt: 'iPhone 16 Pro Max Titan Chính Hãng',
    themeGradient: 'from-slate-950 via-slate-900 to-amber-950/40',
    accentGlow: 'bg-amber-500/15',
  },
  {
    id: 'slide-asus-rog-g16',
    badge: 'QUÁI VẬT GAMING · OLED 2.5K 240Hz',
    title: 'ASUS ROG Zephyrus G16',
    subtitle: 'Intel Core Ultra 9 · RTX 4080 12GB GDDR6',
    description:
      'Khung nhôm CNC nguyên khối siêu mỏng nhẹ chỉ 1.49cm. Màn hình chuẩn màu đồ họa 100% DCI-P3 tần số quét 240Hz siêu tốc 0.2ms, tản nhiệt buồng hơi 3 quạt Arc Flow Gen 2 mát lạnh.',
    price: 68990000,
    originalPrice: 74990000,
    savingText: 'Tiết kiệm 6.000.000₫',
    highlightSpecs: ['Core Ultra 9 185H', 'RTX 4080 12GB', 'RAM 32GB LPDDR5X', 'SSD 2TB PCIe 4.0'],
    productSlug: 'laptop-asus-rog-zephyrus-g16-oled-2026',
    primaryCtaText: 'Khám Phá Cấu Hình',
    secondaryCtaText: 'Dòng ROG Gaming',
    secondaryCtaLink: '/products?brandSlug=asus-rog',
    image: 'https://dlcdnwebimgs.asus.com/files/media/AE97C70A-B57E-40F8-9FBA-87CE7F99428F/v1/images/large/2x/display_laptop.png',
    imageAlt: 'Laptop ASUS ROG Zephyrus G16 OLED',
    themeGradient: 'from-slate-950 via-slate-900 to-blue-950/50',
    accentGlow: 'bg-blue-600/20',
  },
  {
    id: 'slide-samsung-s24-ultra',
    badge: 'QUYỀN NĂNG ĐỘT PHÁ · GALAXY AI',
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'Khung Viền Titan · Snapdragon 8 Gen 3 for Galaxy',
    description:
      'Quyền năng Galaxy AI dịch thuật trực tiếp cuộc gọi, khoanh tròn để tìm kiếm thông minh và camera 200MP bắt trọn màn đêm với zoom quang học 10x chuẩn điện ảnh.',
    price: 26990000,
    originalPrice: 33990000,
    savingText: 'Tiết kiệm 7.000.000₫',
    highlightSpecs: ['Galaxy AI tiếng Việt', 'Màn 6.8" 2600 nits', 'Bút S-Pen tích hợp', 'Pin 5000 mAh'],
    productSlug: 'samsung-galaxy-s24-ultra-5g-256gb',
    primaryCtaText: 'Mua Ngay Trợ Giá 7Tr',
    secondaryCtaText: 'Hệ sinh thái Samsung',
    secondaryCtaLink: '/products?brandSlug=samsung',
    image: 'https://img.global.news.samsung.com/global/wp-content/uploads/2024/01/Galaxy-S24-Series_main1.jpg',
    imageAlt: 'Samsung Galaxy S24 Ultra 5G Chính Hãng',
    themeGradient: 'from-slate-950 via-slate-900 to-indigo-950/40',
    accentGlow: 'bg-purple-600/15',
  },
];

export const CURATED_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Điện Thoại & Tablet',
    slug: 'dien-thoai-tablet',
    _count: { products: 4 },
    subcategories: ['iPhone 16 Series', 'Samsung Galaxy S24', 'iPad Pro M4', 'Phụ kiện Apple chính hãng'],
  },
  {
    id: 'cat-2',
    name: 'Laptop Gaming & Đồ Họa',
    slug: 'laptop-gaming',
    _count: { products: 2 },
    subcategories: ['ASUS ROG Zephyrus', 'MacBook Pro M3', 'Laptop Ultra AI', 'Balo & Chuột Gaming'],
  },
  {
    id: 'cat-3',
    name: 'Điện Lạnh (Điều Hòa & Tủ Lạnh)',
    slug: 'dien-lanh',
    _count: { products: 5 },
    subcategories: ['Điều hòa Daikin Inverter', 'Tủ lạnh Panasonic Prime+', 'Máy giặt sấy 10.5kg', 'Tủ lạnh LG InstaView'],
  },
  {
    id: 'cat-4',
    name: 'Gia Dụng Nhà Bếp',
    slug: 'gia-dung',
    _count: { products: 4 },
    subcategories: ['Nồi chiên Philips XXL', 'Máy rửa bát Bosch Series 6', 'Nồi cơm điện Cuckoo', 'Nồi chiên Sunhouse'],
  },
  {
    id: 'cat-5',
    name: 'Tivi & Âm Thanh Cao Cấp',
    slug: 'tivi-am-thanh',
    _count: { products: 3 },
    subcategories: ['Smart Tivi Sony Bravia OLED', 'Samsung Neo QLED 75"', 'Loa Soundbar Sony 7.1.2', 'Tai nghe Sony WH-1000XM5'],
  },
  {
    id: 'cat-6',
    name: 'Nhà Thông Minh & Robot',
    slug: 'smart-home',
    _count: { products: 3 },
    subcategories: ['Robot hút bụi Ecovacs T30', 'Máy lọc không khí Dyson HP07', 'Máy lọc Philips 4000i', 'Cảm biến nhà thông minh'],
  },
  {
    id: 'cat-7',
    name: 'Phụ Kiện Công Nghệ',
    slug: 'phu-kien',
    _count: { products: 3 },
    subcategories: ['Apple AirPods Pro 2', 'Chuột Logitech MX Master 3S', 'Củ sạc nhanh GaN', 'Cáp sạc C to C bọc dù'],
  },
];

export const CURATED_PRODUCTS: ProductItem[] = [
  {
    id: '7ef0b1a0-9c12-47de-a59d-79ab0fa931ee',
    name: 'iPhone 16 Pro Max 256GB - Titan Tự Nhiên (Chính Hãng VN/A)',
    slug: 'iphone-16-pro-max-256gb-titan',
    sku: 'IPHONE-16PM-256GB',
    price: 34490000,
    originalPrice: 36990000,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/e/e2/IPhone_16_Pro_Max_Desert_Titanium_Rear.png',
      'https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large_2x.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/4/40/IPhone_16_Pro_Max_screen.png',
    ],
    category: { name: 'Điện Thoại & Tablet', slug: 'dien-thoai-tablet' },
    brand: { name: 'Apple', slug: 'apple' },
    avgRating: 4.9,
    reviewCount: 142,
    warrantyMonths: 12,
    shortDescription: 'Khung viền Titan cấp 5 siêu nhẹ, phím Điều khiển Camera cảm ứng lực và chip Apple A18 Pro 3nm mạnh mẽ.',
    description: 'iPhone 16 Pro Max phiên bản phân phối chính hãng VN/A sở hữu màn hình Super Retina XDR 6.9 inch ProMotion 120Hz, viền mỏng nhất lịch sử Apple, camera 48MP zoom quang học 5x sắc nét và pin dùng liên tục lên đến 33 giờ xem video.',
    specs: {
      thuong_hieu: 'Apple',
      xuat_xu: 'Chính hãng VN/A',
      bo_xu_ly: 'Apple A18 Pro (Tiến trình 3nm 6 nhân)',
      ram: '8GB Unified Memory',
      bo_nho_trong: '256GB NVMe',
      man_hinh: '6.9 inch Super Retina XDR OLED, 120Hz ProMotion',
      camera_sau: 'Chính 48MP + Góc siêu rộng 48MP + Telephoto 12MP (Zoom 5x)',
      camera_truoc: '12MP TrueDepth Autofocus',
      pin_sac: '4685 mAh, Sạc nhanh 50% trong 30 phút qua cổng USB-C 10Gbps',
      chat_lieu: 'Khung viền Titan cấp 5, Mặt lưng kính nhám Ceramic Shield',
      tinh_nang_dac_biet: 'Phím Camera Control cảm ứng, Chuẩn chống nước IP68',
    },
    variants: [
      { name: 'Titan Tự Nhiên (256GB)', sku: 'IPHONE-16PM-256-NAT', price: 34490000 },
      { name: 'Titan Sa Mạc (256GB)', sku: 'IPHONE-16PM-256-DES', price: 34490000 },
      { name: 'Titan Đen (512GB)', sku: 'IPHONE-16PM-512-BLK', price: 40990000 },
    ],
    media360Urls: [
      'https://upload.wikimedia.org/wikipedia/commons/e/e2/IPhone_16_Pro_Max_Desert_Titanium_Rear.png',
      'https://upload.wikimedia.org/wikipedia/commons/4/40/IPhone_16_Pro_Max_screen.png',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=kYJvE6t2B5U',
    crossSells: [
      {
        id: 'pk-airpods',
        name: 'Tai Nghe True Wireless Apple AirPods Pro 2 (USB-C)',
        slug: 'tai-nghe-apple-airpods-pro-2-usb-c',
        price: 5490000,
        images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=400&q=80'],
        specs: { chong_on: 'Chống ồn chủ động ANC 2X, Chip Apple H2' },
      },
    ],
  },
  {
    id: '4179c66d-599d-4a98-af06-fa69b0c76262',
    name: 'Laptop Gaming ASUS ROG Zephyrus G16 OLED GU605MI (Intel Ultra 9 / RTX 4080)',
    slug: 'laptop-asus-rog-zephyrus-g16-oled-2026',
    sku: 'ROG-G16-GU605MI',
    price: 68990000,
    originalPrice: 74990000,
    images: [
      'https://dlcdnwebimgs.asus.com/files/media/AE97C70A-B57E-40F8-9FBA-87CE7F99428F/v1/images/large/2x/display_laptop.png',
      'https://dlcdnwebimgs.asus.com/files/media/AE97C70A-B57E-40F8-9FBA-87CE7F99428F/v1/images/large/2x/software_laptop.png',
    ],
    category: { name: 'Laptop Gaming & Đồ Họa', slug: 'laptop-gaming' },
    brand: { name: 'ASUS ROG', slug: 'asus-rog' },
    avgRating: 5.0,
    reviewCount: 38,
    warrantyMonths: 24,
    shortDescription: 'Cấu hình tối thượng Intel Core Ultra 9 185H, GPU RTX 4080 12GB và màn hình OLED 2.5K 240Hz chuẩn màu 100% DCI-P3.',
    description: 'ASUS ROG Zephyrus G16 định hình lại chuẩn mực laptop gaming mỏng nhẹ cao cấp. Khung nhôm CNC nguyên khối chỉ 1.49cm, tản nhiệt buồng hơi ROG Intelligent Cooling và dải đèn Slash Lighting độc bản ở mặt A.',
    specs: {
      thuong_hieu: 'ASUS ROG',
      cpu: 'Intel Core Ultra 9 185H (16 nhân, 22 luồng, NPU AI)',
      card_do_hoa: 'NVIDIA GeForce RTX 4080 12GB GDDR6',
      ram: '32GB LPDDR5X 7467MHz Onboard',
      o_cung: '2TB PCIe 4.0 NVMe M.2 SSD',
      man_hinh: '16 inch ROG Nebula OLED 2.5K (2560x1600), 240Hz, 0.2ms, G-Sync',
      trong_luong: '1.85 kg',
      pin: '90WHrs, Sạc nhanh Type-C 100W PD',
    },
    variants: [
      { name: 'Eclipse Gray (Ultra 9 / RTX 4080 / 32GB)', sku: 'ROG-G16-GRAY', price: 68990000 },
      { name: 'Platinum White (Ultra 7 / RTX 4070 / 16GB)', sku: 'ROG-G16-WHITE', price: 54990000 },
    ],
  },
  {
    id: 'b56dc4e6-10fa-47c3-a63c-005bc09e8740',
    name: 'Samsung Galaxy S24 Ultra 5G 12GB/256GB - Quyền Năng Galaxy AI',
    slug: 'samsung-galaxy-s24-ultra-5g-256gb',
    sku: 'SAM-S24U-256GB',
    price: 26990000,
    originalPrice: 33990000,
    images: [
      'https://img.global.news.samsung.com/global/wp-content/uploads/2024/01/Galaxy-S24-Series_main1.jpg',
    ],
    category: { name: 'Điện Thoại & Tablet', slug: 'dien-thoai-tablet' },
    brand: { name: 'Samsung', slug: 'samsung' },
    avgRating: 4.8,
    reviewCount: 96,
    warrantyMonths: 12,
    shortDescription: 'Khung viền Titan cứng cáp, bút S-Pen tích hợp, chip Snapdragon 8 Gen 3 for Galaxy và bộ tính năng Galaxy AI đột phá.',
    specs: {
      thuong_hieu: 'Samsung',
      cpu: 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
      ram: '12GB',
      bo_nho_trong: '256GB UFS 4.0',
      man_hinh: '6.8 inch Dynamic AMOLED 2X, 120Hz, 2600 nits',
      camera_sau: '200MP + 50MP + 12MP + 10MP (Zoom quang 10x)',
      pin_sac: '5000 mAh, Sạc siêu nhanh 45W',
    },
  },
  {
    id: '18eac4f3-ab19-411e-b92c-5e23aaf0d477',
    name: 'MacBook Pro 14 M3 Pro (18GB RAM / 512GB SSD) - Màu Space Black',
    slug: 'macbook-pro-14-m3-pro-18gb-512gb',
    sku: 'MAC-MBP14-M3P',
    price: 48990000,
    originalPrice: 52990000,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    ],
    category: { name: 'Laptop Gaming & Đồ Họa', slug: 'laptop-gaming' },
    brand: { name: 'Apple', slug: 'apple' },
    avgRating: 4.9,
    reviewCount: 52,
    warrantyMonths: 12,
    shortDescription: 'Chip Apple M3 Pro 11-core CPU, 14-core GPU, màn hình Liquid Retina XDR 120Hz đỉnh cao cho nhà sáng tạo nội dung.',
    specs: {
      thuong_hieu: 'Apple',
      cpu: 'Apple M3 Pro 11-core CPU',
      ram: '18GB Unified Memory',
      o_cung: '512GB SSD',
      man_hinh: '14.2 inch Liquid Retina XDR (3024x1964), 120Hz ProMotion',
    },
  },
  {
    id: '259ee88f-bc2b-4daf-8e87-56fc4240fe32',
    name: 'Máy Giặt Sấy Panasonic Inverter 10.5 kg NA-V105FR1BV',
    slug: 'may-giat-say-panasonic-inverter-10kg',
    sku: 'PANA-NA-V105FR1BV',
    price: 16490000,
    originalPrice: 19990000,
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
    ],
    category: { name: 'Điện Lạnh (Điều Hòa & Tủ Lạnh)', slug: 'dien-lanh' },
    brand: { name: 'Panasonic', slug: 'panasonic' },
    avgRating: 4.8,
    reviewCount: 64,
    warrantyMonths: 24,
    shortDescription: 'Giặt nước nóng diệt khuẩn 99.99% Blue Ag+, sấy tiện ích Hybrid Dry, cảm biến 3Di Inverter thông minh tiết kiệm 42% điện năng.',
    specs: {
      thuong_hieu: 'Panasonic',
      khoi_luong_giat: '10.5 kg (Giặt) / 6.0 kg (Sấy)',
      inverter: 'Có (3Di Inverter & Cảm biến Econavi)',
      thoi_gian_bao_hanh: '24 tháng tại nhà, Động cơ 12 năm',
    },
  },
  {
    id: '01ee34f9-ab12-4651-9c84-09e832005204',
    name: 'Smart Tivi OLED Sony Bravia 65 inch 4K XR-65A80L - Cognitive Processor XR',
    slug: 'tv-oled-sony-bravia-xr-65-inch-4k',
    sku: 'SONY-XR-65A80L',
    price: 41900000,
    originalPrice: 49900000,
    images: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80',
    ],
    category: { name: 'Tivi & Âm Thanh Cao Cấp', slug: 'tivi-am-thanh' },
    brand: { name: 'Sony', slug: 'sony' },
    avgRating: 4.9,
    reviewCount: 41,
    warrantyMonths: 24,
    shortDescription: 'Tấm nền OLED tương phản vô cực, bộ xử lý nhận thức trí tuệ Cognitive Processor XR và hệ thống âm thanh phát ra từ màn hình Acoustic Surface Audio+.',
    specs: {
      thuong_hieu: 'Sony',
      kich_thuoc_man_hinh: '65 inch OLED 4K (3840 x 2160), 120Hz',
      am_thanh: 'Acoustic Surface Audio+ 50W, Dolby Atmos',
    },
  },
  {
    id: '6ed1336e-f8b3-46f7-93a4-8be96692da3b',
    name: 'Điều Hòa Daikin Inverter 1.5 HP FTKZ35VVMV - Lọc Khí Streamer & Mắt Thần',
    slug: 'dieu-hoa-daikin-inverter-1-5-hp-ftkz35vvmv',
    sku: 'DAIKIN-FTKZ35VVMV',
    price: 15490000,
    originalPrice: 17990000,
    images: [
      'https://images.unsplash.com/photo-1614633833026-06203530c33a?auto=format&fit=crop&w=800&q=80',
    ],
    category: { name: 'Điện Lạnh (Điều Hòa & Tủ Lạnh)', slug: 'dien-lanh' },
    brand: { name: 'Daikin', slug: 'daikin' },
    avgRating: 4.8,
    reviewCount: 77,
    warrantyMonths: 24,
    shortDescription: 'Công nghệ Streamer phân hủy vi khuẩn bụi mịn, luồng gió thoải mái Coanda và công nghệ Inverter siêu tiết kiệm điện.',
    specs: {
      thuong_hieu: 'Daikin',
      cong_suat_lam_lanh: '1.5 HP (11.900 BTU)',
      inverter: 'Có (Tiết kiệm điện 5 sao CSPF 7.24)',
    },
  },
  {
    id: '96f7ced2-b5aa-4d55-a385-29352e8155cc',
    name: 'Robot Hút Bụi Lau Nhà Ecovacs Deebot T30 Pro Omni - Lực Hút 11.000Pa',
    slug: 'robot-hut-bui-ecovacs-deebot-t30-pro-omni',
    sku: 'ECO-T30-PRO-OMNI',
    price: 16990000,
    originalPrice: 21990000,
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    ],
    category: { name: 'Nhà Thông Minh & Robot', slug: 'smart-home' },
    brand: { name: 'Ecovacs', slug: 'ecovacs' },
    avgRating: 4.9,
    reviewCount: 39,
    warrantyMonths: 24,
    shortDescription: 'Trạm Omni all-in-one tự giặt giẻ nước nóng 70°C, sấy khí nóng, lực hút khủng 11.000Pa và công nghệ lau xoay áp lực.',
    specs: {
      thuong_hieu: 'Ecovacs',
      luc_hut: '11.000 Pa',
      tinh_nang: 'Tự động giặt giẻ nước nóng 70°C, sấy khí nóng, tự hút rác',
    },
  },
  {
    id: '953fde43-305a-4b02-8439-674da0b24932',
    name: 'Tai Nghe True Wireless Apple AirPods Pro 2 (Cổng Sạc USB-C / MagSafe)',
    slug: 'tai-nghe-apple-airpods-pro-2-usb-c',
    sku: 'APPLE-AIRPODS-PRO2',
    price: 5490000,
    originalPrice: 6190000,
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    ],
    category: { name: 'Phụ Kiện Công Nghệ', slug: 'phu-kien' },
    brand: { name: 'Apple', slug: 'apple' },
    avgRating: 4.9,
    reviewCount: 110,
    warrantyMonths: 12,
    shortDescription: 'Chip Apple H2, khả năng chống ồn chủ động gấp đôi thế hệ trước, chế độ Xuyên Âm Thích Ứng và âm thanh không gian Spatial Audio.',
    specs: {
      thuong_hieu: 'Apple',
      chong_on: 'Chống ồn chủ động ANC 2X, Chip Apple H2',
      thoi_luong_pin: '6 giờ nghe liên tục (30 giờ kèm hộp sạc)',
    },
  },
  {
    id: '62a9418b-25ed-465e-a1d6-179c8dce5f4b',
    name: 'Chuột Không Dây Công Thái Học Cao Cấp Logitech MX Master 3S',
    slug: 'chuot-khong-day-logitech-mx-master-3s',
    sku: 'LOGI-MX-MASTER-3S',
    price: 2290000,
    originalPrice: 2890000,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    ],
    category: { name: 'Phụ Kiện Công Nghệ', slug: 'phu-kien' },
    brand: { name: 'Logitech', slug: 'logitech' },
    avgRating: 4.9,
    reviewCount: 88,
    warrantyMonths: 12,
    shortDescription: 'Cảm biến Darkfield 8000 DPI di chuột mượt mà trên mặt kính, cú nhấp Quiet Clicks êm ái và con lăn kim loại MagSpeed cuộn 1000 dòng/giây.',
    specs: {
      thuong_hieu: 'Logitech',
      do_phan_giai: '8000 DPI (hoạt động trên kính)',
      ket_noi: 'Bluetooth & Logi Bolt USB Receiver (Kết nối 3 thiết bị)',
    },
  },
  {
    id: 'ea34161f-9186-4671-b185-96cc5a0cf469',
    name: 'Nồi Chiên Không Dầu Điện Tử Philips Airfryer XXL 7.2 Lít HD9285',
    slug: 'noi-chien-khong-dau-philips-xxl-7-2l',
    sku: 'PHILIPS-HD9285',
    price: 4290000,
    originalPrice: 5690000,
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
    ],
    category: { name: 'Gia Dụng Nhà Bếp', slug: 'gia-dung' },
    brand: { name: 'Philips', slug: 'philips' },
    avgRating: 4.8,
    reviewCount: 55,
    warrantyMonths: 24,
    shortDescription: 'Dung tích khổng lồ 7.2 lít chiên gà nguyên con, công nghệ Rapid Air giảm 90% lượng mỡ thừa, kết nối ứng dụng NutriU qua Wi-Fi.',
    specs: {
      thuong_hieu: 'Philips',
      dung_tich: '7.2 Lít (Giỏ chứa 1.4kg thực phẩm)',
      cong_suat: '2000 W',
    },
  },
  {
    id: '66e2f0bf-c3ea-4be9-901a-22448a6a8554',
    name: 'Máy Rửa Bát Độc Lập Bosch Series 6 SMS6ZCI49E - Sấy Zeolith',
    slug: 'may-rua-bat-bosch-series-6-sms6zci49e-zeolith',
    sku: 'BOSCH-SMS6ZCI49E',
    price: 26900000,
    originalPrice: 34500000,
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    ],
    category: { name: 'Gia Dụng Nhà Bếp', slug: 'gia-dung' },
    brand: { name: 'Bosch', slug: 'bosch' },
    avgRating: 5.0,
    reviewCount: 31,
    warrantyMonths: 36,
    shortDescription: 'Công nghệ sấy khoáng chất Zeolith khô hoàn hảo kể cả đồ nhựa, dung tích 14 bộ đồ ăn châu Âu, độ ồn siêu êm 42dB và kết nối Home Connect.',
    specs: {
      thuong_hieu: 'Bosch',
      dung_tich_rua: '14 bộ bát đĩa châu Âu',
      tieu_thu_nuoc: '9.5 lít / chu trình rửa Eco 50°C',
    },
  },
];
