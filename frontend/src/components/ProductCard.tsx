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
    category?: { name: string; slug?: string };
    brand?: { name: string; slug: string };
    specs?: Record<string, any>;
    avgRating?: number | null;
    reviewCount?: number;
  };
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';

export default function ProductCard({ product }: ProductCardProps) {
  const [isComparing, setIsComparing] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const initialImage = product.images?.[0] || FALLBACK_IMAGE;
  const [imgSrc, setImgSrc] = useState(initialImage);

  useEffect(() => {
    setImgSrc(product.images?.[0] || FALLBACK_IMAGE);
  }, [product.images]);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
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
      image: imgSrc,
      specs: product.specs,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1500);
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
        image: imgSrc,
        brandName: product.brand?.name,
        specs: product.specs,
      });
      if (!res.success && res.message) {
        alert(res.message);
      }
    }
  };

  // Trích xuất các thông số kỹ thuật cốt lõi có giá trị thực tế theo ngành hàng
  const badges: string[] = [];
  if (product.specs) {
    const s = product.specs;
    const cpuStr = String(s.cpu || s.bo_xu_ly || '');
    if (cpuStr.includes('A18 Pro')) badges.push('Chip A18 Pro');
    else if (cpuStr.includes('M3 Pro')) badges.push('Chip M3 Pro');
    else if (cpuStr.includes('M4')) badges.push('Chip Apple M4');
    else if (cpuStr.includes('Ultra 9')) badges.push('Intel Ultra 9');
    else if (cpuStr.includes('Snapdragon 8 Gen 3')) badges.push('Snapdragon 8 Gen 3');
    else if (cpuStr) badges.push(cpuStr.split(' ')[0]);

    if (s.ram) badges.push(String(s.ram).includes('RAM') ? String(s.ram) : `${s.ram} RAM`);
    if (s.inverter || (s.cong_nghe_tiet_kiem && String(s.cong_nghe_tiet_kiem).includes('Inverter'))) {
      badges.push('Inverter');
    }
    if (s.cong_suat_lam_lanh) badges.push(String(s.cong_suat_lam_lanh).split('(')[0].trim());
    if (s.chong_on) badges.push('Khử ồn ANC');
    if (s.dung_tich) badges.push(String(s.dung_tich).split('(')[0].trim());
    if (s.dung_tich_tong) badges.push(String(s.dung_tich_tong).split('(')[0].trim());
    if (s.dung_tich_rua) badges.push(String(s.dung_tich_rua).split('(')[0].trim());
    if (s.kich_thuoc_man_hinh) badges.push(String(s.kich_thuoc_man_hinh).split('(')[0].trim());
  }

  const displayedBadges = badges.slice(0, 2);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col group relative overflow-hidden">
      {/* Top badges: Discount & Compare button */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <div>
          {discountPercent && discountPercent > 0 ? (
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              -{discountPercent}%
            </span>
          ) : (
            <span />
          )}
        </div>

        <button
          onClick={handleToggleCompare}
          title={isComparing ? 'Đã thêm so sánh' : 'Thêm vào so sánh'}
          className={`pointer-events-auto p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition shadow-sm ${
            isComparing
              ? 'bg-blue-600 text-white'
              : 'bg-white/95 text-slate-500 hover:text-blue-600 hover:bg-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden sm:inline">{isComparing ? 'Đang so sánh' : 'So sánh'}</span>
        </button>
      </div>

      {/* Product Image Stage (Aspect 1:1 with clean studio canvas) */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square bg-slate-50/70 p-5 overflow-hidden flex items-center justify-center border-b border-slate-100"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category row */}
          <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold text-slate-400">
            {product.brand && (
              <span className="text-slate-600 font-bold tracking-wider uppercase">
                {product.brand.name}
              </span>
            )}
            {product.brand && product.category && <span>·</span>}
            {product.category && (
              <span className="truncate">{product.category.name}</span>
            )}
          </div>

          {/* Product Name */}
          <Link
            href={`/products/${product.slug}`}
            className="font-medium text-slate-900 group-hover:text-blue-600 line-clamp-2 text-xs sm:text-sm leading-snug mb-2 transition-colors min-h-[2.5rem]"
          >
            {product.name}
          </Link>

          {/* Specs Highlights */}
          {displayedBadges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {displayedBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Ratings & Reviews */}
          {product.avgRating && (
            <div className="flex items-center gap-1 text-[11px] text-amber-500 mb-2">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-800">{product.avgRating.toFixed(1)}</span>
              {product.reviewCount && product.reviewCount > 0 && (
                <span className="text-slate-400">({product.reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-2 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price ? (
              <div className="text-[11px] text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            ) : (
              <div className="text-[11px] text-emerald-600 font-medium">Chính hãng 100%</div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            title="Thêm nhanh vào giỏ hàng"
            className={`p-2 rounded-lg transition shrink-0 ${
              addedNotice
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white'
            }`}
          >
            {addedNotice ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
