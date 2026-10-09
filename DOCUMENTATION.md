# TÀI LIỆU HƯỚNG DẪN KIẾN TRÚC & TRIỂN KHAI HỆ THỐNG E-COMMERCE

Hệ thống được thiết kế và xây dựng theo chuẩn công nghệ hiện đại, đáp ứng toàn diện các tiêu chí trong yêu cầu thiết kế hệ thống thương mại điện tử chuyên nghiệp tại Việt Nam:

---

## 1. TỔNG QUAN CÔNG NGHỆ (TECH STACK)

| Phân hệ | Công nghệ lựa chọn | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 15 (React 19 / TypeScript / Tailwind CSS / App Router)** | Tối ưu hóa SEO vượt trội nhờ Server-Side Rendering (SSR) & Server Components, giao diện hiện đại, tối ưu tốc độ tải trang. |
| **Backend** | **NestJS 10 (TypeScript / Clean Architecture / Modular)** | Hệ thống backend chuẩn doanh nghiệp, kiến trúc Module hóa tách biệt nghiệp vụ rõ ràng, type-safe từ đầu đến cuối. |
| **Database** | **PostgreSQL 16 kết hợp JSONB (Prisma ORM)** | Đảm bảo tính toàn vẹn giao dịch (ACID) cho dữ liệu quan hệ (User, Orders, Payments) đồng thời hỗ trợ lưu trữ **thuộc tính kỹ thuật linh hoạt (specs)** qua chuẩn PostgreSQL JSONB. |
| **Cache & Session** | **Redis 7 (ioredis)** | Bộ nhớ đệm dữ liệu truy vấn sản phẩm và quản lý phiên (session), giảm tải tối đa cho cơ sở dữ liệu chính. |
| **Search Engine** | **Elasticsearch 8.x** | Bộ lọc nâng cao, tìm kiếm đa trường (tên, danh mục, mô tả, khoảng giá, fuzzy search lỗi chính tả). |
| **Cổng thanh toán** | **VNPAY QR & MoMo** | Tích hợp thuật toán tạo URL thanh toán, mã hóa bảo mật SHA512 (VNPAY) và HMAC SHA256 (MoMo), xử lý IPN Webhook và Return URL. |
| **Đơn vị vận chuyển** | **GHN (Giao Hàng Nhanh) & GHTK (Giao Hàng Tiết Kiệm)** | Tính phí vận chuyển theo thời gian thực (real-time fee calculation) và đồng bộ mã vận đơn tự động. |
| **Hệ thống Email** | **Nodemailer & SendGrid** | Gửi email hóa đơn xác nhận đơn hàng tự động đến khách hàng. |

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
ecommerce-system/
├── docker-compose.yml          # Triển khai toàn bộ: Postgres, Redis, Elasticsearch, NestJS, Next.js
├── package.json                # Root package với monorepo scripts
├── .env.example                # File mẫu chứa toàn bộ cấu hình môi trường
├── DOCUMENTATION.md            # Tài liệu kiến trúc và hướng dẫn cài đặt chi tiết
├── backend/                    # NestJS API Server
│   ├── Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma       # Mô hình cơ sở dữ liệu (PostgreSQL + JSONB specs)
│   │   └── seed.ts             # Dữ liệu mẫu (Laptop, Điện thoại, Tài khoản Quản trị)
│   └── src/
│       ├── main.ts             # Swagger API Docs & Global Validation
│       ├── app.module.ts
│       └── modules/
│           ├── auth/           # Đăng ký, đăng nhập JWT, phân quyền
│           ├── products/       # Quản lý sản phẩm, JSONB specs, Redis cache, Elasticsearch sync
│           ├── categories/     # Cây danh mục sản phẩm
│           ├── orders/         # Quản lý đơn hàng và tính toán thanh toán
│           ├── payments/       # VNPAY (SHA512) & MoMo (HMAC SHA256) + IPN Webhooks
│           ├── shipping/       # GHN API & GHTK API (Tính phí & Tạo đơn vận chuyển)
│           ├── notifications/  # Nodemailer & SendGrid email templates
│           ├── redis/          # Quản lý Cache & Session
│           ├── search/         # Elasticsearch Client & Indexing
│           └── prisma/         # Prisma Client Lifecycle
└── frontend/                   # Next.js 15 App Router Client
    ├── Dockerfile
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx      # Root layout tối ưu SEO, OpenGraph metadata
    │   │   ├── page.tsx        # Trang chủ với banner & sản phẩm nổi bật
    │   │   ├── products/
    │   │   │   ├── page.tsx    # Danh mục sản phẩm, bộ lọc giá và tìm kiếm Elasticsearch
    │   │   │   └── [slug]/     # Trang chi tiết sản phẩm, SEO metadata động, bảng thông số kỹ thuật
    │   │   ├── cart/page.tsx   # Giỏ hàng mua sắm
    │   │   └── checkout/       # Thanh toán: Chọn GHN/GHTK, chọn VNPAY/MoMo, tạo đơn hàng
    │   │       └── success/    # Xác nhận đơn hàng & kết quả trả về từ cổng thanh toán
    │   ├── components/         # Navbar, Footer, ProductCard, ProductSpecsTable
    │   └── lib/                # API client, Cart Store, bộ định dạng tiền tệ VND
