import React from "react";
import { View, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 24) / 2; // 2 columns spacing

export const SkeletonCard = () => (
  <View style={{ width: cardWidth }} className="p-2">
    <View className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm p-3">
      {/* Product Image Skeleton */}
      <View className="w-full h-40 bg-gray-200 rounded-lg animate-pulse mb-3" />
      {/* Product Title Skeleton */}
      <View className="h-4 bg-gray-200 rounded-md w-11/12 mb-2 animate-pulse" />
      <View className="h-4 bg-gray-200 rounded-md w-2/3 mb-4 animate-pulse" />
      {/* Bottom Skeleton */}
      <View className="flex-row justify-between items-center mt-auto">
        <View className="h-5 bg-gray-200 rounded-md w-1/2 animate-pulse" />
        <View className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
      </View>
    </View>
  </View>
);
