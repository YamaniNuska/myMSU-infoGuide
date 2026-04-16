import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

type ProfileScreenProps = {
  onBack?: () => void;
};

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          Your profile screen is ready for student account details and settings.
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Student profile placeholder</Text>
          <Text style={styles.cardText}>
            This section can later contain name, student number, course, contact
            details, and account preferences.
          </Text>
        </View>
      </View>
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
    flex: 1,
    padding: 18,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EBE6E1",
  },
  cardTitle: {
    color: "#3F2626",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  cardText: {
    color: "#5D5151",
    fontSize: 14,
    lineHeight: 22,
  },
});
