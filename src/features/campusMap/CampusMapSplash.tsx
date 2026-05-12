import Ionicons from "@expo/vector-icons/Ionicons";
import { VideoView, useVideoPlayer } from "expo-video";
import React from "react";
import {
    Animated,
    Easing,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { colors, radii } from "../../theme";
import { campusMapSplashVideo } from "./mapAssets";

type CampusMapSplashProps = {
  onFinish: () => void;
};

export default function CampusMapSplash({ onFinish }: CampusMapSplashProps) {
  const fade = React.useRef(new Animated.Value(1)).current;
  const closing = React.useRef(false);
  const player = useVideoPlayer(campusMapSplashVideo, (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.muted = false;
    videoPlayer.play();
  });

  const finishSplash = React.useCallback(() => {
    if (closing.current) {
      return;
    }

    closing.current = true;
    player.pause();
    Animated.timing(fade, {
      toValue: 0,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onFinish();
      }
    });
  }, [fade, onFinish, player]);

  React.useEffect(() => {
    const endSubscription = player.addListener("playToEnd", finishSplash);
    const statusSubscription = player.addListener("statusChange", ({ status }) => {
      if (status === "error") {
        finishSplash();
      }
    });
    const fallbackTimer = setTimeout(finishSplash, 12000);

    return () => {
      endSubscription.remove();
      statusSubscription.remove();
      clearTimeout(fallbackTimer);
    };
  }, [finishSplash, player]);

  return (
    <Animated.View style={[styles.splashOverlay, { opacity: fade }]}>
      <VideoView
        player={player}
        style={styles.splashVideo}
        nativeControls={false}
        contentFit="cover"
        playsInline
      />
      <View style={styles.splashScrim} />
      <View style={styles.splashContent}>
        <Text style={styles.splashEyebrow}>MSU Main Entrance</Text>
        <Text style={styles.splashTitle}>Campus Map</Text>
      </View>
      <Pressable style={styles.splashSkip} onPress={finishSplash}>
        <Ionicons name="play-skip-forward" size={16} color={colors.surface} />
        <Text style={styles.splashSkipText}>Skip</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 60,
    backgroundColor: "#171214",
  },
  splashVideo: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  splashScrim: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
    backgroundColor: "rgba(20, 12, 14, 0.18)",
  },
  splashContent: {
    position: "absolute",
    left: 18,
    right: 74,
    bottom: 18,
  },
  splashEyebrow: {
    color: "rgba(255, 255, 255, 0.86)",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  splashTitle: {
    marginTop: 3,
    color: colors.surface,
    fontSize: 28,
    fontWeight: "900",
  },
  splashSkip: {
    position: "absolute",
    right: 12,
    top: 12,
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: "rgba(58, 8, 13, 0.64)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.24)",
  },
  splashSkipText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "900",
  },
});
