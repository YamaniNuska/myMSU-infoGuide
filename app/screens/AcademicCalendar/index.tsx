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
import { colors, radii, shadow } from "../../../src/theme";

type AcademicCalendarScreenProps = {
  onBack?: () => void;
};

const VIEW_OPTIONS = [
  { id: "month", label: "Month", icon: "calendar-outline" },
  { id: "table", label: "Table", icon: "grid-outline" },
] as const;

type CalendarView = (typeof VIEW_OPTIONS)[number]["id"];

type TableRow = {
  activity: string;
  firstSemester?: string;
  secondSemester?: string;
  summer?: string;
  highlight?: boolean;
  section?: boolean;
};

type SemesterKey = "firstSemester" | "secondSemester" | "summer";

type OfficialCalendarEvent = {
  id: string;
  title: string;
  semester: string;
  dateLabel: string;
  dateKey: string;
  kind: "enrollment" | "classes" | "exam" | "deadline" | "event";
};

const tableColumns = [
  { key: "activity", title: "Activity", width: 360 },
  { key: "firstSemester", title: "First Semester", subtitle: "August - December 2025", width: 210 },
  { key: "secondSemester", title: "Second Semester", subtitle: "January - May 2026", width: 210 },
  { key: "summer", title: "Summer", subtitle: "June - July 2026", width: 170 },
] as const;

