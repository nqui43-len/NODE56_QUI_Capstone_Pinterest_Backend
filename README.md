# Capstone Project: Pinterest Clone - Backend API

Dự án Backend phục vụ cho ứng dụng web Pinterest Clone. Hệ thống được xây dựng trên nền tảng Node.js, sử dụng framework NestJS kết hợp Prisma ORM và cơ sở dữ liệu PostgreSQL nhằm đảm bảo tính mở rộng và cấu trúc code chặt chẽ.

**Học viên thực hiện:** Nguyễn Hoàng Qui - Lớp Node56

---

## 🔗 Liên kết dự án

* **Frontend Repository:** [NODE56_QUI_Capstone_Pinterest_Frontend](https://github.com/nqui43-len/NODE56_QUI_Capstone_Pinterest_Frontend.git)
* **Frontend Deployment:** [Vercel Link](https://node-56-qui-capstone-pinterest-fron.vercel.app/)
* **Backend Deployment:** [Render Link](https://node56-qui-capstone-pinterest-backend.onrender.com/)

## 🛠 Công nghệ sử dụng

* **Core Framework:** [NestJS](https://nestjs.com/)
* **Database & ORM:** PostgreSQL ([Supabase](https://supabase.com/)) & [Prisma](https://www.prisma.io/)
* **Cloud Storage:** [Cloudinary](https://cloudinary.com/) (Tối ưu hóa và lưu trữ hình ảnh vĩnh viễn)
* **Authentication:** JSON Web Token (JWT) / Passwords Hashing (Bcrypt)

## 🚀 Hướng dẫn cài đặt (Local Development)

**Bước 1: Clone dự án và cài đặt các thư viện phụ thuộc**
```bash
npm install

**Bước 2: Thiết lập biến môi trường**
**Tạo file .env tại thư mục gốc của dự án. Tham khảo cấu trúc từ file .env.example và điền các thông số tương ứng:**
DATABASE_URL="postgresql://postgres.zbhhvcbfatcbbwokprch:[your-password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# JWT Secret Key
JWT_SECRET="your_secret_key_here"

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

**Bước 3: Đồng bộ Database và khởi tạo dữ liệu mẫu (Seed)
**Hệ thống đã được thiết lập sẵn file seed chứa tài khoản quản trị viên và các bản ghi hình ảnh mẫu (Pins) để thuận tiện cho việc kiểm thử API.
npx prisma generate
npx prisma db push
npx prisma db seed

**Bước 4: Khởi động Server**
npm run start:dev

**📂 Các tính năng cốt lõi đã triển khai
**Authentication (Xác thực):
**Đăng ký, Đăng nhập và mã hóa mật khẩu bảo mật.
**Ủy quyền thông qua JWT Bearer Token.

**User Management (Quản lý người dùng):
**Lấy thông tin hồ sơ và bảo vệ API qua AuthGuard.
**Cập nhật thông tin cá nhân (Tên hiển thị, Avatar) đồng bộ thời gian thực.

**Pin Management (Quản lý hình ảnh):
**Tích hợp Multer xử lý tải ảnh lên máy chủ.
**Tự động đẩy file ảnh lên Cloudinary và trả về URL HTTPS tốc độ cao.
**Danh sách phân trang, tìm kiếm và lưu (Save) ảnh về hồ sơ cá nhân.