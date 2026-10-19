'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/formatters';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Users,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<any>('/admin/stats');
      setStats(data);
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  const handleQuickConfirm = async (orderId: string) => {
    try {
      await fetchApi(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'CONFIRMED' }),
      });
      loadStats();
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật');
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-xs gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span>Đang tổng hợp báo cáo số liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Báo Cáo & Tổng Quan Quản Trị</h1>
        <p className="text-xs text-gray-500 mt-1">
          Theo dõi doanh thu, tình hình vận đơn và cảnh báo tồn kho toàn hệ thống theo thời gian thực
        </p>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doanh thu hôm nay */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Doanh thu hôm nay</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">
            {formatPrice(stats.revenue?.today || 0)}
          </div>
          <div className="text-[11px] text-gray-400">
            Tháng này: <strong className="text-gray-700">{formatPrice(stats.revenue?.thisMonth || 0)}</strong>
          </div>
        </div>

        {/* Đơn hàng chờ xử lý */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Đơn hàng chờ duyệt</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600">
            {stats.counts?.pendingOrders || 0}
          </div>
          <div className="text-[11px] text-gray-400">
            Tổng đơn hệ thống: <strong className="text-gray-700">{stats.counts?.totalOrders || 0} đơn</strong>
          </div>
        </div>

        {/* Sản phẩm sắp hết hàng */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Cảnh báo hết kho (≤ 5)</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-red-600">
            {stats.counts?.lowStockCount || 0}
          </div>
          <div className="text-[11px] text-gray-400">
            Tổng sản phẩm: <strong className="text-gray-700">{stats.counts?.totalProducts || 0} mã</strong>
          </div>
        </div>

        {/* Khách hàng thành viên */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Khách hàng thành viên</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-600">
            {stats.counts?.totalUsers || 0}
          </div>
          <div className="text-[11px] text-gray-400">Tài khoản đã đăng ký trong hệ thống</div>
        </div>
      </div>

      {/* Main Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Đơn hàng mới cần duyệt */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <span>Đơn Hàng Gần Đây Cần Xử Lý</span>
            </h2>
            <Link
              href="/portal/orders"
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders?.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">Chưa có đơn hàng nào</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.recentOrders?.map((order: any) => (
                <div key={order.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600">{order.orderCode}</span>
                      <span className="text-gray-500">• {order.recipientName} ({order.recipientPhone})</span>
                    </div>
                    <p className="text-[11px] text-gray-400">{formatDate(order.createdAt)} • {order.items?.length || 0} sản phẩm</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-extrabold text-gray-900">{formatPrice(order.finalAmount)}</span>
                    {order.status === 'PENDING' ? (
                      <button
                        onClick={() => handleQuickConfirm(order.id)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] transition shadow-sm"
                      >
                        Duyệt đơn
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-md font-bold text-[10px]">
                        {order.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1/3): Cảnh báo tồn kho & Top bán chạy */}
        <div className="space-y-6">
          {/* Cảnh báo tồn kho */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>Sản Phẩm Sắp Hết Kho</span>
            </h3>

            {stats.lowStockProducts?.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">Tất cả sản phẩm đều đủ tồn kho an toàn</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {stats.lowStockProducts?.map((p: any) => (
                  <div key={p.id} className="py-2 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-gray-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">SKU: {p.sku}</p>
                    </div>
                    <span className="font-extrabold text-red-600 px-2 py-0.5 bg-red-50 rounded-full shrink-0 text-[11px]">
                      Còn {p.stock}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top sản phẩm bán chạy */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 text-blue-600">
              <Package className="w-4 h-4" />
              <span>Top Sản Phẩm Bán Chạy</span>
            </h3>

            {stats.topSelling?.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">Chưa phát sinh dữ liệu bán hàng</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {stats.topSelling?.map((item: any, idx: number) => (
                  <div key={item.productId || idx} className="py-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800 line-clamp-1 pr-2">
                      #{idx + 1} {item.productName}
                    </span>
                    <strong className="text-blue-600 shrink-0 font-extrabold">{item.totalSold} đã bán</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
