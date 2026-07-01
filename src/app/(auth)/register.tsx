import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from "react-native";
import { router, Link } from "expo-router";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { useThemeStore } from "../../features/theme/store/useThemeStore";
import { RegisterForm } from "../../features/auth/components/RegisterForm";
import { RegisterInput } from "../../features/auth/schemas/authSchema";
import { ThemedIcon } from "../../shared/ui/ThemedIcon";

export default function RegisterScreen() {
  const { primaryColor } = useThemeStore();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      // Simulate client-side registration delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      Alert.alert(
        "Đăng ký thành công",
        "Tài khoản của bạn đã được đăng ký giả lập thành công trên thiết bị này!",
        [
          {
            text: "Bắt đầu mua sắm",
            onPress: () => {
              // Automatically log the simulated user in
              login("simulated-session-token", {
                id: Math.floor(Math.random() * 1000) + 10,
                username: data.username,
                email: data.email,
              });
              router.replace("/(tabs)");
            },
          },
        ]
      );
    } catch {
      setErrorMessage("Đã có lỗi xảy ra trong quá trình đăng ký.");
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
        className="px-6 py-6"
      >
        <View className="items-center mb-8">
          {/* Logo Section */}
          <View 
            style={{ backgroundColor: `${primaryColor}15` }}
            className="w-20 h-20 rounded-3xl items-center justify-center mb-4"
          >
            <ThemedIcon name="person-add" size={44} useThemeColor={true} />
          </View>
          <Text className="text-3xl font-extrabold text-gray-800 tracking-tight">Tạo Tài Khoản</Text>
          <Text className="text-gray-400 text-xs mt-1">Đăng ký thành viên mua sắm mới</Text>
        </View>

        {/* Register Form */}
        <RegisterForm onSubmit={onSubmit} loading={loading} errorMessage={errorMessage} />

        {/* Login Navigation Link */}
        <View className="flex-row justify-center mt-6 mb-8">
          <Text className="text-gray-400 text-sm">Đã có tài khoản? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="font-bold text-sm" style={{ color: primaryColor }}>
                Đăng nhập
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Notice Info Card */}
        <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
          <View className="flex-row items-center mb-1">
            <ThemedIcon name="information-circle-outline" size={16} useThemeColor={false} color="#3B82F6" />
            <Text className="text-blue-800 font-bold text-xs ml-1">Lưu ý về đăng ký giả lập</Text>
          </View>
          <Text className="text-blue-700 text-[11px] leading-4">
            Do FakeStoreAPI không hỗ trợ lưu tài khoản mới vĩnh viễn trên cơ sở dữ liệu thật, hệ thống sẽ thực hiện đăng ký giả lập ở phía máy khách và tự động tạo phiên đăng nhập để bạn trải nghiệm.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