const academicTableRows: TableRow[] = [
  {
    activity: "System Admission and Scholarship Examination (SASE) / Special College Entrance Test (CET)",
    firstSemester: "Per OVPAA & Adm. schedule",
    secondSemester: "Per OVPAA & Adm. schedule",
  },
  {
    activity: "Review/update the syllabus, assess student record status, and formulate a detailed semester plan",
    firstSemester: "Mon, 21 Jul - Fri, 25 Jul",
    secondSemester: "Mon, 05 Jan - Fri, 09 Jan",
    summer: "Mon, 01 Jun - Fri, 05 Jun",
  },
  {
    activity: "Enrollment for Freshmen/New Students",
    firstSemester: "Mon, 28 Jul - Fri, 01 Aug",
    secondSemester: "Mon, 12 Jan - Fri, 16 Jan",
  },
  {
    activity: "Enrollment for Old Students",
    firstSemester: "Mon, 04 Aug - Fri, 08 Aug",
    secondSemester: "Mon, 19 Jan - Fri, 23 Jan",
  },
  {
    activity: "Last Day for Validation of Enrollment and Billing Forms (EBF)",
    firstSemester: "Mon, 11 Aug",
    secondSemester: "Mon, 26 Jan",
  },
  {
    activity: "Start of Classes",
    firstSemester: "Mon, 11 Aug",
    secondSemester: "Mon, 26 Jan",
    summer: "Mon, 08 Jun",
    highlight: true,
  },
  {
    activity: "Late Registration with Fines",
    firstSemester: "Mon, 11 Aug - Fri, 15 Aug",
    secondSemester: "Mon, 26 Jan - Fri, 30 Jan",
  },
  {
    activity: "Change/Add Matriculation and Validation Period",
    firstSemester: "Mon, 11 Aug - Fri, 15 Aug",
    secondSemester: "Mon, 26 Jan - Fri, 30 Jan",
  },
  {
    activity: "General Convocation & College Orientation Program",
    firstSemester: "Per DSA schedule",
  },
  {
    activity: "64th MSU Founding Anniversary",
    firstSemester: "Mon, 01 Sep",
  },
  {
    activity: "Graduation candidate tentative list deadline",
    firstSemester: "Fri, 12 Sep",
    secondSemester: "Fri, 27 Feb",
  },
  {
    activity: "First Preliminary / Departmental Examinations",
    section: true,
  },
  {
    activity: "English",
    firstSemester: "Mon, 15 Sep (AM)",
    secondSemester: "Mon, 02 Mar (AM)",
  },
  {
    activity: "Philosophy",
    firstSemester: "Mon, 15 Sep (PM)",
    secondSemester: "Mon, 02 Mar (PM)",
  },
  {
    activity: "Mathematics",
    firstSemester: "Tue, 16 Sep (Whole Day)",
    secondSemester: "Tue, 03 Mar (Whole Day)",
  },
  {
    activity: "All other subjects",
    firstSemester: "Wed, 17 Sep (PM) - Sat, 20 Sep",
    secondSemester: "Wed, 04 Mar (PM) - Sat, 07 Mar",
  },
  {
    activity: "Special Committee of MSU Main Campus Council Meeting",
    firstSemester: "Wed, 01 Oct",
    secondSemester: "Wed, 11 Mar",
    highlight: true,
  },
  {
    activity: "Period of Dropping of Subjects",
    firstSemester: "Mon, 22 Sep - Fri, 10 Oct",
    secondSemester: "Mon, 16 Mar - Fri, 03 Apr",
  },
  {
    activity: "MSU Main Campus Council Meeting",
    firstSemester: "Wed, 29 Oct",
    secondSemester: "Mon, 06 Apr",
    highlight: true,
  },
  {
    activity: "Midterm / Departmental Examinations",
    section: true,
    summer: "Wed, 25 Jun - Sat, 27 Jun",
  },
  {
    activity: "English",
    firstSemester: "Mon, 03 Nov (AM)",
    secondSemester: "Mon, 13 Apr (AM)",
  },
  {
    activity: "Philosophy",
    firstSemester: "Mon, 03 Nov (PM)",
    secondSemester: "Mon, 13 Apr (PM)",
  },
  {
    activity: "Mathematics",
    firstSemester: "Tue, 04 Nov (Whole Day)",
    secondSemester: "Tue, 14 Apr (Whole Day)",
  },
  {
    activity: "All other subjects",
    firstSemester: "Thu, 06 Nov - Sat, 08 Nov",
    secondSemester: "Thu, 16 Apr - Sat, 18 Apr",
  },
  {
    activity: "Pre-enrollment Period for the Next Semester",
    firstSemester: "Mon, 17 Nov - Fri, 21 Nov",
    secondSemester: "Mon, 27 Apr - Wed, 29 Apr",
  },
  {
    activity: "Last day for Filing of Leave of Absence",
    firstSemester: "Fri, 21 Nov",
    secondSemester: "Fri, 08 May",
  },
  {
    activity: "End of Classes",
    firstSemester: "Fri, 05 Dec",
    secondSemester: "Fri, 22 May",
    summer: "Fri, 10 Jul",
    highlight: true,
  },
  {
    activity: "Final / Departmental Examinations",
    section: true,
    summer: "Mon, 13 Jul - Fri, 17 Jul",
  },
  {
    activity: "Christmas Vacation / Semestral Break",
    firstSemester: "Mon, 22 Dec 2025 - Fri, 02 Jan 2026",
    secondSemester: "Mon, 01 Jun - Fri, 17 Jul",
  },
  {
    activity: "Deadline for Submission of Grades - Graduating",
    firstSemester: "Mon, 05 Jan 2026",
    secondSemester: "Mon, 08 Jun 2026",
    summer: "Wed, 29 Jul",
  },
  {
    activity: "Deadline for Submission of Grades - Non-Graduating",
    firstSemester: "Fri, 09 Jan 2026",
    secondSemester: "Fri, 12 Jun 2026",
  },
  {
    activity: "Pre-Commencement Exercises",
    firstSemester: "Mon, 09 Feb 2026",
    secondSemester: "Mon, 27 Jul 2026",
  },
  {
    activity: "Commencement Proper",
    firstSemester: "Tue, 10 Feb 2026",
    secondSemester: "Tue, 28 Jul 2026",
  },
];

const kindIcons: Record<OfficialCalendarEvent["kind"], keyof typeof Ionicons.glyphMap> = {
  enrollment: "create-outline",
  classes: "book-outline",
  event: "sparkles-outline",
  deadline: "hourglass-outline",
  exam: "document-text-outline",
};

const kindColors: Record<OfficialCalendarEvent["kind"], string> = {
  enrollment: colors.blue,
  classes: colors.teal,
  event: colors.goldDark,
  deadline: colors.danger,
  exam: colors.maroon,
};

const pad = (value: number) => String(value).padStart(2, "0");

const getDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const formatMonthTitle = (date: Date) =>
  date.toLocaleDateString(undefined, { month: "long", year: "numeric" });

