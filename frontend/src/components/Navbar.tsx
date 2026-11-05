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
  PhoneCall,
  Smartphone,
  Laptop,
  Tv,
  Refrigerator,
  Zap,
  Sparkles,
  ArrowRight,
  Tag,
} from 'lucide-react';
import { getCart } from '@/lib/cart-store';
import { getCompareList } from '@/lib/compare-store';
import { useAuth } from '@/lib/auth-context';

const NAV_LINKS = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Điện thoại', href: '/products?categoryId=dien-thoai-tablet' },
  { name: 'Laptop', href: '/products?categoryId=laptop-gaming' },
  { name: 'Điện lạnh', href: '/products?categoryId=dien-lanh' },
  { name: 'Gia dụng', href: '/products?categoryId=gia-dung' },
  { name: 'Tivi & Loa', href: '/products?categoryId=tivi-am-thanh' },
  { name: 'Phụ kiện', href: '/products?categoryId=phu-kien' },
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
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
      {/* ============================================================== */}
      {/* A. TOP INFORMATION BAR (Compact, Clean & Light #F9FAFB) */}
      {/* ============================================================== */}
      <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[11px] font-medium text-[#4B5563] hidden md:block">
        <div className="container mx-auto px-4 h-8 flex items-center justify-between">
          {/* Left: Support & Guarantees */}
          <div className="flex items-center gap-4 text-[#4B5563]">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#2563EB]" />
              Tổng đài tư vấn: <strong className="text-[#111827] font-bold">1800 6868</strong> (Miễn phí 8:00 - 21:30)
            </span>
            <span className="text-[#D1D5DB]">|</span>
            <span className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              100% Chính Hãng VN/A & Xuất Hóa Đơn VAT
            </span>
            <span className="text-[#D1D5DB]">|</span>
            <span className="flex items-center gap-1.5 text-[#4B5563]">
              <Truck className="w-3.5 h-3.5 text-[#2563EB]" />
              Giao hàng nhanh toàn quốc
            </span>
          </div>

          {/* Right: Quick Utilities */}
          <div className="flex items-center gap-5 font-medium text-[#4B5563]">
            <Link
              href="/tra-cuu-bao-hanh"
              className="flex items-center gap-1.5 hover:text-[#2563EB] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Tra cứu bảo hành</span>
            </Link>

            <Link
              href="/tra-cuu-don-hang"
              className="flex items-center gap-1.5 hover:text-[#2563EB] transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Tra cứu đơn hàng</span>
            </Link>

            <Link
              href="/compare"
              className="flex items-center gap-1.5 hover:text-[#2563EB] transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>So sánh máy</span>
              {compareCount > 0 && (
                <span className="bg-[#2563EB] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {compareCount}
                </span>
              )}
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                href="/portal"
                className="flex items-center gap-1 bg-[#111827] hover:bg-[#1F2937] text-white text-[10px] font-bold px-2 py-0.5 rounded transition"
              >
                <span>Cổng Quản Trị</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* B. MAIN HEADER (Logo, Large Search Bar, Action Buttons) */}
      {/* ============================================================== */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
          <div className="flex items-baseline">
            <span className="font-extrabold text-2xl tracking-tight text-[#111827] group-hover:text-[#2563EB] transition-colors">
              TechStore
            </span>
            <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider bg-[#2563EB] text-white px-1.5 py-0.5 rounded">
              VN
            </span>
          </div>
        </Link>

        {/* Center Large Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative hidden md:block">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm iPhone 16 Pro Max, Laptop Gaming, Tủ lạnh Inverter, Robot hút bụi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-[#F5F7FA] hover:bg-[#EFF2F6] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 transition-all"
            />
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Right Action Icons: Compare, Cart & Unified Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Compare Button */}
          <Link
            href="/compare"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-[#4B5563] hover:text-[#2563EB] hover:bg-[#F5F7FA] rounded-xl transition text-xs font-medium"
            title="So sánh sản phẩm"
          >
            <div className="relative">
              <Scale className="w-4 h-4 text-[#4B5563]" />
              {compareCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#2563EB] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </div>
            <span>So sánh</span>
          </Link>

          {/* Cart Button */}
          <Link
            href="/cart"
            className="flex items-center gap-2 px-3 py-2 bg-[#F5F7FA] hover:bg-blue-50 text-[#111827] hover:text-[#2563EB] rounded-xl transition border border-[#E5E7EB] relative group"
            title="Xem giỏ hàng"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 text-[#111827] group-hover:text-[#2563EB] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-[#EF4444] text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-semibold">Giỏ hàng</span>
          </Link>

          {/* User Account Button & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#F5F7FA] hover:bg-[#EFF2F6] text-[#111827] rounded-xl transition border border-[#E5E7EB] text-xs font-semibold"
            >
              <div className="w-5 h-5 rounded-full bg-[#111827] text-white flex items-center justify-center text-[10px] font-bold">
                {user ? (user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U') : <UserIcon className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden sm:inline max-w-[90px] truncate">
                {user ? (user.fullName || user.email.split('@')[0]) : 'Tài khoản'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>

            {/* Account Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-[#F3F4F6] bg-[#F9FAFB] rounded-t-xl">
                      <p className="text-xs font-bold text-[#111827] truncate">{user.fullName}</p>
                      <p className="text-[11px] text-[#6B7280] truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng thân thiết'}
                      </span>
                    </div>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/portal"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#6D28D9] bg-purple-50 hover:bg-purple-100 transition"
                      >
                        <ShieldAlert className="w-4 h-4 text-[#6D28D9]" />
                        <span>Cổng Quản Trị Hệ Thống</span>
                      </Link>
                    )}

                    <Link
                      href="/tai-khoan"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] hover:text-[#2563EB] transition"
                    >
                      <UserIcon className="w-4 h-4 text-[#9CA3AF]" />
                      <span>Thông tin tài khoản & Sổ địa chỉ</span>
                    </Link>

                    <Link
                      href="/don-hang-cua-toi"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] hover:text-[#2563EB] transition"
                    >
                      <Package className="w-4 h-4 text-[#9CA3AF]" />
                      <span>Lịch sử đơn hàng</span>
                    </Link>

                    <div className="border-t border-[#F3F4F6] my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#EF4444] hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4 text-[#EF4444]" />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <div className="p-3 space-y-3">
                    <div className="text-center pb-2 border-b border-[#F3F4F6]">
                      <p className="text-xs font-bold text-[#111827]">Chào mừng bạn đến với TechStore</p>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">Đăng nhập để theo dõi đơn hàng & tích điểm</p>
                    </div>

                    <Link
                      href="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-center font-bold text-xs rounded-xl transition"
                    >
                      Đăng Nhập
                    </Link>

                    <div className="text-center text-xs text-[#6B7280]">
                      <span>Chưa có tài khoản? </span>
                      <Link
                        href="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="font-bold text-[#2563EB] hover:underline"
                      >
                        Đăng ký ngay
                      </Link>
                    </div>

                    <div className="border-t border-[#F3F4F6] pt-2 space-y-1 text-xs">
                      <Link
                        href="/tra-cuu-don-hang"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#2563EB] transition"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        <span>Tra cứu vận đơn (không cần login)</span>
                      </Link>
                      <Link
                        href="/tra-cuu-bao-hanh"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#2563EB] transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#9CA3AF]" />
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
            className="md:hidden p-2 text-[#4B5563] hover:text-[#111827] hover:bg-[#F5F7FA] rounded-xl transition"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* C. NAVIGATION MENU (Clean White Horizontal Bar) */}
      {/* ============================================================== */}
      <div className="border-t border-[#E5E7EB] bg-white py-2 hidden sm:block relative">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mega-Menu Trigger Button */}
            <div
              className="relative"
              ref={megaMenuRef}
              onMouseEnter={() => setMegaMenuOpen(true)}
            >
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs transition border ${
                  megaMenuOpen
                    ? 'bg-[#111827] text-white border-[#111827]'
                    : 'bg-[#F5F7FA] hover:bg-[#EFF2F6] text-[#111827] border-[#E5E7EB]'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-[#2563EB]" />
                <span>Tất Cả Danh Mục</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega-Menu Flyout */}
              {megaMenuOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-[760px] bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-6 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setMegaMenuOpen(false)}
                >
                  <div className="grid grid-cols-3 gap-6 pb-5 border-b border-[#F3F4F6]">
                    {/* Cột 1: Điện thoại & Laptop */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#2563EB] mb-2">
                          <Smartphone className="w-4 h-4" />
                          <span>Điện Thoại & Tablet</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#4B5563]">
                          <li>
                            <Link href="/products?brandSlug=apple" className="hover:text-[#2563EB] transition">
                              iPhone 16 Series VN/A
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=samsung" className="hover:text-[#2563EB] transition">
                              Samsung Galaxy S24 Ultra AI
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?categoryId=dien-thoai-tablet" className="hover:text-[#2563EB] transition">
                              iPad Pro M4 Tandem OLED
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#2563EB] mb-2">
                          <Laptop className="w-4 h-4" />
                          <span>Laptop Gaming & Đồ Họa</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#4B5563]">
                          <li>
                            <Link href="/products?brandSlug=asus-rog" className="hover:text-[#2563EB] transition">
                              ASUS ROG Zephyrus G16
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=apple" className="hover:text-[#2563EB] transition">
                              MacBook Pro 14 M3 Pro
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Cột 2: Điện lạnh & Gia dụng */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#2563EB] mb-2">
                          <Refrigerator className="w-4 h-4" />
                          <span>Điện Lạnh Inverter</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#4B5563]">
                          <li>
                            <Link href="/products?brandSlug=daikin" className="hover:text-[#2563EB] transition">
                              Điều Hòa Daikin Inverter 1.5 HP
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=panasonic" className="hover:text-[#2563EB] transition">
                              Máy Giặt Sấy Panasonic 10.5kg
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=lg" className="hover:text-[#2563EB] transition">
                              Tủ Lạnh LG InstaView 617L
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#2563EB] mb-2">
                          <Zap className="w-4 h-4" />
                          <span>Gia Dụng Bếp</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#4B5563]">
                          <li>
                            <Link href="/products?brandSlug=philips" className="hover:text-[#2563EB] transition">
                              Nồi Chiên Philips XXL 7.2L
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=bosch" className="hover:text-[#2563EB] transition">
                              Máy Rửa Bát Bosch Series 6
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Cột 3: Tivi & Smart Home */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#2563EB] mb-2">
                          <Tv className="w-4 h-4" />
                          <span>Tivi & Âm Thanh</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#4B5563]">
                          <li>
                            <Link href="/products?brandSlug=sony" className="hover:text-[#2563EB] transition">
                              Smart Tivi Sony OLED Bravia 4K
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=sony" className="hover:text-[#2563EB] transition">
                              Loa Soundbar Sony 7.1.2 Atmos
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#2563EB] mb-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Nhà Thông Minh & Robot</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#4B5563]">
                          <li>
                            <Link href="/products?brandSlug=ecovacs" className="hover:text-[#2563EB] transition">
                              Robot Hút Bụi Ecovacs T30 Pro
                            </Link>
                          </li>
                          <li>
                            <Link href="/products?brandSlug=dyson" className="hover:text-[#2563EB] transition">
                              Máy Lọc Không Khí Dyson HP07
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Mega-Menu Bottom Promo Banner */}
                  <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[#4B5563]">
                    <span>
                      Cam kết 100% chính hãng · Giao hàng siêu tốc 2H · 1 đổi 1 trong 30 ngày
                    </span>
                    <Link
                      href="/products"
                      onClick={() => setMegaMenuOpen(false)}
                      className="font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1"
                    >
                      <span>Khám phá toàn bộ 42 sản phẩm</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Clean Horizontal Links */}
            <nav className="flex items-center gap-1 overflow-x-auto text-xs font-semibold text-[#4B5563] scrollbar-none">
              {NAV_LINKS.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg hover:text-[#2563EB] hover:bg-[#F5F7FA] transition whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Khuyến Mãi (Clean Red Accent Button) */}
          <div className="flex items-center shrink-0">
            <Link
              href="/products"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#EF4444] bg-red-50 hover:bg-red-100 transition border border-red-200"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Khuyến Mãi Hot</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE DRAWER */}
      {/* ============================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white p-4 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
            />
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
          </form>

          <nav className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#374151]">
            {NAV_LINKS.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#F9FAFB] hover:bg-blue-50 hover:text-[#2563EB] transition"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[#F3F4F6] pt-3 flex flex-col gap-2 text-xs">
            <Link
              href="/tra-cuu-bao-hanh"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-[#4B5563] hover:text-[#2563EB]"
            >
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>Tra cứu bảo hành theo Serial/IMEI</span>
            </Link>
            <Link
              href="/tra-cuu-don-hang"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-[#4B5563] hover:text-[#2563EB]"
            >
              <Truck className="w-4 h-4 text-[#2563EB]" />
              <span>Tra cứu lộ trình đơn hàng</span>
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-[#4B5563] hover:text-[#2563EB]"
            >
              <Scale className="w-4 h-4 text-[#F59E0B]" />
              <span>So sánh thông số máy ({compareCount})</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
