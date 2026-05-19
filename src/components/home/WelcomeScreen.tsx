import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { colors, maxContentWidth } from "../../theme";

type WelcomeScreenProps = {
  onGetStarted?: () => void;
};

const universityLogo = require("../../../assets/images/msu-logo.webp");
const floatIconSize = 58;
const displayFont = Platform.select({
  ios: "Avenir Next",
  android: "sans-serif-condensed",
  default: "system-ui",
});
const bodyFont = Platform.select({
  ios: "Avenir",
  android: "sans-serif",
  default: "system-ui",
});
type Point = { x: number; y: number };
type MovingPoint = Point & { vx: number; vy: number };
type RoamingIconMotion = {
  x: Animated.Value;
  y: Animated.Value;
  impact: Animated.Value;
  knockbackX: Animated.Value;
  knockbackY: Animated.Value;
};

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const { width, height } = useWindowDimensions();
  const entry = React.useRef(new Animated.Value(0)).current;
  const floatMotion = React.useRef(new Animated.Value(0)).current;
  const searchMotion = React.useRef({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    impact: new Animated.Value(0),
    knockbackX: new Animated.Value(0),
    knockbackY: new Animated.Value(0),
  }).current;
  const bookMotion = React.useRef({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    impact: new Animated.Value(0),
    knockbackX: new Animated.Value(0),
    knockbackY: new Animated.Value(0),
  }).current;
  const capMotion = React.useRef({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    impact: new Animated.Value(0),
    knockbackX: new Animated.Value(0),
    knockbackY: new Animated.Value(0),
  }).current;
  const stepsMotion = React.useRef({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    impact: new Animated.Value(0),
    knockbackX: new Animated.Value(0),
    knockbackY: new Animated.Value(0),
  }).current;
  const contactMotion = React.useRef({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    impact: new Animated.Value(0),
    knockbackX: new Animated.Value(0),
    knockbackY: new Animated.Value(0),
  }).current;
  const aiMotion = React.useRef({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    impact: new Animated.Value(0),
    knockbackX: new Animated.Value(0),
    knockbackY: new Animated.Value(0),
  }).current;
  const press = React.useRef(new Animated.Value(0)).current;
  const isCompact = width < 560;

  React.useEffect(() => {
    const maxX = Math.max(16, width - floatIconSize - 16);
    const maxY = Math.max(56, height - floatIconSize - 28);
    const clampX = (value: number) => Math.min(maxX, Math.max(16, value));
    const clampY = (value: number) => Math.min(maxY, Math.max(56, value));
    const motions = [
      searchMotion,
      bookMotion,
      capMotion,
      stepsMotion,
      contactMotion,
      aiMotion,
    ];
    const initialPoints = [
      { x: clampX(maxX - 10), y: clampY(86) },
      { x: clampX(22), y: clampY(162) },
      { x: clampX(maxX - 12), y: clampY(250) },
      { x: clampX(24), y: clampY(height - 140) },
      { x: clampX(maxX - 18), y: clampY(height - 142) },
      { x: clampX(32), y: clampY(height - 246) },
    ];
    const baseSpeed = isCompact ? 42 : 54;
    const currentPoints: MovingPoint[] = motions.map((_, index) => {
      const angle =
        (Math.PI * 2 * index) / motions.length + Math.random() * Math.PI;
      const speed = baseSpeed + index * 5;

      return {
        ...initialPoints[index],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      };
    });
    let isMounted = true;
    const activeCollisions = new Set<string>();

    const triggerImpact = (
      motion: RoamingIconMotion,
      x: number,
      y: number,
    ) => {
      motion.impact.stopAnimation();
      motion.knockbackX.stopAnimation();
      motion.knockbackY.stopAnimation();
      motion.impact.setValue(1);
      motion.knockbackX.setValue(x);
      motion.knockbackY.setValue(y);
      Animated.parallel([
        Animated.spring(motion.impact, {
          toValue: 0,
          friction: 3,
          tension: 190,
          useNativeDriver: true,
        }),
        Animated.spring(motion.knockbackX, {
          toValue: 0,
          friction: 4,
          tension: 140,
          useNativeDriver: true,
        }),
        Animated.spring(motion.knockbackY, {
          toValue: 0,
          friction: 4,
          tension: 140,
          useNativeDriver: true,
        }),
      ]).start();
    };

    motions.forEach((motion, index) => {
      motion.x.setValue(currentPoints[index].x);
      motion.y.setValue(currentPoints[index].y);
      motion.knockbackX.setValue(0);
      motion.knockbackY.setValue(0);
      motion.impact.setValue(0);
    });

    let lastFrame = Date.now();
    let frameId = 0;
    const iconDiameter = floatIconSize * 0.92;
    const minDistance = iconDiameter;
    const minSpeed = isCompact ? 36 : 46;
    const maxSpeed = isCompact ? 78 : 94;
    const normalizeSpeed = (point: MovingPoint) => {
      const speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy) || 1;

      if (speed < minSpeed || speed > maxSpeed) {
        const nextSpeed = speed < minSpeed ? minSpeed : maxSpeed;
        point.vx = (point.vx / speed) * nextSpeed;
        point.vy = (point.vy / speed) * nextSpeed;
      }
    };

    const tick = () => {
      const now = Date.now();
      const delta = Math.min((now - lastFrame) / 1000, 0.035);
      lastFrame = now;

      currentPoints.forEach((point) => {
        point.x += point.vx * delta;
        point.y += point.vy * delta;

        if (point.x <= 16 || point.x >= maxX) {
          point.x = clampX(point.x);
          point.vx *= -1;
        }

        if (point.y <= 56 || point.y >= maxY) {
          point.y = clampY(point.y);
          point.vy *= -1;
        }

        normalizeSpeed(point);
      });

      for (let first = 0; first < currentPoints.length; first += 1) {
        for (let second = first + 1; second < currentPoints.length; second += 1) {
          const dx = currentPoints[first].x - currentPoints[second].x;
          const dy = currentPoints[first].y - currentPoints[second].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const key = `${first}-${second}`;

          if (distance < minDistance) {
            const safeDistance = distance || 1;
            const normalX = dx / safeDistance;
            const normalY = dy / safeDistance;
            const overlap = minDistance - safeDistance;

            currentPoints[first].x += normalX * overlap * 0.5;
            currentPoints[first].y += normalY * overlap * 0.5;
            currentPoints[second].x -= normalX * overlap * 0.5;
            currentPoints[second].y -= normalY * overlap * 0.5;

            const velocityDiffX = currentPoints[first].vx - currentPoints[second].vx;
            const velocityDiffY = currentPoints[first].vy - currentPoints[second].vy;
            const speedAlongNormal =
              velocityDiffX * normalX + velocityDiffY * normalY;

            if (speedAlongNormal < 0) {
              const impulse = speedAlongNormal;
              currentPoints[first].vx -= impulse * normalX;
              currentPoints[first].vy -= impulse * normalY;
              currentPoints[second].vx += impulse * normalX;
              currentPoints[second].vy += impulse * normalY;
              normalizeSpeed(currentPoints[first]);
              normalizeSpeed(currentPoints[second]);
            }

            if (!activeCollisions.has(key)) {
              const pushX = normalX * 18;
              const pushY = normalY * 18;

              activeCollisions.add(key);
              triggerImpact(motions[first], pushX, pushY);
              triggerImpact(motions[second], -pushX, -pushY);
            }
          } else {
            activeCollisions.delete(key);
          }
        }
      }

      currentPoints.forEach((point, index) => {
        motions[index].x.setValue(point.x);
        motions[index].y.setValue(point.y);
      });

      if (isMounted) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    Animated.timing(entry, {
      toValue: 1,
      duration: 620,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatMotion, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatMotion, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    floatLoop.start();

    return () => {
      isMounted = false;
      cancelAnimationFrame(frameId);
      floatLoop.stop();
    };
  }, [
    aiMotion,
    bookMotion,
    capMotion,
    contactMotion,
    entry,
    floatMotion,
    height,
    isCompact,
    searchMotion,
    stepsMotion,
    width,
  ]);

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
  const shapeDrift = floatMotion.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 18],
  });
  const shapeLift = floatMotion.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });
  const iconPulse = floatMotion.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1],
  });
  const logoFloat = floatMotion.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });
  const addAnimated = (first: any, second: any) => Animated.add(first, second);
  const impactStyle = (impact: Animated.Value, rotateTo: string) => ({
    rotate: impact.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", rotateTo],
    }),
    scale: impact.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.24],
    }),
  });
  const searchImpactStyle = impactStyle(searchMotion.impact, "-12deg");
  const bookImpactStyle = impactStyle(bookMotion.impact, "12deg");
  const capImpactStyle = impactStyle(capMotion.impact, "-10deg");
  const stepsImpactStyle = impactStyle(stepsMotion.impact, "14deg");
  const contactImpactStyle = impactStyle(contactMotion.impact, "-14deg");
  const aiImpactStyle = impactStyle(aiMotion.impact, "10deg");
  const searchX = addAnimated(searchMotion.x, searchMotion.knockbackX);
  const searchY = addAnimated(
    addAnimated(searchMotion.y, searchMotion.knockbackY),
    shapeLift,
  );
  const bookX = addAnimated(
    addAnimated(bookMotion.x, bookMotion.knockbackX),
    shapeDrift,
  );
  const bookY = addAnimated(bookMotion.y, bookMotion.knockbackY);
  const capX = addAnimated(capMotion.x, capMotion.knockbackX);
  const capY = addAnimated(
    addAnimated(capMotion.y, capMotion.knockbackY),
    shapeDrift,
  );
  const stepsX = addAnimated(
    addAnimated(stepsMotion.x, stepsMotion.knockbackX),
    shapeLift,
  );
  const stepsY = addAnimated(stepsMotion.y, stepsMotion.knockbackY);
  const contactX = addAnimated(contactMotion.x, contactMotion.knockbackX);
  const contactY = addAnimated(
    addAnimated(contactMotion.y, contactMotion.knockbackY),
    shapeLift,
  );
  const aiX = addAnimated(
    addAnimated(aiMotion.x, aiMotion.knockbackX),
    shapeDrift,
  );
  const aiY = addAnimated(aiMotion.y, aiMotion.knockbackY);
  const searchScale = Animated.multiply(iconPulse, searchImpactStyle.scale);
  const bookScale = Animated.multiply(iconPulse, bookImpactStyle.scale);
  const capScale = Animated.multiply(iconPulse, capImpactStyle.scale);
  const stepsScale = Animated.multiply(iconPulse, stepsImpactStyle.scale);
  const contactScale = Animated.multiply(iconPulse, contactImpactStyle.scale);
  const aiScale = Animated.multiply(iconPulse, aiImpactStyle.scale);

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={[colors.maroonDark, colors.maroon]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["rgba(216, 180, 70, 0.18)", "rgba(216, 180, 70, 0)"]}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 0.78, y: 0.8 }}
        style={styles.cornerWash}
      />
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0)"]}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        style={[
          styles.floatIcon,
          styles.floatIconGold,
          {
            transform: [
              { translateX: searchX },
              { translateY: searchY },
              { scale: searchScale },
              { rotate: searchImpactStyle.rotate },
            ],
          },
        ]}
      >
        <Ionicons name="search" size={25} color={colors.surface} />
      </Animated.View>
      <Animated.View
        style={[
          styles.floatIcon,
          styles.floatIconMint,
          {
            transform: [
              { translateX: bookX },
              { translateY: bookY },
              { scale: bookScale },
              { rotate: bookImpactStyle.rotate },
            ],
          },
        ]}
      >
        <Ionicons name="book-outline" size={26} color={colors.surface} />
      </Animated.View>
      <Animated.View
        style={[
          styles.floatIcon,
          styles.floatIconWarm,
          {
            transform: [
              { translateX: capX },
              { translateY: capY },
              { scale: capScale },
              { rotate: capImpactStyle.rotate },
            ],
          },
        ]}
      >
        <Ionicons name="school-outline" size={27} color={colors.surface} />
      </Animated.View>
      <Animated.View
        style={[
          styles.floatIcon,
          styles.floatIconMintSoft,
          {
            transform: [
              { translateX: stepsX },
              { translateY: stepsY },
              { scale: stepsScale },
              { rotate: stepsImpactStyle.rotate },
            ],
          },
        ]}
      >
        <MaterialCommunityIcons
          name="shoe-print"
          size={27}
          color={colors.surface}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.floatIcon,
          styles.floatIconGoldSoft,
          {
            transform: [
              { translateX: contactX },
              { translateY: contactY },
              { scale: contactScale },
              { rotate: contactImpactStyle.rotate },
            ],
          },
        ]}
      >
        <Ionicons name="call-outline" size={25} color={colors.surface} />
      </Animated.View>
      <Animated.View
        style={[
          styles.floatIcon,
          styles.floatIconWarmSoft,
          {
            transform: [
              { translateX: aiX },
              { translateY: aiY },
              { scale: aiScale },
              { rotate: aiImpactStyle.rotate },
            ],
          },
        ]}
      >
        <MaterialCommunityIcons
          name="brain"
          size={27}
          color={colors.surface}
        />
      </Animated.View>

      <SafeAreaView style={[styles.safeArea, isCompact && styles.safeAreaCompact]}>
        <Animated.View
          style={[
            styles.hero,
            !isCompact && styles.heroWide,
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
          <View style={styles.logoCluster}>
            <Animated.View
              style={[
                styles.logoShell,
                { transform: [{ translateY: logoFloat }] },
              ]}
            >
              <Image
                source={universityLogo}
                resizeMode="contain"
                style={styles.logo}
              />
            </Animated.View>
            <Text style={styles.brandText}>myMSU-InfoGuide</Text>
            <Text style={styles.brandSubtext}>Mindanao State University</Text>
          </View>

          <Text style={[styles.title, isCompact && styles.titleCompact]}>
            <Text style={styles.titleSoft}>Your </Text>
            <Text style={styles.titleGold}>campus </Text>
            <Text style={styles.titleMint}>companion, </Text>
            <Text style={styles.titleWarm}>always </Text>
            <Text style={styles.titleSoft}>within reach</Text>
          </Text>
          <Text style={styles.subtitle}>
            Find offices, schedules, campus places, and student resources with
            a friendly guide that moves with your day.
          </Text>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Pressable
              accessibilityRole="button"
              style={[styles.button, isCompact && styles.buttonCompact]}
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
    overflow: "hidden",
    backgroundColor: colors.maroonDark,
  },
  cornerWash: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "62%",
  },
  floatIcon: {
    position: "absolute",
    left: 0,
    top: 0,
    width: floatIconSize,
    height: floatIconSize,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 3.4,
    borderColor: "rgba(255, 255, 255, 0.78)",
  },
  floatIconGold: {
    backgroundColor: "rgba(255, 225, 138, 0.2)",
    borderColor: "rgba(255, 225, 138, 0.98)",
    shadowColor: "#FFE18A",
  },
  floatIconMint: {
    backgroundColor: "rgba(119, 240, 176, 0.18)",
    borderColor: "rgba(119, 240, 176, 0.96)",
    shadowColor: "#77F0B0",
  },
  floatIconWarm: {
    backgroundColor: "rgba(255, 198, 109, 0.19)",
    borderColor: "rgba(255, 198, 109, 0.96)",
    shadowColor: "#FFC66D",
  },
  floatIconMintSoft: {
    backgroundColor: "rgba(69, 212, 131, 0.18)",
    borderColor: "rgba(174, 255, 209, 0.96)",
    shadowColor: "#45D483",
  },
  floatIconGoldSoft: {
    backgroundColor: "rgba(255, 238, 178, 0.19)",
    borderColor: "rgba(255, 238, 178, 0.96)",
    shadowColor: "#FFE18A",
  },
  floatIconWarmSoft: {
    backgroundColor: "rgba(255, 174, 112, 0.19)",
    borderColor: "rgba(255, 205, 151, 0.96)",
    shadowColor: "#FFC66D",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 28,
    justifyContent: "center",
  },
  safeAreaCompact: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  hero: {
    width: "100%",
    alignSelf: "center",
    alignItems: "flex-start",
  },
  heroWide: {
    maxWidth: Math.min(maxContentWidth, 660),
  },
  logoCluster: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  logoShell: {
    width: 126,
    height: 126,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderWidth: 3,
    borderColor: "rgba(255, 225, 138, 0.98)",
    shadowColor: "#FFE18A",
    shadowOpacity: 0.62,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  logo: {
    width: 104,
    height: 104,
  },
  brandText: {
    marginTop: 14,
    color: colors.surface,
    fontFamily: displayFont,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0,
  },
  brandSubtext: {
    marginTop: 4,
    color: colors.gold,
    fontFamily: bodyFont,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    marginTop: 32,
    color: colors.surface,
    fontFamily: displayFont,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "900",
    letterSpacing: 0,
    textShadowColor: "rgba(0, 0, 0, 0.24)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  titleCompact: {
    marginTop: 28,
    fontSize: 34,
    lineHeight: 40,
  },
  titleSoft: {
    color: "rgba(255, 255, 255, 0.96)",
  },
  titleGold: {
    color: "#FFE18A",
    textShadowColor: "rgba(255, 207, 88, 0.35)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  titleMint: {
    color: "#77F0B0",
    textShadowColor: "rgba(69, 212, 131, 0.38)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  titleWarm: {
    color: "#FFC66D",
    textShadowColor: "rgba(255, 198, 109, 0.34)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  subtitle: {
    marginTop: 15,
    color: "rgba(255, 255, 255, 0.86)",
    fontFamily: bodyFont,
    fontSize: 16,
    lineHeight: 25,
    fontWeight: "600",
  },
  button: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 8,
  },
  buttonCompact: {
    alignSelf: "flex-start",
    minWidth: 0,
  },
  buttonText: {
    color: "#45D483",
    fontFamily: displayFont,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0,
  },
});
