'use client';

import React, { useState, useRef } from 'react';
import { RotateCcw, Video, Image as ImageIcon } from 'lucide-react';

interface Product360ViewerProps {
  images: string[];
  media360Urls?: string[];
  videoUrl?: string | null;
  productName: string;
}

export default function Product360Viewer({
  images,
  media360Urls = [],
  videoUrl,
  productName,
}: Product360ViewerProps) {
  const [mode, setMode] = useState<'gallery' | '360' | 'video'>('gallery');
  const [selectedImage, setSelectedImage] = useState(images[0] || '');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const frames = media360Urls.length > 0 ? media360Urls : images;

  // 360 Drag rotation handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || frames.length <= 1) return;
    const deltaX = e.clientX - startX.current;
    if (Math.abs(deltaX) > 15) {
      const step = deltaX > 0 ? 1 : -1;
      setCurrentFrame((prev) => (prev + step + frames.length) % frames.length);
      startX.current = e.clientX;
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="space-y-4">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode('gallery')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
            mode === 'gallery'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Hình ảnh</span>
        </button>

        {frames.length > 0 && (
          <button
            onClick={() => setMode('360')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              mode === '360'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xoay 360° tương tác</span>
          </button>
        )}

        {videoUrl && (
          <button
            onClick={() => setMode('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              mode === 'video'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video thực tế</span>
          </button>
        )}
      </div>

      {/* Main Display Stage */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-[420px] flex items-center justify-center p-4 relative select-none">
        {mode === 'gallery' && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={selectedImage}
            alt={productName}
            className="max-h-full max-w-full object-contain"
          />
        )}

        {mode === '360' && (
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full flex flex-col items-center justify-center cursor-ew-resize relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frames[currentFrame]}
              alt={`360 Frame ${currentFrame}`}
              className="max-h-full max-w-full object-contain pointer-events-none"
            />
            <div className="absolute bottom-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Kéo chuột sang trái / phải để xoay 360 độ</span>
            </div>
          </div>
        )}

        {mode === 'video' && videoUrl && (
          <div className="w-full h-full flex items-center justify-center bg-black rounded-xl overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Product Video"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Thumbnails list in Gallery mode */}
      {mode === 'gallery' && images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`w-20 h-20 rounded-xl border p-1 bg-white shrink-0 overflow-hidden transition ${
                selectedImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="Thumb" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
