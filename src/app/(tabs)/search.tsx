import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductGrid } from "../../features/products/components/ProductGrid";
import { useCategories } from "../../features/products/hooks/useCategories";
import { useProducts } from "../../features/products/hooks/useProducts";
import { useThemeStore } from "../../features/theme/store/useThemeStore";
import { useDebounce } from "../../shared/hooks/useDebounce";
import { ErrorView } from "../../shared/ui/ErrorView";
import { SkeletonCard } from "../../shared/ui/SkeletonCard";
import { ThemedIcon } from "../../shared/ui/ThemedIcon";

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { primaryColor } = useThemeStore();

  // States
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Hooks
  const { products, isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts();

  const debouncedSearch = useDebounce(searchText, 400);

  // Set initial category from query parameters if exists
  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category as string);
    }
  }, [params.category]);

  // Client-side filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        product.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearch.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, debouncedSearch]);

  const skeletons = Array.from({ length: 6 }, (_, i) => i);

  const handleRetry = () => {
    refetchProducts();
  };

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
      <View className="py-4 ml-2">
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
                  style={{ backgroundColor: 'white'}}
                  className="w-14 h-14 rounded-full items-center justify-center mb-2 shadow-sm"
                >
                  <ThemedIcon
                    name={details.icon}
                    size={26}
                    useThemeColor={true}
                  />
                </View>
                <Text
                  className="text-white text-md font-bold text-center capitalize"
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
     
     
      {/* Search Header Bar */}
      <View
        style={{ backgroundColor: primaryColor }}
        className="h-60 flex justify-end mb-1">
        <View className="absolute -top-14 -right-10 w-48 h-48 bg-white/20 rounded-full" />
        <View className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/30 rounded-full " />

        <View className="px-4 py-3 flex-row items-center">
          <View className="flex-1 flex-row items-center bg-gray-100 px-3 py-2 rounded-full">
            <ThemedIcon name="search-outline" size={24} useThemeColor={true} />
            <TextInput
              className="flex-1 py-1 px-2 text-gray-800 text-xl"
              placeholder="Tìm theo tên sản phẩm..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={!params.category}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")} className="p-1">
                <ThemedIcon name="close-circle" size={16} useThemeColor={false} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>


        {/* Categories Chips Bar */}
        <Categories />
      </View>

      {/* Results Section */}
      {productsError ? (
        <ErrorView message={productsError} onRetry={handleRetry} />
      ) : productsLoading ? (
        <View className="flex-1 bg-white px-2 mt-2">
          <View className="flex-row flex-wrap justify-between">
            {skeletons.map((i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        </View>
      ) : (
        <View className="flex-1 bg-gray-50">
          {/* Results Info Count */}


          <ProductGrid
            products={filteredProducts}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20 px-6 mt-12 rounded-2xl mx-4 shadow-sm">
                <View
                  style={{ backgroundColor: `${primaryColor}10` }}
                  className="p-4 rounded-full mb-4"
                >
                  <ThemedIcon name="search-outline" size={32} useThemeColor={true} />
                </View>
                <Text className="text-gray-800 font-bold text-base mb-1">
                  Không tìm thấy kết quả
                </Text>
                <Text className="text-gray-400 text-xs text-center">
                  Vui lòng thử tìm kiếm với các từ khóa khác hoặc thay đổi bộ lọc danh mục.
                </Text>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}
