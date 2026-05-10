import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useAppData } from "../../data/appStore";
import { colors, getCardWidth, getColumnCount, radii, shadow } from "../../theme";
import SecondaryScreenLayout from "../../components/SecondaryScreenLayout";

type AcademicCalendarScreenProps = {
  onBack?: () => void;
};

const FILTERS = ["all", "enrollment", "classes", "event", "exam", "deadline"];

const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  enrollment: "create-outline",
  classes: "book-outline",
  event: "sparkles-outline",
  deadline: "hourglass-outline",
  exam: "document-text-outline",
};

export default function AcademicCalendarScreen({
  onBack,
}: AcademicCalendarScreenProps) {
  const [activeType, setActiveType] = React.useState("all");
  const { academicEvents } = useAppData();
  const { width } = useWindowDimensions();
  const columns = getColumnCount(width);

  const visibleEvents =
    activeType === "all"
      ? academicEvents
      : academicEvents.filter((event) => event.type === activeType);

  return (
    <SecondaryScreenLayout
      title="Academic Calendar"
      description="Track enrollment, class periods, campus events, exams, and deadline reminders."
      onBack={onBack}
    >
      <View style={styles.filterRow}>
        {FILTERS.map((filter) => {
          const isActive = activeType === filter;

          return (
            <Pressable
              key={filter}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveType(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
                ]}
              >
                {filter === "all" ? "All" : filter}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.grid}>
        {visibleEvents.map((event) => (
          <View
            key={event.id}
            style={[
              styles.eventCard,
              { width: getCardWidth(columns) },
              columns === 2 && styles.eventCardMobile,
            ]}
          >
            <View style={styles.eventTop}>
              <View style={styles.iconShell}>
                <Ionicons
                  name={typeIcons[event.type]}
                  size={21}
                  color={colors.maroon}
                />
              </View>
              <View style={styles.datePill}>
                <Text style={styles.dateText}>{event.dateLabel}</Text>
              </View>
            </View>

            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.audience}>{event.audience}</Text>
            <Text style={styles.details}>{event.details}</Text>
          </View>
        ))}
      </View>
    </SecondaryScreenLayout>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  filterChipActive: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  filterChipText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  filterChipTextActive: {
    color: colors.surface,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  eventCard: {
    minHeight: 220,
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  eventCardMobile: {
    width: "100%",
  },
  eventTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  iconShell: {
    width: 42,
    height: 42,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.maroonSoft,
  },
  datePill: {
    flexShrink: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radii.pill,
    backgroundColor: "#F9F0DA",
  },
  dateText: {
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: "800",
  },
  eventTitle: {
    marginTop: 16,
    color: colors.maroonDark,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },
  audience: {
    marginTop: 5,
    color: colors.goldDark,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  details: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
});
