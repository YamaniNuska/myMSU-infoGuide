import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Animated,
  Image,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";
import type { CampusLocation } from "../../data/mymsuDatabase";
import { colors, radii, shadow } from "../../theme";
import CampusMapSplash from "./CampusMapSplash";
import { MAP_ASPECT_RATIO, campusMapImage } from "./mapAssets";
import { clamp, getLocationPoint, getMarkerLabel } from "./mapMath";
import { categoryIcons, getLocationColor } from "./mapTheme";
import RouteOverlay from "./RouteOverlay";
import TrackingCat, { type CatMood } from "./TrackingCat";
import type { MapPoint, TrackingState, UserMarker } from "./types";

type CampusMapCanvasProps = {
  visibleLocations: CampusLocation[];
  selectedLocation?: CampusLocation;
  userMarker: UserMarker | null;
  trackingState: TrackingState;
  mapZoom: number;
  mapRotation: number;
  resetSignal: number;
  routePoints: MapPoint[];
  routeFlow: Animated.Value;
  userPulse: Animated.Value;
  catMotion: Animated.Value;
  catMood: CatMood;
  catMessage?: string;
  isWide: boolean;
  onSelectLocation: (id: string) => void;
  onCatPress: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onResetMapView: () => void;
  onZoomChange: (zoom: number) => void;
};

