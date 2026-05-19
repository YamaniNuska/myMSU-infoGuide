import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import SecondaryScreenLayout from "../../../src/components/SecondaryScreenLayout";
import { useAppData } from "../../../src/data/appStore";
import { colors, radii, shadow } from "../../../src/theme";

type AdminInfoScreenProps = {
  onBack?: () => void;
};

export default function AdminInfoScreen({ onBack }: AdminInfoScreenProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const { offices } = useAppData();

  const filteredOffices = offices.filter((office) => {
    const searchable = [
      office.name,
      office.category,
      office.summary,
      office.location,
      office.contact,
      office.hours,
      ...office.services,
      ...office.tags,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query.trim().toLowerCase());
  });

  return (
    <SecondaryScreenLayout
      title="Administrative Information"
      description="Choose an office to send a formal in-app email request."
      onBack={onBack}
    >
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={colors.maroon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search offices, services, or concerns..."
          placeholderTextColor="#8B7D7D"
          value={query}
          onChangeText={setQuery}
        />
        {query ? (
          <Pressable onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={20} color="#B5A8A8" />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.list}>
        {filteredOffices.map((office) => (
          <Pressable
            key={office.id}
            style={styles.listItem}
            onPress={() => router.push(`/screens/AdminInfo/${office.id}`)}
          >
            <View style={styles.iconShell}>
              <Ionicons name="mail-open-outline" size={18} color={colors.maroon} />
            </View>

            <View style={styles.listBody}>
              <View style={styles.listTopRow}>
                <Text style={styles.officeName}>{office.name}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.goldDark}
                />
              </View>

              <Text style={styles.category}>{office.category}</Text>
              <Text numberOfLines={2} style={styles.summary}>
                {office.summary}
              </Text>

              <View style={styles.metaRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={colors.goldDark}
                />
                <Text numberOfLines={1} style={styles.metaText}>
                  {office.location}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="attach-outline" size={14} color={colors.goldDark} />
                <Text style={styles.metaText}>
                  Optional file attachment
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {filteredOffices.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No office found</Text>
          <Text style={styles.emptyText}>
            Try searching registrar, DSA, admissions, infirmary, ICT, or records.
          </Text>
        </View>
      ) : null}
    </SecondaryScreenLayout>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 14,
  },
  list: {
    gap: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  iconShell: {
    width: 42,
    height: 42,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.maroonSoft,
  },
  listBody: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  listTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  officeName: {
    flex: 1,
    color: colors.maroonDark,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },
  category: {
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  summary: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  metaText: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 12,
    lineHeight: 17,
  },
  emptyState: {
    alignItems: "center",
    padding: 24,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  emptyTitle: {
    color: colors.maroonDark,
    fontSize: 18,
    fontWeight: "800",
  },
  emptyText: {
    marginTop: 8,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
  },
});
