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
import { useAuthSession } from "../../auth/localAuth";
import SecondaryScreenLayout from "../../components/SecondaryScreenLayout";
import { useAppData } from "../../data/appStore";
import CampusMapCanvas from "../../features/campusMap/CampusMapCanvas";
import LocationDetailPanel from "../../features/campusMap/LocationDetailPanel";
import LocationList from "../../features/campusMap/LocationList";
import PathPrompt from "../../features/campusMap/PathPrompt";
import {
  clamp,
  formatDistance,
  getLocationPoint,
  normalize,
  projectDeviceCoordinate,
} from "../../features/campusMap/mapMath";
import {
  buildRoadRoutePoints,
  getRouteDistanceMeters,
} from "../../features/campusMap/routing";
import type {
  TrackingState,
  UserMarker,
} from "../../features/campusMap/types";
import type { CatMood } from "../../features/campusMap/TrackingCat";
import { colors, maxContentWidth, radii } from "../../theme";

type CampusMapScreenProps = {
  onBack?: () => void;
};

const walkingCatMessages = [
  "You're doing great. Keep following the green road.",
  "Stay on this road, I'm with you.",
  "Nice pace. The route is still on track.",
  "Almost there, just keep going.",
  "Small steps count. We're getting closer.",
  "Follow the green line and breathe easy.",
];

