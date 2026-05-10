import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { EventEmitter as LocationEventEmitter } from "expo-location";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
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
          paddingVertical: 6,
        },
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: Platform.OS === "ios" ? 18 : 14,
          height: Platform.OS === "ios" ? 72 : 66,
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: 22,
          ...(Platform.OS === "web"
            ? { boxShadow: "0px 8px 22px rgba(29, 11, 11, 0.14)" }
            : {
                shadowColor: "#1D0B0B",
                shadowOpacity: 0.12,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                elevation: 10,
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
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
    </Tabs>
  );
}
