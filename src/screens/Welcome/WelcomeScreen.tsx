import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Animated,
  Easing,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { colors, maxContentWidth, radii } from "../../theme";

type WelcomeScreenProps = {
  onGetStarted?: () => void;
};

const campusImage = require("../../../assets/images/msu-background.webp");

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const { width, height } = useWindowDimensions();
  const entry = React.useRef(new Animated.Value(0)).current;
  const imageScale = React.useRef(new Animated.Value(1)).current;
  const press = React.useRef(new Animated.Value(0)).current;
  const isPortrait = height >= width;

  React.useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 620,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const ambientMotion = Animated.loop(
      Animated.sequence([
        Animated.timing(imageScale, {
          toValue: 1.045,
          duration: 7000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(imageScale, {
          toValue: 1,
          duration: 7000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    ambientMotion.start();

    return () => ambientMotion.stop();
  }, [entry, imageScale]);

  const imageStageHeight = isPortrait
    ? Math.min(height * 0.42, 360)
    : Math.min(height * 0.52, 330);

  const buttonScale = press.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.97],
  });

  const animatePress = (toValue: number) => {
    Animated.spring(press, {
      toValue,
      friction: 7,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.screen}>
      <Animated.Image
        source={campusImage}
        resizeMode="cover"
        blurRadius={10}
        style={[
          StyleSheet.absoluteFill,
          styles.coverImage,
          { transform: [{ scale: imageScale }] },
        ]}
      />
      <LinearGradient
        colors={[
          "rgba(34, 5, 8, 0.72)",
          "rgba(58, 8, 13, 0.5)",
          "rgba(16, 7, 8, 0.86)",
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.imageStage,
            { height: imageStageHeight, maxWidth: Math.min(maxContentWidth, 760) },
            {
              opacity: entry,
              transform: [
                {
                  translateY: entry.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Image source={campusImage} resizeMode="contain" style={styles.fittedImage} />
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: entry,
              transform: [
                {
                  translateY: entry.interpolate({
                    inputRange: [0, 1],
                    outputRange: [22, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.brandPill}>
            <View style={styles.brandDot} />
            <Text style={styles.brandText}>myMSU-InfoGuide</Text>
          </View>

          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            Navigate campus information, offices, schedules, and student
            resources with a cleaner guide built for daily use.
          </Text>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Pressable
              accessibilityRole="button"
              style={styles.button}
              onPress={onGetStarted}
              onPressIn={() => animatePress(1)}
              onPressOut={() => animatePress(0)}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.maroonDark,
  },
  coverImage: {
    opacity: 0.64,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    justifyContent: "space-between",
  },
  imageStage: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  fittedImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingBottom: 12,
  },
  brandPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
  },
  brandDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  brandText: {
    color: "rgba(255, 255, 255, 0.88)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
  },
  title: {
    marginTop: 22,
    color: colors.surface,
    fontSize: 46,
    lineHeight: 52,
    fontWeight: "900",
    letterSpacing: 0,
  },
  subtitle: {
    marginTop: 12,
    color: "rgba(255, 255, 255, 0.82)",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  button: {
    alignSelf: "flex-start",
    minWidth: 164,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.gold,
  },
  buttonText: {
    color: colors.maroonDark,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
  },
});
