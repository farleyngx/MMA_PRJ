import React from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useCategories } from "../../features/products/hooks/useCategories";
import { useThemeStore } from "../../features/theme/store/useThemeStore";
import { LoadingSpinner } from "../../shared/ui/LoadingSpinner";
import { ErrorView } from "../../shared/ui/ErrorView";
import { ThemedIcon } from "../../shared/ui/ThemedIcon";

export default function MallScreen() {
  const router = useRouter();
  const { primaryColor } = useThemeStore();
  const { categories, isLoading, error, refetch } = useCategories();

  const getCategoryDetails = (category: string) => {
    switch (category) {
      case "electronics":
        return {
          title: "Thiết bị Điện tử",
          icon: "laptop-outline",
          desc: "Điện thoại, Laptop, Phụ kiện",
          bg: "#EFF6FF",
          color: "#3B82F6",
        };
      case "jewelery":
        return {
          title: "Trang sức Cao cấp",
          icon: "sparkles-outline",
          desc: "Nhẫn, Vòng cổ, Kim cương",
          bg: "#FFF1F2",
          color: "#EC4899",
        };
      case "men's clothing":
        return {
          title: "Thời trang Nam",
          icon: "shirt-outline",
          desc: "Áo thun, Sơ mi, Quần tây",
          bg: "#ECFDF5",
          color: "#10B981",
        };
      case "women's clothing":
        return {
          title: "Thời trang Nữ",
          icon: "ribbon-outline",
          desc: "Đầm váy, Trang phục công sở",
          bg: "#FAF5FF",
          color: "#A855F7",
        };
      default:
        return {
          title: category,
          icon: "cube-outline",
          desc: "Khám phá các sản phẩm",
          bg: "#F9FAFB",
          color: "#6B7280",
        };
    }
  };

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: "/search",
      params: { category: categoryName },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-100 items-center justify-between flex-row">
        <Text className="text-xl font-bold text-gray-800">Danh mục Shopoo</Text>
        <TouchableOpacity
          onPress={() => router.push("/search")}
          className="p-1"
        >
          <ThemedIcon name="search" size={20} useThemeColor={true} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorView message={error} onRetry={refetch} />
      ) : (
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <Text className="text-gray-400 font-semibold text-xs mb-3 uppercase tracking-wider">
            Phân loại hàng hóa
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => {
              const details = getCategoryDetails(category);
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => handleCategoryPress(category)}
                  style={{ width: "48%" }}
                  className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm flex-col justify-between"
                  activeOpacity={0.7}
                >
                  <View 
                    style={{ backgroundColor: details.bg }}
                    className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                  >
                    <ThemedIcon 
                      name={details.icon as any} 
                      size={24} 
                      useThemeColor={false} 
                      color={details.color} 
                    />
                  </View>
                  <View>
                    <Text className="text-gray-800 font-bold text-sm mb-1 leading-4 capitalize">
                      {details.title}
                    </Text>
                    <Text className="text-gray-400 text-[10px] leading-3">
                      {details.desc}
                    </Text>
                  </View>
                  
                  {/* Arrow Indicator */}
                  <View className="flex-row justify-end mt-4">
                    <View 
                      style={{ backgroundColor: `${primaryColor}10` }}
                      className="w-6 h-6 rounded-full items-center justify-center"
                    >
                      <ThemedIcon name="chevron-forward" size={12} useThemeColor={true} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick Info Promo Card */}
          <View className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5 mt-4 flex-row items-center justify-between mb-8">
            <View className="flex-1 pr-3">
              <Text className="text-orange-800 font-bold text-sm mb-1">Cửa hàng Mall Chính Hãng</Text>
              <Text className="text-orange-600 text-xs leading-4">
                Cam kết hàng chính hãng 100%, bảo hành đổi trả trong vòng 7 ngày thoải mái.
              </Text>
            </View>
            <ThemedIcon name="ribbon" size={40} useThemeColor={false} color="#F97316" />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
