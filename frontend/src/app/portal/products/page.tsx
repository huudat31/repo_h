'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { formatPrice } from '@/lib/formatters';
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchApi<{ data: any[] }>('/products?limit=100');
      setProducts(res.data || []);
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) return;
    try {
      await fetchApi(`/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Không thể xóa sản phẩm');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Quản Lý Sản Phẩm & Tồn Kho</h1>
          <p className="text-xs text-gray-500 mt-1">
            Tổng cộng: {products.length} sản phẩm trong hệ thống
          </p>
        </div>

        <Link
          href="/portal/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm Mới</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm hoặc mã SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-xs focus:outline-none"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Đang tải danh sách sản phẩm...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400 space-y-2">
            <Package className="w-10 h-10 text-gray-300 mx-auto" />
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Sản Phẩm</th>
                  <th className="py-3 px-4">Mã SKU</th>
                  <th className="py-3 px-4">Danh Mục</th>
                  <th className="py-3 px-4">Giá Bán</th>
                  <th className="py-3 px-4 text-center">Tồn Kho</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredProducts.map((p) => {
                  const isLowStock = p.stock <= 5;
                  const firstImg = p.images?.[0] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=100&q=80';

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={firstImg}
                            alt={p.name}
                            className="w-10 h-10 object-contain rounded-lg border border-gray-100 p-0.5 shrink-0 bg-white"
                          />
                          <div className="min-w-0 max-w-sm">
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              className="font-bold text-gray-900 hover:text-blue-600 truncate block text-xs"
                            >
                              {p.name}
                            </Link>
                            <span className="text-[10px] text-gray-400">
                              {p.brand?.name || 'Chính Hãng'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] font-bold text-gray-500">
                        {p.sku}
                      </td>

                      <td className="py-3 px-4 text-gray-600">
                        {p.category?.name || '---'}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-extrabold text-blue-600">
                          {formatPrice(p.price)}
                        </div>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <div className="text-[10px] text-gray-400 line-through">
                            {formatPrice(p.originalPrice)}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                            isLowStock
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : 'bg-green-50 text-green-700 border border-green-200'
                          }`}
                        >
                          {isLowStock && <AlertTriangle className="w-3 h-3" />}
                          <span>{p.stock}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/portal/products/${p.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
