'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight, Scale, Trash2 } from 'lucide-react';
import { getCompareList, removeFromCompare, clearCompare, CompareProduct } from '@/lib/compare-store';
import { formatPrice } from '@/lib/formatters';

export default function ComparisonBar() {
  const [list, setList] = useState<CompareProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setList(getCompareList());

    const handleUpdate = () => setList(getCompareList());
    window.addEventListener('compare_updated', handleUpdate);
    return () => window.removeEventListener('compare_updated', handleUpdate);
  }, []);

  if (!mounted || list.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-blue-200 shadow-2xl py-3 px-4 transition-all animate-in slide-in-from-bottom">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Header indicator */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 text-white rounded-lg">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <span>So Sánh Sản Phẩm</span>
              <span className="text-xs bg-blue-100 text-blue-700 font-extrabold px-2 py-0.5 rounded-full">
                {list.length}/4
              </span>
            </div>
            <p className="text-[11px] text-gray-500">Chọn từ 2 đến 4 sản phẩm để đối chiếu thông số & giá</p>
          </div>
        </div>

        {/* Selected Products Preview Cards */}
        <div className="flex items-center gap-3 overflow-x-auto max-w-full pb-1 md:pb-0">
          {list.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1.5 pr-3 shrink-0 relative group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded bg-white" />
              <div className="max-w-[120px]">
                <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                <p className="text-[11px] text-red-600 font-bold">{formatPrice(item.price)}</p>
              </div>
              <button
                onClick={() => removeFromCompare(item.id)}
                className="text-gray-400 hover:text-red-600 p-0.5 rounded-full"
                title="Xóa khỏi so sánh"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Empty slot indicators */}
          {Array.from({ length: 4 - list.length }).map((_, idx) => (
            <div
              key={idx}
              className="hidden lg:flex items-center justify-center w-28 h-12 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-[11px] font-medium"
            >
              + Thêm sản phẩm
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1 transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
          </button>

          <Link
            href="/compare"
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm ${
              list.length >= 2
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
            }`}
          >
            <span>So Sánh Ngay {list.length < 2 && '(Cần ít nhất 2 SP)'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
