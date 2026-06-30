import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../features/theme/store/useThemeStore";

interface ThemedIconProps {
  name: React.ComponentProps<typeof Ionicons>["name"];
  size?: number;
  color?: string;
  useThemeColor?: boolean;
}

export const ThemedIcon = ({
  name,
  size = 24,
  color,
  useThemeColor = true,
}: ThemedIconProps) => {
  const { primaryColor } = useThemeStore();

  return (
    <Ionicons
      name={name}
      size={size}
      color={useThemeColor ? primaryColor : color || "#8E8E93"}
    />
  );
};
