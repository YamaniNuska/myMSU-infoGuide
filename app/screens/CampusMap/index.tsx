import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useAuthSession } from "../../../src/auth/localAuth";
import SecondaryScreenLayout from "../../../src/components/SecondaryScreenLayout";
import { useAppData } from "../../../src/data/appStore";
import type { CampusLocation } from "../../../src/data/mymsuDatabase";
import { colors, maxContentWidth, radii, shadow } from "../../../src/theme";

type CampusMapScreenProps = {
  onBack?: () => void;
};

type UserMarker = {
  mapX: number;
  mapY: number;
  accuracy?: number | null;
  insideCampus: boolean;
};

type TrackingState = "idle" | "loading" | "active" | "denied" | "error";

const CAMPUS_BOUNDS = {
  north: 8.0058,
  south: 7.9865,
  west: 124.2805,
  east: 124.3005,
};

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  College: "school-outline",
  Administration: "business-outline",
  "Student Services": "people-outline",
  Landmark: "flag-outline",
  Health: "medkit-outline",
};

const categoryColors: Record<string, string> = {
  College: colors.maroon,
  Administration: colors.blue,
  "Student Services": colors.teal,
  Landmark: colors.goldDark,
  Health: colors.success,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const normalize = (value: string) => value.toLowerCase().trim();

const getMarkerLabel = (location: CampusLocation) => {
  const firstTag = location.tags[0]?.toUpperCase();

  if (firstTag && firstTag.length <= 7) {
    return firstTag;
  }

  return location.name
    .split(" ")
    .filter((word) => word.length > 2)
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

const projectCoordinate = (
  latitude: number,
  longitude: number,
): UserMarker => {
  const rawX =
    ((longitude - CAMPUS_BOUNDS.west) /
      (CAMPUS_BOUNDS.east - CAMPUS_BOUNDS.west)) *
    100;
  const rawY =
    ((CAMPUS_BOUNDS.north - latitude) /
      (CAMPUS_BOUNDS.north - CAMPUS_BOUNDS.south)) *
    100;

  return {
    mapX: clamp(rawX, 0, 100),
    mapY: clamp(rawY, 0, 100),
    insideCampus: rawX >= 0 && rawX <= 100 && rawY >= 0 && rawY <= 100,
  };
};

export default function CampusMapScreen({ onBack }: CampusMapScreenProps) {
  const router = useRouter();
  const session = useAuthSession();
  const { campusLocations } = useAppData();
  const { width } = useWindowDimensions();
  const entry = React.useRef(new Animated.Value(0)).current;
  const locationSubscription = React.useRef<Location.LocationSubscription | null>(
    null,
  );
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [selectedId, setSelectedId] = React.useState<string | null>(
    campusLocations[0]?.id ?? null,
  );
  const [trackingState, setTrackingState] =
    React.useState<TrackingState>("idle");
  const [userMarker, setUserMarker] = React.useState<UserMarker | null>(null);

  React.useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    return () => {
      locationSubscription.current?.remove();
    };
  }, [entry]);

  React.useEffect(() => {
    if (!selectedId && campusLocations.length > 0) {
      setSelectedId(campusLocations[0].id);
    }
  }, [campusLocations, selectedId]);

  const categories = React.useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(campusLocations.map((location) => location.category)),
      ),
    ],
    [campusLocations],
  );

  const visibleLocations = React.useMemo(() => {
    const cleanQuery = normalize(query);

    return campusLocations.filter((location) => {
      const matchesCategory =
        activeCategory === "All" || location.category === activeCategory;
      const matchesQuery =
        !cleanQuery ||
        [
          location.name,
          location.category,
          location.description,
          ...location.nearby,
          ...location.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(cleanQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, campusLocations, query]);

  const selectedLocation =
    campusLocations.find((location) => location.id === selectedId) ??
    visibleLocations[0] ??
    campusLocations[0];

  const collegeCount = campusLocations.filter(
    (location) => location.category === "College",
  ).length;

  const stopTracking = () => {
    locationSubscription.current?.remove();
    locationSubscription.current = null;
    setUserMarker(null);
    setTrackingState("idle");
  };

  const applyDeviceLocation = (location: Location.LocationObject) => {
    const marker = projectCoordinate(
      location.coords.latitude,
      location.coords.longitude,
    );

    setUserMarker({
      ...marker,
      accuracy: location.coords.accuracy,
    });
  };

  const toggleTracking = async () => {
    if (locationSubscription.current) {
      stopTracking();
      return;
    }

    setTrackingState("loading");

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setTrackingState("denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      applyDeviceLocation(currentLocation);

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 5,
          timeInterval: 3000,
        },
        applyDeviceLocation,
      );
      setTrackingState("active");
    } catch {
      setTrackingState("error");
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/");
    }
  };

  const openAdminConsole = () => {
    router.push("/screens/AdminPanel" as any);
  };

  const isWide = width >= 760;

  return (
    <SecondaryScreenLayout
      title="Campus Map"
      description="Explore MSU Main Campus colleges, offices, student services, and landmarks."
      onBack={handleBack}
    >
      <Animated.View
        style={[
          styles.shell,
          isWide && styles.shellWide,
          {
            opacity: entry,
            transform: [
              {
                translateY: entry.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.toolBar}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={19} color={colors.maroon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search colleges, offices, landmarks..."
              placeholderTextColor="#8B7D7D"
              value={query}
              onChangeText={setQuery}
            />
            {query ? (
              <Pressable onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={19} color={colors.muted} />
              </Pressable>
            ) : null}
          </View>

          <View style={styles.quickActions}>
            <Pressable
              style={[
                styles.trackButton,
                trackingState === "active" && styles.trackButtonActive,
              ]}
              onPress={toggleTracking}
            >
              <Ionicons
                name={
                  trackingState === "active" ? "navigate" : "navigate-outline"
                }
                size={17}
                color={
                  trackingState === "active" ? colors.surface : colors.maroon
                }
              />
              <Text
                style={[
                  styles.trackButtonText,
                  trackingState === "active" && styles.trackButtonTextActive,
                ]}
              >
                {trackingState === "loading"
                  ? "Locating"
                  : trackingState === "active"
                    ? "Live"
                    : "Track me"}
              </Text>
            </Pressable>

            {session?.role === "admin" ? (
              <Pressable style={styles.adminButton} onPress={openAdminConsole}>
                <Ionicons
                  name="create-outline"
                  size={17}
                  color={colors.surface}
                />
                <Text style={styles.adminButtonText}>Admin</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <Pressable
                key={category}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setActiveCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    active && styles.categoryChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{collegeCount}</Text>
            <Text style={styles.summaryLabel}>Colleges</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{campusLocations.length}</Text>
            <Text style={styles.summaryLabel}>Mapped Spots</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{visibleLocations.length}</Text>
            <Text style={styles.summaryLabel}>Visible</Text>
          </View>
        </View>

        <View style={styles.mapShell}>
          <View style={[styles.mapBoard, isWide && styles.mapBoardWide]}>
            <View style={[styles.zone, styles.zoneNorth]}>
              <Text style={styles.zoneLabel}>Main Gate</Text>
            </View>
            <View style={[styles.zone, styles.zoneLake]}>
              <Text style={styles.zoneLabel}>Lake Lanao Edge</Text>
            </View>
            <View style={[styles.road, styles.mainRoad]} />
            <View style={[styles.road, styles.firstStreet]} />
            <View style={[styles.road, styles.southRoad]} />
            <View style={[styles.road, styles.eastConnector]} />

            {visibleLocations.map((location) => {
              const selected = selectedLocation?.id === location.id;
              const markerColor =
                categoryColors[location.category] ?? colors.maroon;
              const Icon =
                categoryIcons[location.category] ?? "location-outline";

              return (
                <Pressable
                  key={location.id}
                  style={[
                    styles.marker,
                    {
                      left: `${location.mapX}%`,
                      top: `${location.mapY}%`,
                      borderColor: markerColor,
                      zIndex: selected ? 12 : 8,
                    },
                    selected && styles.markerSelected,
                  ]}
                  onPress={() => setSelectedId(location.id)}
                >
                  <View
                    style={[
                      styles.markerIcon,
                      { backgroundColor: markerColor },
                      selected && styles.markerIconSelected,
                    ]}
                  >
                    <Ionicons name={Icon} size={14} color={colors.surface} />
                  </View>
                  <Text
                    style={[
                      styles.markerText,
                      selected && styles.markerTextSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {getMarkerLabel(location)}
                  </Text>
                </Pressable>
              );
            })}

            {userMarker ? (
              <View
                style={[
                  styles.userMarker,
                  {
                    left: `${userMarker.mapX}%`,
                    top: `${userMarker.mapY}%`,
                  },
                ]}
              >
                <View style={styles.userPulse} />
                <Ionicons name="person" size={16} color={colors.surface} />
              </View>
            ) : null}
          </View>
        </View>

        {trackingState === "denied" ? (
          <Text style={styles.statusText}>Location permission was not granted.</Text>
        ) : trackingState === "error" ? (
          <Text style={styles.statusText}>Location is unavailable right now.</Text>
        ) : userMarker && !userMarker.insideCampus ? (
          <Text style={styles.statusText}>
            Your GPS point is outside the campus bounds, so the marker is pinned
            to the nearest map edge.
          </Text>
        ) : userMarker?.accuracy ? (
          <Text style={styles.statusText}>
            Live accuracy: about {Math.round(userMarker.accuracy)} meters.
          </Text>
        ) : null}

        {selectedLocation ? (
          <View style={styles.detailPanel}>
            <View style={styles.detailHeader}>
              <View style={styles.detailTitleWrap}>
                <Text style={styles.detailKicker}>
                  {selectedLocation.category}
                </Text>
                <Text style={styles.detailTitle}>{selectedLocation.name}</Text>
              </View>
              <View
                style={[
                  styles.detailIcon,
                  {
                    backgroundColor:
                      categoryColors[selectedLocation.category] ??
                      colors.maroon,
                  },
                ]}
              >
                <Ionicons
                  name={
                    categoryIcons[selectedLocation.category] ??
                    "location-outline"
                  }
                  size={20}
                  color={colors.surface}
                />
              </View>
            </View>

            <Text style={styles.detailBody}>{selectedLocation.description}</Text>

            <View style={styles.metaGroup}>
              <Text style={styles.metaLabel}>Nearby</Text>
              <View style={styles.chipWrap}>
                {selectedLocation.nearby.map((item) => (
                  <Text key={item} style={styles.metaChip}>
                    {item}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.metaGroup}>
              <Text style={styles.metaLabel}>Tags</Text>
              <View style={styles.chipWrap}>
                {selectedLocation.tags.map((tag) => (
                  <Text key={tag} style={styles.tagChip}>
                    {tag}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.locationList}>
          <Text style={styles.listTitle}>Locations</Text>
          {visibleLocations.map((location) => (
            <Pressable
              key={location.id}
              style={[
                styles.locationRow,
                selectedLocation?.id === location.id && styles.locationRowActive,
              ]}
              onPress={() => setSelectedId(location.id)}
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
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.muted}
              />
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </SecondaryScreenLayout>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    gap: 14,
  },
  shellWide: {
    maxWidth: maxContentWidth,
    alignSelf: "center",
  },
  toolBar: {
    gap: 10,
  },
  searchBox: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  trackButton: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  trackButtonActive: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  trackButtonText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: "900",
  },
  trackButtonTextActive: {
    color: colors.surface,
  },
  adminButton: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.maroon,
  },
  adminButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "900",
  },
  categoryRow: {
    gap: 8,
    paddingRight: 18,
  },
  categoryChip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  categoryChipActive: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  categoryChipText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  categoryChipTextActive: {
    color: colors.surface,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryItem: {
    flex: 1,
    minHeight: 70,
    justifyContent: "center",
    padding: 13,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  summaryValue: {
    color: colors.maroon,
    fontSize: 20,
    fontWeight: "900",
  },
  summaryLabel: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
  },
  mapShell: {
    overflow: "hidden",
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  mapBoard: {
    position: "relative",
    width: "100%",
    aspectRatio: 0.78,
    minHeight: 520,
    overflow: "hidden",
    backgroundColor: "#F5EFE4",
  },
  mapBoardWide: {
    aspectRatio: 1.42,
    minHeight: 560,
  },
  zone: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(122, 11, 20, 0.08)",
  },
  zoneNorth: {
    top: 0,
    left: 0,
    right: 0,
    height: "14%",
    backgroundColor: "#EFE3D0",
  },
  zoneLake: {
    bottom: -24,
    left: -26,
    width: "48%",
    height: "22%",
    borderRadius: 80,
    backgroundColor: colors.blueSoft,
  },
  zoneLabel: {
    color: "rgba(37, 29, 31, 0.42)",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  road: {
    position: "absolute",
    borderRadius: radii.pill,
    backgroundColor: "rgba(216, 180, 70, 0.34)",
    borderWidth: 1,
    borderColor: "rgba(137, 101, 17, 0.1)",
  },
  mainRoad: {
    top: "6%",
    bottom: "10%",
    left: "49%",
    width: 12,
  },
  firstStreet: {
    top: "30%",
    left: "14%",
    right: "13%",
    height: 11,
  },
  southRoad: {
    top: "68%",
    left: "20%",
    right: "12%",
    height: 11,
  },
  eastConnector: {
    top: "32%",
    right: "20%",
    width: 10,
    height: "40%",
  },
  marker: {
    position: "absolute",
    width: 58,
    minHeight: 42,
    alignItems: "center",
    marginLeft: -29,
    marginTop: -21,
  },
  markerSelected: {
    transform: [{ scale: 1.08 }],
  },
  markerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  markerIconSelected: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  markerText: {
    maxWidth: 58,
    marginTop: 3,
    paddingHorizontal: 5,
    paddingVertical: 3,
    overflow: "hidden",
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.86)",
    color: colors.maroonDark,
    fontSize: 9,
    fontWeight: "900",
    textAlign: "center",
  },
  markerTextSelected: {
    backgroundColor: colors.maroonDark,
    color: colors.surface,
  },
  userMarker: {
    position: "absolute",
    width: 34,
    height: 34,
    marginLeft: -17,
    marginTop: -17,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.teal,
    borderWidth: 3,
    borderColor: colors.surface,
    zIndex: 20,
  },
  userPulse: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(15, 118, 110, 0.15)",
  },
  statusText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
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
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  detailTitle: {
    marginTop: 5,
    color: colors.maroonDark,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "900",
  },
  detailIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  detailBody: {
    marginTop: 12,
    color: colors.ink,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
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
  locationList: {
    gap: 10,
  },
  listTitle: {
    color: colors.maroonDark,
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
    backgroundColor: "#FFFDFC",
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
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "900",
  },
  rowSubtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
  },
});
