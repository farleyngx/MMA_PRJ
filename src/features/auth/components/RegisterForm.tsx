import React from "react";
import { View, Text, TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "../schemas/authSchema";
import { ThemedButton } from "../../../shared/ui/ThemedButton";
import { ThemedIcon } from "../../../shared/ui/ThemedIcon";

interface RegisterFormProps {
  onSubmit: (data: RegisterInput) => void;
  loading: boolean;
  errorMessage: string | null;
}

export const RegisterForm = ({ onSubmit, loading, errorMessage }: RegisterFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <View className="w-full">
      {errorMessage && (
        <View className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4 flex-row items-center">
          <ThemedIcon name="alert-circle" size={20} useThemeColor={false} color="#EF4444" />
          <Text className="text-red-600 font-semibold ml-2 flex-1 text-xs">
            {errorMessage}
          </Text>
        </View>
      )}

      {/* Email Field */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold text-xs mb-1">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View 
              className={`flex-row items-center border rounded-xl px-3 bg-gray-50/50 ${
                errors.email ? "border-red-500" : "border-gray-200"
              }`}
            >
              <ThemedIcon name="mail-outline" size={18} useThemeColor={false} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3 px-2 text-gray-800 text-sm"
                placeholder="Ví dụ: hotro@shopoo.vn"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            </View>
          )}
        />
        {errors.email && (
          <Text className="text-red-500 text-[10px] mt-1 font-medium">
            {errors.email.message}
          </Text>
        )}
      </View>

      {/* Username Field */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold text-xs mb-1">Tên đăng nhập</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <View 
              className={`flex-row items-center border rounded-xl px-3 bg-gray-50/50 ${
                errors.username ? "border-red-500" : "border-gray-200"
              }`}
            >
              <ThemedIcon name="person-outline" size={18} useThemeColor={false} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3 px-2 text-gray-800 text-sm"
                placeholder="Từ 3 ký tự trở lên"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            </View>
          )}
        />
        {errors.username && (
          <Text className="text-red-500 text-[10px] mt-1 font-medium">
            {errors.username.message}
          </Text>
        )}
      </View>

      {/* Password Field */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold text-xs mb-1">Mật khẩu</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View 
              className={`flex-row items-center border rounded-xl px-3 bg-gray-50/50 ${
                errors.password ? "border-red-500" : "border-gray-200"
              }`}
            >
              <ThemedIcon name="lock-closed-outline" size={18} useThemeColor={false} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3 px-2 text-gray-800 text-sm"
                placeholder="Nhập ít nhất 6 ký tự"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            </View>
          )}
        />
        {errors.password && (
          <Text className="text-red-500 text-[10px] mt-1 font-medium">
            {errors.password.message}
          </Text>
        )}
      </View>

      {/* Confirm Password Field */}
      <View className="mb-6">
        <Text className="text-gray-700 font-semibold text-xs mb-1">Xác nhận mật khẩu</Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <View 
              className={`flex-row items-center border rounded-xl px-3 bg-gray-50/50 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-200"
              }`}
            >
              <ThemedIcon name="lock-closed-outline" size={18} useThemeColor={false} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3 px-2 text-gray-800 text-sm"
                placeholder="Nhập lại mật khẩu phía trên"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            </View>
          )}
        />
        {errors.confirmPassword && (
          <Text className="text-red-500 text-[10px] mt-1 font-medium">
            {errors.confirmPassword.message}
          </Text>
        )}
      </View>

      {/* Submit Button */}
      <ThemedButton
        title="Đăng Ký"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        className="w-full mt-2"
      />
    </View>
  );
};
