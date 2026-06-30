# 📋 Shopoo - Nhật ký Trạng thái Phát triển (DEVELOPMENT_STATE.md)

Tài liệu này lưu trữ trạng thái hiện tại của dự án, các phần đã làm được, cấu trúc hệ thống và các bước tiếp theo để phục vụ cho các phiên làm việc sau.

---

## 📅 Cập Nhật: 30/06/2026

### 1. 🛠️ Cài Đặt Môi Trường & Cấu Hình Gốc
Chúng ta đã hoàn thiện cấu hình nền tảng cho dự án sử dụng **Expo v54.0**, **NativeWind v4** (Tailwind CSS) và các thư viện core:
- **Biến môi trường (`.env`)**: Khởi tạo biến `EXPO_PUBLIC_API_URL` trỏ tới `https://fakestoreapi.com` (đã sửa lỗi dính link markdown từ spec gốc).
- **Sửa lỗi thiếu module (`babel-preset-expo`)**: Đã chạy lệnh `npx expo install babel-preset-expo` để tải bản tương thích chính thức với Expo SDK 54, giải quyết lỗi thiếu preset khi Babel biên dịch mã nguồn.
- **NativeWind v4 / Tailwind CSS**:
  - Tạo `global.css` chứa các directive `@tailwind`.
  - Cấu hình `tailwind.config.js` với các đường dẫn FSD và preset `nativewind/preset`.
  - Tích hợp `babel.config.js` và `metro.config.js` với plugin NativeWind.
  - Tạo file định nghĩa kiểu TypeScript `nativewind-env.d.ts` ở thư mục gốc để giải quyết triệt để lỗi biên dịch `className` trên các thẻ gốc của React Native.
- **TypeScript Aliases (`tsconfig.json`)**: Cập nhật path alias `"@/*"` trỏ song song vào `./src/*` và `./*` để các import alias hoạt động mượt mà.
- **Dọn dẹp Boilerplate**: Đã loại bỏ toàn bộ các thư mục/tệp tin mẫu không nằm trong cấu trúc đề xuất khỏi thư mục gốc (`app/`, `components/`, `constants/`, `hooks/`, và `scripts/`) để đảm bảo dự án sạch sẽ và chỉ chứa FSD cấu trúc dưới `src/`.

---

### 2. 📁 Cấu Trúc Mã Nguồn Thực Tế (FSD Architecture)
Dự án đã được triển khai bám sát cấu trúc **Feature-Sliced Design (FSD)**:

```text
src
├── app                                 # Routing Layer (Expo Router)
│   ├── _layout.tsx                     # Root Layout + Global Route Guard
│   ├── (auth)                          # Định tuyến luồng đăng nhập/đăng ký
│   │   ├── _layout.tsx
│   │   ├── login.tsx                   # Màn hình đăng nhập + hướng dẫn tài khoản FakeStoreAPI
│   │   └── register.tsx                # Màn hình đăng ký giả lập
│   ├── (tabs)                          # Bottom Tab Navigation
│   │   ├── _layout.tsx                 # Cấu hình Tab Bar + Badge Giỏ hàng động
│   │   ├── index.tsx                   # Trang chủ (Banner, Gợi ý hôm nay)
│   │   ├── mall.tsx                    # Danh mục hàng hóa thiết kế đẹp mắt
│   │   ├── cart.tsx                    # Giỏ hàng cục bộ (CRUD số lượng, Xóa)
│   │   └── profile.tsx                 # Trang cá nhân + Đăng xuất
│   ├── search.tsx                      # Tìm kiếm Debounce + Lọc theo Danh mục
│   ├── checkout.tsx                    # Điền thông tin giao hàng
│   ├── order-success.tsx               # Biên nhận đơn hàng thành công
│   ├── settings.tsx                    # Cấu hình giao diện (Color Picker)
│   └── product
│       └── [id].tsx                    # Chi tiết sản phẩm (Mô tả, đánh giá sao, thêm vào giỏ)
│
├── features                            # Business Logic Layer
│   ├── auth
│   │   ├── components                  # LoginForm.tsx, RegisterForm.tsx
│   │   ├── schemas                     # authSchema.ts (Zod validation)
│   │   └── store                       # useAuthStore.ts (Zustand + AsyncStorage)
│   ├── cart
│   │   └── store                       # useCartStore.ts (Giỏ hàng cục bộ đa người dùng)
│   ├── checkout
│   │   ├── components                  # CheckoutForm.tsx (Xác thực checkout)
│   │   └── schemas                     # checkoutSchema.ts (Sửa lỗi regex số điện thoại)
│   ├── products
│   │   ├── components                  # ProductCard.tsx, ProductGrid.tsx (Responsive 2/4 cột)
│   │   └── hooks                       # useProducts.ts, useProduct.ts, useCategories.ts
│   └── theme
│       ├── components                  # ColorPickerModal.tsx (Preset màu đa dạng)
│       └── store                       # useThemeStore.ts (Zustand + AsyncStorage)
│
├── shared                              # Shared Layer (Tài nguyên dùng chung)
│   ├── api                             # apiClient.ts (Axios + 800ms mock delay)
│   ├── hooks                           # useDebounce.ts, useResponsive.ts
│   └── ui                              # UI Components nguyên bản nhận màu từ Theme Store
│       ├── ThemedButton.tsx            # Button động theo Theme (Filled/Outline/Loading)
│       ├── ThemedIcon.tsx              # Vector Icon (Ionicons) đổi màu theo Theme
│       ├── LoadingSpinner.tsx          # Vòng xoay tải dữ liệu theo tông màu chủ đạo
│       ├── SkeletonCard.tsx            # Khung xương tải sản phẩm (Pulse animation)
│       └── ErrorView.tsx               # Giao diện báo lỗi kèm nút "Thử lại"
│
└── types                               # TypeScript Interfaces
    └── index.ts                        # Product, CartItem, User type definitions
```

