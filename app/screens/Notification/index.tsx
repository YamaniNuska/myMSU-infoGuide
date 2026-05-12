import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useAuthSession } from "../../../src/auth/localAuth";
import { getVisibleAnnouncements, useAppData } from "../../../src/data/appStore";
import { colors, getCardWidth, getColumnCount, radii, shadow } from "../../../src/theme";
import SecondaryScreenLayout from "../../../src/components/SecondaryScreenLayout";

type NotificationScreenProps = {
  onBack?: () => void;
};

const priorityColor = {
  high: colors.danger,
  normal: colors.maroon,
  low: colors.muted,
};

export default function NotificationScreen({ onBack }: NotificationScreenProps) {
  const { width } = useWindowDimensions();
  const session = useAuthSession();
  const { announcements, classSchedules } = useAppData();
  const visibleAnnouncements = React.useMemo(
    () => getVisibleAnnouncements(announcements, session?.role),
    [announcements, session?.role],
  );
  const canViewClassReminders = session?.role !== "visitor";
  const columns = getColumnCount(width);

  return (
    <SecondaryScreenLayout
      title="Notifications"
      description="Stay updated with announcements, class reminders, and important campus alerts."
      onBack={onBack}
    >
      <View style={styles.alertHero}>
        <View style={styles.alertIcon}>
          <Ionicons name="notifications" size={24} color={colors.gold} />
        </View>
        <View style={styles.alertHeroText}>
          <Text style={styles.alertHeroTitle}>Campus updates</Text>
          <Text style={styles.alertHeroBody}>
            Announcements are synced from the backend for every signed-in user.
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Announcements</Text>
      <View style={styles.grid}>
        {visibleAnnouncements.map((announcement) => (
          <View
            key={announcement.id}
            style={[
              styles.notificationCard,
              { width: getCardWidth(columns) },
              columns === 2 && styles.notificationCardMobile,
            ]}
          >
            <View style={styles.cardTop}>
              <Text
                style={[
                  styles.priority,
                  { color: priorityColor[announcement.priority] },
                ]}
              >
                {announcement.priority}
              </Text>
              <Text style={styles.dateText}>{announcement.dateLabel}</Text>
            </View>
            <Text style={styles.cardTitle}>{announcement.title}</Text>
            <Text style={styles.cardBody}>{announcement.body}</Text>
            <Text style={styles.audience}>{announcement.audience}</Text>
          </View>
        ))}
      </View>

      {canViewClassReminders ? (
        <>
          <Text style={styles.sectionTitle}>Class Reminders</Text>
          <View style={styles.reminderList}>
            {classSchedules.map((schedule) => (
              <View key={schedule.id} style={styles.reminderCard}>
                <View style={styles.reminderIcon}>
                  <Ionicons
                    name="alarm-outline"
                    size={20}
                    color={colors.maroon}
                  />
                </View>
                <View style={styles.reminderTextWrap}>
                  <Text style={styles.reminderTitle}>
                    {schedule.courseCode} - {schedule.courseTitle}
                  </Text>
                  <Text style={styles.reminderMeta}>
                    {schedule.day}, {schedule.time} | {schedule.room}
                  </Text>
                  <Text style={styles.reminderBody}>{schedule.reminder}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </SecondaryScreenLayout>
  );
}

const styles = StyleSheet.create({
  alertHero: {
    flexDirection: "row",
    gap: 14,
    padding: 18,
    borderRadius: radii.sm,
    backgroundColor: colors.maroon,
  },
  alertIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  alertHeroText: {
    flex: 1,
    minWidth: 0,
  },
  alertHeroTitle: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: "800",
  },
  alertHeroBody: {
    marginTop: 6,
    color: "rgba(255,255,255,0.84)",
    fontSize: 13,
    lineHeight: 19,
  },
  sectionTitle: {
    color: colors.maroonDark,
    fontSize: 18,
    fontWeight: "800",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  notificationCard: {
    minHeight: 210,
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  notificationCardMobile: {
    width: "100%",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  priority: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  dateText: {
    flexShrink: 1,
    color: colors.goldDark,
    fontSize: 12,
    fontWeight: "800",
  },
  cardTitle: {
    marginTop: 14,
    color: colors.maroonDark,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
  },
  cardBody: {
    marginTop: 9,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  audience: {
    marginTop: "auto",
    paddingTop: 14,
    color: colors.goldDark,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  reminderList: {
    gap: 12,
  },
  reminderCard: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  reminderIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.maroonSoft,
  },
  reminderTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  reminderTitle: {
    color: colors.maroonDark,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800",
  },
  reminderMeta: {
    marginTop: 5,
    color: colors.goldDark,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
  },
  reminderBody: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});
