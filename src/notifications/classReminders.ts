import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { ClassScheduleRecord } from "../data/mymsuDatabase";

const CHANNEL_ID = "class-reminders";

type ReminderScheduleResult =
  | {
      ok: true;
      notificationId: string;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

type NotificationPermissionResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

let handlerConfigured = false;

const weekdayByName: Record<string, number> = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7,
};

function configureNotificationHandler() {
  if (handlerConfigured) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  handlerConfigured = true;
}

async function ensureNotificationPermissions(): Promise<NotificationPermissionResult> {
  configureNotificationHandler();

  if (Platform.OS === "web") {
    return {
      ok: false,
      message:
        "Saved to Supabase. Local alarms need an Android/iOS build; browser preview cannot keep reliable schedule alarms.",
    };
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Class reminders",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const current = await Notifications.getPermissionsAsync();
  const finalStatus = current.granted
    ? current
    : await Notifications.requestPermissionsAsync();

  if (!finalStatus.granted) {
    return {
      ok: false,
      message: "Saved to Supabase, but notification permission was not granted.",
    };
  }

  return { ok: true, message: "Notification permission granted." };
}

export async function scheduleClassReminder(
  schedule: ClassScheduleRecord,
): Promise<ReminderScheduleResult> {
  const [rawHour, rawMinute] = (schedule.startTime ?? "").split(":").map(Number);
  const reminderMinutes = schedule.reminderMinutes ?? 15;
  const reminderHourMinute =
    Number.isFinite(rawHour) && Number.isFinite(rawMinute)
      ? new Date(2000, 0, 2, rawHour, rawMinute - reminderMinutes)
      : null;
  const weeklyDays = Object.entries(weekdayByName)
    .filter(([name]) => schedule.day.toLowerCase().includes(name))
    .map(([, weekday]) => weekday);

  if (!schedule.reminderAt && weeklyDays.length === 0) {
    return {
      ok: false,
      message: "Saved to Supabase, but no reminder time was set.",
    };
  }

  const triggerDate = schedule.reminderAt ? new Date(schedule.reminderAt) : null;

  if (
    weeklyDays.length === 0 &&
    (!triggerDate ||
      Number.isNaN(triggerDate.getTime()) ||
      triggerDate.getTime() <= Date.now())
  ) {
    return {
      ok: false,
      message: "Saved to Supabase, but the reminder time has already passed.",
    };
  }

  const permission = await ensureNotificationPermissions();

  if (!permission.ok) {
    return permission;
  }

  const content = {
    title: `Class reminder: ${schedule.courseCode}`,
    body: `${schedule.courseTitle} starts at ${schedule.time} in ${schedule.room}.`,
    sound: true,
    data: {
      scheduleId: schedule.id,
      courseCode: schedule.courseCode,
    },
  };

  if (weeklyDays.length > 0 && reminderHourMinute) {
    const identifiers = await Promise.all(
      weeklyDays.map((weekday) =>
        Notifications.scheduleNotificationAsync({
          content,
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday,
            hour: reminderHourMinute.getHours(),
            minute: reminderHourMinute.getMinutes(),
            channelId: CHANNEL_ID,
          },
        }),
      ),
    );

    return {
      ok: true,
      notificationId: identifiers.join(","),
      message: `Schedule saved and weekly alarm set for ${weeklyDays.length} day(s).`,
    };
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate!,
      channelId: CHANNEL_ID,
    },
  });

  return {
    ok: true,
    notificationId: identifier,
    message: "Schedule saved and local alarm set.",
  };
}

export async function cancelClassReminder(notificationId?: string) {
  if (!notificationId || Platform.OS === "web") {
    return;
  }

  await Promise.all(
    notificationId
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .map((id) => Notifications.cancelScheduledNotificationAsync(id)),
  );
}
