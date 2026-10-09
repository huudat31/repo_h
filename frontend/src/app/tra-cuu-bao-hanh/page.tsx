'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Calendar, Phone, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/formatters';
import { fetchApi } from '@/lib/api';

const MOCK_WARRANTY_RESULTS: Record<string, any[]> = {
  '0901234567': [
    {
      id: 'w-1',
      serialNumber: 'SN-PANA-2026-9812',
      customerName: 'Nguyễn Văn An',
      customerPhone: '0901234567',
      startDate: '2026-01-15T00:00:00Z',
      endDate: '2028-01-15T00:00:00Z',
      daysRemaining: 462,
      status: 'ACTIVE',
      statusText: 'CÒN HIỆU LỰC',
      product: {
        name: 'Máy Giặt Sấy Panasonic Inverter 10.5 kg NA-V105FR1BV',
        slug: 'may-giat-say-panasonic-inverter-10kg',
        images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80'],
        warrantyMonths: 24,
      },
    },
  ],
  'SN-PANA-2026-9812': [
    {
      id: 'w-1',
      serialNumber: 'SN-PANA-2026-9812',
      customerName: 'Nguyễn Văn An',
      customerPhone: '0901234567',
      startDate: '2026-01-15T00:00:00Z',
      endDate: '2028-01-15T00:00:00Z',
      daysRemaining: 462,
      status: 'ACTIVE',
      statusText: 'CÒN HIỆU LỰC',
      product: {
        name: 'Máy Giặt Sấy Panasonic Inverter 10.5 kg NA-V105FR1BV',
        slug: 'may-giat-say-panasonic-inverter-10kg',
        images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80'],
        warrantyMonths: 24,
      },
    },
  ],
};

export default function WarrantyLookupPage() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const data = await fetchApi<any[]>(`/warranty/lookup?keyword=${encodeURIComponent(keyword.trim())}`);
      setResults(data);
    } catch {
      // Fallback local lookup
      const found = MOCK_WARRANTY_RESULTS[keyword.trim()] || null;
      setResults(found);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Hệ Thống Bảo Hành Điện Tử Toàn Quốc</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Tra Cứu Bảo Hành Điện Tử</h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Nhập số điện thoại mua hàng hoặc mã Serial dán trên thân máy để kiểm tra thời hạn và kích hoạt bảo hành chính hãng.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
        <div className="flex gap-2 p-1.5 bg-white border-2 border-blue-600 rounded-2xl shadow-lg">
          <input
            type="text"
            required
            placeholder="Nhập Số điện thoại (VD: 0901234567) hoặc Mã Serial (VD: SN-PANA-2026-9812)..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 px-4 py-3 text-sm focus:outline-none rounded-xl"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shrink-0 shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Đang tra cứu...' : 'Tra Cứu'}</span>
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-3">
          <span>Gợi ý thử nghiệm:</span>
          <button
            type="button"
            onClick={() => setKeyword('0901234567')}
            className="text-blue-600 hover:underline font-semibold"
          >
            0901234567
          </button>
          <span>hoặc</span>
          <button
            type="button"
            onClick={() => setKeyword('SN-PANA-2026-9812')}
            className="text-blue-600 hover:underline font-semibold"
          >
            SN-PANA-2026-9812
          </button>
        </div>
      </form>

      {/* Search Results */}
      {searched && (
        <div className="space-y-4">
          {!results || results.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center max-w-lg mx-auto space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-bold text-gray-900 text-base">Không tìm thấy thông tin bảo hành</h3>
              <p className="text-xs text-gray-500">
                Vui lòng kiểm tra lại số điện thoại hoặc mã Serial chính xác in trên tem phụ sản phẩm. Nếu bạn vừa mua hàng, dữ liệu có thể cần 24h để đồng bộ.
              </p>
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between"
              >
                <div className="flex items-center gap-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80'}
                    alt={item.product?.name}
                    className="w-24 h-24 object-contain rounded-xl border border-gray-100 p-1 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                      {item.statusText}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base leading-snug">
                      {item.product?.name}
                    </h3>
                    <p className="text-xs text-gray-500">Mã Serial / IMEI: <strong className="text-gray-800 font-mono">{item.serialNumber}</strong></p>
                    <p className="text-xs text-gray-500">Khách hàng: <strong className="text-gray-800">{item.customerName}</strong> ({item.customerPhone})</p>
                  </div>
                </div>

                {/* Warranty period box */}
                <div className="w-full md:w-auto text-left md:text-right bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-1.5 shrink-0">
                  <div className="text-xs text-gray-600 flex items-center md:justify-end gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Hạn bảo hành đến: <strong className="text-gray-900">{formatDate(item.endDate)}</strong></span>
                  </div>
                  <div className="text-xs text-blue-700 font-extrabold">
                    Còn lại {item.daysRemaining} ngày bảo hành
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Thời gian bảo hành gốc: {item.product?.warrantyMonths || 24} tháng
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
