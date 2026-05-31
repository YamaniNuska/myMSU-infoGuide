import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { EventEmitter as LocationEventEmitter } from "expo-location";
import { Tabs } from "expo-router";
import * as React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { restoreAuthSession } from "../src/auth/localAuth";
import { startAppDataSync } from "../src/data/appStore";
import { colors } from "../src/theme";

if (Platform.OS === "web" && LocationEventEmitter) {
  const emitter = LocationEventEmitter as unknown as Record<string, unknown>;
  if (typeof emitter.removeSubscription !== "function" && typeof emitter.remove === "function") {
    // Expo Location web uses the new EventEmitter implementation, but
    // the package still expects a removeSubscription API when removing listeners.
    Object.defineProperty(emitter, "removeSubscription", {
      value: (subscription: { remove?: () => void }) => {
        subscription?.remove?.();
      },
      writable: false,
      configurable: true,
    });
  }
}

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    const stopAppDataSync = startAppDataSync();

    void restoreAuthSession();

    return stopAppDataSync;
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.maroon,
        tabBarInactiveTintColor: "#7C6F6F",
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingTop: 7,
          paddingBottom: 4,
        },
        tabBarStyle: {
          height: 58 + Math.max(insets.bottom, Platform.OS === "android" ? 8 : 0),
          paddingBottom: Math.max(insets.bottom, Platform.OS === "android" ? 8 : 0),
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderColor: colors.line,
          borderRadius: 0,
          ...(Platform.OS === "web"
            ? { boxShadow: "0px -3px 12px rgba(29, 11, 11, 0.08)" }
            : {
                shadowColor: "#1D0B0B",
                shadowOpacity: 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: -2 },
                elevation: 4,
              }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={23} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="AI-Chatbot"
        options={{
          title: "AI Chat",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-outline" size={23} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="screens"
        options={{ href: null }}
      />
    </Tabs>
  );
}
