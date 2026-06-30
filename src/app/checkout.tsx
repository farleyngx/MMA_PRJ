import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "../features/cart/store/useCartStore";
import { CheckoutForm } from "../features/checkout/components/CheckoutForm";
import { CheckoutFormData } from "../features/checkout/schemas/checkoutSchema";
import { ThemedIcon } from "../shared/ui/ThemedIcon";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();

  // If cart is empty, redirect back to home
  useEffect(() => {
    if (items.length === 0) {
      router.replace("/(tabs)");
    }
  }, [items, router]);

  const onSubmit = (formData: CheckoutFormData) => {
    const orderId = Date.now().toString().slice(-6);
    
    // Clear items in local cart
    clearCart();

    // Navigate to confirmation success screen
    router.replace({
      pathname: "/order-success",
      params: {
        orderId,
        fullName: formData.fullName,
        address: formData.address,
        total: totalPrice.toFixed(2),
      },
    });
  };

  if (items.length === 0) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-1 -ml-1 mr-2"
        >
          <ThemedIcon name="arrow-back" size={24} useThemeColor={false} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Thanh toán</Text>
      </View>

      {/* Checkout Form */}
      <CheckoutForm onSubmit={onSubmit} totalPrice={totalPrice} />
    </SafeAreaView>
  );
}
