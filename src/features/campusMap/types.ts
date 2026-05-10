export type MapPoint = {
  mapX: number;
  mapY: number;
  latitude?: number;
  longitude?: number;
};

export type UserMarker = MapPoint & {
  accuracy?: number | null;
  insideCampus: boolean;
};

export type TrackingState = "idle" | "loading" | "active" | "denied" | "error";

export type MapSize = {
  width: number;
  height: number;
};
