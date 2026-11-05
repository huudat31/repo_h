---
name: modern-retail-design
description: >-
  Use this skill whenever designing, building, or refactoring UI/UX components for the e-commerce storefront.
  Guides the agent to implement modern, high-converting Vietnamese tech & appliance retail interfaces inspired by
  Apple Store, CellphoneS, TheGioiDiDong, and Shopee Mall. Focuses on premium clean aesthetics, strong visual hierarchy,
  vibrant promo badges, flash sale shelves, and bulletproof offline/demo fallbacks.
---

# Modern Retail Design System (TechStore VN)

Tài liệu này định hình hệ thống giao diện bán lẻ công nghệ & điện máy cao cấp, thân thiện và đạt tỷ lệ chuyển đổi cao nhất cho thị trường Việt Nam.

---

## 1. Nguyên Tắc Thiết Kế Cốt Lõi (Core Visual Pillars)

1. **Thẩm Mỹ Bán Lẻ Hiện Đại (Clean Commercial Aesthetic)**:
   - Nền sáng sạch sẽ (`bg-[#f8fafc]` hoặc `bg-slate-50`), mặt card trắng tinh khiết (`bg-white`) viền siêu nét (`border-slate-200/80`).
   - Tông màu chủ đạo:
     - **Đỏ Bán Lẻ (Promo Red)**: `#dc2626` / `#e11d48` dùng cho Giá tiền, Badge giảm sốc, Flash Sale.
     - **Xanh Công Nghệ (Trust Blue)**: `#2563eb` dùng cho Nhãn chính hãng, Link, CTA phụ.
     - **Xanh Lục Bảo Hành (Emerald)**: `#059669` dùng cho tem "Chính Hãng VN/A", "Bảo hành 24T".
     - **Chữ & Tương phản**: `#0f172a` (Slate 900) cho tiêu đề đậm, `#334155` cho văn bản thường, `#64748b` cho thông số phụ.

2. **Phân Cấp Thông Tin 4 Tầng Sắc Bén (Visual Hierarchy)**:
   - Tầng 1: Badge định vị & Ưu đãi (`[Chính Hãng VN/A]`, `[Trả Góp 0%]`, `[-15%]`).
   - Tầng 2: Ảnh sản phẩm rõ nét trên nền canvas studio chuẩn tỉ lệ vuông 1:1, không bị co méo.
   - Tầng 3: Tên thương mại chuẩn tiếng Việt kèm thương hiệu nổi bật.
   - Tầng 4: Giá bán (to nhất, màu đỏ) + Giá gạch + Số tiền tiết kiệm cụ thể + 2 badge cấu hình ăn tiền nhất.

3. **Cơ Chế Kháng Lỗi Dữ Liệu (Resilient Retail Showcase)**:
   - Tuyệt đối KHÔNG hiển thị màn hình trắng hay thông báo cụt lủn "Hiện chưa có sản phẩm" khi API chưa kết nối hoặc khi deploy online trên Vercel.
   - Luôn tích hợp bộ sản phẩm đại diện tuyển chọn (Curated Flagship Collection) làm fallback để website luôn lung linh, đầy đủ danh mục và trải nghiệm mượt mà 100%.

---

## 2. Các Thành Phần Trọng Yếu Của Trang Chủ (Storefront Architecture)

1. **Header & Navigation Tinh Giản**:
   - Tầng trên: Hotline miễn phí, Hệ thống showroom, Tra cứu bảo hành & Vận đơn.
   - Tầng giữa: Logo thương hiệu sắc nét (`TechStore VN`), Thanh tìm kiếm thông minh với placeholder gợi ý ("Tìm kiếm iPhone 16, Laptop Gaming, Tủ lạnh Inverter..."), Giỏ hàng có badge số lượng nhảy linh hoạt, So sánh sản phẩm.
   - Tầng danh mục nhanh: Danh mục cấp 1 dạng pills / menu ngang dễ cuộn trên mobile.

2. **Hero Promo Showcase**:
   - Không dùng nền đen nặng nề toàn màn hình. Thay bằng layout banner khuyến mãi kép:
     - Banner chính: Khuyến mãi thiết bị tiêu điểm với ảnh to, nút "Mua Ngay" nổi bật, cam kết rõ ràng.
     - Cột phụ: 2 deal chớp nhoáng (Flash Deals) với nhãn "Giá Rẻ Quá", "Thu Cũ Trợ Giá Đến 2 Triệu".

3. **Flash Sale Shelf (Deal Chớp Nhoáng Cập Nhật Theo Giờ)**:
   - Thanh tiêu đề Flash Sale nổi bật với icon sấm sét vàng/đỏ và đồng hồ đếm ngược sinh động (Countdown Timer).
   - Thanh đo tiến độ bán hàng ("Đã bán 85%", "Sắp cháy hàng") tạo cảm giác thôi thúc mua sắm thực tế.

4. **Kệ Danh Mục Trực Quan (Visual Categories)**:
   - 8 icon tròn / bo góc mềm mại đại diện cho 8 nhóm hàng mũi nhọn (Điện thoại, Laptop, Điện lạnh, Gia dụng...).
   - Hiệu ứng hover nhấc nhẹ (`hover:-translate-y-1 hover:shadow-md`) tăng tính tương tác.

5. **Tabbed Product Showcase (Sản Phẩm Theo Ngành Hàng)**:
   - Tab chuyển nhanh: "Tất cả", "Điện thoại & Tablet", "Laptop & Đồ họa", "Điện gia dụng", "Phụ kiện".
   - Cho phép khách hàng xem nhiều loại máy ngay tại trang chủ mà không cần tải lại trang.

6. **Cam Kết Dịch Vụ & An Tâm Mua Sắm**:
   - 4 trụ cột: 100% Chính Hãng (VAT) - Giao Nhanh 2H (GHN/GHTK) - 1 Đổi 1 Trong 30 Ngày - Trả Góp 0% Lãi Suất.
