import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useAppData } from "../../../src/data/appStore";
import type { AcademicEvent } from "../../../src/data/mymsuDatabase";
import { colors, getCardWidth, getColumnCount, radii, shadow } from "../../../src/theme";
import SecondaryScreenLayout from "../../../src/components/SecondaryScreenLayout";

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

const pad = (value: number) => String(value).padStart(2, "0");

const getDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const isDateKey = (value?: string) =>
  Boolean(value) &&
  /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") &&
  !Number.isNaN(new Date(`${value}T00:00:00`).getTime());

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

const getEventDateKey = (event?: AcademicEvent) => {
  const eventDate = event?.eventDate;

  return isDateKey(eventDate) ? eventDate : undefined;
};

export default function AcademicCalendarScreen({
  onBack,
}: AcademicCalendarScreenProps) {
  const [activeType, setActiveType] = React.useState("all");
  const { academicEvents } = useAppData();
  const { width } = useWindowDimensions();
  const isWide = width >= 820;
  const todayKey = React.useMemo(() => getDateKey(new Date()), []);
  const firstDatedEvent = React.useMemo(
    () => academicEvents.find((event) => getEventDateKey(event)),
    [academicEvents],
  );
  const initialDateKey = getEventDateKey(firstDatedEvent) ?? todayKey;
  const initialDate = new Date(`${initialDateKey}T00:00:00`);
  const [visibleMonth, setVisibleMonth] = React.useState(
    () => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = React.useState(initialDateKey);
  const columns = getColumnCount(width);

  const visibleEvents =
    activeType === "all"
      ? academicEvents
      : academicEvents.filter((event) => event.type === activeType);

  const eventsByDate = React.useMemo(() => {
    const grouped = new Map<string, AcademicEvent[]>();

    visibleEvents.forEach((event) => {
      const dateKey = getEventDateKey(event);

      if (!dateKey) {
        return;
      }

      grouped.set(dateKey, [...(grouped.get(dateKey) ?? []), event]);
    });

    return grouped;
  }, [visibleEvents]);

  const selectedEvents = eventsByDate.get(selectedDate) ?? [];
  const undatedEvents = visibleEvents.filter((event) => !getEventDateKey(event));
  const monthEventCount = React.useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    return visibleEvents.filter((event) => {
      const dateKey = getEventDateKey(event);

      if (!dateKey) {
        return false;
      }

      const date = new Date(`${dateKey}T00:00:00`);

      return date.getFullYear() === year && date.getMonth() === month;
    }).length;
  }, [visibleEvents, visibleMonth]);

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
                {monthEventCount} event{monthEventCount === 1 ? "" : "s"} this month
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
                    <View style={styles.eventBadge}>
                      <Text
                        style={[
                          styles.eventBadgeText,
                          selected && styles.eventBadgeTextSelected,
                        ]}
                      >
                        {dayEvents.length}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.selectedPanel, isWide && styles.selectedPanelWide]}>
          <View style={styles.selectedHeader}>
            <View style={styles.selectedDateIcon}>
              <Text style={styles.selectedDateDay}>
                {Number(selectedDate.slice(-2))}
              </Text>
            </View>
            <View style={styles.selectedHeaderCopy}>
              <Text style={styles.selectedEyebrow}>Selected date</Text>
              <Text style={styles.selectedTitle}>{formatFullDate(selectedDate)}</Text>
            </View>
          </View>
          {selectedEvents.length > 0 ? (
            <View style={styles.agendaList}>
              {selectedEvents.map((event) => (
                <View key={event.id} style={styles.agendaItem}>
                  <View style={styles.agendaIcon}>
                    <Ionicons
                      name={typeIcons[event.type]}
                      size={18}
                      color={colors.maroon}
                    />
                  </View>
                  <View style={styles.agendaCopy}>
                    <Text style={styles.agendaType}>{event.type}</Text>
                    <Text style={styles.agendaTitle}>{event.title}</Text>
                    <Text style={styles.agendaDetails}>{event.details}</Text>
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

      <View style={styles.grid}>
        {undatedEvents.map((event) => (
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
  calendarWorkspace: {
    gap: 12,
  },
  calendarWorkspaceWide: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  calendarPanel: {
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  calendarPanelWide: {
    flex: 1.45,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  monthTitleBlock: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
  },
  monthTitle: {
    color: colors.maroonDark,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
    textAlign: "center",
  },
  monthSubtitle: {
    marginTop: 3,
    color: colors.goldDark,
    fontSize: 12,
    fontWeight: "900",
  },
  weekRow: {
    flexDirection: "row",
    marginTop: 16,
  },
  weekDay: {
    width: "14.285%",
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },
  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  dayCell: {
    width: "14.285%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surfaceMuted,
  },
  dayCellHasEvent: {
    backgroundColor: colors.maroonSoft,
    borderColor: "#E5C5C8",
  },
  dayCellToday: {
    borderColor: colors.gold,
    backgroundColor: "#FFF9E8",
  },
  dayCellSelected: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  dayNumber: {
    color: colors.maroonDark,
    fontSize: 14,
    fontWeight: "900",
  },
  dayNumberSelected: {
    color: colors.surface,
  },
  eventBadge: {
    minWidth: 19,
    height: 19,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    borderRadius: 10,
    backgroundColor: colors.goldDark,
  },
  eventBadgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: "900",
  },
  eventBadgeTextSelected: {
    color: colors.maroonDark,
  },
  selectedPanel: {
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  selectedPanelWide: {
    flex: 1,
  },
  selectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectedDateIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.sm,
    backgroundColor: colors.maroon,
  },
  selectedDateDay: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: "900",
  },
  selectedHeaderCopy: {
    flex: 1,
    minWidth: 0,
  },
  selectedEyebrow: {
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  selectedTitle: {
    flex: 1,
    minWidth: 0,
    color: colors.maroonDark,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
  },
  agendaList: {
    gap: 10,
    marginTop: 12,
  },
  agendaItem: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  agendaIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.maroonSoft,
  },
  agendaCopy: {
    flex: 1,
    minWidth: 0,
  },
  agendaType: {
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  agendaTitle: {
    marginTop: 3,
    color: colors.maroonDark,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  agendaDetails: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
  emptyText: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800",
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
