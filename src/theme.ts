import { Platform, type DimensionValue } from "react-native";

export const colors = {
  maroon: "#7A0B14",
  maroonDark: "#3A080D",
  maroonSoft: "#F6E8E9",
  gold: "#D8B446",
  goldDark: "#896511",
  ink: "#251D1F",
  muted: "#76696B",
  line: "#E9DFDA",
  surface: "#FFFFFF",
  surfaceMuted: "#FBF8F3",
  canvas: "#F7F3EE",
  teal: "#0F766E",
  tealSoft: "#E8F5F2",
  blue: "#2F5F8F",
  blueSoft: "#EAF1F8",
  warning: "#B54708",
  success: "#247A4D",
  danger: "#B42318",
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 6,
  md: 6,
  lg: 8,
  pill: 999,
};

export const shadow =
  Platform.OS === "web"
    ? {
        boxShadow: "0px 10px 24px rgba(31, 17, 17, 0.08)",
      }
    : {
        shadowColor: "#1F1111",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 3,
      };

export const maxContentWidth = 1120;

export function getColumnCount(width: number) {
  if (width >= 1100) {
    return 4;
  }

  if (width >= 760) {
    return 3;
  }

  return 2;
}

export function getCardWidth(columns: number): DimensionValue {
  if (columns === 4) {
    return "23.5%";
  }

  if (columns === 3) {
    return "31.8%";
  }

  return "48%";
}
