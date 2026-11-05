'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
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
      className="relative w-full h-full min-h-[460px] md:min-h-[500px] rounded-3xl overflow-hidden border border-[#E5E7EB] bg-[#F8FAFC] flex flex-col justify-between group shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Light Clean Subtle Tone Canvas */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F8FAFC] to-[#F1F5F9] pointer-events-none" />

      {/* Main Slide Content Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1 p-6 sm:p-8 md:p-12">
        {/* Left Column (7 cols): Editorial Headline, Specs, Pricing & CTA */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#2563EB] border border-blue-200/80 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{currentSlide.badge}</span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#111827]">
              {currentSlide.title}
            </h2>
            <p className="text-[#2563EB] font-bold text-base sm:text-lg mt-1 tracking-normal">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-[#4B5563] text-xs sm:text-sm leading-relaxed max-w-lg font-normal">
            {currentSlide.description}
          </p>

          {/* Pricing Box & Savings */}
          <div className="pt-1">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-[#EF4444]">
                {formatPrice(currentSlide.price)}
              </span>
              <span className="text-xs sm:text-sm text-[#9CA3AF] line-through font-medium">
                {formatPrice(currentSlide.originalPrice)}
              </span>
              <span className="text-xs font-bold text-[#DC2626] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-md">
                {currentSlide.savingText}
              </span>
            </div>

            {/* Quick Specs Checklist */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              {currentSlide.highlightSpecs.map((spec, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white border border-[#E5E7EB] text-[#374151] px-2.5 py-1 rounded-lg shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/products/${currentSlide.productSlug}`}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition shadow-sm active:scale-95"
            >
              <span>{currentSlide.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={currentSlide.secondaryCtaLink}
              className="bg-white hover:bg-[#F9FAFB] text-[#111827] border border-[#E5E7EB] font-semibold px-4 py-3 rounded-xl text-xs sm:text-sm transition"
            >
              {currentSlide.secondaryCtaText}
            </Link>
          </div>
        </div>

        {/* Right Column (5 cols): Large Isolated Product Showcase */}
        <div className="md:col-span-5 flex items-center justify-center p-2 sm:p-4 relative h-full">
          <div className="relative w-full max-w-[420px] sm:max-w-[480px] h-[340px] sm:h-[420px] md:h-[450px] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={currentSlide.id}
              src={currentSlide.image}
              alt={currentSlide.imageAlt}
              className="w-full h-full object-contain object-center drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)] hover:scale-105 transition-transform duration-500 animate-in fade-in zoom-in-95 duration-500 select-none pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Navigation Arrows (Clean White Rounded Buttons) */}
      <button
        onClick={prevSlide}
        aria-label="Slide trước"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 text-[#374151]" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide kế tiếp"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
      >
        <ChevronRight className="w-5 h-5 text-[#374151]" />
      </button>

      {/* Bottom Indicator Dots */}
      <div className="relative z-20 pb-4 flex items-center justify-center gap-2">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIdx(idx)}
            aria-label={`Chuyển tới slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIdx
                ? 'w-7 h-2 bg-[#2563EB]'
                : 'w-2 h-2 bg-[#D1D5DB] hover:bg-[#9CA3AF]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
