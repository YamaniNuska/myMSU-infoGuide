import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SecondaryScreenLayout from "../components/SecondaryScreenLayout";

type AdminInfoScreenProps = {
  onBack?: () => void;
};

export default function AdminInfoScreen({ onBack }: AdminInfoScreenProps) {
  return (
    <SecondaryScreenLayout
      title="Administrative Information"
      description="Quick access to registrar, offices, and important university administration details."
      onBack={onBack}
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Coming Soon</Text>
        <Text style={styles.cardText}>
          Administrative Information screen is under development.
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
