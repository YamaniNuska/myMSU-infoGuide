import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import type { CampusLocation } from "../../data/mymsuDatabase";
import { colors, radii, shadow } from "../../theme";
import { getLocationImageSource } from "./locationImages";
import { formatCoordinate, formatDistance } from "./mapMath";
import { categoryIcons, getLocationColor } from "./mapTheme";

type LocationDetailPanelProps = {
  location: CampusLocation;
  routeDistance?: number | null;
};

export default function LocationDetailPanel({
  location,
  routeDistance,
}: LocationDetailPanelProps) {
  const imageSource = getLocationImageSource(location);

  return (
    <View style={styles.detailPanel}>
      <View style={styles.detailHeader}>
        <View style={styles.detailTitleWrap}>
          <Text style={styles.detailKicker}>{location.category}</Text>
          <Text style={styles.detailTitle}>{location.name}</Text>
          {routeDistance ? (
            <View style={styles.routeBadge}>
              <Ionicons name="walk" size={13} color={colors.maroonDark} />
              <Text style={styles.routeBadgeText}>
                {formatDistance(routeDistance)}
              </Text>
            </View>
          ) : null}
        </View>
        <View
          style={[
            styles.detailIcon,
            {
              backgroundColor: getLocationColor(location),
            },
          ]}
        >
          <Ionicons
            name={categoryIcons[location.category] ?? "location-outline"}
            size={20}
            color={colors.surface}
          />
        </View>
      </View>

      {imageSource ? (
        <Image
          source={imageSource}
          style={styles.detailImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.detailImagePlaceholder}>
          <Ionicons name="image-outline" size={40} color={colors.muted} />
          <Text style={styles.detailImagePlaceholderText}>
            No image available
          </Text>
        </View>
      )}

      <Text style={styles.detailBody}>{location.description}</Text>

      <View style={styles.coordinateGrid}>
        <View style={styles.coordinatePill}>
          <Text style={styles.coordinateLabel}>Street</Text>
          <Text style={styles.coordinateValue} numberOfLines={1}>
            {location.street ?? "Campus route"}
          </Text>
        </View>
        <View style={styles.coordinatePill}>
          <Text style={styles.coordinateLabel}>Latitude</Text>
          <Text style={styles.coordinateValue}>
            {formatCoordinate(location.latitude)}
          </Text>
        </View>
        <View style={styles.coordinatePill}>
          <Text style={styles.coordinateLabel}>Longitude</Text>
          <Text style={styles.coordinateValue}>
            {formatCoordinate(location.longitude)}
          </Text>
        </View>
      </View>

      <View style={styles.metaGroup}>
        <Text style={styles.metaLabel}>Nearby</Text>
        <View style={styles.chipWrap}>
          {location.nearby.map((item) => (
            <Text key={item} style={styles.metaChip}>
              {item}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.metaGroup}>
        <Text style={styles.metaLabel}>Tags</Text>
        <View style={styles.chipWrap}>
          {location.tags.map((tag) => (
            <Text key={tag} style={styles.tagChip}>
              {tag}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailPanel: {
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },
  detailTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  detailKicker: {
    color: colors.goldDark,
    fontFamily: Platform.select({
      android: "sans-serif-medium",
      ios: "Avenir Next",
      default: "Segoe UI",
    }),
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  detailTitle: {
    marginTop: 5,
    color: colors.maroonDark,
    fontFamily: Platform.select({
      android: "sans-serif-condensed",
      ios: "Avenir Next",
      default: "Segoe UI",
    }),
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "900",
  },
  routeBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 9,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.tealSoft,
    borderWidth: 1,
    borderColor: "rgba(15, 118, 110, 0.2)",
  },
  routeBadgeText: {
    color: colors.maroonDark,
    fontSize: 11,
    fontWeight: "900",
  },
  detailIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  detailImage: {
    marginTop: 14,
    width: "100%",
    height: 180,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
  },
  detailImagePlaceholder: {
    marginTop: 14,
    width: "100%",
    height: 180,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: "dashed",
    gap: 8,
  },
  detailImagePlaceholderText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  detailBody: {
    marginTop: 12,
    color: colors.ink,
    fontFamily: Platform.select({
      android: "sans-serif",
      ios: "Avenir Next",
      default: "Segoe UI",
    }),
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
  },
  coordinateGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  coordinatePill: {
    flexGrow: 1,
    minWidth: 142,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  coordinateLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  coordinateValue: {
    marginTop: 4,
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  metaGroup: {
    marginTop: 14,
    gap: 8,
  },
  metaLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  metaChip: {
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.maroonSoft,
    color: colors.maroonDark,
    fontSize: 11,
    fontWeight: "800",
  },
  tagChip: {
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
  },
});
