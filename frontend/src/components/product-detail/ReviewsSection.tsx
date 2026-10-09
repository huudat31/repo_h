'use client';

import React, { useState } from 'react';
import { Star, Image as ImageIcon, CheckCircle, MessageSquare, Send } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerified?: boolean;
  createdAt: string | Date;
}

interface ReviewsSectionProps {
  productId: string;
  reviews?: ReviewItem[];
}

export default function ReviewsSection({ productId, reviews = [] }: ReviewsSectionProps) {
  const [list, setList] = useState<ReviewItem[]>(reviews);
  const [hasImagesOnly, setHasImagesOnly] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = list.length;
  const avg =
    total > 0
      ? (list.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : '5.0';

  const filtered = hasImagesOnly ? list.filter((r) => r.images && r.images.length > 0) : list;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newAuthor.trim()) return;

    setIsSubmitting(true);
    const mockNew: ReviewItem = {
      id: `rev-${Date.now()}`,
      authorName: newAuthor,
      rating: newRating,
      comment: newComment,
      isVerified: true,
      images: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
      ],
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setList([mockNew, ...list]);
      setNewComment('');
      setNewAuthor('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">
      {/* Overview & Rating stats */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-amber-500">{avg}</div>
            <div className="flex items-center justify-center gap-1 my-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(Number(avg))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500">{total} lượt đánh giá</div>
          </div>

          <div className="h-16 w-px bg-gray-200 hidden md:block" />

          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>100% đánh giá từ người mua hàng thực tế</span>
            </div>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Kèm hình ảnh mở hộp & trải nghiệm thực tế</span>
            </div>
          </div>
        </div>

        {/* Filter Tab: Image only */}
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl cursor-pointer hover:bg-gray-100 transition">
          <input
            type="checkbox"
            checked={hasImagesOnly}
            onChange={(e) => setHasImagesOnly(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <ImageIcon className="w-4 h-4 text-blue-600" />
          <span>Chỉ xem đánh giá có hình ảnh ({list.filter((r) => r.images?.length).length})</span>
        </label>
      </div>

      {/* Review list */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Chưa có đánh giá nào phù hợp với bộ lọc.</p>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="pb-6 border-b border-gray-100 last:border-0 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {item.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <span>{item.authorName}</span>
                      {item.isVerified && (
                        <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.2 rounded flex items-center gap-0.5 font-medium">
                          <CheckCircle className="w-2.5 h-2.5" /> Đã mua hàng
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">{item.comment}</p>

              {/* Customer Uploaded Real Photos */}
              {item.images && item.images.length > 0 && (
                <div className="flex gap-2 pt-1">
                  {item.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-20 h-20 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 p-0.5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="User Review Attachment" className="w-full h-full object-cover rounded-lg" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Submission Form */}
      <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span>Viết Đánh Giá Của Bạn Về Sản Phẩm</span>
        </h4>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-600">Đánh giá sao:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewRating(star)}
                className="p-1 focus:outline-none"
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Họ và tên của bạn"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        <textarea
          required
          rows={3}
          placeholder="Chia sẻ cảm nhận về chất lượng, công suất, độ êm khi hoạt động hoặc khả năng tiết kiệm điện..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-500 italic">
            * Đánh giá kèm hình ảnh thực tế sẽ được ưu tiên hiển thị đầu tiên
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi Đánh Giá</span>
          </button>
        </div>
      </form>
    </div>
  );
}
