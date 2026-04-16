import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SecondaryScreenLayout from "../components/SecondaryScreenLayout";

type ProspectusScreenProps = {
  onBack?: () => void;
};

export default function ProspectusScreen({ onBack }: ProspectusScreenProps) {
  return (
    <SecondaryScreenLayout
      title="Prospectus"
      description="Check curriculum outlines, required subjects, and program flow."
      onBack={onBack}
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Curriculum details</Text>
        <Text style={styles.cardText}>
          This screen is ready for year-level subject lists, units, and
          prospectus breakdowns.
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
