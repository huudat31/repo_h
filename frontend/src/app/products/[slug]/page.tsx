import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { formatPrice } from '@/lib/formatters';
import ProductSpecsTable from '@/components/ProductSpecsTable';
import DetailActions from './DetailActions';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const FALLBACK_DETAIL: Record<string, any> = {
  'iphone-15-pro-max-256gb': {
    id: 'prod-1',
    name: 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên',
    slug: 'iphone-15-pro-max-256gb',
    sku: 'IPHONE-15PM-256-NAT',
    price: 29490000,
    originalPrice: 34990000,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    ],
    category: { name: 'Điện thoại thông minh' },
    shortDescription: 'Chip Apple A17 Pro siêu mạnh, khung vỏ Titan chuẩn hàng không vũ trụ',
    description:
      'iPhone 15 Pro Max đem đến thiết kế khung viền titan siêu bền nhẹ, hệ thống camera 5x telephoto chuyên nghiệp và cổng sạc USB-C tốc độ cao.',
    specs: {
      man_hinh: '6.7 inch, Super Retina XDR OLED, 120Hz ProMotion',
      cpu: 'Apple A17 Pro (3nm)',
      ram: '8 GB',
      bo_nho_trong: '256 GB',
      camera_sau: 'Chính 48MP + Góc siêu rộng 12MP + Tele 12MP (Zoom quang 5x)',
      camera_truoc: '12MP TrueDepth',
      pin_sac: '4.422 mAh, Sạc nhanh 20W, MagSafe 15W',
      trong_luong: '221 g',
      chat_lieu: 'Khung viền Titan, mặt lưng kính nhám',
      ket_noi: '5G, Wi-Fi 6E, USB-C 3.0',
    },
  },
  'macbook-pro-14-m3-pro': {
    id: 'prod-2',
    name: 'MacBook Pro 14 inch M3 Pro (18GB RAM / 512GB SSD)',
    slug: 'macbook-pro-14-m3-pro',
    sku: 'MBP-14-M3PRO-18-512',
    price: 49990000,
    originalPrice: 52990000,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    ],
    category: { name: 'Laptop & Máy tính xách tay' },
    shortDescription: 'Hiệu năng đột phá với chip M3 Pro, màn hình Liquid Retina XDR sáng 1600 nits',
    description:
      'MacBook Pro 14 inch mới nhất trang bị vi xử lý Apple M3 Pro 11-core CPU, 14-core GPU cùng thời lượng pin lên đến 18 giờ liên tục.',
    specs: {
      cpu: 'Apple M3 Pro (11-core CPU, 14-core GPU)',
      ram: '18 GB Unified Memory',
      o_cung: '512 GB SSD siêu tốc',
      man_hinh: '14.2 inch Liquid Retina XDR (3024 x 1964), 120Hz ProMotion',
      cong_ket_noi: '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3, Jack 3.5mm',
      pin: '70Wh, sạc nhanh 70W USB-C',
      trong_luong: '1.61 kg',
    },
  },
};

async function getProduct(slug: string) {
  try {
    const product = await fetchApi<any>(`/products/slug/${slug}`);
    if (product) return product;
  } catch {
    // Fallback
  }
  return FALLBACK_DETAIL[slug] || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Không tìm thấy sản phẩm - TechStore' };

  return {
    title: `${product.name} - Giá tốt nhất tại TechStore`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
        <a href="/" className="hover:text-blue-600">Trang chủ</a>
        <span>/</span>
        <a href="/products" className="hover:text-blue-600">Sản phẩm</a>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate max-w-sm">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-[420px] flex items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img: string, idx: number) => (
                <div key={idx} className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden p-1 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Purchase Actions */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-600 mb-1 block">
                {product.category.name}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-gray-400 mt-1">Mã SKU: {product.sku}</p>
          </div>

          {/* Pricing Section */}
          <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 flex items-baseline gap-4">
            <span className="text-3xl font-extrabold text-red-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discountPercent && (
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                Tiết kiệm {discountPercent}%
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description || product.shortDescription}
          </p>

          {/* Interactive Add to Cart & Buy Now */}
          <DetailActions product={product} />

          {/* Commitments */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Bảo hành chính hãng 12 tháng</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-green-600 shrink-0" />
              <span>Giao hàng GHN/GHTK toàn quốc</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-purple-600 shrink-0" />
              <span>Đổi mới trong 30 ngày nếu lỗi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Technical Specifications Table */}
      <div className="mt-8">
        <ProductSpecsTable specs={product.specs} />
      </div>
    </div>
  );
}
