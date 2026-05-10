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
import SecondaryScreenLayout from "../../components/SecondaryScreenLayout";
import { upsertRecord, useAppData } from "../../data/appStore";
import {
  colors,
  getCardWidth,
  getColumnCount,
  radii,
  shadow,
} from "../../theme";

type ClassScheduleScreenProps = {
  onBack?: () => void;
};

const emptyForm = {
  courseCode: "",
  courseTitle: "",
  day: "",
  time: "",
  room: "",
};

export default function ClassScheduleScreen({ onBack }: ClassScheduleScreenProps) {
  const { classSchedules } = useAppData();
  const [form, setForm] = React.useState(emptyForm);
  const { width } = useWindowDimensions();
  const columns = getColumnCount(width);

  const updateField = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const canAdd = Object.values(form).every((value) => value.trim().length > 0);

  const addSchedule = () => {
    if (!canAdd) {
      return;
    }

    upsertRecord("classSchedules", {
      id: `${Date.now()}`,
      courseCode: form.courseCode.trim(),
      courseTitle: form.courseTitle.trim(),
      day: form.day.trim(),
      time: form.time.trim(),
      room: form.room.trim(),
      reminder: "Reminder is ready for notification sync.",
    });
    setForm(emptyForm);
  };

  return (
    <SecondaryScreenLayout
      title="Class Schedule"
      description="Create a student schedule and keep class details ready for reminder notifications."
      onBack={onBack}
    >
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Add class</Text>
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
            placeholder="Day"
            placeholderTextColor="#8B7D7D"
            value={form.day}
            onChangeText={(value) => updateField("day", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Time"
            placeholderTextColor="#8B7D7D"
            value={form.time}
            onChangeText={(value) => updateField("time", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Room"
            placeholderTextColor="#8B7D7D"
            value={form.room}
            onChangeText={(value) => updateField("room", value)}
          />
        </View>

        <Pressable
          style={[styles.addButton, !canAdd && styles.addButtonDisabled]}
          onPress={addSchedule}
          disabled={!canAdd}
        >
          <Ionicons name="add" size={20} color={colors.surface} />
          <Text style={styles.addButtonText}>Save Schedule</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {classSchedules.map((schedule) => (
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
            <Text style={styles.meta}>{schedule.day}</Text>
            <Text style={styles.time}>{schedule.time}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={colors.goldDark} />
              <Text style={styles.detailText}>{schedule.room}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="alarm-outline" size={16} color={colors.goldDark} />
              <Text style={styles.detailText}>{schedule.reminder}</Text>
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
  addButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  scheduleCard: {
    minHeight: 230,
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
});
