import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { fetchApi } from '@/lib/api';
import { Filter, Zap, RotateCcw, Package, FolderTree, Tag, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Danh Sách Sản Phẩm & Bộ Lọc Nâng Cao - TechStore',
  description: 'Lọc sản phẩm theo danh mục, thương hiệu, công nghệ Inverter, mức giá tại TechStore',
};

async function getProductsData(params: {
  search?: string;
  categoryId?: string;
  brandSlug?: string;
  hasInverter?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  try {
    const qs = new URLSearchParams();
    if (params.search) qs.append('search', params.search);
    if (params.categoryId) qs.append('categoryId', params.categoryId);
    if (params.brandSlug) qs.append('brandSlug', params.brandSlug);
    if (params.hasInverter) qs.append('hasInverter', params.hasInverter);
    if (params.minPrice) qs.append('minPrice', params.minPrice);
    if (params.maxPrice) qs.append('maxPrice', params.maxPrice);
    qs.append('limit', '50');

    const res = await fetchApi<{ data: any[] }>(`/products?${qs.toString()}`);
    if (res && res.data) {
      return res.data;
    }
  } catch {
    // fallback
  }
  return [];
}

const CATEGORIES = [
  { name: 'Tất cả danh mục', slug: '' },
  { name: 'Điện Thoại & Tablet', slug: 'dien-thoai-tablet' },
  { name: 'Laptop Gaming & Đồ Họa', slug: 'laptop-gaming' },
  { name: 'Điện Lạnh Inverter', slug: 'dien-lanh' },
  { name: 'Gia Dụng Nhà Bếp', slug: 'gia-dung' },
  { name: 'Tivi & Âm Thanh Cao Cấp', slug: 'tivi-am-thanh' },
  { name: 'Nhà Thông Minh & Robot', slug: 'smart-home' },
  { name: 'Phụ Kiện Chính Hãng', slug: 'phu-kien' },
];

const BRANDS = [
  { name: 'Tất cả', slug: '' },
  { name: 'Apple', slug: 'apple' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Sony', slug: 'sony' },
  { name: 'LG', slug: 'lg' },
  { name: 'Panasonic', slug: 'panasonic' },
  { name: 'Daikin', slug: 'daikin' },
  { name: 'ASUS ROG', slug: 'asus-rog' },
  { name: 'Philips', slug: 'philips' },
  { name: 'Bosch', slug: 'bosch' },
  { name: 'Dyson', slug: 'dyson' },
  { name: 'Ecovacs', slug: 'ecovacs' },
  { name: 'Cuckoo', slug: 'cuckoo' },
  { name: 'Logitech', slug: 'logitech' },
  { name: 'Sunhouse', slug: 'sunhouse' },
];

const PRICE_RANGES = [
  { label: 'Tất cả mức giá', min: '', max: '' },
  { label: 'Dưới 3 triệu', min: '0', max: '3000000' },
  { label: '3 - 10 triệu', min: '3000000', max: '10000000' },
  { label: '10 - 25 triệu', min: '10000000', max: '25000000' },
  { label: 'Trên 25 triệu', min: '25000000', max: '' },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    categoryId?: string;
    brandSlug?: string;
    hasInverter?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}) {
  const products = await getProductsData(searchParams);

  // Helper to build URL with toggled param
  const buildUrl = (key: string, value: string) => {
    const q = new URLSearchParams(searchParams as any);
    if (value) {
      q.set(key, value);
    } else {
      q.delete(key);
    }
    return `/products?${q.toString()}`;
  };

  const selectedCategory = CATEGORIES.find((c) => c.slug === (searchParams.categoryId || ''));

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-blue-600 transition">
          Trang chủ
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-800">
          {selectedCategory && selectedCategory.slug ? selectedCategory.name : 'Tất cả sản phẩm'}
        </span>
        {searchParams.search && (
          <>
            <span>/</span>
            <span className="text-blue-600 italic">Tìm kiếm: &quot;{searchParams.search}&quot;</span>
          </>
        )}
      </div>

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            {selectedCategory && selectedCategory.slug
              ? selectedCategory.name
              : 'Tất Cả Thiết Bị Công Nghệ & Điện Máy'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Hiển thị {products.length} sản phẩm chính hãng với bảo hành điện tử chính thức
          </p>
        </div>

        {/* Clear Filter Button */}
        {(searchParams.categoryId ||
          searchParams.brandSlug ||
          searchParams.hasInverter ||
          searchParams.minPrice ||
          searchParams.search) && (
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa bộ lọc</span>
          </Link>
        )}
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Faceted Filters */}
        <aside className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Bộ Lọc Sản Phẩm</span>
              </span>
            </div>

            {/* 1. Danh Mục */}
            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-blue-600" />
                <span>Danh Mục</span>
              </h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const isActive = (searchParams.categoryId || '') === cat.slug;
                  return (
                    <Link
                      key={cat.slug}
                      href={buildUrl('categoryId', cat.slug)}
                      className={`block px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 2. Thương Hiệu */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Thương Hiệu</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {BRANDS.map((b) => {
                  const isActive = (searchParams.brandSlug || '') === b.slug;
                  return (
                    <Link
                      key={b.slug}
                      href={buildUrl('brandSlug', b.slug)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition border ${
                        isActive
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {b.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 3. Công nghệ Inverter */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Công Nghệ</span>
              </h3>
              {(() => {
                const isInverter = searchParams.hasInverter === 'true';
                return (
                  <Link
                    href={buildUrl('hasInverter', isInverter ? '' : 'true')}
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

            {/* 4. Mức Giá */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Mức Giá
              </h3>
              <div className="space-y-1">
                {PRICE_RANGES.map((r, idx) => {
                  const isActive =
                    (searchParams.minPrice || '') === r.min && (searchParams.maxPrice || '') === r.max;
                  const q = new URLSearchParams(searchParams as any);
                  if (r.min) q.set('minPrice', r.min);
                  else q.delete('minPrice');
                  if (r.max) q.set('maxPrice', r.max);
                  else q.delete('maxPrice');

                  return (
                    <Link
                      key={idx}
                      href={`/products?${q.toString()}`}
                      className={`block px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {r.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content: Products Grid */}
        <main className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center space-y-4 shadow-sm">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Hãy thử thay đổi tiêu chí lọc hoặc xóa bộ lọc để xem các sản phẩm khác.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
