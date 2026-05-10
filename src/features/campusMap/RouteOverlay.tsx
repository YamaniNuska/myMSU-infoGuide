import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors, shadow } from "../../theme";
import type { MapPoint } from "./types";

type RoutePixel = {
  x: number;
  y: number;
};

type RouteOverlayProps = {
  routePoints: MapPoint[];
  routePixels: RoutePixel[];
  routeFlow: Animated.Value;
};

export default function RouteOverlay({
  routePoints,
  routePixels,
  routeFlow,
}: RouteOverlayProps) {
  const routeInputRange = routePixels.map((_, index) =>
    index / Math.max(routePixels.length - 1, 1),
  );
  const routeRunnerX =
    routePixels.length > 1
      ? routeFlow.interpolate({
          inputRange: routeInputRange,
          outputRange: routePixels.map((point) => point.x),
        })
      : routeFlow.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0],
        });
  const routeRunnerY =
    routePixels.length > 1
      ? routeFlow.interpolate({
          inputRange: routeInputRange,
          outputRange: routePixels.map((point) => point.y),
        })
      : routeFlow.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0],
        });
  const routeRunnerScale = routeFlow.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.88, 1.05, 0.88],
  });

  return (
    <View pointerEvents="none" style={styles.routeLayer}>
      {routePixels.slice(1).map((point, index) => {
        const previous = routePixels[index];
        const dx = point.x - previous.x;
        const dy = point.y - previous.y;
        const length = Math.max(Math.hypot(dx, dy), 1);
        const angle = `${(Math.atan2(dy, dx) * 180) / Math.PI}deg`;

        return (
          <React.Fragment key={`route-segment-${index}`}>
            <View
              style={[
                styles.routeSegmentGlow,
                {
                  left: previous.x + dx / 2 - length / 2,
                  top: previous.y + dy / 2 - 6,
                  width: length,
                  transform: [{ rotate: angle }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.routeSegment,
                {
                  left: previous.x + dx / 2 - length / 2,
                  top: previous.y + dy / 2 - 3,
                  width: length,
                  opacity: routeFlow.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: index % 2 === 0 ? [0.82, 1, 0.82] : [1, 0.82, 1],
                  }),
                  transform: [{ rotate: angle }],
                },
              ]}
            />
          </React.Fragment>
        );
      })}

      {routePoints[0] ? (
        <View
          style={[
            styles.routePin,
            styles.routeStart,
            {
              left: `${routePoints[0].mapX}%`,
              top: `${routePoints[0].mapY}%`,
            },
          ]}
        />
      ) : null}

      {routePoints[routePoints.length - 1] ? (
        <View
          style={[
            styles.routePin,
            styles.routeEnd,
            {
              left: `${routePoints[routePoints.length - 1].mapX}%`,
              top: `${routePoints[routePoints.length - 1].mapY}%`,
            },
          ]}
        />
      ) : null}

      {routePixels.length > 1 ? (
        <Animated.View
          style={[
            styles.routeRunner,
            {
              transform: [
                { translateX: routeRunnerX },
                { translateY: routeRunnerY },
                { scale: routeRunnerScale },
              ],
            },
          ]}
        >
          <View style={styles.routeRunnerCore} />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  routeLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 7,
  },
  routeSegment: {
    position: "absolute",
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(58, 225, 73, 0.96)",
    borderWidth: 1.5,
    borderColor: "rgba(17, 132, 36, 0.86)",
    ...shadow,
  },
  routeSegmentGlow: {
    position: "absolute",
    height: 11,
    borderRadius: 999,
    backgroundColor: "rgba(89, 255, 101, 0.26)",
  },
  routePin: {
    position: "absolute",
    width: 16,
    height: 16,
    marginLeft: -8,
    marginTop: -8,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colors.surface,
    ...shadow,
  },
  routeStart: {
    backgroundColor: colors.teal,
  },
  routeEnd: {
    backgroundColor: colors.maroon,
  },
  routeRunner: {
    position: "absolute",
    left: -11,
    top: -11,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  routeRunnerCore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFE36B",
    borderWidth: 3,
    borderColor: colors.surface,
    ...shadow,
  },
});
