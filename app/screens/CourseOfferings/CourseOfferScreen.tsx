import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SecondaryScreenLayout from "../components/SecondaryScreenLayout";

type CourseOfferScreenProps = {
  onBack?: () => void;
};

export default function CourseOfferScreen({
  onBack,
}: CourseOfferScreenProps) {
  return (
    <SecondaryScreenLayout
      title="Course and Program Offerings"
      description="View available degree programs, course offerings, and academic tracks."
      onBack={onBack}
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Programs overview</Text>
        <Text style={styles.cardText}>
          This screen is ready for program lists, departments, and course
          details from the university catalog.
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