export default function CampusMapCanvas({
  visibleLocations,
  selectedLocation,
  userMarker,
  trackingState,
  mapZoom,
  mapRotation,
  resetSignal,
  routePoints,
  routeFlow,
  userPulse,
  catMotion,
  catMood,
  catMessage,
  isWide,
  onSelectLocation,
  onCatPress,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onResetMapView,
  onZoomChange,
}: CampusMapCanvasProps) {
  const [mapSize, setMapSize] = React.useState({ width: 0, height: 0 });
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });
  const [showMapSplash, setShowMapSplash] = React.useState(true);
  const panOffsetRef = React.useRef({ x: 0, y: 0 });
  const panStartRef = React.useRef({ x: 0, y: 0 });
  const pinchStartRef = React.useRef<{
    distance: number;
    zoom: number;
  } | null>(null);
  const trackingActive = trackingState === "active" && !!userMarker;
  const findingUser = trackingState === "loading";
  const activeMapZoom = trackingActive ? Math.max(mapZoom, 1.24) : mapZoom;
  const normalizedRotation = ((mapRotation % 360) + 360) % 360;

  // Scale markers inversely with zoom to prevent them from getting too large
  const markerScaleFactor = isWide
    ? Math.max(0.48, 1 / Math.sqrt(activeMapZoom))
    : Math.max(0.72, 1 / Math.sqrt(activeMapZoom));

  const clampPanOffset = React.useCallback(
    (offset: { x: number; y: number }) => {
      const maxX = Math.max(
        0,
        (mapSize.width * activeMapZoom - mapSize.width) / 2,
      );
      const maxY = Math.max(
        0,
        (mapSize.height * activeMapZoom - mapSize.height) / 2,
      );

      return {
        x: clamp(offset.x, -maxX, maxX),
        y: clamp(offset.y, -maxY, maxY),
      };
    },
    [activeMapZoom, mapSize.height, mapSize.width],
  );

  const setClampedPanOffset = React.useCallback(
    (offset: { x: number; y: number }) => {
      const nextOffset = clampPanOffset(offset);
      panOffsetRef.current = nextOffset;
      setPanOffset(nextOffset);
    },
    [clampPanOffset],
  );

  React.useEffect(() => {
    setClampedPanOffset(panOffsetRef.current);
  }, [activeMapZoom, mapSize.height, mapSize.width, setClampedPanOffset]);

  React.useEffect(() => {
    setClampedPanOffset({ x: 0, y: 0 });
    pinchStartRef.current = null;
  }, [resetSignal, setClampedPanOffset]);

  const getTouchDistance = React.useCallback((touches: ArrayLike<any>) => {
    if (touches.length < 2) {
      return 0;
    }

    const first = touches[0];
    const second = touches[1];
    const dx = first.pageX - second.pageX;
    const dy = first.pageY - second.pageY;

    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (event) =>
          (event.nativeEvent.touches ?? []).length >= 2,
        onMoveShouldSetPanResponder: (event, gesture) =>
          (event.nativeEvent.touches ?? []).length >= 2 ||
          Math.abs(gesture.dx) > 4 ||
          Math.abs(gesture.dy) > 4,
        onPanResponderGrant: (event) => {
          panStartRef.current = panOffsetRef.current;
          const distance = getTouchDistance(event.nativeEvent.touches ?? []);

          pinchStartRef.current =
            distance > 0 ? { distance, zoom: activeMapZoom } : null;
        },
        onPanResponderMove: (event, gesture) => {
          const touches = event.nativeEvent.touches ?? [];

          if (touches.length >= 2) {
            const distance = getTouchDistance(touches);
            const pinchStart = pinchStartRef.current;

            if (distance > 0 && pinchStart) {
              onZoomChange(
                clamp(
                  pinchStart.zoom * (distance / pinchStart.distance),
                  0.85,
                  2.4,
                ),
              );
            }

            return;
          }

          if (activeMapZoom <= 1.01) {
            return;
          }

          setClampedPanOffset({
            x: panStartRef.current.x + gesture.dx,
            y: panStartRef.current.y + gesture.dy,
          });
        },
        onPanResponderRelease: () => {
          panStartRef.current = panOffsetRef.current;
          pinchStartRef.current = null;
        },
        onPanResponderTerminate: () => {
          panStartRef.current = panOffsetRef.current;
          pinchStartRef.current = null;
        },
        onPanResponderTerminationRequest: () => true,
      }),
    [activeMapZoom, getTouchDistance, onZoomChange, setClampedPanOffset],
  );

  const routePixels = React.useMemo(
    () =>
      mapSize.width > 0 && mapSize.height > 0
        ? routePoints.map((point) => ({
            x: (point.mapX / 100) * mapSize.width,
            y: (point.mapY / 100) * mapSize.height,
          }))
        : [],
    [mapSize.height, mapSize.width, routePoints],
  );

  const followTranslate = React.useMemo(() => {
    if (!trackingActive || !userMarker || mapSize.width <= 0) {
      return { x: 0, y: 0 };
    }

    const centerX = mapSize.width / 2;
    const centerY = mapSize.height / 2;
    const markerX = (userMarker.mapX / 100) * mapSize.width;
    const markerY = (userMarker.mapY / 100) * mapSize.height;

    return {
      x: clamp(
        (centerX - markerX) * activeMapZoom,
        -mapSize.width * 0.34,
        mapSize.width * 0.34,
      ),
      y: clamp(
        (centerY - markerY) * activeMapZoom,
        -mapSize.height * 0.34,
        mapSize.height * 0.34,
      ),
    };
  }, [activeMapZoom, mapSize.height, mapSize.width, trackingActive, userMarker]);

  const userPulseScale = userPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.75, 2.25],
  });
  const userPulseOpacity = userPulse.interpolate({
    inputRange: [0, 0.72, 1],
    outputRange: [0.48, 0.12, 0],
  });
  const markerLift = catMotion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -4, 0],
  });
  const markerScale = catMotion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.08, 1],
  });
  const selectedMarkerScale = catMotion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1.08, 1.22, 1.08],
  });
  const markerHaloScale = catMotion.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0.72, 1.35, 0.72],
  });
  const markerHaloOpacity = catMotion.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0.28, 0.06, 0.28],
  });

  const handleMapLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setMapSize((currentSize) =>
      Math.abs(currentSize.width - width) < 1 &&
      Math.abs(currentSize.height - height) < 1
        ? currentSize
        : { width, height },
    );
  }, []);

  const metricLabel = trackingActive
    ? "Following"
    : findingUser
      ? "Finding"
      : `${Math.round(activeMapZoom * 100)}%`;

  return (
    <View style={styles.mapShell}>
      <View
        style={[
          styles.mapBoard,
          isWide ? styles.mapBoardWide : styles.mapBoardMobile,
        ]}
        onLayout={handleMapLayout}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={[
            styles.mapFollowLayer,
            {
              transform: [
                { translateX: followTranslate.x + panOffset.x },
                { translateY: followTranslate.y + panOffset.y },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.mapContent,
              {
                transform: [
                  { scale: activeMapZoom },
                  { rotate: `${mapRotation}deg` },
                ],
              },
            ]}
          >
            <Image
              source={campusMapImage}
              resizeMode="stretch"
              blurRadius={findingUser ? 5 : 0}
              style={[
                styles.mapBackground,
                findingUser && styles.mapBackgroundFinding,
              ]}
            />
            <View style={styles.mapTint} />

            {trackingActive && routePoints.length > 1 ? (
              <RouteOverlay
                routePoints={routePoints}
                routePixels={routePixels}
                routeFlow={routeFlow}
              />
            ) : null}

            {visibleLocations.map((location) => {
              const selected = selectedLocation?.id === location.id;
              const markerColor = getLocationColor(location);
              const Icon = categoryIcons[location.category] ?? "location-outline";
              const point = getLocationPoint(location);

              return (
                <Pressable
                  key={location.id}
                  style={[
                    styles.marker,
                    {
                      left: `${point.mapX}%`,
                      top: `${point.mapY}%`,
                      borderColor: markerColor,
                      zIndex: selected ? 15 : 8,
                      transform: [{ scale: markerScaleFactor }],
                    },
                    selected && styles.markerSelected,
                  ]}
                  onPress={() => onSelectLocation(location.id)}
                >
                  <Animated.View
                    style={[
                      styles.markerMotion,
                      {
                        transform: [
                          { translateY: markerLift },
                          { scale: selected ? selectedMarkerScale : markerScale },
                        ],
                      },
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.markerHalo,
                        {
                          backgroundColor: markerColor,
                          opacity: markerHaloOpacity,
                          transform: [{ scale: markerHaloScale }],
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.markerIcon,
                        { backgroundColor: markerColor },
                        selected && styles.markerIconSelected,
                      ]}
                    >
                      <Ionicons
                        name={Icon}
                        size={selected ? 16 : 15}
                        color={colors.surface}
                      />
                    </View>
                  </Animated.View>
                  <Animated.Text
                    style={[
                      styles.markerText,
                      { color: markerColor },
                      selected && styles.markerTextSelected,
                      selected && {
                        transform: [{ translateY: markerLift }],
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {getMarkerLabel(location)}
                  </Animated.Text>
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
                    transform: [{ scale: markerScaleFactor }],
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.userPulse,
                    {
                      opacity: userPulseOpacity,
                      transform: [{ scale: userPulseScale }],
                    },
                  ]}
                />
                <View style={styles.userMarkerCore}>
                  <Ionicons name="person" size={16} color={colors.surface} />
                </View>
              </View>
            ) : null}

          </Animated.View>
        </Animated.View>

        <View style={styles.mapVignette} />
        <View style={styles.mapControls}>
          <Pressable style={styles.mapControlButton} onPress={onZoomIn}>
            <Ionicons name="add" size={18} color={colors.maroonDark} />
          </Pressable>
          <Pressable style={styles.mapControlButton} onPress={onZoomOut}>
            <Ionicons name="remove" size={18} color={colors.maroonDark} />
          </Pressable>
          <Pressable style={styles.mapControlButton} onPress={onRotateLeft}>
            <Ionicons name="return-up-back" size={17} color={colors.maroonDark} />
          </Pressable>
          <Pressable style={styles.mapControlButton} onPress={onRotateRight}>
            <Ionicons
              name="return-up-forward"
              size={17}
              color={colors.maroonDark}
            />
          </Pressable>
          <Pressable style={styles.mapControlButton} onPress={onResetMapView}>
            <Ionicons name="locate" size={17} color={colors.maroonDark} />
          </Pressable>
        </View>
        <Text style={styles.mapMetric}>
          {metricLabel} / {normalizedRotation} deg
        </Text>
        <View style={styles.catDock}>
          <TrackingCat
            motion={catMotion}
            mood={catMood}
            message={catMessage}
            onPress={onCatPress}
          />
        </View>
        <Text style={styles.mapAttribution}>Mapcarta / Mapbox view</Text>
        {showMapSplash ? (
          <CampusMapSplash onFinish={() => setShowMapSplash(false)} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    aspectRatio: MAP_ASPECT_RATIO,
    overflow: "hidden",
    backgroundColor: "#E8E4DE",
  },
  mapBoardWide: {
    aspectRatio: MAP_ASPECT_RATIO,
  },
  mapBoardMobile: {
    aspectRatio: 1.16,
    minHeight: 300,
  },
  mapFollowLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContent: {
    ...StyleSheet.absoluteFillObject,
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  mapBackgroundFinding: {
    opacity: 0.76,
  },
  mapTint: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
    backgroundColor: "rgba(255, 252, 244, 0.08)",
  },
  mapVignette: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
    borderWidth: 1,
    borderColor: "rgba(37, 29, 31, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  mapControls: {
    position: "absolute",
    right: 12,
    top: 12,
    gap: 8,
  },
  mapControlButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderWidth: 1,
    borderColor: "rgba(37, 29, 31, 0.1)",
    ...shadow,
  },
  mapMetric: {
    position: "absolute",
    left: 10,
    top: 10,
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: colors.maroonDark,
    fontSize: 10,
    fontWeight: "900",
  },
  catDock: {
    position: "absolute",
    left: 12,
    bottom: 12,
    zIndex: 35,
  },
  mapAttribution: {
    position: "absolute",
    right: 9,
    bottom: 8,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    color: colors.muted,
    fontSize: 9,
    fontWeight: "800",
  },
  marker: {
    position: "absolute",
    width: 68,
    minHeight: 52,
    alignItems: "center",
    marginLeft: -34,
    marginTop: -28,
  },
  markerSelected: {
    zIndex: 18,
  },
  markerMotion: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  markerHalo: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    zIndex: 1,
  },
  markerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.surface,
    zIndex: 2,
    ...shadow,
  },
  markerIconSelected: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  markerText: {
    maxWidth: 68,
    marginTop: 1,
    paddingHorizontal: 6,
    paddingVertical: 4,
    overflow: "hidden",
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    color: colors.maroonDark,
    fontFamily: Platform.select({
      android: "sans-serif-medium",
      ios: "Avenir Next",
      default: "Segoe UI",
    }),
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "rgba(37, 29, 31, 0.08)",
  },
  markerTextSelected: {
    backgroundColor: colors.maroonDark,
    color: colors.surface,
    borderColor: "rgba(255, 255, 255, 0.45)",
  },
  userMarker: {
    position: "absolute",
    width: 46,
    height: 46,
    marginLeft: -23,
    marginTop: -23,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  userPulse: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(15, 118, 110, 0.28)",
  },
  userMarkerCore: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.teal,
    borderWidth: 3,
    borderColor: colors.surface,
  },
});
