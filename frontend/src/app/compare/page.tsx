'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCompareList, removeFromCompare, clearCompare, CompareProduct } from '@/lib/compare-store';
import { formatPrice } from '@/lib/formatters';
import { addToCart } from '@/lib/cart-store';
import { fetchApi } from '@/lib/api';
import { Scale, Trash2, ShoppingCart, Check, ArrowLeft, Filter, Layers } from 'lucide-react';

const SPEC_TITLES: Record<string, string> = {
  thuong_hieu: 'Thương hiệu',
  xuat_xu: 'Xuất xứ',
  inverter: 'Công nghệ tiết kiệm điện (Inverter)',
  cong_suat: 'Công suất tiêu thụ',
  cong_suat_lam_lanh: 'Công suất làm lạnh (HP / BTU)',
  dung_tich: 'Dung tích sử dụng',
  khoi_luong_giat: 'Khối lượng giặt / sấy',
  cong_nghe_chien: 'Công nghệ nấu / chiên',
  nhiet_do: 'Mức nhiệt độ điều chỉnh',
  hen_gio: 'Hẹn giờ nấu',
  dong_co: 'Loại động cơ',
  toc_do_vat: 'Tốc độ vắt tối đa',
  kich_thuoc: 'Kích thước & Trọng lượng',
  tinh_nang_dac_biet: 'Tính năng nổi bật',
  thoi_gian_bao_hanh: 'Thời gian bảo hành chính hãng',
  man_hinh: 'Màn hình hiển thị',
  cpu: 'Bộ vi xử lý (CPU)',
  ram: 'Bộ nhớ RAM',
  bo_nho_trong: 'Bộ nhớ trong (ROM)',
  o_cung: 'Ổ cứng lưu trữ',
};

export default function ComparePage() {
  const [items, setItems] = useState<CompareProduct[]>([]);
  const [detailedProducts, setDetailedProducts] = useState<any[]>([]);
  const [specKeys, setSpecKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const list = getCompareList();
    setItems(list);

    if (list.length >= 2) {
      loadDetailedCompare(list.map((i) => i.id));
    } else {
      setLoading(false);
    }
  }, []);

  const loadDetailedCompare = async (ids: string[]) => {
    try {
      const res = await fetchApi<any>(`/products/compare?ids=${ids.join(',')}`);
      if (res && res.products) {
        setDetailedProducts(res.products);
        setSpecKeys(res.specKeys || []);
      }
    } catch {
      // Fallback: use client specs
      setDetailedProducts(items);
      const keys = new Set<string>();
      items.forEach((p) => {
        if (p.specs) Object.keys(p.specs).forEach((k) => keys.add(k));
      });
      setSpecKeys(Array.from(keys));
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id: string) => {
    removeFromCompare(id);
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    setDetailedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images?.[0] || product.image || '',
      specs: product.specs,
    });
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  if (items.length < 2) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Scale className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cần ít nhất 2 sản phẩm để so sánh</h1>
        <p className="text-gray-500 text-sm mb-6">
          Hãy quay lại danh sách sản phẩm và bấm nút <strong>&quot;So sánh&quot;</strong> trên các sản phẩm bạn quan tâm (tối đa 4 sản phẩm).
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại chọn sản phẩm
        </Link>
      </div>
    );
  }

  // Filter spec rows if "onlyDifferences" is checked
  const visibleSpecKeys = onlyDifferences
    ? specKeys.filter((key) => {
        const values = detailedProducts.map((p) => (p.specs ? String(p.specs[key] || '') : ''));
        const firstVal = values[0];
        return values.some((v) => v !== firstVal);
      })
    : specKeys;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold mb-1">
            <Link href="/products" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Tiếp tục xem sản phẩm
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Scale className="w-7 h-7 text-blue-600" />
            <span>Ma Trận So Sánh Sản Phẩm ({detailedProducts.length} sản phẩm)</span>
          </h1>
        </div>

        {/* Toggle options */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 shadow-sm">
            <input
              type="checkbox"
              checked={onlyDifferences}
              onChange={(e) => setOnlyDifferences(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Chỉ hiển thị điểm khác biệt</span>
          </label>

          <button
            onClick={() => {
              clearCompare();
              setItems([]);
              setDetailedProducts([]);
            }}
            className="text-xs font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="p-4 w-52 font-semibold text-gray-500 text-xs uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                Sản phẩm
              </th>
              {detailedProducts.map((p) => {
                const img = p.images?.[0] || p.image || '';
                return (
                  <th key={p.id} className="p-4 min-w-[240px] align-top text-center border-l border-gray-100">
                    <div className="relative group flex flex-col items-center">
                      <button
                        onClick={() => handleRemove(p.id)}
                        className="absolute -top-1 -right-1 text-gray-400 hover:text-red-600 p-1 rounded-full bg-white shadow-sm border border-gray-100"
                        title="Xóa khỏi so sánh"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <Link href={`/products/${p.slug}`} className="mb-3 hover:opacity-80 transition block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={p.name} className="w-28 h-28 object-contain" />
                      </Link>

                      {p.brand && (
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                          {p.brand.name}
                        </span>
                      )}

                      <Link
                        href={`/products/${p.slug}`}
                        className="font-bold text-gray-900 text-sm hover:text-blue-600 line-clamp-2 mb-2"
                      >
                        {p.name}
                      </Link>

                      <div className="text-base font-extrabold text-red-600 mb-3">
                        {formatPrice(p.price)}
                      </div>

                      <button
                        onClick={() => handleAddToCart(p)}
                        className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                      >
                        {addedIds[p.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Đã thêm!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Thêm vào giỏ</span>
                          </>
                        )}
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {/* Price Row */}
            <tr className="bg-red-50/20">
              <td className="p-4 font-bold text-gray-800 sticky left-0 bg-red-50/40 z-10 border-r border-gray-100 text-xs">
                Giá niêm yết
              </td>
              {detailedProducts.map((p) => (
                <td key={p.id} className="p-4 text-center font-extrabold text-red-600 text-base border-l border-gray-100">
                  {formatPrice(p.price)}
                </td>
              ))}
            </tr>

            {/* Warranty Row */}
            <tr>
              <td className="p-4 font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-100 text-xs">
                Bảo hành chính hãng
              </td>
              {detailedProducts.map((p) => (
                <td key={p.id} className="p-4 text-center text-gray-800 font-medium border-l border-gray-100">
                  {p.warrantyMonths || 12} tháng
                </td>
              ))}
            </tr>

            {/* Dynamic Technical Specs Rows */}
            {visibleSpecKeys.map((key) => {
              const label = SPEC_TITLES[key] || key.replace(/_/g, ' ').toUpperCase();
              return (
                <tr key={key} className="hover:bg-gray-50/60 transition">
                  <td className="p-4 font-semibold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-100 text-xs">
                    {label}
                  </td>
                  {detailedProducts.map((p) => {
                    const val = p.specs ? p.specs[key] : null;
                    return (
                      <td key={p.id} className="p-4 text-center text-gray-800 border-l border-gray-100 text-xs">
                        {val ? (
                          String(val).includes('Inverter') || String(val) === 'Có' ? (
                            <span className="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold">
                              {String(val)}
                            </span>
                          ) : (
                            String(val)
                          )
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
