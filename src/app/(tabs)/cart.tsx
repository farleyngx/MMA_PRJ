import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "../../features/cart/store/useCartStore";
import { useThemeStore } from "../../features/theme/store/useThemeStore";
import { ThemedButton } from "../../shared/ui/ThemedButton";
import { ThemedIcon } from "../../shared/ui/ThemedIcon";

export default function CartScreen() {
  const router = useRouter();
  const { primaryColor } = useThemeStore();
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCartStore();

  const totalAmount = getTotalPrice();

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push("/checkout");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <Text className="text-xl font-bold text-gray-800">Giỏ hàng</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart} className="p-1">
            <Text className="text-gray-400 font-bold text-xs">Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        /* Empty Cart State */
        <View className="flex-1 items-center justify-center p-6 bg-white">
          <View 
            style={{ backgroundColor: `${primaryColor}10` }}
            className="p-6 rounded-full mb-4"
          >
            <ThemedIcon name="cart-outline" size={60} useThemeColor={true} />
          </View>
          <Text className="text-gray-800 text-lg font-bold mb-1">Giỏ hàng trống</Text>
          <Text className="text-gray-400 text-sm text-center mb-6 px-8">
            Chưa có sản phẩm nào được thêm vào giỏ hàng. Bắt đầu khám phá ngay!
          </Text>
          <ThemedButton 
            title="Mua sắm ngay" 
            onPress={() => router.replace("/(tabs)")} 
            className="px-10"
          />
        </View>
      ) : (
        /* Cart Items List */
        <View className="flex-1">
          <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <View 
                key={item.id} 
                className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm flex-row items-center"
              >
                {/* Product Image */}
                <View className="w-20 h-20 bg-gray-50 rounded-xl items-center justify-center overflow-hidden mr-3 border border-gray-100">
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="contain"
                    transition={200}
                  />
                </View>

                {/* Info and Quantity Controls */}
                <View className="flex-1 justify-between h-20">
                  <View className="flex-row justify-between items-start">
                    <Text 
                      className="text-gray-800 font-medium text-xs leading-4 flex-1 pr-2" 
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    
                    {/* Delete item button */}
                    <TouchableOpacity 
                      onPress={() => removeFromCart(item.id)}
                      className="p-1 -mr-1"
                    >
                      <ThemedIcon name="trash-outline" size={16} useThemeColor={false} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text 
                      className="font-bold text-sm" 
                      style={{ color: primaryColor }}
                    >
                      ${item.price.toFixed(2)}
                    </Text>

                    {/* Quantity selectors */}
                    <View className="flex-row items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1"
                        activeOpacity={0.7}
                      >
                        <Text className="text-gray-500 font-semibold text-xs">-</Text>
                      </TouchableOpacity>
                      
                      <View className="px-3">
                        <Text className="text-gray-800 font-bold text-xs">{item.quantity}</Text>
                      </View>
                      
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1"
                        activeOpacity={0.7}
                      >
                        <Text className="text-gray-500 font-semibold text-xs">+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            <View className="h-6" />
          </ScrollView>

          {/* Sticky Checkout Summary Footer */}
          <View className="bg-white border-t border-gray-100 px-6 py-4 flex-row items-center justify-between pb-6">
            <View>
              <Text className="text-gray-400 text-xs font-semibold mb-0.5">Tổng cộng</Text>
              <Text 
                className="font-bold text-xl" 
                style={{ color: primaryColor }}
              >
                ${totalAmount.toFixed(2)}
              </Text>
            </View>
            
            <ThemedButton 
              title="Thanh toán" 
              onPress={handleCheckout} 
              className="px-8"
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
