'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { FolderTree, Plus, Trash2, Edit, Loader2, AlertCircle } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<Category[]>('/categories');
      setCategories(data || []);
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (editingId) {
        await fetchApi(`/categories/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({ name, description }),
        });
      } else {
        await fetchApi('/categories', {
          method: 'POST',
          body: JSON.stringify({ name, description }),
        });
      }
      setShowForm(false);
      setName('');
      setDescription('');
      setEditingId(null);
      loadCategories();
    } catch (err: any) {
      setError(err.message || 'Lỗi lưu danh mục');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) return;
    try {
      await fetchApi(`/categories/${id}`, { method: 'DELETE' });
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Lỗi xóa danh mục');
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
    setShowForm(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Quản Lý Danh Mục Nhóm Hàng</h1>
          <p className="text-xs text-gray-500 mt-1">Phân loại sản phẩm (Điện lạnh, Nhà bếp, Thiết bị số...)</p>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              setEditingId(null);
              setName('');
              setDescription('');
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Danh Mục Mới</span>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-gray-900">
            {editingId ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
          </h2>

          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Tên danh mục *</label>
              <input
                type="text"
                required
                placeholder="VD: Thiết Bị Nhà Bếp"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Mô tả tóm tắt</label>
              <input
                type="text"
                placeholder="VD: Nồi chiên, nồi cơm điện cao tần..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              {saving ? 'Đang lưu...' : 'Lưu Danh Mục'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xs rounded-xl transition"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Đang tải danh mục...</span>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Tên Danh Mục</th>
                <th className="py-3 px-4">Đường Dẫn (Slug)</th>
                <th className="py-3 px-4 text-center">Số Sản Phẩm</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/80 transition">
                  <td className="py-3 px-4">
                    <strong className="text-gray-900 block font-bold">{c.name}</strong>
                    {c.description && <span className="text-[11px] text-gray-400">{c.description}</span>}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-500">{c.slug}</td>
                  <td className="py-3 px-4 text-center font-bold text-blue-600">
                    {c._count?.products || 0}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => startEdit(c)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
