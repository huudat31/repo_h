'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  ExternalLink,
  Layers,
  Percent,
  Coins,
  RefreshCw,
  Search,
} from 'lucide-react';

interface Voucher {
  id: string;
  code: string;
  title: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number | null;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  position: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminVouchersPage() {
  const [activeTab, setActiveTab] = useState<'vouchers' | 'banners'>('vouchers');
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Voucher Modal State
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [editingVoucherId, setEditingVoucherId] = useState<string | null>(null);
  const [voucherForm, setVoucherForm] = useState({
    code: '',
    title: '',
    discountType: 'PERCENT' as 'PERCENT' | 'FIXED',
    discountValue: 10,
    minOrderValue: 0,
    maxDiscount: '',
    usageLimit: 100,
    validFrom: new Date().toISOString().slice(0, 16),
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    isActive: true,
  });

  // Banner Modal State
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    position: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [vouchersRes, bannersRes] = await Promise.all([
        api.get<Voucher[]>('/vouchers').catch(() => []),
        api.get<Banner[]>('/admin/banners').catch(() => []),
      ]);
      setVouchers(Array.isArray(vouchersRes) ? vouchersRes : []);
      setBanners(Array.isArray(bannersRes) ? bannersRes : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Không thể tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Voucher Submit
  const handleVoucherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        code: voucherForm.code.toUpperCase().trim(),
        title: voucherForm.title.trim(),
        discountType: voucherForm.discountType,
        discountValue: Number(voucherForm.discountValue),
        minOrderValue: Number(voucherForm.minOrderValue) || 0,
        maxDiscount: voucherForm.maxDiscount ? Number(voucherForm.maxDiscount) : null,
        usageLimit: Number(voucherForm.usageLimit) || 100,
        validFrom: new Date(voucherForm.validFrom).toISOString(),
        validTo: new Date(voucherForm.validTo).toISOString(),
        isActive: voucherForm.isActive,
      };

      if (editingVoucherId) {
        await api.put(`/vouchers/${editingVoucherId}`, payload);
      } else {
        await api.post('/vouchers', payload);
      }

      setIsVoucherModalOpen(false);
      setEditingVoucherId(null);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Lỗi khi lưu voucher');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Voucher Active
  const handleToggleVoucher = async (v: Voucher) => {
    try {
      await api.put(`/vouchers/${v.id}`, { isActive: !v.isActive });
      setVouchers((prev) =>
        prev.map((item) => (item.id === v.id ? { ...item, isActive: !item.isActive } : item))
      );
    } catch (err: any) {
      alert('Không thể thay đổi trạng thái voucher');
    }
  };

  // Delete Voucher
  const handleDeleteVoucher = async (id: string, code: string) => {
    if (!confirm(`Bạn có chắc muốn xóa mã giảm giá [${code}]?`)) return;
    try {
      await api.delete(`/vouchers/${id}`);
      setVouchers((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Không thể xóa voucher');
    }
  };

  // Open Edit Voucher Modal
  const handleEditVoucher = (v: Voucher) => {
    setEditingVoucherId(v.id);
    setVoucherForm({
      code: v.code,
      title: v.title,
      discountType: v.discountType,
      discountValue: v.discountValue,
      minOrderValue: v.minOrderValue,
      maxDiscount: v.maxDiscount ? String(v.maxDiscount) : '',
      usageLimit: v.usageLimit,
      validFrom: new Date(v.validFrom).toISOString().slice(0, 16),
      validTo: new Date(v.validTo).toISOString().slice(0, 16),
      isActive: v.isActive,
    });
    setIsVoucherModalOpen(true);
  };

  // Handle Banner Submit
  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/banners', {
        title: bannerForm.title.trim(),
        imageUrl: bannerForm.imageUrl.trim(),
        linkUrl: bannerForm.linkUrl?.trim() || null,
        position: Number(bannerForm.position) || 0,
      });
      setIsBannerModalOpen(false);
      setBannerForm({ title: '', imageUrl: '', linkUrl: '', position: 0 });
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Lỗi khi tạo banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa banner quảng cáo này?')) return;
    try {
      await api.delete(`/admin/banners/${id}`);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert('Không thể xóa banner');
    }
  };

