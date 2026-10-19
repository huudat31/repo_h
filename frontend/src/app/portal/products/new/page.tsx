'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import {
  Package,
  ArrowLeft,
  Plus,
  Trash2,
  Wrench,
  Layers,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

const TEMPLATES: Record<string, Record<string, string>> = {
  dien_lanh: {
    thuong_hieu: 'Panasonic',
    xuat_xu: 'Việt Nam',
    inverter: 'Có (Tiết kiệm 45% điện năng)',
    cong_suat: '1850 W',
    khoi_luong_giat: '10.5 kg (Giặt) / 6.0 kg (Sấy)',
    toc_do_vat: '1400 vòng/phút',
    kich_thuoc: 'Rộng 59.6 cm - Sâu 60 cm - Cao 84.5 cm',
  },
  gia_dung: {
    thuong_hieu: 'Philips',
    xuat_xu: 'Ba Lan',
    dung_tich: '7.2 Lít (Giỏ chiên 1.4 kg)',
    cong_suat: '2000 W',
    nhiet_do: '40 - 200°C',
    cong_nghe_chien: 'Rapid Air xoáy nhiệt tuần hoàn 360 độ',
  },
  thiet_bi_so: {
    thuong_hieu: 'ASUS ROG',
    cpu: 'Intel Core Ultra 9 185H (16 nhân, 22 luồng)',
    ram: '32 GB LPDDR5X 7467 MHz Onboard',
    o_cung: '2 TB PCIe 4.0 NVMe M.2 SSD',
    man_hinh: '16.0 inch 2.5K OLED 240Hz',
    card_do_hoa: 'NVIDIA GeForce RTX 4080 12GB',
    pin: '90 Wh, sạc nhanh 100W Type-C PD',
  },
};

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form Basic Info
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState<number>(24);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Image URLs
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Dynamic Specs (JSONB)
  const [specRows, setSpecRows] = useState<{ key: string; value: string }[]>([
    { key: 'xuat_xu', value: 'Chính hãng' },
    { key: 'inverter', value: 'Có' },
  ]);

  // Variants
  const [variants, setVariants] = useState<
    { name: string; sku: string; price: number; stock: number }[]
  >([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetchApi<Category[]>('/categories'),
      fetchApi<Brand[]>('/brands'),
    ])
      .then(([cats, brs]) => {
        setCategories(cats || []);
        setBrands(brs || []);
        if (cats?.length) setCategoryId(cats[0].id);
        if (brs?.length) setBrandId(brs[0].id);
      })
      .catch(() => {})
      .finally(() => setLoadingInitial(false));
  }, []);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  // Specs Rows Handlers
  const handleAddSpecRow = () => {
    setSpecRows([...specRows, { key: '', value: '' }]);
  };

  const handleUpdateSpecRow = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specRows];
    updated[index][field] = val;
    setSpecRows(updated);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecRows(specRows.filter((_, idx) => idx !== index));
  };

  const handleApplyTemplate = (type: 'dien_lanh' | 'gia_dung' | 'thiet_bi_so') => {
    const template = TEMPLATES[type];
    const newRows = Object.entries(template).map(([k, v]) => ({ key: k, value: v }));
    setSpecRows(newRows);
  };

  // Variants Handlers
  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        name: `Phiên bản ${variants.length + 1}`,
        sku: `${sku || 'SKU'}-VAR-${variants.length + 1}`,
        price: price || 0,
        stock: 5,
      },
    ]);
  };

  const handleUpdateVariant = (index: number, field: string, val: any) => {
    const updated = [...variants];
    (updated[index] as any)[field] = val;
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Vui lòng nhập tên sản phẩm');
    if (!sku.trim()) return setError('Vui lòng nhập mã SKU duy nhất');
    if (!price || price <= 0) return setError('Vui lòng nhập giá bán hợp lệ');
    if (!categoryId) return setError('Vui lòng chọn danh mục sản phẩm');
    if (images.length === 0) return setError('Vui lòng thêm ít nhất 1 ảnh sản phẩm');

    // Convert specRows to JSONB object
    const specsObject: Record<string, string> = {};
    specRows.forEach((row) => {
      if (row.key.trim()) {
        specsObject[row.key.trim()] = row.value.trim();
      }
    });

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        stock: Number(stock) || 0,
        categoryId,
        brandId: brandId || undefined,
        warrantyMonths: Number(warrantyMonths) || 12,
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        images,
        specs: specsObject,
        variants: variants.length > 0 ? variants : undefined,
      };

      await fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      router.push('/portal/products');
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="py-20 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span>Đang khởi tạo biểu mẫu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/portal/products"
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Thêm Sản Phẩm Mới</h1>
          <p className="text-xs text-gray-500">Cấu hình thông tin, giá bán, kho hàng và thông số kỹ thuật</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Thông tin cơ bản */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <span>1. Thông Tin Cơ Bản</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Tên sản phẩm đầy đủ *
              </label>
              <input
                type="text"
                required
                placeholder="VD: Máy Giặt Sấy Panasonic Inverter 10.5 kg NA-V105FR1BV"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Mã SKU duy nhất *
              </label>
              <input
                type="text"
                required
                placeholder="VD: PANA-NA-V105"
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl font-mono uppercase"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Thời gian bảo hành (Tháng)
              </label>
              <input
                type="number"
                min="0"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Danh mục sản phẩm *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Thương hiệu
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl bg-white"
              >
                <option value="">-- Chọn thương hiệu --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Mô tả ngắn gọn (Hiển thị thẻ Card)
            </label>
            <input
              type="text"
              placeholder="VD: Công nghệ giặt nước nóng diệt khuẩn Blue Ag+, sấy tiện ích Hybrid Dry..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Mô tả chi tiết sản phẩm
            </label>
            <textarea
              rows={3}
              placeholder="Nhập thông tin chi tiết về tính năng, bảo hành và công nghệ vượt trội..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl"
            />
          </div>
        </div>

        {/* 2. Giá bán & Tồn kho */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <span className="text-emerald-600 font-extrabold">₫</span>
            <span>2. Giá Bán & Tồn Kho</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Giá bán thực tế (VND) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                placeholder="16490000"
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl font-bold text-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Giá niêm yết gốc (VND)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                placeholder="19990000"
                value={originalPrice || ''}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl text-gray-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Số lượng tồn kho ban đầu *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="20"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* 3. Quản lý Hình Ảnh */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <span>3. Hình Ảnh & Video Thực Tế</span>
          </h2>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Dán URL ảnh sản phẩm (VD: https://images.unsplash.com/...)..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs border border-gray-300 rounded-xl"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shrink-0"
              >
                + Thêm Ảnh
              </button>
            </div>

            {/* Image Preview Grid */}
            <div className="flex flex-wrap gap-3 pt-2">
              {images.map((url, idx) => (
                <div key={idx} className="relative group w-20 h-20 rounded-xl border border-gray-200 overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`preview-${idx}`} className="w-full h-full object-contain p-1" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition shadow"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Link Video trải nghiệm (YouTube URL)
              </label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 4. Tập thuộc tính kỹ thuật động (Dynamic JSONB Specs) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-100 gap-2">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>4. Thông Số Kỹ Thuật Động (JSONB Specs)</span>
            </h2>

            {/* Quick Templates */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-400 text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Gợi ý mẫu:
              </span>
              <button
                type="button"
                onClick={() => handleApplyTemplate('dien_lanh')}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold text-[11px] hover:bg-blue-100 transition"
              >
                Điện Lạnh
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('gia_dung')}
                className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-semibold text-[11px] hover:bg-purple-100 transition"
              >
                Gia Dụng
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('thiet_bi_so')}
                className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold text-[11px] hover:bg-emerald-100 transition"
              >
                Thiết Bị Số
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {specRows.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tên thuộc tính (VD: inverter, cong_suat...)"
                  value={row.key}
                  onChange={(e) => handleUpdateSpecRow(idx, 'key', e.target.value)}
                  className="w-1/3 px-3 py-1.5 text-xs border border-gray-300 rounded-lg font-mono"
                />
                <input
                  type="text"
                  placeholder="Giá trị thông số (VD: Có Inverter, 1850 W, 7.2 Lít...)"
                  value={row.value}
                  onChange={(e) => handleUpdateSpecRow(idx, 'value', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpecRow(idx)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddSpecRow}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm dòng thông số kỹ thuật
            </button>
          </div>
        </div>

        {/* 5. Biến thể sản phẩm (Variants) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>5. Biến Thể Sản Phẩm (Tùy Chọn)</span>
            </h2>

            <button
              type="button"
              onClick={handleAddVariant}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Thêm biến thể
            </button>
          </div>

          {variants.length === 0 ? (
            <p className="text-xs text-gray-400 py-2">
              Sản phẩm đơn (chưa có biến thể màu sắc, dung tích, công suất)
            </p>
          ) : (
            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-xl items-center text-xs">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">Tên biến thể</label>
                    <input
                      type="text"
                      placeholder="Xám Đen Titan (10.5 kg)"
                      value={v.name}
                      onChange={(e) => handleUpdateVariant(idx, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">Mã SKU biến thể</label>
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">Giá bán (VND)</label>
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => handleUpdateVariant(idx, 'price', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white font-bold text-blue-600"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-gray-500 block mb-0.5">Tồn kho</label>
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => handleUpdateVariant(idx, 'stock', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-600 mt-4 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/portal/products"
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xs rounded-xl transition"
          >
            Hủy Bỏ
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lưu sản phẩm...</span>
              </>
            ) : (
              <span>Lưu & Phát Hành Sản Phẩm</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
