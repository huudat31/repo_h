'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { fetchApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/formatters';
import {
  Package,
  Truck,
  CreditCard,
  ChevronRight,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';

interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderCode: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  addonAmount: number;
  finalAmount: number;
  status: string;
  paymentProvider: string;
  paymentStatus: string;
  shippingCarrier?: string;
  shippingTrackingCode?: string;
  recipientName: string;
  recipientPhone: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  PROCESSING: { label: 'Đang đóng gói', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  SHIPPING: { label: 'Đang vận chuyển', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  COMPLETED: { label: 'Giao thành công', color: 'bg-green-50 text-green-700 border-green-200' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-50 text-red-700 border-red-200' },
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/don-hang-cua-toi');
      return;
    }

    if (user) {
      loadMyOrders();
    }
  }, [user, authLoading, router]);

  const loadMyOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<Order[]>('/orders/my-orders');
      setOrders(data);
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span>Đang xác thực thông tin...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Đơn Hàng Của Tôi</h1>
        <p className="text-xs text-gray-500 mt-1">
          Theo dõi tiến trình xử lý, đối soát vận đơn và bảo hành điện tử các sản phẩm đã mua
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Đang tải danh sách đơn hàng...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <div>
            <h3 className="font-bold text-gray-900 text-base">Bạn chưa có đơn hàng nào</h3>
            <p className="text-xs text-gray-500 mt-1">Khám phá các sản phẩm công nghệ và điện máy chính hãng ngay</p>
          </div>
          <Link
            href="/products"
            className="inline-flex px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            Mua Sắm Ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = STATUS_MAP[order.status] || {
              label: order.status,
              color: 'bg-gray-50 text-gray-700 border-gray-200',
            };

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition space-y-4"
              >
                {/* Header: Mã đơn + Ngày tạo + Trạng thái */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-blue-600 text-sm">{order.orderCode}</span>
                    <span className="text-[11px] text-gray-400">• {formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        order.paymentStatus === 'SUCCESS'
                          ? 'bg-green-100 text-green-700'
                          : order.paymentStatus === 'FAILED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {order.paymentProvider} ({order.paymentStatus === 'SUCCESS' ? 'Đã thanh toán' : 'Chưa thanh toán'})
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-gray-800 line-clamp-1">{item.productName}</p>
                        <p className="text-[11px] text-gray-400">SKU: {item.sku} • Số lượng: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-gray-900 shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer: Tổng tiền + Các nút hành động */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-100 gap-3">
                  <div className="text-xs text-gray-600">
                    <span>Tổng thanh toán: </span>
                    <strong className="text-base text-red-600 font-extrabold">{formatPrice(order.finalAmount)}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tra-cuu-don-hang?orderCode=${encodeURIComponent(order.orderCode)}`}
                      className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Tra cứu tiến độ</span>
                    </Link>

                    <Link
                      href={`/tra-cuu-bao-hanh?keyword=${encodeURIComponent(order.recipientPhone)}`}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bảo hành</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
