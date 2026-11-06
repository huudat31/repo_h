import React from 'react';
import Link from 'next/link';
import {
  Truck,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  RotateCcw,
  Lock,
  ShieldAlert,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F9FAFB] text-[#4B5563] text-xs border-t border-[#E5E7EB] mt-16">
      {/* 1. Value Proposition Banner */}
      <div className="border-b border-[#E5E7EB] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-50 text-[#2563EB] rounded-xl shrink-0 mt-0.5 border border-blue-200/60">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div>
                <h4 className="font-bold text-[#111827] text-xs">Sản phẩm 100% chính hãng</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Xuất hóa đơn VAT & tem phụ ủy quyền</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-50 text-[#16A34A] rounded-xl shrink-0 mt-0.5 border border-emerald-200/60">
                <Truck className="w-4 h-4 text-[#16A34A]" />
              </div>
              <div>
                <h4 className="font-bold text-[#111827] text-xs">Vận chuyển GHN & GHTK</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Giao nhanh toàn quốc, theo dõi hành trình 24/7</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-50 text-[#F59E0B] rounded-xl shrink-0 mt-0.5 border border-amber-200/60">
                <RotateCcw className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div>
                <h4 className="font-bold text-[#111827] text-xs">1 đổi 1 trong 30 ngày</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Đổi mới thiết bị miễn phí nếu phát sinh lỗi nhà sản xuất</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-purple-50 text-[#8B5CF6] rounded-xl shrink-0 mt-0.5 border border-purple-200/60">
                <Lock className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <div>
                <h4 className="font-bold text-[#111827] text-xs">Thanh toán bảo mật</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Cổng VNPAY QR, ví MoMo và thẻ tín dụng Visa/Master</p>
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
                <span className="font-extrabold text-base tracking-tight text-[#111827]">TechStore</span>
                <span className="ml-1 text-[9px] font-bold uppercase tracking-wider bg-[#2563EB] text-white px-1.5 py-0.2 rounded">
                  VN
                </span>
              </div>
              <p className="text-[#6B7280] leading-relaxed text-[11px]">
                Hệ thống bán lẻ thiết bị công nghệ và điện máy gia dụng cao cấp chính hãng tại Việt Nam. Cam kết chất lượng, thông số minh bạch và bảo hành dài hạn.
              </p>
              <div className="pt-1 space-y-1.5 text-[11px] text-[#4B5563]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                  <span>Showroom 1: 125 Thái Hà, Đống Đa, Hà Nội</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                  <span>Showroom 2: 240 Nguyễn Thị Minh Khai, Q.3, TP.HCM</span>
                </div>
              </div>
            </div>

            {/* Col 2: Sản phẩm & Danh mục */}
            <div className="space-y-3">
              <h4 className="text-[#111827] font-bold tracking-wide text-xs uppercase">
                Ngành Hàng Nổi Bật
              </h4>
              <ul className="space-y-2 text-[11px] text-[#4B5563]">
                <li>
                  <Link href="/products?categoryId=dien-thoai-tablet" className="hover:text-[#2563EB] transition">
                    Điện thoại & Máy tính bảng
                  </Link>
                </li>
                <li>
                  <Link href="/products?categoryId=laptop-gaming" className="hover:text-[#2563EB] transition">
                    Laptop Gaming & Đồ họa
                  </Link>
                </li>
                <li>
                  <Link href="/products?categoryId=dien-lanh" className="hover:text-[#2563EB] transition">
                    Điện lạnh & Điều hòa Inverter
                  </Link>
                </li>
                <li>
                  <Link href="/products?categoryId=gia-dung" className="hover:text-[#2563EB] transition">
                    Gia dụng nhà bếp thông minh
                  </Link>
                </li>
                <li>
                  <Link href="/products?categoryId=tivi-am-thanh" className="hover:text-[#2563EB] transition">
                    Tivi & Âm thanh rạp hát tại gia
                  </Link>
                </li>
                <li>
                  <Link href="/products?categoryId=smart-home" className="hover:text-[#2563EB] transition">
                    Robot hút bụi & Nhà thông minh
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="hover:text-[#2563EB] transition">
                    So sánh thông số sản phẩm
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Tra cứu & Dịch vụ khách hàng */}
            <div className="space-y-3">
              <h4 className="text-[#111827] font-bold tracking-wide text-xs uppercase">
                Tra Cứu & Dịch Vụ
              </h4>
              <ul className="space-y-2 text-[11px] text-[#4B5563]">
                <li>
                  <Link href="/tra-cuu-bao-hanh" className="hover:text-[#2563EB] transition">
                    Tra cứu bảo hành điện tử (Serial/IMEI)
                  </Link>
                </li>
                <li>
                  <Link href="/tra-cuu-don-hang" className="hover:text-[#2563EB] transition">
                    Tra cứu hành trình đơn hàng (GHN/GHTK)
                  </Link>
                </li>
                <li>
                  <Link href="/don-hang-cua-toi" className="hover:text-[#2563EB] transition">
                    Lịch sử đơn hàng cá nhân
                  </Link>
                </li>
                <li>
                  <Link href="/tai-khoan" className="hover:text-[#2563EB] transition">
                    Quản lý tài khoản & Sổ địa chỉ
                  </Link>
                </li>
                <li>
                  <Link href="/portal" className="hover:text-[#2563EB] transition flex items-center gap-1.5 font-medium text-[#6B7280]">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span>Cổng quản trị (Admin Portal)</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Hotline & Đối tác thanh toán */}
            <div className="space-y-3">
              <h4 className="text-[#111827] font-bold tracking-wide text-xs uppercase">
                Liên Hệ & Hỗ Trợ
              </h4>
              <div className="space-y-2 text-[11px] text-[#4B5563]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                  <span>Hotline: <strong className="text-[#111827] font-bold">1800 6868</strong> (8:00 - 21:30)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                  <span>Email: cskh@techstore.vn</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
                  Phương thức thanh toán chấp nhận
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] text-[#374151]">
                  <span className="px-2 py-1 bg-white border border-[#E5E7EB] rounded font-medium">VNPAY QR</span>
                  <span className="px-2 py-1 bg-white border border-[#E5E7EB] rounded font-medium">Ví MoMo</span>
                  <span className="px-2 py-1 bg-white border border-[#E5E7EB] rounded font-medium">Visa / MasterCard</span>
                  <span className="px-2 py-1 bg-white border border-[#E5E7EB] rounded font-medium">COD (Tiền mặt)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal Bar */}
      <div className="border-t border-[#E5E7EB] py-6 bg-white">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6B7280]">
          <p>© 2026 TechStore VN. Nền tảng bán lẻ thiết bị công nghệ & điện máy chính hãng.</p>
          <div className="flex items-center gap-4 text-[#4B5563]">
            <Link href="/products" className="hover:text-[#2563EB] transition">Sản phẩm</Link>
            <Link href="/compare" className="hover:text-[#2563EB] transition">So sánh</Link>
            <Link href="/tra-cuu-bao-hanh" className="hover:text-[#2563EB] transition">Bảo hành</Link>
            <Link href="/tra-cuu-don-hang" className="hover:text-[#2563EB] transition">Vận đơn</Link>
            <Link href="/portal" className="hover:text-[#2563EB] transition font-medium">Quản trị</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
