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
import { useAppData } from "../../data/appStore";
import { colors, getCardWidth, getColumnCount, radii, shadow } from "../../theme";
import SecondaryScreenLayout from "../../components/SecondaryScreenLayout";

type CourseOfferScreenProps = {
  onBack?: () => void;
};

export default function CourseOfferScreen({ onBack }: CourseOfferScreenProps) {
  const [query, setQuery] = React.useState("");
  const [activeCollege, setActiveCollege] = React.useState("All");
  const { coursePrograms } = useAppData();
  const { width } = useWindowDimensions();
  const columns = getColumnCount(width);

  const colleges = React.useMemo(
    () => ["All", ...Array.from(new Set(coursePrograms.map((item) => item.college)))],
    [coursePrograms],
  );

  const filteredPrograms = coursePrograms.filter((program) => {
    const matchesCollege =
      activeCollege === "All" || program.college === activeCollege;
    const searchable = [
      program.college,
      program.program,
      program.degree,
      program.overview,
      ...program.tags,
    ]
      .join(" ")
      .toLowerCase();

    return matchesCollege && searchable.includes(query.trim().toLowerCase());
  });

  return (
    <SecondaryScreenLayout
      title="Course and Program Offerings"
      description="Browse colleges, degree programs, and student-facing program summaries."
      onBack={onBack}
    >
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={colors.maroon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search program, college, degree..."
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

      <View style={styles.filterRow}>
        {colleges.map((college) => {
          const isActive = activeCollege === college;

          return (
            <Pressable
              key={college}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveCollege(college)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
                ]}
                numberOfLines={1}
              >
                {college === "All" ? "All Colleges" : college}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.grid}>
        {filteredPrograms.map((program) => (
          <View
            key={program.id}
            style={[
              styles.programCard,
              { width: getCardWidth(columns) },
              columns === 2 && styles.programCardMobile,
            ]}
          >
            <View style={styles.degreeBadge}>
              <Text style={styles.degreeText}>{program.degree}</Text>
            </View>

            <Text style={styles.programTitle}>{program.program}</Text>
            <Text style={styles.collegeText}>{program.college}</Text>
            <Text style={styles.overview}>{program.overview}</Text>

            <View style={styles.tagRow}>
              {program.tags.map((tag) => (
                <Text key={tag} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      {filteredPrograms.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No program found</Text>
          <Text style={styles.emptyText}>
            Try a broader search or switch to All Colleges.
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
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterChip: {
    maxWidth: "100%",
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
    fontWeight: "700",
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
  programCard: {
    minHeight: 260,
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  programCardMobile: {
    width: "100%",
  },
  degreeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radii.pill,
    backgroundColor: "#F9F0DA",
  },
  degreeText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: "800",
  },
  programTitle: {
    marginTop: 14,
    color: colors.maroonDark,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
  },
  collegeText: {
    marginTop: 6,
    color: colors.goldDark,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  overview: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: "auto",
    paddingTop: 16,
  },
  tag: {
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.maroonSoft,
    color: colors.maroonDark,
    fontSize: 11,
    fontWeight: "700",
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
