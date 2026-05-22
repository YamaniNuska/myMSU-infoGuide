import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import SecondaryScreenLayout from "../../../src/components/SecondaryScreenLayout";
import { useAppData } from "../../../src/data/appStore";
import { isProspectusTermRecord } from "../../../src/data/curriculum";
import { colors, maxContentWidth, radii, shadow } from "../../../src/theme";

type ProspectusScreenProps = {
  onBack?: () => void;
};

type ParsedSubject = {
  raw: string;
  code: string;
  title: string;
  units: string;
  unitValue: number;
  lec: string;
  lab: string;
  prereq: string;
  coreq: string;
  importance?: "foundation" | "gateway" | "dependent" | "standard";
};

type ProspectusView =
  | "semester"
  | "graph"
  | "traditional"
  | "electives";

const graphColumnWidth = 250;
const graphColumnGap = 18;
const graphColumnPadding = 12;
const graphTitleHeight = 18;
const graphStackTop = graphColumnPadding + graphTitleHeight + 12;
const graphNodeHeight = 92;
const graphNodeGap = 16;
const graphNodeStep = graphNodeHeight + graphNodeGap;
const graphNodeCenterY = graphNodeHeight / 2;
const graphNodeRightX = graphColumnPadding + graphColumnWidth - graphColumnPadding * 2;
const graphNodeLeftX = graphColumnPadding;
const graphMinLineWidth = 18;

const termOrder: Record<string, number> = {
  "First Year|First Semester": 1,
  "First Year|Second Semester": 2,
  "Second Year|First Semester": 3,
  "Second Year|Second Semester": 4,
  "Third Year|First Semester": 5,
  "Third Year|Second Semester": 6,
  "Fourth Year|First Semester": 7,
  "Fourth Year|Second Semester": 8,
};

const parseSubject = (subject: string): ParsedSubject => {
  const parts = subject.split("|").map((part) => part.trim());
  const getValue = (label: string) =>
    parts
      .find((part) => part.toLowerCase().startsWith(`${label.toLowerCase()}:`))
      ?.split(":")
      .slice(1)
      .join(":")
      .trim() ?? "None";
  const units = getValue("Units");
  const unitValue = Number(units.replace(/[()]/g, "")) || 0;
  const importance = getValue("Importance").toLowerCase();

  return {
    raw: subject,
    code: parts[0] ?? "",
    title: parts[1] ?? subject,
    units,
    unitValue,
    lec: getValue("Lec"),
    lab: getValue("Lab"),
    prereq: getValue("Prereq"),
    coreq: getValue("Coreq"),
    importance:
      importance === "foundation" ||
      importance === "gateway" ||
      importance === "dependent" ||
      importance === "standard"
        ? importance
        : undefined,
  };
};

const extractCodes = (value: string) =>
  value
    .replace(/\bNone\b/gi, "")
    .match(/[A-Z]{2,}\d+(?:\.\d+)?|STT071\.1/g) ?? [];

const hasRequirement = (subject: ParsedSubject) =>
  extractCodes(subject.prereq).length > 0 || extractCodes(subject.coreq).length > 0;

const getCourseImportance = (
  subject: ParsedSubject,
  unlocks: number,
): "foundation" | "gateway" | "dependent" | "standard" => {
  if (subject.importance) {
    return subject.importance;
  }

  if (unlocks >= 3) {
    return "foundation";
  }

  if (unlocks > 0) {
    return "gateway";
  }

  if (hasRequirement(subject)) {
    return "dependent";
  }

  return "standard";
};

