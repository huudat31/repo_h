'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/formatters';
import { fetchApi } from '@/lib/api';

const STEPS = [
  { key: 'PENDING', label: 'Chờ xác nhận' },
  { key: 'CONFIRMED', label: 'Đã xác nhận' },
  { key: 'PROCESSING', label: 'Đang đóng gói' },
  { key: 'SHIPPING', label: 'Đang vận chuyển' },
  { key: 'COMPLETED', label: 'Giao thành công' },
];

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('orderCode') || '';

  const [orderCode, setOrderCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const executeTrack = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;

    setLoading(true);
    setSearched(true);
    setError('');

    try {
      const data = await fetchApi<any>(`/orders/${encodeURIComponent(codeToSearch.trim())}`);
      setOrder(data);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || 'Không tìm thấy đơn hàng tương ứng với mã đã nhập');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      executeTrack(initialCode);
    }
  }, [initialCode]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    executeTrack(orderCode);
  };

  const currentStepIndex = order
    ? STEPS.findIndex((s) => s.key === order.status) !== -1
      ? STEPS.findIndex((s) => s.key === order.status)
      : 1
    : 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
        <span>/</span>
        <Link href="/don-hang-cua-toi" className="hover:text-blue-600 transition">Đơn hàng của tôi</Link>
        <span>/</span>
        <span className="font-semibold text-gray-800">Tra cứu đơn hàng</span>
      </div>

      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
          <Truck className="w-4 h-4 text-blue-600" />
          <span>Theo Dõi Vận Đơn Thời Gian Thực (GHN / GHTK)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Tra Cứu Trạng Thái Đơn Hàng</h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Nhập mã đơn hàng của bạn (VD: ORD-xxxxxx-xxxx) để theo dõi tiến độ đóng gói và hành trình vận chuyển thực tế.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleTrack} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            required
            placeholder="Nhập mã đơn hàng..."
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl text-xs sm:text-sm font-mono uppercase font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50"
        >
          {loading ? 'Đang tìm...' : 'Tra Cứu'}
        </button>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2.5 max-w-xl mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Result */}
      {order && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
            <div>
              <span className="text-xs text-gray-400">Mã đơn hàng:</span>
              <h3 className="text-lg font-mono font-extrabold text-blue-600">{order.orderCode}</h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400">Ngày đặt hàng:</span>
              <p className="text-xs font-bold text-gray-700">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="py-4">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 w-full -z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 -z-0"
                style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
              />

              {STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                        isPassed
                          ? 'bg-blue-600 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-semibold mt-2 text-center max-w-[80px] ${
                        isCurrent ? 'text-blue-600 font-bold' : isPassed ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logistics tracking details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs">
            <div>
              <span className="text-gray-500 block">Kênh vận chuyển:</span>
              <strong className="text-gray-900 text-sm">{order.shippingCarrier || 'Giao Hàng Nhanh (GHN)'}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Mã vận đơn đối soát:</span>
              <strong className="text-blue-600 text-sm font-mono">{order.shippingTrackingCode || 'Đang cập nhật mã vận đơn'}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Người nhận:</span>
              <strong className="text-gray-900">{order.recipientName} ({order.recipientPhone})</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Tổng thanh toán:</span>
              <strong className="text-red-600 font-bold text-sm">{formatPrice(order.finalAmount)}</strong>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-700">Chi tiết sản phẩm ({order.items?.length || 0}):</h4>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl p-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-2 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-gray-800">{item.productName}</span>
                    <span className="text-gray-400 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 text-xs">
            <Link
              href={`/tra-cuu-bao-hanh?keyword=${encodeURIComponent(order.recipientPhone)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tra Cứu Bảo Hành Thiết Bị</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/don-hang-cua-toi"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
              >
                Danh Sách Đơn Hàng
              </Link>
              <Link
                href="/products"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow"
              >
                Mua Thêm Sản Phẩm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-xs text-gray-400">Đang tải trang tra cứu đơn...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
