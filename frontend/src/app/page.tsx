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
  Zap,
  Flame,
  Clock,
  Award,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchApi } from '@/lib/api';
import { CURATED_PRODUCTS, CURATED_CATEGORIES, ProductItem } from '@/lib/curated-products';
import { formatPrice } from '@/lib/formatters';

async function getProducts(): Promise<ProductItem[]> {
  try {
    const res = await fetchApi<{ data: any[] }>('/products?limit=24');
    if (res && res.data && res.data.length > 0) {
      return res.data;
    }
  } catch {
    // Graceful fallback to curated showcase
  }
  return CURATED_PRODUCTS;
}

async function getCategories() {
  try {
    const res = await fetchApi<any[]>('/categories');
    if (res && Array.isArray(res) && res.length > 0) {
      return res;
    }
  } catch {
    // Graceful fallback to curated categories
  }
  return CURATED_CATEGORIES;
}

const CATEGORY_THUMBNAILS: Record<string, { image: string; tag: string }> = {
  'dien-thoai-tablet': {
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
    tag: 'iPhone, Galaxy, iPad',
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

  // Flash Sale Items (Top 4 hot discounts)
  const flashSaleItems = products.slice(0, 4);

  const brands = [
    { name: 'Apple', slug: 'apple', label: 'Ủy quyền chính hãng VN/A' },
    { name: 'Samsung', slug: 'samsung', label: 'Đối tác chiến lược' },
    { name: 'Sony', slug: 'sony', label: 'Nhà phân phối chính thức' },
    { name: 'ASUS ROG', slug: 'asus-rog', label: 'Gaming Store' },
    { name: 'Daikin', slug: 'daikin', label: 'Chuyên gia điện lạnh Inverter' },
    { name: 'Panasonic', slug: 'panasonic', label: 'Gia dụng thông minh' },
    { name: 'LG', slug: 'lg', label: 'OLED Innovation' },
    { name: 'Dyson', slug: 'dyson', label: 'Thiết bị cao cấp' },
  ];

  return (
    <div className="space-y-12 sm:space-y-14 pb-16 bg-[#f8fafc]">
      {/* 1. HERO SECTION (Editorial Retail Showcase) */}
      <section className="container mx-auto px-4 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          {/* Main Showcase (8/12 cols): Flagship iPhone 16 Pro Max */}
          <div className="lg:col-span-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden flex flex-col justify-between border border-slate-800 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
              {/* Left Column: Copy & Actions */}
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/90 to-rose-600/90 text-white text-[11px] font-black px-3.5 py-1 rounded-full shadow-sm tracking-wide">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>SẢN PHẨM CHIẾN LƯỢC · CHÍNH HÃNG VN/A</span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
                    iPhone 16 Pro Max
                  </h1>
                  <p className="text-slate-300 font-semibold text-base sm:text-lg mt-1">
                    Titan Tự Nhiên · Chip Apple A18 Pro 3nm
                  </p>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md">
                  Trang bị chip Apple A18 Pro 3nm cực mạnh, phím Camera Control cảm ứng lực tiện lợi và khung viền Titan cấp 5 siêu nhẹ bền bỉ. Hàng chính hãng phân phối chính thức mã VN/A, bảo hành 12 tháng tại các trung tâm ủy quyền toàn quốc.
                </p>

                <div className="pt-1">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-red-500">34.490.000₫</span>
                    <span className="text-xs sm:text-sm text-slate-400 line-through">36.990.000₫</span>
                    <span className="text-xs font-bold text-red-300 bg-red-950/80 border border-red-800/80 px-2.5 py-0.5 rounded-md">
                      Tiết kiệm 2.500.000₫
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1 font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Trả góp 0% lãi suất
                    </span>
                    <span>·</span>
                    <span>Tặng gói bảo hành 12 tháng</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    href="/products/iphone-16-pro-max-256gb-titan"
                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-red-600/20 active:scale-95"
                  >
                    <span>Xem chi tiết máy</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/products?brandSlug=apple"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-3 rounded-xl text-xs sm:text-sm transition"
                  >
                    Hệ sinh thái Apple
                  </Link>
                </div>
              </div>

              {/* Right Column: Clean Studio Stage */}
              <div className="md:col-span-5 flex items-center justify-center pt-2 md:pt-0">
                <div className="relative w-full max-w-[260px] sm:max-w-[280px] aspect-[3/4] flex items-center justify-center group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80"
                    alt="iPhone 16 Pro Max Titan Tự Nhiên"
                    className="w-full h-full object-contain object-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Side Column (4/12 cols): 2 High-Converting Curated Retail Tiles */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-5">
            {/* Tile 1: ASUS ROG Zephyrus G16 OLED */}
            <Link
              href="/products/laptop-asus-rog-zephyrus-g16-oled-2026"
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5">
                  <span className="text-blue-600 uppercase tracking-wider font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Laptop Đồ Họa & Game
                  </span>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    OLED 2.5K 240Hz
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition text-sm sm:text-base leading-snug line-clamp-2">
                  ASUS ROG Zephyrus G16 OLED (Ultra 9 / RTX 4080)
                </h3>
              </div>

              {/* Product Thumbnail */}
              <div className="relative w-full h-32 sm:h-36 bg-slate-50/70 rounded-2xl overflow-hidden my-3 flex items-center justify-center p-3 border border-slate-100 group-hover:border-slate-200 transition">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"
                  alt="Laptop ASUS ROG Zephyrus G16 OLED"
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-sm"
                />
              </div>

              <div className="flex items-end justify-between pt-1">
                <div>
                  <div className="text-lg font-black text-red-600 leading-tight">68.990.000₫</div>
                  <div className="text-[11px] text-slate-400 line-through">74.990.000₫</div>
                </div>
                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Xem ngay <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Tile 2: Customer E-Warranty & Order Tracking */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 flex-1 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                    DỊCH VỤ KHÁCH HÀNG CHÍNH HÃNG
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                  Bảo Hành Điện Tử & Tra Cứu Vận Đơn
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Tra cứu hạn bảo hành theo Serial/IMEI và hành trình giao hàng GHN & GHTK thời gian thực.
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-4">
                <Link
                  href="/tra-cuu-bao-hanh"
                  className="flex-1 text-center bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold py-2.5 px-3 rounded-xl transition shadow-sm"
                >
                  Tra bảo hành
                </Link>
                <Link
                  href="/tra-cuu-don-hang"
                  className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 transition"
                >
                  Kiểm tra đơn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS BAR (4 Cam Kết Bán Lẻ Thực Tế) */}
      <section className="container mx-auto px-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl py-4 px-4 sm:px-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:divide-x divide-slate-100">
            <div className="flex items-center gap-3 md:px-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">100% Chính Hãng</h4>
                <p className="text-[11px] text-slate-500">Đầy đủ hóa đơn VAT & tem phụ</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:px-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Giao Siêu Tốc 2H</h4>
                <p className="text-[11px] text-slate-500">Đồng hành cùng GHN & GHTK</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:px-3">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">1 Đổi 1 Trong 30 Ngày</h4>
                <p className="text-[11px] text-slate-500">Lỗi nhà sản xuất đổi mới</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:px-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Trả Góp 0% Lãi Suất</h4>
                <p className="text-[11px] text-slate-500">VNPAY, MoMo & Thẻ tín dụng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FLASH SALE SHELF (Deal Chớp Nhoáng Có Đếm Ngược) */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 rounded-3xl p-5 sm:p-7 text-white shadow-xl">
          {/* Flash Sale Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white text-red-600 rounded-2xl shadow-md">
                <Zap className="w-6 h-6 fill-red-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                    FLASH SALE GIÁ SỐC
                  </h2>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md animate-pulse">
                    Đang diễn ra
                  </span>
                </div>
                <p className="text-xs text-red-100">Số lượng có hạn, kết thúc khi hết suất ưu đãi</p>
              </div>
            </div>

            {/* Countdown Clock (Mock Retail Timer) */}
            <div className="flex items-center gap-2 bg-red-950/60 border border-red-400/40 px-3.5 py-1.5 rounded-xl self-start sm:self-auto text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="text-slate-200">Kết thúc sau:</span>
              <span className="bg-white text-red-700 px-1.5 py-0.5 rounded font-black font-mono">03</span>
              <span>:</span>
              <span className="bg-white text-red-700 px-1.5 py-0.5 rounded font-black font-mono">42</span>
              <span>:</span>
              <span className="bg-white text-red-700 px-1.5 py-0.5 rounded font-black font-mono">19</span>
            </div>
          </div>

          {/* Flash Sale Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {flashSaleItems.map((item) => (
              <div key={item.id} className="bg-white text-slate-900 rounded-2xl overflow-hidden p-3 shadow-md flex flex-col justify-between">
                <Link href={`/products/${item.slug}`} className="block relative aspect-square bg-slate-50 rounded-xl overflow-hidden p-3 mb-2 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'}
                    alt={item.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                    HOT
                  </span>
                </Link>

                <div>
                  <h3 className="font-bold text-xs sm:text-sm line-clamp-1 text-slate-900 hover:text-blue-600 transition">
                    <Link href={`/products/${item.slug}`}>{item.name}</Link>
                  </h3>

                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-sm sm:text-base font-black text-red-600">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-red-500 h-2 rounded-full w-[82%]" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold mt-1">
                      <span>Đã bán 82%</span>
                      <span className="text-red-600 font-bold">Sắp hết hàng</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VISUAL CATEGORIES (8 Ngành Hàng Mũi Nhọn) */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
              Hệ sinh thái thiết bị
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Danh Mục Sản Phẩm Chính Hãng
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const thumb = CATEGORY_THUMBNAILS[cat.slug] || {
              image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
              tag: 'Chính hãng',
            };

            return (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.slug}`}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200 p-3 flex flex-col items-center text-center hover:-translate-y-1"
              >
                {/* Visual Thumbnail */}
                <div className="w-full aspect-square bg-slate-50 rounded-xl p-3 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:bg-blue-50/30 transition">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 text-xs mt-2.5 line-clamp-1 leading-snug transition">
                  {cat.name.split('(')[0].trim()}
                </h3>

                <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate max-w-full">
                  {cat._count?.products || 4} thiết bị
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. MAIN PRODUCT SHOWCASE (Toàn Bộ Sản Phẩm Tuyển Chọn) */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Kho Hàng Thực Tế
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-500 font-medium">Sẵn sàng giao ngay trong ngày</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sản Phẩm Công Nghệ Mới Nhất
            </h2>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5 transition self-start sm:self-auto bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <span>Khám phá toàn bộ {products.length} sản phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid (Chắc chắn 100% luôn có sản phẩm hiển thị) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 6. BRAND PARTNERSHIPS (Đối Tác Thương Hiệu Ủy Quyền) */}
      <section className="container mx-auto px-4">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Đối Tác Phân Phối Chiến Lược
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              TechStore VN là đối tác ủy quyền phân phối của các tập đoàn công nghệ hàng đầu thế giới với chế độ bảo hành chính hãng tiêu chuẩn.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/products?brandSlug=${b.slug}`}
                className="bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-sm rounded-xl p-3 text-center transition group flex flex-col justify-center"
              >
                <div className="font-extrabold text-xs text-slate-800 group-hover:text-blue-600 transition">
                  {b.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {b.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EXPERT CONSULTATION CALLOUT */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
          <div className="space-y-1.5 max-w-xl text-center md:text-left">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-400">
              TƯ VẤN KỸ THUẬT & TRẢ GÓP 0%
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Cần hỗ trợ lựa chọn cấu hình máy hoặc lắp đặt tận nơi?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Đội ngũ kỹ thuật viên TechStore VN sẵn sàng giải đáp thắc mắc về thông số, bảo hành và khảo sát lắp đặt 24/7.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:18006868"
              className="bg-white hover:bg-slate-100 text-slate-950 font-black px-5 py-3 rounded-xl text-xs transition shadow-sm flex items-center gap-2 active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>Gọi Miễn Phí 1800 6868</span>
            </a>
            <Link
              href="/compare"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-5 py-3 rounded-xl text-xs transition flex items-center gap-1.5"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>So sánh máy</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
