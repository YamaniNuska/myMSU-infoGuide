import Ionicons from "@expo/vector-icons/Ionicons";
import type {
  LatLngBoundsExpression,
  LatLngTuple,
  Map as LeafletMap,
  Marker,
} from "leaflet";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { CampusLocation } from "../../data/mymsuDatabase";
import { colors, radii, shadow } from "../../theme";
import {
  CAMPUS_BOUNDS,
  coordinateToMapPoint,
  getMarkerLabel,
  mapPointToCoordinate,
} from "./mapMath";
import { getLocationColor } from "./mapTheme";
import type { MapPoint } from "./types";

type LeafletModule = typeof import("leaflet");

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

const campusCenter: LatLngTuple = [7.99705, 124.26045];
const campusMaxBounds: LatLngBoundsExpression = [
  [CAMPUS_BOUNDS.south, CAMPUS_BOUNDS.west],
  [CAMPUS_BOUNDS.north, CAMPUS_BOUNDS.east],
];
const styleElementId = "mymsu-admin-location-map-styles";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const pointToLatLng = (point: MapPoint): LatLngTuple => {
  const coordinate = mapPointToCoordinate(point);

  return [coordinate.latitude, coordinate.longitude];
};

const locationToLatLng = (location: CampusLocation): LatLngTuple =>
  pointToLatLng(location);

const draftToLatLng = (location: DraftLocation): LatLngTuple =>
  pointToLatLng(location);

const toRequiredMapPoint = (latitude: number, longitude: number) => {
  const point = coordinateToMapPoint(latitude, longitude);

  return {
    mapX: point.mapX,
    mapY: point.mapY,
    latitude,
    longitude,
  };
};

