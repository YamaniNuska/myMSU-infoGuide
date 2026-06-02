import { Platform, type DimensionValue } from "react-native";

export const colors = {
  maroon: "#74101A",
  maroonDark: "#2C060A",
  maroonSoft: "#F8EAEC",
  gold: "#D8B24A",
  goldDark: "#85620F",
  ink: "#221A1C",
  muted: "#74686A",
  line: "#E7DDD6",
  surface: "#FFFFFF",
  surfaceMuted: "#FBF7F0",
  canvas: "#F8F4EE",
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
        boxShadow: "0px 14px 34px rgba(44, 6, 10, 0.10)",
      }
    : {
        shadowColor: "#2C060A",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.09,
        shadowRadius: 22,
        elevation: 4,
      };

export const softShadow =
  Platform.OS === "web"
    ? {
        boxShadow: "0px 8px 22px rgba(44, 6, 10, 0.07)",
      }
    : {
        shadowColor: "#2C060A",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 2,
      };

export const maxContentWidth = 1120;
export const bottomTabClearance = 96;
export const fontFamily = {
  display: Platform.select({
    ios: "Georgia",
    android: "serif",
    default: "Georgia, serif",
  }),
  body: Platform.select({
    ios: "System",
    android: "sans-serif",
    default: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  }),
};

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
