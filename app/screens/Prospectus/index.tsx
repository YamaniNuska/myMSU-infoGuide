import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useAppData } from "../../../src/data/appStore";
import { colors, getCardWidth, getColumnCount, radii, shadow } from "../../../src/theme";
import SecondaryScreenLayout from "../../../src/components/SecondaryScreenLayout";

type ProspectusScreenProps = {
  onBack?: () => void;
};

export default function ProspectusScreen({ onBack }: ProspectusScreenProps) {
  const [activeProgramId, setActiveProgramId] = React.useState("bsit");
  const { coursePrograms, prospectusRecords } = useAppData();
  const { width } = useWindowDimensions();
  const columns = getColumnCount(width);
  const availablePrograms = React.useMemo(
    () =>
      coursePrograms.filter((program) =>
        prospectusRecords.some((record) => record.programId === program.id),
      ),
    [coursePrograms, prospectusRecords],
  );

  React.useEffect(() => {
    if (
      availablePrograms.length > 0 &&
      !availablePrograms.some((program) => program.id === activeProgramId)
    ) {
      setActiveProgramId(availablePrograms[0].id);
    }
  }, [activeProgramId, availablePrograms]);

  const visibleRecords = prospectusRecords.filter(
    (record) => record.programId === activeProgramId,
  );
  const activeProgram = coursePrograms.find(
    (program) => program.id === activeProgramId,
  );

  return (
    <SecondaryScreenLayout
      title="Prospectus"
      description="Preview program flow, semester subjects, and curriculum checkpoints."
      onBack={onBack}
    >
      <View style={styles.programPicker}>
        {availablePrograms
          .map((program) => {
            const isActive = activeProgramId === program.id;

            return (
              <Pressable
                key={program.id}
                style={[styles.programChip, isActive && styles.programChipActive]}
                onPress={() => setActiveProgramId(program.id)}
              >
                <Text
                  style={[
                    styles.programChipText,
                    isActive && styles.programChipTextActive,
                  ]}
                >
                  {program.degree}
                </Text>
              </Pressable>
            );
          })}
      </View>

      <View style={styles.heroPanel}>
        <View style={styles.heroIcon}>
          <Ionicons name="school" size={24} color={colors.gold} />
        </View>
        <View style={styles.heroTextWrap}>
          <Text style={styles.heroTitle}>{activeProgram?.program}</Text>
          <Text style={styles.heroSubtitle}>{activeProgram?.overview}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {visibleRecords.map((record) => (
          <View
            key={record.id}
            style={[
              styles.termCard,
              { width: getCardWidth(columns) },
              columns === 2 && styles.termCardMobile,
            ]}
          >
            <Text style={styles.termKicker}>{record.yearLevel}</Text>
            <Text style={styles.termTitle}>{record.semester}</Text>

            <View style={styles.subjectList}>
              {record.subjects.map((subject) => (
                <View key={subject} style={styles.subjectRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={17}
                    color={colors.success}
                  />
                  <Text style={styles.subjectText}>{subject}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Curriculum note</Text>
        <Text style={styles.noteText}>
          This is a compatible sample prospectus for app demonstration. For
          advising, always confirm the official curriculum with the college or
          department.
        </Text>
      </View>
    </SecondaryScreenLayout>
  );
}

const styles = StyleSheet.create({
  programPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  programChip: {
    minWidth: 74,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  programChipActive: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  programChipText: {
    color: colors.maroonDark,
    fontSize: 13,
    fontWeight: "800",
  },
  programChipTextActive: {
    color: colors.surface,
  },
  heroPanel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: radii.sm,
    backgroundColor: colors.maroon,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  heroTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },
  heroSubtitle: {
    marginTop: 6,
    color: "rgba(255,255,255,0.84)",
    fontSize: 13,
    lineHeight: 19,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  termCard: {
    minHeight: 270,
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  termCardMobile: {
    width: "100%",
  },
  termKicker: {
    color: colors.goldDark,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  termTitle: {
    marginTop: 6,
    color: colors.maroonDark,
    fontSize: 19,
    fontWeight: "800",
  },
  subjectList: {
    gap: 11,
    marginTop: 18,
  },
  subjectRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
  },
  subjectText: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  noteCard: {
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: "#FFF8E6",
    borderWidth: 1,
    borderColor: "#EEDCA7",
  },
  noteTitle: {
    color: colors.warning,
    fontSize: 15,
    fontWeight: "800",
  },
  noteText: {
    marginTop: 6,
    color: colors.ink,
    fontSize: 13,
    lineHeight: 20,
  },
});