const getAllBounds = (
  locations: CampusLocation[],
  draftLocation: DraftLocation,
) =>
  [
    ...locations.map(locationToLatLng),
    draftToLatLng(draftLocation),
  ] as LatLngBoundsExpression;

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
      touch-action: none;
      overscroll-behavior: contain;
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
    .leaflet-tile-pane { z-index: 200; }
    .leaflet-overlay-pane { z-index: 400; }
    .leaflet-shadow-pane { z-index: 500; }
    .leaflet-marker-pane { z-index: 600; }
    .leaflet-popup-pane { z-index: 700; }
    .leaflet-control-container .leaflet-top,
    .leaflet-control-container .leaflet-bottom {
      position: absolute;
      z-index: 1000;
      pointer-events: none;
    }
    .leaflet-top { top: 0; }
    .leaflet-right { right: 0; }
    .leaflet-bottom { bottom: 0; }
    .leaflet-left { left: 0; }
    .leaflet-control {
      position: relative;
      z-index: 800;
      pointer-events: auto;
    }
    .leaflet-left .leaflet-control { margin-left: 12px; }
    .leaflet-top .leaflet-control { margin-top: 12px; }
    .leaflet-right .leaflet-control { margin-right: 12px; }
    .leaflet-bottom .leaflet-control { margin-bottom: 12px; }
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
    .leaflet-control-zoom a:last-child { border-bottom: 0; }
    .leaflet-control-attribution {
      padding: 4px 7px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.9);
      color: #5C5050;
      font-size: 10px;
    }
    .mymsu-admin-pin,
    .mymsu-admin-draft-pin {
      background: transparent;
      border: 0;
    }
    .mymsu-admin-marker {
      position: relative;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      border: 3px solid #fff;
      color: #fff;
      font-size: 13px;
      font-weight: 900;
      box-shadow: 0 7px 16px rgba(29, 11, 11, 0.22), 0 0 0 2px rgba(243, 190, 76, 0.32);
    }
    .mymsu-admin-marker:after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -6px;
      width: 10px;
      height: 10px;
      background: inherit;
      border-right: 3px solid #fff;
      border-bottom: 3px solid #fff;
      transform: translateX(-50%) rotate(45deg);
    }
    .mymsu-admin-label {
      position: absolute;
      left: 50%;
      top: 36px;
      max-width: 112px;
      transform: translateX(-50%);
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.95);
      color: #3A080D;
      border: 1px solid rgba(37, 29, 31, 0.1);
      font-size: 9px;
      font-weight: 900;
      line-height: 1.1;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mymsu-admin-draft-marker {
      position: relative;
      width: 58px;
      height: 58px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 29px;
      background: #7A0B14;
      border: 4px solid #fff;
      color: #fff;
      font-size: 21px;
      font-weight: 950;
      box-shadow: 0 14px 26px rgba(58, 8, 13, 0.34), 0 0 0 9px rgba(122, 11, 20, 0.16);
      cursor: grab;
    }
    .leaflet-dragging .mymsu-admin-draft-marker {
      cursor: grabbing;
    }
    .mymsu-admin-draft-marker:after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -10px;
      width: 18px;
      height: 18px;
      margin-left: -9px;
      background: #7A0B14;
      border-right: 4px solid #fff;
      border-bottom: 4px solid #fff;
      transform: rotate(45deg);
    }
    .mymsu-admin-draft-label {
      position: absolute;
      left: 50%;
      top: 70px;
      max-width: 130px;
      transform: translateX(-50%);
      padding: 6px 10px;
      border-radius: 999px;
      background: #3A080D;
      color: #fff;
      border: 2px solid #fff;
      font-size: 11px;
      font-weight: 950;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 9px 18px rgba(29, 11, 11, 0.22);
    }
  `;
  document.head.appendChild(style);
};

const createLocationIcon = (
  leaflet: LeafletModule,
  location: CampusLocation,
) =>
  leaflet.divIcon({
    className: "mymsu-admin-pin",
    iconAnchor: [15, 36],
    iconSize: [30, 54],
    html: `
      <div class="mymsu-admin-marker" style="background:${getLocationColor(location)}">
        <span>${escapeHtml(location.category.slice(0, 1).toUpperCase())}</span>
        <span class="mymsu-admin-label">${escapeHtml(getMarkerLabel(location))}</span>
      </div>
    `,
  });

const createDraftIcon = (leaflet: LeafletModule, draftLocation: DraftLocation) => {
  const name = draftLocation.name.trim() || "New location";

  return leaflet.divIcon({
    className: "mymsu-admin-draft-pin",
    iconAnchor: [29, 72],
    iconSize: [58, 100],
    html: `
      <div class="mymsu-admin-draft-marker">
        <span>+</span>
        <span class="mymsu-admin-draft-label">${escapeHtml(name)}</span>
      </div>
    `,
  });
};

export default function AdminLocationMapPicker({
  locations,
  draftLocation,
  onDraftMove,
  onSelectExistingLocation,
  onInteractionChange,
}: AdminLocationMapPickerProps) {
  const mapElementRef = React.useRef<HTMLDivElement | null>(null);
  const leafletRef = React.useRef<LeafletModule | null>(null);
  const mapRef = React.useRef<LeafletMap | null>(null);
  const markersRef = React.useRef<Map<string, Marker>>(new Map());
  const draftMarkerRef = React.useRef<Marker | null>(null);
  const latestDraftLocationRef = React.useRef(draftLocation);
  const latestOnDraftMoveRef = React.useRef(onDraftMove);
  const latestOnSelectRef = React.useRef(onSelectExistingLocation);
  const latestOnInteractionChangeRef = React.useRef(onInteractionChange);
  const latestLocationsRef = React.useRef(locations);
  const [mapReady, setMapReady] = React.useState(false);

  const draftCoordinate = React.useMemo(
    () => mapPointToCoordinate(draftLocation),
    [draftLocation],
  );

  React.useEffect(() => {
    latestDraftLocationRef.current = draftLocation;
    latestOnDraftMoveRef.current = onDraftMove;
    latestOnSelectRef.current = onSelectExistingLocation;
    latestOnInteractionChangeRef.current = onInteractionChange;
    latestLocationsRef.current = locations;
  }, [
    draftLocation,
    locations,
    onDraftMove,
    onInteractionChange,
    onSelectExistingLocation,
  ]);

  const moveDraft = React.useCallback((latitude: number, longitude: number) => {
    latestOnDraftMoveRef.current(toRequiredMapPoint(latitude, longitude));
  }, []);

  const fitMap = React.useCallback(() => {
    const map = mapRef.current;

    if (!map || !mapReady) {
      return;
    }

    map.fitBounds(getAllBounds(latestLocationsRef.current, latestDraftLocationRef.current), {
      padding: [34, 34],
      maxZoom: 18,
    });
  }, [mapReady]);

  React.useEffect(() => {
    ensureLeafletStyles();

    if (!mapElementRef.current || mapRef.current) {
      return;
    }

    let cancelled = false;
    const activeMarkers = markersRef.current;

    const setupMap = async () => {
      const module = await import("leaflet");
      const leaflet = ((module as { default?: LeafletModule }).default ??
        module) as LeafletModule;

      if (cancelled || !mapElementRef.current) {
        return;
      }

      leafletRef.current = leaflet;
      const map = leaflet
        .map(mapElementRef.current, {
          zoomControl: true,
          attributionControl: false,
          scrollWheelZoom: true,
          bounceAtZoomLimits: false,
          maxBounds: campusMaxBounds,
          maxBoundsViscosity: 1,
          minZoom: 15,
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

      map.on("click", (event) => {
        moveDraft(event.latlng.lat, event.latlng.lng);
      });
      map.on("dragstart zoomstart", () =>
        latestOnInteractionChangeRef.current?.(true),
      );
      map.on("dragend zoomend", () =>
        latestOnInteractionChangeRef.current?.(false),
      );

      mapRef.current = map;
      setMapReady(true);
      setTimeout(() => {
        map.invalidateSize();
        map.fitBounds(
          getAllBounds(
            latestLocationsRef.current,
            latestDraftLocationRef.current,
          ),
          {
          padding: [34, 34],
          maxZoom: 18,
          },
        );
      }, 80);
    };

    void setupMap();

    return () => {
      cancelled = true;
      activeMarkers.forEach((marker) => marker.remove());
      activeMarkers.clear();
      draftMarkerRef.current?.remove();
      draftMarkerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
    };
  }, [moveDraft]);

  React.useEffect(() => {
    const leaflet = leafletRef.current;
    const map = mapRef.current;

    if (!leaflet || !map || !mapReady) {
      return;
    }

    const activeIds = new Set(locations.map((location) => location.id));
    markersRef.current.forEach((marker, id) => {
      if (!activeIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    locations.forEach((location) => {
      const existing = markersRef.current.get(location.id);
      const latLng = locationToLatLng(location);

      if (existing) {
        existing.setLatLng(latLng);
        existing.setIcon(createLocationIcon(leaflet, location));
        return;
      }

      const marker = leaflet
        .marker(latLng, {
          icon: createLocationIcon(leaflet, location),
          title: location.name,
        })
        .on("click", (event) => {
          event.originalEvent?.stopPropagation();
          latestOnSelectRef.current(location.id);
        })
        .addTo(map);

      markersRef.current.set(location.id, marker);
    });
  }, [locations, mapReady]);

  React.useEffect(() => {
    const leaflet = leafletRef.current;
    const map = mapRef.current;

    if (!leaflet || !map || !mapReady) {
      return;
    }

    const latLng = draftToLatLng(draftLocation);

    if (!draftMarkerRef.current) {
      draftMarkerRef.current = leaflet
        .marker(latLng, {
          draggable: true,
          icon: createDraftIcon(leaflet, draftLocation),
          title: draftLocation.name || "New location",
          zIndexOffset: 1000,
        })
        .on("dragstart", () => latestOnInteractionChangeRef.current?.(true))
        .on("dragend", (event) => {
          const marker = event.target as Marker;
          const nextLatLng = marker.getLatLng();

          latestOnInteractionChangeRef.current?.(false);
          moveDraft(nextLatLng.lat, nextLatLng.lng);
        })
        .addTo(map);
      return;
    }

    draftMarkerRef.current.setLatLng(latLng);
    draftMarkerRef.current.setIcon(createDraftIcon(leaflet, draftLocation));
  }, [draftLocation, mapReady, moveDraft]);

  React.useEffect(() => {
    if (!mapReady) {
      return;
    }

    mapRef.current?.invalidateSize();
  }, [mapReady]);

  const markerName = draftLocation.name.trim() || "New location";

  return (
    <View style={styles.shell}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Map position</Text>
          <Text style={styles.subtitle}>
            Use the live campus map. Click anywhere or drag the large pin.
          </Text>
        </View>
        <View style={styles.coordinatePill}>
          <Ionicons name="navigate" size={14} color={colors.maroonDark} />
          <Text style={styles.coordinatePillText}>
            {draftLocation.mapX.toFixed(1)}, {draftLocation.mapY.toFixed(1)}
          </Text>
        </View>
      </View>

      <View style={styles.mapBoard}>
        <View
          ref={(node) => {
            mapElementRef.current = node as unknown as HTMLDivElement | null;
          }}
          style={styles.leafletMap}
        />
        <View style={styles.mapHint} pointerEvents="none">
          <Text style={styles.mapHintText}>OpenStreetMap placement editor</Text>
          <Text style={styles.mapHintSubtext}>Click map / drag pin / select marker</Text>
        </View>
        <View style={styles.mapActions}>
          <Pressable style={styles.mapActionButton} onPress={fitMap}>
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
    height: 460,
    minHeight: 360,
    overflow: "hidden",
    backgroundColor: "#DCE9D2",
  },
  leafletMap: {
    width: "100%",
    height: "100%",
  },
  mapHint: {
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
  mapHintText: {
    color: colors.maroonDark,
    fontSize: 11,
    fontWeight: "900",
  },
  mapHintSubtext: {
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