export default function CampusMapScreen({ onBack }: CampusMapScreenProps) {
  const router = useRouter();
  const session = useAuthSession();
  const { campusLocations } = useAppData();
  const { width } = useWindowDimensions();
  const entry = React.useRef(new Animated.Value(0)).current;
  const routeFlow = React.useRef(new Animated.Value(0)).current;
  const userPulse = React.useRef(new Animated.Value(0)).current;
  const catMotion = React.useRef(new Animated.Value(0)).current;
  const locationSubscription = React.useRef<Location.LocationSubscription | null>(
    null,
  );
  const catMessageTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const catEncouragementTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [selectedId, setSelectedId] = React.useState<string | null>(
    campusLocations[0]?.id ?? null,
  );
  const [pathPromptId, setPathPromptId] = React.useState<string | null>(null);
  const [routeDestinationId, setRouteDestinationId] = React.useState<
    string | null
  >(null);
  const [hasArrived, setHasArrived] = React.useState(false);
  const [catMessageOverride, setCatMessageOverride] = React.useState<
    string | null
  >(null);
  const [catEncouragement, setCatEncouragement] = React.useState<string | null>(
    null,
  );
  const [trackingState, setTrackingState] =
    React.useState<TrackingState>("idle");
  const [userMarker, setUserMarker] = React.useState<UserMarker | null>(null);
  const [mapZoom, setMapZoom] = React.useState(1);
  const [mapRotation, setMapRotation] = React.useState(0);

  React.useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const routeLoop = Animated.loop(
      Animated.timing(routeFlow, {
        toValue: 1,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const pulseLoop = Animated.loop(
      Animated.timing(userPulse, {
        toValue: 1,
        duration: 1700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    const catLoop = Animated.loop(
      Animated.timing(catMotion, {
        toValue: 1,
        duration: 1450,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    );
    routeLoop.start();
    pulseLoop.start();
    catLoop.start();

    return () => {
      routeLoop.stop();
      pulseLoop.stop();
      catLoop.stop();
      locationSubscription.current?.remove();
      if (catMessageTimer.current) {
        clearTimeout(catMessageTimer.current);
      }
      if (catEncouragementTimer.current) {
        clearTimeout(catEncouragementTimer.current);
      }
    };
  }, [catMotion, entry, routeFlow, userPulse]);

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
          location.street ?? "",
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
  const pathPromptLocation = campusLocations.find(
    (location) => location.id === pathPromptId,
  );
  const routeDestinationLocation = campusLocations.find(
    (location) => location.id === routeDestinationId,
  );
  const routeDestinationPoint = React.useMemo(
    () =>
      routeDestinationLocation
        ? getLocationPoint(routeDestinationLocation)
        : null,
    [routeDestinationLocation],
  );
  const trackingActive = trackingState === "active" && !!userMarker;
  const routePoints = React.useMemo(
    () =>
      trackingActive &&
      userMarker &&
      routeDestinationPoint &&
      routeDestinationLocation
        ? buildRoadRoutePoints(
            userMarker,
            routeDestinationPoint,
            routeDestinationLocation.id,
          )
        : [],
    [
      routeDestinationLocation,
      routeDestinationPoint,
      trackingActive,
      userMarker,
    ],
  );
  const routeDistance = React.useMemo(
    () =>
      trackingActive &&
      userMarker &&
      routeDestinationPoint &&
      routeDestinationLocation
        ? getRouteDistanceMeters(
            userMarker,
            routeDestinationPoint,
            routeDestinationLocation.id,
          )
        : null,
    [
      routeDestinationLocation,
      routeDestinationPoint,
      trackingActive,
      userMarker,
    ],
  );
  const collegeCount = React.useMemo(
    () =>
      campusLocations.filter((location) => location.category === "College")
        .length,
    [campusLocations],
  );
  const routeActive =
    trackingActive && !!routeDestinationLocation && routePoints.length > 1;

  const showTemporaryCatMessage = React.useCallback((message: string) => {
    setCatMessageOverride(message);

    if (catMessageTimer.current) {
      clearTimeout(catMessageTimer.current);
    }

    catMessageTimer.current = setTimeout(
      () => setCatMessageOverride(null),
      1600,
    );
  }, []);

  React.useEffect(() => {
    if (!routeDestinationId || !trackingActive || routeDistance === null) {
      if (hasArrived) {
        setHasArrived(false);
      }
      return;
    }

    if (routeDistance <= 25 && !hasArrived) {
      setHasArrived(true);
      return;
    }

    if (routeDistance > 45 && hasArrived) {
      setHasArrived(false);
    }
  }, [hasArrived, routeDestinationId, routeDistance, trackingActive]);

  React.useEffect(() => {
    if (!routeActive || hasArrived) {
      setCatEncouragement(null);
      if (catEncouragementTimer.current) {
        clearTimeout(catEncouragementTimer.current);
        catEncouragementTimer.current = null;
      }
      return;
    }

    const scheduleNextMessage = () => {
      const delay = 7000 + Math.round(Math.random() * 6000);

      catEncouragementTimer.current = setTimeout(() => {
        const nextMessage =
          routeDistance !== null && routeDistance <= 90
            ? "You're almost there. Keep following the green road."
            : walkingCatMessages[
                Math.floor(Math.random() * walkingCatMessages.length)
              ];

        setCatEncouragement(nextMessage);
        catEncouragementTimer.current = setTimeout(() => {
          setCatEncouragement(null);
          scheduleNextMessage();
        }, 2600);
      }, delay);
    };

    scheduleNextMessage();

    return () => {
      if (catEncouragementTimer.current) {
        clearTimeout(catEncouragementTimer.current);
        catEncouragementTimer.current = null;
      }
    };
  }, [hasArrived, routeActive, routeDistance]);

  const catMood: CatMood = catMessageOverride
    ? "pet"
    : hasArrived
      ? "arrived"
      : routeActive
        ? "walking"
        : pathPromptLocation
          ? "prompt"
          : "idle";
  const catMessage =
    catMessageOverride ??
    catEncouragement ??
    (hasArrived
      ? "We have arrived."
      : routeActive && routeDestinationLocation
        ? routeDistance !== null && routeDistance <= 90
          ? "You're almost there."
          : `Follow the green road to ${routeDestinationLocation.name}.`
        : pathPromptLocation
          ? "Find path?"
          : trackingState === "loading"
            ? "Finding you..."
            : "Tap a place and I can guide you.");

  const stopTracking = () => {
    locationSubscription.current?.remove();
    locationSubscription.current = null;
    setUserMarker(null);
    setTrackingState("idle");
    setRouteDestinationId(null);
    setPathPromptId(null);
    setHasArrived(false);
  };

  const applyDeviceLocation = (location: Location.LocationObject) => {
    const marker = projectDeviceCoordinate(
      location.coords.latitude,
      location.coords.longitude,
    );

    setUserMarker({
      ...marker,
      accuracy: location.coords.accuracy,
    });
  };

  const handleSelectLocation = React.useCallback(
    (id: string) => {
      const needsNewRoute = routeDestinationId !== id;

      setSelectedId(id);
      setPathPromptId(needsNewRoute ? id : null);
      setHasArrived(false);
      if (needsNewRoute) {
        setRouteDestinationId(null);
      }
      routeFlow.setValue(0);
    },
    [routeDestinationId, routeFlow],
  );

  const startTracking = async () => {
    if (locationSubscription.current) {
      return true;
    }

    setTrackingState("loading");

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setTrackingState("denied");
        return false;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      applyDeviceLocation(currentLocation);
      setMapZoom((value) => Math.max(value, 1.24));
      setMapRotation(0);

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 5,
          timeInterval: 3000,
        },
        applyDeviceLocation,
      );
      setTrackingState("active");
      return true;
    } catch {
      setTrackingState("error");
      return false;
    }
  };

  const toggleTracking = async () => {
    if (locationSubscription.current) {
      stopTracking();
      return;
    }

    await startTracking();
  };

  const beginPathToLocation = async (id: string) => {
    const destination = campusLocations.find((location) => location.id === id);

    if (!destination) {
      return;
    }

    setSelectedId(id);
    setPathPromptId(null);
    setHasArrived(false);
    routeFlow.setValue(0);

    const trackingReady = await startTracking();

    if (!trackingReady) {
      setPathPromptId(id);
      showTemporaryCatMessage("I need live tracking first.");
      return;
    }

    setRouteDestinationId(destination.id);
    setMapZoom((value) => Math.max(value, 1.24));
    setMapRotation(0);
    showTemporaryCatMessage(`Path set to ${destination.name}.`);
  };

  const cancelPathPrompt = () => {
    setPathPromptId(null);
  };

  const handleCatPress = () => {
    showTemporaryCatMessage(
      hasArrived
        ? "We made it!"
        : routeActive
          ? "You're doing great. Stay with the green road."
          : "Tap a place first.",
    );
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/");
    }
  };

  const openAdminConsole = () => {
    router.push("/screens/AdminPanel");
  };

  const zoomIn = () => setMapZoom((value) => clamp(value + 0.2, 0.85, 2.2));
  const zoomOut = () => setMapZoom((value) => clamp(value - 0.2, 0.85, 2.2));
  const rotateLeft = () => setMapRotation((value) => value - 15);
  const rotateRight = () => setMapRotation((value) => value + 15);
  const resetMapView = () => {
    setMapZoom(1);
    setMapRotation(0);
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
                <Pressable
                  style={styles.adminButton}
                  onPress={openAdminConsole}
                >
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
                  style={[
                    styles.categoryChip,
                    active && styles.categoryChipActive,
                  ]}
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

          <CampusMapCanvas
            visibleLocations={visibleLocations}
            selectedLocation={selectedLocation}
            userMarker={userMarker}
            trackingState={trackingState}
            mapZoom={mapZoom}
            mapRotation={mapRotation}
            routePoints={routePoints}
            routeFlow={routeFlow}
            userPulse={userPulse}
            catMotion={catMotion}
            catMood={catMood}
            catMessage={catMessage}
            isWide={isWide}
            onSelectLocation={handleSelectLocation}
            onCatPress={handleCatPress}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onRotateLeft={rotateLeft}
            onRotateRight={rotateRight}
            onResetMapView={resetMapView}
          />

          {pathPromptLocation ? (
            <PathPrompt
              location={pathPromptLocation}
              needsTracking={!trackingActive}
              onConfirm={() => beginPathToLocation(pathPromptLocation.id)}
              onCancel={cancelPathPrompt}
            />
          ) : null}

          {trackingState === "denied" ? (
            <Text style={styles.statusText}>
              Location permission was not granted.
            </Text>
          ) : trackingState === "error" ? (
            <Text style={styles.statusText}>Location is unavailable right now.</Text>
          ) : trackingState === "loading" ? (
            <Text style={styles.statusText}>
              Finding your live position on the campus map...
            </Text>
          ) : userMarker && !userMarker.insideCampus ? (
            <Text style={styles.statusText}>
              Your GPS point is outside the campus bounds, so the marker is pinned
              to the nearest map edge.
            </Text>
          ) : hasArrived && routeDestinationLocation ? (
            <Text style={styles.statusText}>
              Arrived at {routeDestinationLocation.name}.
            </Text>
          ) : routeActive && routeDistance && routeDestinationLocation ? (
            <Text style={styles.statusText}>
              Road route: {formatDistance(routeDistance)} to{" "}
              {routeDestinationLocation.name}.
            </Text>
          ) : userMarker?.accuracy ? (
            <Text style={styles.statusText}>
              Live accuracy: about {Math.round(userMarker.accuracy)} meters.
            </Text>
          ) : null}

          {selectedLocation ? (
            <LocationDetailPanel
              location={selectedLocation}
              routeDistance={
                routeDestinationId === selectedLocation.id && routeActive
                  ? routeDistance
                  : null
              }
            />
          ) : null}

          <LocationList
            locations={visibleLocations}
            selectedId={selectedLocation?.id}
            onSelectLocation={handleSelectLocation}
          />
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
  statusText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
});
