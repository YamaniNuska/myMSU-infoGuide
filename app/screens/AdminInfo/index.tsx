import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useAppData } from "../../../src/data/appStore";
import { colors, getCardWidth, getColumnCount, radii, shadow } from "../../../src/theme";
import SecondaryScreenLayout from "../../../src/components/SecondaryScreenLayout";

type AdminInfoScreenProps = {
  onBack?: () => void;
};

export default function AdminInfoScreen({ onBack }: AdminInfoScreenProps) {
  const [query, setQuery] = React.useState("");
  const { offices } = useAppData();
  const { width } = useWindowDimensions();
  const columns = getColumnCount(width);

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
      description="Quick access to registrar, student affairs, admissions, health, ICT, and university offices."
      onBack={onBack}
    >
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={colors.maroon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search offices, services, contacts..."
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

      <View style={styles.summaryStrip}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{offices.length}</Text>
          <Text style={styles.summaryLabel}>Offices</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>8-5</Text>
          <Text style={styles.summaryLabel}>Common Hours</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>DSA</Text>
          <Text style={styles.summaryLabel}>Admin Owner</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {filteredOffices.map((office) => (
          <View
            key={office.id}
            style={[
              styles.card,
              { width: getCardWidth(columns) },
              columns === 2 && styles.cardMobile,
            ]}
          >
            <View style={styles.cardTop}>
              <View style={styles.iconShell}>
                <Ionicons name="business" size={20} color={colors.maroon} />
              </View>
              <Text style={styles.category}>{office.category}</Text>
            </View>

            <Text style={styles.officeName}>{office.name}</Text>
            <Text style={styles.summary}>{office.summary}</Text>

            <View style={styles.serviceWrap}>
              {office.services.slice(0, 3).map((service) => (
                <Text key={service} style={styles.serviceChip}>
                  {service}
                </Text>
              ))}
            </View>

            <View style={styles.detailBlock}>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color={colors.goldDark} />
                <Text style={styles.detailText}>{office.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={16} color={colors.goldDark} />
                <Text style={styles.detailText}>{office.contact}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color={colors.goldDark} />
                <Text style={styles.detailText}>{office.hours}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {filteredOffices.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No office found</Text>
          <Text style={styles.emptyText}>
            Try searching registrar, DSA, admissions, clinic, ICT, or records.
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
  summaryStrip: {
    flexDirection: "row",
    gap: 10,
  },
  summaryItem: {
    flex: 1,
    minHeight: 78,
    justifyContent: "center",
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.maroon,
  },
  summaryValue: {
    color: colors.gold,
    fontSize: 20,
    fontWeight: "800",
  },
  summaryLabel: {
    marginTop: 3,
    color: "rgba(255,255,255,0.86)",
    fontSize: 12,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    minHeight: 320,
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  cardMobile: {
    width: "100%",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  iconShell: {
    width: 38,
    height: 38,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.maroonSoft,
  },
  category: {
    flex: 1,
    color: colors.goldDark,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  officeName: {
    color: colors.maroonDark,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
  },
  summary: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  serviceWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  serviceChip: {
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radii.pill,
    backgroundColor: "#F9F0DA",
    color: colors.maroonDark,
    fontSize: 11,
    fontWeight: "700",
  },
  detailBlock: {
    gap: 9,
    marginTop: "auto",
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  detailText: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 12,
    lineHeight: 18,
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
