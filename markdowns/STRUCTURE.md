# 🛒 Shopoo (Shopee Style & Dynamic Theme) - Project Specification

Tài liệu này đặc tả cấu trúc mã nguồn, cấu hình môi trường và các thành phần cốt lõi để tự động hóa việc khởi tạo (scaffold) dự án Ứng dụng Thương mại điện tử.
Dự án sử dụng kiến trúc **Feature-Sliced Design (FSD)**, mô phỏng giao diện Shopee (Trắng - Cam mặc định) nhưng cho phép người dùng tùy biến màu sắc chủ đạo tự do (Dynamic RGB Theming) qua cài đặt.

---

## Application Name: "Shopoo"

---

## 🛠️ Tech Stack & Core Libraries

- **Framework:** React Native / Expo (sử dụng **Expo Router** cho Navigation).
- **Styling:** Tailwind CSS (NativeWind v4) + Inline Styles cho Dynamic Theme.
- **State Management:** `zustand` (Quản lý Cart, Auth, và Theme) + `@react-native-async-storage/async-storage` (Persistence).
- **Network Layer:** `axios` (Giao tiếp FakeStoreAPI với Interceptors xử lý độ trễ và lỗi).
- **Form Validation:** `react-hook-form` + `zod` (Xác thực Form Checkout khắt khe).
- **Architecture Pattern:** Feature-Sliced Design (FSD).

---

## 📂 Complete Directory Tree Structure

```text
.
├── .env                              # Khai báo biến môi trường API
├── tailwind.config.js                # Cấu hình Tailwind cơ bản
├── package.json
└── src
    ├── app                           # (Routing Layer) Cấu trúc Expo Router
    │   ├── _layout.tsx               # Root Stack, khởi tạo Theme Provider/Zustand
    │   ├── (tabs)                    # Bottom Navigation Tabs
    │   │   ├── _layout.tsx
    │   │   ├── index.tsx             # Trang chủ (Danh sách sản phẩm dạng Lưới)
    │   │   ├── mall.tsx              # Danh mục sản phẩm (Category)
    │   │   ├── cart.tsx              # Giỏ hàng (CRUD số lượng, tính tổng)
    │   │   └── profile.tsx           # Hồ sơ người dùng
    │   ├── search.tsx                # Màn hình Tìm kiếm (Debounce Search)
    │   ├── checkout.tsx              # Form thanh toán (React Hook Form)
    │   ├── settings.tsx              # Màn hình cài đặt (Đổi Theme Color với Color Picker)
    │   └── product
    │       └── [id].tsx              # Chi tiết sản phẩm (Mô tả, Add to Cart)
    │
    ├── features                      # (Business Logic Layer) Nghiệp vụ cốt lõi
    │   ├── auth                      # Fake Auth
    │   │   └── store                 # useAuthStore.ts (Zustand + AsyncStorage)
    │   ├── cart                      # Giỏ hàng cục bộ
    │   │   └── store                 # useCartStore.ts (Multi-user hoặc Single-user local cart)
    │   ├── products                  # Sản phẩm
    │   │   ├── components            # ProductGrid, ProductCard
    │   │   └── hooks                 # useProducts.ts (Fetch từ FakeStoreAPI)
    │   ├── checkout                  # Thanh toán
    │   │   ├── components            # CheckoutForm.tsx
    │   │   └── schemas               # checkoutSchema.ts (Zod validation)
    │   └── theme                     # Tùy chỉnh giao diện
    │       ├── store                 # useThemeStore.ts (Lưu màu RGB tùy chọn)
    │       └── components            # ColorPickerModal.tsx
    │
    ├── shared                        # (Shared Layer) Tài nguyên dùng chung
    │   ├── api                       # apiClient.ts (Axios + Interceptors mock delay)
    │   ├── hooks                     # useDebounce.ts
    │   └── ui                        # UI Components nguyên bản, nhận màu động từ Theme Store
    │       ├── ThemedButton.tsx      # Button tự động đổi màu nền theo Theme
    │       ├── ThemedIcon.tsx        # Icon tự động đổi màu theo Theme
    │       └── LoadingSpinner.tsx
    │
    └── types                         # Khai báo TypeScript Interfaces
        └── index.ts
```

---

1. Environment & Network Configurations
   File: .env

```text
EXPO_PUBLIC_API_URL=[https://fakestoreapi.com](https://fakestoreapi.com)

```

File: src/shared/api/apiClient.ts
Khởi tạo cấu hình Axios, cố tình thêm độ trễ (Network Latency) để team UI có thể show-off Skeleton Loading.

```tsx
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// Thêm Interceptor để mô phỏng độ trễ mạng (800ms) và xử lý lỗi tập trung
apiClient.interceptors.response.use(
  async (response) => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Mock latency
    return response;
  },
  (error) => {
    // Xử lý lỗi tập trung (vd: 401 Unauthorized thì logout)
    return Promise.reject(error);
  },
);
```

2. Dynamic Theming (Màu sắc tùy chỉnh 16.9 triệu màu)
   Do Tailwind/NativeWind render class tĩnh tại build-time, việc truyền mã màu Hex/RGB động (ví dụ: bg-[#ff5722]) vào chuỗi class className sẽ không hoạt động.
   Giải pháp: Quản lý màu bằng Zustand và gán qua thuộc tính style.

File: src/features/theme/store/useThemeStore.ts

```tsx
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeState {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  resetTheme: () => void;
}

const SHOPEE_ORANGE = "#EE4D2D"; // Màu mặc định của Shopee

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      primaryColor: SHOPEE_ORANGE,
      setPrimaryColor: (color) => set({ primaryColor: color }),
      resetTheme: () => set({ primaryColor: SHOPEE_ORANGE }),
    }),
    {
      name: "app-theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

Ví dụ Áp dụng vào Shared Component (src/shared/ui/ThemedButton.tsx):

```tsx
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useThemeStore } from "../../features/theme/store/useThemeStore";

export const ThemedButton = ({ title, onPress, className = "" }) => {
  const { primaryColor } = useThemeStore();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`py-3 px-4 rounded-md items-center justify-center ${className}`}
      style={{ backgroundColor: primaryColor }} // Inject Dynamic Color
    >
      <Text className="text-white font-bold">{title}</Text>
    </TouchableOpacity>
  );
};
```

3. Cart State Management (Zustand + Persistence)
   File: src/features/cart/store/useCartStore.ts
   Quản lý giỏ hàng cục bộ, lưu vĩnh viễn trên thiết bị.

```tsx
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
    }),
    {
      name: "ecommerce-cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

4. Checkout Form Validation (React Hook Form + Zod)
   File: src/features/checkout/schemas/checkoutSchema.ts

```tsx
import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  address: z
    .string()
    .min(10, "Vui lòng nhập địa chỉ giao hàng đầy đủ (Tối thiểu 10 ký tự)"),
  phone: z
    .string()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
```

(Trong Component checkout.tsx, kết hợp ZodResolver với useForm để bắt lỗi realtime và hiển thị thông báo lỗi màu đỏ ngay dưới từng InputField).