const formatFullDate = (dateKey: string) => {
  const date = new Date(`${dateKey}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const monthMap: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  sept: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const semesterLabels: Record<SemesterKey, string> = {
  firstSemester: "First Semester",
  secondSemester: "Second Semester",
  summer: "Summer",
};

const inferYear = (semester: SemesterKey, month: number, explicitYear?: number) => {
  if (explicitYear) {
    return explicitYear;
  }

  if (semester === "firstSemester") {
    return month === 0 ? 2026 : 2025;
  }

  return 2026;
};

const parseDateLabelToDateKeys = (label: string, semester: SemesterKey) => {
  const matches = Array.from(
    label.matchAll(
      /\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+(\d{1,2})\s+([A-Za-z]{3,4})(?:\s+(\d{4}))?/gi,
    ),
  );
  const dates = matches
    .map((match) => {
      const day = Number(match[1]);
      const month = monthMap[match[2].toLowerCase()];
      const year = inferYear(
        semester,
        month,
        match[3] ? Number(match[3]) : undefined,
      );

      if (Number.isNaN(day) || month === undefined) {
        return undefined;
      }

      return new Date(year, month, day);
    })
    .filter((date): date is Date => Boolean(date));

  if (dates.length === 0) {
    return [];
  }

  if (dates.length === 1) {
    return [getDateKey(dates[0])];
  }

  const [start, end] = dates;
  const dateKeys: string[] = [];
  const cursor = new Date(start);
  const rangeLimit = 120;

  for (let index = 0; cursor <= end && index < rangeLimit; index += 1) {
    dateKeys.push(getDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dateKeys;
};

const classifyActivity = (activity: string): OfficialCalendarEvent["kind"] => {
  const text = activity.toLowerCase();

  if (text.includes("enrollment") || text.includes("registration")) {
    return "enrollment";
  }

  if (text.includes("class")) {
    return "classes";
  }

  if (text.includes("exam")) {
    return "exam";
  }

  if (
    text.includes("deadline") ||
    text.includes("last day") ||
    text.includes("submission")
  ) {
    return "deadline";
  }

  return "event";
};

const officialCalendarEvents: OfficialCalendarEvent[] = academicTableRows.flatMap((row, rowIndex) => {
  if (row.section) {
    return [];
  }

  return (["firstSemester", "secondSemester", "summer"] as SemesterKey[]).flatMap(
    (semester) => {
      const dateLabel = row[semester];
      const dateKeys = dateLabel
        ? parseDateLabelToDateKeys(dateLabel, semester)
        : [];

      if (!dateLabel || dateKeys.length === 0) {
        return [];
      }

      return dateKeys.map((dateKey) => ({
        id: `${rowIndex}-${semester}-${dateKey}`,
        title: row.activity,
        semester: semesterLabels[semester],
        dateLabel,
        dateKey,
        kind: classifyActivity(row.activity),
      }));
    },
  );
});

export default function AcademicCalendarScreen({
  onBack,
}: AcademicCalendarScreenProps) {
  const [activeView, setActiveView] = React.useState<CalendarView>("month");
  const [tableZoom, setTableZoom] = React.useState(0.78);
  const { width } = useWindowDimensions();
  const isWide = width >= 820;
  const todayKey = React.useMemo(() => getDateKey(new Date()), []);
  const initialDateKey = officialCalendarEvents[0]?.dateKey ?? todayKey;
  const initialDate = new Date(`${initialDateKey}T00:00:00`);
  const [visibleMonth, setVisibleMonth] = React.useState(
    () => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = React.useState(initialDateKey);

  const eventsByDate = React.useMemo(() => {
    const grouped = new Map<string, OfficialCalendarEvent[]>();

    officialCalendarEvents.forEach((event) => {
      grouped.set(event.dateKey, [...(grouped.get(event.dateKey) ?? []), event]);
    });

    return grouped;
  }, []);

  const selectedEvents = eventsByDate.get(selectedDate) ?? [];
  const monthEventCount = React.useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    return officialCalendarEvents.filter((event) => {
      const date = new Date(`${event.dateKey}T00:00:00`);

      return date.getFullYear() === year && date.getMonth() === month;
    }).length;
  }, [visibleMonth]);

  const days = React.useMemo(() => {
    const firstDay = visibleMonth.getDay();
    const count = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + 1,
      0,
    ).getDate();

    return [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: count }, (_, index) => index + 1),
    ];
  }, [visibleMonth]);

  const changeMonth = (offset: number) => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  const selectDay = (dateKey: string) => {
    setSelectedDate(dateKey);
  };

  const changeTableZoom = (offset: number) => {
    setTableZoom((current) => Math.min(1.25, Math.max(0.58, current + offset)));
  };

  const tableWidth = tableColumns.reduce((sum, column) => sum + column.width, 0);

  return (
    <SecondaryScreenLayout
      title="Academic Calendar"
      description="Official academic dates from the registrar-style table."
      onBack={onBack}
    >
      <View style={styles.viewToolbar}>
        <View style={styles.toolbarTitleBlock}>
          <Text style={styles.toolbarEyebrow}>SY 2025-2026</Text>
          <Text style={styles.toolbarTitle}>
            {activeView === "month" ? "Month View" : "Official Table"}
          </Text>
        </View>
        <View style={styles.segmentedControl}>
          {VIEW_OPTIONS.map((option) => {
            const isActive = activeView === option.id;

            return (
              <Pressable
                key={option.id}
                style={[styles.segmentButton, isActive && styles.segmentButtonActive]}
                onPress={() => setActiveView(option.id)}
              >
                <Ionicons
                  name={option.icon}
                  size={16}
                  color={isActive ? colors.surface : colors.maroon}
                />
                <Text
                  style={[
                    styles.segmentButtonText,
                    isActive && styles.segmentButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {activeView === "table" ? (
          <View style={styles.zoomControls}>
            <Pressable
              style={styles.zoomButton}
              onPress={() => changeTableZoom(-0.1)}
              accessibilityLabel="Zoom out"
            >
              <Ionicons name="remove" size={17} color={colors.maroonDark} />
            </Pressable>
            <Text style={styles.zoomText}>{Math.round(tableZoom * 100)}%</Text>
            <Pressable
              style={styles.zoomButton}
              onPress={() => changeTableZoom(0.1)}
              accessibilityLabel="Zoom in"
            >
              <Ionicons name="add" size={17} color={colors.maroonDark} />
            </Pressable>
          </View>
        ) : null}
      </View>

      {activeView === "month" ? (
        <View style={[styles.calendarWorkspace, isWide && styles.calendarWorkspaceWide]}>
          <View style={[styles.calendarPanel, isWide && styles.calendarPanelWide]}>
            <View style={styles.calendarHeader}>
              <Pressable
                style={styles.iconButton}
                onPress={() => changeMonth(-1)}
                accessibilityLabel="Previous month"
              >
                <Ionicons name="chevron-back" size={19} color={colors.maroonDark} />
              </Pressable>
              <View style={styles.monthTitleBlock}>
                <Text style={styles.monthTitle}>{formatMonthTitle(visibleMonth)}</Text>
                <Text style={styles.monthSubtitle}>
                  {monthEventCount} official date{monthEventCount === 1 ? "" : "s"}
                </Text>
              </View>
              <Pressable
                style={styles.iconButton}
                onPress={() => changeMonth(1)}
                accessibilityLabel="Next month"
              >
                <Ionicons name="chevron-forward" size={19} color={colors.maroonDark} />
              </Pressable>
            </View>

            <View style={styles.weekRow}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.dayGrid}>
              {days.map((day, index) => {
                if (!day) {
                  return <View key={`blank-${index}`} style={styles.dayCell} />;
                }

                const date = new Date(
                  visibleMonth.getFullYear(),
                  visibleMonth.getMonth(),
                  day,
                );
                const dateKey = getDateKey(date);
                const dayEvents = eventsByDate.get(dateKey) ?? [];
                const selected = selectedDate === dateKey;
                const isToday = todayKey === dateKey;
                const previewEvents = dayEvents.slice(0, 3);

                return (
                  <Pressable
                    key={dateKey}
                    style={[
                      styles.dayCell,
                      dayEvents.length > 0 && styles.dayCellHasEvent,
                      isToday && styles.dayCellToday,
                      selected && styles.dayCellSelected,
                    ]}
                    onPress={() => selectDay(dateKey)}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        selected && styles.dayNumberSelected,
                      ]}
                    >
                      {day}
                    </Text>
                    {dayEvents.length > 0 ? (
                      <View style={styles.eventDotRow}>
                        {previewEvents.map((event) => (
                          <View
                            key={event.id}
                            style={[
                              styles.eventDot,
                              { backgroundColor: selected ? colors.gold : kindColors[event.kind] },
                            ]}
                          />
                        ))}
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={[styles.selectedPanel, isWide && styles.selectedPanelWide]}>
            <View style={styles.selectedHeader}>
              <View style={styles.selectedHeaderCopy}>
                <Text style={styles.selectedEyebrow}>
                  {selectedEvents.length} official date{selectedEvents.length === 1 ? "" : "s"}
                </Text>
                <Text style={styles.selectedTitle}>{formatFullDate(selectedDate)}</Text>
              </View>
            </View>
            {selectedEvents.length > 0 ? (
              <View style={styles.agendaList}>
                {selectedEvents.map((event) => (
                  <View key={event.id} style={styles.agendaItem}>
                    <View
                      style={[
                        styles.agendaAccent,
                        { backgroundColor: kindColors[event.kind] },
                      ]}
                    />
                    <View style={styles.agendaIcon}>
                      <Ionicons
                        name={kindIcons[event.kind]}
                        size={17}
                        color={kindColors[event.kind]}
                      />
                    </View>
                    <View style={styles.agendaCopy}>
                      <Text style={styles.agendaType}>
                        {event.semester} | {event.dateLabel}
                      </Text>
                      <Text style={styles.agendaTitle}>{event.title}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>
                No calendar entries for this date.
              </Text>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.tablePanel}>
          <View style={styles.tableHeaderCard}>
            <View style={styles.tableSeal}>
              <Ionicons name="document-text-outline" size={21} color={colors.surface} />
            </View>
            <View style={styles.tableHeaderCopy}>
              <Text style={styles.tableEyebrow}>Office of the University Registrar</Text>
              <Text style={styles.tableTitle}>Academic Calendar, School Year 2025-2026</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={[styles.table, { minWidth: tableWidth * tableZoom }]}>
              <View style={styles.tableRowHeader}>
                {tableColumns.map((column) => (
                  <View
                    key={column.key}
                    style={[
                      styles.tableCell,
                      styles.tableHeadCell,
                      {
                        width: column.width * tableZoom,
                        paddingHorizontal: 10 * tableZoom,
                        paddingVertical: 8 * tableZoom,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tableHeadText,
                        {
                          fontSize: 12 * tableZoom,
                          lineHeight: 16 * tableZoom,
                        },
                      ]}
                    >
                      {column.title}
                    </Text>
                    {"subtitle" in column ? (
                      <Text
                        style={[
                          styles.tableHeadSubtext,
                          {
                            fontSize: 10 * tableZoom,
                            lineHeight: 13 * tableZoom,
                          },
                        ]}
                      >
                        {column.subtitle}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
              {academicTableRows.map((row, index) => (
                <View
                  key={`${row.activity}-${index}`}
                  style={[
                    styles.tableRow,
                    row.section && styles.tableSectionRow,
                    row.highlight && styles.tableHighlightRow,
                    { minHeight: 38 * tableZoom },
                  ]}
                >
                  {tableColumns.map((column) => (
                    <View
                      key={column.key}
                      style={[
                        styles.tableCell,
                        {
                          width: column.width * tableZoom,
                          paddingHorizontal: 10 * tableZoom,
                          paddingVertical: 8 * tableZoom,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tableCellText,
                          {
                            fontSize: (column.key === "activity" ? 12 : 11) * tableZoom,
                            lineHeight: 17 * tableZoom,
                          },
                          column.key === "activity" && styles.tableActivityText,
                          row.section && styles.tableSectionText,
                        ]}
                      >
                        {row[column.key] ?? ""}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </SecondaryScreenLayout>
  );
}

const styles = StyleSheet.create({
  viewToolbar: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 12,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  toolbarTitleBlock: {
    flex: 1,
    minWidth: 130,
  },
  toolbarEyebrow: {
    color: colors.goldDark,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  toolbarTitle: {
    marginTop: 2,
    color: colors.maroonDark,
    fontSize: 16,
    fontWeight: "900",
  },
  segmentedControl: {
    flexDirection: "row",
    gap: 4,
    padding: 3,
    borderRadius: radii.sm,
    backgroundColor: colors.canvas,
  },
  segmentButton: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
  },
  segmentButtonActive: {
    backgroundColor: colors.maroon,
  },
  segmentButtonText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: "900",
  },
  segmentButtonTextActive: {
    color: colors.surface,
  },
  zoomControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  zoomButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.sm,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  zoomText: {
    minWidth: 42,
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },
  calendarWorkspace: {
    gap: 14,
  },
  calendarWorkspaceWide: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  calendarPanel: {
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(44, 6, 10, 0.08)",
    ...shadow,
  },
  calendarPanelWide: {
    flex: 1.5,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(44, 6, 10, 0.08)",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: "rgba(44, 6, 10, 0.08)",
  },
  monthTitleBlock: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
  },
  monthTitle: {
    color: colors.maroonDark,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  monthSubtitle: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
  },
  weekRow: {
    flexDirection: "row",
    marginTop: 16,
    paddingHorizontal: 2,
  },
  weekDay: {
    width: "14.285%",
    color: colors.muted,
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
  },
  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
    marginTop: 10,
    borderRadius: radii.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  dayCell: {
    width: "14.285%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(44, 6, 10, 0.06)",
    backgroundColor: colors.surface,
  },
  dayCellHasEvent: {
    backgroundColor: "#FFFCF7",
  },
  dayCellToday: {
    backgroundColor: colors.tealSoft,
  },
  dayCellSelected: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  dayNumber: {
    color: colors.maroonDark,
    fontSize: 13,
    fontWeight: "800",
  },
  dayNumberSelected: {
    color: colors.surface,
  },
  eventDotRow: {
    flexDirection: "row",
    gap: 3,
    minHeight: 5,
    marginTop: 6,
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.maroon,
  },
  selectedPanel: {
    padding: 16,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(44, 6, 10, 0.08)",
    ...shadow,
  },
  selectedPanelWide: {
    flex: 1,
  },
  selectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(44, 6, 10, 0.08)",
  },
  selectedHeaderCopy: {
    flex: 1,
    minWidth: 0,
  },
  selectedEyebrow: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  selectedTitle: {
    flex: 1,
    minWidth: 0,
    color: colors.maroonDark,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  agendaList: {
    gap: 0,
  },
  agendaItem: {
    flexDirection: "row",
    position: "relative",
    gap: 10,
    paddingVertical: 13,
    paddingLeft: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(44, 6, 10, 0.08)",
  },
  agendaAccent: {
    position: "absolute",
    left: 0,
    top: 15,
    bottom: 15,
    width: 3,
    borderRadius: 2,
  },
  agendaIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: "rgba(44, 6, 10, 0.06)",
  },
  agendaCopy: {
    flex: 1,
    minWidth: 0,
  },
  agendaType: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  agendaTitle: {
    marginTop: 3,
    color: colors.maroonDark,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
  emptyText: {
    marginTop: 14,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800",
  },
  tablePanel: {
    padding: 12,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  tableHeaderCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 12,
    padding: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.maroonDark,
  },
  tableSeal: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.sm,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  tableHeaderCopy: {
    flex: 1,
    minWidth: 0,
  },
  tableEyebrow: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  tableTitle: {
    marginTop: 3,
    color: colors.surface,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
  },
  table: {
    overflow: "hidden",
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: "#2C2424",
    backgroundColor: colors.surface,
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2424",
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 38,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D0CB",
  },
  tableSectionRow: {
    backgroundColor: "#F3EEE7",
  },
  tableHighlightRow: {
    backgroundColor: "#FFF4A8",
  },
  tableCell: {
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: "#2C2424",
  },
  tableHeadCell: {
    alignItems: "center",
  },
  tableHeadText: {
    color: colors.maroonDark,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
  },
  tableHeadSubtext: {
    marginTop: 2,
    color: colors.ink,
    fontWeight: "800",
    textAlign: "center",
  },
  tableCellText: {
    color: colors.ink,
    lineHeight: 17,
    fontWeight: "700",
  },
  tableActivityText: {
    fontWeight: "800",
  },
  tableSectionText: {
    color: colors.maroonDark,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});
