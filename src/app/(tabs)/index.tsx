import { Link } from "expo-router";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductGrid } from "../../features/products/components/ProductGrid";
import { useProducts } from "../../features/products/hooks/useProducts";
import { useThemeStore } from "../../features/theme/store/useThemeStore";
import { ErrorView } from "../../shared/ui/ErrorView";
import { SkeletonCard } from "../../shared/ui/SkeletonCard";
import { ThemedIcon } from "../../shared/ui/ThemedIcon";

export default function HomeScreen() {
  const { primaryColor } = useThemeStore();
  const { products, isLoading, error, refetch } = useProducts();

  // Create loading placeholder array
  const skeletons = Array.from({ length: 6 }, (_, i) => i);

  const Header = () => (
    <View className="px-4 pb-3 pt-2 bg-white border-b border-gray-100 flex-row items-center justify-between">
      {/* Search Input Mock Trigger */}
      <Link href="/search" asChild>
        <TouchableOpacity 
          className="flex-1 flex-row items-center bg-gray-100/80 px-3 py-2 rounded-full mr-3"
          activeOpacity={0.9}
        >
          <ThemedIcon name="search-outline" size={18} useThemeColor={false} color="#8E8E93" />
          <Text className="text-gray-400 text-sm ml-2">Tìm kiếm sản phẩm trên Shopoo...</Text>
        </TouchableOpacity>
      </Link>

      {/* Settings / Theme Trigger */}
      <Link href="/settings" asChild>
        <TouchableOpacity 
          style={{ backgroundColor: `${primaryColor}15` }}
          className="w-10 h-10 rounded-full items-center justify-center"
          activeOpacity={0.7}
        >
          <ThemedIcon name="color-palette-outline" size={20} useThemeColor={true} />
        </TouchableOpacity>
      </Link>
    </View>
  );

  const HomeBanner = () => (
    <View className="px-4 py-3 bg-white">
      <View 
        style={{ backgroundColor: primaryColor }}
        className="rounded-2xl overflow-hidden p-5 flex-row justify-between items-center shadow-sm relative"
      >
        {/* Glow Effects */}
        <View className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
        <View className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full" />

        <View className="flex-1 pr-4">
          <Text className="text-white font-extrabold text-lg mb-1 leading-5">Siêu Hội Mua Sắm</Text>
          <Text className="text-white/95 text-xs font-semibold mb-3">Đồng giá từ $9.99 - Freeship Toàn Quốc</Text>
          <View className="bg-white/30 self-start px-3 py-1 rounded-full">
            <Text className="text-white font-bold text-[9px] uppercase tracking-wider">Mua Ngay</Text>
          </View>
        </View>

        <View className="w-24 h-20 items-center justify-center">
          <ThemedIcon name="gift" size={70} useThemeColor={false} color="rgba(255,255,255,0.9)" />
        </View>
      </View>
    </View>
  );

  const SectionTitle = () => (
    <View className="px-4 py-2 bg-white flex-row items-center">
      <View style={{ backgroundColor: primaryColor }} className="w-1.5 h-4 rounded-full mr-2" />
      <Text className="text-gray-800 font-extrabold text-base">GỢI Ý HÔM NAY</Text>
    </View>
  );

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>
        <Header />
        <ErrorView message={error} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>
      {/* Header Search & Theme Bar */}
      <Header />

      {isLoading ? (
        <View className="flex-1 bg-white px-2">
          {/* Mock banner skeleton */}
          <View className="h-32 bg-gray-100 rounded-2xl mx-2 my-3" />
          {/* Skeleton Grid */}
          <View className="flex-row flex-wrap justify-between">
            {skeletons.map((i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        </View>
      ) : (
        <ProductGrid
          products={products}
          onRefresh={refetch}
          refreshing={isLoading}
          ListHeaderComponent={
            <>
              <HomeBanner />
              <SectionTitle />
            </>
          }
          ListEmptyComponent={
            <View className="flex-1 py-20 items-center justify-center">
              <Text className="text-gray-400 text-sm">Không tìm thấy sản phẩm nào</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
