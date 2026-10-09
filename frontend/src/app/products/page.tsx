import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { fetchApi } from '@/lib/api';
import { Filter, Zap, RotateCcw, Scale } from 'lucide-react';

export const metadata = {
  title: 'Danh Sách Sản Phẩm & Bộ Lọc Nâng Cao - TechStore',
  description: 'Lọc sản phẩm theo thương hiệu Panasonic, Philips, Sunhouse, công nghệ tiết kiệm điện Inverter, công suất, dung tích',
};

// Fallback seed products matching the requirement
const FALLBACK_STORE_PRODUCTS = [
  {
    id: 'p-1',
    name: 'Máy Giặt Sấy Panasonic Inverter 10.5 kg NA-V105FR1BV',
    slug: 'may-giat-say-panasonic-inverter-10kg',
    price: 16490000,
    originalPrice: 19990000,
    images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80'],
    brand: { name: 'Panasonic', slug: 'panasonic' },
    category: { name: 'Điện Lạnh' },
    avgRating: 5.0,
    reviewCount: 12,
    specs: {
      inverter: 'Có (Inverter tiết kiệm 42% điện năng)',
      cong_suat: '1850 W',
      khoi_luong_giat: '10.5 kg',
    },
  },
  {
    id: 'p-2',
    name: 'Nồi Chiên Không Dầu Điện Tử Philips Airfryer XXL 7.2 Lít HD9285',
    slug: 'noi-chien-khong-dau-philips-xxl-7-2l',
    price: 4290000,
    originalPrice: 5690000,
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80'],
    brand: { name: 'Philips', slug: 'philips' },
    category: { name: 'Gia Dụng' },
    avgRating: 4.9,
    reviewCount: 28,
    specs: {
      dung_tich: '7.2 Lít',
      cong_suat: '2000 W',
    },
  },
  {
    id: 'p-3',
    name: 'Nồi Chiên Không Dầu Sunhouse Mama 6.0 Lít SHD4088',
    slug: 'noi-chien-khong-dau-sunhouse-mama-6l',
    price: 1990000,
    originalPrice: 2890000,
    images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'],
    brand: { name: 'Sunhouse', slug: 'sunhouse' },
    category: { name: 'Gia Dụng' },
    avgRating: 4.8,
    reviewCount: 19,
    specs: {
      dung_tich: '6.0 Lít',
      cong_suat: '1800 W',
    },
  },
  {
    id: 'p-4',
    name: 'Điều Hòa Panasonic Inverter 1.5 HP CU/CS-XU12ZKH-8',
    slug: 'dieu-hoa-panasonic-inverter-1-5-hp',
    price: 15890000,
    originalPrice: 17590000,
    images: ['https://images.unsplash.com/photo-1614633833026-06203530c33a?auto=format&fit=crop&w=800&q=80'],
    brand: { name: 'Panasonic', slug: 'panasonic' },
    category: { name: 'Điện Lạnh' },
    avgRating: 5.0,
    reviewCount: 34,
    specs: {
      inverter: 'Có (Inverter)',
      cong_suat_lam_lanh: '1.5 HP',
    },
  },
];

