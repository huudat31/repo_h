'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/formatters';
import { Store, Printer, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderInvoicePage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Find order by id or list
      fetchApi<any[]>('/orders')
        .then((orders) => {
          const found = orders.find((o) => o.id === id);
          setOrder(found || null);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-xs text-gray-500">Đang chuẩn bị phiếu giao hàng...</div>;
  }

  if (!order) {
    return <div className="text-center py-20 text-xs text-red-600 font-bold">Không tìm thấy đơn hàng này.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Action Bar (Ẩn khi in ấn) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/portal/orders"
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Quản lý đơn</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
        >
          <Printer className="w-4 h-4" />
          <span>In Hóa Đơn / Phiếu Giao Hàng</span>
        </button>
      </div>

      {/* Invoice Document (Khổ giấy chuẩn in A4) */}
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 border border-gray-200 rounded-2xl shadow-sm print:border-none print:shadow-none print:p-0 space-y-8 text-xs text-gray-800">
        {/* Header */}
        <div className="flex justify-between items-start pb-6 border-b-2 border-gray-900">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-black text-xl text-blue-600">
              <Store className="w-6 h-6 text-blue-600" />
              <span>TechStore VN</span>
            </div>
            <p className="text-[11px] text-gray-500">Hệ Thống Phân Phối Thiết Bị Điện Máy & Công Nghệ Toàn Diện</p>
            <p className="text-[11px] text-gray-500">Hotline: 1800 6868 • Website: techstore.vn</p>
            <p className="text-[11px] text-gray-500">Showroom: 123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
          </div>

          <div className="text-right space-y-1 font-mono">
            <h1 className="text-lg font-black text-gray-900 font-sans tracking-wide">PHIẾU XUẤT KHO & GIAO HÀNG</h1>
            <p className="text-sm font-extrabold text-blue-600">{order.orderCode}</p>
            <p className="text-[11px] text-gray-400 font-sans">Ngày đặt: {formatDate(order.createdAt)}</p>
            <p className="text-[11px] text-gray-400 font-sans">Kênh vận chuyển: {order.shippingCarrier || 'Nội bộ'}</p>
          </div>
        </div>

        {/* Customer & Staff Info */}
        <div className="grid grid-cols-2 gap-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="space-y-1">
            <strong className="text-gray-900 block font-bold uppercase text-[11px] tracking-wide">
              Thông Tin Người Nhận
            </strong>
            <p className="font-bold text-gray-900 text-sm">{order.recipientName}</p>
            <p className="font-semibold text-gray-700">SĐT: {order.recipientPhone}</p>
            <p className="text-gray-600 leading-relaxed">
              Địa chỉ: {order.shippingAddress?.detailAddress}, {order.shippingAddress?.wardName},{' '}
              {order.shippingAddress?.districtName}, {order.shippingAddress?.provinceName}
            </p>
            {order.notes && <p className="text-blue-600 font-medium">Ghi chú: {order.notes}</p>}
          </div>

          <div className="space-y-1 text-right">
            <strong className="text-gray-900 block font-bold uppercase text-[11px] tracking-wide">
              Điều Phối & Lắp Đặt
            </strong>
            <p className="font-semibold text-gray-800">
              Nhân viên phụ trách: <strong className="text-blue-600">{order.assignedStaff || 'Chưa phân công'}</strong>
            </p>
            <p className="text-gray-600">
              Phương thức: <strong>{order.paymentProvider}</strong>
            </p>
            <p className="text-gray-600">
              Thanh toán: <strong className={order.paymentStatus === 'SUCCESS' ? 'text-green-600 font-bold' : 'text-amber-600 font-bold'}>
                {order.paymentStatus === 'SUCCESS' ? 'ĐÃ THANH TOÁN ONLINE' : 'THU TIỀN MẶT KHI NHẬN HÀNG (COD)'}
              </strong>
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900 text-gray-900 font-bold">
                <th className="py-2.5">STT</th>
                <th className="py-2.5">Tên Sản Phẩm / Thiết Bị</th>
                <th className="py-2.5 font-mono">Mã SKU</th>
                <th className="py-2.5 text-center">Số Lượng</th>
                <th className="py-2.5 text-right">Đơn Giá</th>
                <th className="py-2.5 text-right">Thành Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items?.map((item: any, idx: number) => (
                <tr key={item.id} className="py-2">
                  <td className="py-2.5 font-bold text-gray-400">{idx + 1}</td>
                  <td className="py-2.5 font-semibold text-gray-900 max-w-sm">{item.productName}</td>
                  <td className="py-2.5 font-mono text-gray-500">{item.sku}</td>
                  <td className="py-2.5 text-center font-bold text-gray-800">{item.quantity}</td>
                  <td className="py-2.5 text-right text-gray-600">{formatPrice(item.price)}</td>
                  <td className="py-2.5 text-right font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Summary */}
        <div className="flex justify-end pt-2">
          <div className="w-72 space-y-2 border-t border-gray-200 pt-3">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính:</span>
              <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển:</span>
              <span>+{formatPrice(order.shippingFee)}</span>
            </div>
            {order.addonAmount > 0 && (
              <div className="flex justify-between text-blue-600 font-medium">
                <span>Dịch vụ lắp đặt / BH vàng:</span>
                <span>+{formatPrice(order.addonAmount)}</span>
              </div>
            )}
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-bold">
                <span>Giảm giá ({order.voucherCode}):</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t-2 border-gray-900 text-sm font-extrabold text-gray-900">
              <span>TỔNG THU:</span>
              <span className="text-base text-red-600">{formatPrice(order.finalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-4 pt-10 text-center text-xs">
          <div className="space-y-12">
            <span className="font-bold text-gray-900 block uppercase">Người Lập Phiếu</span>
            <span className="text-gray-400 italic">(Ký, họ tên)</span>
          </div>

          <div className="space-y-12">
            <span className="font-bold text-gray-900 block uppercase">Nhân Viên Giao / Lắp Đặt</span>
            <span className="text-gray-400 italic">(Ký, họ tên)</span>
          </div>

          <div className="space-y-12">
            <span className="font-bold text-gray-900 block uppercase">Người Nhận Hàng</span>
            <span className="text-gray-400 italic">(Xác nhận máy nguyên vẹn)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
