import { useThemeStore } from "@/features/theme/store/useThemeStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "../features/cart/store/useCartStore";
import { CheckoutForm } from "../features/checkout/components/CheckoutForm";
import { CheckoutFormData } from "../features/checkout/schemas/checkoutSchema";
import { ThemedIcon } from "../shared/ui/ThemedIcon";

export default function CheckoutScreen() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { primaryColor } = useThemeStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();

  // If cart is empty and checkout hasn't been submitted, redirect back to home
  useEffect(() => {
    if (items.length === 0 && !isSubmitted) {
      router.replace("/(tabs)");
    }
  }, [items, isSubmitted, router]);

  const onSubmit = (formData: CheckoutFormData) => {
    setIsSubmitted(true);
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
    <SafeAreaView
      edges={['right', 'left', 'bottom']}
      className="flex-1"
      style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>

      {/* Header Search & Theme Bar */}
      <View
        style={{ backgroundColor: primaryColor }}
        className="h-36 px-4 pt-16 flex-row justify-between items-center">

        <View className="absolute -top-14 -right-10 w-48 h-48 bg-white/20 rounded-full" />
        <View className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/30 rounded-full " />

        <TouchableOpacity
          onPress={() => router.back()}
          className="p-1 "
        >
          <ThemedIcon name="arrow-back" size={24} useThemeColor={false} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white flex-1 text-center" numberOfLines={1}>
          Thanh toán
        </Text>

        <View className="mr-2"/>
      </View>

      {/* Checkout Form */}
      <CheckoutForm onSubmit={onSubmit} totalPrice={totalPrice} />
    </SafeAreaView>
  );
}
