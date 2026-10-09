'use client';

import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/formatters';
import { fetchApi } from '@/lib/api';

const STEPS = [
  { key: 'PENDING', label: 'Chờ xác nhận' },
  { key: 'CONFIRMED', label: 'Đã xác nhận' },
  { key: 'PROCESSING', label: 'Đang đóng gói' },
  { key: 'SHIPPING', label: 'Đang vận chuyển' },
  { key: 'COMPLETED', label: 'Giao thành công' },
];

export default function OrderTrackingPage() {
  const [orderCode, setOrderCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCode.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const data = await fetchApi<any>(`/orders/${encodeURIComponent(orderCode.trim())}`);
      setOrder(data);
    } catch {
      // Mock result for demo
      setOrder({
        orderCode: orderCode.trim().toUpperCase(),
        recipientName: 'Nguyễn Văn An',
        recipientPhone: '0909123456',
        status: 'SHIPPING',
        totalAmount: 16490000,
        shippingFee: 35000,
        finalAmount: 16525000,
        shippingCarrier: 'GHN',
        shippingTrackingCode: 'GHN88291034',
        createdAt: new Date().toISOString(),
        items: [
          {
            productName: 'Máy Giặt Sấy Panasonic Inverter 10.5 kg NA-V105FR1BV',
            quantity: 1,
            price: 16490000,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order
    ? STEPS.findIndex((s) => s.key === order.status) !== -1
      ? STEPS.findIndex((s) => s.key === order.status)
      : 3
    : 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
          <Truck className="w-4 h-4 text-blue-600" />
          <span>Theo Dõi Vận Đơn Thời Gian Thực (GHN / GHTK)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Tra Cứu Trạng Thái Đơn Hàng</h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Nhập mã đơn hàng của bạn (VD: ORD-982341) để theo dõi tiến độ đóng gói và hành trình vận chuyển.
        </p>
      </div>

      <form onSubmit={handleTrack} className="max-w-2xl mx-auto">
        <div className="flex gap-2 p-1.5 bg-white border-2 border-blue-600 rounded-2xl shadow-lg">
          <input
            type="text"
            required
            placeholder="Nhập mã đơn hàng (VD: ORD-982341)..."
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-3 text-sm focus:outline-none rounded-xl uppercase font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shrink-0 shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Đang tra cứu...' : 'Theo Dõi'}</span>
          </button>
        </div>
      </form>

      {searched && order && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs text-gray-400">Mã đơn hàng:</span>
              <h2 className="text-xl font-extrabold text-blue-600 font-mono">{order.orderCode}</h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400 block">Thời gian tạo:</span>
              <span className="text-xs font-semibold text-gray-700">{formatDate(order.createdAt)}</span>
            </div>
          </div>

          {/* 5-Step Progress Bar */}
          <div className="py-4">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-6 right-6 h-1 bg-gray-200 z-0" />
              <div
                className="absolute top-4 left-6 h-1 bg-blue-600 z-0 transition-all duration-500"
                style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 90}%` }}
              />

              {STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : isPassed
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-400'
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
            <div>
              <span className="text-gray-500 block">Kênh vận chuyển:</span>
              <strong className="text-gray-900 text-sm">{order.shippingCarrier || 'GHN Express'}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Mã vận đơn đối soát:</span>
              <strong className="text-blue-600 text-sm font-mono">{order.shippingTrackingCode || 'GHN88291034'}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Người nhận:</span>
              <strong className="text-gray-900">{order.recipientName} ({order.recipientPhone})</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Tổng tiền thanh toán:</span>
              <strong className="text-red-600 font-bold text-sm">{formatPrice(order.finalAmount)}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
