import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useProducts } from "../features/products/hooks/useProducts";
import { useCategories } from "../features/products/hooks/useCategories";
import { useThemeStore } from "../features/theme/store/useThemeStore";
import { useDebounce } from "../shared/hooks/useDebounce";
import { ProductGrid } from "../features/products/components/ProductGrid";
import { SkeletonCard } from "../shared/ui/SkeletonCard";
import { ErrorView } from "../shared/ui/ErrorView";
import { ThemedIcon } from "../shared/ui/ThemedIcon";

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { primaryColor } = useThemeStore();
  
  // States
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Hooks
  const { products, isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();
  
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

  const getCategoryDisplay = (cat: string) => {
    if (cat === "all") return "Tất cả";
    switch (cat) {
      case "electronics": return "Điện tử";
      case "jewelery": return "Trang sức";
      case "men's clothing": return "Đồ Nam";
      case "women's clothing": return "Đồ Nữ";
      default: return cat;
    }
  };

  const handleRetry = () => {
    refetchProducts();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>
      {/* Search Header Bar */}
      <View className="px-4 py-3 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-1 -ml-1 mr-2"
        >
          <ThemedIcon name="arrow-back" size={24} useThemeColor={false} color="#374151" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-gray-100 px-3 py-2 rounded-full">
          <ThemedIcon name="search-outline" size={16} useThemeColor={false} color="#8E8E93" />
          <TextInput
            className="flex-1 py-1 px-2 text-gray-800 text-sm"
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
      <View className="border-b border-gray-50 bg-white py-3">
        {categoriesLoading ? (
          <View className="h-8 flex-row px-4 items-center">
            <View className="h-6 w-16 bg-gray-100 rounded-full mr-2" />
            <View className="h-6 w-20 bg-gray-100 rounded-full mr-2" />
            <View className="h-6 w-16 bg-gray-100 rounded-full" />
          </View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {/* "All" Chip */}
            <TouchableOpacity
              onPress={() => setSelectedCategory("all")}
              style={{
                backgroundColor: selectedCategory === "all" ? primaryColor : "#F3F4F6",
              }}
              className="px-4 py-1.5 rounded-full mr-2.5 shadow-sm"
            >
              <Text 
                className={`text-xs font-bold ${
                  selectedCategory === "all" ? "text-white" : "text-gray-500"
                }`}
              >
                Tất cả
              </Text>
            </TouchableOpacity>

            {/* Category Chips */}
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={{
                    backgroundColor: isSelected ? primaryColor : "#F3F4F6",
                  }}
                  className="px-4 py-1.5 rounded-full mr-2.5 shadow-sm"
                >
                  <Text 
                    className={`text-xs font-bold capitalize ${
                      isSelected ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {getCategoryDisplay(cat)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
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
          <View className="px-4 py-2 bg-white border-b border-gray-100">
            <Text className="text-gray-400 text-[11px] font-semibold">
              ĐÃ TÌM THẤY {filteredProducts.length} SẢN PHẨM
            </Text>
          </View>
          
          <ProductGrid
            products={filteredProducts}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20 px-6 bg-white mt-12 rounded-2xl mx-4 shadow-sm">
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
