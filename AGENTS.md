# Quy Chuẩn Phát Triển Dự Án Thương Mại Điện Tử (TechStore VN)

Tài liệu này quy định các nguyên tắc thiết kế, biên tập nội dung, kiến trúc code và kiểm thử tự động bắt buộc phải tuân thủ trong toàn bộ codebase `repo_h`.

---

## 1. Nguyên tắc Thiết Kế Giao Diện (Anti-AI Retail UX)
- **Tuyệt đối không sử dụng phong cách AI Template**: Không dùng các bóng mờ neon (`blur-3xl`), không phối màu tím/xanh nhạt kiểu landing page AI giả lập, không tạo các card rời rạc trôi nổi thiếu liên kết.
- **Áp dụng chuẩn bán lẻ thực tế (Real Retail UX)**:
  - Phân cấp thông tin rõ ràng: Nhãn chính hãng -> Tên thương mại -> Giá bán & Tiết kiệm -> Cấu hình nổi bật.
  - Luôn hiển thị số tiền tiết kiệm cụ thể thay vì chỉ hiển thị % giảm giá trừu tượng.
  - Cung cấp đầy đủ các badge có giá trị pháp lý: "Chính Hãng VN/A", "Bảo Hành 24 Tháng", "1 Đổi 1 Trong 30 Ngày".
  - Bố cục responsive tối ưu cho thiết bị di động, kích thước vùng chạm (tap target) tối thiểu 44x44px.

---

## 2. Nguyên tắc Biên Tập Nội Dung & Copywriting (Authentic Commerce Copy)
- **Tuyệt đối cấm từ ngữ sáo rỗng của AI**: Loại bỏ hoàn toàn các từ như "đỉnh cao công nghệ", "hiệu năng vượt trội dẫn đầu xu hướng", "đẳng cấp khác biệt", "nâng tầm trải nghiệm".
- **Thay thế bằng lợi ích thực tế có thể định lượng**:
  - Tên chip + ví dụ phần mềm thực tế (ví dụ: "Chip Apple A18 Pro 3nm: Biên tập video 4K ProRes mượt mà, chơi game đồ họa cao không tụt FPS").
  - Dung lượng pin + thời gian sử dụng thực tế (ví dụ: "Pin 5000 mAh: Dùng hỗn hợp 1.5 ngày, xem YouTube liên tục 15 giờ").
- **Minh bạch thông tin bán lẻ**: Luôn có mục "Trong hộp gồm những gì (Unboxing list)", chính sách bảo hành theo Serial/IMEI, tem phụ và hóa đơn VAT điện tử.
- **Tuyệt đối cấm dữ liệu mẫu đùa cợt hoặc placeholder vô nghĩa** (như video Rickroll, link ảnh die, specs ảo).

---

## 3. Nguyên tắc Kiến Trúc Kỹ Thuật & Kiểm Thử Tự Động (Test-Driven QA)
- **Toàn vẹn giao dịch (ACID Transactions)**: Mọi thao tác trừ tồn kho và tạo đơn hàng phải được bọc trong Prisma `$transaction`. Không chấp nhận tình trạng trừ tồn kho xong tạo đơn thất bại hoặc cho phép đặt hàng khi `p.stock < item.quantity`.
- **Cổng thanh toán**: Mã hóa chuẩn HMAC SHA512 với VNPAY và HMAC SHA256 với MoMo; sắp xếp tham số A-Z trước khi hash.
- **Tiêu chuẩn kiểm thử bắt buộc**:
  - Mọi logic tính toán (tính tiền, voucher, giỏ hàng, phí ship, bảo mật chữ ký) PHẢI CÓ unit test tương ứng.
  - Lệnh kiểm tra trước khi commit: `npm test` (bao gồm cả NestJS Jest và Next.js Vitest) phải pass 100%.
