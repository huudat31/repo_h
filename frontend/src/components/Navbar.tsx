'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Store, ShieldCheck, Scale, Truck } from 'lucide-react';
import { getCart } from '@/lib/cart-store';
import { getCompareList } from '@/lib/compare-store';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const updateCart = () => {
      const cart = getCart();
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };

    const updateCompare = () => {
      setCompareCount(getCompareList().length);
    };

    updateCart();
    updateCompare();

    window.addEventListener('cart_updated', updateCart);
    window.addEventListener('compare_updated', updateCompare);

    return () => {
      window.removeEventListener('cart_updated', updateCart);
      window.removeEventListener('compare_updated', updateCompare);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 shrink-0">
          <Store className="w-6 h-6 text-blue-600" />
          <span>TechStore VN</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative hidden sm:block">
          <input
            type="text"
            placeholder="Tìm Panasonic, Philips, Inverter, nồi chiên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </form>

        {/* Navigation Items */}
        <div className="flex items-center gap-4 md:gap-6 text-xs font-semibold text-gray-700">
          <Link href="/products" className="hover:text-blue-600 transition hidden md:inline">
            Sản phẩm
          </Link>

          <Link
            href="/compare"
            className="flex items-center gap-1 hover:text-blue-600 transition relative"
            title="So sánh sản phẩm"
          >
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">So sánh</span>
            {compareCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {compareCount}
              </span>
            )}
          </Link>

          <Link
            href="/tra-cuu-bao-hanh"
            className="flex items-center gap-1 hover:text-blue-600 transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Bảo hành điện tử</span>
          </Link>

          <Link
            href="/tra-cuu-don-hang"
            className="flex items-center gap-1 hover:text-blue-600 transition hidden lg:flex"
          >
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Tra cứu đơn</span>
          </Link>

          {/* Cart Icon */}
          <Link href="/cart" className="relative p-1.5 text-gray-700 hover:text-blue-600 transition">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
