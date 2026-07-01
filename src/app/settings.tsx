import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "../features/theme/store/useThemeStore";
import { ThemedIcon } from "../shared/ui/ThemedIcon";

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

const WHEEL_COLORS = [
  "#FF0000", // 0°
  "#FF4000", // 20°
  "#FF8000", // 40°
  "#FFC000", // 60°
  "#FFFF00", // 80°
  "#C0FF00", // 100°
  "#80FF00", // 120°
  "#40FF00", // 140°
  "#00FF00", // 160°
  "#00FF80", // 180°
  "#00FFFF", // 200°
  "#0080FF", // 220°
  "#0000FF", // 240°
  "#4000FF", // 260°
  "#8000FF", // 280°
  "#C000FF", // 300°
  "#FF00FF", // 320°
  "#FF0080", // 340°
];

// Helper: Convert HEX to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Helper: Convert HSL to HEX
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export default function SettingsScreen() {
  const router = useRouter();
  const { primaryColor, setPrimaryColor, resetTheme } = useThemeStore();
  const [selectedColor, setSelectedColor] = useState(primaryColor);

  // HSL state for fine-tuning color
  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(100);
  const [lightness, setLightness] = useState<number>(50);

  // Sync state variables when selectedColor changes
  useEffect(() => {
    const { h, s, l } = hexToHsl(selectedColor);
    setHue(h);
    setSaturation(s);
    setLightness(l);
  }, [selectedColor]);

  // Sync with store when primaryColor changes
  useEffect(() => {
    setSelectedColor(primaryColor);
  }, [primaryColor]);

  const handleSelectPreset = (hex: string) => {
    setSelectedColor(hex);
  };

  const handleSelectWheelColor = (hex: string) => {
    const { h, s } = hexToHsl(hex);
    setHue(h);
    setSaturation(s);
    setSelectedColor(hslToHex(h, s, lightness));
  };

  const handleApply = () => {
    setPrimaryColor(selectedColor);
  };

  const handleReset = () => {
    resetTheme();
    setSelectedColor("#EE4D2D");
  };

  const LIGHTNESS_LEVELS = [20, 30, 40, 50, 60, 70, 80, 90];

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
        <Text className="text-xl font-bold text-gray-800">Cài đặt giao diện</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>

        {/* Color Customization Panel */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
          <Text className="text-gray-400 font-semibold text-[10px] uppercase mb-4 tracking-wider">
            Tùy chọn màu sắc
          </Text>

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
          <View className="flex-row flex-wrap justify-between mb-4">
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
                    className="w-10 h-10 rounded-full items-center justify-center border border-black/5 shadow-sm"
                  >
                    {isSelected && (
                      <View className="w-5 h-5 items-center justify-center bg-black/35 rounded-full">
                        <ThemedIcon name="checkmark" size={12} useThemeColor={false} color="#FFFFFF" />
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

          {/* Color Wheel Section */}
          <Text className="text-gray-600 font-bold mb-3 text-sm">Vòng màu mỹ thuật (Color Wheel)</Text>
          <View className="items-center justify-center mb-6 mt-1">
            <View style={{ width: 170, height: 170, position: 'relative' }}>

              {/* Central Preview SQUARE */}
              <View
                style={{
                  position: 'absolute',
                  left: 85 - 28,
                  top: 85 - 28,
                  width: 56,
                  height: 56,
                  backgroundColor: selectedColor,
                  borderWidth: 2,
                  borderColor: '#FFFFFF',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 4,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ThemedIcon name="color-palette" size={20} useThemeColor={false} color="#FFFFFF" />
              </View>

              {/* 18 Color Beads */}
              {WHEEL_COLORS.map((hex, index) => {
                const angle = (index * 360) / 18;
                const rad = (angle * Math.PI) / 180;
                const radius = 62;
                const beadSize = 20;
                const left = 85 + radius * Math.cos(rad) - beadSize / 2;
                const top = 85 + radius * Math.sin(rad) - beadSize / 2;

                const beadHue = hexToHsl(hex).h;
                const isSelected = Math.abs(hue - beadHue) < 11;

                return (
                  <TouchableOpacity
                    key={hex}
                    onPress={() => handleSelectWheelColor(hex)}
                    style={{
                      position: 'absolute',
                      left,
                      top,
                      width: beadSize,
                      height: beadSize,
                      borderRadius: beadSize / 2,
                      backgroundColor: hex,
                      borderWidth: isSelected ? 2.5 : 0.5,
                      borderColor: isSelected ? '#1F2937' : 'rgba(0,0,0,0.08)',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 1,
                      elevation: 1,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    activeOpacity={0.8}
                  >
                    {isSelected && (
                      <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#FFFFFF', borderWidth: 0.5, borderColor: '#000' }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Lightness Slider Track */}
          <Text className="text-gray-600 font-bold mb-2 text-sm">Độ đậm / nhạt (Lightness)</Text>
          <View className="flex-row rounded-xl overflow-hidden h-7 border border-gray-200 mb-6 bg-gray-100">
            {LIGHTNESS_LEVELS.map((level) => {
              const levelColor = hslToHex(hue, saturation, level);
              const isSelected = Math.abs(lightness - level) < 6;
              return (
                <TouchableOpacity
                  key={level}
                  onPress={() => {
                    setLightness(level);
                    setSelectedColor(hslToHex(hue, saturation, level));
                  }}
                  style={{ backgroundColor: levelColor, flex: 1 }}
                  className="h-full items-center justify-center relative"
                  activeOpacity={0.8}
                >
                  {isSelected && (
                    <View className="w-3 h-3 rounded-full bg-white border border-gray-800 shadow-md" />
                  )}
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
      </ScrollView>
    </SafeAreaView>
  );
}
