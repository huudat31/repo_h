'use client';

import React, { useState } from 'react';
import { Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { addToCart } from '@/lib/cart-store';

interface AccessoryBundleCardProps {
  mainProduct: any;
  crossSells: any[];
}

export default function AccessoryBundleCard({ mainProduct, crossSells }: AccessoryBundleCardProps) {
  const [selectedAccIds, setSelectedAccIds] = useState<string[]>(crossSells.map((c) => c.id));
  const [bundleAdded, setBundleAdded] = useState(false);

  if (!crossSells || crossSells.length === 0) return null;

  const toggleSelect = (id: string) => {
    setSelectedAccIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedAccessories = crossSells.filter((c) => selectedAccIds.includes(c.id));
  const accessoriesTotal = selectedAccessories.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscount = selectedAccessories.length > 0 ? 50000 : 0; // Giảm 50k khi mua kèm
  const bundleTotal = mainProduct.price + accessoriesTotal - bundleDiscount;

  const handleAddBundleToCart = () => {
    // Add main product
    addToCart({
      id: mainProduct.id,
      name: mainProduct.name,
      slug: mainProduct.slug,
      price: mainProduct.price,
      image: mainProduct.images?.[0] || '',
      specs: mainProduct.specs,
    });

    // Add accessories
    selectedAccessories.forEach((acc) => {
      addToCart({
        id: acc.id,
        name: acc.name,
        slug: acc.slug,
        price: acc.price,
        image: acc.images?.[0] || '',
        specs: acc.specs,
      });
    });

    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="font-bold text-gray-900 text-base">
          Gợi Ý Phụ Kiện Mua Kèm Ưu Đãi (Combo Tiết Kiệm)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {crossSells.map((acc) => {
          const isSelected = selectedAccIds.includes(acc.id);
          return (
            <label
              key={acc.id}
              onClick={() => toggleSelect(acc.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition bg-white ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={acc.images?.[0]}
                alt={acc.name}
                className="w-14 h-14 object-cover rounded-lg border border-gray-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-xs truncate">{acc.name}</p>
                <p className="text-red-600 font-bold text-xs mt-0.5">{formatPrice(acc.price)}</p>
                {acc.specs && (
                  <p className="text-[11px] text-gray-400 truncate">
                    {Object.values(acc.specs)[0] as string}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Summary Box & Add Combo Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-blue-200/60">
        <div>
          <div className="text-xs text-gray-600">
            Tổng combo ({1 + selectedAccessories.length} sản phẩm):
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-red-600">{formatPrice(bundleTotal)}</span>
            {bundleDiscount > 0 && (
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                Tiết kiệm 50.000 đ
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddBundleToCart}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
        >
          {bundleAdded ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Đã Thêm Combo Vào Giỏ Hàng!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Mua Kèm Tiết Kiệm</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
