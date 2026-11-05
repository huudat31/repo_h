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
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import { fetchApi } from '@/lib/api';
import { CURATED_PRODUCTS, CURATED_CATEGORIES, ProductItem } from '@/lib/curated-products';
import { formatPrice } from '@/lib/formatters';

async function getProducts(): Promise<ProductItem[]> {
  try {
    const res = await fetchApi<{ data: any[] }>('/products?limit=50');
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
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=400&q=80',
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

  // Flash Sale Items with realistic sales quotas
  const flashSaleItems = [
    { ...products[0], soldCount: 86, totalCount: 100 },
    { ...products[1], soldCount: 28, totalCount: 30 },
    { ...products[2], soldCount: 42, totalCount: 50 },
    { ...products[8] || products[3], soldCount: 19, totalCount: 20 },
  ];

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
      {/* 1. HERO SECTION (Editorial Retail Showcase + Multi-Slide Carousel) */}
      <section className="container mx-auto px-4 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
          {/* Main Showcase (8/12 cols): Interactive Multi-Slide Hero Carousel */}
          <div className="lg:col-span-8 flex flex-col">
            <HeroCarousel />
          </div>

          {/* Side Column (4/12 cols): 2 High-Converting Curated Retail Tiles */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-5 justify-between">
            {/* Tile 1: ASUS ROG Zephyrus G16 OLED (Ảnh hãng chính thức, không viền trắng thừa) */}
            <Link
              href="/products/laptop-asus-rog-zephyrus-g16-oled-2026"
              className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/60 rounded-3xl p-5 sm:p-6 border border-slate-800 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 flex-1 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1.5">
                  <span className="text-blue-400 uppercase tracking-wider font-black flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Laptop Hiệu Năng Cao
                  </span>
                  <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    OLED 240Hz
                  </span>
                </div>
                <h3 className="font-bold text-white group-hover:text-blue-400 transition text-sm sm:text-base leading-snug line-clamp-2">
                  ASUS ROG Zephyrus G16 (Ultra 9 / RTX 4080)
                </h3>
              </div>

              {/* Product Thumbnail (Ảnh trong suốt chuẩn ASUS, tràn viền đẹp mắt) */}
              <div className="relative w-full h-36 sm:h-40 my-3 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://dlcdnwebimgs.asus.com/files/media/AE97C70A-B57E-40F8-9FBA-87CE7F99428F/v1/images/large/2x/display_laptop.png"
                  alt="Laptop ASUS ROG Zephyrus G16 OLED"
                  loading="lazy"
                  className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                />
              </div>

              <div className="flex items-end justify-between pt-1 border-t border-slate-800">
                <div>
                  <div className="text-base sm:text-lg font-black text-red-400 leading-tight">68.990.000₫</div>
                  <div className="text-[11px] text-slate-400 line-through">74.990.000₫</div>
                </div>
                <span className="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Xem chi tiết <ChevronRight className="w-4 h-4" />
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
                <p className="text-xs text-slate-200 mt-1.5 leading-relaxed font-normal">
                  Kích hoạt bảo hành theo Serial/IMEI và theo dõi hành trình giao hàng GHN & GHTK thời gian thực.
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-4">
                <Link
                  href="/tra-cuu-bao-hanh"
                  className="flex-1 text-center bg-white hover:bg-slate-100 text-slate-950 text-xs font-black py-2.5 px-3 rounded-xl transition shadow-sm active:scale-95"
                >
                  Tra bảo hành
                </Link>
                <Link
                  href="/tra-cuu-don-hang"
                  className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-700 transition active:scale-95"
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
        <div className="bg-white border border-slate-200/90 rounded-3xl py-4 px-4 sm:px-6 shadow-sm">
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

      {/* 3. FLASH SALE SHELF (Gradient Sang Trọng, Không Bị Chói Gắt + Tiến Độ Bán Hàng) */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-rose-900/40 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Flash Sale Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-red-600 to-amber-500 text-white rounded-2xl shadow-lg">
                <Zap className="w-6 h-6 fill-white" />
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
                <p className="text-xs text-rose-200 mt-0.5">Số lượng có hạn, ưu đãi tự động kết thúc khi hết suất</p>
              </div>
            </div>

            {/* Countdown Clock (Rõ nét, sang trọng) */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-rose-800/60 px-4 py-2 rounded-2xl self-start sm:self-auto text-xs font-bold shadow-md">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">Kết thúc sau:</span>
              <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-2 py-0.5 rounded-md font-black font-mono">03</span>
              <span className="text-rose-400 font-bold">:</span>
              <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-2 py-0.5 rounded-md font-black font-mono">42</span>
              <span className="text-rose-400 font-bold">:</span>
              <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-2 py-0.5 rounded-md font-black font-mono">19</span>
            </div>
          </div>

          {/* Flash Sale Grid (Cards trắng tương phản cao, kèm progress bar) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {flashSaleItems.map((item) => {
              const percentSold = Math.round((item.soldCount / item.totalCount) * 100);

              return (
                <div
                  key={item.id}
                  className="bg-white text-slate-900 rounded-2xl overflow-hidden p-3.5 shadow-md flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 border border-slate-100 group"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="block relative aspect-square bg-slate-50/70 rounded-xl overflow-hidden p-3 mb-2 flex items-center justify-center group-hover:bg-blue-50/20 transition"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                      HOT SALE
                    </span>
                  </Link>

                  <div>
                    <h3 className="font-bold text-xs sm:text-sm line-clamp-1 text-slate-900 group-hover:text-blue-600 transition">
                      <Link href={`/products/${item.slug}`}>{item.name}</Link>
                    </h3>

                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className="text-sm sm:text-base font-black text-red-600">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar (Đã bán X/Y suất để tạo urgency) */}
                    <div className="mt-3">
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${percentSold}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-600 font-bold mt-1">
                        <span>Đã bán {item.soldCount}/{item.totalCount} suất</span>
                        <span className="text-red-600 flex items-center gap-0.5">
                          <Flame className="w-3 h-3 fill-red-600" /> Sắp cháy hàng
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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

        {/* Product Grid */}
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
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
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
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold px-5 py-3 rounded-xl text-xs transition flex items-center gap-1.5 active:scale-95"
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
