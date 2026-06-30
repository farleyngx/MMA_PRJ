import { useWindowDimensions } from "react-native";

const TABLET_BREAKPOINT = 768;

export const useResponsive = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;

  return {
    isTablet,
    numColumns: isTablet ? 4 : 2,
  };
};
