import React from 'react';
import ProductCard from '@/components/ProductCard';
import { fetchApi } from '@/lib/api';
import { Search, Filter } from 'lucide-react';

export const metadata = {
  title: 'Danh Sách Sản Phẩm - TechStore',
  description: 'Tìm kiếm và lọc các sản phẩm điện thoại, máy tính với Elasticsearch & PostgreSQL',
};

async function getProducts(search?: string, minPrice?: string, maxPrice?: string) {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    const res = await fetchApi<{ data: any[]; pagination: any }>(`/products?${params.toString()}`);
    return res.data;
  } catch {
    // Return sample mock when backend not started yet
    return [
      {
        id: 'prod-1',
        name: 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên',
        slug: 'iphone-15-pro-max-256gb',
        price: 29490000,
        originalPrice: 34990000,
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'],
        category: { name: 'Điện thoại thông minh' },
        specs: {
          cpu: 'Apple A17 Pro (3nm)',
          ram: '8 GB',
          bo_nho_trong: '256 GB',
          man_hinh: '6.7 inch Super Retina XDR OLED',
        },
      },
      {
        id: 'prod-2',
        name: 'MacBook Pro 14 inch M3 Pro (18GB RAM / 512GB SSD)',
        slug: 'macbook-pro-14-m3-pro',
        price: 49990000,
        originalPrice: 52990000,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'],
        category: { name: 'Laptop' },
        specs: {
          cpu: 'Apple M3 Pro',
          ram: '18 GB',
          o_cung: '512 GB SSD',
          man_hinh: '14.2 inch Liquid Retina XDR',
        },
      },
    ];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string; minPrice?: string; maxPrice?: string };
}) {
  const products = await getProducts(searchParams.search, searchParams.minPrice, searchParams.maxPrice);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title & Search Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Danh Mục Sản Phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">
            {searchParams.search
              ? `Kết quả tìm kiếm cho: "${searchParams.search}" (tìm kiếm nâng cao qua Elasticsearch)`
              : 'Tất cả thiết bị công nghệ chính hãng mới nhất'}
          </p>
        </div>

        {/* Quick Filter buttons */}
        <div className="flex items-center gap-2">
          <a
            href="/products"
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
          >
            Tất cả
          </a>
          <a
            href="/products?maxPrice=30000000"
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
          >
            Dưới 30 triệu
          </a>
          <a
            href="/products?minPrice=30000000"
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
          >
            Trên 30 triệu
          </a>
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp yêu cầu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
