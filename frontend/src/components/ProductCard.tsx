'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Scale, Star, Check, ShieldCheck, Zap } from 'lucide-react';
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
    brand?: { name: string; slug?: string };
    specs?: Record<string, any>;
    avgRating?: number | null;
    reviewCount?: number;
  };
  featuredBadge?: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';

export default function ProductCard({ product, featuredBadge }: ProductCardProps) {
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

  const savingAmount =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

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
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: imgSrc,
      specs: product.specs,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1800);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  // Trích xuất 2 thông số kỹ thuật cốt lõi có giá trị thực tế
  const badges: string[] = [];
  if (product.specs) {
    const s = product.specs;
    const cpuStr = String(s.cpu || s.bo_xu_ly || '');
    if (cpuStr.includes('A18 Pro')) badges.push('Apple A18 Pro');
    else if (cpuStr.includes('M3 Pro')) badges.push('Apple M3 Pro');
    else if (cpuStr.includes('M4')) badges.push('Apple M4');
    else if (cpuStr.includes('Ultra 9')) badges.push('Intel Ultra 9');
    else if (cpuStr.includes('Snapdragon 8 Gen 3')) badges.push('Snapdragon 8 Gen 3');
    else if (cpuStr) badges.push(cpuStr.split(' ')[0]);

    if (s.ram) badges.push(String(s.ram).includes('RAM') ? String(s.ram) : `${s.ram} RAM`);
    if (s.inverter || (s.cong_nghe_tiet_kiem && String(s.cong_nghe_tiet_kiem).includes('Inverter'))) {
      badges.push('Inverter 5★');
    }
    if (s.kich_thuoc_man_hinh) badges.push(String(s.kich_thuoc_man_hinh).split('(')[0].trim());
    if (s.chong_on) badges.push('Chống ồn ANC');
    if (s.dung_tich) badges.push(String(s.dung_tich).split('(')[0].trim());
  }

  const displayedBadges = badges.slice(0, 2);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.1),0_8px_10px_-6px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col group relative overflow-hidden hover:-translate-y-1">
      {/* Top Banner & Quick Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent && discountPercent > 0 ? (
            <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-sm tracking-tight">
              Giảm {discountPercent}%
            </span>
          ) : featuredBadge ? (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              {featuredBadge}
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              Chính hãng
            </span>
          )}

          <span className="bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-bold px-1.5 py-0.2 rounded">
            Trả góp 0%
          </span>
        </div>

        {/* Nút so sánh nhanh */}
        <button
          onClick={handleToggleCompare}
          title={isComparing ? 'Đã thêm vào so sánh' : 'So sánh thông số'}
          className={`pointer-events-auto p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition shadow-sm border ${
            isComparing
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white/90 backdrop-blur border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span className="text-[10px] font-semibold hidden sm:inline">
            {isComparing ? 'Đã chọn' : 'So sánh'}
          </span>
        </button>
      </div>

      {/* Product Image Stage (Aspect 1:1 Canvas Studio) */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square bg-slate-50/50 p-6 overflow-hidden flex items-center justify-center border-b border-slate-100 group-hover:bg-blue-50/20 transition-colors"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-contain object-center group-hover:scale-108 transition-transform duration-300 drop-shadow-sm"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category & Rating */}
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              {product.brand && (
                <span className="text-blue-600 tracking-wider uppercase text-[10px]">
                  {product.brand.name}
                </span>
              )}
              {product.brand && product.category && <span>·</span>}
              {product.category && (
                <span className="truncate max-w-[110px] font-medium text-slate-500 text-[10px]">
                  {product.category.name}
                </span>
              )}
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-0.5 text-[11px] text-amber-500 font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.avgRating ? product.avgRating.toFixed(1) : '4.9'}</span>
            </div>
          </div>

          {/* Product Name */}
          <Link
            href={`/products/${product.slug}`}
            className="font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 text-xs sm:text-sm leading-snug mb-2 transition-colors min-h-[2.5rem]"
          >
            {product.name}
          </Link>

          {/* Core Specs Pills */}
          {displayedBadges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {displayedBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100/90 border border-slate-200/60 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing Box & CTA */}
        <div className="mt-2 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            {/* Giá bán nổi bật */}
            <div className="text-base sm:text-lg font-black text-red-600 leading-tight">
              {formatPrice(product.price)}
            </div>

            {/* Giá cũ & Tiết kiệm */}
            <div className="flex items-center gap-1.5 mt-0.5">
              {product.originalPrice && product.originalPrice > product.price ? (
                <>
                  <span className="text-[11px] text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  {savingAmount > 0 && (
                    <span className="text-[10px] font-bold text-emerald-600 hidden sm:inline">
                      -{formatPrice(savingAmount)}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[10px] font-medium text-slate-500">Miễn phí giao hàng</span>
              )}
            </div>
          </div>

          {/* Nút thêm vào giỏ */}
          <button
            onClick={handleQuickAdd}
            title="Thêm vào giỏ hàng"
            className={`p-2.5 rounded-xl transition-all duration-200 shadow-sm shrink-0 flex items-center justify-center ${
              addedNotice
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200/60'
            }`}
          >
            {addedNotice ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
