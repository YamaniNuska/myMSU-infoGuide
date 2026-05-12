import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Easing,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { signOut, useAuthSession } from "../src/auth/localAuth";
import { databaseTables } from "../src/data/mymsuDatabase";
import { colors, maxContentWidth, radii, shadow } from "../src/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const user = useAuthSession();
  const entry = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 460,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entry]);

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isWide && styles.contentWide,
          { paddingBottom: 112 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.contentMotion,
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
        {!user ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No Account Signed In</Text>
            <Text style={styles.cardText}>
              Sign in to view visitor, MSU, or admin account access.
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.primaryButtonText}>Go to Login</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <LinearGradient
              colors={[colors.maroonDark, colors.maroon]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileCard}
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color={colors.surface} />
              </View>
              <View style={styles.profileText}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.meta}>
                  {user.role.toUpperCase()} | {user.email}
                </Text>
              </View>
            </LinearGradient>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Account Access</Text>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Username</Text>
                <Text style={styles.value}>{user.username}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Role</Text>
                <Text style={styles.value}>{user.role}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Access</Text>
                <Text style={styles.value}>
                  {user.role === "visitor"
                    ? "Visitor guide, map, offices, and announcements"
                    : "Handbook, map, schedules, and guide"}
                </Text>
              </View>
              {user.role === "admin" ? (
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Admin Tools</Text>
                  <Text style={styles.value}>Full CRUD content access</Text>
                </View>
              ) : null}
              <View style={styles.buttonRow}>
                {user.role === "admin" ? (
                  <Pressable
                    style={styles.primaryButton}
                    onPress={() => router.push("/screens/AdminPanel")}
                  >
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={18}
                      color={colors.surface}
                    />
                    <Text style={styles.primaryButtonText}>Admin Console</Text>
                  </Pressable>
                ) : null}
                <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                  <Ionicons
                    name="log-out-outline"
                    size={18}
                    color={colors.surface}
                  />
                  <Text style={styles.signOutButtonText}>Sign Out</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Compatible Database</Text>
          <Text style={styles.cardText}>
            The app syncs with the SQLite backend when configured and falls back
            to the bundled seed data when offline.
          </Text>
          <View style={styles.tableWrap}>
            {databaseTables.map((table) => (
              <Text key={table} style={styles.tableChip}>
                {table}
              </Text>
            ))}
          </View>
        </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    width: "100%",
    alignSelf: "center",
    padding: 18,
  },
  contentMotion: {
    width: "100%",
    gap: 14,
  },
  contentWide: {
    maxWidth: maxContentWidth,
    paddingVertical: 24,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  profileText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: "900",
  },
  meta: {
    marginTop: 6,
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800",
  },
  card: {
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  cardTitle: {
    color: colors.maroonDark,
    fontSize: 18,
    fontWeight: "900",
  },
  cardText: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
  },
  value: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 13,
    textAlign: "right",
    fontWeight: "800",
  },
  tableWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  tableChip: {
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radii.pill,
    backgroundColor: colors.maroonSoft,
    color: colors.maroonDark,
    fontSize: 11,
    fontWeight: "800",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: radii.pill,
    backgroundColor: colors.maroon,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "900",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.maroon,
  },
  signOutButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "900",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
});
