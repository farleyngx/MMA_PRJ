import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useThemeStore } from "../store/useThemeStore";
import { ThemedIcon } from "../../../shared/ui/ThemedIcon";

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  { name: "Shopee Cam", hex: "#EE4D2D" },
  { name: "Xanh Dương", hex: "#1D4ED8" },
  { name: "Xanh Lá", hex: "#059669" },
  { name: "Tím Thủy Tiên", hex: "#7C3AED" },
  { name: "Đỏ Hồng", hex: "#E11D48" },
  { name: "Xanh Mòng Két", hex: "#0D9488" },
  { name: "Xám Than", hex: "#374151" },
  { name: "Vàng Hổ Phách", hex: "#D97706" },
];

export const ColorPickerModal = ({ visible, onClose }: ColorPickerModalProps) => {
  const { primaryColor, setPrimaryColor, resetTheme } = useThemeStore();
  const [selectedColor, setSelectedColor] = useState(primaryColor);

  const handleSelectPreset = (hex: string) => {
    setSelectedColor(hex);
  };

  const handleApply = () => {
    setPrimaryColor(selectedColor);
    onClose();
  };

  const handleReset = () => {
    resetTheme();
    setSelectedColor("#EE4D2D");
  };

  return (
    <Modal 
      visible={visible} 
      transparent={true} 
      animationType="fade" 
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-white rounded-t-3xl p-6 shadow-2xl">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-800">Chọn màu chủ đạo</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <ThemedIcon name="close" size={24} useThemeColor={false} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Color Preview */}
          <View className="items-center mb-6">
            <View 
              style={{ backgroundColor: selectedColor }} 
              className="w-20 h-20 rounded-2xl shadow-md border-2 border-white mb-2" 
            />
            <Text className="text-gray-500 font-mono text-xs uppercase font-semibold">{selectedColor}</Text>
          </View>

          {/* Presets Grid */}
          <Text className="text-gray-600 font-bold mb-3 text-sm">Màu phổ biến</Text>
          <View className="flex-row flex-wrap justify-between mb-6">
            {PRESET_COLORS.map((preset) => {
              const isSelected = selectedColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <TouchableOpacity
                  key={preset.hex}
                  onPress={() => handleSelectPreset(preset.hex)}
                  className="items-center mb-4 w-1/4"
                  activeOpacity={0.7}
                >
                  <View 
                    style={{ backgroundColor: preset.hex }} 
                    className="w-12 h-12 rounded-full items-center justify-center border border-black/5 shadow-sm"
                  >
                    {isSelected && (
                      <View className="w-6 h-6 items-center justify-center bg-black/35 rounded-full">
                        <ThemedIcon name="checkmark" size={14} useThemeColor={false} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  <Text className="text-[10px] text-gray-500 text-center mt-1" numberOfLines={1}>
                    {preset.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between pt-4 border-t border-gray-100">
            <TouchableOpacity
              onPress={handleReset}
              className="py-3 px-4 rounded-xl border border-gray-200 items-center justify-center w-[48%]"
              activeOpacity={0.7}
            >
              <Text className="text-gray-500 font-bold text-sm">Khôi phục mặc định</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleApply}
              style={{ backgroundColor: selectedColor }}
              className="py-3 px-4 rounded-xl items-center justify-center w-[48%]"
              activeOpacity={0.7}
            >
              <Text className="text-white font-bold text-sm">Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
