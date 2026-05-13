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
import { useAuthSession } from "../../../src/auth/localAuth";
import SecondaryScreenLayout from "../../../src/components/SecondaryScreenLayout";
import { deleteRecord, upsertRecord, useAppData } from "../../../src/data/appStore";
import type { ClassScheduleRecord } from "../../../src/data/mymsuDatabase";
import {
  cancelClassReminder,
  scheduleClassReminder,
} from "../../../src/notifications/classReminders";
import {
  colors,
  getCardWidth,
  getColumnCount,
  radii,
  shadow,
} from "../../../src/theme";

type ClassScheduleScreenProps = {
  onBack?: () => void;
};

type ScheduleForm = {
  courseCode: string;
  courseTitle: string;
  dayPattern: string;
  startTime: string;
  endTime: string;
  room: string;
  reminderMinutes: number;
};

const REMINDER_OPTIONS = [0, 5, 10, 15, 30, 60] as const;
const DAY_OPTIONS = [
  {
    value: "MW",
    label: "MW",
    description: "Monday and Wednesday",
    weekdays: [1, 3],
  },
  {
    value: "TTH",
    label: "TTh",
    description: "Tuesday and Thursday",
    weekdays: [2, 4],
  },
  {
    value: "FS",
    label: "FS",
    description: "Friday and Saturday",
    weekdays: [5, 6],
  },
  {
    value: "MWTH",
    label: "MWTh",
    description: "Monday, Tuesday, Wednesday, and Thursday",
    weekdays: [1, 2, 3, 4],
  },
] as const;

const pad = (value: number) => String(value).padStart(2, "0");

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const TIME_OPTIONS = Array.from({ length: 29 }, (_, index) => {
  const totalMinutes = 7 * 60 + index * 30;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;

  return `${pad(hour)}:${pad(minute)}`;
});

const makeEmptyForm = (): ScheduleForm => ({
  courseCode: "",
  courseTitle: "",
  dayPattern: "MW",
  startTime: "08:00",
  endTime: "09:00",
  room: "",
  reminderMinutes: 15,
});

const getDayOption = (value: string) =>
  DAY_OPTIONS.find((option) => option.value === value) ?? DAY_OPTIONS[0];

