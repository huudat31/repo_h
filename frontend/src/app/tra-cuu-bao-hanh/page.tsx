'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  ShieldCheck,
  Calendar,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Package,
  Wrench,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '@/lib/formatters';
import { fetchApi } from '@/lib/api';

function WarrantyLookupContent() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';

  const [keyword, setKeyword] = useState(initialKeyword);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const executeSearch = async (kw: string) => {
    if (!kw.trim()) return;

    setLoading(true);
    setSearched(true);
    setError('');

    try {
      const data = await fetchApi<any[]>(`/warranty/lookup?keyword=${encodeURIComponent(kw.trim())}`);
      setResults(data);
    } catch (err: any) {
      setResults([]);
      setError(err.message || 'Không tìm thấy hồ sơ bảo hành');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialKeyword) {
      executeSearch(initialKeyword);
    }
  }, [initialKeyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(keyword);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
        <span>/</span>
        <Link href="/don-hang-cua-toi" className="hover:text-blue-600 transition">Đơn hàng của tôi</Link>
        <span>/</span>
        <span className="font-semibold text-gray-800">Tra cứu bảo hành điện tử</span>
      </div>

      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Hệ Thống Kích Hoạt Bảo Hành Điện Tử Toàn Quốc</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Tra Cứu Hồ Sơ Bảo Hành Điện Tử</h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Nhập Số điện thoại người mua hoặc Mã Serial / IMEI (in trên thân máy hoặc tem phụ) để kiểm tra thời hạn và tình trạng bảo hành.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="Nhập SĐT hoặc Mã Serial / IMEI..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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
        </div>

        {/* Quick Suggestions */}
        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center flex-wrap">
          <span>Gợi ý mẫu thử:</span>
          <button
            type="button"
            onClick={() => {
              setKeyword('0909123456');
              executeSearch('0909123456');
            }}
            className="text-blue-600 hover:underline font-semibold"
          >
            0909123456
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setKeyword('SN-ASUS-2026-390285');
              executeSearch('SN-ASUS-2026-390285');
            }}
            className="text-blue-600 hover:underline font-semibold font-mono"
          >
            SN-ASUS-2026-390285
          </button>
        </div>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2.5 max-w-xl mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Results */}
      {searched && (
        <div className="space-y-4">
          {!results || results.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center max-w-lg mx-auto space-y-3 shadow-sm">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-bold text-gray-900 text-base">Không tìm thấy thông tin bảo hành</h3>
              <p className="text-xs text-gray-500">
                Vui lòng kiểm tra lại số điện thoại hoặc mã Serial chính xác in trên tem phụ sản phẩm. Nếu bạn vừa mua hàng, hệ thống kích hoạt tự động theo mã đơn.
              </p>
              <div className="pt-2">
                <Link
                  href="/tra-cuu-don-hang"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-100 transition"
                >
                  Kiểm tra theo mã đơn hàng
                </Link>
              </div>
            </div>
          ) : (
            results.map((item) => {
              const isExpired = item.isExpired;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 justify-between hover:shadow-md transition"
                >
                  <div className="flex items-center gap-5">
                    {item.product?.slug ? (
                      <Link href={`/products/${item.product.slug}`} className="shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            item.product?.images?.[0] ||
                            'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={item.product?.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-2xl border border-gray-100 p-1 hover:opacity-80 transition bg-white"
                        />
                      </Link>
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-gray-100 p-1 shrink-0 bg-gray-50 flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-300" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
                            <Clock className="w-3 h-3" /> ĐÃ HẾT HẠN
                          </span>
                        ) : item.status === 'REPAIRING' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            <Wrench className="w-3 h-3 text-amber-600" /> ĐANG TIẾP NHẬN BẢO HÀNH
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3 text-green-600" /> CÒN HIỆU LỰC
                          </span>
                        )}
                      </div>

                      {item.product?.slug ? (
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-bold text-gray-900 text-sm sm:text-base leading-snug hover:text-blue-600 block line-clamp-2"
                        >
                          {item.product?.name}
                        </Link>
                      ) : (
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug">
                          {item.product?.name}
                        </h3>
                      )}

                      <p className="text-xs text-gray-500">
                        Mã Serial / IMEI: <strong className="text-gray-900 font-mono">{item.serialNumber}</strong>
                      </p>
                      <p className="text-xs text-gray-500">
                        Khách hàng: <strong className="text-gray-800">{item.customerName}</strong> ({item.customerPhone})
                      </p>

                      {item.claimNote && (
                        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 mt-2">
                          <strong>Ghi chú tiếp nhận:</strong> {item.claimNote}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Warranty period box */}
                  <div className="w-full md:w-auto text-left md:text-right bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-1.5 shrink-0">
                    <div className="text-xs text-gray-600 flex items-center md:justify-end gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        Hạn bảo hành: <strong className="text-gray-900">{formatDate(item.endDate)}</strong>
                      </span>
                    </div>
                    <div className="text-xs text-blue-700 font-extrabold">
                      {!isExpired ? `Còn lại ${item.daysRemaining} ngày bảo hành` : 'Đã kết thúc thời hạn'}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Gốc: {item.product?.warrantyMonths || 24} tháng chính hãng
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function WarrantyLookupPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-xs text-gray-400">Đang tải trang bảo hành...</div>}>
      <WarrantyLookupContent />
    </Suspense>
  );
}
