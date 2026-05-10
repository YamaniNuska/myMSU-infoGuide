import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { CampusLocation } from "../../data/mymsuDatabase";
import { colors, radii } from "../../theme";
import { categoryColors, categoryIcons } from "./mapTheme";

type LocationListProps = {
  locations: CampusLocation[];
  selectedId?: string;
  onSelectLocation: (id: string) => void;
};

export default function LocationList({
  locations,
  selectedId,
  onSelectLocation,
}: LocationListProps) {
  return (
    <View style={styles.locationList}>
      <Text style={styles.listTitle}>Locations</Text>
      {locations.map((location) => (
        <Pressable
          key={location.id}
          style={[
            styles.locationRow,
            selectedId === location.id && styles.locationRowActive,
          ]}
          onPress={() => onSelectLocation(location.id)}
        >
          <View
            style={[
              styles.rowIcon,
              {
                backgroundColor:
                  categoryColors[location.category] ?? colors.maroon,
              },
            ]}
          >
            <Ionicons
              name={categoryIcons[location.category] ?? "location-outline"}
              size={16}
              color={colors.surface}
            />
          </View>
          <View style={styles.rowTextWrap}>
            <Text style={styles.rowTitle}>{location.name}</Text>
            <Text style={styles.rowSubtitle}>{location.category}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  locationList: {
    gap: 10,
  },
  listTitle: {
    color: colors.maroonDark,
    fontFamily: Platform.select({
      android: "sans-serif-condensed",
      ios: "Avenir Next",
      default: "Segoe UI",
    }),
    fontSize: 18,
    fontWeight: "900",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 13,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  locationRowActive: {
    borderColor: "rgba(122, 11, 20, 0.32)",
    backgroundColor: "#FFF8F0",
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    color: colors.maroonDark,
    fontFamily: Platform.select({
      android: "sans-serif-medium",
      ios: "Avenir Next",
      default: "Segoe UI",
    }),
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "900",
  },
  rowSubtitle: {
    marginTop: 2,
    color: colors.muted,
    fontFamily: Platform.select({
      android: "sans-serif",
      ios: "Avenir Next",
      default: "Segoe UI",
    }),
    fontSize: 12,
    fontWeight: "800",
  },
});
