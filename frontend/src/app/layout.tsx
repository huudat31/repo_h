import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComparisonBar from '@/components/comparison/ComparisonBar';

export const metadata: Metadata = {
  title: 'TechStore - Thiết Bị Công Nghệ & Điện Gia Dụng Chính Hãng',
  description:
    'Hệ thống thương mại điện tử công nghệ & điện máy gia dụng cao cấp: Panasonic, Philips, Sunhouse với so sánh sản phẩm, tra cứu bảo hành điện tử, cổng VNPAY/MoMo.',
  keywords: ['panasonic', 'philips', 'sunhouse', 'inverter', 'so sanh san pham', 'bao hanh dien tu', 'vnpay', 'momo'],
  openGraph: {
    title: 'TechStore - Thiết Bị Công Nghệ & Điện Máy Chính Hãng',
    description: 'Mua sắm thiết bị chính hãng, so sánh thông số trực quan, thanh toán VNPAY/MoMo.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col justify-between bg-gray-50 text-slate-800 antialiased pb-12">
        <Navbar />
        <main className="flex-1">{children}</main>
        <ComparisonBar />
        <Footer />
      </body>
    </html>
  );
}
