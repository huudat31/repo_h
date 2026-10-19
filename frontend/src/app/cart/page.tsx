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
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1.5">Giỏ hàng của bạn đang trống</h2>
        <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto">
          Khám phá hệ sinh thái thiết bị công nghệ chính hãng và thêm sản phẩm yêu thích vào giỏ hàng ngay.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-sm transition"
        >
          <span>Khám phá sản phẩm</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Giỏ Hàng Của Bạn</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Quản lý sản phẩm đã chọn, số lượng và kiểm tra tạm tính trước khi thanh toán
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Item List */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200/90 p-4 flex flex-col sm:flex-row items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <Link href={`/products/${item.slug}`} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain bg-slate-50 p-1.5 rounded-lg border border-slate-100 shrink-0 hover:opacity-85 transition"
                  />
                </Link>
                <div>
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium text-slate-900 hover:text-blue-600 text-xs sm:text-sm line-clamp-2 transition leading-snug"
                  >
                    {item.name}
                  </Link>
                  <p className="text-slate-900 font-bold text-xs sm:text-sm mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>

              {/* Quantity & Delete */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="px-2.5 py-1 text-xs font-bold text-slate-900 min-w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs sm:text-sm font-bold text-slate-900 min-w-[90px] text-right">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  title="Xoá khỏi giỏ"
                  className="text-slate-400 hover:text-red-600 transition p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 h-fit space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Tóm Tắt Đơn Hàng
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính ({cart.length} món):</span>
              <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển:</span>
              <span className="text-slate-500">Tính tại trang thanh toán</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-sm">Tổng cộng:</span>
              <span className="text-xl font-black text-red-600">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition text-xs"
          >
            <span>Tiến Hành Đặt Hàng</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/products"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition text-xs"
          >
            ← Tiếp tục chọn sản phẩm
          </Link>

          <div className="flex items-center gap-2 text-[10px] text-slate-500 justify-center pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Thanh toán an toàn đạt chuẩn PCI DSS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
