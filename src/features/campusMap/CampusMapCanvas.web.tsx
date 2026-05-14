import Ionicons from "@expo/vector-icons/Ionicons";
import type {
  Circle,
  CircleMarker,
  LatLngBoundsExpression,
  LatLngTuple,
  Map as LeafletMap,
  Marker,
  Polyline,
} from "leaflet";
import React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { CampusLocation } from "../../data/mymsuDatabase";
import { colors, radii, shadow } from "../../theme";
import { CAMPUS_BOUNDS, getMarkerLabel } from "./mapMath";
import { categoryIcons, getLocationColor } from "./mapTheme";
import TrackingCat, { type CatMood } from "./TrackingCat";
import type { MapPoint, TrackingState, UserMarker } from "./types";

type LeafletModule = typeof import("leaflet");

type CampusMapCanvasProps = {
  visibleLocations: CampusLocation[];
  selectedLocation?: CampusLocation;
  userMarker: UserMarker | null;
  trackingState: TrackingState;
  mapZoom: number;
  mapRotation: number;
  resetSignal: number;
  routePoints?: MapPoint[];
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

const campusCenter: LatLngTuple = [7.99705, 124.26045];
const styleElementId = "mymsu-leaflet-campus-map-styles";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const pointToLatLng = (point: MapPoint): LatLngTuple => [
  CAMPUS_BOUNDS.north -
    (point.mapY / 100) * (CAMPUS_BOUNDS.north - CAMPUS_BOUNDS.south),
  CAMPUS_BOUNDS.west +
    (point.mapX / 100) * (CAMPUS_BOUNDS.east - CAMPUS_BOUNDS.west),
];

const locationToLatLng = (location: CampusLocation): LatLngTuple =>
  typeof location.latitude === "number" && typeof location.longitude === "number"
    ? [location.latitude, location.longitude]
    : pointToLatLng(location);

const userToLatLng = (marker: UserMarker): LatLngTuple =>
  marker.insideCampus &&
  typeof marker.latitude === "number" &&
  typeof marker.longitude === "number"
    ? [marker.latitude, marker.longitude]
    : pointToLatLng(marker);

const getAllLocationBounds = (locations: CampusLocation[]) =>
  locations.length > 0
    ? locations.map(locationToLatLng)
    : ([
        [CAMPUS_BOUNDS.south, CAMPUS_BOUNDS.west],
        [CAMPUS_BOUNDS.north, CAMPUS_BOUNDS.east],
      ] as LatLngBoundsExpression);

const ensureLeafletStyles = () => {
  if (typeof document === "undefined" || document.getElementById(styleElementId)) {
    return;
  }

  const style = document.createElement("style");
  style.id = styleElementId;
  style.textContent = `
    .leaflet-container {
      position: relative;
      overflow: hidden;
      background: #d9e6cf;
      outline: 0;
      touch-action: pan-x pan-y;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .leaflet-pane,
    .leaflet-tile,
    .leaflet-marker-icon,
    .leaflet-marker-shadow,
    .leaflet-tile-container,
    .leaflet-pane > svg,
    .leaflet-pane > canvas,
    .leaflet-zoom-box,
    .leaflet-image-layer,
    .leaflet-layer {
      position: absolute;
      left: 0;
      top: 0;
    }
    .leaflet-container img.leaflet-tile {
      max-width: none !important;
      max-height: none !important;
      width: 256px;
      height: 256px;
    }
    .leaflet-tile,
    .leaflet-marker-icon,
    .leaflet-marker-shadow {
      user-select: none;
      -webkit-user-drag: none;
    }
    .leaflet-tile-container {
      pointer-events: none;
    }
    .leaflet-tile-pane {
      z-index: 200;
    }
    .leaflet-overlay-pane {
      z-index: 400;
    }
    .leaflet-shadow-pane {
      z-index: 500;
    }
    .leaflet-marker-pane {
      z-index: 600;
    }
    .leaflet-tooltip-pane {
      z-index: 650;
    }
    .leaflet-popup-pane {
      z-index: 700;
    }
    .leaflet-zoom-animated {
      transform-origin: 0 0;
    }
    .leaflet-interactive {
      cursor: pointer;
    }
    .leaflet-grab {
      cursor: grab;
    }
    .leaflet-dragging .leaflet-grab {
      cursor: grabbing;
    }
    .leaflet-control-container .leaflet-top,
    .leaflet-control-container .leaflet-bottom {
      position: absolute;
      z-index: 1000;
      pointer-events: none;
    }
    .leaflet-top {
      top: 0;
    }
    .leaflet-right {
      right: 0;
    }
    .leaflet-bottom {
      bottom: 0;
    }
    .leaflet-left {
      left: 0;
    }
    .leaflet-control {
      position: relative;
      z-index: 800;
      pointer-events: auto;
    }
    .leaflet-left .leaflet-control {
      margin-left: 12px;
    }
    .leaflet-top .leaflet-control {
      margin-top: 12px;
    }
    .leaflet-right .leaflet-control {
      margin-right: 12px;
    }
    .leaflet-bottom .leaflet-control {
      margin-bottom: 12px;
    }
    .leaflet-control-zoom {
      border: 1px solid rgba(37, 29, 31, 0.1);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 8px 18px rgba(29, 11, 11, 0.16);
    }
    .leaflet-control-zoom a {
      display: block;
      width: 34px;
      height: 34px;
      background: rgba(255, 255, 255, 0.96);
      color: #3A080D;
      font-size: 20px;
      font-weight: 800;
      line-height: 34px;
      text-align: center;
      text-decoration: none;
      border-bottom: 1px solid rgba(37, 29, 31, 0.08);
    }
    .leaflet-control-zoom a:last-child {
      border-bottom: 0;
    }
    .leaflet-control-attribution {
      padding: 4px 7px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.9);
      color: #5C5050;
      font-size: 10px;
    }
    .leaflet-control-attribution a {
      color: #3A080D;
    }
    .leaflet-popup {
      position: absolute;
      margin-bottom: 20px;
      text-align: left;
    }
    .leaflet-popup-content-wrapper {
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 12px 24px rgba(29, 11, 11, 0.22);
    }
    .leaflet-popup-content {
      margin: 12px 14px;
    }
    .leaflet-popup-tip-container {
      position: absolute;
      left: 50%;
      width: 24px;
      height: 14px;
      margin-left: -12px;
      overflow: hidden;
      pointer-events: none;
    }
    .leaflet-popup-tip {
      width: 14px;
      height: 14px;
      margin: -7px auto 0;
      background: #fff;
      transform: rotate(45deg);
      box-shadow: 0 4px 10px rgba(29, 11, 11, 0.16);
    }
    .leaflet-popup-close-button {
      position: absolute;
      top: 4px;
      right: 8px;
      color: #5C5050;
      text-decoration: none;
      font-size: 18px;
      font-weight: 700;
    }
    .mymsu-leaflet-location-icon,
    .mymsu-leaflet-user-icon {
      background: transparent;
      border: 0;
    }
    .mymsu-leaflet-marker {
      position: relative;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 20px;
      border: 3px solid #fff;
      color: #fff;
      box-shadow: 0 8px 18px rgba(29, 11, 11, 0.22);
    }
    .mymsu-leaflet-marker::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -8px;
      width: 13px;
      height: 13px;
      background: inherit;
      border-right: 3px solid #fff;
      border-bottom: 3px solid #fff;
      transform: translateX(-50%) rotate(45deg);
      box-shadow: 4px 4px 10px rgba(29, 11, 11, 0.16);
    }
    .mymsu-leaflet-marker.is-selected {
      width: 48px;
      height: 48px;
      border-radius: 24px;
      transform: translate(-4px, -4px);
      box-shadow: 0 12px 26px rgba(58, 8, 13, 0.3);
    }
    .mymsu-leaflet-glyph {
      position: relative;
      z-index: 2;
      font-family: Ionicons;
      font-size: 20px;
      line-height: 1;
    }
    .mymsu-leaflet-label {
      position: absolute;
      left: 50%;
      top: 47px;
      max-width: 92px;
      transform: translateX(-50%);
      padding: 4px 7px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.94);
      color: #3A080D;
      border: 1px solid rgba(37, 29, 31, 0.1);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 10px;
      font-weight: 800;
      line-height: 1.1;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 5px 14px rgba(29, 11, 11, 0.12);
    }
    .mymsu-leaflet-marker.is-selected .mymsu-leaflet-label {
      top: 55px;
      background: #3A080D;
      color: #fff;
    }
    .mymsu-leaflet-user {
      position: relative;
      width: 34px;
      height: 34px;
      border-radius: 17px;
      border: 3px solid #fff;
      background: #0F766E;
      box-shadow: 0 8px 18px rgba(29, 11, 11, 0.22);
    }
    .mymsu-leaflet-user::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: 54px;
      height: 54px;
      margin: -27px 0 0 -27px;
      border-radius: 27px;
      background: rgba(15, 118, 110, 0.16);
      animation: mymsu-user-pulse 1.7s ease-out infinite;
    }
    @keyframes mymsu-user-pulse {
      from {
        transform: scale(0.65);
        opacity: 0.8;
      }
      to {
        transform: scale(1.4);
        opacity: 0;
      }
    }
    .mymsu-leaflet-popup .leaflet-popup-content {
      margin: 12px 14px;
      min-width: 190px;
      color: #251D1F;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.35;
    }
    .mymsu-popup-title {
      color: #3A080D;
      font-weight: 900;
      font-size: 14px;
    }
    .mymsu-popup-meta {
      margin-top: 3px;
      color: #936F18;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .mymsu-popup-body {
      margin-top: 7px;
      color: #5C5050;
      font-size: 12px;
    }
  `;
  document.head.appendChild(style);
};

const createLocationIcon = (
  leaflet: LeafletModule,
  location: CampusLocation,
  selected: boolean,
) => {
  const iconName = categoryIcons[location.category] ?? "location-outline";
  const glyph = Ionicons.glyphMap[iconName] ?? Ionicons.glyphMap["location-outline"];
  const color = getLocationColor(location);
  const label = escapeHtml(getMarkerLabel(location));
  const glyphHtml =
    typeof glyph === "number"
      ? `&#x${glyph.toString(16)};`
      : "&#9679;";

  return leaflet.divIcon({
    className: "mymsu-leaflet-location-icon",
    iconAnchor: selected ? [24, 54] : [20, 46],
    iconSize: selected ? [48, 70] : [40, 64],
    popupAnchor: [0, selected ? -54 : -46],
    html: `
      <div
        class="mymsu-leaflet-marker${selected ? " is-selected" : ""}"
        style="background:${color}"
      >
        <span class="mymsu-leaflet-glyph">${glyphHtml}</span>
        <span class="mymsu-leaflet-label">${label}</span>
      </div>
    `,
  });
};

const createUserIcon = (leaflet: LeafletModule) =>
  leaflet.divIcon({
    className: "mymsu-leaflet-user-icon",
    iconAnchor: [17, 17],
    iconSize: [34, 34],
    html: `<div class="mymsu-leaflet-user"></div>`,
  });

const createPopupHtml = (location: CampusLocation) => `
  <div class="mymsu-leaflet-popup">
    <div class="mymsu-popup-title">${escapeHtml(location.name)}</div>
    <div class="mymsu-popup-meta">${escapeHtml(location.category)}</div>
    <div class="mymsu-popup-body">${escapeHtml(location.description)}</div>
  </div>
`;

export default function CampusMapCanvas({
  visibleLocations,
  selectedLocation,
  userMarker,
  trackingState,
  resetSignal,
  routePoints = [],
  catMotion,
  catMood,
  catMessage,
  onSelectLocation,
  onCatPress,
}: CampusMapCanvasProps) {
  const { width } = useWindowDimensions();
  const mapElementRef = React.useRef<HTMLDivElement | null>(null);
  const leafletRef = React.useRef<LeafletModule | null>(null);
  const mapRef = React.useRef<LeafletMap | null>(null);
  const markersRef = React.useRef<Map<string, Marker>>(new Map());
  const routeLineRef = React.useRef<Polyline | null>(null);
  const routeHaloRef = React.useRef<Polyline | null>(null);
  const userMarkerRef = React.useRef<Marker | null>(null);
  const accuracyCircleRef = React.useRef<Circle | null>(null);
  const movementTrailRef = React.useRef<LatLngTuple[]>([]);
  const movementLineRef = React.useRef<Polyline | null>(null);
  const userPulseRef = React.useRef<CircleMarker | null>(null);
  const latestBoundsRef = React.useRef<LatLngBoundsExpression>(
    getAllLocationBounds(visibleLocations),
  );
  const [mapReady, setMapReady] = React.useState(false);
  const allBounds = React.useMemo(
    () => getAllLocationBounds(visibleLocations),
    [visibleLocations],
  );
  const trackingActive = trackingState === "active" && !!userMarker;
  const findingUser = trackingState === "loading";
  const compactMap = width < 760;

  React.useEffect(() => {
    latestBoundsRef.current = allBounds;
  }, [allBounds]);

  const fitCampus = React.useCallback(() => {
    const map = mapRef.current;

    if (!map || !mapReady) {
      return;
    }

    map.fitBounds(allBounds, { padding: [28, 28], maxZoom: 17 });
  }, [allBounds, mapReady]);

  React.useEffect(() => {
    ensureLeafletStyles();

    if (!mapElementRef.current || mapRef.current) {
      return;
    }

    let cancelled = false;
    let map: LeafletMap | null = null;
    const markers = markersRef.current;

    const setupMap = async () => {
      const module = await import("leaflet");
      const leaflet = ((module as { default?: LeafletModule }).default ??
        module) as LeafletModule;

      if (cancelled || !mapElementRef.current) {
        return;
      }

      leafletRef.current = leaflet;
      map = leaflet
        .map(mapElementRef.current, {
          zoomControl: true,
          attributionControl: false,
          scrollWheelZoom: true,
          preferCanvas: true,
        })
        .setView(campusCenter, 16);

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 20,
        })
        .addTo(map);

      leaflet.control
        .attribution({ position: "bottomright" })
        .addAttribution("OpenStreetMap")
        .addTo(map);

      mapRef.current = map;
      setMapReady(true);
      setTimeout(() => {
        map?.invalidateSize();
        map?.fitBounds(latestBoundsRef.current, {
          padding: [28, 28],
          maxZoom: 17,
        });
      }, 80);
    };

    void setupMap();

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      setMapReady(false);
      markers.clear();
      routeLineRef.current = null;
      routeHaloRef.current = null;
      userMarkerRef.current = null;
      accuracyCircleRef.current = null;
      movementLineRef.current = null;
      userPulseRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const map = mapRef.current;
    const leaflet = leafletRef.current;

    if (!map || !leaflet || !mapReady) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    visibleLocations.forEach((location) => {
      const selected = selectedLocation?.id === location.id;
      const marker = leaflet.marker(locationToLatLng(location), {
        icon: createLocationIcon(leaflet, location, selected),
        title: location.name,
        keyboard: true,
        zIndexOffset: selected ? 1000 : 0,
      })
        .bindPopup(createPopupHtml(location), {
          className: "mymsu-leaflet-popup",
        })
        .on("click", () => onSelectLocation(location.id))
        .addTo(map);

      markersRef.current.set(location.id, marker);
    });
  }, [mapReady, onSelectLocation, selectedLocation?.id, visibleLocations]);

  React.useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapReady || !selectedLocation) {
      return;
    }

    const marker = markersRef.current.get(selectedLocation.id);

    if (marker) {
      marker.openPopup();
      map.panTo(marker.getLatLng(), { animate: true, duration: 0.45 });
    }
  }, [mapReady, selectedLocation]);

  React.useEffect(() => {
    const map = mapRef.current;
    const leaflet = leafletRef.current;

    if (!map || !leaflet || !mapReady) {
      return;
    }

    routeLineRef.current?.remove();
    routeHaloRef.current?.remove();
    routeLineRef.current = null;
    routeHaloRef.current = null;

    if (routePoints.length <= 1) {
      return;
    }

    const latLngs = routePoints.map(pointToLatLng);

    routeHaloRef.current = leaflet.polyline(latLngs, {
      color: "#FFFFFF",
      weight: 11,
      opacity: 0.88,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    routeLineRef.current = leaflet.polyline(latLngs, {
      color: "#16A34A",
      weight: 6,
      opacity: 0.94,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    map.fitBounds(
      userMarker ? [...latLngs, userToLatLng(userMarker)] : latLngs,
      { padding: [42, 42], maxZoom: 18 },
    );
  }, [mapReady, routePoints, userMarker]);

  React.useEffect(() => {
    const map = mapRef.current;
    const leaflet = leafletRef.current;

    if (!map || !leaflet || !mapReady || !userMarker) {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      accuracyCircleRef.current?.remove();
      accuracyCircleRef.current = null;
      userPulseRef.current?.remove();
      userPulseRef.current = null;
      movementLineRef.current?.remove();
      movementLineRef.current = null;
      movementTrailRef.current = [];
      return;
    }

    const latLng = userToLatLng(userMarker);

    if (!userMarkerRef.current) {
      userMarkerRef.current = leaflet.marker(latLng, {
        icon: createUserIcon(leaflet),
        title: "Your live location",
        zIndexOffset: 1800,
      }).addTo(map);
    } else {
      userMarkerRef.current.setLatLng(latLng);
    }

    if (typeof userMarker.accuracy === "number") {
      if (!accuracyCircleRef.current) {
        accuracyCircleRef.current = leaflet.circle(latLng, {
          radius: Math.max(userMarker.accuracy, 8),
          color: "#0F766E",
          fillColor: "#0F766E",
          fillOpacity: 0.08,
          opacity: 0.25,
          weight: 1,
        }).addTo(map);
      } else {
        accuracyCircleRef.current
          .setLatLng(latLng)
          .setRadius(Math.max(userMarker.accuracy, 8));
      }
    }

    if (!userPulseRef.current) {
      userPulseRef.current = leaflet.circleMarker(latLng, {
        radius: 16,
        color: "#0F766E",
        fillColor: "#0F766E",
        fillOpacity: 0.14,
        opacity: 0.28,
        weight: 2,
      }).addTo(map);
    } else {
      userPulseRef.current.setLatLng(latLng);
    }

    const lastTrailPoint =
      movementTrailRef.current[movementTrailRef.current.length - 1];

    if (
      !lastTrailPoint ||
      Math.abs(lastTrailPoint[0] - latLng[0]) > 0.000005 ||
      Math.abs(lastTrailPoint[1] - latLng[1]) > 0.000005
    ) {
      movementTrailRef.current = [...movementTrailRef.current, latLng].slice(-80);
    }

    movementLineRef.current?.remove();
    movementLineRef.current =
      movementTrailRef.current.length > 1
        ? leaflet.polyline(movementTrailRef.current, {
            color: "#0F766E",
            weight: 4,
            opacity: 0.62,
            dashArray: "4 8",
          }).addTo(map)
        : null;

    if (trackingState === "active") {
      map.panTo(latLng, { animate: true, duration: 0.45 });
    }
  }, [mapReady, trackingState, userMarker]);

  React.useEffect(() => {
    fitCampus();
  }, [fitCampus, resetSignal]);

  const resetView = () => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    if (userMarker) {
      map.setView(userToLatLng(userMarker), 17, { animate: true });
      return;
    }

    fitCampus();
  };

  const routeActive = routePoints.length > 1;

  return (
    <View style={styles.mapShell}>
      <View style={[styles.mapBoard, compactMap && styles.mapBoardCompact]}>
        <View
          ref={(node) => {
            mapElementRef.current = node as unknown as HTMLDivElement | null;
          }}
          style={[styles.leafletMap, findingUser && styles.leafletMapLoading]}
        />
        <View style={styles.mapMetric}>
          <Text style={styles.mapMetricText}>
            {trackingActive ? "Live tracking" : findingUser ? "Finding you" : "Leaflet map"}
          </Text>
          <Text style={styles.mapMetricSubtext}>
            {visibleLocations.length} location(s) visible
            {routeActive ? " / route active" : ""}
          </Text>
        </View>
        <View style={styles.mapActions}>
          <Pressable style={styles.mapActionButton} onPress={resetView}>
            <Ionicons name="locate" size={18} color={colors.maroonDark} />
          </Pressable>
          <Pressable
            style={styles.mapActionButton}
            onPress={() => mapRef.current?.zoomIn()}
          >
            <Ionicons name="add" size={18} color={colors.maroonDark} />
          </Pressable>
          <Pressable
            style={styles.mapActionButton}
            onPress={() => mapRef.current?.zoomOut()}
          >
            <Ionicons name="remove" size={18} color={colors.maroonDark} />
          </Pressable>
        </View>
        <View style={styles.catDock}>
          <TrackingCat
            motion={catMotion}
            mood={catMood}
            message={catMessage}
            onPress={onCatPress}
          />
        </View>
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
    height: 520,
    minHeight: 360,
    overflow: "hidden",
    backgroundColor: "#E8E4DE",
  },
  mapBoardCompact: {
    height: 430,
    minHeight: 360,
  },
  leafletMap: {
    width: "100%",
    height: "100%",
  },
  leafletMapLoading: {
    opacity: 0.72,
  },
  mapMetric: {
    position: "absolute",
    left: 10,
    top: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radii.sm,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderWidth: 1,
    borderColor: "rgba(37, 29, 31, 0.09)",
    ...shadow,
  },
  mapMetricText: {
    color: colors.maroonDark,
    fontSize: 11,
    fontWeight: "900",
  },
  mapMetricSubtext: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 9,
    fontWeight: "800",
  },
  mapActions: {
    position: "absolute",
    right: 12,
    top: 12,
    gap: 8,
  },
  mapActionButton: {
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
  catDock: {
    position: "absolute",
    left: 12,
    bottom: 12,
    zIndex: 35,
  },
});