---

### 3. 🌟 Các Tính Năng Đã Hoàn Thiện & Cải Tiến

| Tính năng / Yêu cầu | Trạng thái | Chi tiết triển khai |
| :--- | :---: | :--- |
| **Dynamic Theming** | ✅ Hoàn thành | Quản lý màu RGB thông qua `useThemeStore` (Zustand + AsyncStorage). Nút bấm, icon, chỉ mục tab và viền giao diện tự động đồng bộ màu chủ đạo mới ngay khi áp dụng mà không cần reload. |
| **Authentication Flow** | ✅ Hoàn thành | Tích hợp FakeStoreAPI `POST /auth/login` (Tài khoản mẫu: `mor_2314` / `83r5^_`). Định tuyến được bảo vệ bằng Route Guard tại Root `_layout.tsx` giúp tự động đá người dùng chưa đăng nhập về trang login và ngược lại. Đăng ký được giả lập mượt mà ở phía client-side. |
| **Responsive Grid** | ✅ Hoàn thành | Viết hook `useResponsive` tự động phát hiện thiết bị Phone/Tablet qua chiều rộng màn hình. Trình bày sản phẩm dạng lưới: **2 cột trên điện thoại** và **4 cột trên máy tính bảng** bằng FlatList native mượt mà. |
| **Giỏ hàng (CRUD)** | ✅ Hoàn thành | Local cart lưu trữ trạng thái sản phẩm qua Zustand. Hỗ trợ thay đổi số lượng (+/-), tính tổng tiền realtime, hiển thị số lượng vật phẩm qua Badge đỏ trên tab bar và xóa khỏi giỏ hàng. |
| **Form Validate (Zod)** | ✅ Hoàn thành | Xác thực khắt khe bằng `react-hook-form` + `zod` trên Checkout Form và Auth Form. Sửa lỗi regex số điện thoại bị dư dấu `|` trong spec gốc theo yêu cầu của `Structure_addendum.md`. |
| **Trang thành công** | ✅ Hoàn thành | Chuyển hướng người nhận sau khi đặt hàng sang `order-success.tsx` hiển thị mã đơn hàng ngẫu nhiên, địa chỉ nhận hàng và tổng hóa đơn, đồng thời tự động dọn sạch giỏ hàng. |
| **Skeleton & Error UI** | ✅ Hoàn thành | Thay thế Spinner đơn điệu bằng hiệu ứng Skeleton Card pulse đẹp mắt khi tải sản phẩm. Tích hợp `ErrorView` với nút "Thử lại" kích hoạt cơ chế `refetch` khi API gặp sự cố. |
| **Tìm kiếm & Bộ lọc** | ✅ Hoàn thành | Tích hợp bộ tìm kiếm nhập liệu (có debounce tránh spam request) kết hợp với các chip lọc danh mục trượt ngang trên màn hình `search.tsx`. |

---

### 4. 🧪 Kết Quả Kiểm Tra Hệ Thống
Đã tiến hành kiểm tra kiểu dữ liệu tĩnh thông qua trình biên dịch TypeScript:
```bash
npx tsc --noEmit
```
**Kết quả:** Biên dịch thành công 100% với **0 lỗi và 0 cảnh báo**. Tất cả các tham chiếu import tương đối (relative import) giữa các tầng FSD đều chính xác và hợp lệ.

---

### 📅 Kế hoạch & Các bước tiếp theo
1. **Kiểm thử trên thiết bị mô phỏng (Android/iOS)**: Khởi chạy dự án bằng lệnh `npm run android` hoặc `npm run ios` để kiểm tra độ mượt của các hiệu ứng loading skeleton, responsive grid columns và color picker modal trên mobile.
2. **Kiểm tra hiệu năng**: Tối ưu hóa việc render ảnh của `expo-image` để giảm thiểu băng thông khi tải danh sách sản phẩm dài.
