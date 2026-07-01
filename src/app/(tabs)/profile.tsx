import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { useThemeStore } from "../../features/theme/store/useThemeStore";
import { ThemedIcon } from "../../shared/ui/ThemedIcon";

export default function ProfileScreen() {
  const router = useRouter();
  const { primaryColor } = useThemeStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const ProfileOption = ({
    icon,
    title,
    subtitle,
    onPress
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white px-4 py-3.5 border-b border-gray-50 flex-row items-center justify-between"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        <View
          style={{ backgroundColor: `${primaryColor}20` }}
          className="w-12 h-12 rounded-xl items-center justify-center mr-3"
        >
          <ThemedIcon name={icon as any} size={24} useThemeColor={true} />
        </View>
        <View className="flex-1">
          <Text className="text-gray-800 font-bold text-xl">{title}</Text>
          {subtitle && (
            <Text className="text-gray-400 text-lg">{subtitle}</Text>
          )}
        </View>
      </View>
      <ThemedIcon name="chevron-forward" size={14} useThemeColor={false} color="#C7C7CC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      edges={['right', 'left', 'bottom']}
      className="flex-1"
      style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>


      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Search & Theme Bar */}


        {/* User Card Header */}
        <View
          style={{ backgroundColor: primaryColor }}
          className="h-56 px-6 pt-10 border-b border-gray-100 flex-row items-center">

          <View className="absolute -top-14 -right-10 w-48 h-48 bg-white/20 rounded-full" />
          <View className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/30 rounded-full " />

          {/* Avatar circle */}
          <View
            style={{ backgroundColor: primaryColor }}
            className="w-16 h-16 rounded-full items-center justify-center shadow-sm mr-4"
          >
            <Text className="text-white font-extrabold text-2xl uppercase">
              {user?.username ? user.username.charAt(0) : "U"}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-white font-extrabold text-3xl capitalize mb-0.5">
              {user?.username || "Người dùng"}
            </Text>
            <Text className="text-gray-100 text-xlfont-medium">
              {user?.email || "user@shopoo.vn"}
            </Text>
          </View>
        </View>


        {/* Account Settings List */}
        <View className="mt-4 border-t border-b border-gray-100">
          <Text className="px-4 py-2 text-gray-400 text-md font-semibold uppercase tracking-wider">
            Cài đặt tài khoản
          </Text>

          <ProfileOption
            icon="list-outline"
            title="Lịch sử đơn hàng"
            subtitle="Xem lại danh sách đơn hàng đã mua"
            onPress={() => { }}
          />

          <ProfileOption
            icon="location-outline"
            title="Địa chỉ của tôi"
            subtitle="Quản lý địa chỉ giao nhận hàng"
            onPress={() => { }}
          />
        </View>

        {/* Customization Settings List */}
        <View className="mt-4 border-t border-b border-gray-100">
          <Text className="px-4 py-2 text-gray-400 text-md font-semibold uppercase tracking-wider">
            Tùy biến ứng dụng
          </Text>

          <ProfileOption
            icon="color-palette-outline"
            title="Thay đổi màu chủ đạo"
            subtitle="Cài đặt Theme màu giao diện tùy biến"
            onPress={() => router.push("/settings")}
          />
        </View>

        {/* Support Section */}
        <View className="mt-4 border-t border-b border-gray-100">
          <Text className="px-4 py-2 text-gray-400 text-md font-semibold uppercase tracking-wider">
            Hỗ trợ & Thông tin
          </Text>

          <ProfileOption
            icon="help-circle-outline"
            title="Trung tâm hỗ trợ"
            onPress={() => { }}
          />

          <ProfileOption
            icon="document-text-outline"
            title="Điều khoản và Chính sách"
            onPress={() => { }}
          />
        </View>

        {/* Logout Action */}
        <View className="px-4 py-8 mb-10">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white border border-red-200 py-5 rounded-2xl items-center justify-center flex-row shadow-sm"
            activeOpacity={0.7}
          >
            <ThemedIcon name="log-out-outline" size={24} useThemeColor={false} color="#EF4444" />
            <Text className="text-red-500 font-bold text-xl ml-2">Đăng xuất tài khoản</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
