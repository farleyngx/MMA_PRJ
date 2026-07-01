# 📋 Shopoo - Nhật ký Trạng thái Phát triển (DEVELOPMENT_STATE.md)

Tài liệu này lưu trữ trạng thái hiện tại của dự án, các phần đã làm được, cấu trúc hệ thống và các bước tiếp theo để phục vụ cho các phiên làm việc sau.

---

## 📅 Cập Nhật: 01/07/2026

### 1. 🛠️ Cải tiến Định tuyến & Tái cấu trúc Tab Bar
Chúng ta đã cấu hình lại luồng định hướng và dọn dẹp dự án:
- **Loại bỏ Tab Mall**: Màn hình `src/app/(tabs)/mall.tsx` cũ đã được xóa bỏ hoàn toàn.
- **Tích hợp Tab Tìm kiếm**: Chuyển giao diện tìm kiếm từ `src/app/search.tsx` vào trong thanh điều hướng chính `src/app/(tabs)/search.tsx`. Người dùng hiện có thể tìm kiếm sản phẩm trực tiếp từ Tab Bar.
- **Dọn dẹp code & eslint**:
  - Khắc phục các cảnh báo unused import và unused variable trong các tệp tin `register.tsx`, `LoginForm.tsx`, `RegisterForm.tsx`.
  - Khai báo bổ sung eslint ignore trong `apiClient.ts` đối với default Axios import.
  - Sửa đổi mảng dependencies trong hook định tuyến điều hướng ở `src/app/_layout.tsx` (thêm `router`).

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
│   │   ├── index.tsx                   # Trang chủ (Banner, Categories, Gợi ý hôm nay)
│   │   ├── search.tsx                  # Tìm kiếm Debounce + Lọc theo Danh mục (Chuyển thành Tab chính)
│   │   ├── cart.tsx                    # Giỏ hàng cục bộ (CRUD số lượng, Xóa tất cả với xác nhận)
│   │   └── profile.tsx                 # Trang cá nhân + Đăng xuất
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
| **Dynamic Theming** | ✅ Hoàn thành | Quản lý màu RGB thông qua `useThemeStore` (Zustand + AsyncStorage). Tích hợp trực tiếp trình chọn màu inline vào màn hình Cài đặt (SettingsScreen), hỗ trợ chọn màu phổ biến, vòng màu mỹ thuật 18 hạt, kết hợp thanh trượt HSL điều chỉnh lightness 20%-90%. |
| **Authentication Flow** | ✅ Hoàn thành | Tích hợp FakeStoreAPI `POST /auth/login` (Tài khoản mẫu: `mor_2314` / `83r5^_`). Định tuyến được bảo vệ bằng Route Guard tại Root `_layout.tsx` giúp tự động đá người dùng chưa đăng nhập về trang login và ngược lại. Đăng ký được giả lập mượt mà ở phía client-side. |
| **Responsive Grid** | ✅ Hoàn thành | Viết hook `useResponsive` tự động phát hiện thiết bị Phone/Tablet qua chiều rộng màn hình. Trình bày sản phẩm dạng lưới: **2 cột trên điện thoại** và **4 cột trên máy tính bảng** bằng FlatList native mượt mà. |
| **Giỏ hàng (CRUD)** | ✅ Hoàn thành | Local cart lưu trữ trạng thái sản phẩm qua Zustand. Hỗ trợ thay đổi số lượng (+/-), tính tổng tiền realtime, hiển thị số lượng vật phẩm qua Badge đỏ trên tab bar và xóa khỏi giỏ hàng. |
| **Form Validate (Zod)** | ✅ Hoàn thành | Xác thực khắt khe bằng `react-hook-form` + `zod` trên Checkout Form và Auth Form. Sửa lỗi regex số điện thoại bị dư dấu `|` trong spec gốc theo yêu cầu của `Structure_addendum.md`. |
| **Trang thành công** | ✅ Hoàn thành | Chuyển hướng người nhận sau khi đặt hàng sang `order-success.tsx` hiển thị mã đơn hàng ngẫu nhiên, địa chỉ nhận hàng và tổng hóa đơn. Đã sửa lỗi điều hướng sớm về Trang chủ (do giỏ hàng rỗng) bằng biến trạng thái `isSubmitted` để hoàn thiện luồng đặt hàng. |
| **Skeleton & Error UI** | ✅ Hoàn thành | Thay thế Spinner đơn điệu bằng hiệu ứng Skeleton Card pulse đẹp mắt khi tải sản phẩm. Tích hợp `ErrorView` với nút "Thử lại" kích hoạt cơ chế `refetch` khi API gặp sự cố. |
| **Tìm kiếm & Bộ lọc** | ✅ Hoàn thành | Tích hợp bộ tìm kiếm nhập liệu (có debounce tránh spam request) kết hợp với các chip lọc danh mục trượt ngang trên màn hình `(tabs)/search.tsx` đã chuyển làm Tab chính. |
| **Sửa lỗi hiển thị ảnh** | ✅ Hoàn thành | Khắc phục lỗi không hiển thị hình ảnh từ API do NativeWind không mapping được class `w-full h-full` vào thành phần Native `Image` (expo-image). Đổi sang dùng `style={{ width: '100%', height: '100%' }}` trực tiếp trên các thẻ `<Image>` tại `ProductCard.tsx` và `product/[id].tsx`. |
| **SafeAreaView chuẩn hóa** | ✅ Hoàn thành | Thay thế 100% các import `SafeAreaView` từ `react-native` sang `react-native-safe-area-context` trên tất cả các màn hình chính và phụ. |
| **Tối ưu hóa UI Tab Bar** | ✅ Hoàn thành | Nới rộng chiều cao Tab Bar lên `100` và tinh chỉnh `paddingBottom: 20` giúp tối ưu hóa không gian hiển thị trên các thiết bị smartphone thế hệ mới. |
| **Tách nền hình ảnh (Rembg)** | ✅ Hoàn thành | Cài đặt Python 3.12 và thư viện `rembg[cpu]`, chạy kịch bản tự động bằng thuật toán U2Net giúp tách nền trắng của [model.png](file:///D:/FPT/SU26/MMA301/Projects/Project_SE191034_EcommerceApp/assets/images/model.png) sang dạng trong suốt hoàn hảo. Tích hợp trực tiếp tấm ảnh này vào vùng chứa `HomeBanner` của màn hình trang chủ (`index.tsx`), thay thế icon hộp quà mặc định bằng hình mẫu thời trang chồng lấp viền banner cực kỳ chuyên nghiệp. |
| **Thanh Danh Mục (Categories)** | ✅ Hoàn thành | Thiết kế component `<Categories />` đặt giữa `HomeBanner` và `SectionTitle` dạng horizontal ScrollView. Hiển thị các danh mục dạng `flex-col` gồm icon màu sắc sống động và tiêu đề tương ứng. Bấm chọn danh mục sẽ điều hướng sang Tab Tìm Kiếm và tự động kích hoạt bộ lọc. |
| **Giá gốc gạch ngang (ProductCard)** | ✅ Hoàn thành | Bổ sung hiển thị giá gốc màu xám có gạch ngang (`line-through`) cạnh giá bán thực tế với công thức `giá gốc = giá bán * 1.2`. |
| **Cảnh báo Xóa giỏ hàng** | ✅ Hoàn thành | Đổi nút text xóa sang icon `trash-outline` (Ionicons) màu trắng tinh tế bố trí tại góc phải Header của Giỏ hàng. Tích hợp cảnh báo xác nhận xóa (`Alert.alert`) Native để tăng tính an toàn dữ liệu. |

---

### 4. 🧪 Kết Quả Kiểm Tra Hệ Thống
Đã tiến hành kiểm tra kiểu dữ liệu tĩnh thông qua trình biên dịch TypeScript:
```bash
npx tsc --noEmit
```
**Kết quả:** Biên dịch thành công 100% với **0 lỗi và 0 cảnh báo**.
Đã chạy lint dự án:
```bash
npm run lint
```
**Kết quả:** Thành công 100% với **0 lỗi và 0 cảnh báo**.

---

### 📅 Kế hoạch & Các bước tiếp theo
1. **Kiểm thử giao diện**: Chạy mô phỏng thiết bị Android/iOS bằng `npm run android` hoặc `npm run ios` để đánh giá trải nghiệm của các thanh Danh mục, định dạng giá gốc, và hộp thoại xác nhận Native Alert trên điện thoại thực tế.
2. **Kiểm tra hiệu năng**: Tối ưu hóa render ảnh của `expo-image` nhằm đảm bảo khả năng scroll danh sách mượt mà khi danh mục lọc dài.
