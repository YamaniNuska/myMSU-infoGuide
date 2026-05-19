import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SecondaryScreenLayout from "../../../src/components/SecondaryScreenLayout";
import { useAppData } from "../../../src/data/appStore";
import OfficeMessageThread from "../../../src/features/adminInfo/OfficeMessageThread";
import { colors, radii } from "../../../src/theme";

export default function AdminOfficeThreadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ officeId?: string | string[] }>();
  const { offices } = useAppData();
  const officeId = Array.isArray(params.officeId)
    ? params.officeId[0]
    : params.officeId;
  const office = offices.find((item) => item.id === officeId);

  if (!office) {
    return (
      <SecondaryScreenLayout
        title="Office Thread"
        description="The office record could not be found."
        onBack={() => router.push("/screens/AdminInfo")}
      >
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={28} color={colors.warning} />
          <Text style={styles.emptyTitle}>Office not found</Text>
          <Text style={styles.emptyText}>
            Return to Administrative Information and choose another office.
          </Text>
        </View>
      </SecondaryScreenLayout>
    );
  }

  return (
    <SecondaryScreenLayout
      title={office.name}
      description="Formal office email request thread with optional attachment."
      onBack={() => router.push("/screens/AdminInfo")}
    >
      <OfficeMessageThread office={office} />
    </SecondaryScreenLayout>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    padding: 24,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 8,
  },
  emptyTitle: {
    color: colors.maroonDark,
    fontSize: 18,
    fontWeight: "800",
  },
  emptyText: {
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
  },
});
