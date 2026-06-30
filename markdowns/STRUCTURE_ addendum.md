# 🔧 Shopoo - Addendum: Hoàn Thiện Spec (v1.1)

File này bổ sung cho `STRUCTURE.md` gốc, khắc phục các hạng mục còn thiếu so với yêu cầu đề bài: Authentication Flow, Order Success Screen, Responsive Design, Category Filter, Skeleton/Error UI, và sửa các lỗi nhỏ.

---

## 📂 Cập nhật Directory Tree (Diff so với bản gốc)

```diff
src
├── app
│   ├── _layout.tsx
+   ├── (auth)                        # Route group cho luồng xác thực
+   │   ├── _layout.tsx                # Redirect nếu đã đăng nhập
+   │   ├── login.tsx                  # Đăng nhập qua FakeStoreAPI /auth/login
+   │   └── register.tsx               # Đăng ký giả lập (client-side only)
│   ├── (tabs)
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── mall.tsx
│   │   ├── cart.tsx
│   │   └── profile.tsx
│   ├── search.tsx
│   ├── checkout.tsx
+   ├── order-success.tsx              # Màn hình xác nhận đơn hàng sau checkout
│   ├── settings.tsx
│   └── product
│       └── [id].tsx
│
├── features
│   ├── auth
+   │   ├── store                      # useAuthStore.ts (đã mở rộng - xem mục 1)
+   │   ├── components                 # LoginForm.tsx, RegisterForm.tsx
+   │   └── schemas                    # authSchema.ts (Zod validation)
│   ├── cart
│   ├── products
│   │   ├── components
+   │   │   ├── ProductGrid.tsx        # Responsive: 2 cột (phone) / 4 cột (tablet)
│   │   │   └── ProductCard.tsx
│   │   └── hooks
│   │       ├── useProducts.ts
+   │       └── useCategories.ts       # Fetch /products/categories
│   ├── checkout
│   │   ├── components
│   │   └── schemas
│   └── theme
│
└── shared
    ├── api
    ├── hooks
+   │   └── useResponsive.ts           # Hook xác định phone/tablet breakpoint
    └── ui
        ├── ThemedButton.tsx
        ├── ThemedIcon.tsx
-       └── LoadingSpinner.tsx
+       ├── LoadingSpinner.tsx
+       ├── SkeletonCard.tsx           # Skeleton loading cho ProductCard
+       └── ErrorView.tsx              # Component hiển thị lỗi + nút Retry
```

---

## 1. Authentication Flow (FakeStoreAPI)

> **Lưu ý quan trọng:** FakeStoreAPI chỉ cung cấp endpoint `POST /auth/login` với các tài khoản mẫu có sẵn (ví dụ `mor_2314` / `83r5^_`), **không có** endpoint đăng ký thật. Vì vậy màn hình `register.tsx` chỉ mô phỏng UI/UX và lưu thông tin giả vào local store, cần ghi chú rõ điều này khi báo cáo/đánh giá project.

### File: `src/features/auth/store/useAuthStore.ts`

```tsx
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "app-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

### File: `src/app/(auth)/_layout.tsx`

Bảo vệ route: nếu đã đăng nhập, tự động chuyển vào `(tabs)`.

```tsx
import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
```

### File: `src/features/auth/schemas/authSchema.ts`

```tsx
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    username: z.string().min(3, "Tên đăng nhập tối thiểu 3 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
```

### Logic gọi API: `src/app/(auth)/login.tsx` (rút gọn)

```tsx
import { apiClient } from "../../shared/api/apiClient";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { router } from "expo-router";

const onSubmit = async (data: { username: string; password: string }) => {
  try {
    const res = await apiClient.post("/auth/login", data);
    // FakeStoreAPI chỉ trả về { token }, user info cần giả lập thêm
    useAuthStore.getState().login(res.data.token, {
      id: 1,
      username: data.username,
      email: `${data.username}@shopoo.fake`,
    });
    router.replace("/(tabs)");
  } catch (err) {
    // Hiển thị lỗi "Sai tài khoản hoặc mật khẩu"
  }
};
```

### Route Guard cho `(tabs)`

Trong `src/app/_layout.tsx` (Root), kiểm tra `isAuthenticated` để quyết định render `(auth)` hay `(tabs)` làm initial route — tránh user truy cập thẳng vào tabs khi chưa đăng nhập.

---

## 2. Order Success Screen (Sau khi Checkout)

### File: `src/app/order-success.tsx`

Nhận thông tin đơn hàng qua route params (hoặc qua một `useOrderStore` tạm) và hiển thị tóm tắt.

```tsx
import { View, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedButton } from "../shared/ui/ThemedButton";

export default function OrderSuccessScreen() {
  const { orderId, fullName, address, total } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <Text className="text-2xl font-bold mb-2">🎉 Đặt hàng thành công!</Text>
      <Text className="text-gray-500 mb-6">Mã đơn hàng: #{orderId}</Text>

      <View className="w-full bg-gray-50 rounded-lg p-4 mb-6">
        <Text className="mb-1">Người nhận: {fullName}</Text>
        <Text className="mb-1">Địa chỉ: {address}</Text>
        <Text className="font-bold mt-2">Tổng tiền: ${total}</Text>
      </View>

      <ThemedButton
        title="Về trang chủ"
        onPress={() => {
          // clearCart() nên được gọi trước khi điều hướng
          router.replace("/(tabs)");
        }}
      />
    </View>
  );
}
```

### Cập nhật `checkout.tsx` (luồng submit)

```tsx
const onSubmit = (formData: CheckoutFormData) => {
  const orderId = Date.now().toString().slice(-6);
  const total = getTotalPrice();

  clearCart();

  router.push({
    pathname: "/order-success",
    params: {
      orderId,
      fullName: formData.fullName,
      address: formData.address,
      total,
    },
  });
};
```

---

## 3. Responsive Design (Phone & Tablet)

### File: `src/shared/hooks/useResponsive.ts`

```tsx
import { useWindowDimensions } from "react-native";

