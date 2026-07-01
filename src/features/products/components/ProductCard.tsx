import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { ThemedIcon } from "../../../shared/ui/ThemedIcon";
import { Product } from "../../../types";
import { useThemeStore } from "../../theme/store/useThemeStore";

interface ProductCardProps {
  product: Product;
}

const { width } = Dimensions.get("window");

export const ProductCard = ({ product }: ProductCardProps) => {
  const { primaryColor } = useThemeStore();

  // Calculate width for 2 columns with spacing
  const cardWidth = (width - 24) / 2;

  return (
    <Link href={`/product/${product.id}`} asChild>
      <TouchableOpacity
        style={{ width: cardWidth }}
        className="p-2"
        activeOpacity={0.8}
      >
        <View className="bg-white rounded-xl overflow-hidden border border-gray-100 p-3 h-fit flex flex-col justify-between">
          <View>
            {/* Product Image */}
            <View
              style={{ backgroundColor: `${primaryColor}20` }}
              className="bg-white w-full h-40 rounded-lg items-center justify-center overflow-hidden mb-3 relative">
              <Image
                source={{ uri: product.image }}
                style={{ width: '90%', height: '90%' }}
                contentFit="contain"
                transition={200}
              />
              {/* Category tag */}
              <View className="absolute top-1 left-1 bg-white/95 px-2 py-0.5 rounded-full border border-gray-100">
                <Text className="text-[9px] font-semibold text-gray-500 capitalize">
                  {product.category}
                </Text>
              </View>
            </View>

            {/* Product Title */}
            <Text
              numberOfLines={2}
              className="text-gray-800 font-medium text-sm leading-4 mb-1 h-8"
            >
              {product.title}
            </Text>

            {/* Rating */}
            <View className="flex-row items-center mb-2">
              <View className="flex-row mr-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <ThemedIcon
                    key={star}
                    name={star <= Math.round(product.rating?.rate || 0) ? "star" : "star-outline"}
                    size={15}
                    useThemeColor={star <= Math.round(product.rating?.rate || 0)}
                    color="#D1D1D6"
                  />
                ))}
              </View>
              <Text className="text-md text-gray-400">
                ({product.rating?.count || 0})
              </Text>
            </View>
          </View>

          {/* Price and Add Button */}
          <View className="flex-row items-center flex-wrap mt-2 pt-2 border-t border-gray-50">
            <Text
              className="font-extrabold text-3xl mr-2"
              style={{ color: primaryColor }}
            >
              ${product.price.toFixed(2)}
            </Text>
            <Text className="text-gray-400 text-md line-through flex-col justify-end">
              ${(product.price * 1.2).toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
