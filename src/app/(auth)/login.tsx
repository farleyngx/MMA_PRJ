import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { router, Link } from "expo-router";
import { apiClient } from "../../shared/api/apiClient";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { useThemeStore } from "../../features/theme/store/useThemeStore";
import { LoginForm } from "../../features/auth/components/LoginForm";
import { LoginInput } from "../../features/auth/schemas/authSchema";
import { ThemedIcon } from "../../shared/ui/ThemedIcon";

export default function LoginScreen() {
  const { primaryColor } = useThemeStore();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await apiClient.post("/auth/login", {
        username: data.username,
        password: data.password,
      });

      if (res.data && res.data.token) {
        login(res.data.token, {
          id: 1,
          username: data.username,
          email: `${data.username}@shopoo.fake`,
        });
        router.replace("/(tabs)");
      } else {
        setErrorMessage("Lỗi kết nối từ máy chủ. Thử lại sau.");
      }
    } catch (err: any) {
      console.error("Login API Error:", err.response?.data || err.message);
      setErrorMessage("Sai tài khoản hoặc mật khẩu. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        className="px-6"
      >
        <View className="items-center mb-8">
          {/* Logo Section */}
          <View 
            style={{ backgroundColor: `${primaryColor}15` }}
            className="w-20 h-20 rounded-3xl items-center justify-center mb-4"
          >
            <ThemedIcon name="bag-handle" size={44} useThemeColor={true} />
          </View>
          <Text className="text-3xl font-extrabold text-gray-800 tracking-tight">Shopoo</Text>
          <Text className="text-gray-400 text-xs mt-1">Đăng nhập tài khoản mua sắm</Text>
        </View>

        {/* Login Form */}
        <LoginForm onSubmit={onSubmit} loading={loading} errorMessage={errorMessage} />

        {/* Register Navigation Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-400 text-sm">Chưa có tài khoản? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="font-bold text-sm" style={{ color: primaryColor }}>
                Đăng ký ngay
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* FakeStoreAPI Credentials Info Card */}
        <View className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mt-8">
          <View className="flex-row items-center mb-2">
            <ThemedIcon name="information-circle-outline" size={16} useThemeColor={false} color="#F97316" />
            <Text className="text-orange-800 font-bold text-xs ml-1">Tài khoản thử nghiệm (FakeStoreAPI)</Text>
          </View>
          <Text className="text-orange-700 text-[11px] leading-4">
            Dự án sử dụng FakeStoreAPI. Bạn hãy sử dụng tài khoản mẫu sau để đăng nhập:
          </Text>
          <View className="flex-row mt-2 items-center">
            <Text className="text-[11px] font-semibold text-orange-900 w-24">Tên đăng nhập:</Text>
            <Text className="text-[11px] font-mono text-orange-950 font-bold select-all">mor_2314</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-[11px] font-semibold text-orange-900 w-24">Mật khẩu:</Text>
            <Text className="text-[11px] font-mono text-orange-950 font-bold select-all">83r5^_</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
