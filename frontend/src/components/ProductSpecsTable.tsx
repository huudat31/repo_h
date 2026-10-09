'use client';

import React from 'react';
import { Cpu, HardDrive, Monitor, Camera, BatteryCharging, Wifi, Layers } from 'lucide-react';

interface ProductSpecsTableProps {
  specs?: Record<string, any> | null;
}

const SPEC_LABELS: Record<string, { label: string; icon?: React.ReactNode }> = {
  cpu: { label: 'Bộ vi xử lý (CPU)', icon: <Cpu className="w-4 h-4 text-blue-500" /> },
  ram: { label: 'Bộ nhớ RAM', icon: <HardDrive className="w-4 h-4 text-purple-500" /> },
  bo_nho_trong: { label: 'Bộ nhớ trong', icon: <HardDrive className="w-4 h-4 text-indigo-500" /> },
  o_cung: { label: 'Ổ cứng lưu trữ', icon: <HardDrive className="w-4 h-4 text-indigo-500" /> },
  man_hinh: { label: 'Màn hình hiển thị', icon: <Monitor className="w-4 h-4 text-cyan-500" /> },
  camera_sau: { label: 'Camera sau', icon: <Camera className="w-4 h-4 text-rose-500" /> },
  camera_truoc: { label: 'Camera selfie', icon: <Camera className="w-4 h-4 text-rose-500" /> },
  pin_sac: { label: 'Dung lượng pin & Sạc', icon: <BatteryCharging className="w-4 h-4 text-emerald-500" /> },
  pin: { label: 'Thời lượng Pin', icon: <BatteryCharging className="w-4 h-4 text-emerald-500" /> },
  ket_noi: { label: 'Kết nối mạng & Chuẩn giao tiếp', icon: <Wifi className="w-4 h-4 text-amber-500" /> },
  cong_ket_noi: { label: 'Các cổng giao tiếp', icon: <Layers className="w-4 h-4 text-amber-500" /> },
  chat_lieu: { label: 'Chất liệu khung vỏ', icon: <Layers className="w-4 h-4 text-slate-500" /> },
  trong_luong: { label: 'Trọng lượng máy', icon: <Layers className="w-4 h-4 text-slate-500" /> },
};

export default function ProductSpecsTable({ specs }: ProductSpecsTableProps) {
  if (!specs || Object.keys(specs).length === 0) {
    return (
      <div className="text-gray-400 text-sm italic py-4">
        Chưa có thông số kỹ thuật chi tiết cho sản phẩm này.
      </div>
    );
  }

  const entries = Object.entries(specs);

  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm">
      <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>Bảng Thông Số Kỹ Thuật Chi Tiết (Dynamic Technical Specs)</span>
        </h3>
      </div>
      <table className="w-full text-sm text-left">
        <tbody>
          {entries.map(([key, value], idx) => {
            const specMeta = SPEC_LABELS[key] || {
              label: key.replace(/_/g, ' ').toUpperCase(),
              icon: <Layers className="w-4 h-4 text-gray-400" />,
            };

            return (
              <tr
                key={key}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-gray-100/50 transition'}
              >
                <td className="px-6 py-3.5 font-medium text-gray-600 w-1/3 flex items-center gap-2 border-b border-gray-100">
                  {specMeta.icon}
                  <span>{specMeta.label}</span>
                </td>
                <td className="px-6 py-3.5 text-gray-900 font-semibold border-b border-gray-100">
                  {String(value)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
