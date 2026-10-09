import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'TechStore - Thiết Bị Công Nghệ & Smartphone Chính Hãng',
  description:
    'Hệ thống thương mại điện tử công nghệ cao cấp: iPhone, MacBook, Laptop gaming với cổng thanh toán VNPAY, MoMo và giao hàng toàn quốc GHN, GHTK.',
  keywords: ['smartphone', 'laptop', 'vnpay', 'momo', 'ghn', 'ghtk', 'cong nghe'],
  openGraph: {
    title: 'TechStore - Thiết Bị Công Nghệ Chính Hãng',
    description: 'Mua sắm thiết bị công nghệ chính hãng, thanh toán VNPAY/MoMo tiện lợi.',
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
      <body className="min-h-screen flex flex-col justify-between bg-gray-50 text-slate-800 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
