'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap, Check } from 'lucide-react';
import { addToCart } from '@/lib/cart-store';

export default function DetailActions({ product }: { product: any }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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
      quantity,
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
          {added ? (
            <>
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-600">Đã Thêm Vào Giỏ!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>Thêm Vào Giỏ Hàng</span>
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:from-red-700 hover:to-rose-700 transition"
        >
          <Zap className="w-5 h-5" />
          <span>Mua Ngay</span>
        </button>
      </div>
    </div>
  );
}
