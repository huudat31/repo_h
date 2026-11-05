'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { HERO_SLIDES, HeroSlide } from '@/lib/curated-products';
import { formatPrice } from '@/lib/formatters';

export default function HeroCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = HERO_SLIDES.length;
  const currentSlide: HeroSlide = HERO_SLIDES[currentIdx];

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(nextSlide, 5500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIdx]);

  return (
    <div
      className="relative w-full h-full min-h-[460px] md:min-h-[500px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Gradient & Animated Glow Canvas */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentSlide.themeGradient} transition-colors duration-700 pointer-events-none`}
      />

      {/* Dynamic Studio Accent Glow behind Product */}
      <div
        className={`absolute right-4 md:right-16 top-1/2 -translate-y-1/2 w-72 md:w-96 h-72 md:h-96 ${currentSlide.accentGlow} rounded-full blur-3xl pointer-events-none transition-all duration-700`}
      />

      {/* Subtle Grid Texture for Premium Tech Feel */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Slide Content Grid (Căn giữa hoàn hảo theo chiều dọc) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1 p-6 sm:p-8 md:p-10">
        {/* Left Column (7 cols): Copywriting, Pricing & CTAs */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black px-3.5 py-1 rounded-full shadow-md tracking-wider uppercase self-start">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>{currentSlide.badge}</span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
              {currentSlide.title}
            </h2>
            <p className="text-amber-300 font-semibold text-base sm:text-lg mt-1 tracking-wide">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Description (Độ tương phản cao, chữ sắc nét trên nền tối) */}
          <p className="text-slate-100 text-xs sm:text-sm leading-relaxed max-w-lg font-normal">
            {currentSlide.description}
          </p>

          {/* Pricing Box & Savings */}
          <div className="pt-1">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-red-400">
                {formatPrice(currentSlide.price)}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 line-through">
                {formatPrice(currentSlide.originalPrice)}
              </span>
              <span className="text-xs font-bold text-red-200 bg-red-950/90 border border-red-700/80 px-2.5 py-0.5 rounded-md shadow-sm">
                {currentSlide.savingText}
              </span>
            </div>

            {/* Quick Specs Checklist */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              {currentSlide.highlightSpecs.map((spec, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-800/90 border border-slate-700 text-slate-200 px-2.5 py-0.5 rounded-md"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/products/${currentSlide.productSlug}`}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-red-600/30 active:scale-95"
            >
              <span>{currentSlide.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={currentSlide.secondaryCtaLink}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-600/90 font-bold px-4 py-3 rounded-xl text-xs sm:text-sm transition"
            >
              {currentSlide.secondaryCtaText}
            </Link>
          </div>
        </div>

        {/* Right Column (5 cols): Isolated Product Stage (Phóng to, nền trong suốt, không viền hộp) */}
        <div className="md:col-span-5 flex items-center justify-center p-2 relative">
          <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[4/5] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={currentSlide.id}
              src={currentSlide.image}
              alt={currentSlide.imageAlt}
              className="w-full h-full object-contain object-center drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform duration-500 animate-in fade-in zoom-in-95 duration-500"
            />
          </div>
        </div>
      </div>

      {/* Navigation Arrows (Glassmorphic) */}
      <button
        onClick={prevSlide}
        aria-label="Slide trước"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 border border-slate-700/80 text-white flex items-center justify-center backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide kế tiếp"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 border border-slate-700/80 text-white flex items-center justify-center backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Indicator Dots (Thanh tiến trình rõ nét) */}
      <div className="relative z-20 pb-4 flex items-center justify-center gap-2.5">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIdx(idx)}
            aria-label={`Chuyển tới slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIdx
                ? 'w-8 h-2 bg-gradient-to-r from-red-500 to-amber-400 shadow-sm'
                : 'w-2 h-2 bg-slate-600/80 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
