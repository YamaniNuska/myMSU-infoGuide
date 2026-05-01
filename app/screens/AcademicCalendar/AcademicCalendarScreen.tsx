import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SecondaryScreenLayout from "../components/SecondaryScreenLayout";

type AcademicCalendarScreenProps = {
  onBack?: () => void;
};

export default function AcademicCalendarScreen({
  onBack,
}: AcademicCalendarScreenProps) {
  return (
    <SecondaryScreenLayout
      title="Academic Calendar"
      description="See important semester dates, class schedules, and university deadlines."
      onBack={onBack}
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Important dates</Text>
        <Text style={styles.cardText}>
          This screen is ready for enrollment schedules, exam periods, holidays,
          and semester milestones.
        </Text>
      </View>
    </SecondaryScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7E7E7",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4A0E0E",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555555",
  },
});
