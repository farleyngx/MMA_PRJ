import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorPickerModal } from "../features/theme/components/ColorPickerModal";
import { useThemeStore } from "../features/theme/store/useThemeStore";
import { ThemedIcon } from "../shared/ui/ThemedIcon";

export default function SettingsScreen() {
  const router = useRouter();
  const { primaryColor } = useThemeStore();
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-1 -ml-1 mr-2"
        >
          <ThemedIcon name="arrow-back" size={24} useThemeColor={false} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Cài đặt giao diện</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Current Color Card */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm">
          <Text className="text-gray-400 font-semibold text-[10px] uppercase mb-3 tracking-wider">
            Màu chủ đạo hiện tại
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View 
                style={{ backgroundColor: primaryColor }}
                className="w-12 h-12 rounded-xl border border-black/5 shadow-inner mr-3"
              />
              <View>
                <Text className="text-gray-800 font-bold text-sm">Chủ đề ứng dụng</Text>
                <Text className="text-gray-400 font-mono text-xs uppercase">{primaryColor}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setPickerVisible(true)}
              style={{ backgroundColor: `${primaryColor}15` }}
              className="px-4 py-2 rounded-xl"
              activeOpacity={0.7}
            >
              <Text className="font-bold text-xs" style={{ color: primaryColor }}>
                Đổi màu
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Explain Card */}
        <View className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
          <View className="flex-row items-center mb-2">
            <ThemedIcon name="color-palette" size={20} useThemeColor={false} color="#3B82F6" />
            <Text className="text-blue-800 font-bold text-sm ml-1.5">Màu Sắc Động (Dynamic RGB)</Text>
          </View>
          <Text className="text-blue-700 text-xs leading-5">
            Khác với các ứng dụng có chủ đề cố định, Shopoo cho phép tùy chỉnh màu sắc thương hiệu theo ý thích của bạn. 
            Màu sắc được lưu trữ cục bộ và áp dụng lập tức trên toàn bộ hệ thống như nút bấm, biểu tượng, danh mục, và thông tin chi tiết mà không cần tải lại ứng dụng.
          </Text>
        </View>

        {/* Technical Stack Description Card */}
        <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-10">
          <Text className="text-gray-400 font-semibold text-[10px] uppercase mb-3 tracking-wider">
            Thông tin phát triển
          </Text>

          <View className="flex-row items-center justify-between py-2 border-b border-gray-50">
            <Text className="text-gray-500 text-xs font-semibold">Framework</Text>
            <Text className="text-gray-800 font-bold text-xs">Expo Router SDK 54</Text>
          </View>

          <View className="flex-row items-center justify-between py-2 border-b border-gray-50">
            <Text className="text-gray-500 text-xs font-semibold">Thư viện Style</Text>
            <Text className="text-gray-800 font-bold text-xs">NativeWind v4 + Inline</Text>
          </View>

          <View className="flex-row items-center justify-between py-2 border-b border-gray-50">
            <Text className="text-gray-500 text-xs font-semibold">State Manager</Text>
            <Text className="text-gray-800 font-bold text-xs">Zustand + AsyncStorage</Text>
          </View>

          <View className="flex-row items-center justify-between py-2">
            <Text className="text-gray-500 text-xs font-semibold">Network API</Text>
            <Text className="text-gray-800 font-bold text-xs">Axios (Mock Latency 800ms)</Text>
          </View>
        </View>
      </ScrollView>

      {/* Color Picker Modal */}
      <ColorPickerModal 
        visible={pickerVisible} 
        onClose={() => setPickerVisible(false)} 
      />
    </SafeAreaView>
  );
}