const TABLET_BREAKPOINT = 768;

export const useResponsive = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;

  return {
    isTablet,
    numColumns: isTablet ? 4 : 2,
  };
};
```

### Áp dụng vào `ProductGrid.tsx`

```tsx
import { FlatList } from "react-native";
import { useResponsive } from "../../../shared/hooks/useResponsive";
import { ProductCard } from "./ProductCard";

export const ProductGrid = ({ products }) => {
  const { numColumns } = useResponsive();

  return (
    <FlatList
      key={numColumns} // Force re-render khi đổi orientation
      data={products}
      numColumns={numColumns}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ProductCard product={item} />}
      contentContainerClassName="p-2"
    />
  );
};
```

> Khuyến nghị: dùng `numColumns` thay vì NativeWind breakpoint class (`md:grid-cols-4`) vì `FlatList`/`numColumns` là cơ chế layout gốc của React Native, đáng tin cậy hơn class CSS-like cho danh sách dài.

---

## 4. Tìm kiếm theo Danh mục (Category Filter)

### File: `src/features/products/hooks/useCategories.ts`

```tsx
import { useEffect, useState } from "react";
import { apiClient } from "../../../shared/api/apiClient";

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/products/categories")
      .then((res) => setCategories(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  return { categories, isLoading };
};
```

### Cập nhật `search.tsx`

Kết hợp ô tìm kiếm (debounce theo tên) với một hàng chip filter theo category lấy từ `useCategories()`, lọc kết quả `useProducts()` ở client-side theo cả `title` và `category`.

---

## 5. Skeleton Loading & Error Handling

### File: `src/shared/ui/SkeletonCard.tsx`

```tsx
import { View } from "react-native";

export const SkeletonCard = () => (
  <View className="w-1/2 p-2">
    <View className="h-32 bg-gray-200 rounded-md mb-2" />
    <View className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
    <View className="h-4 bg-gray-200 rounded w-1/2" />
  </View>
);
```

### File: `src/shared/ui/ErrorView.tsx`

```tsx
import { View, Text } from "react-native";
import { ThemedButton } from "./ThemedButton";

export const ErrorView = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <View className="flex-1 items-center justify-center p-6">
    <Text className="text-gray-500 mb-4 text-center">
      {message || "Đã có lỗi xảy ra"}
    </Text>
    <ThemedButton title="Thử lại" onPress={onRetry} />
  </View>
);
```

### Áp dụng trong `useProducts.ts` (mẫu pattern loading/error)

```tsx
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(() => {
    setIsLoading(true);
    setError(null);
    apiClient
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Không thể tải danh sách sản phẩm"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts };
};
```

Tại `index.tsx`: nếu `isLoading` → render danh sách `<SkeletonCard />` lặp lại; nếu `error` → render `<ErrorView message={error} onRetry={refetch} />`.

---

## 6. Sửa lỗi nhỏ

### `.env` — sai cú pháp (dính link Markdown)

```diff
- EXPO_PUBLIC_API_URL=[https://fakestoreapi.com](https://fakestoreapi.com)
+ EXPO_PUBLIC_API_URL=https://fakestoreapi.com
```

### `checkoutSchema.ts` — regex số điện thoại dư ký tự `|`

```diff
  phone: z
    .string()
-   .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
+   .regex(/(84|0[35789])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
```

---

## ✅ Checklist Hoàn Thiện

| Hạng mục                                        | Trạng thái trong bản gốc  | Sau Addendum                                    |
| ----------------------------------------------- | ------------------------- | ----------------------------------------------- |
| Danh sách sản phẩm (ảnh, tên, giá, Add to Cart) | ✅ Có                     | ✅                                              |
| Giỏ hàng (CRUD số lượng, xóa, tổng tiền)        | ✅ Có                     | ✅                                              |
| Form thanh toán + validate                      | ✅ Có                     | ✅                                              |
| Thông báo thành công sau checkout               | ❌ Thiếu                  | ✅ Đã bổ sung (`order-success.tsx`)             |
| Loading/Error khi gọi API                       | ⚠️ Chỉ có Spinner         | ✅ Thêm Skeleton + ErrorView                    |
| Xác thực người dùng (Fake Auth)                 | ⚠️ Chỉ có store, thiếu UI | ✅ Đã bổ sung `(auth)` route group              |
| Responsive (phone & tablet)                     | ❌ Chưa đề cập            | ✅ Đã bổ sung `useResponsive`                   |
| Tìm kiếm theo tên/danh mục                      | ⚠️ Tách rời 2 màn hình    | ✅ Đã hợp nhất filter category vào `search.tsx` |
| Trang chi tiết sản phẩm                         | ✅ Có                     | ✅                                              |
| Lỗi cú pháp `.env`, regex                       | ❌ Có lỗi                 | ✅ Đã sửa                                       |

---

_File này nên được dùng song song với `STRUCTURE.md` gốc khi scaffold project — các phần không nhắc tới trong addendum này giữ nguyên theo bản gốc._
