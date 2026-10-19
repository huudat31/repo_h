'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { fetchApi } from '@/lib/api';
import {
  User as UserIcon,
  MapPin,
  Lock,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  ShieldCheck,
  Package,
  Store,
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

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  // Address Modal/Form States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [provinceName, setProvinceName] = useState('TP. Hồ Chí Minh');
  const [districtName, setDistrictName] = useState('Quận 1');
  const [wardName, setWardName] = useState('Phường Bến Nghé');
  const [detailAddress, setDetailAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/tai-khoan');
    }
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      loadAddresses();
    }
  }, [user, authLoading, router]);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await fetchApi<Address[]>('/addresses');
      setAddresses(data);
    } catch {
      // Ignored
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    try {
      const updated = await fetchApi<any>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ fullName, phone }),
      });
      updateUser(updated);
      setProfileMsg({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Cập nhật thất bại' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Mật khẩu mới phải từ 6 ký tự trở lên' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'Xác nhận mật khẩu mới không khớp' });
      return;
    }

    setSavingPassword(true);
    try {
      await fetchApi('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      setPasswordMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Mật khẩu cũ không chính xác' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');
    setSavingAddress(true);

    const payload = {
      recipientName,
      phone: addressPhone,
      provinceName,
      provinceId: 202,
      districtName,
      districtId: 1442,
      wardName,
      wardCode: '20101',
      detailAddress,
      isDefault,
    };

    try {
      if (editingAddressId) {
        await fetchApi(`/addresses/${editingAddressId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/addresses', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setShowAddressForm(false);
      resetAddressForm();
      loadAddresses();
    } catch (err: any) {
      setAddressError(err.message || 'Lỗi lưu địa chỉ');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      await fetchApi(`/addresses/${id}`, { method: 'DELETE' });
      loadAddresses();
    } catch (err: any) {
      alert(err.message || 'Không thể xóa địa chỉ');
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await fetchApi(`/addresses/${id}/default`, { method: 'PATCH' });
      loadAddresses();
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật');
    }
  };

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setRecipientName('');
    setAddressPhone('');
    setProvinceName('TP. Hồ Chí Minh');
    setDistrictName('Quận 1');
    setWardName('Phường Bến Nghé');
    setDetailAddress('');
    setIsDefault(false);
    setAddressError('');
  };

  const handleStartEdit = (addr: Address) => {
    setEditingAddressId(addr.id);
    setRecipientName(addr.recipientName);
    setAddressPhone(addr.phone);
    setProvinceName(addr.provinceName);
    setDistrictName(addr.districtName);
    setWardName(addr.wardName);
    setDetailAddress(addr.detailAddress);
    setIsDefault(addr.isDefault);
    setShowAddressForm(true);
  };

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span>Đang xác thực thông tin...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản Lý Tài Khoản</h1>
        <p className="text-xs text-gray-500 mt-1">
          Cập nhật thông tin cá nhân, mật khẩu bảo mật và sổ địa chỉ giao hàng
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Hồ sơ cá nhân</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
              activeTab === 'addresses'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Sổ địa chỉ</span>
            {addresses.length > 0 && (
              <span className={`ml-auto text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'addresses' ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-700'
              }`}>
                {addresses.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Đổi mật khẩu</span>
          </button>

          <div className="border-t border-gray-100 my-2 pt-2 space-y-1">
            <Link
              href="/don-hang-cua-toi"
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition text-left"
            >
              <Package className="w-4 h-4 text-gray-400" />
              <span>Đơn hàng của tôi</span>
            </Link>

            <Link
              href="/tra-cuu-bao-hanh"
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition text-left"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Tra cứu bảo hành</span>
            </Link>

            {user.role === 'ADMIN' && (
              <Link
                href="/portal"
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition text-left"
              >
                <Store className="w-4 h-4 text-purple-600" />
                <span>Khu Vực Quản Trị</span>
              </Link>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="md:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Thông Tin Cá Nhân</h2>
                <p className="text-xs text-gray-500">Thông tin sử dụng khi liên hệ và giao nhận hàng</p>
              </div>

              {profileMsg && (
                <div
                  className={`p-3 rounded-xl flex items-center gap-2 text-xs ${
                    profileMsg.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {profileMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Email (Tên đăng nhập)</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0909123456"
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Vai trò tài khoản</label>
                  <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-[11px] rounded-lg">
                    {user.role === 'ADMIN' ? 'Quản Trị Viên (System Admin)' : 'Khách Hàng Thành Viên'}
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    {savingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Address Book */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Sổ Địa Chỉ Giao Hàng</h2>
                  <p className="text-xs text-gray-500">Địa chỉ dùng để tính phí vận chuyển và giao nhận hàng</p>
                </div>
                {!showAddressForm && (
                  <button
                    onClick={() => {
                      resetAddressForm();
                      setShowAddressForm(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Địa Chỉ Mới</span>
                  </button>
                )}
              </div>

              {/* Form Add / Edit Address */}
              {showAddressForm && (
                <form
                  onSubmit={handleSaveAddress}
                  className="p-5 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-4"
                >
                  <h3 className="font-bold text-gray-900 text-xs">
                    {editingAddressId ? 'Chỉnh Sửa Địa Chỉ' : 'Thêm Địa Chỉ Giao Hàng Mới'}
                  </h3>

                  {addressError && (
                    <p className="text-xs text-red-600 font-semibold">{addressError}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">Tên người nhận</label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        required
                        value={addressPhone}
                        onChange={(e) => setAddressPhone(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">Tỉnh / Thành</label>
                      <input
                        type="text"
                        required
                        value={provinceName}
                        onChange={(e) => setProvinceName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">Quận / Huyện</label>
                      <input
                        type="text"
                        required
                        value={districtName}
                        onChange={(e) => setDistrictName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">Phường / Xã</label>
                      <input
                        type="text"
                        required
                        value={wardName}
                        onChange={(e) => setWardName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">Địa chỉ cụ thể (Số nhà, đường)</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: 123 Đường Lê Lợi"
                      value={detailAddress}
                      onChange={(e) => setDetailAddress(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-gray-700">Đặt làm địa chỉ nhận hàng mặc định</span>
                  </label>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition"
                    >
                      {savingAddress ? 'Đang lưu...' : 'Lưu Địa Chỉ'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-lg transition"
                    >
                      Hủy Bỏ
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              {loadingAddresses ? (
                <div className="text-center py-8 text-xs text-gray-400">Đang tải danh sách địa chỉ...</div>
              ) : addresses.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl space-y-2">
                  <MapPin className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-xs text-gray-500 font-medium">Bạn chưa lưu địa chỉ giao hàng nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-xl border transition ${
                        addr.isDefault
                          ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/20'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-sm">{addr.recipientName}</span>
                            <span className="text-xs text-gray-500">({addr.phone})</span>
                            {addr.isDefault && (
                              <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                Mặc Định
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {addr.detailAddress}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="px-2.5 py-1 text-[11px] text-blue-600 hover:bg-blue-50 rounded font-semibold transition"
                            >
                              Đặt mặc định
                            </button>
                          )}
                          <button
                            onClick={() => handleStartEdit(addr)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded transition"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Security / Change Password */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Bảo Mật & Mật Khẩu</h2>
                <p className="text-xs text-gray-500">Đổi mật khẩu định kỳ để bảo vệ tài khoản của bạn</p>
              </div>

              {passwordMsg && (
                <div
                  className={`p-3 rounded-xl flex items-center gap-2 text-xs ${
                    passwordMsg.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {passwordMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Mật khẩu mới (tối thiểu 6 ký tự)</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    {savingPassword ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