export default function ProspectusScreen({ onBack }: ProspectusScreenProps) {
  const [activeProgramId, setActiveProgramId] = React.useState("");
  const [activeView, setActiveView] = React.useState<ProspectusView>("semester");
  const { coursePrograms, prospectusRecords } = useAppData();
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const programOptions = React.useMemo(() => {
    const courseOptions = coursePrograms
      .filter((program) =>
        prospectusRecords.some((record) => record.programId === program.id) ||
        program.id.startsWith("bsit-"),
      )
      .map((program) => ({
        id: program.id,
        title: program.program,
        subtitle: program.overview,
        label: program.id.startsWith("bsit-")
          ? program.program
          : program.degree || program.program,
      }));
    const knownIds = new Set(courseOptions.map((program) => program.id));
    const prospectusOnlyOptions = Array.from(
      new Map(
        prospectusRecords
          .filter((record) => !knownIds.has(record.programId))
          .map((record) => [
            record.programId,
            {
              id: record.programId,
              title: record.program || record.programId,
              subtitle: "Prospectus record added from the curriculum console.",
              label: record.program || record.programId,
            },
          ]),
      ).values(),
    );

    return [...courseOptions, ...prospectusOnlyOptions];
  }, [coursePrograms, prospectusRecords]);

  React.useEffect(() => {
    if (
      programOptions.length > 0 &&
      !programOptions.some((program) => program.id === activeProgramId)
    ) {
      setActiveProgramId(programOptions[0].id);
    }
  }, [activeProgramId, programOptions]);

  const visibleRecords = React.useMemo(
    () =>
      prospectusRecords
        .filter(
          (record) =>
            record.programId === activeProgramId && isProspectusTermRecord(record),
        )
        .sort(
          (left, right) =>
            (termOrder[`${left.yearLevel}|${left.semester}`] ?? 99) -
            (termOrder[`${right.yearLevel}|${right.semester}`] ?? 99),
        ),
    [activeProgramId, prospectusRecords],
  );
  const activeProgram = programOptions.find(
    (program) => program.id === activeProgramId,
  );
  const activeProspectusMeta = prospectusRecords.find(
    (record) =>
      record.programId === activeProgramId &&
      record.technicalElectives?.length,
  );
  const parsedTerms = React.useMemo(
    () =>
      visibleRecords.map((record) => ({
        ...record,
        parsedSubjects: record.subjects.map(parseSubject),
      })),
    [visibleRecords],
  );
  const unlockCounts = React.useMemo(() => {
    const counts = new Map<string, number>();

    parsedTerms.forEach((term) => {
      term.parsedSubjects.forEach((subject) => {
        [...extractCodes(subject.prereq), ...extractCodes(subject.coreq)].forEach(
          (code) => counts.set(code, (counts.get(code) ?? 0) + 1),
        );
      });
    });

    return counts;
  }, [parsedTerms]);
  const termStats = React.useMemo(
    () =>
      parsedTerms.map((term) => {
        const units = term.parsedSubjects.reduce(
          (total, subject) => total + subject.unitValue,
          0,
        );
        const priorityCount = term.parsedSubjects.filter((subject) => {
          const codeHits = extractCodes(subject.code).reduce(
            (total, code) => total + (unlockCounts.get(code) ?? 0),
            0,
          );

          return (
            (subject.importance !== undefined &&
              subject.importance !== "standard") ||
            hasRequirement(subject) ||
            codeHits > 0
          );
        }).length;

        return {
          id: term.id,
          label: `${term.yearLevel.replace(" Year", "")} ${term.semester.replace(" Semester", "")}`,
          units,
          priorityCount,
          totalSubjects: term.parsedSubjects.length,
        };
      }),
    [parsedTerms, unlockCounts],
  );
  const totalUnits = termStats.reduce((total, term) => total + term.units, 0);
  const totalSubjects = termStats.reduce(
    (total, term) => total + term.totalSubjects,
    0,
  );
  const prioritySubjects = termStats.reduce(
    (total, term) => total + term.priorityCount,
    0,
  );
  const technicalElectives =
    activeProspectusMeta?.technicalElectives?.filter((elective) =>
      elective.trim(),
    ) ?? [];
  const programGraphTerms = React.useMemo(
    () =>
      parsedTerms.map((term, termIndex) => ({
        id: term.id,
        label: `${term.yearLevel.replace(" Year", "")} ${term.semester.replace(" Semester", "")}`,
        courses: term.parsedSubjects.map((subject, courseIndex) => {
          const unlocks = extractCodes(subject.code).reduce(
            (total, code) => total + (unlockCounts.get(code) ?? 0),
            0,
          );
          const importance = getCourseImportance(subject, unlocks);

          return {
            subject,
            courseIndex,
            importance,
            priority: importance !== "standard",
            termIndex,
            unlocks,
          };
        }),
      })),
    [parsedTerms, unlockCounts],
  );
  const coursePositionMap = React.useMemo(() => {
    const positions = new Map<string, { termIndex: number; courseIndex: number }>();

    programGraphTerms.forEach((term) => {
      term.courses.forEach((course) => {
        extractCodes(course.subject.code).forEach((code) => {
          positions.set(code, {
            termIndex: course.termIndex,
            courseIndex: course.courseIndex,
          });
        });
      });
    });

    return positions;
  }, [programGraphTerms]);
  const dependencyLines = React.useMemo(() => {
    const knownCodes = new Set(
      parsedTerms.flatMap((term) =>
        term.parsedSubjects.flatMap((subject) => extractCodes(subject.code)),
      ),
    );

    return parsedTerms.flatMap((term) =>
      term.parsedSubjects.flatMap((subject) => {
        const target = extractCodes(subject.code)[0] ?? subject.code;
        const prereqLines = extractCodes(subject.prereq)
          .filter((code) => knownCodes.has(code))
          .map((code) => ({
            id: `${code}-${target}-pre`,
            from: code,
            to: target,
            type: "Prerequisite",
          }));
        const coreqLines = extractCodes(subject.coreq)
          .filter((code) => knownCodes.has(code))
          .map((code) => ({
            id: `${code}-${target}-co`,
            from: code,
            to: target,
            type: "Co-requisite",
          }));

        return [...prereqLines, ...coreqLines];
      }),
    );
  }, [parsedTerms]);
  const graphConnectorLines = React.useMemo(
    () =>
      dependencyLines
        .map((line) => {
          const from = coursePositionMap.get(line.from);
          const to = coursePositionMap.get(line.to);

          if (!from || !to) {
            return null;
          }

          const fromColumnLeft =
            from.termIndex * (graphColumnWidth + graphColumnGap);
          const toColumnLeft = to.termIndex * (graphColumnWidth + graphColumnGap);
          const fromY =
            graphStackTop + from.courseIndex * graphNodeStep + graphNodeCenterY;
          const toY =
            graphStackTop + to.courseIndex * graphNodeStep + graphNodeCenterY;
          const startX = fromColumnLeft + graphNodeRightX;
          const endX = toColumnLeft + graphNodeLeftX;

          if (from.termIndex === to.termIndex) {
            const sideX = fromColumnLeft + graphColumnWidth - graphColumnPadding;
            const top = Math.min(fromY, toY);

            return {
              ...line,
              kind: "same-term" as const,
              sideX,
              top,
              height: Math.max(Math.abs(toY - fromY), graphMinLineWidth),
              fromY,
              toY,
            };
          }

          return {
            ...line,
            kind: "cross-term" as const,
            left: Math.min(startX, endX),
            top: Math.min(fromY, toY),
            width: Math.max(Math.abs(endX - startX), graphMinLineWidth),
            height: Math.abs(toY - fromY),
            fromY,
            toY,
          };
        })
        .filter(Boolean),
    [coursePositionMap, dependencyLines],
  );
  const graphCanvasHeight = Math.max(
    ...programGraphTerms.map(
      (term) =>
        graphStackTop +
        term.courses.length * graphNodeHeight +
        Math.max(term.courses.length - 1, 0) * graphNodeGap +
        graphColumnPadding,
    ),
    160,
  );

  return (
    <SecondaryScreenLayout
      title="Prospectus"
      description="Preview program flow, semester subjects, and curriculum checkpoints."
      onBack={onBack}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.programPicker}
      >
        {programOptions.map((program) => {
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
                {program.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.heroPanel, compact && styles.heroPanelCompact]}>
        <View style={styles.heroMain}>
          <View style={styles.heroIcon}>
            <Ionicons name="school" size={24} color={colors.gold} />
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>
              {activeProgram?.title ?? "No prospectus records yet"}
            </Text>
            <Text style={styles.heroSubtitle}>
              {activeProgram?.subtitle ??
                "Add prospectus records from the Faculty or Admin Console to show them here."}
            </Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>
              {totalUnits}
            </Text>
            <Text style={styles.statLabel}>Units</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>{totalSubjects}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>{prioritySubjects}</Text>
            <Text style={styles.statLabel}>Priority</Text>
          </View>
        </View>
      </View>

      {visibleRecords.length > 0 ? (
        <View style={styles.viewSection}>
          <View style={styles.viewSwitcher}>
            {[
              { id: "semester", label: "Semester", icon: "albums-outline" },
              { id: "graph", label: "Graph", icon: "git-network-outline" },
              { id: "traditional", label: "Traditional", icon: "grid-outline" },
              ...(technicalElectives.length > 0
                ? [
                    {
                      id: "electives",
                      label: "Electives",
                      icon: "list-outline",
                    },
                  ]
                : []),
            ].map((view) => {
              const selected = activeView === view.id;

              return (
                <Pressable
                  key={view.id}
                  accessibilityRole="button"
                  style={[styles.viewTab, selected && styles.viewTabActive]}
                  onPress={() => setActiveView(view.id as ProspectusView)}
                >
                  <Ionicons
                    name={view.icon as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={selected ? colors.surface : colors.maroon}
                  />
                  <Text
                    style={[
                      styles.viewTabText,
                      selected && styles.viewTabTextActive,
                    ]}
                  >
                    {view.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {activeView === "electives" && technicalElectives.length > 0 ? (
        <View style={styles.summarySection}>
          <View style={styles.summaryPanel}>
            <Text style={styles.electiveTitle}>Offered Technical Electives</Text>
            <View style={styles.electiveGrid}>
              {technicalElectives.map((elective) => (
                <View key={elective} style={styles.electiveChip}>
                  <Text style={styles.electiveText}>{elective}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : null}

      {activeView === "semester" ? (
        <View style={styles.termStack}>
          {parsedTerms.map((term) => (
            <View key={term.id} style={styles.termCard}>
              <View style={styles.termHeader}>
                <View>
                  <Text style={styles.termKicker}>{term.yearLevel}</Text>
                  <Text style={styles.termTitle}>{term.semester}</Text>
                </View>
                <View style={styles.termSummary}>
                  <Text style={styles.termSummaryValue}>
                    {term.parsedSubjects.reduce(
                      (total, subject) => total + subject.unitValue,
                      0,
                    )}
                  </Text>
                  <Text style={styles.termSummaryLabel}>units</Text>
                </View>
              </View>

              <View style={styles.subjectList}>
                {term.parsedSubjects.map((subject) => {
                  const unlocks = extractCodes(subject.code).reduce(
                    (total, code) => total + (unlockCounts.get(code) ?? 0),
                    0,
                  );
                  const importance = getCourseImportance(subject, unlocks);
                  const priority = importance !== "standard";

                  return (
                    <View
                      key={`${term.id}-${subject.raw}`}
                      style={[
                        styles.subjectRow,
                        priority && styles.subjectRowPriority,
                      ]}
                    >
                      <View
                        style={[
                          styles.importanceRail,
                          priority && styles.importanceRailPriority,
                        ]}
                      />
                      <View style={styles.subjectBody}>
                        <View style={styles.subjectTopLine}>
                          <Text
                            style={[
                              styles.codeBadge,
                              priority && styles.codeBadgePriority,
                            ]}
                          >
                            {subject.code}
                          </Text>
                          <Text style={styles.unitBadge}>{subject.units}u</Text>
                        </View>
                        <Text style={styles.subjectTitle}>{subject.title}</Text>
                        <View style={styles.metaRow}>
                          <Text style={styles.metaText}>Lec {subject.lec}</Text>
                          <Text style={styles.metaText}>Lab {subject.lab}</Text>
                          <Text style={styles.metaText}>
                            Pre: {subject.prereq}
                          </Text>
                          <Text style={styles.metaText}>
                            Co: {subject.coreq}
                          </Text>
                          <Text style={styles.metaText}>
                            Importance: {importance}
                          </Text>
                        </View>
                        {priority ? (
                          <View style={styles.priorityNote}>
                            <Ionicons
                              name="git-network-outline"
                              size={13}
                              color={colors.success}
                            />
                            <Text style={styles.priorityText}>
                              {unlocks > 0
                                ? `Priority course. Unlocks ${unlocks} later course(s).`
                                : importance === "foundation"
                                  ? "Foundation course. Treat this as a high-importance subject."
                                  : "Priority course. Check prerequisite or co-requisite before enrolling."}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {activeView === "graph" ? (
        <View style={styles.programGraphPanel}>
          <View style={styles.programGraphHeader}>
            <View>
              <Text style={styles.panelTitle}>
                {activeProgram?.label ?? "Program"} Program Graph
              </Text>
              <Text style={styles.programGraphSubtitle}>
                Courses are grouped by semester. Color shows course importance;
                connector lines show which subjects unlock later courses.
              </Text>
            </View>
            <View style={styles.graphLegend}>
              <View style={styles.legendItemInline}>
                <View style={[styles.legendDot, styles.foundationDot]} />
                <Text style={styles.legendText}>Major gateway</Text>
              </View>
              <View style={styles.legendItemInline}>
                <View style={[styles.legendDot, styles.gatewayDot]} />
                <Text style={styles.legendText}>Unlocks later</Text>
              </View>
              <View style={styles.legendItemInline}>
                <View style={[styles.legendDot, styles.dependentDot]} />
                <Text style={styles.legendText}>Has requirement</Text>
              </View>
              <View style={styles.legendItemInline}>
                <View style={[styles.legendDot, styles.standardDot]} />
                <Text style={styles.legendText}>Regular</Text>
              </View>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.programGraphScroller}
          >
            <View
              style={[
                styles.graphCanvas,
                {
                  height: graphCanvasHeight,
                  width:
                    programGraphTerms.length * graphColumnWidth +
                    Math.max(programGraphTerms.length - 1, 0) * graphColumnGap,
                },
              ]}
            >
              <View pointerEvents="none" style={styles.graphLineLayer}>
                {graphConnectorLines.map((line) =>
                  line?.kind === "cross-term" ? (
                    <View key={line.id}>
                      <View
                        style={[
                          styles.connectorHorizontal,
                          line.type === "Co-requisite" && styles.connectorCoreq,
                          {
                            left: line.left,
                            top: line.fromY,
                            width: line.width,
                          },
                        ]}
                      />
                      {line.height > 0 ? (
                        <View
                          style={[
                            styles.connectorVertical,
                            line.type === "Co-requisite" && styles.connectorCoreq,
                            {
                              left: line.left + line.width - 1,
                              top: line.top,
                              height: line.height,
                            },
                          ]}
                        />
                      ) : null}
                    </View>
                  ) : line ? (
                    <View key={line.id}>
                      <View
                        style={[
                          styles.connectorVertical,
                          line.type === "Co-requisite" && styles.connectorCoreq,
                          {
                            left: line.sideX,
                            top: line.top,
                            height: line.height,
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.connectorHorizontal,
                          line.type === "Co-requisite" && styles.connectorCoreq,
                          {
                            left: line.sideX - graphMinLineWidth,
                            top: line.fromY,
                            width: graphMinLineWidth,
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.connectorHorizontal,
                          line.type === "Co-requisite" && styles.connectorCoreq,
                          {
                            left: line.sideX - graphMinLineWidth,
                            top: line.toY,
                            width: graphMinLineWidth,
                          },
                        ]}
                      />
                    </View>
                  ) : null,
                )}
              </View>

              {programGraphTerms.map((term) => (
                <View key={term.id} style={styles.graphTermColumn}>
                  <Text style={styles.graphTermTitle}>{term.label}</Text>
                  <View style={styles.graphNodeStack}>
                    {term.courses.map(({ subject, importance, unlocks }) => (
                      <View
                        key={`${term.id}-${subject.raw}`}
                        style={[
                          styles.courseNode,
                          importance === "foundation" && styles.courseNodeFoundation,
                          importance === "gateway" && styles.courseNodeGateway,
                          importance === "dependent" && styles.courseNodeDependent,
                        ]}
                      >
                        <View
                          style={[
                            styles.nodeDot,
                            importance === "foundation" && styles.nodeDotFoundation,
                            importance === "gateway" && styles.nodeDotGateway,
                            importance === "dependent" && styles.nodeDotDependent,
                          ]}
                        />
                        <View style={styles.nodeTextWrap}>
                          <Text
                            style={[
                              styles.nodeCode,
                              importance === "foundation" && styles.nodeCodeFoundation,
                              importance === "gateway" && styles.nodeCodeGateway,
                              importance === "dependent" && styles.nodeCodeDependent,
                            ]}
                          >
                            {subject.code}
                          </Text>
                          <Text style={styles.nodeTitle} numberOfLines={2}>
                            {subject.title}
                          </Text>
                          <Text style={styles.nodeMeta}>
                            {subject.units}u
                            {unlocks > 0 ? ` / unlocks ${unlocks}` : ""}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.dependencyPanel}>
            <Text style={styles.dependencyTitle}>Lines</Text>
            <View style={styles.dependencyList}>
              {dependencyLines.map((line) => (
                <View key={line.id} style={styles.dependencyLineRow}>
                  <Text style={styles.dependencyCode}>{line.from}</Text>
                  <View
                    style={[
                      styles.dependencyLine,
                      line.type === "Co-requisite" && styles.coreqLine,
                    ]}
                  />
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={
                      line.type === "Co-requisite" ? colors.goldDark : colors.success
                    }
                  />
                  <Text style={styles.dependencyCode}>{line.to}</Text>
                  <Text style={styles.dependencyType}>{line.type}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : null}

      {activeView === "traditional" ? (
        <View style={styles.traditionalStack}>
          {parsedTerms.map((term) => {
            const termUnits = term.parsedSubjects.reduce(
              (total, subject) => total + subject.unitValue,
              0,
            );

            return (
              <View key={term.id} style={styles.traditionalSheet}>
                <View style={styles.traditionalTitleBand}>
                  <View>
                    <Text style={styles.traditionalKicker}>
                      {term.yearLevel}
                    </Text>
                    <Text style={styles.traditionalTitle}>
                      {term.semester}
                    </Text>
                  </View>
                  <View style={styles.traditionalTotalBadge}>
                    <Text style={styles.traditionalTotalValue}>{termUnits}</Text>
                    <Text style={styles.traditionalTotalLabel}>units</Text>
                  </View>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tableScroller}
                >
                  <View style={styles.prospectusTable}>
                    <View style={[styles.tableRow, styles.tableHeaderRow]}>
                      <Text style={[styles.tableHeaderText, styles.codeCell]}>
                        Course No.
                      </Text>
                      <Text style={[styles.tableHeaderText, styles.titleCell]}>
                        Descriptive Title
                      </Text>
                      <Text style={[styles.tableHeaderText, styles.smallCell]}>
                        Units
                      </Text>
                      <Text style={[styles.tableHeaderText, styles.smallCell]}>
                        Lec
                      </Text>
                      <Text style={[styles.tableHeaderText, styles.smallCell]}>
                        Lab
                      </Text>
                      <Text style={[styles.tableHeaderText, styles.reqCell]}>
                        Pre-req
                      </Text>
                      <Text style={[styles.tableHeaderText, styles.reqCell]}>
                        Co-req
                      </Text>
                    </View>

                    {term.parsedSubjects.map((subject, index) => (
                      <View
                        key={`${term.id}-table-${subject.raw}`}
                        style={[
                          styles.tableRow,
                          index % 2 === 1 && styles.tableRowAlt,
                        ]}
                      >
                        <Text style={[styles.tableCodeText, styles.codeCell]}>
                          {subject.code}
                        </Text>
                        <Text style={[styles.tableBodyText, styles.titleCell]}>
                          {subject.title}
                        </Text>
                        <Text style={[styles.tableNumberText, styles.smallCell]}>
                          {subject.units}
                        </Text>
                        <Text style={[styles.tableNumberText, styles.smallCell]}>
                          {subject.lec}
                        </Text>
                        <Text style={[styles.tableNumberText, styles.smallCell]}>
                          {subject.lab}
                        </Text>
                        <Text style={[styles.tableBodyText, styles.reqCell]}>
                          {subject.prereq}
                        </Text>
                        <Text style={[styles.tableBodyText, styles.reqCell]}>
                          {subject.coreq}
                        </Text>
                      </View>
                    ))}

                    <View style={[styles.tableRow, styles.tableFooterRow]}>
                      <Text style={[styles.tableFooterText, styles.footerLabelCell]}>
                        Total Units
                      </Text>
                      <Text style={[styles.tableFooterText, styles.smallCell]}>
                        {termUnits}
                      </Text>
                      <Text style={[styles.tableFooterText, styles.smallCell]} />
                      <Text style={[styles.tableFooterText, styles.smallCell]} />
                      <Text style={[styles.tableFooterText, styles.reqCell]} />
                      <Text style={[styles.tableFooterText, styles.reqCell]} />
                    </View>
                  </View>
                </ScrollView>
              </View>
            );
          })}
        </View>
      ) : null}

      {visibleRecords.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            {activeProgram?.title
              ? `${activeProgram.title} is empty for now`
              : "No prospectus records found"}
          </Text>
          <Text style={styles.emptyText}>
            Add prospectus records in the Faculty or Admin Console and they will
            appear here after Supabase syncs.
          </Text>
        </View>
      ) : null}

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Curriculum note</Text>
        <Text style={styles.noteText}>
          Prospectus entries should be added through the Faculty or Admin Console and
          confirmed with the latest college curriculum. Always confirm final
          advising, substitutions, and prerequisite clearance with the college or
          department before enrollment.
        </Text>
      </View>
    </SecondaryScreenLayout>
  );
}

const styles = StyleSheet.create({
  programPicker: {
    flexDirection: "row",
    gap: 10,
    paddingRight: 18,
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
    gap: 16,
    padding: 18,
    borderRadius: radii.sm,
    backgroundColor: colors.maroon,
  },
  heroPanelCompact: {
    padding: 16,
  },
  heroMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
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
    fontWeight: "900",
  },
  heroSubtitle: {
    marginTop: 6,
    color: "rgba(255,255,255,0.84)",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  statRow: {
    flexDirection: "row",
    gap: 10,
  },
  statPill: {
    flex: 1,
    minHeight: 62,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  statValue: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: "900",
  },
  statLabel: {
    marginTop: 3,
    color: "rgba(255,255,255,0.78)",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  viewSection: {
    width: "100%",
    maxWidth: maxContentWidth,
    alignSelf: "center",
  },
  summarySection: {
    width: "100%",
    maxWidth: maxContentWidth,
    alignSelf: "center",
  },
  summaryPanel: {
    width: "100%",
    gap: 14,
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryKicker: {
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  summaryTitle: {
    marginTop: 4,
    color: colors.maroonDark,
    fontSize: 17,
    fontWeight: "900",
  },
  summaryTotalPill: {
    minWidth: 88,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.maroonSoft,
    borderWidth: 1,
    borderColor: "#E5C5C8",
  },
  summaryTotalValue: {
    color: colors.maroon,
    fontSize: 16,
    fontWeight: "900",
  },
  summaryTotalLabel: {
    marginTop: 2,
    color: colors.maroonDark,
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  unitTable: {
    overflow: "hidden",
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
  },
  unitRow: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.surfaceMuted,
  },
  unitRowLast: {
    borderBottomWidth: 0,
  },
  unitTerm: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800",
  },
  unitValue: {
    color: colors.maroon,
    fontSize: 13,
    fontWeight: "900",
  },
  electiveTitle: {
    color: colors.maroonDark,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  electiveGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  electiveChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  electiveText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800",
  },
  legendPanel: {
    width: "100%",
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  panelTitle: {
    color: colors.maroonDark,
    fontSize: 15,
    fontWeight: "900",
  },
  legendItem: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 3,
  },
  foundationDot: {
    backgroundColor: colors.success,
  },
  gatewayDot: {
    backgroundColor: colors.teal,
  },
  dependentDot: {
    backgroundColor: colors.goldDark,
  },
  standardDot: {
    backgroundColor: colors.blue,
  },
  legendText: {
    flex: 1,
    minWidth: 0,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
  termStack: {
    width: "100%",
    maxWidth: maxContentWidth,
    alignSelf: "center",
    gap: 12,
  },
  termCard: {
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  termHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  termKicker: {
    color: colors.goldDark,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  termTitle: {
    marginTop: 5,
    color: colors.maroonDark,
    fontSize: 19,
    fontWeight: "900",
  },
  termSummary: {
    minWidth: 58,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.maroonSoft,
  },
  termSummaryValue: {
    color: colors.maroon,
    fontSize: 18,
    fontWeight: "900",
  },
  termSummaryLabel: {
    color: colors.maroon,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  subjectList: {
    gap: 10,
    marginTop: 16,
  },
  subjectRow: {
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  subjectRowPriority: {
    backgroundColor: "#F2FBF6",
    borderColor: "#BFE8CE",
  },
  importanceRail: {
    width: 6,
    backgroundColor: colors.blue,
  },
  importanceRailPriority: {
    backgroundColor: colors.success,
  },
  subjectBody: {
    flex: 1,
    minWidth: 0,
    padding: 12,
  },
  subjectTopLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  codeBadge: {
    flexShrink: 1,
    color: colors.surface,
    backgroundColor: colors.blue,
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radii.pill,
    fontSize: 11,
    fontWeight: "900",
  },
  codeBadgePriority: {
    backgroundColor: colors.success,
  },
  unitBadge: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  subjectTitle: {
    marginTop: 9,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 9,
  },
  metaText: {
    color: colors.muted,
    backgroundColor: "rgba(255,255,255,0.76)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    fontSize: 10,
    fontWeight: "800",
  },
  priorityNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  priorityText: {
    flex: 1,
    minWidth: 0,
    color: colors.success,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "900",
  },
  viewSwitcher: {
    width: "100%",
    maxWidth: maxContentWidth,
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 5,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  viewTab: {
    minWidth: 120,
    flexGrow: 1,
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  viewTabActive: {
    backgroundColor: colors.maroon,
  },
  viewTabText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: "900",
  },
  viewTabTextActive: {
    color: colors.surface,
  },
  programGraphPanel: {
    width: "100%",
    maxWidth: maxContentWidth,
    alignSelf: "center",
    gap: 14,
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: "#FCFBF8",
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  programGraphHeader: {
    gap: 12,
  },
  programGraphSubtitle: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
  graphLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  legendItemInline: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  programGraphScroller: {
    paddingRight: 12,
    paddingBottom: 4,
  },
  graphCanvas: {
    position: "relative",
    flexDirection: "row",
    gap: graphColumnGap,
    paddingVertical: 2,
  },
  graphLineLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  connectorHorizontal: {
    position: "absolute",
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.success,
    opacity: 0.5,
  },
  connectorVertical: {
    position: "absolute",
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.success,
    opacity: 0.5,
  },
  connectorCoreq: {
    backgroundColor: colors.goldDark,
    opacity: 0.56,
  },
  graphTermColumn: {
    zIndex: 2,
    width: graphColumnWidth,
    padding: 12,
    borderRadius: radii.sm,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  graphTermTitle: {
    color: colors.maroonDark,
    fontSize: 13,
    fontWeight: "900",
  },
  graphNodeStack: {
    marginTop: 12,
    gap: graphNodeGap,
  },
  courseNode: {
    height: graphNodeHeight,
    flexDirection: "row",
    gap: 9,
    padding: 11,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#D5E3EF",
    shadowColor: "#251D1F",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
  courseNodeFoundation: {
    backgroundColor: "#F2FBF6",
    borderColor: "#92D4AC",
  },
  courseNodeGateway: {
    backgroundColor: "#E8F5F2",
    borderColor: "#A6DCD2",
  },
  courseNodeDependent: {
    backgroundColor: "#FFF8E6",
    borderColor: "#EEDCA7",
  },
  nodeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 3,
    backgroundColor: colors.blue,
  },
  nodeDotFoundation: {
    backgroundColor: colors.success,
  },
  nodeDotGateway: {
    backgroundColor: colors.teal,
  },
  nodeDotDependent: {
    backgroundColor: colors.goldDark,
  },
  nodeTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  nodeCode: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: "900",
  },
  nodeCodeFoundation: {
    color: colors.success,
  },
  nodeCodeGateway: {
    color: colors.teal,
  },
  nodeCodeDependent: {
    color: colors.goldDark,
  },
  nodeTitle: {
    marginTop: 3,
    color: colors.ink,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "800",
  },
  nodeMeta: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
  },
  dependencyPanel: {
    padding: 12,
    borderRadius: radii.sm,
    backgroundColor: "#FAFCFB",
    borderWidth: 1,
    borderColor: colors.line,
  },
  dependencyTitle: {
    color: colors.maroonDark,
    fontSize: 13,
    fontWeight: "900",
  },
  dependencyList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  dependencyLineRow: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  dependencyCode: {
    color: colors.maroonDark,
    fontSize: 11,
    fontWeight: "900",
  },
  dependencyLine: {
    width: 28,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.success,
  },
  coreqLine: {
    backgroundColor: colors.goldDark,
  },
  dependencyType: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
  },
  traditionalStack: {
    width: "100%",
    maxWidth: maxContentWidth,
    alignSelf: "center",
    gap: 14,
  },
  traditionalSheet: {
    overflow: "hidden",
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  traditionalTitleBand: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 16,
    backgroundColor: colors.maroon,
  },
  traditionalKicker: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  traditionalTitle: {
    marginTop: 5,
    color: colors.surface,
    fontSize: 18,
    fontWeight: "900",
  },
  traditionalTotalBadge: {
    minWidth: 64,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: radii.sm,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  traditionalTotalValue: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: "900",
  },
  traditionalTotalLabel: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  tableScroller: {
    padding: 12,
  },
  prospectusTable: {
    minWidth: 900,
    overflow: "hidden",
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 46,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tableHeaderRow: {
    minHeight: 44,
    backgroundColor: "#F6EFE1",
  },
  tableRowAlt: {
    backgroundColor: "#FBFAF7",
  },
  tableFooterRow: {
    minHeight: 42,
    backgroundColor: colors.maroonSoft,
    borderBottomWidth: 0,
  },
  tableHeaderText: {
    color: colors.maroonDark,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  tableBodyText: {
    color: colors.ink,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
  },
  tableCodeText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: "900",
  },
  tableNumberText: {
    color: colors.ink,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "900",
  },
  tableFooterText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  codeCell: {
    width: 118,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: colors.line,
  },
  titleCell: {
    width: 290,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: colors.line,
  },
  smallCell: {
    width: 62,
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: colors.line,
  },
  reqCell: {
    width: 150,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: colors.line,
  },
  footerLabelCell: {
    width: 408,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: colors.line,
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
    fontWeight: "900",
  },
  noteText: {
    marginTop: 6,
    color: colors.ink,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
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
    fontWeight: "900",
  },
  emptyText: {
    marginTop: 8,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
  },
});
