import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { CampusLocation } from "../../data/mymsuDatabase";
import { colors, radii } from "../../theme";
import { clamp, getMarkerLabel, mapPointToCoordinate } from "./mapMath";
import { getLocationColor } from "./mapTheme";
import type { MapPoint, MapSize } from "./types";

type DraftLocation = Pick<
  CampusLocation,
  "id" | "name" | "category" | "mapX" | "mapY"
> &
  Partial<Pick<CampusLocation, "latitude" | "longitude" | "tags">>;

type AdminLocationMapPickerProps = {
  locations: CampusLocation[];
  draftLocation: DraftLocation;
  onDraftMove: (position: Required<MapPoint>) => void;
  onSelectExistingLocation: (id: string) => void;
  onInteractionChange?: (active: boolean) => void;
};

const gridLines = [20, 40, 60, 80];

const getPointFromTouch = (
  locationX: number,
  locationY: number,
  mapSize: MapSize,
): Required<MapPoint> | null => {
  if (!mapSize.width || !mapSize.height) {
    return null;
  }

  const mapX = clamp((locationX / mapSize.width) * 100, 0, 100);
  const mapY = clamp((locationY / mapSize.height) * 100, 0, 100);
  const coordinate = mapPointToCoordinate({ mapX, mapY });

  return {
    mapX,
    mapY,
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
  };
};

export default function AdminLocationMapPicker({
  locations,
  draftLocation,
  onDraftMove,
  onSelectExistingLocation,
  onInteractionChange,
}: AdminLocationMapPickerProps) {
  const [mapSize, setMapSize] = React.useState<MapSize>({ width: 0, height: 0 });

  const draftCoordinate = React.useMemo(
    () =>
      mapPointToCoordinate({
        mapX: draftLocation.mapX,
        mapY: draftLocation.mapY,
        latitude: draftLocation.latitude,
        longitude: draftLocation.longitude,
      }),
    [
      draftLocation.latitude,
      draftLocation.longitude,
      draftLocation.mapX,
      draftLocation.mapY,
    ],
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setMapSize({ width, height });
  };

  const moveDraft = (locationX: number, locationY: number) => {
    const nextPoint = getPointFromTouch(locationX, locationY, mapSize);

    if (nextPoint) {
      onDraftMove(nextPoint);
    }
  };

  const markerName = draftLocation.name.trim() || "New location";
  const markerLabel =
    draftLocation.tags?.[0]?.toUpperCase() ||
    (markerName === "New location" ? "NEW" : markerName.slice(0, 3).toUpperCase());

  return (
    <View style={styles.shell}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Map position</Text>
          <Text style={styles.subtitle}>
            Tap or drag the pin to update this location.
          </Text>
        </View>
        <View style={styles.coordinatePill}>
          <Ionicons name="navigate" size={14} color={colors.maroonDark} />
          <Text style={styles.coordinatePillText}>
            {draftLocation.mapX.toFixed(1)}, {draftLocation.mapY.toFixed(1)}
          </Text>
        </View>
      </View>

      <View
        style={styles.mapBoard}
        onLayout={handleLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(event) => {
          onInteractionChange?.(true);
          moveDraft(event.nativeEvent.locationX, event.nativeEvent.locationY);
        }}
        onResponderMove={(event) => {
          moveDraft(event.nativeEvent.locationX, event.nativeEvent.locationY);
        }}
        onResponderRelease={() => onInteractionChange?.(false)}
        onResponderTerminate={() => onInteractionChange?.(false)}
      >
        <View style={styles.mapBackdrop} pointerEvents="none" />

        {gridLines.map((line) => (
          <React.Fragment key={line}>
            <View style={[styles.gridLineVertical, { left: `${line}%` }]} />
            <View style={[styles.gridLineHorizontal, { top: `${line}%` }]} />
          </React.Fragment>
        ))}

        <View style={styles.roadSpine} pointerEvents="none" />
        <View style={styles.roadCross} pointerEvents="none" />

        {locations.map((location) => (
          <Pressable
            key={location.id}
            style={[
              styles.locationMarker,
              {
                left: `${clamp(location.mapX, 0, 100)}%`,
                top: `${clamp(location.mapY, 0, 100)}%`,
              },
            ]}
            onPress={() => onSelectExistingLocation(location.id)}
          >
            <View
              style={[
                styles.locationMarkerPin,
                { backgroundColor: getLocationColor(location) },
              ]}
            >
              <Ionicons name="location" size={14} color={colors.surface} />
            </View>
            <Text style={styles.locationMarkerText} numberOfLines={1}>
              {getMarkerLabel(location)}
            </Text>
          </Pressable>
        ))}

        <View
          style={[
            styles.draftMarker,
            {
              left: `${clamp(draftLocation.mapX, 0, 100)}%`,
              top: `${clamp(draftLocation.mapY, 0, 100)}%`,
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.draftMarkerHalo} />
          <View style={styles.draftMarkerPin}>
            <Ionicons name="location" size={34} color={colors.surface} />
          </View>
          <Text style={styles.draftMarkerLabel} numberOfLines={1}>
            {markerLabel}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText} numberOfLines={1}>
          {markerName}
        </Text>
        <Text style={styles.footerMeta}>
          {draftCoordinate.latitude.toFixed(6)}, {draftCoordinate.longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 12,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.maroonDark,
    fontSize: 13,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  coordinatePill: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  coordinatePillText: {
    color: colors.maroonDark,
    fontSize: 11,
    fontWeight: "900",
  },
  mapBoard: {
    position: "relative",
    height: 330,
    overflow: "hidden",
    backgroundColor: "#DCE9D2",
  },
  mapBackdrop: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#DCE9D2",
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(58, 8, 13, 0.08)",
  },
  gridLineHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(58, 8, 13, 0.08)",
  },
  roadSpine: {
    position: "absolute",
    left: "34%",
    top: "-8%",
    width: 16,
    height: "116%",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.62)",
    transform: [{ rotate: "7deg" }],
  },
  roadCross: {
    position: "absolute",
    left: "14%",
    right: "8%",
    top: "38%",
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.56)",
    transform: [{ rotate: "8deg" }],
  },
  locationMarker: {
    position: "absolute",
    width: 86,
    marginLeft: -43,
    marginTop: -40,
    alignItems: "center",
    justifyContent: "center",
  },
  locationMarkerPin: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: colors.surface,
    shadowColor: "#1F1111",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 3,
  },
  locationMarkerText: {
    maxWidth: 86,
    marginTop: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    overflow: "hidden",
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(58, 8, 13, 0.14)",
    color: colors.maroonDark,
    fontSize: 9,
    fontWeight: "900",
    textAlign: "center",
  },
  draftMarker: {
    position: "absolute",
    width: 118,
    marginLeft: -59,
    marginTop: -78,
    alignItems: "center",
  },
  draftMarkerHalo: {
    position: "absolute",
    top: 7,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(122, 11, 20, 0.18)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.82)",
  },
  draftMarkerPin: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 29,
    backgroundColor: colors.maroon,
    borderWidth: 4,
    borderColor: colors.surface,
    shadowColor: "#1F1111",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  },
  draftMarkerLabel: {
    maxWidth: 118,
    marginTop: 7,
    paddingHorizontal: 11,
    paddingVertical: 6,
    overflow: "hidden",
    borderRadius: radii.pill,
    backgroundColor: colors.maroonDark,
    color: colors.surface,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 12,
  },
  footerText: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 12,
    fontWeight: "900",
  },
  footerMeta: {
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: "900",
  },
});
