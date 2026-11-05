'use client';

import React, { useState, useEffect } from 'react';
import { PhoneCall, ArrowUp, MessageCircle } from 'lucide-react';

export default function FloatingSupportWidget() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* 1. Zalo Chat Floating Action Button */}
      <a
        href="https://zalo.me/0901234567"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat Zalo tư vấn trực tiếp 24/7"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#0068FF] hover:bg-[#0052cc] text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white"
      >
        <span className="font-black text-xs tracking-tighter">Zalo</span>
        <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md pointer-events-none">
          Chat Zalo tư vấn 24/7
        </span>
        {/* Pulsing ring indicator */}
        <span className="absolute inset-0 rounded-full bg-[#0068FF] opacity-30 animate-ping pointer-events-none" />
      </a>

      {/* 2. Hotline Quick Call Floating Button */}
      <a
        href="tel:18006868"
        title="Gọi miễn phí 1800 6868"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white"
      >
        <PhoneCall className="w-5 h-5 animate-pulse" />
        <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md pointer-events-none">
          Hotline: 1800 6868 (Miễn phí)
        </span>
      </a>

      {/* 3. Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          title="Cuộn lên đầu trang"
          aria-label="Cuộn lên đầu trang"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-blue-600 shadow-lg border border-slate-200 hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
