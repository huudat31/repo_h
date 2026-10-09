'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, PackageCheck, Mail, ArrowRight, ShieldCheck, Home } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode') || 'ORD-982341';
  const status = searchParams.get('status') || 'success';
  const isSuccess = status === 'success' || status === 'cod';

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm space-y-6">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {isSuccess ? 'Đặt Hàng & Thanh Toán Thành Công!' : 'Giao Dịch Đã Được Ghi Nhận'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Cảm ơn bạn đã tin tưởng mua sắm thiết bị công nghệ tại TechStore VN.
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 inline-block text-left w-full max-w-md mx-auto space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Mã đơn hàng:</span>
            <span className="font-bold text-blue-600 tracking-wider">{orderCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Trạng thái:</span>
            <span className="font-semibold text-green-600">Đã tiếp nhận hệ thống</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Kênh vận chuyển:</span>
            <span className="font-medium text-gray-800">GHN / GHTK Express</span>
          </div>
        </div>

        {/* Email Alert */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-600 bg-blue-50/80 p-3 rounded-xl border border-blue-100 max-w-md mx-auto">
          <Mail className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Hóa đơn và thông tin chi tiết đã được gửi qua email của bạn.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow transition"
          >
            <Home className="w-4 h-4" /> Quay Về Trang Chủ
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition"
          >
            Tiếp Tục Mua Sắm <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <React.Suspense fallback={<div className="text-center py-20 text-gray-500">Đang tải thông tin đơn hàng...</div>}>
      <SuccessContent />
    </React.Suspense>
  );
}
