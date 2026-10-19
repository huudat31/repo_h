import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { formatPrice } from '@/lib/formatters';
import ProductSpecsTable from '@/components/ProductSpecsTable';
import DetailActions from './DetailActions';
import Product360Viewer from '@/components/product-detail/Product360Viewer';
import AccessoryBundleCard from '@/components/product-detail/AccessoryBundleCard';
import ReviewsSection from '@/components/product-detail/ReviewsSection';
import { ShieldCheck, Truck, RotateCcw, Zap } from 'lucide-react';

const FALLBACK_DETAIL_DATA: Record<string, any> = {
  'may-giat-say-panasonic-inverter-10kg': {
    id: 'p-1',
    name: 'Máy Giặt Sấy Panasonic Inverter 10.5 kg NA-V105FR1BV',
    slug: 'may-giat-say-panasonic-inverter-10kg',
    sku: 'PANA-NA-V105FR1BV',
    price: 16490000,
    originalPrice: 19990000,
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    ],
    media360Urls: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    brand: { name: 'Panasonic', slug: 'panasonic' },
    category: { name: 'Điện Lạnh' },
    warrantyMonths: 24,
    shortDescription:
      'Công nghệ giặt nước nóng Blue Ag+ diệt khuẩn 99.99%, sấy tiện ích Hybrid Dry, cảm biến 3Di Inverter thông minh tiết kiệm điện.',
    description:
      'Máy giặt sấy Panasonic thế hệ mới kết hợp công nghệ sấy nâng niu quần áo, cảm biến 3Di Inverter thông minh đo khối lượng đồ giặt tối ưu điện nước. Động cơ bảo hành lên đến 12 năm.',
    specs: {
      thuong_hieu: 'Panasonic',
      xuat_xu: 'Việt Nam',
      khoi_luong_giat: '10.5 kg (Giặt) / 6.0 kg (Sấy)',
      cong_nghe_tiet_kiem: '3Di Inverter & Cảm biến Econavi',
      inverter: 'Có (Inverter tiết kiệm 42% điện năng)',
      dong_co: 'Truyền động curoa êm ái',
      cong_suat: '1850 W',
      toc_do_vat: '1400 vòng/phút',
      kich_thuoc: 'Rộng 59.6 cm - Sâu 60 cm - Cao 84.5 cm (Trọng lượng 70kg)',
      tinh_nang_dac_biet: 'Giặt diệt khuẩn nước nóng 90°C Blue Ag+, Tự vệ sinh lồng giặt Auto Tub Care',
      thoi_gian_bao_hanh: '24 tháng toàn máy, Động cơ 12 năm',
    },
    variants: [
      { name: 'Xám Đen Titan (10.5 kg)', sku: 'PANA-V105-TITAN', price: 16490000 },
      { name: 'Trắng Pha Lê (9.5 kg)', sku: 'PANA-V095-WHITE', price: 14490000 },
    ],
    crossSells: [
      {
        id: 'pk-1',
        name: 'Chân Đế Máy Giặt Đa Năng Chống Rung Inox Cao Cấp',
        slug: 'chan-de-may-giat-chong-rung',
        price: 249000,
        images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'],
        specs: { chat_lieu: 'Inox 304 kết hợp đệm cao su giảm chấn' },
      },
      {
        id: 'pk-2',
        name: 'Nước Giặt Cửa Trước OMO Matic Chuyên Dụng 3.6kg',
        slug: 'nuoc-giat-chuyen-dung-may-giat-cua-truoc',
        price: 189000,
        images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80'],
        specs: { dung_tich: '3.6 kg hương thơm mát' },
      },
    ],
    reviews: [
      {
        id: 'r-1',
        authorName: 'Nguyễn Văn An',
        rating: 5,
        comment: 'Máy giặt cực kỳ êm ái, sấy xong đồ ấm và thơm lừng không bị nhăn. Đáng tiền từng xu!',
        images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80'],
        isVerified: true,
        createdAt: '2026-03-10T10:00:00Z',
      },
    ],
  },
};

async function getProductDetail(slug: string) {
  try {
    const res = await fetchApi<any>(`/products/slug/${slug}`);
    if (res) return res;
  } catch {
    // fallback
  }
  return FALLBACK_DETAIL_DATA[slug] || FALLBACK_DETAIL_DATA['may-giat-say-panasonic-inverter-10kg'];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductDetail(params.slug);
  if (!product) return { title: 'Sản phẩm không tìm thấy - TechStore' };

  return {
    title: `${product.name} - Giá tốt chính hãng tại TechStore`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductDetail(params.slug);
  if (!product) notFound();

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600 transition">Sản phẩm</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/products?categoryId=${product.category.slug || product.category.id}`}
              className="hover:text-blue-600 transition"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        {product.brand && (
          <>
            <Link href={`/products?brandSlug=${product.brand.slug}`} className="hover:text-blue-600 transition">
              {product.brand.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-800 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main detail grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: 360 viewer, video and gallery */}
        <div>
          <Product360Viewer
            images={product.images || []}
            media360Urls={product.media360Urls || []}
            videoUrl={product.videoUrl}
            productName={product.name}
          />
        </div>

        {/* Right: Info, Price, Variants & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {product.brand && (
                <span className="text-xs uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {product.brand.name}
                </span>
              )}
              {product.specs?.inverter && (
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Tiết kiệm điện Inverter
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-gray-400 mt-1">Mã SKU: {product.sku}</p>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-red-50/60 rounded-2xl border border-red-100 flex items-baseline gap-4">
            <span className="text-3xl font-extrabold text-red-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discountPercent && (
              <span className="text-xs font-bold text-red-700 bg-red-200/80 px-2 py-0.5 rounded">
                Tiết kiệm {discountPercent}%
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Biến thể sản phẩm (Màu sắc, Dung tích, Công suất) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Chọn phiên bản / Biến thể:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any, idx: number) => (
                  <button
                    key={idx}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                      idx === 0
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-100'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{v.name}</span>
                    <span className="block text-[11px] text-gray-500 font-normal">
                      {formatPrice(v.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Actions */}
          <DetailActions product={product} />

          {/* Cam kết bán hàng & Bảo hành */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Bảo hành chính hãng {product.warrantyMonths || 24} tháng</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-green-600 shrink-0" />
              <span>Giao hàng & Lắp đặt GHN / GHTK</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-purple-600 shrink-0" />
              <span>Đổi mới trong 30 ngày nếu lỗi kỹ thuật</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gợi ý mua kèm phụ kiện (Cross-sell Bundle) */}
      {product.crossSells && product.crossSells.length > 0 && (
        <AccessoryBundleCard mainProduct={product} crossSells={product.crossSells} />
      )}

      {/* Bảng thông số kỹ thuật chi tiết */}
      <ProductSpecsTable specs={product.specs} />

      {/* Đánh giá & Bình luận kèm ảnh thực tế */}
      <ReviewsSection productId={product.id} reviews={product.reviews || []} />
    </div>
  );
}
