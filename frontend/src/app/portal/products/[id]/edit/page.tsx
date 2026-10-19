'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

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
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Dynamic Specs (JSONB)
  const [specRows, setSpecRows] = useState<{ key: string; value: string }[]>([]);

  // Variants
  const [variants, setVariants] = useState<
    { name: string; sku: string; price: number; stock: number }[]
  >([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetchApi<Category[]>('/categories'),
      fetchApi<Brand[]>('/brands'),
      fetchApi<any>(`/products/${id}`),
    ])
      .then(([cats, brs, product]) => {
        setCategories(cats || []);
        setBrands(brs || []);

        if (product) {
          setName(product.name || '');
          setSku(product.sku || '');
          setPrice(product.price || 0);
          setOriginalPrice(product.originalPrice || 0);
          setStock(product.stock || 0);
          setCategoryId(product.categoryId || '');
          setBrandId(product.brandId || '');
          setWarrantyMonths(product.warrantyMonths || 24);
          setShortDescription(product.shortDescription || '');
          setDescription(product.description || '');
          setVideoUrl(product.videoUrl || '');
          setImages(product.images || []);

          if (product.specs && typeof product.specs === 'object') {
            const rows = Object.entries(product.specs).map(([k, v]) => ({
              key: k,
              value: String(v),
            }));
            setSpecRows(rows);
          }

          if (product.variants && Array.isArray(product.variants)) {
            setVariants(
              product.variants.map((v: any) => ({
                name: v.name,
                sku: v.sku,
                price: v.price,
                stock: v.stock,
              }))
            );
          }
        }
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải thông tin sản phẩm');
      })
      .finally(() => setLoadingInitial(false));
  }, [id]);

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
        name: '',
        sku: `${sku}-${variants.length + 1}`,
        price: price,
        stock: 5,
      },
    ]);
  };

  const handleUpdateVariant = (
    index: number,
    field: 'name' | 'sku' | 'price' | 'stock',
    val: any
  ) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: val };
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const specsObject: Record<string, string> = {};
      specRows.forEach((row) => {
        if (row.key.trim()) {
          specsObject[row.key.trim()] = row.value.trim();
        }
      });

      const payload = {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        stock: Number(stock),
        categoryId,
        brandId,
        warrantyMonths: Number(warrantyMonths),
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        images,
        specs: specsObject,
        variants: variants.length > 0 ? variants : undefined,
      };

      await fetchApi(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      router.push('/portal/products');
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="py-20 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span>Đang tải thông tin sản phẩm...</span>
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
          <h1 className="text-xl font-extrabold text-gray-900">Chỉnh Sửa Sản Phẩm</h1>
          <p className="text-xs text-gray-500">Cập nhật thông tin chi tiết, giá bán và thông số kỹ thuật</p>
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
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500 bg-white"
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
                Thương hiệu *
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500 bg-white"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Giá & Tồn kho */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>2. Giá Bán & Kho Hàng</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Giá khuyến mãi / Giá bán (VNĐ) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl font-bold text-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Giá niêm yết gốc (VNĐ)
              </label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Số lượng tồn kho *
              </label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* 3. Hình ảnh */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>3. Hình Ảnh Sản Phẩm ({images.length})</span>
          </h2>

          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Nhập đường link ảnh (URL)..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs border border-gray-300 rounded-xl"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
            >
              Thêm Ảnh
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group border border-gray-200 rounded-xl p-1 bg-white">
                <img
                  src={img}
                  alt={`Preview ${idx}`}
                  className="w-full h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition shadow"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Thông số kỹ thuật động (Dynamic JSONB Specs) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>4. Thông Số Kỹ Thuật (Dynamic Specs JSONB)</span>
            </h2>

            {/* Template Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-gray-400 font-medium">Mẫu gợi ý:</span>
              <button
                type="button"
                onClick={() => handleApplyTemplate('dien_lanh')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
              >
                Điện Lạnh
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('gia_dung')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition"
              >
                Gia Dụng
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('thiet_bi_so')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition"
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
                  placeholder="Tên thuộc tính (VD: inverter, cong_suat)..."
                  value={row.key}
                  onChange={(e) => handleUpdateSpecRow(idx, 'key', e.target.value)}
                  className="w-1/3 px-3 py-1.5 text-xs border border-gray-300 rounded-xl font-mono"
                />
                <input
                  type="text"
                  placeholder="Giá trị (VD: Có, 1850 W)..."
                  value={row.value}
                  onChange={(e) => handleUpdateSpecRow(idx, 'value', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpecRow(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddSpecRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm dòng thông số</span>
            </button>
          </div>
        </div>

        {/* 5. Mô tả & Video */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>5. Mô Tả Chi Tiết & Video Review</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Tóm tắt ngắn điểm nổi bật (Short Description)
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Bài viết giới thiệu chi tiết
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Video giới thiệu / Đập hộp (YouTube URL)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/portal/products"
            className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition"
          >
            Hủy Bỏ
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Cập Nhật Sản Phẩm</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
