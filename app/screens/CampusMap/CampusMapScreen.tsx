import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type CampusMapScreenProps = {
  onBack?: () => void;
};

const CAMPUS_LOCATIONS = [
  {
    id: "admin",
    title: "Administration Office",
    subtitle: "Main administration cluster",
    description:
      "Visit this office for official campus concerns, student referrals, and administrative transactions.",
  },
  {
    id: "colleges",
    title: "Colleges Area",
    subtitle: "Academic buildings cluster",
    description:
      "This section covers the main academic buildings, classrooms, and teaching areas inside MSU Main Campus.",
  },
  {
    id: "gym",
    title: "Dimaporo Gym",
    subtitle: "Events and sports venue",
    description:
      "A major venue for university programs, student activities, indoor sports, and assemblies.",
  },
  {
    id: "oval",
    title: "Grandstand / Oval",
    subtitle: "Outdoor field and track",
    description:
      "Used for athletics, training, outdoor events, and large university gatherings.",
  },
  {
    id: "gate",
    title: "Main Entrance",
    subtitle: "Primary campus access point",
    description:
      "The main campus entry area that students and visitors commonly use as a location reference.",
  },
];

export default function CampusMapScreen({ onBack }: CampusMapScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Campus Guide</Text>
        <Text style={styles.subtitle}>
          Text-only campus location guide for MSU Main Campus.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Map Rolled Back</Text>
          <Text style={styles.noticeText}>
            The interactive map was removed to keep the app stable and easier to
            maintain. This screen now provides a simple text-based campus guide.
          </Text>
        </View>

        {CAMPUS_LOCATIONS.map((location, index) => (
          <View key={location.id} style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{index + 1}</Text>
              </View>
              <View style={styles.locationTextWrap}>
                <Text style={styles.locationTitle}>{location.title}</Text>
                <Text style={styles.locationSubtitle}>{location.subtitle}</Text>
              </View>
            </View>

            <Text style={styles.locationDescription}>
              {location.description}
            </Text>
          </View>
        ))}

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Campus navigation tip</Text>
          <Text style={styles.tipText}>
            Use these locations as quick references when asking guards, staff,
            or fellow students for directions around the campus.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F4F2",
  },
  header: {
    backgroundColor: "#800505",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    marginBottom: 16,
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.84)",
    fontSize: 14,
    lineHeight: 21,
  },
  content: {
    padding: 18,
    paddingBottom: 28,
  },
  noticeCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1DEC4",
    marginBottom: 16,
  },
  noticeTitle: {
    color: "#7A5310",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  noticeText: {
    color: "#6B5B43",
    fontSize: 13,
    lineHeight: 20,
  },
  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EBE6E1",
    marginBottom: 14,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#800505",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  locationTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    color: "#3F2626",
    fontSize: 17,
    fontWeight: "800",
  },
  locationSubtitle: {
    marginTop: 4,
    color: "#8B7A7A",
    fontSize: 13,
  },
  locationDescription: {
    marginTop: 14,
    color: "#5D5151",
    fontSize: 14,
    lineHeight: 22,
  },
  tipCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1DEC4",
    marginTop: 4,
  },
  tipTitle: {
    color: "#7A5310",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  tipText: {
    color: "#6B5B43",
    fontSize: 13,
    lineHeight: 20,
  },
});
