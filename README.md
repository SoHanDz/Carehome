Cấu trúc thư mục như sau:

Carehome/
├─ public/                 # Chứa assets tĩnh (logo, favicon, hình ảnh public)
│
├─ src/
│  ├─ assets/              # Hình ảnh, icon, css, font
│  ├─ components/          # Các component tái sử dụng (Button, Modal, Table…)
│  ├─ layouts/             # Layout chung (MainLayout, AuthLayout…)
│  ├─ pages/               # Các trang chính
│  │   ├─ Dashboard/
│  │   ├─ Residents/       # Quản lý cư dân (người ở viện)
│  │   ├─ Staff/           # Quản lý nhân viên
│  │   ├─ Medical/         # Quản lý y tế, thuốc
│  │   ├─ Rooms/           # Quản lý phòng
│  │   └─ Auth/            # Đăng nhập, đăng ký
│  ├─ routes/              # Cấu hình router
│  │   └─ index.tsx
│  ├─ services/            # Gọi API (Axios, fetch)
│  │   ├─ residentService.ts
│  │   ├─ staffService.ts
│  │   └─ authService.ts
│  ├─ types/               # Khai báo TypeScript types/interfaces
│  │   └─ resident.ts
│  ├─ utils/               # Hàm tiện ích (formatDate, validate…)
│  ├─ App.tsx              # App gốc
│  ├─ main.tsx             # Entry point
│  └─ theme.ts             # Cấu hình theme Ant Design
│
├─ .env                    # Biến môi trường (API URL, SECRET_KEY…)
├─ tsconfig.json
├─ package.json
└─ vite.config.ts

Ví dụ trong 1 folder của pages bất kì

src/pages/Auth/
├─ components/           # Các component con (form nhỏ, UI riêng)
│   ├─ LoginForm.tsx
│   ├─ RegisterForm.tsx
│   └─ ResetPasswordForm.tsx
│
├─ hooks/                # (tùy chọn) hook riêng cho Auth
│   └─ useAuth.ts
│
├─ services/             # API gọi riêng cho Auth
│   └─ authService.ts
│
├─ types/                # Khai báo interface/type cho Auth
│   └─ auth.ts
│
├─ Login.tsx             # Trang đăng nhập
├─ Register.tsx          # Trang đăng ký
├─ ResetPassword.tsx     # Trang quên/mật khẩu mới
└─ index.ts 