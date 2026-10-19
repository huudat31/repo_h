'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap, Check, ArrowRight, X } from 'lucide-react';
import { addToCart } from '@/lib/cart-store';

export default function DetailActions({ product }: { product: any }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images?.[0] || '',
        specs: product.specs,
      },
      quantity
    );

    setShowNotification(true);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Số lượng:</span>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold transition"
          >
            -
          </button>
          <span className="px-4 py-1.5 text-sm font-semibold text-gray-800">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 px-6 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Thêm Vào Giỏ Hàng</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:from-red-700 hover:to-rose-700 transition"
        >
          <Zap className="w-5 h-5" />
          <span>Mua Ngay</span>
        </button>
      </div>

      {/* Quick Navigation Notification when Item Added */}
      {showNotification && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between text-xs text-green-800 font-bold">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-600" />
              Đã thêm {quantity} sản phẩm vào giỏ hàng thành công!
            </span>
            <button
              onClick={() => setShowNotification(false)}
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap pt-1">
            <Link
              href="/cart"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Xem Giỏ Hàng</span>
            </Link>

            <Link
              href="/checkout"
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Thanh Toán Ngay</span>
            </Link>

            <Link
              href="/products"
              className="px-3.5 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold transition"
            >
              Tiếp tục mua hàng
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