  const filteredVouchers = vouchers.filter(
    (v) =>
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Tag className="w-7 h-7 text-blue-600" />
            Khuyến Mãi & Banner Chiến Dịch
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý mã giảm giá (Vouchers), Flash Sale và hệ thống Banners tiếp thị trang chủ
          </p>
        </div>

        {/* Tab switch & Add buttons */}
        <div className="flex items-center gap-2">
          <div className="bg-gray-200 p-1 rounded-xl flex items-center text-xs font-bold">
            <button
              onClick={() => setActiveTab('vouchers')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'vouchers'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mã Giảm Giá ({vouchers.length})
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'banners'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Banners ({banners.length})
            </button>
          </div>

          {activeTab === 'vouchers' ? (
            <button
              onClick={() => {
                setEditingVoucherId(null);
                setVoucherForm({
                  code: '',
                  title: '',
                  discountType: 'PERCENT',
                  discountValue: 10,
                  minOrderValue: 0,
                  maxDiscount: '',
                  usageLimit: 100,
                  validFrom: new Date().toISOString().slice(0, 16),
                  validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                  isActive: true,
                });
                setIsVoucherModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Mã Mới</span>
            </button>
          ) : (
            <button
              onClick={() => setIsBannerModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Banner</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: VOUCHERS */}
      {activeTab === 'vouchers' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
            <Search className="w-4 h-4 text-gray-400 ml-1" />
            <input
              type="text"
              placeholder="Tìm theo mã giảm giá hoặc tiêu đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={fetchData}
              title="Làm mới"
              className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Mã Voucher</th>
                    <th className="py-3 px-4">Tiêu Đề Khuyến Mãi</th>
                    <th className="py-3 px-4">Loại & Mức Giảm</th>
                    <th className="py-3 px-4">Đơn Tối Thiểu</th>
                    <th className="py-3 px-4">Lượt Đã Dùng</th>
                    <th className="py-3 px-4">Thời Hạn</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                    <th className="py-3 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400">
                        Đang tải danh sách voucher...
                      </td>
                    </tr>
                  ) : filteredVouchers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-gray-400">
                        Chưa có mã giảm giá nào. Hãy nhấn &quot;Tạo Mã Mới&quot; để tạo mã đầu tiên!
                      </td>
                    </tr>
                  ) : (
                    filteredVouchers.map((v) => {
                      const isExpired = new Date() > new Date(v.validTo);
                      const isNotStarted = new Date() < new Date(v.validFrom);
                      const usagePercent = Math.min(100, Math.round((v.usedCount / v.usageLimit) * 100));

                      return (
                        <tr key={v.id} className="hover:bg-gray-50/80 transition">
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                              {v.code}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-gray-900 max-w-xs">
                            {v.title}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-bold text-gray-800">
                              {v.discountType === 'PERCENT' ? (
                                <>
                                  <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    Giảm {v.discountValue}%
                                  </span>
                                  {v.maxDiscount && (
                                    <span className="text-[10px] text-gray-400 font-normal">
                                      (tối đa {v.maxDiscount.toLocaleString('vi-VN')} đ)
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                  -{v.discountValue.toLocaleString('vi-VN')} đ
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-gray-600">
                            {v.minOrderValue > 0
                              ? `${v.minOrderValue.toLocaleString('vi-VN')} đ`
                              : 'Không giới hạn'}
                          </td>
                          <td className="py-3.5 px-4 min-w-[140px]">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] text-gray-600">
                                <span>{v.usedCount} đã dùng</span>
                                <span className="text-gray-400">/ {v.usageLimit}</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    usagePercent >= 100 ? 'bg-red-500' : 'bg-blue-600'
                                  }`}
                                  style={{ width: `${usagePercent}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-[11px] text-gray-600 space-y-0.5">
                              <div>Đến: {new Date(v.validTo).toLocaleDateString('vi-VN')}</div>
                              {isExpired ? (
                                <span className="inline-block px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">
                                  Hết hạn
                                </span>
                              ) : isNotStarted ? (
                                <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
                                  Chưa bắt đầu
                                </span>
                              ) : (
                                <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">
                                  Đang chạy
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleVoucher(v)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 ${
                                v.isActive
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              {v.isActive ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-green-600" /> Kích hoạt
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 text-gray-400" /> Tạm dừng
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEditVoucher(v)}
                                title="Chỉnh sửa"
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteVoucher(v.id, v.code)}
                                title="Xóa"
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BANNERS */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {banners.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group"
              >
                <div className="relative aspect-[16/7] bg-gray-100 overflow-hidden">
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      (e.target as any).src =
                        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                    Thứ tự: {b.position}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{b.title}</h3>
                    {b.linkUrl && (
                      <a
                        href={b.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-1 truncate"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{b.linkUrl}</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <span className="text-gray-400 text-[10px]">
                      {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                      title="Xóa banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {banners.length === 0 && !isLoading && (
              <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-200">
                Chưa có banner nào. Nhấn &quot;Thêm Banner&quot; để thiết lập quảng cáo trang chủ.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: TẠO / SỬA VOUCHER */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                {editingVoucherId ? 'Cập Nhật Mã Giảm Giá' : 'Tạo Mã Giảm Giá Mới'}
              </h2>
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVoucherSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Mã Code (In hoa) *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingVoucherId}
                    value={voucherForm.code}
                    onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                    placeholder="VD: TECHSALE10"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono uppercase font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Hình Thức Giảm *</label>
                  <select
                    value={voucherForm.discountType}
                    onChange={(e) =>
                      setVoucherForm({
                        ...voucherForm,
                        discountType: e.target.value as 'PERCENT' | 'FIXED',
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                  >
                    <option value="PERCENT">Giảm theo % (Phần trăm)</option>
                    <option value="FIXED">Giảm theo số tiền (VNĐ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Tiêu Đề / Chương Trình *</label>
                <input
                  type="text"
                  required
                  value={voucherForm.title}
                  onChange={(e) => setVoucherForm({ ...voucherForm, title: e.target.value })}
                  placeholder="VD: Giảm ngay 10% tri ân khách hàng tháng 10"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Giá Trị Giảm {voucherForm.discountType === 'PERCENT' ? '(%)' : '(VNĐ)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={voucherForm.discountValue}
                    onChange={(e) =>
                      setVoucherForm({ ...voucherForm, discountValue: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Giảm Tối Đa (VNĐ) {voucherForm.discountType === 'PERCENT' ? '' : '(Không cần)'}
                  </label>
                  <input
                    type="number"
                    disabled={voucherForm.discountType === 'FIXED'}
                    value={voucherForm.maxDiscount}
                    onChange={(e) => setVoucherForm({ ...voucherForm, maxDiscount: e.target.value })}
                    placeholder="VD: 500000"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Đơn Tối Thiểu (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    value={voucherForm.minOrderValue}
                    onChange={(e) =>
                      setVoucherForm({ ...voucherForm, minOrderValue: Number(e.target.value) })
                    }
                    placeholder="VD: 1000000"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Giới Hạn Lượt Dùng *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={voucherForm.usageLimit}
                    onChange={(e) =>
                      setVoucherForm({ ...voucherForm, usageLimit: Number(e.target.value) })
                    }
                    placeholder="VD: 100"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Bắt Đầu Từ *</label>
                  <input
                    type="datetime-local"
                    required
                    value={voucherForm.validFrom}
                    onChange={(e) => setVoucherForm({ ...voucherForm, validFrom: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Kết Thúc Lúc *</label>
                  <input
                    type="datetime-local"
                    required
                    value={voucherForm.validTo}
                    onChange={(e) => setVoucherForm({ ...voucherForm, validTo: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="voucherActive"
                  checked={voucherForm.isActive}
                  onChange={(e) => setVoucherForm({ ...voucherForm, isActive: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="voucherActive" className="text-gray-700 font-bold cursor-pointer">
                  Kích hoạt mã giảm giá ngay sau khi lưu
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow"
                >
                  {isSubmitting ? 'Đang lưu...' : editingVoucherId ? 'Cập Nhật' : 'Tạo Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÊM BANNER */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                Thêm Banner Quảng Cáo Mới
              </h2>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBannerSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Tiêu Đề Banner *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="VD: Siêu Sale Điện Máy Khuyến Mãi 50%"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Link Ảnh Banner (URL) *</label>
                <input
                  type="url"
                  required
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Link Đích Khi Bấm Vào</label>
                <input
                  type="text"
                  value={bannerForm.linkUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                  placeholder="/category/smartphones hoặc link khuyến mãi"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Thứ Tự Ưu Tiên (Position)</label>
                <input
                  type="number"
                  value={bannerForm.position}
                  onChange={(e) => setBannerForm({ ...bannerForm, position: Number(e.target.value) })}
                  placeholder="0, 1, 2..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Thêm Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
