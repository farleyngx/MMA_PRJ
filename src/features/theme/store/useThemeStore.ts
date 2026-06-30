import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeState {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  resetTheme: () => void;
}

const SHOPEE_ORANGE = "#EE4D2D"; // Default Shopee Color

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      primaryColor: SHOPEE_ORANGE,
      setPrimaryColor: (color) => set({ primaryColor: color }),
      resetTheme: () => set({ primaryColor: SHOPEE_ORANGE }),
    }),
    {
      name: "app-theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
