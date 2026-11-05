---
name: retail-ux-crafting
description: >-
  Use this skill whenever designing, updating, or reviewing UI/UX components in the e-commerce storefront.
  Guides the agent to eliminate generic "AI template" aesthetics (meaningless glow, disconnected cards, purple/cyan gradients)
  and craft authentic, high-conversion Vietnamese tech retail experiences (inspired by Apple Store, CellphoneS, TheGioiDiDong).
---

# Retail UX Crafting Skill (Anti-AI E-Commerce Design)

Hệ thống giao diện bán lẻ điện máy và thiết bị công nghệ cần mang lại cảm giác **chuyên nghiệp, đáng tin cậy, thông tin sắc nét và thuận tiện tối đa cho hành vi mua hàng thực tế**.

Mục tiêu cốt lõi của skill này là **triệt tiêu toàn bộ phong cách "AI template"** (giao diện card rời rạc, gradient neon tím/xanh nhạt vô nghĩa, font chữ thiếu phân cấp, hiệu ứng lạm dụng) và thay thế bằng **chuẩn mực thiết kế bán lẻ thực chiến**.

---

## 1. Dấu hiệu nhận diện "Giao diện bị AI quá" (Cần triệt tiêu)

| Điểm nhận diện AI Template | Vấn đề thực tế | Giải pháp chuẩn Retail |
| :--- | :--- | :--- |
| **Glow & Blur vô tội vạ** (`blur-3xl`, bóng mờ màu neon) | Làm mờ nhạt sản phẩm, tạo cảm giác landing page crypto/AI SaaS giả tạo. | Nền trung tính sắc nét (`bg-white`, `bg-slate-50`, `border-slate-200`), ánh sáng studio tự nhiên, tương phản cao. |
| **Thẻ (Cards) rời rạc, floating lơ lửng** | Thiếu tính liền mạch, phân tán sự chú ý của khách mua. | Bố cục dạng module liên kết (contained surfaces), phân tách bằng viền thanh mảnh (`divide-slate-100`, border 1px tinh tế). |
| **Typography phẳng, thiếu phân cấp** | Mọi chữ đều đậm như nhau hoặc nhạt nhòa như nhau. | Phân cấp 4 tầng: (1) Nhãn định vị (11px uppercase bold), (2) Tên máy thương mại (20-28px font-black), (3) Giá bán & Tiết kiệm (nổi bật nhất), (4) Chi tiết phụ trợ (12-13px slate-500). |
| **Không có Sticky Action Bar** | Khi cuộn xem thông số máy dài, khách hàng mất nút Mua ngay. | Tự động neo thanh mua hàng mini ở đáy màn hình (Mobile) hoặc đầu trang (Desktop) gồm ảnh nhỏ, giá và nút "Mua Ngay". |
| **Bảng thông số kỹ thuật khô cứng** | Khách hàng bị ngộp thở bởi hàng chục dòng specs khó hiểu. | Có khối "3-4 Điểm Đáng Tiền Nhất" (Highlights) trước khi mở bảng tra cứu thông số kỹ thuật chi tiết. |

---

## 2. Các thành phần giao diện bắt buộc chuẩn Retail

### A. Khối Giá Bán Thực Tế (Pricing & Value Display)
Khách hàng mua công nghệ quan tâm đến: **Giá trả thẳng**, **Giá niêm yết**, và **Chính xác số tiền được giảm** (không chỉ ghi % trừu tượng):
```tsx
<div className="flex flex-wrap items-baseline gap-3">
  {/* Giá ưu đãi hiện tại */}
  <span className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
    {formatPrice(product.price)}
  </span>
  {/* Giá niêm yết cũ */}
  {product.originalPrice && (
    <span className="text-sm text-slate-400 line-through">
      {formatPrice(product.originalPrice)}
    </span>
  )}
  {/* Số tiền tiết kiệm cụ thể */}
  {discountAmount > 0 && (
    <span className="inline-flex items-center text-xs font-bold text-red-700 bg-red-100/90 px-2 py-0.5 rounded-md">
      Tiết kiệm {formatPrice(discountAmount)}
    </span>
  )}
</div>
```

### B. Huy hiệu Bán lẻ Chuẩn Mực (Retail Badges)
Tránh các badge chung chung như "Hot" hay "New". Sử dụng các badge có giá trị pháp lý và dịch vụ:
- `Chính Hãng VN/A` (Dành cho Apple)
- `Bảo Hành 24 Tháng Tại Nhà` (Dành cho Panasonic, Daikin, LG)
- `Đổi Mới 30 Ngày 1-Đổi-1`
- `Thu Cũ Trợ Giá Đến 2 Triệu`
- `Trả Góp 0% Lãi Suất - Duyệt 5 Phút`

### C. Khối "Trong hộp có gì" (Unboxing Checklist)
Khách hàng mua điện thoại, laptop hay gia dụng rất cần biết hộp gồm phụ kiện gì:
```tsx
<div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
    Bộ sản phẩm tiêu chuẩn gồm:
  </h4>
  <ul className="text-xs text-slate-600 space-y-1">
    <li className="flex items-center gap-2">✓ Thân máy nguyên seal nguyên kiện</li>
    <li className="flex items-center gap-2">✓ Cáp sạc C to C bọc dù chính hãng</li>
    <li className="flex items-center gap-2">✓ Que chọc SIM & Sách hướng dẫn sử dụng tiếng Việt</li>
    <li className="flex items-center gap-2">✓ Phiếu bảo hành điện tử chính hãng kích hoạt theo IMEI</li>
  </ul>
</div>
```

---

## 3. Checklist Kiểm Tra Giao Diện (UX Review Checklist)
Trước khi bàn giao một giao diện, agent phải tự kiểm tra 5 câu hỏi:
1. [ ] Giao diện có bị cảm giác "AI template" không (nhiều màu tím/xanh nhạt, glow blur mờ mịt)?
2. [ ] Các nút bấm (Call to Action) có trạng thái hover, active, disabled rõ ràng không?
3. [ ] Giá tiền, ưu đãi và số tiền tiết kiệm có hiển thị định dạng tiền tệ VND chuẩn xác không?
4. [ ] Khách hàng trên điện thoại (Mobile) có bấm dễ dàng bằng 1 tay (tap target >= 44x44px) không?
5. [ ] Mọi hình ảnh và video có phải là nội dung bán lẻ nghiêm túc (loại bỏ hoàn toàn link đùa cợt hoặc placeholder rác)?