```

---

## 3. HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG

### Cách 1: Khởi chạy bằng Docker Compose (Khuyên dùng - 1 câu lệnh)
Toàn bộ hạ tầng bao gồm PostgreSQL, Redis, Elasticsearch, NestJS backend và Next.js frontend sẽ tự động khởi động:

```bash
docker compose up -d --build
```

- **Frontend Website**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Tài liệu Swagger API**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **Elasticsearch Engine**: [http://localhost:9200](http://localhost:9200)

---

### Cách 2: Chạy trực tiếp trên máy chủ / Local Development

#### 1. Cài đặt các gói phụ thuộc
```bash
# Ở thư mục gốc ecommerce-system:
npm --prefix backend install
npm --prefix frontend install
```

#### 2. Khởi tạo Cơ sở dữ liệu PostgreSQL & Seed dữ liệu mẫu
```bash
cp .env.example backend/.env
npm --prefix backend run prisma:migrate
npm --prefix backend run prisma:seed
```

#### 3. Chạy Backend (NestJS)
```bash
npm --prefix backend run start:dev
# Server chạy tại: http://localhost:5000/api
# Swagger Docs tại: http://localhost:5000/api/docs
```

#### 4. Chạy Frontend (Next.js)
```bash
npm --prefix frontend run dev
# Website chạy tại: http://localhost:3000
```

---

## 4. CHI TIẾT TÍCH HỢP CÁC DỊCH VỤ

### 💳 1. Cổng thanh toán VNPAY
- **Cơ chế**: Tạo chuỗi dữ liệu sắp xếp theo alphabet từ A-Z, băm mật mã chuẩn **HMAC SHA512** bằng bí mật `VNPAY_HASH_SECRET`.
- **Luồng xử lý**:
  1. Frontend gọi `POST /api/payments/create-url` với `orderId` và `provider: 'VNPAY'`.
  2. Backend sinh URL thanh toán chứa `vnp_SecureHash` và trả về cho Client chuyển hướng.
  3. Khách hàng quét mã VNPAY QR hoặc nhập thẻ ATM nội địa.
  4. VNPAY gửi dữ liệu về callback `GET /api/payments/vnpay/return` và IPN ngầm `GET /api/payments/vnpay/ipn`.
  5. Backend đối soát mã hash, cập nhật đơn hàng thành `CONFIRMED` và kích hoạt gửi email hóa đơn.

### 👛 2. Cổng thanh toán Ví MoMo
- **Cơ chế**: Tạo chữ ký điện tử **HMAC SHA256** theo chuẩn kỹ thuật của MoMo Payment Gateway v2.
- **Luồng xử lý**:
  1. Backend gửi request trực tiếp đến MoMo API endpoint với đầy đủ `partnerCode`, `accessKey`, `requestId`, `amount`, `orderId`, `signature`.
  2. MoMo trả về `payUrl` đưa khách hàng đến ứng dụng MoMo để xác nhận thanh toán.
  3. MoMo gọi Webhook IPN `POST /api/payments/momo/ipn`, hệ thống xác thực chữ ký và cập nhật trạng thái đơn hàng.

### 🚚 3. Đơn vị vận chuyển GHN & GHTK
- **GHN (Giao Hàng Nhanh)**:
  - API tính phí `/v2/shipping-order/fee` dựa trên trọng lượng, kích thước gói hàng và mã phường/xã (`to_ward_code`), quận/huyện (`to_district_id`).
  - Tự động tạo đơn hàng vận chuyển `/v2/shipping-order/create` và trả về mã vận đơn (`trackingCode`).
- **GHTK (Giao Hàng Tiết Kiệm)**:
  - API tính phí `/fee` theo tỉnh/thành phố và quận/huyện nhận hàng.
  - Tự động sinh nhãn vận đơn và ước tính ngày giao hàng chính xác.

### 📧 4. Dịch vụ Email (Nodemailer & SendGrid)
- Hệ thống hỗ trợ chuyển đổi linh hoạt qua biến môi trường `MAIL_DRIVER`:
  - `MAIL_DRIVER=nodemailer`: Gửi trực tiếp qua máy chủ SMTP (Gmail, Zoho, Sendinblue, Amazon SES).
  - `MAIL_DRIVER=sendgrid`: Gửi qua SendGrid REST API với độ tin cậy và khả năng scale cao.
- Tự động gửi email thông báo xác nhận đơn hàng kèm bảng chi tiết sản phẩm và tổng tiền bằng tiếng Việt chuẩn.

### ⚡ 5. Thuộc tính kỹ thuật linh hoạt (PostgreSQL JSONB Specs)
- Trường `specs: Json` trong bảng `products` cho phép lưu trữ bất kỳ thông số kỹ thuật nào của thiết bị điện tử:
  - Điện thoại: `man_hinh`, `cpu`, `ram`, `bo_nho_trong`, `camera_sau`, `pin_sac`.
  - Laptop: `cpu`, `ram`, `o_cung`, `cong_ket_noi`, `trong_luong`.
- Next.js component `ProductSpecsTable` tự động bóc tách và render giao diện bảng thông số kỹ thuật trực quan.
