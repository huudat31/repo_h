'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  ShieldCheck,
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
  Wrench,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Barcode,
  Package,
  Calendar,
  FileText,
  XCircle,
} from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  warrantyMonths: number;
}

interface WarrantyRecord {
  id: string;
  serialNumber: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    sku: string;
    warrantyMonths: number;
  };
  orderId: string | null;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REPAIRING';
  claimNote: string | null;
}

export default function AdminWarrantyPage() {
  const [records, setRecords] = useState<WarrantyRecord[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal Note/Status Update State
  const [selectedRecord, setSelectedRecord] = useState<WarrantyRecord | null>(null);
  const [updateStatus, setUpdateStatus] = useState<'ACTIVE' | 'EXPIRED' | 'REPAIRING'>('ACTIVE');
  const [claimNote, setClaimNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal Create Manual Warranty State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    productId: '',
    serialNumber: '',
    customerName: '',
    customerPhone: '',
    warrantyMonths: 12,
  });
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [recordsRes, productsRes] = await Promise.all([
        api.get<WarrantyRecord[]>('/warranty').catch(() => []),
        api.get<any>('/products?limit=100').catch(() => ({ data: [] })),
      ]);
      setRecords(Array.isArray(recordsRes) ? recordsRes : []);
      const productList = Array.isArray(productsRes)
        ? productsRes
        : productsRes?.data || [];
      setProducts(productList);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Không thể tải hồ sơ bảo hành');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Status and Claim Note
  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    setIsUpdating(true);
    try {
      const updated = await api.patch<WarrantyRecord>(`/warranty/${selectedRecord.id}/status`, {
        status: updateStatus,
        claimNote: claimNote,
      });

      setRecords((prev) =>
        prev.map((r) => (r.id === selectedRecord.id ? { ...r, status: updateStatus, claimNote } : r))
      );
      setSelectedRecord(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Lỗi khi cập nhật trạng thái');
    } finally {
      setIsUpdating(false);
    }
  };

  // Create Manual Warranty Record
  const handleCreateWarranty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const newRecord = await api.post<WarrantyRecord>('/warranty', {
        productId: createForm.productId,
        serialNumber: createForm.serialNumber.trim().toUpperCase(),
        customerName: createForm.customerName.trim(),
        customerPhone: createForm.customerPhone.trim(),
        warrantyMonths: Number(createForm.warrantyMonths),
      });

      setIsCreateModalOpen(false);
      setCreateForm({
        productId: '',
        serialNumber: '',
        customerName: '',
        customerPhone: '',
        warrantyMonths: 12,
      });
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Lỗi khi tạo bảo hành');
    } finally {
      setIsCreating(false);
    }
  };

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerPhone.includes(searchQuery) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.product?.name && r.product.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const isExpired = new Date() > new Date(r.endDate);
    const effectiveStatus = isExpired ? 'EXPIRED' : r.status;

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'ACTIVE') return matchesSearch && !isExpired && r.status === 'ACTIVE';
    if (statusFilter === 'REPAIRING') return matchesSearch && r.status === 'REPAIRING';
    if (statusFilter === 'EXPIRED') return matchesSearch && isExpired;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
            Quản Lý Bảo Hành & Tiếp Nhận Đổi Trả
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Theo dõi Serial/IMEI, kích hoạt điện tử và tiếp nhận sửa chữa / đổi trả cho khách hàng
          </p>
        </div>

        <button
          onClick={() => {
            if (products.length > 0 && !createForm.productId) {
              setCreateForm((prev) => ({ ...prev, productId: products[0].id }));
            }
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Kích Hoạt Bảo Hành Mới</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 ml-1" />
          <input
            type="text"
            placeholder="Tìm theo Serial, SĐT, Tên khách, Tên máy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">Tất Cả Trạng Thái</option>
            <option value="ACTIVE">Đang Hiệu Lực</option>
            <option value="REPAIRING">Đang Tiếp Nhận Sửa Chữa / Đổi Trả</option>
            <option value="EXPIRED">Đã Hết Hạn</option>
          </select>

          <button
            onClick={fetchData}
            title="Làm mới"
            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Mã Serial / IMEI</th>
                <th className="py-3 px-4">Sản Phẩm</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Thời Gian Hiệu Lực</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4">Ghi Chú Tiếp Nhận</th>
                <th className="py-3 px-4 text-right">Xử Lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Đang tải dữ liệu hồ sơ bảo hành...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    Không tìm thấy hồ sơ bảo hành nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const isExpired = new Date() > new Date(r.endDate);
                  const daysRemaining = Math.max(
                    0,
                    Math.ceil((new Date(r.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  );

                  return (
                    <tr key={r.id} className="hover:bg-gray-50/80 transition">
                      {/* Serial */}
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        <span className="bg-gray-100 border border-gray-200 px-2 py-1 rounded-md text-[11px]">
                          {r.serialNumber}
                        </span>
                      </td>

                      {/* Product */}
                      <td className="py-3.5 px-4 font-semibold text-gray-900 max-w-xs">
                        <div>{r.product?.name || 'Sản phẩm không xác định'}</div>
                        {r.product?.sku && (
                          <div className="text-[10px] text-gray-400 font-mono">SKU: {r.product.sku}</div>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-800">{r.customerName}</div>
                        <div className="text-gray-500 font-mono text-[11px]">{r.customerPhone}</div>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 text-[11px] text-gray-600">
                        <div>Bắt đầu: {new Date(r.startDate).toLocaleDateString('vi-VN')}</div>
                        <div>Hết hạn: {new Date(r.endDate).toLocaleDateString('vi-VN')}</div>
                        {!isExpired && (
                          <span className="text-[10px] font-bold text-blue-600">
                            (Còn {daysRemaining} ngày)
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                            <Clock className="w-3 h-3" /> Hết Hạn
                          </span>
                        ) : r.status === 'REPAIRING' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Wrench className="w-3 h-3 text-amber-600" /> Đang Bảo Hành/Sửa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 text-green-600" /> Đang Hiệu Lực
                          </span>
                        )}
                      </td>

                      {/* Claim Note */}
                      <td className="py-3.5 px-4 max-w-xs text-gray-600">
                        {r.claimNote ? (
                          <div className="p-2 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 line-clamp-2">
                            {r.claimNote}
                          </div>
                        ) : (
                          <span className="text-gray-300 italic text-[11px]">Chưa có ghi chú</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedRecord(r);
                            setUpdateStatus(r.status);
                            setClaimNote(r.claimNote || '');
                          }}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Tiếp Nhận</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: TIẾP NHẬN & CẬP NHẬT TRẠNG THÁI */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                Tiếp Nhận Bảo Hành / Đổi Trả Máy
              </h2>
              <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã Serial / IMEI:</span>
                <span className="font-mono font-bold text-gray-900">{selectedRecord.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sản phẩm:</span>
                <span className="font-bold text-gray-900">{selectedRecord.product?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Khách hàng:</span>
                <span className="font-bold text-gray-900">
                  {selectedRecord.customerName} - {selectedRecord.customerPhone}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Cập Nhật Trạng Thái *</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE - Hoạt động bình thường (Đã sửa xong / Trả khách)</option>
                  <option value="REPAIRING">REPAIRING - Đang tiếp nhận kiểm tra / Sửa chữa / Đổi trả</option>
                  <option value="EXPIRED">EXPIRED - Hết hạn bảo hành / Từ chối tiếp nhận</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Ghi Chú Tiếp Nhận & Tình Trạng Thiết Bị
                </label>
                <textarea
                  rows={4}
                  value={claimNote}
                  onChange={(e) => setClaimNote(e.target.value)}
                  placeholder="Nhập chi tiết: Khách báo lỗi không lên nguồn, trầy xước nhẹ viền máy; Hướng giải quyết: gửi hãng thay linh kiện..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow"
                >
                  {isUpdating ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KÍCH HOẠT BẢO HÀNH THỦ CÔNG */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Kích Hoạt Bảo Hành Điện Tử Mới
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWarranty} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Chọn Sản Phẩm *</label>
                <select
                  required
                  value={createForm.productId}
                  onChange={(e) => {
                    const sel = products.find((p) => p.id === e.target.value);
                    setCreateForm({
                      ...createForm,
                      productId: e.target.value,
                      warrantyMonths: sel?.warrantyMonths || 12,
                    });
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) - {p.warrantyMonths} tháng BH
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mã Serial / IMEI Trên Máy *</label>
                <input
                  type="text"
                  required
                  value={createForm.serialNumber}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, serialNumber: e.target.value.toUpperCase() })
                  }
                  placeholder="VD: SN-SAM-2026-X9920"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono uppercase font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Tên Khách Hàng *</label>
                  <input
                    type="text"
                    required
                    value={createForm.customerName}
                    onChange={(e) => setCreateForm({ ...createForm, customerName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Số Điện Thoại Khách *</label>
                  <input
                    type="tel"
                    required
                    value={createForm.customerPhone}
                    onChange={(e) => setCreateForm({ ...createForm, customerPhone: e.target.value })}
                    placeholder="0987654321"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Thời Hạn Bảo Hành (Tháng) *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={createForm.warrantyMonths}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, warrantyMonths: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow"
                >
                  {isCreating ? 'Đang kích hoạt...' : 'Kích Hoạt Bảo Hành'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
