import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useProduct } from "../../features/products/hooks/useProduct";
import { useThemeStore } from "../../features/theme/store/useThemeStore";
import { useCartStore } from "../../features/cart/store/useCartStore";
import { ThemedButton } from "../../shared/ui/ThemedButton";
import { ThemedIcon } from "../../shared/ui/ThemedIcon";
import { LoadingSpinner } from "../../shared/ui/LoadingSpinner";
import { ErrorView } from "../../shared/ui/ErrorView";

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { primaryColor } = useThemeStore();
  const { addToCart, items } = useCartStore();

  const { product, isLoading, error, refetch } = useProduct(id as string);

  // Compute total cart quantity for badge count
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
    Alert.alert(
      "Đã thêm vào giỏ hàng",
      `Sản phẩm "${product.title}" đã được thêm vào giỏ hàng thành công!`,
      [
        { text: "Xem giỏ hàng", onPress: () => router.push("/(tabs)/cart") },
        { text: "Tiếp tục mua sắm", style: "cancel" },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>
        {/* Mock Header */}
        <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-1 -ml-1 mr-2">
            <ThemedIcon name="arrow-back" size={24} useThemeColor={false} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Đang tải...</Text>
        </View>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>
        <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-1 -ml-1 mr-2">
            <ThemedIcon name="arrow-back" size={24} useThemeColor={false} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Lỗi</Text>
        </View>
        <ErrorView message={error || "Không tìm thấy sản phẩm"} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-1 -ml-1 mr-2"
        >
          <ThemedIcon name="arrow-back" size={24} useThemeColor={false} color="#374151" />
        </TouchableOpacity>
        
        <Text className="text-base font-bold text-gray-800 flex-1 text-center" numberOfLines={1}>
          Chi tiết sản phẩm
        </Text>

        <TouchableOpacity 
          onPress={() => router.push("/(tabs)/cart")}
          className="p-1 relative ml-2"
        >
          <ThemedIcon name="cart-outline" size={24} useThemeColor={false} color="#374151" />
          {cartCount > 0 && (
            <View 
              style={{ backgroundColor: primaryColor }}
              className="absolute -top-1 -right-1.5 min-w-[16px] h-4 rounded-full items-center justify-center px-1"
            >
              <Text className="text-white text-[9px] font-bold">{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Product Image Panel */}
        <View className="bg-white p-6 items-center justify-center border-b border-gray-100">
          <Image
            source={{ uri: product.image }}
            contentFit="contain"
            transition={300}
            className="w-full h-80"
          />
        </View>

        {/* Content Panel */}
        <View className="bg-white px-4 py-5 mb-3 border-b border-gray-100">
          {/* Category Tag */}
          <View className="bg-gray-100 self-start px-2.5 py-0.5 rounded-full mb-3">
            <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider capitalize">
              {product.category}
            </Text>
          </View>

          {/* Product Title */}
          <Text className="text-gray-800 font-extrabold text-lg leading-6 mb-3">
            {product.title}
          </Text>

          {/* Price and Rating Row */}
          <View className="flex-row items-center justify-between mt-1">
            <Text 
              className="font-extrabold text-2xl" 
              style={{ color: primaryColor }}
            >
              ${product.price.toFixed(2)}
            </Text>

            {/* Ratings summary */}
            <View className="flex-row items-center bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
              <View className="flex-row mr-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <ThemedIcon
                    key={star}
                    name={star <= Math.round(product.rating?.rate || 0) ? "star" : "star-outline"}
                    size={12}
                    useThemeColor={star <= Math.round(product.rating?.rate || 0)}
                    color="#D1D1D6"
                  />
                ))}
              </View>
              <Text className="text-xs font-bold text-gray-700 mr-1">
                {product.rating?.rate || 0}
              </Text>
              <Text className="text-[10px] text-gray-400">
                ({product.rating?.count || 0} đánh giá)
              </Text>
            </View>
          </View>
        </View>

        {/* Description Panel */}
        <View className="bg-white px-4 py-5 border-b border-gray-100 mb-10">
          <Text className="text-gray-800 font-extrabold text-sm mb-3">Mô tả sản phẩm</Text>
          <Text className="text-gray-500 text-sm leading-6">
            {product.description}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions Footer */}
      <View className="bg-white border-t border-gray-100 px-6 py-4 flex-row items-center pb-6">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/cart")}
          className="border border-gray-200 w-12 h-12 rounded-xl items-center justify-center mr-4"
          activeOpacity={0.7}
        >
          <ThemedIcon name="chatbox-ellipses-outline" size={22} useThemeColor={false} color="#6B7280" />
        </TouchableOpacity>

        <ThemedButton 
          title="Thêm vào giỏ hàng" 
          onPress={handleAddToCart} 
          className="flex-1"
        />
      </View>
    </SafeAreaView>
  );
}
