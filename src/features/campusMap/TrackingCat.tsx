import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, shadow } from "../../theme";

export type CatMood = "idle" | "prompt" | "walking" | "arrived" | "pet";

type TrackingCatProps = {
  motion: Animated.Value;
  mood: CatMood;
  message?: string;
  onPress?: () => void;
};

export default function TrackingCat({
  motion,
  mood,
  message,
  onPress,
}: TrackingCatProps) {
  const tapReaction = React.useRef(new Animated.Value(0)).current;
  const reactionTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [localMessage, setLocalMessage] = React.useState("");
  const walking = mood === "walking";

  React.useEffect(
    () => () => {
      if (reactionTimer.current) {
        clearTimeout(reactionTimer.current);
      }
    },
    [],
  );

  const bob = motion.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: walking ? [0, -8, -2, -9, 0] : [0, -2, 0, -2, 0],
  });
  const tilt = motion.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: walking
      ? ["-4deg", "5deg", "-2deg", "6deg", "-4deg"]
      : ["-1deg", "1deg", "-1deg", "1deg", "-1deg"],
  });
  const tail = motion.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: walking
      ? ["-24deg", "22deg", "-18deg", "26deg", "-24deg"]
      : ["-14deg", "6deg", "-10deg", "8deg", "-14deg"],
  });
  const leftPaw = motion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: walking ? [6, -4, 6] : [0, 1, 0],
  });
  const rightPaw = motion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: walking ? [-4, 6, -4] : [1, 0, 1],
  });
  const squashX = tapReaction.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.16],
  });
  const squashY = tapReaction.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.84],
  });
  const tapTilt = tapReaction.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-10deg"],
  });

  const handlePress = () => {
    setLocalMessage(mood === "arrived" ? "We made it!" : "Hey, gentle!");
    onPress?.();

    if (reactionTimer.current) {
      clearTimeout(reactionTimer.current);
    }

    tapReaction.setValue(0);
    Animated.sequence([
      Animated.spring(tapReaction, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }),
      Animated.spring(tapReaction, {
        toValue: 0,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();

    reactionTimer.current = setTimeout(() => setLocalMessage(""), 1500);
  };

  const displayMessage = localMessage || message;

  return (
    <View style={styles.wrapper}>
      {displayMessage ? (
        <View style={styles.speechBubble}>
          <Text style={styles.speechText} numberOfLines={2}>
            {displayMessage}
          </Text>
        </View>
      ) : null}

      <Pressable onPress={handlePress} hitSlop={10}>
        <Animated.View
          style={[
            styles.cat,
            {
              transform: [
                { translateY: bob },
                { rotate: tilt },
                { rotateZ: tapTilt },
                { scaleX: squashX },
                { scaleY: squashY },
              ],
            },
          ]}
        >
          <View style={styles.shadowOval} />
          <Animated.View
            style={[
              styles.tail,
              {
                transform: [{ rotate: tail }],
              },
            ]}
          />
          <View style={styles.body}>
            <View style={styles.vest} />
            <View style={styles.badge}>
              <Ionicons name="navigate" size={12} color={colors.surface} />
            </View>
          </View>
          <View style={styles.head}>
            <View style={[styles.ear, styles.earLeft]} />
            <View style={[styles.ear, styles.earRight]} />
            <View style={styles.cap} />
            <View style={styles.faceRow}>
              <View style={styles.eye} />
              <View style={styles.eye} />
            </View>
            <View style={styles.muzzle}>
              <View style={styles.nose} />
            </View>
          </View>
          <Animated.View
            style={[
              styles.paw,
              styles.pawLeft,
              { transform: [{ translateY: leftPaw }] },
            ]}
          />
          <Animated.View
            style={[
              styles.paw,
              styles.pawRight,
              { transform: [{ translateY: rightPaw }] },
            ]}
          />
          <View style={styles.mapPin}>
            <Ionicons name="location" size={13} color={colors.maroonDark} />
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 178,
    alignItems: "flex-start",
    gap: 6,
  },
  speechBubble: {
    maxWidth: 168,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: radii.sm,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderWidth: 1,
    borderColor: "rgba(58, 8, 13, 0.14)",
    ...shadow,
  },
  speechText: {
    color: colors.maroonDark,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "900",
  },
  cat: {
    width: 112,
    height: 98,
    position: "relative",
  },
  shadowOval: {
    position: "absolute",
    left: 17,
    bottom: 3,
    width: 66,
    height: 13,
    borderRadius: 8,
    backgroundColor: "rgba(37, 29, 31, 0.2)",
  },
  tail: {
    position: "absolute",
    right: 10,
    bottom: 33,
    width: 38,
    height: 13,
    borderRadius: 999,
    backgroundColor: "#F3BE4C",
    borderWidth: 2,
    borderColor: colors.maroonDark,
  },
  body: {
    position: "absolute",
    left: 25,
    bottom: 16,
    width: 54,
    height: 42,
    borderRadius: 24,
    backgroundColor: "#F3BE4C",
    borderWidth: 2,
    borderColor: colors.maroonDark,
    overflow: "hidden",
  },
  vest: {
    position: "absolute",
    left: -4,
    top: 10,
    width: 62,
    height: 13,
    backgroundColor: colors.maroon,
  },
  badge: {
    position: "absolute",
    right: 7,
    top: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.teal,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  head: {
    position: "absolute",
    left: 20,
    top: 12,
    width: 58,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD977",
    borderWidth: 2,
    borderColor: colors.maroonDark,
  },
  ear: {
    position: "absolute",
    top: -10,
    width: 18,
    height: 18,
    backgroundColor: "#FFD977",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.maroonDark,
  },
  earLeft: {
    left: 8,
    transform: [{ rotate: "45deg" }],
  },
  earRight: {
    right: 8,
    transform: [{ rotate: "45deg" }],
  },
  cap: {
    position: "absolute",
    top: -7,
    width: 43,
    height: 9,
    borderRadius: 3,
    backgroundColor: colors.maroonDark,
  },
  faceRow: {
    flexDirection: "row",
    gap: 17,
    marginTop: 6,
  },
  eye: {
    width: 6,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.maroonDark,
  },
  muzzle: {
    marginTop: 5,
    width: 22,
    height: 12,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 248, 230, 0.76)",
  },
  nose: {
    width: 6,
    height: 5,
    borderRadius: 4,
    backgroundColor: colors.maroon,
  },
  paw: {
    position: "absolute",
    bottom: 10,
    width: 13,
    height: 10,
    borderRadius: 7,
    backgroundColor: "#FFD977",
    borderWidth: 1.5,
    borderColor: colors.maroonDark,
  },
  pawLeft: {
    left: 31,
  },
  pawRight: {
    left: 59,
  },
  mapPin: {
    position: "absolute",
    right: 18,
    top: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(58, 8, 13, 0.16)",
    ...shadow,
  },
});
