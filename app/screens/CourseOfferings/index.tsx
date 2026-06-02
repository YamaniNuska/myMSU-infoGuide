import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import SecondaryScreenLayout from "../../../src/components/SecondaryScreenLayout";
import { useAppData } from "../../../src/data/appStore";
import { getProgramProspectusStats } from "../../../src/data/curriculum";
import { colors, radii, softShadow } from "../../../src/theme";

type CourseOfferScreenProps = {
  onBack?: () => void;
};

export default function CourseOfferScreen({ onBack }: CourseOfferScreenProps) {
  const [query, setQuery] = React.useState("");
  const [activeCollege, setActiveCollege] = React.useState("All");
  const { coursePrograms, prospectusRecords } = useAppData();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 820;

  const colleges = React.useMemo(
    () => ["All", ...Array.from(new Set(coursePrograms.map((item) => item.college)))],
    [coursePrograms],
  );

  const collegeCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    coursePrograms.forEach((program) => {
      counts.set(program.college, (counts.get(program.college) ?? 0) + 1);
    });

    return counts;
  }, [coursePrograms]);

  React.useEffect(() => {
    if (!colleges.includes(activeCollege)) {
      setActiveCollege("All");
    }
  }, [activeCollege, colleges]);

  const filteredPrograms = React.useMemo(
    () =>
      coursePrograms.filter((program) => {
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
      }),
    [activeCollege, coursePrograms, query],
  );

  const readyCount = React.useMemo(
    () =>
      filteredPrograms.filter(
        (program) =>
          getProgramProspectusStats(program.id, prospectusRecords).recordCount > 0,
      ).length,
    [filteredPrograms, prospectusRecords],
  );

  return (
    <SecondaryScreenLayout
      title="Course and Program Offerings"
      description="Browse colleges, degree programs, and student-facing program summaries."
      onBack={onBack}
    >
      <View style={styles.controlPanel}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.maroon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search program, college, or degree"
            placeholderTextColor="#8B7D7D"
            value={query}
            onChangeText={setQuery}
          />
          {query ? (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={19} color="#B5A8A8" />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroller}
        >
          {colleges.map((college) => {
            const isActive = activeCollege === college;
            const count =
              college === "All"
                ? coursePrograms.length
                : collegeCounts.get(college) ?? 0;

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
                  {college === "All" ? "All" : college}
                </Text>
                <Text
                  style={[
                    styles.filterChipCount,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {count}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.resultHeader}>
        <View>
          <Text style={styles.resultTitle}>
            {activeCollege === "All" ? "All Programs" : activeCollege}
          </Text>
          <Text style={styles.resultMeta}>
            {filteredPrograms.length} result{filteredPrograms.length === 1 ? "" : "s"} /{" "}
            {readyCount} with prospectus
          </Text>
        </View>
      </View>

      {filteredPrograms.length > 0 ? (
        <View style={styles.programList}>
          {filteredPrograms.map((program) => {
            const stats = getProgramProspectusStats(program.id, prospectusRecords);
            const hasProspectusRecords = stats.recordCount > 0;

            return (
              <View
                key={program.id}
                style={[styles.programItem, isWide && styles.programItemWide]}
              >
                <View style={styles.programMain}>
                  <View style={styles.eyebrowRow}>
                    <Text style={styles.degreeText}>{program.degree}</Text>
                    <View style={styles.eyebrowDivider} />
                    <Text style={styles.collegeText} numberOfLines={1}>
                      {program.college}
                    </Text>
                  </View>

                  <Text style={styles.programTitle}>{program.program}</Text>
                  <Text style={styles.overview} numberOfLines={isWide ? 2 : 3}>
                    {program.overview}
                  </Text>
                </View>

                <View style={[styles.programAside, isWide && styles.programAsideWide]}>
                  <View style={styles.statStrip}>
                    <View style={styles.statBlock}>
                      <Text style={styles.statValue}>{stats.recordCount}</Text>
                      <Text style={styles.statLabel}>Terms</Text>
                    </View>
                    <View style={styles.statBlock}>
                      <Text style={styles.statValue}>{stats.subjectCount}</Text>
                      <Text style={styles.statLabel}>Subjects</Text>
                    </View>
                    <View style={styles.statBlock}>
                      <Text style={styles.statValue}>{stats.totalUnits}</Text>
                      <Text style={styles.statLabel}>Units</Text>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <View
                      style={[
                        styles.statusPill,
                        hasProspectusRecords && styles.statusPillReady,
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          hasProspectusRecords && styles.statusDotReady,
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          hasProspectusRecords && styles.statusTextReady,
                        ]}
                      >
                        {hasProspectusRecords
                          ? "Prospectus Ready"
                          : "Prospectus Not Ready"}
                      </Text>
                    </View>

                    {hasProspectusRecords ? (
                      <Pressable
                        style={styles.openButton}
                        onPress={() =>
                          router.push({
                            pathname: "/screens/Prospectus",
                            params: { programId: program.id },
                          })
                        }
                      >
                        <Ionicons
                          name="reader-outline"
                          size={15}
                          color={colors.surface}
                        />
                        <Text style={styles.openButtonText}>View</Text>
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No program found</Text>
          <Text style={styles.emptyText}>
            Try a broader search or choose another college.
          </Text>
        </View>
      )}
    </SecondaryScreenLayout>
  );
}

const styles = StyleSheet.create({
  controlPanel: {
    gap: 12,
    padding: 12,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#EFE6DE",
    ...softShadow,
  },
  searchBox: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 13,
    borderRadius: radii.sm,
    backgroundColor: "#FBFAF8",
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 14,
  },
  filterScroller: {
    gap: 8,
    paddingRight: 12,
  },
  filterChip: {
    maxWidth: 210,
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  filterChipActive: {
    backgroundColor: colors.maroonDark,
    borderColor: colors.maroonDark,
  },
  filterChipText: {
    flexShrink: 1,
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "800",
  },
  filterChipTextActive: {
    color: colors.surface,
  },
  filterChipCount: {
    color: colors.goldDark,
    fontSize: 12,
    fontWeight: "900",
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 2,
  },
  resultTitle: {
    color: colors.maroonDark,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "900",
  },
  resultMeta: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  programList: {
    gap: 10,
  },
  programItem: {
    gap: 14,
    padding: 15,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#EFE6DE",
    ...softShadow,
  },
  programItemWide: {
    flexDirection: "row",
    alignItems: "center",
  },
  programMain: {
    flex: 1,
    minWidth: 0,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  degreeText: {
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  eyebrowDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
  },
  collegeText: {
    flex: 1,
    minWidth: 0,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  programTitle: {
    marginTop: 6,
    color: colors.maroonDark,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "900",
  },
  overview: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  programAside: {
    gap: 12,
  },
  programAsideWide: {
    width: 320,
  },
  statStrip: {
    flexDirection: "row",
    gap: 8,
  },
  statBlock: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 9,
    borderRadius: radii.sm,
    backgroundColor: "#FBFAF8",
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
  },
  statValue: {
    color: colors.maroonDark,
    fontSize: 15,
    fontWeight: "900",
  },
  statLabel: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  statusPill: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
  },
  statusPillReady: {
    backgroundColor: colors.tealSoft,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.muted,
  },
  statusDotReady: {
    backgroundColor: colors.teal,
  },
  statusText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  statusTextReady: {
    color: colors.teal,
  },
  openButton: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 13,
    borderRadius: radii.pill,
    backgroundColor: colors.maroon,
  },
  openButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "900",
  },
  emptyState: {
    alignItems: "center",
    padding: 24,
    borderRadius: radii.lg,
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