async function getProductsData(params: {
  search?: string;
  brandSlug?: string;
  hasInverter?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  try {
    const qs = new URLSearchParams();
    if (params.search) qs.append('search', params.search);
    if (params.brandSlug) qs.append('brandSlug', params.brandSlug);
    if (params.hasInverter) qs.append('hasInverter', params.hasInverter);
    if (params.minPrice) qs.append('minPrice', params.minPrice);
    if (params.maxPrice) qs.append('maxPrice', params.maxPrice);

    const res = await fetchApi<{ data: any[] }>(`/products?${qs.toString()}`);
    if (res && res.data && res.data.length > 0) {
      return res.data;
    }
  } catch {
    // fallback filter
  }

  // Client-side fallback filter
  return FALLBACK_STORE_PRODUCTS.filter((p) => {
    if (params.brandSlug && p.brand?.slug !== params.brandSlug) return false;
    if (params.hasInverter === 'true' && !p.specs.inverter) return false;
    if (params.minPrice && p.price < Number(params.minPrice)) return false;
    if (params.maxPrice && p.price > Number(params.maxPrice)) return false;
    if (params.search && !p.name.toLowerCase().includes(params.search.toLowerCase())) return false;
    return true;
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    brandSlug?: string;
    hasInverter?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}) {
  const products = await getProductsData(searchParams);

  const BRANDS = [
    { name: 'Tất cả', slug: '' },
    { name: 'Panasonic', slug: 'panasonic' },
    { name: 'Philips', slug: 'philips' },
    { name: 'Sunhouse', slug: 'sunhouse' },
  ];

  const PRICE_RANGES = [
    { label: 'Tất cả mức giá', min: '', max: '' },
    { label: 'Dưới 3 triệu', min: '0', max: '3000000' },
    { label: '3 - 10 triệu', min: '3000000', max: '10000000' },
    { label: 'Trên 10 triệu', min: '10000000', max: '' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Title & Search Banner */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Danh Mục Thiết Bị Công Nghệ & Gia Dụng</h1>
        <p className="text-sm text-gray-500 mt-1">
          Lọc thông minh theo thương hiệu, công nghệ tiết kiệm điện Inverter, công suất và dung tích
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Faceted Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Bộ Lọc Chuyên Sâu</span>
              </span>
              <Link
                href="/products"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Đặt lại
              </Link>
            </div>

            {/* Thương hiệu (Panasonic, Philips, Sunhouse...) */}
            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                Thương Hiệu
              </h3>
              <div className="space-y-1.5">
                {BRANDS.map((b) => {
                  const isActive = (searchParams.brandSlug || '') === b.slug;
                  const query = new URLSearchParams(searchParams as any);
                  if (b.slug) query.set('brandSlug', b.slug);
                  else query.delete('brandSlug');

                  return (
                    <Link
                      key={b.slug}
                      href={`/products?${query.toString()}`}
                      className={`block px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {b.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Công nghệ Tiết kiệm điện Inverter */}
            <div className="pt-3 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                Công Nghệ Nổi Bật
              </h3>
              {(() => {
                const isInverter = searchParams.hasInverter === 'true';
                const query = new URLSearchParams(searchParams as any);
                if (isInverter) query.delete('hasInverter');
                else query.set('hasInverter', 'true');

                return (
                  <Link
                    href={`/products?${query.toString()}`}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition ${
                      isInverter
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Zap className={`w-4 h-4 ${isInverter ? 'text-green-600' : 'text-gray-400'}`} />
                    <span>Inverter Tiết Kiệm Điện</span>
                  </Link>
                );
              })()}
            </div>

            {/* Khoảng giá */}
            <div className="pt-3 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                Mức Giá
              </h3>
              <div className="space-y-1.5">
                {PRICE_RANGES.map((r, idx) => {
                  const isActive =
                    (searchParams.minPrice || '') === r.min && (searchParams.maxPrice || '') === r.max;
                  const query = new URLSearchParams(searchParams as any);
                  if (r.min) query.set('minPrice', r.min);
                  else query.delete('minPrice');
                  if (r.max) query.set('maxPrice', r.max);
                  else query.delete('maxPrice');

                  return (
                    <Link
                      key={idx}
                      href={`/products?${query.toString()}`}
                      className={`block px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {r.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* So sánh hướng dẫn */}
            <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
              <div className="flex items-center gap-1.5 font-bold text-blue-700 mb-1">
                <Scale className="w-3.5 h-3.5" />
                <span>So Sánh Sản Phẩm</span>
              </div>
              <p>
                Bấm nút <strong>&quot;So sánh&quot;</strong> trên bất kỳ 2-4 sản phẩm nào để đối chiếu bảng thông số kỹ thuật chi tiết.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Main Grid */}
        <main className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8">
              <p className="text-gray-500 font-medium">Không tìm thấy sản phẩm nào khớp với bộ lọc đã chọn.</p>
              <Link
                href="/products"
                className="mt-4 inline-block text-sm font-bold text-blue-600 hover:underline"
              >
                Xóa tất cả bộ lọc
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
