'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCart, clearCart, CartItem } from '@/lib/cart-store';
import { formatPrice } from '@/lib/formatters';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  Truck,
  CreditCard,
  ShieldCheck,
  MapPin,
  Loader2,
  Tag,
  Wrench,
  Clock,
  Check,
  AlertCircle,
  LogIn,
  UserPlus,
  ArrowRight,
  Shield,
} from 'lucide-react';

interface Address {
  id: string;
  recipientName: string;
  phone: string;
  provinceName: string;
  provinceId: number;
  districtName: string;
  districtId: number;
  wardName: string;
  wardCode: string;
  detailAddress: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [shippingFee, setShippingFee] = useState<number>(35000);

  // Address book states
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('manual');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [ward, setWard] = useState('Phường Bến Nghé');
  const [detailAddress, setDetailAddress] = useState('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('Giờ hành chính (8h00 - 17h00)');

  // Dịch vụ đi kèm (Add-on services)
  const [installService, setInstallService] = useState(false); // +250.000đ
  const [extendedWarranty, setExtendedWarranty] = useState(false); // +390.000đ

  // Voucher states
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; title: string } | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);

  // Carriers & Payment
  const [carrier, setCarrier] = useState<'GHN' | 'GHTK'>('GHN');
  const [paymentProvider, setPaymentProvider] = useState<'VNPAY' | 'MOMO' | 'COD'>('VNPAY');
  const [notes, setNotes] = useState('');

  // 1. Kiểm tra giỏ hàng
  useEffect(() => {
    const current = getCart();
    if (current.length === 0) {
      router.push('/cart');
    }
    setCart(current);
  }, [router]);

  // 2. Tải sổ địa chỉ của User đã đăng nhập
  useEffect(() => {
    if (user) {
      setName(user.fullName || '');
      setPhone(user.phone || '');

      fetchApi<Address[]>('/addresses')
        .then((addresses) => {
          setSavedAddresses(addresses);
          const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setName(defaultAddr.recipientName);
            setPhone(defaultAddr.phone);
            setProvince(defaultAddr.provinceName);
            setDistrict(defaultAddr.districtName);
            setWard(defaultAddr.wardName);
            setDetailAddress(defaultAddr.detailAddress);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId === 'manual') {
      setName(user?.fullName || '');
      setPhone(user?.phone || '');
      setDetailAddress('');
      return;
    }

    const addr = savedAddresses.find((a) => a.id === addrId);
    if (addr) {
      setName(addr.recipientName);
      setPhone(addr.phone);
      setProvince(addr.provinceName);
      setDistrict(addr.districtName);
      setWard(addr.wardName);
      setDetailAddress(addr.detailAddress);
    }
  };

  const handleCarrierChange = async (selected: 'GHN' | 'GHTK') => {
    setCarrier(selected);
    try {
      const res = await fetchApi<{ fee: number }>('/shipping/calculate-fee', {
        method: 'POST',
        body: JSON.stringify({
          carrier: selected,
          provinceName: province,
          districtName: district,
        }),
      });
      if (res?.fee) setShippingFee(res.fee);
    } catch {
      setShippingFee(selected === 'GHN' ? 35000 : 30000);
    }
  };

  const addonTotal = (installService ? 250000 : 0) + (extendedWarranty ? 390000 : 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal + shippingFee + addonTotal - voucherDiscount);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    setVoucherError('');

    try {
      const res = await fetchApi<any>('/vouchers/apply', {
        method: 'POST',
        body: JSON.stringify({
          code: voucherCode.trim(),
          orderAmount: subtotal,
        }),
      });

      if (res && res.valid) {
        setVoucherDiscount(res.discountAmount);
        setAppliedVoucher({ code: res.code, title: res.title });
        setVoucherError('');
      }
    } catch (err: any) {
      setVoucherError(err.message || 'Mã giảm giá không hợp lệ hoặc chưa đủ điều kiện');
      setVoucherDiscount(0);
      setAppliedVoucher(null);
    } finally {
      setVoucherLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');
    setLoading(true);

    try {
      const selectedAddonsList = [];
      if (installService) selectedAddonsList.push({ name: 'Dịch vụ giao & lắp đặt tận nơi', price: 250000 });
      if (extendedWarranty) selectedAddonsList.push({ name: 'Gói bảo hành vàng mở rộng 12 tháng', price: 390000 });

      const orderPayload = {
        recipientName: name,
        recipientPhone: phone,
        shippingAddress: {
          provinceName: province,
          provinceId: 202,
          districtName: district,
          districtId: 1442,
          wardName: ward,
          wardCode: '20101',
          detailAddress,
        },
        items: cart.map((i) => ({ productId: i.id, quantity: i.quantity })),
        paymentProvider,
        shippingCarrier: carrier,
        shippingFee,
        addonAmount: addonTotal,
        selectedAddons: selectedAddonsList,
        voucherCode: appliedVoucher?.code || undefined,
        notes: `Giao hàng: ${deliveryTimeSlot}. Ghi chú: ${notes}`,
      };

      // 1. Gọi API tạo đơn hàng (đã yêu cầu Bearer token xác thực)
      const orderRes = await fetchApi<any>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      // 2. Nếu chọn VNPAY hoặc MoMo, khởi tạo URL thanh toán
      if (paymentProvider === 'VNPAY' || paymentProvider === 'MOMO') {
        const payRes = await fetchApi<any>('/payments/create-url', {
          method: 'POST',
          body: JSON.stringify({
            orderId: orderRes.id,
            provider: paymentProvider,
          }),
        });

        clearCart();
        if (payRes?.paymentUrl) {
          window.location.href = payRes.paymentUrl;
          return;
        }
      }

      // 3. COD hoặc thanh toán hoàn tất
      clearCart();
      router.push(`/checkout/success?orderCode=${orderRes.orderCode}&status=success`);
    } catch (err: any) {
      setOrderError(err.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  // NẾU CHƯA ĐĂNG NHẬP: Bắt buộc đăng nhập mới được mua hàng
  if (!authLoading && !user) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 md:p-10 shadow-sm space-y-5">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
            <LogIn className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Yêu Cầu Đăng Nhập</h1>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Để bảo vệ quyền lợi bảo hành điện tử chính hãng và theo dõi lộ trình vận đơn thời gian thực,
              quý khách vui lòng đăng nhập tài khoản trước khi tiến hành thanh toán.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/login?redirect=/checkout"
              className="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập Tài Khoản</span>
            </Link>

            <Link
              href="/register?redirect=/checkout"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Đăng Ký Tài Khoản Mới</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Thanh Toán Đơn Hàng</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Hoàn tất thông tin nhận hàng, chọn phương thức thanh toán và kích hoạt bảo hành chính hãng
        </p>
      </div>

      {orderError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-bold text-sm block">Không thể tạo đơn hàng</strong>
            <p>{orderError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. Sổ địa chỉ & Thông tin người nhận */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>1. Địa Chỉ Nhận Hàng</span>
              </h2>
              <Link href="/tai-khoan" className="text-xs text-blue-600 hover:underline font-semibold">
                Quản lý sổ địa chỉ
              </Link>
            </div>

            {savedAddresses.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Chọn địa chỉ từ sổ địa chỉ của bạn:
                </label>
                <select
                  value={selectedAddressId}
                  onChange={(e) => handleSelectSavedAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
                >
                  {savedAddresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.recipientName} - {addr.phone} ({addr.detailAddress}, {addr.districtName})
                      {addr.isDefault ? ' [Mặc định]' : ''}
                    </option>
                  ))}
                  <option value="manual">+ Nhập địa chỉ nhận hàng khác</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Họ tên người nhận</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Số điện thoại</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Tỉnh / Thành phố</label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Quận / Huyện</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Phường / Xã</label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Địa chỉ cụ thể (Số nhà, tên đường)</label>
              <input
                type="text"
                required
                placeholder="VD: 123 Đường Lê Lợi"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* 2. Dịch vụ đi kèm */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>2. Dịch Vụ Hỗ Trợ & Bảo Hành Vàng (Tùy Chọn)</span>
            </h2>

            <div className="space-y-2.5">
              <label
                onClick={() => setInstallService(!installService)}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  installService ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={installService}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Dịch vụ giao hàng & Lắp đặt hoàn thiện tận nơi</span>
                    <span className="font-bold text-blue-600">+250.000 đ</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kỹ thuật viên chuyên nghiệp lắp đặt, chạy thử tải và hướng dẫn vận hành chi tiết tại nhà.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setExtendedWarranty(!extendedWarranty)}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  extendedWarranty ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={extendedWarranty}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Gói bảo hành vàng mở rộng thêm 12 tháng</span>
                    <span className="font-bold text-blue-600">+390.000 đ</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kéo dài thời hạn bảo hành chính hãng, miễn phí linh kiện thay thế và công kiểm tra tận nhà.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 3. Vận chuyển & Thời gian giao hàng */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>3. Kênh Vận Chuyển & Thời Gian Giao</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => handleCarrierChange('GHN')}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  carrier === 'GHN' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input type="radio" name="carrier" checked={carrier === 'GHN'} readOnly className="mt-0.5 text-blue-600" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">GHN Express (Giao Hàng Nhanh)</div>
                  <div className="text-slate-500 mt-0.5">Toàn quốc 1 - 2 ngày</div>
                  <div className="font-bold text-blue-600 mt-1">Phí: 35.000 đ</div>
                </div>
              </label>

              <label
                onClick={() => handleCarrierChange('GHTK')}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  carrier === 'GHTK' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input type="radio" name="carrier" checked={carrier === 'GHTK'} readOnly className="mt-0.5 text-blue-600" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">GHTK Tiết Kiệm</div>
                  <div className="text-slate-500 mt-0.5">Tiêu chuẩn 2 - 3 ngày</div>
                  <div className="font-bold text-blue-600 mt-1">Phí: 30.000 đ</div>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Khung giờ giao hàng:
                </label>
                <select
                  value={deliveryTimeSlot}
                  onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                >
                  <option value="Giờ hành chính (8h00 - 17h00)">Giờ hành chính (8h00 - 17h00)</option>
                  <option value="Buổi tối sau 18h00">Buổi tối sau 18h00</option>
                  <option value="Cuối tuần (Thứ 7 - Chủ Nhật)">Cuối tuần (Thứ 7 - Chủ Nhật)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Ghi chú cho shipper:
                </label>
                <input
                  type="text"
                  placeholder="VD: Gọi trước khi giao 15 phút..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 4. Phương thức thanh toán */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>4. Phương Thức Thanh Toán</span>
            </h2>

            <div className="space-y-2">
              <label
                onClick={() => setPaymentProvider('VNPAY')}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  paymentProvider === 'VNPAY' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input type="radio" name="payment" checked={paymentProvider === 'VNPAY'} readOnly className="text-blue-600" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Cổng Thanh Toán VNPAY (Quét mã QR / Thẻ ATM / Visa / Master)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold">Khuyên Dùng</span>
                  </div>
                  <div className="text-slate-500">Mã hóa SHA512 an toàn, quét mã trực tiếp qua app ngân hàng</div>
                </div>
              </label>

              <label
                onClick={() => setPaymentProvider('MOMO')}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  paymentProvider === 'MOMO' ? 'border-pink-600 bg-pink-50/40' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input type="radio" name="payment" checked={paymentProvider === 'MOMO'} readOnly className="text-pink-600" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">Ví Điện Tử MoMo</div>
                  <div className="text-slate-500">Mở ứng dụng MoMo và xác nhận giao dịch thanh toán tức thì</div>
                </div>
              </label>

              <label
                onClick={() => setPaymentProvider('COD')}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  paymentProvider === 'COD' ? 'border-slate-600 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input type="radio" name="payment" checked={paymentProvider === 'COD'} readOnly className="text-slate-600" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">COD (Thanh toán tiền mặt khi nhận hàng)</div>
                  <div className="text-slate-500">Đồng kiểm hàng hóa chính hãng và thanh toán trực tiếp cho shipper</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Voucher (1 col) */}
        <div className="space-y-5">
          {/* Voucher Box */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>Mã Giảm Giá / Voucher</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập: GIAM50K, INVERTER500"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-blue-600 uppercase font-mono"
              />
              <button
                type="button"
                onClick={handleApplyVoucher}
                disabled={voucherLoading}
                className="px-3 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-bold shrink-0 transition"
              >
                {voucherLoading ? 'Kiểm tra...' : 'Áp dụng'}
              </button>
            </div>

            {voucherError && <p className="text-[11px] text-red-600 font-medium">{voucherError}</p>}

            {appliedVoucher && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                <span className="font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {appliedVoucher.code} ({appliedVoucher.title})
                </span>
                <span className="font-black">-{formatPrice(voucherDiscount)}</span>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Chi Tiết Thanh Toán
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính ({cart.length} món):</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển ({carrier}):</span>
                <span className="font-semibold text-slate-900">{formatPrice(shippingFee)}</span>
              </div>
              {addonTotal > 0 && (
                <div className="flex justify-between text-blue-600 font-medium">
                  <span>Dịch vụ đi kèm:</span>
                  <span>+{formatPrice(addonTotal)}</span>
                </div>
              )}
              {voucherDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Mã giảm giá ({appliedVoucher?.code}):</span>
                  <span>-{formatPrice(voucherDiscount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">Tổng thanh toán:</span>
                <span className="text-xl font-black text-red-600">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang khởi tạo đơn hàng...</span>
                </>
              ) : (
                <span>Xác Nhận & Đặt Hàng</span>
              )}
            </button>

            <div className="flex items-center gap-2 text-[10px] text-slate-500 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bảo mật giao dịch theo chuẩn PCI DSS</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
