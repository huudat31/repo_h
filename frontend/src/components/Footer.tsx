import React from 'react';
import { Truck, CreditCard, Shield, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 pt-12 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-lg">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Giao hàng siêu tốc</h4>
              <p className="text-sm text-slate-400">Tích hợp GHN & GHTK toàn quốc</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 bg-green-600/20 text-green-400 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Thanh toán bảo mật</h4>
              <p className="text-sm text-slate-400">Hỗ trợ cổng VNPAY & MoMo an toàn</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Bảo hành chính hãng</h4>
              <p className="text-sm text-slate-400">Cam kết chất lượng 100%</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">TechStore VN</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Hệ thống bán lẻ thiết bị công nghệ hàng đầu, mang đến sản phẩm chính hãng với mức giá cạnh tranh nhất.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Hồ Chí Minh & Hà Nội, Việt Nam</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Cổng Thanh Toán</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 bg-slate-800 rounded font-medium text-slate-200 border border-slate-700">VNPAY QR</span>
              <span className="px-3 py-1.5 bg-slate-800 rounded font-medium text-slate-200 border border-slate-700">Ví MoMo</span>
              <span className="px-3 py-1.5 bg-slate-800 rounded font-medium text-slate-200 border border-slate-700">COD Tiền mặt</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Đối Tác Vận Chuyển</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 bg-slate-800 rounded font-medium text-slate-200 border border-slate-700">GHN Express</span>
              <span className="px-3 py-1.5 bg-slate-800 rounded font-medium text-slate-200 border border-slate-700">GHTK Tiết Kiệm</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Hỗ Trợ Khách Hàng</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" /> 1900 6868 (8:00 - 21:00)
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" /> support@techstore.vn
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© 2026 TechStore VN. Kiến trúc Next.js 15 + NestJS + PostgreSQL + Redis + Elasticsearch.</p>
        </div>
      </div>
    </footer>
  );
}
