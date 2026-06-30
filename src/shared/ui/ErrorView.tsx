import React from "react";
import { View, Text } from "react-native";
import { ThemedButton } from "./ThemedButton";
import { ThemedIcon } from "./ThemedIcon";

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorView = ({ message, onRetry }: ErrorViewProps) => (
  <View className="flex-1 items-center justify-center p-6 bg-white">
    <View className="bg-red-50 p-4 rounded-full mb-4">
      <ThemedIcon name="alert-circle-outline" size={48} useThemeColor={true} />
    </View>
    <Text className="text-gray-800 text-lg font-semibold mb-2 text-center">
      Tải dữ liệu thất bại
    </Text>
    <Text className="text-gray-500 mb-6 text-center text-sm px-4">
      {message || "Đã có lỗi xảy ra. Vui lòng kiểm tra lại kết nối mạng."}
    </Text>
    {onRetry && (
      <ThemedButton title="Thử lại" onPress={onRetry} variant="filled" className="px-8" />
    )}
  </View>
);
