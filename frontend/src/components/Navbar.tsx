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
  Flame,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { getCart } from '@/lib/cart-store';
import { getCompareList } from '@/lib/compare-store';
import { useAuth } from '@/lib/auth-context';

const QUICK_CATEGORIES = [
  { name: 'Tất cả sản phẩm', slug: '', icon: LayoutGrid },
  { name: 'Điện Thoại', slug: 'dien-thoai-tablet' },
  { name: 'Laptop Gaming', slug: 'laptop-gaming' },
  { name: 'Điện Lạnh Inverter', slug: 'dien-lanh' },
  { name: 'Gia Dụng Bếp', slug: 'gia-dung' },
  { name: 'Tivi & Loa', slug: 'tivi-am-thanh' },
  { name: 'Nhà Thông Minh', slug: 'smart-home' },
  { name: 'Phụ Kiện', slug: 'phu-kien' },
];

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      {/* 1. TOP UTILITY BAR (Hotline, Showroom & Tra cứu) */}
      <div className="bg-slate-950 text-slate-300 text-[11px] font-medium hidden md:block border-b border-slate-800">
        <div className="container mx-auto px-4 h-7 flex items-center justify-between">
          {/* Left: Hotline & Showroom */}
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3 h-3 text-red-400" />
              Tổng đài tư vấn: <strong className="text-white font-bold tracking-wide">1800 6868</strong> (Miễn phí 8:00 - 21:30)
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">Cam kết 100% Chính Hãng VN/A & VAT</span>
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
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>So sánh máy</span>
              {compareCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {compareCount}
                </span>
              )}
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                href="/portal"
                className="flex items-center gap-1 bg-gradient-to-r from-purple-700 to-indigo-700 hover:opacity-90 text-white text-[10px] font-bold px-2 py-0.5 rounded transition shadow-sm"
              >
                <span>Cổng Quản Trị</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR (Logo, Search, Cart & User Auth) */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
          <div className="flex items-baseline">
            <span className="font-black text-2xl tracking-tight text-slate-950 group-hover:text-blue-600 transition">
              TechStore
            </span>
            <span className="ml-1.5 text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-1.5 py-0.5 rounded shadow-sm">
              VN
            </span>
          </div>
        </Link>

        {/* Search Bar - Center Modern Retail Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden md:block">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm iPhone 16 Pro Max, RTX 4080, Tủ lạnh Inverter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100/60 transition shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-[11px] font-bold transition shadow-sm"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Compare Button (Desktop & Tablet) */}
          <Link
            href="/compare"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100/80 rounded-xl transition text-xs font-semibold"
            title="So sánh sản phẩm đã chọn"
          >
            <div className="relative">
              <Scale className="w-4 h-4 text-slate-600" />
              {compareCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </div>
            <span>So sánh</span>
          </Link>

          {/* Cart Button */}
          <Link
            href="/cart"
            className="flex items-center gap-2 px-3 py-2 bg-slate-100/90 hover:bg-blue-50 text-slate-800 hover:text-blue-700 rounded-xl transition border border-slate-200/70"
            title="Xem giỏ hàng"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-slate-800" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white text-[10px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold">Giỏ hàng</span>
          </Link>

          {/* User Auth Section */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition text-slate-800 border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 bg-gradient-to-tr from-slate-900 to-slate-700 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-sm">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <p className="font-bold text-slate-900 max-w-[110px] truncate leading-tight">
                    {user.fullName || user.email.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize">
                    {user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
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
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>Tài khoản & Sổ địa chỉ</span>
                  </Link>

                  <Link
                    href="/don-hang-cua-toi"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
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
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
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
                className="px-3 py-1.5 text-xs text-slate-700 hover:text-blue-600 font-bold transition"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. SUBNAV CATEGORY BAR (Cuộn ngang tiện lợi, nhanh chóng) */}
      <div className="border-t border-slate-100 bg-white/70 py-2 hidden sm:block">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 overflow-x-auto text-xs font-semibold text-slate-600 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            {QUICK_CATEGORIES.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.slug ? `/products?categoryId=${cat.slug}` : '/products'}
                className="px-3 py-1 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition whitespace-nowrap text-slate-700 font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition font-bold text-xs"
            >
              <Flame className="w-3.5 h-3.5 fill-red-600" />
              <span>Deal Sốc Hôm Nay</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. MOBILE MENU & SEARCH POPUP */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-16 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg font-bold"
            >
              Tìm
            </button>
          </form>

          <nav className="flex flex-col space-y-1 pt-1 text-xs font-bold text-slate-700">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Tất cả sản phẩm</span>
              <span className="text-[11px] text-blue-600">Xem ngay &rarr;</span>
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>So sánh sản phẩm</span>
              {compareCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {compareCount}
                </span>
              )}
            </Link>
            <Link
              href="/tra-cuu-bao-hanh"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Tra cứu bảo hành điện tử
            </Link>
            <Link
              href="/tra-cuu-don-hang"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Tra cứu vận đơn GHN / GHTK
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
