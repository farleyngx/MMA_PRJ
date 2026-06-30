import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useThemeStore } from "../../features/theme/store/useThemeStore";

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
  variant?: "filled" | "outline" | "text";
  disabled?: boolean;
  loading?: boolean;
}

export const ThemedButton = ({
  title,
  onPress,
  className = "",
  variant = "filled",
  disabled = false,
  loading = false,
}: ThemedButtonProps) => {
  const { primaryColor } = useThemeStore();

  const isOutline = variant === "outline";
  const isText = variant === "text";

  const buttonStyle = isOutline
    ? { borderColor: primaryColor, borderWidth: 1 }
    : isText
    ? {}
    : { backgroundColor: primaryColor };

  const textStyle = isOutline || isText
    ? { color: primaryColor }
    : { color: "#FFFFFF" };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`py-3 px-6 rounded-lg items-center justify-center flex-row ${
        disabled || loading ? "opacity-60" : ""
      } ${className}`}
      style={buttonStyle}
    >
      {loading && <ActivityIndicator color={textStyle.color} size="small" className="mr-2" />}
      <Text className="font-bold text-center text-base" style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
