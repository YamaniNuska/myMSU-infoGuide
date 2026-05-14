import type { CampusLocation } from "../../data/mymsuDatabase";
import type { MapPoint, UserMarker } from "./types";

export const CAMPUS_BOUNDS = {
  north: 8.0021,
  south: 7.992,
  west: 124.2509,
  east: 124.2699,
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const normalize = (value: string) => value.toLowerCase().trim();

export const coordinateToMapPoint = (
  latitude: number,
  longitude: number,
): MapPoint => {
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
    latitude,
    longitude,
  };
};

export const mapPointToCoordinate = (point: MapPoint) => ({
  latitude:
    typeof point.latitude === "number"
      ? point.latitude
      : CAMPUS_BOUNDS.north -
        (point.mapY / 100) * (CAMPUS_BOUNDS.north - CAMPUS_BOUNDS.south),
  longitude:
    typeof point.longitude === "number"
      ? point.longitude
      : CAMPUS_BOUNDS.west +
        (point.mapX / 100) * (CAMPUS_BOUNDS.east - CAMPUS_BOUNDS.west),
});

export const projectDeviceCoordinate = (
  latitude: number,
  longitude: number,
): UserMarker => {
  return {
    ...coordinateToMapPoint(latitude, longitude),
    insideCampus:
      latitude <= CAMPUS_BOUNDS.north &&
      latitude >= CAMPUS_BOUNDS.south &&
      longitude >= CAMPUS_BOUNDS.west &&
      longitude <= CAMPUS_BOUNDS.east,
  };
};

export const getLocationPoint = (location: CampusLocation): MapPoint => ({
  mapX: clamp(location.mapX, 0, 100),
  mapY: clamp(location.mapY, 0, 100),
  latitude: location.latitude,
  longitude: location.longitude,
});

export const getMarkerLabel = (location: CampusLocation) => {
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

export const formatCoordinate = (value?: number) =>
  typeof value === "number" ? value.toFixed(6) : "Not set";

const toRadians = (value: number) => (value * Math.PI) / 180;

export const getDistanceMeters = (from: MapPoint, to: MapPoint) => {
  if (
    typeof from.latitude === "number" &&
    typeof from.longitude === "number" &&
    typeof to.latitude === "number" &&
    typeof to.longitude === "number"
  ) {
    const earthRadiusMeters = 6371000;
    const deltaLatitude = toRadians(to.latitude - from.latitude);
    const deltaLongitude = toRadians(to.longitude - from.longitude);
    const fromLatitude = toRadians(from.latitude);
    const toLatitude = toRadians(to.latitude);
    const a =
      Math.sin(deltaLatitude / 2) ** 2 +
      Math.cos(fromLatitude) *
        Math.cos(toLatitude) *
        Math.sin(deltaLongitude / 2) ** 2;

    return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const campusMetersPerPercent = 16;

  return (
    Math.hypot(to.mapX - from.mapX, to.mapY - from.mapY) *
    campusMetersPerPercent
  );
};

export const formatDistance = (meters: number) =>
  meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.max(Math.round(meters), 1)} m`;
