'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Scale, Star, Check } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { addToCart } from '@/lib/cart-store';
import { addToCompare, removeFromCompare, getCompareList } from '@/lib/compare-store';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    images: string[];
    category?: { name: string };
    brand?: { name: string; slug: string };
    specs?: Record<string, any>;
    avgRating?: number | null;
    reviewCount?: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isComparing, setIsComparing] = useState(false);
  const image =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  useEffect(() => {
    const list = getCompareList();
    setIsComparing(list.some((p) => p.id === product.id));

    const handleSync = () => {
      const current = getCompareList();
      setIsComparing(current.some((p) => p.id === product.id));
    };
    window.addEventListener('compare_updated', handleSync);
    return () => window.removeEventListener('compare_updated', handleSync);
  }, [product.id]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image,
      specs: product.specs,
    });
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      const res = addToCompare({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image,
        brandName: product.brand?.name,
        specs: product.specs,
      });
      if (!res.success && res.message) {
        alert(res.message);
      }
    }
  };

  // Preview key highlights
  const badges: string[] = [];
  if (product.specs) {
    if (product.specs.inverter || (product.specs.cong_nghe_tiet_kiem && product.specs.cong_nghe_tiet_kiem.includes('Inverter'))) {
      badges.push('Inverter');
    }
    if (product.specs.dung_tich) badges.push(product.specs.dung_tich);
    if (product.specs.cong_suat) badges.push(product.specs.cong_suat);
    if (product.specs.khoi_luong_giat) badges.push(product.specs.khoi_luong_giat);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col group relative">
      {/* Compare Button on Image */}
      <button
        onClick={handleToggleCompare}
        title={isComparing ? 'Đã thêm so sánh' : 'Thêm vào so sánh'}
        className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm ${
          isComparing
            ? 'bg-blue-600 text-white'
            : 'bg-white/90 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
        }`}
      >
        <Scale className="w-3.5 h-3.5" />
        <span className="text-[11px] hidden sm:inline">{isComparing ? 'Đang so sánh' : 'So sánh'}</span>
      </button>

      {/* Image & Discount */}
      <Link href={`/products/${product.slug}`} className="relative block h-52 bg-gray-50 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercent && discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
            -{discountPercent}%
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center gap-2 mb-1">
            {product.brand && (
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                {product.brand.name}
              </span>
            )}
            {product.category && (
              <span className="text-[11px] text-gray-400">· {product.category.name}</span>
            )}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 text-sm leading-snug mb-2"
          >
            {product.name}
          </Link>

          {/* Quick specs pills */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Rating score */}
          {product.avgRating && (
            <div className="flex items-center gap-1 text-xs text-amber-500 mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-800">{product.avgRating}</span>
              {product.reviewCount && product.reviewCount > 0 && (
                <span className="text-gray-400 text-[11px]">({product.reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Add Button */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-base font-bold text-red-600">{formatPrice(product.price)}</div>
            {product.originalPrice && (
              <div className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            title="Thêm nhanh vào giỏ"
            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
