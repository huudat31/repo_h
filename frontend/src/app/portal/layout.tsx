'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Store,
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Tag,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
  Loader2,
  ChevronRight,
  User,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/portal', label: 'Tổng Quan & Thống Kê', icon: LayoutDashboard },
  { href: '/portal/products', label: 'Quản Lý Sản Phẩm', icon: Package },
  { href: '/portal/categories', label: 'Quản Lý Danh Mục', icon: FolderTree },
  { href: '/portal/orders', label: 'Quản Lý Đơn Hàng', icon: ShoppingBag },
  { href: '/portal/vouchers', label: 'Khuyến Mãi & Voucher', icon: Tag },
  { href: '/portal/warranty', label: 'Bảo Hành & Đổi Trả', icon: ShieldCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 gap-2 text-sm">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span>Đang kiểm tra quyền truy cập...</span>
      </div>
    );
  }

  // Chặn nếu chưa đăng nhập hoặc không phải ADMIN
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 p-8 md:p-10 text-center space-y-5 shadow-sm">
          <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Khu Vực Hạn Chế</h1>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Bạn không có quyền truy cập vào phân hệ này hoặc phiên làm việc đã hết hạn. Vui lòng đăng nhập bằng tài khoản được phân quyền.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/login?redirect=/portal"
              className="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm transition"
            >
              Đăng Nhập
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
            >
              Về Trang Chủ Khách Hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-gray-900 text-white h-16 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 font-bold text-base">
          <Store className="w-5 h-5 text-blue-400" />
          <span>TechStore Portal</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-gray-900 text-white flex flex-col justify-between shrink-0 z-50 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Admin Brand */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wide block">TechStore VN</span>
              <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase">Cổng Quản Trị Hệ Thống</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/portal' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-blue-400 hover:bg-gray-800/60 rounded-xl transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Về Cửa Hàng (Storefront)</span>
          </Link>

          <div className="flex items-center justify-between p-2.5 bg-gray-800 rounded-xl">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                A
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-200 truncate">{user.fullName || 'Admin'}</p>
                <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Đăng xuất"
              className="text-gray-400 hover:text-red-400 p-1.5 transition shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
