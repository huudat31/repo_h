'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { getCart, updateQuantity, removeFromCart, CartItem } from '@/lib/cart-store';
import { formatPrice } from '@/lib/formatters';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCart(getCart());

    const handleSync = () => setCart(getCart());
    window.addEventListener('cart_updated', handleSync);
    return () => window.removeEventListener('cart_updated', handleSync);
  }, []);

  if (!mounted) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 text-sm mb-6">
          Hãy khám phá các thiết bị công nghệ đỉnh cao và thêm vào giỏ hàng ngay hôm nay.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow hover:bg-blue-700 transition"
        >
          Khám phá sản phẩm <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Giỏ Hàng Của Bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-100 shrink-0"
                />
                <div>
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-semibold text-gray-900 hover:text-blue-600 text-sm line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-red-600 font-bold text-sm mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>

              {/* Quantity & Delete */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                <div className="text-sm font-bold text-gray-900 min-w-[100px] text-right">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  title="Xoá khỏi giỏ"
                  className="text-gray-400 hover:text-red-600 transition p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit space-y-6">
          <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
            Tóm Tắt Đơn Hàng
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính ({cart.length} món):</span>
              <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển:</span>
              <span className="text-green-600 font-medium">Tính ở bước thanh toán</span>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
              <span className="font-bold text-gray-900">Tổng thanh toán:</span>
              <span className="text-xl font-extrabold text-red-600">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition text-sm"
          >
            Tiến Hành Đặt Hàng <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Thanh toán an toàn qua VNPAY / MoMo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
