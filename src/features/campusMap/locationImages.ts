import type { ImageSourcePropType } from "react-native";
import type { CampusLocation } from "../../data/mymsuDatabase";

export const locationImageSources: Partial<
  Record<CampusLocation["id"], ImageSourcePropType>
> = {
  // Example:
  // "college-cics": require("./locationImages/college-cics.jpg"),
};

export const getLocationImageSource = (location: CampusLocation) =>
  locationImageSources[location.id] ??
  (location.image ? { uri: location.image } : undefined);
