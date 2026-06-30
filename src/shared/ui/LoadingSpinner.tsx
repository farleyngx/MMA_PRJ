import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useThemeStore } from "../../features/theme/store/useThemeStore";

export const LoadingSpinner = () => {
  const { primaryColor } = useThemeStore();

  return (
    <View className="flex-1 items-center justify-center py-10 bg-transparent">
      <ActivityIndicator size="large" color={primaryColor} />
    </View>
  );
};
