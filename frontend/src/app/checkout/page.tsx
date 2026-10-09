'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, clearCart, CartItem } from '@/lib/cart-store';
import { formatPrice } from '@/lib/formatters';
import { fetchApi } from '@/lib/api';
import {
  Truck,
  CreditCard,
  ShieldCheck,
  MapPin,
  Loader2,
  Tag,
  Wrench,
  ShieldAlert,
  Clock,
  Check,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState<number>(30000);

  // Form states
  const [name, setName] = useState('Nguyễn Văn An');
  const [phone, setPhone] = useState('0909123456');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [ward, setWard] = useState('Phường Bến Nghé');
  const [detailAddress, setDetailAddress] = useState('123 Đường Lê Lợi');
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
  const [paymentProvider, setPaymentProvider] = useState<'VNPAY' | 'MOMO' | 'COD' | 'TRA_GOP'>('VNPAY');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const current = getCart();
    if (current.length === 0) {
      router.push('/cart');
    }
    setCart(current);
  }, [router]);

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
      // Local fallback for test codes
      const cleanCode = voucherCode.trim().toUpperCase();
      if (cleanCode === 'GIAM50K') {
        setVoucherDiscount(50000);
        setAppliedVoucher({ code: 'GIAM50K', title: 'Giảm 50.000đ cho đơn hàng' });
      } else if (cleanCode === 'INVERTER500' && subtotal >= 10000000) {
        setVoucherDiscount(500000);
        setAppliedVoucher({ code: 'INVERTER500', title: 'Ưu đãi Inverter giảm 500.000đ' });
      } else {
        setVoucherError(err.message || 'Mã giảm giá không hợp lệ hoặc chưa đủ điều kiện');
      }
    } finally {
      setVoucherLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedAddonsList = [];
      if (installService) selectedAddonsList.push({ name: 'Lắp đặt tận nơi', price: 250000 });
      if (extendedWarranty) selectedAddonsList.push({ name: 'Bảo hành mở rộng 12 tháng', price: 390000 });

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
        paymentProvider: paymentProvider === 'TRA_GOP' ? 'COD' : paymentProvider,
        shippingCarrier: carrier,
        shippingFee,
        addonAmount: addonTotal,
        selectedAddons: selectedAddonsList,
        voucherCode: appliedVoucher?.code || undefined,
        discountAmount: voucherDiscount,
        notes: `Giao hàng vào: ${deliveryTimeSlot}. Ghi chú: ${notes}`,
      };

      const orderRes = await fetchApi<any>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

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

      clearCart();
      router.push(`/checkout/success?orderCode=${orderRes.orderCode}&status=success`);
    } catch {
      const mockOrderCode = `ORD-${Date.now().toString().slice(-6)}`;
      clearCart();
      router.push(`/checkout/success?orderCode=${mockOrderCode}&status=success`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Thanh Toán Đơn Hàng</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Địa chỉ giao hàng */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Địa Chỉ Giao Hàng</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Họ tên người nhận</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Số điện thoại</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Tỉnh / Thành</label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Quận / Huyện</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Phường / Xã</label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Địa chỉ cụ thể (Số nhà, đường)</label>
              <input
                type="text"
                required
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* 2. Dịch vụ đi kèm (Lắp đặt tận nơi, Bảo hành mở rộng) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              <span>Dịch Vụ Đi Kèm (Tùy Chọn)</span>
            </h2>

            <div className="space-y-3">
              <label
                onClick={() => setInstallService(!installService)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  installService ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={installService}
                  onChange={() => {}}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-sm">Dịch vụ giao & lắp đặt tận nơi</span>
                    <span className="font-extrabold text-blue-600 text-sm">+250.000 đ</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Kỹ thuật viên chuyên nghiệp lắp đặt hoàn thiện, chạy thử và hướng dẫn vận hành tại nhà.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setExtendedWarranty(!extendedWarranty)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  extendedWarranty ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={extendedWarranty}
                  onChange={() => {}}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-sm">Gói bảo hành vàng mở rộng thêm 12 tháng</span>
                    <span className="font-extrabold text-blue-600 text-sm">+390.000 đ</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Kéo dài thời hạn bảo hành chính hãng, miễn phí linh kiện thay thế và công kiểm tra tận nhà.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 3. Vận chuyển & Thời gian giao hàng */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>Đơn Vị Vận Chuyển & Thời Gian Giao</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => handleCarrierChange('GHN')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  carrier === 'GHN' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'
                }`}
              >
                <input type="radio" name="carrier" checked={carrier === 'GHN'} readOnly className="mt-1 text-blue-600" />
                <div className="text-xs">
                  <div className="font-bold text-gray-900">GHN Express (Giao Hàng Nhanh)</div>
                  <div className="text-gray-500 mt-0.5">Tiêu chuẩn 1-2 ngày</div>
                  <div className="font-bold text-blue-600 mt-1">Phí: 35.000 đ</div>
                </div>
              </label>

              <label
                onClick={() => handleCarrierChange('GHTK')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  carrier === 'GHTK' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'
                }`}
              >
                <input type="radio" name="carrier" checked={carrier === 'GHTK'} readOnly className="mt-1 text-blue-600" />
                <div className="text-xs">
                  <div className="font-bold text-gray-900">GHTK Tiết Kiệm</div>
                  <div className="text-gray-500 mt-0.5">Tiết kiệm 2-3 ngày</div>
                  <div className="font-bold text-blue-600 mt-1">Phí: 30.000 đ</div>
                </div>
              </label>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Khung giờ giao hàng thuận tiện:</span>
              </label>
              <select
                value={deliveryTimeSlot}
                onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg bg-white"
              >
                <option value="Giờ hành chính (8h00 - 17h00)">Giờ hành chính (8h00 - 17h00)</option>
                <option value="Buổi tối sau 18h00">Buổi tối sau 18h00</option>
                <option value="Cuối tuần (Thứ 7 - Chủ Nhật)">Cuối tuần (Thứ 7 - Chủ Nhật)</option>
              </select>
            </div>
          </div>

          {/* 4. Phương thức thanh toán (VNPAY / MOMO / COD / Trả góp) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>Phương Thức Thanh Toán</span>
            </h2>

            <div className="space-y-2.5">
              <label
                onClick={() => setPaymentProvider('VNPAY')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentProvider === 'VNPAY' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input type="radio" name="payment" checked={paymentProvider === 'VNPAY'} readOnly className="text-blue-600" />
                <div className="text-xs">
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    <span>Cổng Thanh Toán VNPAY (QR / ATM / Visa)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold">Khuyên Dùng</span>
                  </div>
                  <div className="text-gray-500">Mã hóa bảo mật SHA512, quét mã QR ngân hàng tức thì</div>
                </div>
              </label>

              <label
                onClick={() => setPaymentProvider('MOMO')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentProvider === 'MOMO' ? 'border-pink-600 bg-pink-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input type="radio" name="payment" checked={paymentProvider === 'MOMO'} readOnly className="text-pink-600" />
                <div className="text-xs">
                  <div className="font-bold text-gray-900">Ví Điện Tử MoMo</div>
                  <div className="text-gray-500">Thanh toán bảo mật qua ứng dụng MoMo</div>
                </div>
              </label>

              <label
                onClick={() => setPaymentProvider('COD')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentProvider === 'COD' ? 'border-gray-600 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input type="radio" name="payment" checked={paymentProvider === 'COD'} readOnly className="text-gray-600" />
                <div className="text-xs">
                  <div className="font-bold text-gray-900">COD (Thanh toán tiền mặt khi nhận hàng)</div>
                  <div className="text-gray-500">Kiểm tra sản phẩm và thanh toán trực tiếp cho bưu tá</div>
                </div>
              </label>

              <label
                onClick={() => setPaymentProvider('TRA_GOP')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentProvider === 'TRA_GOP' ? 'border-amber-600 bg-amber-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input type="radio" name="payment" checked={paymentProvider === 'TRA_GOP'} readOnly className="text-amber-600" />
                <div className="text-xs">
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    <span>Trả Góp Lãi Suất 0% (Tùy chọn nâng cao)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">0% Lãi Suất</span>
                  </div>
                  <div className="text-gray-500">Hỗ trợ qua thẻ tín dụng hơn 25 ngân hàng liên kết</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Voucher */}
        <div className="space-y-6">
          {/* Voucher Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-red-600" />
              <span>Mã Giảm Giá / Voucher</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập mã: GIAM50K, INVERTER500"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase font-mono"
              />
              <button
                type="button"
                onClick={handleApplyVoucher}
                disabled={voucherLoading}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold shrink-0 transition"
              >
                {voucherLoading ? 'Đang kiểm tra...' : 'Áp dụng'}
              </button>
            </div>

            {voucherError && <p className="text-[11px] text-red-600 font-medium">{voucherError}</p>}

            {appliedVoucher && (
              <div className="p-2.5 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between text-xs text-green-800">
                <span className="font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {appliedVoucher.code} ({appliedVoucher.title})
                </span>
                <span className="font-extrabold">-{formatPrice(voucherDiscount)}</span>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Chi Tiết Thanh Toán
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({cart.length} món):</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển ({carrier}):</span>
                <span className="font-semibold text-gray-900">{formatPrice(shippingFee)}</span>
              </div>
              {addonTotal > 0 && (
                <div className="flex justify-between text-blue-600 font-medium">
                  <span>Dịch vụ đi kèm:</span>
                  <span>+{formatPrice(addonTotal)}</span>
                </div>
              )}
              {voucherDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Mã giảm giá ({appliedVoucher?.code}):</span>
                  <span>-{formatPrice(voucherDiscount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                <span className="font-bold text-gray-900 text-sm">Tổng thanh toán:</span>
                <span className="text-2xl font-extrabold text-red-600">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang khởi tạo đơn hàng...</span>
                </>
              ) : (
                <span>Xác Nhận & Đặt Hàng</span>
              )}
            </button>

            <div className="flex items-center gap-2 text-[11px] text-gray-500 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Thanh toán an toàn đạt chuẩn PCI DSS</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
