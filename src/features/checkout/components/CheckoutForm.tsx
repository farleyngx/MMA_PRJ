import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, TextInput, View } from "react-native";
import { ThemedButton } from "../../../shared/ui/ThemedButton";
import { ThemedIcon } from "../../../shared/ui/ThemedIcon";
import { useThemeStore } from "../../theme/store/useThemeStore";
import { CheckoutFormData, checkoutSchema } from "../schemas/checkoutSchema";

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  totalPrice: number;
}

export const CheckoutForm = ({ onSubmit, totalPrice }: CheckoutFormProps) => {
  const { primaryColor } = useThemeStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  return (
    <ScrollView 
      className="flex-1 px-4 py-3"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-gray-800 font-bold text-xl mb-4">Thông tin nhận hàng</Text>

      {/* Full Name */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold text-md mb-1">Họ và tên</Text>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <View 
              className={`flex-row items-center border rounded-xl px-3 bg-white ${
                errors.fullName ? "border-red-500" : "border-gray-200"
              }`}
            >
              <ThemedIcon name="person-outline" size={18} useThemeColor={false} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3 px-2 text-gray-800 text-md"
                placeholder="Nhập tên người nhận hàng"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />
        {errors.fullName && (
          <Text className="text-red-500 text-[10px] mt-1 font-medium">
            {errors.fullName.message}
          </Text>
        )}
      </View>

      {/* Phone Number */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold text-md mb-1">Số điện thoại</Text>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <View 
              className={`flex-row items-center border rounded-xl px-3 bg-white ${
                errors.phone ? "border-red-500" : "border-gray-200"
              }`}
            >
              <ThemedIcon name="call-outline" size={18} useThemeColor={false} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3 px-2 text-gray-800 text-md"
                placeholder="Ví dụ: 0987654321"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />
        {errors.phone && (
          <Text className="text-red-500 text-[10px] mt-1 font-medium">
            {errors.phone.message}
          </Text>
        )}
      </View>

      {/* Email */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold text-md mb-1">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View 
              className={`flex-row items-center border rounded-xl px-3 bg-white ${
                errors.email ? "border-red-500" : "border-gray-200"
              }`}
            >
              <ThemedIcon name="mail-outline" size={18} useThemeColor={false} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3 px-2 text-gray-800 text-md"
                placeholder="Địa chỉ email để nhận hóa đơn"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            </View>
          )}
        />
        {errors.email && (
          <Text className="text-red-500 text-[10px] mt-1 font-medium">
            {errors.email.message}
          </Text>
        )}
      </View>

      {/* Shipping Address */}
      <View className="mb-6">
        <Text className="text-gray-700 font-semibold text-md mb-1">Địa chỉ giao hàng</Text>
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <View 
              className={`flex-row items-start border rounded-xl px-3 bg-white pt-2 ${
                errors.address ? "border-red-500" : "border-gray-200"
              }`}
            >
              <View className="mt-1">
                <ThemedIcon name="location-outline" size={18} useThemeColor={false} color="#9CA3AF" />
              </View>
              <TextInput
                className="flex-1 py-2 px-2 text-gray-800 text-md h-20"
                placeholder="Nhập địa chỉ giao hàng cụ thể..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                textAlignVertical="top"
              />
            </View>
          )}
        />
        {errors.address && (
          <Text className="text-red-500 text-[10px] mt-1 font-medium">
            {errors.address.message}
          </Text>
        )}
      </View>

      {/* Bill summary card */}
      <View className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-8">
        <Text className="text-gray-800 font-bold mb-3 text-md">Tóm tắt đơn hàng</Text>
        
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500 text-md">Tổng tiền hàng</Text>
          <Text className="text-gray-700 font-medium text-md">${totalPrice.toFixed(2)}</Text>
        </View>
        
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500 text-md">Phí vận chuyển</Text>
          <Text className="text-green-600 font-medium text-md">Miễn phí</Text>
        </View>
        
        <View className="h-[1px] bg-gray-200 my-2" />
        
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-gray-800 font-bold text-md">Tổng thanh toán</Text>
          <Text 
            className="font-bold text-lg" 
            style={{ color: primaryColor }}
          >
            ${totalPrice.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Place Order Button */}
      <ThemedButton
        title="Đặt Hàng Ngay"
        onPress={handleSubmit(onSubmit)}
        className="mb-10 w-full"
      />
    </ScrollView>
  );
};
