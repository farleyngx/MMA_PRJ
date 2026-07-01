import { Tabs } from "expo-router";
import React from "react";
import { useCartStore } from "../../features/cart/store/useCartStore";
import { useThemeStore } from "../../features/theme/store/useThemeStore";
import { ThemedIcon } from "../../shared/ui/ThemedIcon";

export default function TabLayout() {
  const { primaryColor } = useThemeStore();
  const cartItems = useCartStore((s) => s.items);

  // Compute total quantity of items in the cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryColor,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#F2F2F7",
          height: 100,
          marginTop: -35,
          paddingBottom:20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, focused }) => (
            <ThemedIcon
              name={focused ? "home" : "home-outline"}
              size={22}
              useThemeColor={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Khám phá",
          tabBarIcon: ({ color, focused }) => (
            <ThemedIcon
              name={focused ? "search" : "search-outline"}
              size={22}
              useThemeColor={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Giỏ hàng",
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: primaryColor,
            color: "#FFFFFF",
            fontSize: 10,
            fontWeight: "bold",
          },
          tabBarIcon: ({ color, focused }) => (
            <ThemedIcon
              name={focused ? "cart" : "cart-outline"}
              size={22}
              useThemeColor={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Tôi",
          tabBarIcon: ({ color, focused }) => (
            <ThemedIcon
              name={focused ? "person" : "person-outline"}
              size={22}
              useThemeColor={focused}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
