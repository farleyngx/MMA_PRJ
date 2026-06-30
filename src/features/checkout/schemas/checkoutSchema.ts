import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  address: z
    .string()
    .min(10, "Vui lòng nhập địa chỉ giao hàng đầy đủ (Tối thiểu 10 ký tự)"),
  phone: z
    .string()
    .regex(/(84|0[35789])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
