import React from 'react';
import Link from 'next/link';
import { ArrowRight, Smartphone, Laptop, Zap, Shield, Truck, RefreshCw } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchApi } from '@/lib/api';

// Fallback seed data if backend is offline during static prerender
const FALLBACK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên',
    slug: 'iphone-15-pro-max-256gb',
    price: 29490000,
    originalPrice: 34990000,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'],
    category: { name: 'Điện thoại' },
    specs: {
      cpu: 'Apple A17 Pro (3nm)',
      ram: '8 GB',
      bo_nho_trong: '256 GB',
      man_hinh: '6.7 inch OLED 120Hz ProMotion',
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
      cpu: 'Apple M3 Pro (11-core CPU)',
      ram: '18 GB',
      o_cung: '512 GB SSD',
      man_hinh: '14.2 inch Liquid Retina XDR',
    },
  },
];

async function getProducts() {
  try {
    const res = await fetchApi<{ data: any[] }>('/products?limit=8');
    if (res && res.data && res.data.length > 0) return res.data;
  } catch {
    // Graceful fallback
  }
  return FALLBACK_PRODUCTS;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white py-16 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
              <Zap className="w-3.5 h-3.5 text-yellow-300" /> Công Nghệ Đỉnh Cao 2026
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Sở Hữu Siêu Phẩm Công Nghệ Chính Hãng
            </h1>
            <p className="text-blue-100 text-base md:text-lg">
              Trải nghiệm mua sắm mượt mà với thanh toán trực tuyến qua VNPAY, MoMo. Giao hàng thần tốc qua GHN và GHTK.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition"
              >
                Khám phá ngay <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-md hidden md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
              alt="Tech Workspace"
              className="rounded-2xl shadow-2xl border-2 border-white/20 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Danh Mục Nổi Bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/products?categoryId=dien-thoai"
            className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition group"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Điện Thoại</h3>
              <p className="text-xs text-gray-500">iPhone, Samsung, Xiaomi</p>
            </div>
          </Link>

          <Link
            href="/products?categoryId=laptop"
            className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition group"
          >
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Laptop</h3>
              <p className="text-xs text-gray-500">MacBook, ThinkPad, ASUS</p>
            </div>
          </Link>

          <div className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Bảo Hành 12T</h3>
              <p className="text-xs text-gray-500">Đổi trả 1-1 trong 30 ngày</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">GHN / GHTK</h3>
              <p className="text-xs text-gray-500">Theo dõi vận đơn trực tiếp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sản Phẩm Công Nghệ Mới Nhất</h2>
            <p className="text-sm text-gray-500 mt-1">Cập nhật thông số kỹ thuật chi tiết theo thời gian thực</p>
          </div>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
