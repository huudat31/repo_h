import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  Scale,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchApi } from '@/lib/api';

async function getProducts() {
  try {
    const res = await fetchApi<{ data: any[] }>('/products?limit=12');
    if (res && res.data && res.data.length > 0) return res.data;
  } catch {
    // Graceful fallback
  }
  return [];
}

async function getCategories() {
  try {
    const res = await fetchApi<any[]>('/categories');
    if (res && Array.isArray(res) && res.length > 0) return res;
  } catch {
    // Graceful fallback
  }
  return [];
}

// Hình ảnh sản phẩm đại diện thực tế từ cơ sở dữ liệu cho từng danh mục
const CATEGORY_THUMBNAILS: Record<string, { image: string; tag: string }> = {
  'dien-thoai-tablet': {
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
    tag: 'iPhone, iPad, Galaxy',
  },
  'laptop-gaming': {
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    tag: 'MacBook, ASUS ROG',
  },
  'dien-lanh': {
    image: 'https://images.unsplash.com/photo-1614633833026-06203530c33a?auto=format&fit=crop&w=400&q=80',
    tag: 'Điều hòa, Tủ lạnh',
  },
  'gia-dung': {
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=400&q=80',
    tag: 'Nồi chiên, Máy rửa bát',
  },
  'tivi-am-thanh': {
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=80',
    tag: 'Sony OLED, Soundbar',
  },
  'smart-home': {
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    tag: 'Robot hút bụi, Dyson',
  },
  'phu-kien': {
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80',
    tag: 'AirPods, Chuột MX',
  },
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const brands = [
    { name: 'Apple', slug: 'apple', label: 'Ủy quyền chính hãng' },
    { name: 'Samsung', slug: 'samsung', label: 'Đối tác chiến lược' },
    { name: 'Sony', slug: 'sony', label: 'Nhà phân phối chính thức' },
    { name: 'ASUS ROG', slug: 'asus-rog', label: 'Gaming Store' },
    { name: 'Daikin', slug: 'daikin', label: 'Chuyên gia điện lạnh' },
    { name: 'Panasonic', slug: 'panasonic', label: 'Gia dụng thông minh' },
    { name: 'LG', slug: 'lg', label: 'OLED Innovation' },
    { name: 'Dyson', slug: 'dyson', label: 'Thiết bị cao cấp' },
  ];

  return (
    <div className="space-y-10 sm:space-y-12 pb-16">
      {/* 1. HERO SECTION (Editorial Retail Showcase: Cân bằng tỉ lệ, ảnh không bị cắt, hiển thị ảnh ASUS ROG) */}
      <section className="container mx-auto px-4 pt-3 sm:pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          {/* Main Showcase (8/12 cols): Flagship iPhone 16 Pro Max */}
          <div className="lg:col-span-8 bg-slate-950 text-white rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden flex flex-col justify-between border border-slate-800 shadow-sm">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Grid 2 cột cân bằng: Trái là Content, Phải là Ảnh sản phẩm đầy đủ */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
              {/* Left Column: Metadata & CTAs */}
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 text-slate-300 text-[11px] font-semibold px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Sản Phẩm Chiến Lược · Chính Hãng VN/A</span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
                    iPhone 16 Pro Max
                  </h1>
                  <p className="text-slate-400 font-semibold text-lg sm:text-xl mt-0.5">
                    Titan Tự Nhiên · Chip Apple A18 Pro
                  </p>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md">
                  Hiệu năng vượt trội từ tiến trình 3nm thế hệ mới, phím Điều khiển Camera chuyên nghiệp và khung vỏ Titan chuẩn hàng không vũ trụ siêu bền nhẹ.
                </p>

                <div className="pt-1">
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-black text-white">34.490.000₫</span>
                    <span className="text-xs sm:text-sm text-slate-400 line-through">36.990.000₫</span>
                    <span className="text-[11px] font-bold text-red-400 bg-red-950/60 border border-red-800/80 px-2 py-0.5 rounded">
                      Tiết kiệm 2.500.000₫
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Trả góp 0% lãi suất · Tặng thêm gói bảo hành mở rộng 12 tháng
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/products/iphone-16-pro-max-256gb-titan"
                    className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs sm:text-sm flex items-center gap-2 transition shadow-sm"
                  >
                    <span>Xem chi tiết máy</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/products?brandSlug=apple"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-lg text-xs sm:text-sm transition"
                  >
                    Hệ sinh thái Apple
                  </Link>
                </div>
              </div>

              {/* Right Column: Dedicated uncropped Product Showcase Stage */}
              <div className="md:col-span-5 flex items-center justify-center pt-4 md:pt-0">
                <div className="relative w-full max-w-[260px] sm:max-w-[300px] aspect-[3/4] max-h-[340px] flex items-center justify-center group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80"
                    alt="iPhone 16 Pro Max Titan Tự Nhiên"
                    className="w-full h-full object-contain object-center drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Side Column (4/12 cols): 2 Curated Retail Cards */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-5">
            {/* Tile 1: ASUS ROG Gaming Flagship (HIỂN THỊ ẢNH SẢN PHẨM RÕ NÉT) */}
            <Link
              href="/products/laptop-asus-rog-zephyrus-g16-oled-2026"
              className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition flex-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                  <span className="text-blue-600 uppercase tracking-wider">Laptop Hiệu Năng Cao</span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                    OLED 2.5K 240Hz
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition text-sm leading-snug line-clamp-2">
                  ASUS ROG Zephyrus G16 OLED (Ultra 9 / RTX 4080)
                </h3>
              </div>

              {/* Product Thumbnail Container with Error Fallback */}
              <div className="relative w-full h-32 sm:h-36 bg-slate-50/80 rounded-xl overflow-hidden my-2.5 flex items-center justify-center p-2.5 border border-slate-100 group-hover:border-slate-200 transition">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"
                  alt="Laptop ASUS ROG Zephyrus G16 OLED"
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex items-end justify-between pt-1">
                <div>
                  <div className="text-base font-extrabold text-slate-900 leading-tight">68.990.000₫</div>
                  <div className="text-[11px] text-slate-400 line-through">74.990.000₫</div>
                </div>
                <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Chi tiết <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Tile 2: Customer Warranty & Tracking Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                    Dịch Vụ Khách Hàng
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                  Bảo Hành Điện Tử & Tra Cứu Vận Đơn
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Quản lý thời hạn bảo hành chính hãng theo Serial/IMEI và theo dõi hành trình giao nhận GHN & GHTK thời gian thực.
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-3">
                <Link
                  href="/tra-cuu-bao-hanh"
                  className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2 px-3 rounded-lg border border-slate-700 transition"
                >
                  Tra bảo hành
                </Link>
                <Link
                  href="/tra-cuu-don-hang"
                  className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-700 transition"
                >
                  Kiểm tra đơn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS (Thanh Cam Kết Tinh Giản, Liền Mạch, Không Card Rời Rạc) */}
      <section className="container mx-auto px-4">
        <div className="bg-slate-50/90 border-y sm:border border-slate-200/80 sm:rounded-xl py-3.5 px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:divide-x divide-slate-200/80">
            <div className="flex items-center gap-3 md:px-3">
              <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">100% Chính Hãng</h4>
                <p className="text-[11px] text-slate-500">Đầy đủ VAT & tem phân phối</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:px-3">
              <Truck className="w-4 h-4 text-slate-700 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Giao Siêu Tốc 2H</h4>
                <p className="text-[11px] text-slate-500">Đồng hành cùng GHN & GHTK</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:px-3">
              <RotateCcw className="w-4 h-4 text-slate-700 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Đổi Mới 30 Ngày</h4>
                <p className="text-[11px] text-slate-500">1 đổi 1 lỗi nhà sản xuất</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:px-3">
              <CreditCard className="w-4 h-4 text-slate-700 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Trả Góp 0% Lãi Suất</h4>
                <p className="text-[11px] text-slate-500">VNPAY, MoMo & Thẻ tín dụng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION (Trực Quan Với Thumbnail Sản Phẩm Thật) */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
              Hệ sinh thái thiết bị
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Danh Mục Sản Phẩm
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1 transition self-start sm:self-auto"
          >
            <span>Tất cả ngành hàng</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5">
          {categories.map((cat) => {
            const thumb = CATEGORY_THUMBNAILS[cat.slug] || {
              image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
              tag: 'Chính hãng',
            };

            return (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.slug}`}
                className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition p-3 flex flex-col items-center text-center"
              >
                {/* Visual Thumbnail Stage */}
                <div className="w-full aspect-square bg-slate-50 rounded-lg p-2.5 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-slate-200 transition">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 text-xs mt-2.5 line-clamp-1 leading-snug transition">
                  {cat.name.split('(')[0].trim()}
                </h3>

                <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-full">
                  {cat._count?.products || 0} sản phẩm
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. MAIN PRODUCT SHOWCASE (Trọng Tâm Thương Mại - Sản Phẩm Mới Nhất) */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Sản phẩm nổi bật
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-400">Cập nhật kho thực tế</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sản Phẩm Công Nghệ Mới Nhất
            </h2>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <span>Xem toàn bộ {products.length} sản phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 text-slate-400 text-sm">
            Hiện chưa có sản phẩm hiển thị.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 5. BRAND PARTNERSHIPS (Đối Tác Thương Hiệu Chiến Lược) */}
      <section className="container mx-auto px-4">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 sm:p-6">
          <div className="text-center max-w-lg mx-auto mb-5">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Đối Tác Phân Phối Chiến Lược
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              TechStore VN là đối tác ủy quyền phân phối của các tập đoàn công nghệ hàng đầu thế giới
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/products?brandSlug=${b.slug}`}
                className="bg-white border border-slate-200/70 rounded-lg p-2.5 text-center hover:border-slate-300 hover:shadow-sm transition group"
              >
                <div className="font-extrabold text-xs text-slate-800 group-hover:text-blue-600 transition">
                  {b.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{b.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROMOTION ADVISORY BANNER */}
      <section className="container mx-auto px-4">
        <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1.5 max-w-xl text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              Tư vấn kỹ thuật chuyên sâu
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Cần hỗ trợ lựa chọn cấu hình máy hoặc lắp đặt tận nơi?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Đội ngũ tư vấn viên TechStore VN sẵn sàng giải đáp thắc mắc về thông số, bảo hành và chính sách trả góp 24/7.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:18006868"
              className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs transition shadow-sm flex items-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Gọi 1800 6868</span>
            </a>
            <Link
              href="/compare"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-lg text-xs transition flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>So sánh máy</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