const getDayPatternFromLabel = (day: string) => {
  const cleanDay = day.toLowerCase();

  return (
    DAY_OPTIONS.find((option) =>
      option.description
        .toLowerCase()
        .split(/,\s*|\sand\s/)
        .every((part) => cleanDay.includes(part.trim())),
    )?.value ?? "MW"
  );
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const formatTimeLabel = (time: string) => {
  const [rawHour, rawMinute] = time.split(":").map(Number);
  const suffix = rawHour >= 12 ? "PM" : "AM";
  const hour = rawHour % 12 || 12;

  return `${hour}:${pad(rawMinute)} ${suffix}`;
};

const formatDateLabel = (dateKey?: string) => {
  if (!dateKey) {
    return "";
  }

  const date = new Date(`${dateKey}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getNextScheduleDate = (dayPattern: string, startTime: string) => {
  const option = getDayOption(dayPattern);
  const now = new Date();
  const [hour, minute] = startTime.split(":").map(Number);

  return option.weekdays.reduce<Date | null>((closest, weekday) => {
    const candidate = new Date(now);
    const currentWeekday = candidate.getDay();
    const daysUntil = (weekday - currentWeekday + 7) % 7;

    candidate.setDate(candidate.getDate() + daysUntil);
    candidate.setHours(hour, minute, 0, 0);

    if (candidate.getTime() <= now.getTime()) {
      candidate.setDate(candidate.getDate() + 7);
    }

    return !closest || candidate.getTime() < closest.getTime()
      ? candidate
      : closest;
  }, null);
};

const getReminderAt = (
  dayPattern: string,
  startTime: string,
  reminderMinutes: number,
) => {
  const startsAt = getNextScheduleDate(dayPattern, startTime);

  if (!startsAt || Number.isNaN(startsAt.getTime())) {
    return undefined;
  }

  return new Date(startsAt.getTime() - reminderMinutes * 60 * 1000).toISOString();
};

const getReminderText = (minutes: number) =>
  minutes === 0
    ? "Weekly alarm at class start."
    : `Weekly alarm ${minutes} minutes before class.`;

export default function ClassScheduleScreen({ onBack }: ClassScheduleScreenProps) {
  const session = useAuthSession();
  const { classSchedules } = useAppData();
  const [form, setForm] = React.useState<ScheduleForm>(() => makeEmptyForm());
  const [editingSchedule, setEditingSchedule] =
    React.useState<ClassScheduleRecord | null>(null);
  const [message, setMessage] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const { width } = useWindowDimensions();
  const columns = getColumnCount(width);
  const endTimeOptions = React.useMemo(
    () => TIME_OPTIONS.filter((time) => toMinutes(time) > toMinutes(form.startTime)),
    [form.startTime],
  );
  const visibleSchedules = React.useMemo(
    () =>
      classSchedules.filter(
        (schedule) => schedule.userId === session?.id,
      ),
    [classSchedules, session?.id],
  );

  const updateField = <K extends keyof ScheduleForm>(
    field: K,
    value: ScheduleForm[K],
  ) => {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (
        field === "startTime" &&
        toMinutes(next.endTime) <= toMinutes(String(value))
      ) {
        const nextEndTime =
          TIME_OPTIONS.find((time) => toMinutes(time) > toMinutes(String(value))) ??
          current.endTime;
        next.endTime = nextEndTime;
      }

      return next;
    });
  };

  const canAdd =
    form.courseCode.trim().length > 0 &&
    form.courseTitle.trim().length > 0 &&
    form.room.trim().length > 0 &&
    toMinutes(form.endTime) > toMinutes(form.startTime);

  const resetForm = () => {
    setEditingSchedule(null);
    setForm(makeEmptyForm());
  };

  const editSchedule = (schedule: ClassScheduleRecord) => {
    setEditingSchedule(schedule);
    setForm({
      courseCode: schedule.courseCode,
      courseTitle: schedule.courseTitle,
      dayPattern: getDayPatternFromLabel(schedule.day),
      startTime: schedule.startTime ?? "08:00",
      endTime: schedule.endTime ?? "09:00",
      room: schedule.room,
      reminderMinutes: schedule.reminderMinutes ?? 15,
    });
    setMessage(`Editing ${schedule.courseCode}.`);
  };

  const removeSchedule = async (schedule: ClassScheduleRecord) => {
    await cancelClassReminder(schedule.notificationId);
    const synced = await deleteRecord("classSchedules", schedule.id);
    setMessage(
      synced
        ? "Schedule deleted and synced."
        : "Schedule removed locally, but Supabase did not delete it.",
    );
    if (editingSchedule?.id === schedule.id) {
      resetForm();
    }
  };

  const saveSchedule = async () => {
    if (!canAdd || !session || isSaving) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    const reminderAt = getReminderAt(
      form.dayPattern,
      form.startTime,
      form.reminderMinutes,
    );
    const time = `${formatTimeLabel(form.startTime)} - ${formatTimeLabel(
      form.endTime,
    )}`;
    const nextScheduleDate = getNextScheduleDate(form.dayPattern, form.startTime);
    const dayOption = getDayOption(form.dayPattern);

    if (editingSchedule?.notificationId) {
      await cancelClassReminder(editingSchedule.notificationId);
    }

    const baseSchedule: ClassScheduleRecord = {
      id: editingSchedule?.id ?? `${session.id}-${Date.now()}`,
      userId: session.id,
      courseCode: form.courseCode.trim(),
      courseTitle: form.courseTitle.trim(),
      day: dayOption.description,
      time,
      scheduleDate: nextScheduleDate ? toDateKey(nextScheduleDate) : undefined,
      startTime: form.startTime,
      endTime: form.endTime,
      room: form.room.trim(),
      reminder: getReminderText(form.reminderMinutes),
      reminderMinutes: form.reminderMinutes,
      reminderAt,
    };
    const alarm = await scheduleClassReminder(baseSchedule);
    const schedule: ClassScheduleRecord = {
      ...baseSchedule,
      notificationId: alarm.ok ? alarm.notificationId : undefined,
    };
    const synced = await upsertRecord("classSchedules", schedule);

    if (!synced && alarm.ok) {
      await cancelClassReminder(alarm.notificationId);
    }

    resetForm();
    setMessage(
      `${synced ? "Saved to Supabase." : "Supabase did not save the schedule."} ${
        alarm.message
      }`,
    );
    setIsSaving(false);
  };

  if (!session || session.role === "visitor") {
    return (
      <SecondaryScreenLayout
        title="Class Schedule"
        description="Class schedules are available to MSU student, faculty, employee, and admin accounts."
        onBack={onBack}
      >
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>MSU access required</Text>
          <Text style={styles.detailText}>
            Sign in with your MSU account to save schedules and enable reminders.
          </Text>
        </View>
      </SecondaryScreenLayout>
    );
  }

  return (
    <SecondaryScreenLayout
      title="Class Schedule"
      description="Create a saved schedule with a real date, time, and local alarm."
      onBack={onBack}
    >
      <View style={styles.formCard}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {editingSchedule ? "Edit class" : "Add class"}
          </Text>
          {editingSchedule ? (
            <Pressable style={styles.cancelButton} onPress={resetForm}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.formGrid}>
          <TextInput
            style={styles.input}
            placeholder="Course code"
            placeholderTextColor="#8B7D7D"
            value={form.courseCode}
            onChangeText={(value) => updateField("courseCode", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Course title"
            placeholderTextColor="#8B7D7D"
            value={form.courseTitle}
            onChangeText={(value) => updateField("courseTitle", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Room"
            placeholderTextColor="#8B7D7D"
            value={form.room}
            onChangeText={(value) => updateField("room", value)}
          />
        </View>

        <View style={styles.choiceBlock}>
          <Text style={styles.fieldLabel}>Days, repeats weekly</Text>
          <View style={styles.choiceRow}>
            {DAY_OPTIONS.map((option) => {
              const selected = form.dayPattern === option.value;

              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.dayChip,
                    selected && styles.choiceChipActive,
                  ]}
                  onPress={() => updateField("dayPattern", option.value)}
                >
                  <Text
                    style={[
                      styles.dayChipCode,
                      selected && styles.choiceTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.dayChipDescription,
                      selected && styles.choiceTextActive,
                    ]}
                  >
                    {option.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.choiceBlock}>
          <Text style={styles.fieldLabel}>Start time</Text>
          <View style={styles.choiceRow}>
            {TIME_OPTIONS.map((time) => {
              const selected = form.startTime === time;

              return (
                <Pressable
                  key={time}
                  style={[styles.choiceChip, selected && styles.choiceChipActive]}
                  onPress={() => updateField("startTime", time)}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      selected && styles.choiceTextActive,
                    ]}
                  >
                    {formatTimeLabel(time)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.choiceBlock}>
          <Text style={styles.fieldLabel}>End time</Text>
          <View style={styles.choiceRow}>
            {endTimeOptions.map((time) => {
              const selected = form.endTime === time;

              return (
                <Pressable
                  key={time}
                  style={[styles.choiceChip, selected && styles.choiceChipActive]}
                  onPress={() => updateField("endTime", time)}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      selected && styles.choiceTextActive,
                    ]}
                  >
                    {formatTimeLabel(time)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.choiceBlock}>
          <Text style={styles.fieldLabel}>Alarm</Text>
          <View style={styles.choiceRow}>
            {REMINDER_OPTIONS.map((minutes) => {
              const selected = form.reminderMinutes === minutes;

              return (
                <Pressable
                  key={minutes}
                  style={[styles.choiceChip, selected && styles.choiceChipActive]}
                  onPress={() => updateField("reminderMinutes", minutes)}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      selected && styles.choiceTextActive,
                    ]}
                  >
                    {minutes === 0 ? "At start" : `${minutes} min`}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          style={[
            styles.addButton,
            (!canAdd || isSaving) && styles.addButtonDisabled,
          ]}
          onPress={saveSchedule}
          disabled={!canAdd || isSaving}
        >
          <Ionicons name="alarm-outline" size={20} color={colors.surface} />
          <Text style={styles.addButtonText}>
            {isSaving
              ? "Saving..."
              : editingSchedule
                ? "Update Weekly Schedule"
                : "Save Weekly Schedule"}
          </Text>
        </Pressable>

        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <View style={styles.grid}>
        {visibleSchedules.map((schedule) => (
          <View
            key={schedule.id}
            style={[
              styles.scheduleCard,
              { width: getCardWidth(columns) },
              columns === 2 && styles.scheduleCardMobile,
            ]}
          >
            <View style={styles.cardTop}>
              <View style={styles.iconShell}>
                <Ionicons name="calendar" size={21} color={colors.maroon} />
              </View>
              <Text style={styles.code}>{schedule.courseCode}</Text>
            </View>

            <Text style={styles.title}>{schedule.courseTitle}</Text>
            <Text style={styles.meta}>
              {schedule.day}
            </Text>
            {schedule.scheduleDate ? (
              <Text style={styles.nextDate}>
                Next class: {formatDateLabel(schedule.scheduleDate)}
              </Text>
            ) : null}
            <Text style={styles.time}>
              {schedule.startTime && schedule.endTime
                ? `${formatTimeLabel(schedule.startTime)} - ${formatTimeLabel(
                    schedule.endTime,
                  )}`
                : schedule.time}
            </Text>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={colors.goldDark} />
              <Text style={styles.detailText}>{schedule.room}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="alarm-outline" size={16} color={colors.goldDark} />
              <Text style={styles.detailText}>
                {schedule.reminder}
                {schedule.reminderAt
                  ? ` ${new Date(schedule.reminderAt).toLocaleString()}`
                  : ""}
              </Text>
            </View>
            <View style={styles.cardActions}>
              <Pressable
                style={styles.cardAction}
                onPress={() => editSchedule(schedule)}
              >
                <Ionicons name="create-outline" size={16} color={colors.maroon} />
                <Text style={styles.cardActionText}>Edit</Text>
              </Pressable>
              <Pressable
                style={[styles.cardAction, styles.cardActionDanger]}
                onPress={() => removeSchedule(schedule)}
              >
                <Ionicons name="trash-outline" size={16} color={colors.danger} />
                <Text style={[styles.cardActionText, styles.cardActionTextDanger]}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </SecondaryScreenLayout>
  );
}

const styles = StyleSheet.create({
  formCard: {
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  formTitle: {
    color: colors.maroonDark,
    fontSize: 18,
    fontWeight: "800",
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  input: {
    flexGrow: 1,
    minWidth: 180,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
    fontSize: 14,
  },
  choiceBlock: {
    marginTop: 14,
  },
  fieldLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
  },
  choiceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  choiceChip: {
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  choiceChipActive: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  dayChip: {
    flexGrow: 1,
    minWidth: 180,
    maxWidth: 260,
    minHeight: 58,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radii.sm,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  dayChipCode: {
    color: colors.maroonDark,
    fontSize: 13,
    fontWeight: "900",
  },
  dayChipDescription: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  choiceText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "800",
  },
  choiceTextActive: {
    color: colors.surface,
  },
  addButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.maroon,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "800",
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.maroonSoft,
  },
  cancelButtonText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  message: {
    marginTop: 10,
    color: colors.success,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  scheduleCard: {
    minHeight: 250,
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  scheduleCardMobile: {
    width: "100%",
  },
  cardTop: {
    flexDirection: "row",
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
  code: {
    flex: 1,
    color: colors.goldDark,
    fontSize: 13,
    fontWeight: "900",
  },
  title: {
    marginTop: 16,
    color: colors.maroonDark,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },
  meta: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  nextDate: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
  },
  time: {
    marginTop: 3,
    color: colors.maroon,
    fontSize: 15,
    fontWeight: "800",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 12,
  },
  detailText: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 12,
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  cardAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.maroonSoft,
  },
  cardActionDanger: {
    backgroundColor: "#FCE8E6",
  },
  cardActionText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: "900",
  },
  cardActionTextDanger: {
    color: colors.danger,
  },
});
