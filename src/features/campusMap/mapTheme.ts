import Ionicons from "@expo/vector-icons/Ionicons";
import type { CampusLocation } from "../../data/mymsuDatabase";
import { colors } from "../../theme";

export const locationColors: Record<string, string> = {
  "college-cics": "#0EA5E9",
  "international-convention-center": "#0284C7",
  "ict-office": "#0284C7",
  "college-hospitality-tourism": "#14B8A6",
  "college-fisheries": "#2563EB",
  "college-forestry": "#16A34A",
  "college-king-faisal": "#7C3AED",
  "college-medicine": "#10B981",
  infirmary: "#059669",
  "college-business": "#B45309",
  "college-education": "#9333EA",
  "college-engineering": "#475569",
  "college-cnsm": "#4F46E5",
  "college-social-sciences-humanities": "#7E22CE",
  "college-public-affairs": "#C2410C",
  "university-library": "#4F46E5",
  "aga-khan-museum": "#DC2626",
  "administration-building": "#0F766E",
  "alonto-hall": "#0F766E",
  "research-institute": "#BE185D",
  plh: "#DB2777",
  "super-new-boys-dormitory": "#0284C7",
  "super-new-girls-dormitory": "#C026D3",
  "rajah-dumdumla-hall": "#0D9488",
  "rsd-male-dormitory": "#0891B2",
  "main-entrance": "#22C55E",
};

export const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  College: "school-outline",
  "Academic Support": "library-outline",
  Administration: "business-outline",
  "Student Services": "people-outline",
  Landmark: "flag-outline",
  Dormitory: "home-outline",
  Health: "medkit-outline",
};

export const categoryColors: Record<string, string> = {
  College: colors.maroon,
  "Academic Support": colors.goldDark,
  Administration: colors.blue,
  "Student Services": colors.teal,
  Landmark: colors.goldDark,
  Dormitory: "#BE185D",
  Health: colors.success,
};

export const getLocationColor = (location: CampusLocation) =>
  locationColors[location.id] ??
  categoryColors[location.category] ??
  colors.maroon;
