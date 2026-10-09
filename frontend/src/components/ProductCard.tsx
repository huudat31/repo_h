'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { addToCart } from '@/lib/cart-store';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    images: string[];
    category?: { name: string };
    specs?: Record<string, any>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

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

  // Extract key specs preview
  const previewSpecs: string[] = [];
  if (product.specs) {
    if (product.specs.cpu) previewSpecs.push(product.specs.cpu);
    if (product.specs.ram) previewSpecs.push(`RAM ${product.specs.ram}`);
    if (product.specs.bo_nho_trong || product.specs.o_cung) {
      previewSpecs.push(product.specs.bo_nho_trong || product.specs.o_cung);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col group">
      {/* Image & Discount */}
      <Link href={`/products/${product.slug}`} className="relative block h-56 bg-gray-50 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercent && discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {product.category && (
            <span className="text-xs text-blue-600 font-medium mb-1 block">
              {product.category.name}
            </span>
          )}
          <Link
            href={`/products/${product.slug}`}
            className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 text-sm leading-snug mb-2"
          >
            {product.name}
          </Link>

          {/* Quick Specs badges */}
          {previewSpecs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {previewSpecs.slice(0, 3).map((spec, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add Button */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-base font-bold text-red-600">
              {formatPrice(product.price)}
            </div>
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
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
