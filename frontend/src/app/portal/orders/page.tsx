'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/formatters';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  UserCheck,
  Loader2,
  XCircle,
  ExternalLink,
} from 'lucide-react';

const STATUS_TABS = [
  { key: '', label: 'Tất Cả' },
  { key: 'PENDING', label: 'Chờ Duyệt' },
  { key: 'CONFIRMED', label: 'Đã Duyệt' },
  { key: 'SHIPPING', label: 'Đang Giao' },
  { key: 'COMPLETED', label: 'Hoàn Tất' },
  { key: 'CANCELLED', label: 'Đã Hủy' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('');
  const [search, setSearch] = useState('');

  // Assign staff modal/input state
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);
  const [staffName, setStaffName] = useState('');

  useEffect(() => {
    loadOrders();
  }, [activeStatus]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const url = activeStatus ? `/orders?status=${activeStatus}` : '/orders';
      const data = await fetchApi<any[]>(url);
      setOrders(data || []);
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await fetchApi(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật');
    }
  };

  const handleAssignStaff = async (orderId: string) => {
    if (!staffName.trim()) return;
    try {
      await fetchApi(`/orders/${orderId}/assign-staff`, {
        method: 'PATCH',
        body: JSON.stringify({ staff: staffName.trim() }),
      });
      setAssigningOrderId(null);
      setStaffName('');
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Lỗi phân công');
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      o.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      o.recipientPhone.includes(search)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Quản Lý Đơn Hàng & Điều Phối</h1>
        <p className="text-xs text-gray-500 mt-1">Duyệt đơn, phân công kỹ thuật viên lắp đặt và in phiếu giao hàng</p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveStatus(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeStatus === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 max-w-xs w-full">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Đang tải đơn hàng...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400 space-y-2">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
            <p>Không có đơn hàng nào trong danh mục này</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Mã Đơn / Ngày Đặt</th>
                  <th className="py-3 px-4">Người Nhận / Địa Chỉ</th>
                  <th className="py-3 px-4">Sản Phẩm</th>
                  <th className="py-3 px-4">Tổng Tiền</th>
                  <th className="py-3 px-4">Phân Công Nhân Viên</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3.5 px-4 font-mono">
                      <strong className="text-blue-600 font-bold block">{order.orderCode}</strong>
                      <span className="text-[10px] text-gray-400 font-sans">{formatDate(order.createdAt)}</span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-gray-900">{order.recipientName}</div>
                      <div className="text-[11px] text-gray-500">{order.recipientPhone}</div>
                      <div className="text-[10px] text-gray-400 truncate">
                        {order.shippingAddress?.detailAddress}, {order.shippingAddress?.districtName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="space-y-0.5">
                        {order.items?.slice(0, 2).map((item: any) => (
                          <div key={item.id} className="truncate text-[11px]">
                            {item.productName} <strong className="text-gray-500">x{item.quantity}</strong>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <span className="text-[10px] text-blue-600 italic">
                            +{order.items.length - 2} sản phẩm khác
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="text-gray-900 block font-extrabold">{formatPrice(order.finalAmount)}</strong>
                      <span className="text-[10px] text-gray-400">{order.paymentProvider}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {assigningOrderId === order.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Tên & SĐT kỹ thuật viên..."
                            value={staffName}
                            onChange={(e) => setStaffName(e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded-lg w-36"
                          />
                          <button
                            onClick={() => handleAssignStaff(order.id)}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-bold"
                          >
                            Lưu
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-gray-700">
                            {order.assignedStaff || 'Chưa phân công'}
                          </span>
                          <button
                            onClick={() => {
                              setAssigningOrderId(order.id);
                              setStaffName(order.assignedStaff || '');
                            }}
                            className="text-[10px] text-blue-600 hover:underline"
                          >
                            [Đổi]
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          order.status === 'CONFIRMED'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : order.status === 'COMPLETED'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : order.status === 'SHIPPING'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : order.status === 'CANCELLED'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="PROCESSING">Đang đóng gói</option>
                        <option value="SHIPPING">Đang giao hàng</option>
                        <option value="COMPLETED">Giao thành công</option>
                        <option value="CANCELLED">Hủy đơn</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/portal/orders/${order.id}/invoice`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-[11px] transition"
                        title="In phiếu giao hàng / Hóa đơn"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>In Phiếu</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
