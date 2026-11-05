---
name: fullstack-testing-qa
description: >-
  Use this skill whenever creating new features, modifying business logic (cart, vouchers, order checkout, inventory, payments),
  or validating system stability in this full-stack Next.js and NestJS project.
  Guides the agent to implement robust unit and integration tests with 100% pass rate.
---

# Fullstack Testing & QA Skill (Test-Driven Reliability)

Hệ thống thương mại điện tử xử lý trực tiếp tiền bạc của khách hàng và tồn kho sản phẩm. Bất kỳ sai sót nào trong tính toán tiền giỏ hàng, áp mã giảm giá, trừ tồn kho hay xác thực chữ ký cổng thanh toán (VNPAY SHA512, MoMo HMAC) đều gây hậu quả nghiêm trọng.

Skill này quy định quy trình kiểm thử bắt buộc, thiết kế test cases và cách thức chạy test tự động.

---

## 1. Kiến trúc Kiểm thử trong dự án

### Backend (NestJS + Jest)
- **Công cụ**: `jest`, `ts-jest`, `@nestjs/testing`
- **File quy ước**: `src/**/*.spec.ts`
- **Cấu hình**: `backend/jest.config.json`
- **Lệnh chạy**:
  - `npm --prefix backend run test` (chạy toàn bộ unit test)
  - `npm --prefix backend run test:cov` (đo độ phủ test coverage)

### Frontend (Next.js + Vitest)
- **Công cụ**: `vitest`
- **File quy ước**: `src/**/*.test.ts`, `src/**/*.test.tsx`
- **Lệnh chạy**:
  - `npm --prefix frontend run test`
- **Root Runner**:
  - `npm test` (Chạy đồng thời test cả Backend và Frontend)

---

## 2. Các Modules Nghiệp Vụ Bắt Buộc Phải Có Test

### Module 1: Đơn Hàng & Tồn Kho (`OrdersService`)
Phải kiểm tra 5 kịch bản quan trọng:
1. Tạo đơn hàng thành công khi giỏ hàng hợp lệ và trừ số lượng tồn kho tương ứng trong `$transaction`.
2. Báo lỗi `BadRequestException` khi giỏ hàng rỗng.
3. Báo lỗi `BadRequestException` khi số lượng đặt vượt quá số lượng tồn kho thực tế (`p.stock < item.quantity`).
4. Áp dụng mã Voucher giảm giá theo % (tính chính xác, không vượt qua `maxDiscount`).
5. Áp dụng mã Voucher giảm giá theo số tiền cố định (`FIXED`).

### Module 2: Cổng Thanh Toán (`PaymentsService` / `VnpayService`)
Phải kiểm tra:
1. Thuật toán sắp xếp alphabet các tham số query params từ A đến Z.
2. Mã hóa chữ ký HMAC SHA512 với `VNPAY_HASH_SECRET`.
3. Đối soát IPN callback chữ ký hợp lệ và chữ ký giả mạo.

### Module 3: Frontend Stores & Formatters
Phải kiểm tra:
1. `formatPrice(price)`: Định dạng tiền Việt Nam Đồng chuẩn xác (`15.000.000 ₫`).
2. `cart-store`: Thêm sản phẩm, cộng dồn số lượng khi trùng `id`, xóa sản phẩm, tính tổng tiền tạm tính.
3. `compare-store`: Tối đa so sánh 4 sản phẩm cùng lúc, ngăn chặn thêm trùng lặp.

---

## 3. Mẫu Mock chuẩn trong NestJS (Prisma & Services)
```typescript
const mockPrismaService = {
  $transaction: jest.fn((callback) => callback(mockPrismaService)),
  product: {
    findMany: jest.fn(),
    update: jest.fn(),
  },
  voucher: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  order: {
    create: jest.fn(),
  },
  orderItem: {
    createMany: jest.fn(),
  },
};
```

---

## 4. Runbook Kiểm Tra Trước Khi Bàn Giao
Mỗi khi sửa đổi code, agent phải thực thi các bước sau:
1. Chạy `npm test` từ root.
2. Đảm bảo toàn bộ test suites đều đạt trạng thái `PASS`. Không được có bài test nào bị `FAIL` hoặc `SKIPPED`.
3. Chạy `npm run build:backend` và `npm run build:frontend` để xác nhận không có lỗi TypeScript hay lỗi biên dịch tĩnh.
