import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import type { CampusLocation } from "../../data/mymsuDatabase";
import { colors, radii, shadow } from "../../theme";
import { CAMPUS_BOUNDS, getMarkerLabel } from "./mapMath";
import { getLocationColor } from "./mapTheme";
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

const campusCenter = [7.99705, 124.26045] as const;

const pointToLatLng = (point: MapPoint) =>
  typeof point.latitude === "number" && typeof point.longitude === "number"
    ? [point.latitude, point.longitude]
    : [
        CAMPUS_BOUNDS.north -
          (point.mapY / 100) * (CAMPUS_BOUNDS.north - CAMPUS_BOUNDS.south),
        CAMPUS_BOUNDS.west +
          (point.mapX / 100) * (CAMPUS_BOUNDS.east - CAMPUS_BOUNDS.west),
      ];

const locationToLatLng = (location: CampusLocation) =>
  typeof location.latitude === "number" && typeof location.longitude === "number"
    ? [location.latitude, location.longitude]
    : pointToLatLng(location);

const userToLatLng = (marker: UserMarker) =>
  marker.insideCampus &&
  typeof marker.latitude === "number" &&
  typeof marker.longitude === "number"
    ? [marker.latitude, marker.longitude]
    : pointToLatLng(marker);

const mapHtml = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }
      body { overflow: hidden; background: #d9e6cf; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      .leaflet-container { background: #d9e6cf; touch-action: pan-x pan-y; }
      .leaflet-control-zoom { border: 1px solid rgba(37, 29, 31, 0.1); border-radius: 10px; overflow: hidden; box-shadow: 0 8px 18px rgba(29, 11, 11, 0.16); }
      .leaflet-control-zoom a { width: 34px; height: 34px; line-height: 34px; color: #3A080D; font-weight: 900; }
      .leaflet-control-attribution { padding: 4px 7px; border-radius: 999px; background: rgba(255, 255, 255, 0.9); color: #5C5050; font-size: 10px; }
      .mymsu-pin, .mymsu-user-icon { background: transparent; border: 0; }
      .mymsu-marker {
        position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
        border-radius: 20px; border: 3px solid #fff; color: #fff; font-size: 16px; font-weight: 900;
        box-shadow: 0 8px 18px rgba(29, 11, 11, 0.24);
      }
      .mymsu-marker:after {
        content: ""; position: absolute; left: 50%; bottom: -8px; width: 13px; height: 13px; background: inherit;
        border-right: 3px solid #fff; border-bottom: 3px solid #fff; transform: translateX(-50%) rotate(45deg);
      }
      .mymsu-marker.selected { width: 48px; height: 48px; border-radius: 24px; transform: translate(-4px, -4px); box-shadow: 0 12px 26px rgba(58, 8, 13, 0.32); }
      .mymsu-label {
        position: absolute; left: 50%; top: 47px; max-width: 96px; transform: translateX(-50%);
        padding: 4px 7px; border-radius: 999px; background: rgba(255, 255, 255, 0.95); color: #3A080D;
        border: 1px solid rgba(37, 29, 31, 0.1); font-size: 10px; font-weight: 900; line-height: 1.1;
        text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .mymsu-marker.selected .mymsu-label { top: 55px; background: #3A080D; color: #fff; }
      .mymsu-user {
        width: 34px; height: 34px; border-radius: 17px; border: 3px solid #fff; background: #0F766E;
        box-shadow: 0 8px 18px rgba(29, 11, 11, 0.22);
      }
      .mymsu-user:after {
        content: ""; position: absolute; left: 50%; top: 50%; width: 54px; height: 54px; margin: -27px 0 0 -27px;
        border-radius: 27px; background: rgba(15, 118, 110, 0.16); animation: pulse 1.7s ease-out infinite;
      }
      @keyframes pulse { from { transform: scale(.65); opacity: .8; } to { transform: scale(1.4); opacity: 0; } }
      .mymsu-popup-title { color: #3A080D; font-weight: 900; font-size: 14px; }
      .mymsu-popup-meta { margin-top: 3px; color: #936F18; font-size: 11px; font-weight: 800; text-transform: uppercase; }
      .mymsu-popup-body { margin-top: 7px; color: #5C5050; font-size: 12px; line-height: 1.35; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const campusCenter = [${campusCenter[0]}, ${campusCenter[1]}];
      const map = L.map("map", { zoomControl: true, attributionControl: false, preferCanvas: true }).setView(campusCenter, 16);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 20, attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
      L.control.attribution({ position: "bottomright" }).addAttribution("OpenStreetMap").addTo(map);
      const markers = new Map();
      let routeHalo = null;
      let routeLine = null;
      let userMarker = null;
      let accuracyCircle = null;
      let movementLine = null;
      let trail = [];
      let lastPayload = null;
      let openedSelectedId = null;
      let fittedRouteDestination = null;

      const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
      const latLngKey = (latLng) => latLng ? latLng[0].toFixed(6) + "," + latLng[1].toFixed(6) : null;
      const makeIcon = (location, selected) => L.divIcon({
        className: "mymsu-pin",
        iconAnchor: selected ? [24, 54] : [20, 46],
        iconSize: selected ? [48, 70] : [40, 64],
        popupAnchor: [0, selected ? -54 : -46],
        html: '<div class="mymsu-marker ' + (selected ? 'selected' : '') + '" style="background:' + location.color + '"><span>' + escapeHtml(location.categoryLetter) + '</span><span class="mymsu-label">' + escapeHtml(location.label) + '</span></div>',
      });
      const userIcon = L.divIcon({ className: "mymsu-user-icon", iconAnchor: [17, 17], iconSize: [34, 34], html: '<div class="mymsu-user"></div>' });
      const fitLocations = (locations) => {
        const points = locations.length ? locations.map((item) => item.latLng) : [[7.992, 124.2509], [8.0021, 124.2699]];
        map.fitBounds(points, { padding: [26, 26], maxZoom: 17 });
      };

      window.updateMymsuMap = (payload) => {
        lastPayload = payload;
        const activeIds = new Set(payload.locations.map((item) => item.id));
        markers.forEach((marker, id) => {
          if (!activeIds.has(id)) {
            marker.remove();
            markers.delete(id);
          }
        });
        payload.locations.forEach((location) => {
          const selected = payload.selectedId === location.id;
          const html = '<div class="mymsu-popup-title">' + escapeHtml(location.name) + '</div><div class="mymsu-popup-meta">' + escapeHtml(location.category) + '</div><div class="mymsu-popup-body">' + escapeHtml(location.description) + '</div>';
          const existing = markers.get(location.id);
          if (existing) {
            existing.setLatLng(location.latLng).setIcon(makeIcon(location, selected)).bindPopup(html, { autoPan: false });
            existing.setZIndexOffset(selected ? 1000 : 0);
          } else {
            const marker = L.marker(location.latLng, { icon: makeIcon(location, selected), title: location.name, zIndexOffset: selected ? 1000 : 0 })
              .bindPopup(html, { autoPan: false })
              .on("click", () => window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "select", id: location.id })))
              .addTo(map);
            markers.set(location.id, marker);
          }
        });

        if (routeHalo) routeHalo.remove();
        if (routeLine) routeLine.remove();
        routeHalo = null;
        routeLine = null;
        const routeDestinationKey = payload.routePoints.length > 1 ? latLngKey(payload.routePoints[payload.routePoints.length - 1]) : null;
        if (!routeDestinationKey) fittedRouteDestination = null;
        if (payload.routePoints.length > 1) {
          routeHalo = L.polyline(payload.routePoints, { color: "#FFFFFF", weight: 11, opacity: 0.88, lineCap: "round", lineJoin: "round" }).addTo(map);
          routeLine = L.polyline(payload.routePoints, { color: "#16A34A", weight: 6, opacity: 0.94, lineCap: "round", lineJoin: "round" }).addTo(map);
        }

        if (payload.user) {
          if (!userMarker) userMarker = L.marker(payload.user.latLng, { icon: userIcon, title: "Your live location", zIndexOffset: 1800 }).addTo(map);
          else userMarker.setLatLng(payload.user.latLng);
          if (typeof payload.user.accuracy === "number") {
            if (!accuracyCircle) accuracyCircle = L.circle(payload.user.latLng, { radius: Math.max(payload.user.accuracy, 8), color: "#0F766E", fillColor: "#0F766E", fillOpacity: 0.08, opacity: 0.25, weight: 1 }).addTo(map);
            else accuracyCircle.setLatLng(payload.user.latLng).setRadius(Math.max(payload.user.accuracy, 8));
          }
          const last = trail[trail.length - 1];
          if (!last || Math.abs(last[0] - payload.user.latLng[0]) > 0.000005 || Math.abs(last[1] - payload.user.latLng[1]) > 0.000005) trail = trail.concat([payload.user.latLng]).slice(-80);
          if (movementLine) movementLine.remove();
          movementLine = trail.length > 1 ? L.polyline(trail, { color: "#0F766E", weight: 4, opacity: 0.64, dashArray: "4 8" }).addTo(map) : null;
        } else {
          if (userMarker) userMarker.remove();
          if (accuracyCircle) accuracyCircle.remove();
          if (movementLine) movementLine.remove();
          userMarker = null;
          accuracyCircle = null;
          movementLine = null;
          trail = [];
        }

        const selectedMarker = payload.selectedId ? markers.get(payload.selectedId) : null;
        if (selectedMarker && openedSelectedId !== payload.selectedId) {
          selectedMarker.openPopup();
          openedSelectedId = payload.selectedId;
        } else if (!payload.selectedId) {
          openedSelectedId = null;
        }
        if (payload.followUser && payload.user) map.panTo(payload.user.latLng, { animate: true, duration: 0.45 });
        else if (payload.routePoints.length > 1 && fittedRouteDestination !== routeDestinationKey) {
          map.fitBounds(payload.routePoints.concat(payload.user ? [payload.user.latLng] : []), { padding: [38, 38], maxZoom: 18 });
          fittedRouteDestination = routeDestinationKey;
        }
        else if (payload.fit) fitLocations(payload.locations);
      };

      document.addEventListener("message", (event) => window.updateMymsuMap(JSON.parse(event.data)));
      window.addEventListener("message", (event) => window.updateMymsuMap(JSON.parse(event.data)));
      setTimeout(() => window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "ready" })), 80);
    </script>
  </body>
</html>
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
  const webViewRef = React.useRef<WebView>(null);
  const [mapReady, setMapReady] = React.useState(false);
  const [fitVersion, setFitVersion] = React.useState(0);
  const compactMap = width < 760;
  const trackingActive = trackingState === "active" && !!userMarker;
  const findingUser = trackingState === "loading";
  const routeActive = routePoints.length > 1;

  const payload = React.useMemo(
    () => ({
      fit: fitVersion,
      followUser: trackingActive,
      selectedId: selectedLocation?.id ?? null,
      locations: visibleLocations.map((location) => ({
        id: location.id,
        name: location.name,
        category: location.category,
        categoryLetter: location.category.slice(0, 1).toUpperCase(),
        description: location.description,
        label: getMarkerLabel(location),
        color: getLocationColor(location),
        latLng: locationToLatLng(location),
      })),
      routePoints: routePoints.map(pointToLatLng),
      user: userMarker
        ? {
            latLng: userToLatLng(userMarker),
            accuracy: userMarker.accuracy,
          }
        : null,
    }),
    [fitVersion, routePoints, selectedLocation?.id, trackingActive, userMarker, visibleLocations],
  );

  React.useEffect(() => {
    if (!mapReady) {
      return;
    }

    webViewRef.current?.injectJavaScript(
      `window.updateMymsuMap(${JSON.stringify(payload)}); true;`,
    );
  }, [mapReady, payload]);

  React.useEffect(() => {
    setFitVersion((value) => value + 1);
  }, [resetSignal]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data) as {
        type?: string;
        id?: string;
      };

      if (message.type === "ready") {
        setMapReady(true);
      }

      if (message.type === "select" && message.id) {
        onSelectLocation(message.id);
      }
    } catch {
      // Ignore malformed WebView messages.
    }
  };

  const resetView = () => setFitVersion((value) => value + 1);

  return (
    <View style={styles.mapShell}>
      <View style={[styles.mapBoard, compactMap && styles.mapBoardCompact]}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: mapHtml }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={handleMessage}
          scrollEnabled={false}
          style={[styles.leafletMap, findingUser && styles.leafletMapLoading]}
        />
        <View style={styles.mapMetric} pointerEvents="none">
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
            onPress={() => webViewRef.current?.injectJavaScript("map.zoomIn(); true;")}
          >
            <Ionicons name="add" size={18} color={colors.maroonDark} />
          </Pressable>
          <Pressable
            style={styles.mapActionButton}
            onPress={() => webViewRef.current?.injectJavaScript("map.zoomOut(); true;")}
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
    backgroundColor: "transparent",
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
