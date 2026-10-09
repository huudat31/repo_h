# E-Commerce Platform Architecture (Storefront & Backend)

Hệ thống Thương Mại Điện Tử & Bán Lẻ Điện Máy / Công Nghệ Toàn Diện:
- **Frontend**: Next.js 15 (App Router, Tailwind CSS, TypeScript, Tối ưu SEO vượt trội)
- **Backend**: NestJS 10 (Clean Architecture, Modular, TypeScript, Swagger OpenAPI)
- **Database**: PostgreSQL 16 với Prisma ORM (hỗ trợ lưu trữ thuộc tính kỹ thuật linh hoạt qua PostgreSQL JSONB)
- **Cache & Search**: Redis 7 & Elasticsearch 8.x
- **Tích hợp cổng thanh toán**: VNPAY (SHA512) & MoMo (HMAC SHA256)
- **Đơn vị vận chuyển**: GHN (Giao Hàng Nhanh) & GHTK (Giao Hàng Tiết Kiệm)
- **Hệ thống Email**: Nodemailer & SendGrid

---

## 🌟 PHÂN HỆ KHÁCH HÀNG (BUYER / STOREFRONT)

1. **Quản lý tài khoản**: Đăng ký, đăng nhập JWT/OTP, sổ địa chỉ giao hàng.
2. **Tìm kiếm & Bộ lọc chuyên sâu (Advanced Search & Filter)**:
   - Lọc theo thương hiệu: Panasonic, Philips, Sunhouse, Apple...
   - Lọc công nghệ tiết kiệm điện Inverter, khoảng giá, công suất, dung tích.
   - Tìm kiếm thông minh qua từ khóa hoặc mã sản phẩm (SKU).
3. **Trang Chi tiết Sản phẩm (Product Details)**:
   - Bảng thông số kỹ thuật chi tiết theo thời gian thực (JSONB).
   - Bộ chọn biến thể (Màu sắc, Dung tích, Công suất) tự động đồng bộ giá và kho.
   - Trải nghiệm xoay ảnh 360 độ tương tác và video thực tế.
   - Đánh giá & Bình luận (Review & Rating) kèm hình ảnh thực tế từ người mua.
   - Gợi ý mua kèm phụ kiện (Cross-sell Bundle Deals): mua máy giặt gợi ý chân đế chống rung + nước giặt xả.
4. **So sánh sản phẩm (Product Comparison Matrix)**:
   - Chọn từ 2 đến 4 sản phẩm cùng loại trên thanh cố định `ComparisonBar`.
   - Bảng ma trận đối chiếu thông số kỹ thuật song song tại `/compare`.
   - Tính năng "Chỉ hiển thị điểm khác biệt" (Highlight differences).
5. **Giỏ hàng & Đặt hàng (Cart & Checkout)**:
   - Quản lý giỏ hàng real-time.
   - Lựa chọn dịch vụ đi kèm: Dịch vụ lắp đặt tận nơi, Gói bảo hành vàng mở rộng 24 tháng.
   - Áp dụng mã giảm giá / Voucher engine (`GIAM50K`, `INVERTER500`).
   - Đa cổng thanh toán: VNPAY QR, Ví MoMo, COD, Trả góp 0%.
   - Lựa chọn khung giờ giao hàng thuận tiện (Giờ hành chính, buổi tối, cuối tuần).
6. **Theo dõi đơn hàng & Bảo hành**:
   - Tra cứu tiến trình đơn hàng 5 bước thời gian thực (`/tra-cuu-don-hang`).
   - Tra cứu Bảo hành điện tử công khai theo SĐT hoặc mã Serial/IMEI (`/tra-cuu-bao-hanh`).

# repo_h
