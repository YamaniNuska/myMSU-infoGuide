import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as React from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TABS = [
  { key: "dashboard", label: "Home", icon: "home", family: "Entypo" },
  { key: "profile", label: "Profile", icon: "user", family: "FontAwesome" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

type BottomNavProps = {
  activeTab?: TabKey;
  onNavigate?: (tab: TabKey) => void;
};

export default function BottomNav({
  activeTab = "dashboard",
  onNavigate,
}: BottomNavProps) {
  const translateX = React.useRef(new Animated.Value(0)).current;
  const scaleValues = React.useRef(
    TABS.map((_, i) => new Animated.Value(i === 0 ? 1.2 : 1)),
  ).current;

  const tabWidth = Dimensions.get("window").width / TABS.length;

  React.useEffect(() => {
    const index = TABS.findIndex((tab) => tab.key === activeTab);

    Animated.spring(translateX, {
      toValue: index * tabWidth + tabWidth / 2 - 20,
      useNativeDriver: true,
      bounciness: 12,
    }).start();

    scaleValues.forEach((value, i) => {
      Animated.spring(value, {
        toValue: i === index ? 1.2 : 1,
        useNativeDriver: true,
        bounciness: 12,
      }).start();
    });
  }, [activeTab, scaleValues, tabWidth, translateX]);

  return (
    <View style={styles.nav}>
      <Animated.View
        style={[styles.activeCircle, { transform: [{ translateX }] }]}
      />

      {TABS.map((tab, i) => {
        const isActive = tab.key === activeTab;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.button}
            onPress={() => onNavigate?.(tab.key)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.iconCircle,
                {
                  transform: [{ scale: scaleValues[i] }],
                  backgroundColor: isActive ? "#bc930d" : "transparent",
                },
              ]}
            >
              {tab.family === "Entypo" ? (
                <Entypo
                  name={tab.icon as any}
                  size={24}
                  color={isActive ? "white" : "#4A0E0E"}
                />
              ) : (
                <FontAwesome
                  name={tab.icon as any}
                  size={24}
                  color={isActive ? "white" : "#4A0E0E"}
                />
              )}
            </Animated.View>

            <Text
              style={[
                styles.label,
                {
                  color: isActive ? "#D4AF37" : "#4A0E0E",
                  opacity: isActive ? 1 : 0.6,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopWidth: 2,
    borderColor: "#a02f10",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
  },
  activeCircle: {
    position: "absolute",
    top: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D4AF37",
    zIndex: -1,
    left: 0,
  },
});
