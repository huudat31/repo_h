import React from 'react';
import Link from 'next/link';
import {
  Truck,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  RotateCcw,
  CreditCard,
  Lock,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 mt-20">
      {/* 1. Value Proposition Banner */}
      <div className="border-b border-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-900 text-slate-300 rounded-lg shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">Sản phẩm 100% chính hãng</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Xuất hóa đơn VAT & chứng nhận phân phối ủy quyền</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-900 text-slate-300 rounded-lg shrink-0 mt-0.5">
                <Truck className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">Vận chuyển GHN & GHTK</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Giao nhanh toàn quốc, theo dõi hành trình thời gian thực</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-900 text-slate-300 rounded-lg shrink-0 mt-0.5">
                <RotateCcw className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">Chính sách 1 đổi 1 trong 30 ngày</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Đổi mới thiết bị miễn phí nếu phát sinh lỗi phần cứng</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-900 text-slate-300 rounded-lg shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">Thanh toán bảo mật SSL 256-bit</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Hỗ trợ cổng VNPAY QR, ví MoMo và thẻ quốc tế Visa/Master</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Columns */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Col 1: Brand Info */}
            <div className="space-y-3">
              <div className="flex items-baseline">
                <span className="font-extrabold text-base tracking-tight text-white">TechStore</span>
                <span className="ml-1 text-[9px] font-bold uppercase tracking-wider bg-blue-900/60 text-blue-400 px-1.5 py-0.2 rounded border border-blue-800/80">
                  VN
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Hệ thống bán lẻ thiết bị công nghệ và điện máy gia dụng cao cấp chính hãng tại Việt Nam. Cam kết chất lượng, thông số minh bạch và bảo hành dài hạn.
              </p>
              <div className="pt-1 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Showroom 1: 125 Thái Hà, Đống Đa, Hà Nội</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Showroom 2: 240 Nguyễn Thị Minh Khai, Q.3, TP.HCM</span>
                </div>
              </div>
            </div>

            {/* Col 2: Sản phẩm & Danh mục */}
            <div className="space-y-3">
              <h4 className="text-slate-200 font-semibold tracking-wide text-xs uppercase">
                Ngành Hàng Nổi Bật
              </h4>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li>
                  <Link href="/products?categoryId=dien-thoai-tablet" className="hover:text-white transition">
                    Điện thoại & Máy tính bảng
                  </Link>
                </li>
                <li>
                  <Link href="/products?categoryId=laptop-gaming" className="hover:text-white transition">
                    Laptop Gaming & Đồ họa
                  </Link>
                </li>
                <li>
                  <Link href="/products?categoryId=dien-lanh" className="hover:text-white transition">
                    Điện lạnh & Điều hòa Inverter
                  </Link>
                </li>
                <li>
                  <Link href="/products?categoryId=tivi-am-thanh" className="hover:text-white transition">
                    Tivi & Âm thanh rạp hát tại gia
                  </Link>
                </li>
                <li>
                  <Link href="/products?categoryId=smart-home" className="hover:text-white transition">
                    Robot hút bụi & Nhà thông minh
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="hover:text-white transition">
                    So sánh thông số sản phẩm
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Tra cứu & Dịch vụ khách hàng */}
            <div className="space-y-3">
              <h4 className="text-slate-200 font-semibold tracking-wide text-xs uppercase">
                Tra Cứu & Hỗ Trợ
              </h4>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li>
                  <Link href="/tra-cuu-bao-hanh" className="hover:text-white transition">
                    Tra cứu bảo hành điện tử (Serial/IMEI)
                  </Link>
                </li>
                <li>
                  <Link href="/tra-cuu-don-hang" className="hover:text-white transition">
                    Tra cứu hành trình đơn hàng (GHN/GHTK)
                  </Link>
                </li>
                <li>
                  <Link href="/don-hang-cua-toi" className="hover:text-white transition">
                    Lịch sử đơn hàng cá nhân
                  </Link>
                </li>
                <li>
                  <Link href="/tai-khoan" className="hover:text-white transition">
                    Quản lý tài khoản & Sổ địa chỉ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Hotline & Đối tác thanh toán */}
            <div className="space-y-3">
              <h4 className="text-slate-200 font-semibold tracking-wide text-xs uppercase">
                Liên Hệ & Thanh Toán
              </h4>
              <div className="space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Hotline: <strong className="text-white font-semibold">1800 6868</strong> (8:00 - 21:30)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Email: lienhe@techstore.vn</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Phương thức thanh toán chấp nhận
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-300">
                  <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-medium">VNPAY QR</span>
                  <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-medium">Ví MoMo</span>
                  <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-medium">Visa / MasterCard</span>
                  <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-medium">COD (Tiền mặt)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal Bar */}
      <div className="border-t border-slate-900 py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
          <p>© 2026 TechStore VN. Nền tảng thương mại điện tử công nghệ chính hãng.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <Link href="/products" className="hover:text-slate-300 transition">Sản phẩm</Link>
            <Link href="/compare" className="hover:text-slate-300 transition">So sánh</Link>
            <Link href="/tra-cuu-bao-hanh" className="hover:text-slate-300 transition">Bảo hành</Link>
            <Link href="/tra-cuu-don-hang" className="hover:text-slate-300 transition">Vận đơn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
