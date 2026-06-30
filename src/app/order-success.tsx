import React from "react";
import { View, Text, SafeAreaView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedButton } from "../shared/ui/ThemedButton";
import { ThemedIcon } from "../shared/ui/ThemedIcon";
import { useThemeStore } from "../features/theme/store/useThemeStore";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { primaryColor } = useThemeStore();
  const { orderId, fullName, address, total } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>
      <View className="flex-1 items-center justify-center p-6">
        {/* Animated Celebration Icon */}
        <View 
          style={{ backgroundColor: `${primaryColor}15` }}
          className="p-6 rounded-full mb-6"
        >
          <ThemedIcon name="checkmark-circle" size={80} useThemeColor={true} />
        </View>

        <Text className="text-2xl font-bold text-gray-800 text-center mb-1">
          🎉 Đặt hàng thành công!
        </Text>
        <Text className="text-gray-400 text-sm text-center mb-6">
          Cảm ơn bạn đã lựa chọn Shopoo làm nơi mua sắm.
        </Text>

        {/* Order Details Card */}
        <View className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-8">
          <Text className="text-gray-400 font-semibold text-[10px] uppercase mb-3 tracking-wider">
            Chi tiết đơn hàng
          </Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500 text-xs">Mã đơn hàng</Text>
            <Text className="text-gray-800 font-mono font-bold text-xs">#{orderId || "123456"}</Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500 text-xs">Người nhận</Text>
            <Text className="text-gray-800 font-semibold text-xs">{fullName || "Nguyễn Văn A"}</Text>
          </View>

          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-gray-500 text-xs w-24">Địa chỉ giao hàng</Text>
            <Text className="text-gray-800 font-semibold text-xs flex-1 text-right" numberOfLines={2}>
              {address || "Hà Nội, Việt Nam"}
            </Text>
          </View>

          <View className="h-[1px] bg-gray-200 my-2" />

          <View className="flex-row justify-between items-center mt-1">
            <Text className="text-gray-800 font-bold text-xs">Tổng thanh toán</Text>
            <Text 
              className="font-bold text-base" 
              style={{ color: primaryColor }}
            >
              ${total || "0.00"}
            </Text>
          </View>
        </View>

        {/* Return Button */}
        <ThemedButton
          title="Về Trang Chủ"
          onPress={() => {
            router.replace("/(tabs)");
          }}
          className="w-full"
        />
      </View>
    </SafeAreaView>
  );
}
