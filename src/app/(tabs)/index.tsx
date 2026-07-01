import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import React from "react";
import { Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductGrid } from "../../features/products/components/ProductGrid";
import { useCategories } from "../../features/products/hooks/useCategories";
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
    <View className="px-4 pt-2 flex-row items-center justify-between">

      {/* Logo */}
      <Text className="text-white text-5xl mx-3 font-bold">Shopoo</Text>

      {/* Settings / Theme Trigger */}
      <Link href="/settings" asChild>
        <TouchableOpacity
          className="w-16 h-16 rounded-md items-center justify-center"
          activeOpacity={0.7}
        >
          <ThemedIcon name="options-outline" size={30} color="white" useThemeColor={false} />
        </TouchableOpacity>
      </Link>
    </View>
  );

  const HomeBanner = () => (
    <View className="px-4 py-3">
      <View
        style={{ backgroundColor: primaryColor }}
        className=" rounded-2xl overflow-hidden p-5 flex-row justify-between items-center shadow-sm relative"
      >
        {/* Glow Effects */}

        <View className="absolute -top-14 -right-10 w-48 h-48 bg-white/20 rounded-full" />
        <View className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/30 rounded-full " />

        <View className="h-[150px] flex-1 pr-4 ">
          <Text className="text-white font-extrabold text-4xl mb-1 ">Siêu Hội Mua Sắm</Text>
          <Text className="text-white/95 text-lg font-semibold mb-3">Đồng giá từ $9.99 - Freeship Toàn Quốc</Text>

          <View className="bg-white/30 self-start py-3 px-5 rounded-full">
            <Text className="text-white font-bold text-md uppercase tracking-wider">Mua Ngay</Text>
          </View>
        </View>

        <View className="w-56 h-56 items-center justify-end relative">
          <Image
            source={require("../../../assets/images/model.png")}
            style={{ width: '100%', height: '100%', position: 'absolute', bottom: -20, right: -19, zIndex: 10 }}
            contentFit="contain"
          />
        </View>

      </View>
    </View>
  );

  const SectionTitle = () => (
    <View className="px-4 py-2 flex-row items-center">
      <View style={{ backgroundColor: primaryColor }} className="w-1.5 h-5 rounded-full mr-2" />
      <Text className="text-gray-800 font-extrabold text-2xl">GỢI Ý HÔM NAY</Text>
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

  // categories--------------------------------------------------------
  const Categories = () => {
    const { categories, isLoading: categoriesLoading } = useCategories();

    // Map category to icon and title (Vietnamese translation)
    const getCategoryDetails = (cat: string) => {
      let icon: React.ComponentProps<typeof Ionicons>["name"] = "cube-outline";
      let title = cat;
      let bgColor = "#F3F4F6";
      let iconColor = "#4B5563";

      switch (cat) {
        case "electronics":
          title = "Điện tử";
          icon = "laptop-outline";
          break;
        case "jewelery":
          title = "Trang sức";
          icon = "sparkles-outline";
          break;
        case "men's clothing":
          title = "Đồ Nam";
          icon = "shirt-outline";
          break;
        case "women's clothing":
          title = "Đồ Nữ";
          icon = "woman-outline";
          break;
      }

      return { title, icon, bgColor, iconColor };
    };

    if (categoriesLoading) {
      return (
        <View className="py-4 px-4 flex-row justify-between">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="items-center w-20">
              <View className="w-14 h-14 rounded-2xl mb-2" />
              <View className="h-3 w-14 rounded" />
            </View>
          ))}
        </View>
      );
    }

    return (
      <View className="py-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {categories.map((cat) => {
            const details = getCategoryDetails(cat);
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => {
                  router.push({
                    pathname: "/(tabs)/search",
                    params: { category: cat },
                  });
                }}
                className="items-center mr-8 w-20 flex-col"
                activeOpacity={0.7}
              >
                <View
                  style={{ backgroundColor: primaryColor }}
                  className="w-14 h-14 rounded-full items-center justify-center mb-2 shadow-sm"
                >
                  <ThemedIcon
                    name={details.icon}
                    size={26}
                    useThemeColor={false}
                    color={"white"}
                  />
                </View>
                <Text
                  className="text-gray-700 text-md font-bold text-center capitalize"
                  numberOfLines={2}
                >
                  {details.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };


  return (
    <SafeAreaView
      edges={['right', 'left', 'bottom']}
      className="flex-1"
      style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>

      {/* Header Search & Theme Bar */}
      <View
        style={{ backgroundColor: primaryColor }}
        className="h-32 flex justify-end mb-1">
        <View className="absolute -top-14 -right-10 w-48 h-48 bg-white/20 rounded-full" />
        <View className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/30 rounded-full " />
        <Header />
      </View>
      {
        isLoading ? (
          <View className="flex-1 px-2">
            {/* Mock banner skeleton */}
            <View className="h-32 rounded-2xl mx-2 my-3" />
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
                <Categories />
                <SectionTitle />
              </>
            }
            ListEmptyComponent={
              <View className="flex-1 py-20 items-center justify-center">
                <Text className="text-gray-400 text-sm">Không tìm thấy sản phẩm nào</Text>
              </View>
            }
          />
        )
      }
    </SafeAreaView >
  );
}
