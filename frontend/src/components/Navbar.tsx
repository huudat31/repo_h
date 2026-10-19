'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  ShieldCheck,
  Scale,
  Truck,
  User as UserIcon,
  LogOut,
  Package,
  ChevronDown,
  LayoutGrid,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import { getCart } from '@/lib/cart-store';
import { getCompareList } from '@/lib/compare-store';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('cart_updated', updateCart);
      window.removeEventListener('compare_updated', updateCompare);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      {/* 1. TOP UTILITY BAR (Tầng 1 - Thông tin hỗ trợ & Tra cứu) */}
      <div className="bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px] font-medium hidden md:block">
        <div className="container mx-auto px-4 h-8 flex items-center justify-between">
          {/* Left: Hotline & Showroom */}
          <div className="flex items-center gap-4 text-slate-400">
            <span>
              Tổng đài tư vấn: <strong className="text-white font-semibold">1800 6868</strong> (Miễn phí 8:00 - 21:30)
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">Hệ thống showroom chính hãng toàn quốc</span>
          </div>

          {/* Right: Quick Services */}
          <div className="flex items-center gap-5">
            <Link
              href="/tra-cuu-bao-hanh"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tra cứu bảo hành</span>
            </Link>

            <Link
              href="/tra-cuu-don-hang"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition"
            >
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>Tra cứu đơn hàng</span>
            </Link>

            <Link
              href="/compare"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition"
            >
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              <span>So sánh</span>
              {compareCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {compareCount}
                </span>
              )}
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                href="/portal"
                className="flex items-center gap-1 bg-purple-700/80 hover:bg-purple-700 text-white text-[10px] font-bold px-2 py-0.5 rounded transition"
              >
                <span>Cổng Quản Trị</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR (Tầng 2 - Logo, Search, Nav, Cart & Auth) */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
          <div className="flex items-baseline">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition">
              TechStore
            </span>
            <span className="ml-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200/60">
              VN
            </span>
          </div>
        </Link>

        {/* Search Bar - Center Hero Element */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden md:block">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm iPhone 16, MacBook Pro, Sony OLED, Inverter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-20 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1 bg-slate-900 hover:bg-blue-600 text-white rounded text-[11px] font-medium transition"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Products link */}
          <Link
            href="/products"
            className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition py-1"
          >
            <LayoutGrid className="w-4 h-4 text-slate-500" />
            <span>Sản phẩm</span>
          </Link>

          {/* Cart Trigger */}
          <Link
            href="/cart"
            className="flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition"
            title="Xem giỏ hàng"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-semibold">Giỏ hàng</span>
          </Link>

          {/* User Auth Section */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg transition text-slate-800"
              >
                <div className="w-7 h-7 bg-slate-900 text-white rounded-md flex items-center justify-center font-bold text-xs">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <p className="font-semibold text-slate-900 max-w-[120px] truncate leading-tight">
                    {user.fullName || user.email.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize">
                    {user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/portal"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition"
                    >
                      <ShieldAlert className="w-4 h-4 text-purple-600" />
                      <span>Cổng Quản Trị Hệ Thống</span>
                    </Link>
                  )}

                  <Link
                    href="/tai-khoan"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>Tài khoản & Sổ địa chỉ</span>
                  </Link>

                  <Link
                    href="/don-hang-cua-toi"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    <Package className="w-4 h-4 text-slate-400" />
                    <span>Đơn hàng của tôi</span>
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs text-slate-700 hover:text-blue-600 font-semibold transition"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition shadow-sm"
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. MOBILE MENU & SEARCH (Hiển thị khi mở menu trên mobile/tablet) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-16 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 px-2.5 py-1 bg-slate-900 text-white text-[11px] rounded"
            >
              Tìm
            </button>
          </form>

          <nav className="flex flex-col space-y-1 pt-1 text-xs font-semibold text-slate-700">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2.5 py-2 rounded-md hover:bg-slate-100"
            >
              Tất cả sản phẩm
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2.5 py-2 rounded-md hover:bg-slate-100 flex items-center justify-between"
            >
              <span>So sánh sản phẩm</span>
              {compareCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {compareCount}
                </span>
              )}
            </Link>
            <Link
              href="/tra-cuu-bao-hanh"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2.5 py-2 rounded-md hover:bg-slate-100"
            >
              Tra cứu bảo hành điện tử
            </Link>
            <Link
              href="/tra-cuu-don-hang"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2.5 py-2 rounded-md hover:bg-slate-100"
            >
              Tra cứu vận đơn GHN / GHTK
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
