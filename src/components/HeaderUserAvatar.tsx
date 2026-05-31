import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useAuthSession } from "../auth/localAuth";
import type { UserRecord } from "../data/mymsuDatabase";
import { colors, radii } from "../theme";

const defaultStudentAvatar = require("../../assets/images/default-student-avatar.webp");
const defaultFacultyAvatar = require("../../assets/images/default-faculty-avatar.webp");

type HeaderUserAvatarProps = {
  user?: UserRecord | null;
  light?: boolean;
  lowered?: boolean;
  showName?: boolean;
  style?: StyleProp<ViewStyle>;
};

const getInitials = (name?: string) => {
  const parts = (name ?? "User")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return (parts[0]?.[0] ?? "U") + (parts[1]?.[0] ?? "");
};

export default function HeaderUserAvatar({
  user,
  light = false,
  lowered = false,
  showName = true,
  style,
}: HeaderUserAvatarProps) {
  const router = useRouter();
  const session = useAuthSession();
  const activeUser = user ?? session;

  if (!activeUser) {
    return null;
  }

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Open profile"
      activeOpacity={0.82}
      onPress={() => router.push("/profile")}
      style={[
        styles.container,
        !showName && styles.containerIconOnly,
        lowered && styles.lowered,
        style,
      ]}
    >
      <View style={[styles.button, light && styles.buttonLight]}>
        {activeUser.avatarUrl ? (
          <Image source={{ uri: activeUser.avatarUrl }} style={styles.image} />
        ) : activeUser.role === "student" ? (
          <Image source={defaultStudentAvatar} style={styles.image} />
        ) : activeUser.role === "faculty" ? (
          <Image source={defaultFacultyAvatar} style={styles.image} />
        ) : (
          <View style={[styles.fallback, light && styles.fallbackLight]}>
            <Text style={[styles.initials, light && styles.initialsLight]}>
              {getInitials(activeUser.name).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      {showName ? (
        <Text
          style={[styles.username, light && styles.usernameLight]}
          numberOfLines={1}
        >
          {activeUser.name}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 82,
    alignItems: "center",
  },
  containerIconOnly: {
    width: 44,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: "rgba(58, 8, 13, 0.12)",
    overflow: "hidden",
  },
  buttonLight: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderColor: "rgba(255, 255, 255, 0.42)",
  },
  lowered: {
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    width: "100%",
    height: "100%",
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.maroonSoft,
  },
  fallbackLight: {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  initials: {
    color: colors.maroon,
    fontSize: 13,
    fontWeight: "900",
  },
  initialsLight: {
    color: colors.surface,
  },
  username: {
    maxWidth: 82,
    marginTop: 3,
    color: colors.maroonDark,
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
  },
  usernameLight: {
    color: "rgba(255, 255, 255, 0.92)",
  },
});
