import type { DimensionValue } from "react-native";

export const colors = {
  maroon: "#800505",
  maroonDark: "#4A0E0E",
  maroonSoft: "#F3E7E7",
  gold: "#D4AF37",
  goldDark: "#9B761A",
  ink: "#2D2424",
  muted: "#6F6262",
  line: "#E8DEDA",
  surface: "#FFFFFF",
  canvas: "#F8F6F2",
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
  sm: 8,
  md: 10,
  pill: 999,
};

export const shadow = {
  shadowColor: "#2B0808",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
  elevation: 4,
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
