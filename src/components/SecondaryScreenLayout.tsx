import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Easing,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, maxContentWidth, radii } from "../theme";

type SecondaryScreenLayoutProps = {
  title: string;
  description: string;
  onBack?: () => void;
  children?: React.ReactNode;
  scrollEnabled?: boolean;
  showMobileScrollHandle?: boolean;
};

export default function SecondaryScreenLayout({
  title,
  description,
  onBack,
  children,
  scrollEnabled = true,
  showMobileScrollHandle = false,
}: SecondaryScreenLayoutProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const entry = React.useRef(new Animated.Value(0)).current;
  const scrollViewRef = React.useRef<ScrollView>(null);
  const dragStartTop = React.useRef(0);
  const [scrollOffset, setScrollOffset] = React.useState(0);
  const [contentHeight, setContentHeight] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(0);

  const scrollableDistance = Math.max(contentHeight - viewportHeight, 0);
  const trackHeight = Math.max(viewportHeight - 34, 160);
  const thumbHeight = Math.max(
    Math.min((viewportHeight / Math.max(contentHeight, 1)) * trackHeight, 78),
    42,
  );
  const thumbTravel = Math.max(trackHeight - thumbHeight, 1);
  const scrollProgress =
    scrollableDistance > 0 ? scrollOffset / scrollableDistance : 0;
  const thumbTop = Math.min(Math.max(scrollProgress * thumbTravel, 0), thumbTravel);
  const showScrollHandle =
    showMobileScrollHandle && !isWide && scrollableDistance > 24;

  const scrollToThumbTop = React.useCallback(
    (nextTop: number) => {
      const clampedTop = Math.min(Math.max(nextTop, 0), thumbTravel);
      const nextOffset =
        thumbTravel > 0 ? (clampedTop / thumbTravel) * scrollableDistance : 0;

      scrollViewRef.current?.scrollTo({
        y: nextOffset,
        animated: false,
      });
      setScrollOffset(nextOffset);
    },
    [scrollableDistance, thumbTravel],
  );

  const scrollHandlePan = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => showScrollHandle,
        onMoveShouldSetPanResponder: () => showScrollHandle,
        onPanResponderGrant: () => {
          dragStartTop.current = thumbTop;
        },
        onPanResponderMove: (_, gesture) => {
          scrollToThumbTop(dragStartTop.current + gesture.dy);
        },
      }),
    [scrollToThumbTop, showScrollHandle, thumbTop],
  );

  React.useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 440,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entry]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.headerMotion,
            {
              opacity: entry,
              transform: [
                {
                  translateY: entry.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.maroonDark, colors.maroon]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={[styles.headerInner, isWide && styles.headerInnerWide]}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={20} color="#ffffff" />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <ScrollView
          ref={scrollViewRef}
          scrollEnabled={scrollEnabled}
          contentContainerStyle={[styles.content, isWide && styles.contentWide]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onLayout={(event) => {
            setViewportHeight(event.nativeEvent.layout.height);
          }}
          onContentSizeChange={(_, height) => {
            setContentHeight(height);
          }}
          onScroll={(event) => {
            setScrollOffset(event.nativeEvent.contentOffset.y);
          }}
        >
          <Animated.View
            style={[
              styles.contentAnimator,
              {
                opacity: entry,
                transform: [
                  {
                    translateY: entry.interpolate({
                      inputRange: [0, 1],
                      outputRange: [18, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {children}
          </Animated.View>
        </ScrollView>

        {showScrollHandle ? (
          <View style={styles.scrollHandleTrack} pointerEvents="box-none">
            <Animated.View
              style={[
                styles.scrollHandleThumb,
                {
                  height: thumbHeight,
                  transform: [{ translateY: thumbTop }],
                },
              ]}
              {...scrollHandlePan.panHandlers}
            >
              <View style={styles.scrollHandleGrip} />
            </Animated.View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.maroonDark,
  },
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollHandleTrack: {
    position: "absolute",
    right: 5,
    top: 124,
    bottom: 14,
    width: 24,
    alignItems: "center",
    borderRadius: radii.pill,
    backgroundColor: "rgba(58, 8, 13, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(58, 8, 13, 0.08)",
  },
  scrollHandleThumb: {
    width: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
    backgroundColor: colors.maroon,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  scrollHandleGrip: {
    width: 4,
    height: 28,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.82)",
  },
  headerMotion: {
    zIndex: 2,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 14,
    borderBottomLeftRadius: radii.sm,
    borderBottomRightRadius: radii.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.12)",
  },
  headerInner: {
    width: "100%",
    alignSelf: "center",
  },
  headerInnerWide: {
    maxWidth: maxContentWidth,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.13)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
  },
  backText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: "800",
  },
  description: {
    marginTop: 5,
    color: "rgba(255, 255, 255, 0.82)",
    fontSize: 12,
    lineHeight: 17,
  },
  content: {
    width: "100%",
    alignSelf: "center",
    padding: 14,
  },
  contentAnimator: {
    width: "100%",
    gap: 14,
  },
  contentWide: {
    maxWidth: maxContentWidth,
    paddingVertical: 16,
  },
});
