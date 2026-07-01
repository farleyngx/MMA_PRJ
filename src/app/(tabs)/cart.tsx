import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
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

  const handleClearCartPress = () => {
    Alert.alert(
      "Xác nhận xóa giỏ hàng",
      "Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa tất cả",
          style: "destructive",
          onPress: () => clearCart(),
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push("/checkout");
  };

  return (
    <SafeAreaView
      edges={['right', 'left', 'bottom']}
      className="flex-1"
      style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>

      {/* Header */}
      <View
        style={{ backgroundColor: primaryColor }}
        className="h-32 flex-row mb-1 items-end justify-between px-5 pb-4 relative overflow-hidden">
        <View className="absolute -top-14 -right-10 w-48 h-48 bg-white/20 rounded-full" />
        <View className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/30 rounded-full" />

        <Text className="text-white font-extrabold text-3xl z-10">Giỏ hàng</Text>

        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCartPress} className="z-10" activeOpacity={0.7}>
            <Text className="text-white font-semibold text-xl">Xóa tất cả</Text>
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
          <Text className="text-gray-800 text-3xl font-bold mb-1">Giỏ hàng trống</Text>
          <Text className="text-gray-400 text-xl text-center mb-6 px-8">
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
                <View className="w-32 h-32 bg-gray-50 rounded-xl items-center justify-center overflow-hidden mr-3 border border-gray-100">
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="contain"
                    transition={200}
                  />
                </View>

                {/* Info and Quantity Controls */}
                <View className="flex-1 justify-between h-28">
                  <View className="flex-row justify-between items-start">
                    <Text
                      className="text-gray-800 font-medium text-md flex-1 pr-2"
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>

                    {/* Delete item button */}
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.id)}
                      className="p-1 -mr-1 text-white"
                    >
                      <ThemedIcon name="trash-outline" size={20} useThemeColor={true} />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text
                      className="font-bold text-3xl"
                      style={{ color: primaryColor }}
                    >
                      ${item.price.toFixed(2)}
                    </Text>

                    {/* Quantity selectors */}
                    <View className="flex-row items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50/90">
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2"
                        activeOpacity={0.7}
                      >
                        <Text className="text-gray-500 font-semibold text-3xl">-</Text>
                      </TouchableOpacity>

                      <View className="px-3">
                        <Text className="text-gray-800 font-bold text-md">{item.quantity}</Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1"
                        activeOpacity={0.7}
                      >
                        <Text className="text-gray-500 font-semibold text-3xl">+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            <View className="h-6" />
          </ScrollView>

          {/* Sticky Checkout Summary Footer */}
          <View
            style={{ backgroundColor: `${primaryColor}90` }}
            className="px-6 py-4 flex-row items-center justify-between pb-6 relative overflow-hidden">

            <View className="absolute -top-14 -right-10 w-48 h-48 bg-white/30 rounded-full" />
            <View className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/50 rounded-full" />

            <View>
              <Text
                style={{ color: primaryColor }}
                className=" text-xl font-semibold mb-0.5">Tổng cộng</Text>
              <Text
                style={{ color: primaryColor }}
                className=" font-extrabold text-4xl">${totalAmount.toFixed(2)}</Text>
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
