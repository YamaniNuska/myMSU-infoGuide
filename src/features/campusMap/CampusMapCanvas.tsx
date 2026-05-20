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
  userAvatarUrl?: string;
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
  onMapGestureStart?: () => void;
  onMapGestureEnd?: () => void;
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
      .leaflet-container { background: #d9e6cf; touch-action: none; overscroll-behavior: contain; }
      .leaflet-control-zoom { border: 1px solid rgba(37, 29, 31, 0.1); border-radius: 10px; overflow: hidden; box-shadow: 0 8px 18px rgba(29, 11, 11, 0.16); }
      .leaflet-control-zoom a { width: 34px; height: 34px; line-height: 34px; color: #3A080D; font-weight: 900; }
      .leaflet-control-attribution { padding: 4px 7px; border-radius: 999px; background: rgba(255, 255, 255, 0.9); color: #5C5050; font-size: 10px; }
      .mymsu-pin, .mymsu-user-icon { background: transparent; border: 0; }
      .mymsu-marker {
        position: relative; width: 46px; height: 46px; display: flex; align-items: center; justify-content: center;
        border-radius: 23px; border: 4px solid #fff; color: #fff; font-size: 18px; font-weight: 900;
        box-shadow: 0 11px 24px rgba(29, 11, 11, 0.28), 0 0 0 3px rgba(243, 190, 76, 0.42);
      }
      .mymsu-marker:after {
        content: ""; position: absolute; left: 50%; bottom: -10px; width: 16px; height: 16px; background: inherit;
        border-right: 4px solid #fff; border-bottom: 4px solid #fff; transform: translateX(-50%) rotate(45deg);
      }
      .mymsu-marker.selected { width: 62px; height: 62px; border-radius: 31px; transform: translate(-8px, -10px); border-width: 5px; font-size: 23px; box-shadow: 0 18px 34px rgba(58, 8, 13, 0.38), 0 0 0 7px rgba(243, 190, 76, 0.5), 0 0 0 15px rgba(122, 11, 20, 0.14); }
      .mymsu-label {
        position: absolute; left: 50%; top: 54px; max-width: 126px; transform: translateX(-50%);
        padding: 6px 10px; border-radius: 999px; background: rgba(255, 255, 255, 0.95); color: #3A080D;
        border: 1px solid rgba(37, 29, 31, 0.1); font-size: 11px; font-weight: 900; line-height: 1.1;
        text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .mymsu-marker.selected .mymsu-label { top: 71px; background: #3A080D; color: #fff; border: 2px solid #fff; box-shadow: 0 10px 22px rgba(29, 11, 11, 0.26); }
      .mymsu-user {
        position: relative; width: 58px; height: 64px; display: flex; align-items: flex-start; justify-content: center;
      }
      .mymsu-user:after {
        content: ""; position: absolute; left: 50%; top: 7px; width: 76px; height: 76px; margin-left: -38px;
        border-radius: 38px; background: rgba(15, 118, 110, 0.18); animation: pulse 1.7s ease-out infinite;
      }
      .mymsu-user-avatar {
        position: relative; z-index: 2; width: 48px; height: 48px; border-radius: 24px; display: flex; align-items: center; justify-content: center;
        border: 4px solid #fff; background: #0F766E; color: #fff; font-size: 11px; font-weight: 950; letter-spacing: 0;
        box-shadow: 0 11px 26px rgba(29, 11, 11, 0.32), 0 0 0 3px rgba(243, 190, 76, 0.9);
      }
      .mymsu-user-avatar:before {
        content: ""; position: absolute; top: 8px; width: 15px; height: 15px; border-radius: 50%; background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 17px 0 7px rgba(255, 255, 255, 0.92);
      }
      .mymsu-user-avatar.has-photo:before { display: none; }
      .mymsu-user-avatar img {
        width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;
      }
      .mymsu-user-avatar span {
        position: absolute; left: 50%; bottom: -18px; transform: translateX(-50%); padding: 3px 7px; border-radius: 999px;
        background: #3A080D; border: 2px solid #fff; color: #fff; font-size: 10px; line-height: 1; white-space: nowrap;
      }
      .mymsu-user-tip {
        position: absolute; z-index: 1; left: 50%; bottom: 4px; width: 18px; height: 18px; margin-left: -9px;
        transform: rotate(45deg); background: #0F766E; border-right: 4px solid #fff; border-bottom: 4px solid #fff;
        box-shadow: 5px 5px 12px rgba(29, 11, 11, 0.18);
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
      let handledFitVersion = null;

      const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
      const latLngKey = (latLng) => latLng ? latLng[0].toFixed(6) + "," + latLng[1].toFixed(6) : null;
      const makeIcon = (location, selected) => L.divIcon({
        className: "mymsu-pin",
        iconAnchor: selected ? [31, 77] : [23, 55],
        iconSize: selected ? [62, 96] : [46, 78],
        popupAnchor: [0, selected ? -77 : -55],
        html: '<div class="mymsu-marker ' + (selected ? 'selected' : '') + '" style="background:' + location.color + '"><span>' + escapeHtml(location.categoryLetter) + '</span><span class="mymsu-label">' + escapeHtml(location.label) + '</span></div>',
      });
      const makeUserIcon = (avatarUrl) => L.divIcon({
        className: "mymsu-user-icon",
        iconAnchor: [29, 62],
        iconSize: [58, 64],
        html: '<div class="mymsu-user"><div class="mymsu-user-avatar ' + (avatarUrl ? 'has-photo' : '') + '">' + (avatarUrl ? '<img src="' + escapeHtml(avatarUrl) + '" alt="" />' : '') + '<span>YOU</span></div><div class="mymsu-user-tip"></div></div>'
      });
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
          const userIcon = makeUserIcon(payload.user.avatarUrl);
          if (!userMarker) userMarker = L.marker(payload.user.latLng, { icon: userIcon, title: "Your live location", zIndexOffset: 1800 }).addTo(map);
          else userMarker.setLatLng(payload.user.latLng).setIcon(userIcon);
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
        else if (payload.fitVersion !== handledFitVersion) {
          fitLocations(payload.locations);
          handledFitVersion = payload.fitVersion;
        }
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
  userAvatarUrl,
  trackingState,
  resetSignal,
  routePoints = [],
  catMotion,
  catMood,
  catMessage,
  onSelectLocation,
  onCatPress,
  onMapGestureStart,
  onMapGestureEnd,
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
      fitVersion,
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
            avatarUrl: userAvatarUrl,
          }
        : null,
    }),
    [fitVersion, routePoints, selectedLocation?.id, trackingActive, userAvatarUrl, userMarker, visibleLocations],
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
    <View
      style={styles.mapShell}
      onTouchStart={onMapGestureStart}
      onTouchEnd={onMapGestureEnd}
      onTouchCancel={onMapGestureEnd}
    >
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
