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
  ArrowRight,
  Smartphone,
  Laptop,
  Tv,
  Refrigerator,
  Zap,
} from 'lucide-react';
import { getCart } from '@/lib/cart-store';
import { getCompareList } from '@/lib/compare-store';
import { useAuth } from '@/lib/auth-context';
import { CURATED_CATEGORIES } from '@/lib/curated-products';

const QUICK_CATEGORIES = [
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
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

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
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      {/* 1. TOP UTILITY BAR (Tăng độ tương phản chữ, sắc nét dễ đọc) */}
      <div className="bg-slate-950 text-slate-200 text-xs font-medium hidden md:block border-b border-slate-800">
        <div className="container mx-auto px-4 h-8 flex items-center justify-between">
          {/* Left: Hotline & Showroom */}
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              Tổng đài tư vấn: <strong className="text-white font-bold tracking-wide">1800 6868</strong> (Miễn phí 8:00 - 21:30)
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Chính Hãng VN/A & Xuất Hóa Đơn VAT
            </span>
          </div>

          {/* Right: Quick Services */}
          <div className="flex items-center gap-5 text-slate-200 font-medium">
            <Link
              href="/tra-cuu-bao-hanh"
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tra cứu bảo hành</span>
            </Link>

            <Link
              href="/tra-cuu-don-hang"
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>Tra cứu đơn hàng</span>
            </Link>

            <Link
              href="/compare"
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>So sánh máy</span>
              {compareCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
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

      {/* 2. MAIN NAVIGATION BAR (Logo, Search, Cart & Unified Account Button) */}
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
              className="w-full pl-10 pr-24 py-2.5 bg-slate-100/90 hover:bg-slate-100 border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100/60 transition shadow-inner"
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
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Compare Button */}
          <Link
            href="/compare"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100/80 rounded-xl transition text-xs font-semibold"
            title="So sánh thông số máy"
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

          {/* Cart Button (Rõ nét, badge đỏ nổi bật) */}
          <Link
            href="/cart"
            className="flex items-center gap-2 px-3 py-2 bg-slate-100/90 hover:bg-blue-50 text-slate-800 hover:text-blue-700 rounded-xl transition border border-slate-200/70 relative group"
            title="Xem giỏ hàng"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-slate-800 group-hover:text-blue-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[11px] font-black rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shadow-md border-2 border-white animate-scale">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold">Giỏ hàng</span>
          </Link>

          {/* Unified Account Dropdown Menu (Gộp Đăng nhập & Đăng ký thành 1 menu gọn gàng) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100/90 hover:bg-slate-200/80 text-slate-800 rounded-xl transition border border-slate-200/70 text-xs font-bold"
            >
              <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                {user ? (user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U') : <UserIcon className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden sm:inline max-w-[90px] truncate">
                {user ? (user.fullName || user.email.split('@')[0]) : 'Tài khoản'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Dropdown Box */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
                      <p className="text-xs font-black text-slate-900 truncate">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 uppercase">
                        {user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng thân thiết'}
                      </span>
                    </div>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/portal"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition"
                      >
                        <ShieldAlert className="w-4 h-4 text-purple-600" />
                        <span>Cổng Quản Trị Hệ Thống</span>
                      </Link>
                    )}

                    <Link
                      href="/tai-khoan"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>Thông tin tài khoản & Sổ địa chỉ</span>
                    </Link>

                    <Link
                      href="/don-hang-cua-toi"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>Lịch sử đơn hàng</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <div className="p-3 space-y-3">
                    <div className="text-center pb-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">Chào mừng bạn đến với TechStore</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Đăng nhập để theo dõi đơn hàng & ưu đãi</p>
                    </div>

                    <Link
                      href="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold text-xs rounded-xl shadow transition"
                    >
                      Đăng Nhập Ngay
                    </Link>

                    <div className="text-center text-xs text-slate-600">
                      <span>Chưa có tài khoản? </span>
                      <Link
                        href="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="font-bold text-blue-600 hover:underline"
                      >
                        Đăng ký miễn phí
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-2 space-y-1 text-xs">
                      <Link
                        href="/tra-cuu-don-hang"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
                      >
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Tra cứu vận đơn (không cần đăng nhập)</span>
                      </Link>
                      <Link
                        href="/tra-cuu-bao-hanh"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Tra cứu bảo hành theo Serial/IMEI</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

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

      {/* 3. SUBNAV CATEGORY BAR & MEGA-MENU FLYOUT */}
      <div className="border-t border-slate-100 bg-white/80 py-2 hidden sm:block relative">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Mega-Menu Trigger Button */}
            <div
              className="relative"
              ref={megaMenuRef}
              onMouseEnter={() => setMegaMenuOpen(true)}
            >
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition border ${
                  megaMenuOpen
                    ? 'bg-slate-950 text-white border-slate-950'
                    : 'bg-slate-100 hover:bg-slate-200/90 text-slate-800 border-slate-200'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-blue-600" />
                <span>Danh Mục Sản Phẩm</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega-Menu Flyout (Bung ra phân cấp đẹp mắt khi hover) */}
              {megaMenuOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-[780px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-6 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setMegaMenuOpen(false)}
                >
                  <div className="grid grid-cols-3 gap-6 pb-5 border-b border-slate-100">
                    {/* Cột 1: Điện thoại & Laptop */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 mb-2">
                          <Smartphone className="w-4 h-4" />
                          <span>Điện Thoại & Tablet</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          <li>
                            <Link href="/products?brandSlug=apple" className="hover:text-blue-600 transition font-medium">
                              iPhone 16 Series Chính Hãng
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=samsung" className="hover:text-blue-600 transition font-medium">
                              Samsung Galaxy S24 Ultra AI
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?categoryId=dien-thoai-tablet" className="hover:text-blue-600 transition font-medium">
                              iPad Pro M4 Tandem OLED
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 mb-2">
                          <Laptop className="w-4 h-4" />
                          <span>Laptop Gaming & Đồ Họa</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          <li>
                            <Link href="/products?brandSlug=asus-rog" className="hover:text-blue-600 transition font-medium">
                              ASUS ROG Zephyrus G16 OLED
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=apple" className="hover:text-blue-600 transition font-medium">
                              MacBook Pro 14 M3 Pro
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Cột 2: Điện lạnh & Gia dụng */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 mb-2">
                          <Refrigerator className="w-4 h-4" />
                          <span>Điện Lạnh Inverter</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          <li>
                            <Link href="/products?brandSlug=daikin" className="hover:text-blue-600 transition font-medium">
                              Điều Hòa Daikin Inverter 1.5 HP
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=panasonic" className="hover:text-blue-600 transition font-medium">
                              Máy Giặt Sấy Panasonic 10.5kg
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=lg" className="hover:text-blue-600 transition font-medium">
                              Tủ Lạnh LG InstaView 617L
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 mb-2">
                          <Zap className="w-4 h-4" />
                          <span>Gia Dụng Bếp Thông Minh</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          <li>
                            <Link href="/products?brandSlug=philips" className="hover:text-blue-600 transition font-medium">
                              Nồi Chiên Philips XXL 7.2L
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=bosch" className="hover:text-blue-600 transition font-medium">
                              Máy Rửa Bát Bosch Series 6
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Cột 3: Tivi & Smart Home */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 mb-2">
                          <Tv className="w-4 h-4" />
                          <span>Tivi & Âm Thanh Cao Cấp</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          <li>
                            <Link href="/products?brandSlug=sony" className="hover:text-blue-600 transition font-medium">
                              Smart Tivi Sony Bravia OLED 4K
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=sony" className="hover:text-blue-600 transition font-medium">
                              Loa Soundbar Sony 7.1.2 Atmos
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 mb-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Nhà Thông Minh & Robot</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          <li>
                            <Link href="/products?brandSlug=ecovacs" className="hover:text-blue-600 transition font-medium">
                              Robot Hút Bụi Ecovacs T30 Pro
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=dyson" className="hover:text-blue-600 transition font-medium">
                              Máy Lọc Không Khí Dyson HP07
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Mega-Menu Bottom Promo Banner */}
                  <div className="mt-4 pt-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">
                      🎁 Thu cũ đổi mới trợ giá đến <strong>2 Triệu</strong> · Giao hàng siêu tốc 2H
                    </span>
                    <Link
                      href="/products"
                      onClick={() => setMegaMenuOpen(false)}
                      className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>Xem toàn bộ 24+ sản phẩm</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Category Pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold text-slate-700 scrollbar-none">
              {QUICK_CATEGORIES.map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/products?categoryId=${cat.slug}`}
                  className="px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Deal Sốc Hôm Nay (Nổi bật, có badge lửa nhấp nháy thu hút sự chú ý) */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/products"
              className="group relative flex items-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-95 font-black text-xs"
            >
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" />
              <span>DEAL SỐC HÔM NAY</span>
              <span className="bg-white/20 text-[10px] font-bold px-1.5 py-0.2 rounded-md uppercase">
                HOT
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. MOBILE MENU POPUP */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
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

          <nav className="flex flex-col space-y-1.5 text-xs font-bold text-slate-700">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-blue-600" />
                <span>Tất cả sản phẩm</span>
              </span>
              <span className="text-[11px] text-blue-600">Xem ngay &rarr;</span>
            </Link>

            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Flame className="w-4 h-4 fill-red-600" />
                <span>Deal Sốc Hôm Nay</span>
              </span>
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded">Giảm 50%</span>
            </Link>

            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between"
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
              className="px-3 py-2.5 rounded-xl hover:bg-slate-100"
            >
              Tra cứu bảo hành điện tử
            </Link>

            <Link
              href="/tra-cuu-don-hang"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-100"
            >
              Tra cứu vận đơn GHN / GHTK
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
