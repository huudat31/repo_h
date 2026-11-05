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
  Headphones,
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
    <div className="space-y-10 sm:space-y-12 pb-16 bg-white">
      {/* ============================================================== */}
      {/* 1. HERO SECTION (Editorial Clean White Showcase + Side Promo Tiles) */}
      {/* ============================================================== */}
      <section className="container mx-auto px-4 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
          {/* Main Showcase (8/12 cols): Clean White Hero Carousel */}
          <div className="lg:col-span-8 flex flex-col">
            <HeroCarousel />
          </div>

          {/* Side Column (4/12 cols): 2 Clean Curated Retail Tiles */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-5 justify-between">
            {/* Tile 1: ASUS ROG Zephyrus G16 OLED */}
            <Link
              href="/products/laptop-asus-rog-zephyrus-g16-oled-2026"
              className="bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-3xl p-5 sm:p-6 border border-[#E5E7EB] hover:border-[#2563EB] transition-all flex-1 flex flex-col justify-between group shadow-xs hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-[#4B5563] mb-1.5">
                  <span className="text-[#2563EB] uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" /> Laptop Hiệu Năng Cao
                  </span>
                  <span className="bg-blue-50 text-[#2563EB] border border-blue-200/80 px-2 py-0.5 rounded text-[10px] font-bold">
                    OLED 240Hz
                  </span>
                </div>
                <h3 className="font-bold text-[#111827] group-hover:text-[#2563EB] transition text-sm sm:text-base leading-snug line-clamp-2">
                  ASUS ROG Zephyrus G16 (Ultra 9 / RTX 4080)
                </h3>
              </div>

              {/* Product Thumbnail */}
              <div className="relative w-full h-36 sm:h-40 my-3 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://dlcdnwebimgs.asus.com/files/media/AE97C70A-B57E-40F8-9FBA-87CE7F99428F/v1/images/large/2x/display_laptop.png"
                  alt="Laptop ASUS ROG Zephyrus G16 OLED"
                  loading="lazy"
                  className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                />
              </div>

              <div className="flex items-end justify-between pt-2 border-t border-[#E5E7EB]">
                <div>
                  <div className="text-base sm:text-lg font-black text-[#EF4444] leading-tight">68.990.000₫</div>
                  <div className="text-[11px] text-[#9CA3AF] line-through font-medium">74.990.000₫</div>
                </div>
                <span className="text-xs font-semibold text-[#2563EB] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Xem chi tiết <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Tile 2: Customer E-Warranty & Order Tracking */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E7EB] flex-1 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                  <span className="text-[11px] font-bold text-[#16A34A] uppercase tracking-wider">
                    DỊCH VỤ KHÁCH HÀNG CHÍNH HÃNG
                  </span>
                </div>
                <h3 className="font-bold text-[#111827] text-sm sm:text-base leading-snug">
                  Bảo Hành Điện Tử & Tra Cứu Vận Đơn
                </h3>
                <p className="text-xs text-[#4B5563] mt-1.5 leading-relaxed font-normal">
                  Kích hoạt bảo hành theo Serial/IMEI và theo dõi hành trình giao hàng GHN & GHTK thời gian thực.
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-4">
                <Link
                  href="/tra-cuu-bao-hanh"
                  className="flex-1 text-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition shadow-xs active:scale-95"
                >
                  Tra bảo hành
                </Link>
                <Link
                  href="/tra-cuu-don-hang"
                  className="flex-1 text-center bg-[#F5F7FA] hover:bg-[#EFF2F6] text-[#111827] text-xs font-semibold py-2.5 px-3 rounded-xl border border-[#E5E7EB] transition active:scale-95"
                >
                  Kiểm tra đơn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. VALUE PROPOSITIONS BAR (4 Cam Kết Bán Lẻ Thực Tế) */}
      {/* ============================================================== */}
      <section className="container mx-auto px-4">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl py-4 px-4 sm:px-6 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:divide-x divide-[#F3F4F6]">
            <div className="flex items-center gap-3 md:px-3">
              <div className="p-2.5 bg-blue-50 text-[#2563EB] rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#111827] text-xs sm:text-sm">100% Chính Hãng</h4>
                <p className="text-[11px] text-[#6B7280]">Đầy đủ hóa đơn VAT & tem phụ</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:px-3">
              <div className="p-2.5 bg-emerald-50 text-[#16A34A] rounded-xl">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#111827] text-xs sm:text-sm">Giao Siêu Tốc 2H</h4>
                <p className="text-[11px] text-[#6B7280]">Đồng hành cùng GHN & GHTK</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:px-3">
              <div className="p-2.5 bg-amber-50 text-[#F59E0B] rounded-xl">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#111827] text-xs sm:text-sm">1 Đổi 1 Trong 30 Ngày</h4>
                <p className="text-[11px] text-[#6B7280]">Lỗi nhà sản xuất đổi mới</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:px-3">
              <div className="p-2.5 bg-purple-50 text-[#8B5CF6] rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#111827] text-xs sm:text-sm">Trả Góp 0% Lãi Suất</h4>
                <p className="text-[11px] text-[#6B7280]">VNPAY, MoMo & Thẻ tín dụng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. FLASH SALE SHELF (Clean Modern Retail, No Dark Gradients) */}
      {/* ============================================================== */}
      <section className="container mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E5E7EB]">
          {/* Flash Sale Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-[#F59E0B] rounded-xl border border-amber-200/60">
                <Zap className="w-6 h-6 fill-[#F59E0B]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-[#111827] uppercase tracking-tight">
                    FLASH SALE GIÁ SỐC
                  </h2>
                  <span className="bg-red-50 text-[#EF4444] border border-red-200 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                    Đang diễn ra
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">Số lượng có hạn, ưu đãi tự động kết thúc khi hết suất</p>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2 bg-[#F5F7FA] border border-[#E5E7EB] px-3.5 py-1.5 rounded-xl self-start sm:self-auto text-xs font-semibold text-[#4B5563]">
              <Clock className="w-4 h-4 text-[#F59E0B]" />
              <span>Kết thúc sau:</span>
              <span className="bg-[#111827] text-white px-2 py-0.5 rounded font-bold font-mono">03</span>
              <span>:</span>
              <span className="bg-[#111827] text-white px-2 py-0.5 rounded font-bold font-mono">42</span>
              <span>:</span>
              <span className="bg-[#111827] text-white px-2 py-0.5 rounded font-bold font-mono">19</span>
            </div>
          </div>

          {/* Flash Sale Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {flashSaleItems.map((item) => {
              const percentSold = Math.round((item.soldCount / item.totalCount) * 100);

              return (
                <div
                  key={item.id}
                  className="bg-white text-[#111827] rounded-2xl overflow-hidden p-3.5 shadow-xs flex flex-col justify-between hover:border-[#2563EB] hover:shadow-md transition-all duration-300 border border-[#E5E7EB] group"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="block relative aspect-square bg-[#F8FAFC] rounded-xl overflow-hidden p-3 mb-2 flex items-center justify-center group-hover:bg-blue-50/20 transition"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-[#EF4444] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      HOT SALE
                    </span>
                  </Link>

                  <div>
                    <h3 className="font-bold text-xs sm:text-sm line-clamp-1 text-[#111827] group-hover:text-[#2563EB] transition">
                      <Link href={`/products/${item.slug}`}>{item.name}</Link>
                    </h3>

                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className="text-sm sm:text-base font-black text-[#EF4444]">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-[11px] text-[#9CA3AF] line-through font-medium">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-[#F3F4F6] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#EF4444] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentSold}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-[#6B7280] font-medium mt-1">
                        <span>Đã bán {item.soldCount}/{item.totalCount}</span>
                        <span className="text-[#EF4444] flex items-center gap-0.5 font-semibold">
                          <Flame className="w-3 h-3 fill-[#EF4444]" /> Sắp hết
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

      {/* ============================================================== */}
      {/* 4. VISUAL CATEGORIES (Clean Structured Category Sections) */}
      {/* ============================================================== */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] block mb-0.5">
              Hệ sinh thái thiết bị
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
              Danh Mục Sản Phẩm Chính Hãng
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 transition"
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
                className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#2563EB] hover:shadow-sm transition-all duration-200 p-3.5 flex flex-col items-center text-center hover:-translate-y-0.5"
              >
                {/* Visual Thumbnail */}
                <div className="w-full aspect-square bg-[#F8FAFC] rounded-xl p-3 flex items-center justify-center overflow-hidden border border-[#F3F4F6] group-hover:bg-blue-50/20 transition">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                  />
                </div>

                <h3 className="font-bold text-[#111827] group-hover:text-[#2563EB] text-xs mt-2.5 line-clamp-1 leading-snug transition">
                  {cat.name.split('(')[0].trim()}
                </h3>

                <p className="text-[11px] text-[#6B7280] mt-0.5 font-medium truncate max-w-full">
                  {cat._count?.products || 6} thiết bị
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. MAIN PRODUCT SHOWCASE (Toàn Bộ Sản Phẩm Tuyển Chọn) */}
      {/* ============================================================== */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
                Kho Hàng Thực Tế
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="text-xs text-[#6B7280] font-medium">Sẵn sàng giao ngay trong ngày</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
              Sản Phẩm Công Nghệ Mới Nhất
            </h2>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1.5 transition self-start sm:self-auto bg-white px-4 py-2 rounded-xl border border-[#E5E7EB] shadow-2xs"
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

      {/* ============================================================== */}
      {/* 6. BRAND PARTNERSHIPS (Đối Tác Thương Hiệu Ủy Quyền) */}
      {/* ============================================================== */}
      <section className="container mx-auto px-4">
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h3 className="text-base sm:text-lg font-black text-[#111827]">
              Đối Tác Phân Phối Chiến Lược
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              TechStore VN là đối tác ủy quyền phân phối của các tập đoàn công nghệ hàng đầu thế giới với chế độ bảo hành chính hãng tiêu chuẩn.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/products?brandSlug=${b.slug}`}
                className="bg-white hover:border-[#2563EB] border border-[#E5E7EB] rounded-xl p-3 text-center transition group flex flex-col justify-center shadow-2xs"
              >
                <div className="font-extrabold text-xs text-[#111827] group-hover:text-[#2563EB] transition">
                  {b.name}
                </div>
                <div className="text-[10px] text-[#6B7280] mt-0.5 truncate">
                  {b.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. BOTTOM SUPPORT BANNER (Hỗ Trợ Bán Lẻ & Tư Vấn 24/7) */}
      {/* ============================================================== */}
      <section className="container mx-auto px-4">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#111827] text-sm sm:text-base">
                Bạn cần tư vấn thiết bị phù hợp ngân sách?
              </h4>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Kỹ thuật viên TechStore sẵn sàng hỗ trợ chọn máy, kiểm tra cấu hình và hướng dẫn trả góp 0%.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:18006868"
              className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Gọi 1800 6868 (Miễn phí)</span>
            </a>
            <Link
              href="/tra-cuu-bao-hanh"
              className="bg-[#F5F7FA] hover:bg-[#EFF2F6] text-[#111827] border border-[#E5E7EB] text-xs font-semibold px-4 py-2.5 rounded-xl transition"
            >
              Tra Cứu Bảo Hành
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
