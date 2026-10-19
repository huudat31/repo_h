'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  PackageCheck,
  Mail,
  ArrowRight,
  ShieldCheck,
  Truck,
  AlertCircle,
  RotateCcw,
  Receipt,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { formatPrice } from '@/lib/formatters';

interface OrderDetail {
  id: string;
  orderCode: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: {
    provinceName?: string;
    districtName?: string;
    wardName?: string;
    detailAddress?: string;
  };
  totalAmount: number;
  shippingFee: number;
  addonAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  paymentStatus: string;
  paymentProvider: string;
  shippingCarrier?: string;
  items: Array<{
    id: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
  createdAt: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode');
  const orderId = searchParams.get('orderId');
  const statusParam = searchParams.get('status') || 'success';
  const isFailed = statusParam === 'failed';

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const codeToFetch = orderCode || orderId;
    if (codeToFetch) {
      fetchApi<OrderDetail>(`/orders/${codeToFetch}`)
        .then((data) => {
          if (data && data.orderCode) {
            setOrder(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderCode, orderId]);

  const displayCode = order?.orderCode || orderCode || 'ORD-TECHSTORE';

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
        {/* Status Icon & Header */}
        <div className="text-center space-y-2">
          {isFailed ? (
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          )}

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isFailed ? 'Giao Dịch Chưa Hoàn Tất' : 'Đặt Hàng & Tiếp Nhận Thành Công!'}
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isFailed
              ? 'Giao dịch thanh toán trực tuyến bị gián đoạn hoặc hủy bởi người dùng. Đơn hàng vẫn được lưu lại để bạn có thể tiếp tục xử lý.'
              : 'Cảm ơn bạn đã lựa chọn thiết bị công nghệ chính hãng tại TechStore VN. Hệ thống đã tiếp nhận và đang tiến hành xử lý đóng gói.'}
          </p>
        </div>

        {/* Live Order Summary Card */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3.5 text-xs text-slate-700">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-slate-500 font-medium">Mã đơn hàng:</span>
            <span className="font-extrabold text-blue-600 font-mono text-sm tracking-wider">
              {displayCode}
            </span>
          </div>

          {order && (
            <>
              {/* Recipient info */}
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500 font-medium shrink-0">Người nhận hàng:</span>
                <span className="font-semibold text-slate-900 text-right">
                  {order.recipientName} ({order.recipientPhone})
                </span>
              </div>

              {/* Delivery Address */}
              {order.shippingAddress && (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-500 font-medium shrink-0">Địa chỉ giao:</span>
                  <span className="text-slate-800 text-right max-w-xs">
                    {order.shippingAddress.detailAddress}, {order.shippingAddress.wardName},{' '}
                    {order.shippingAddress.districtName}, {order.shippingAddress.provinceName}
                  </span>
                </div>
              )}

              {/* Items Summary */}
              {order.items && order.items.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium block mb-1.5">Sản phẩm ({order.items.length}):</span>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-slate-800">
                        <span className="truncate max-w-[280px]">
                          {item.quantity}x {item.productName}
                        </span>
                        <span className="font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final Amount */}
              <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">Tổng thanh toán:</span>
                <span className="font-black text-slate-900 text-base text-red-600">
                  {formatPrice(order.finalAmount)}
                </span>
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-500 font-medium">Hình thức thanh toán:</span>
            <span className="font-bold text-slate-900 uppercase">
              {order?.paymentProvider || 'COD (Tiền mặt)'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Kênh vận chuyển:</span>
            <span className="font-semibold text-slate-900">
              {order?.shippingCarrier || 'GHN'} Express (1 - 2 ngày làm việc)
            </span>
          </div>
        </div>

        {/* Email & Warranty Notice */}
        <div className="flex items-center gap-2.5 p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Hồ sơ <strong>bảo hành điện tử</strong> đã được tự động kích hoạt theo số điện thoại của bạn.
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={`/tra-cuu-don-hang?orderCode=${encodeURIComponent(displayCode)}`}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Truck className="w-4 h-4" />
            <span>Theo Dõi Tiến Độ Giao Hàng</span>
          </Link>

          <Link
            href="/don-hang-cua-toi"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Đơn Hàng Của Tôi</span>
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition"
          >
            <span>Tiếp tục mua sắm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <React.Suspense fallback={<div className="text-center py-20 text-slate-500 text-xs">Đang tải thông tin đơn hàng...</div>}>
      <SuccessContent />
    </React.Suspense>
  );
}
