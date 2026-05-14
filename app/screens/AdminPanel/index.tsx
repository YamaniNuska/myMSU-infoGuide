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
import {
  createStudentAccount,
  deleteStudentAccount,
  updateStudentAccount,
  useAuthSession,
} from "../../../src/auth/localAuth";
import SecondaryScreenLayout from "../../../src/components/SecondaryScreenLayout";
import {
  deleteRecord,
  getLastAppDataError,
  upsertRecord,
  useAppData,
} from "../../../src/data/appStore";
import {
  AcademicEvent,
  AnnouncementRecord,
  CampusLocation,
  ClassScheduleRecord,
  CourseProgram,
  HandbookEntry,
  OfficeRecord,
  ProspectusRecord,
} from "../../../src/data/mymsuDatabase";
import { colors, maxContentWidth, radii, shadow } from "../../../src/theme";

type AdminTab =
  | "handbook"
  | "calendar"
  | "offices"
  | "locations"
  | "schedules"
  | "courses"
  | "prospectus"
  | "students"
  | "announcements";

type FieldConfig = {
  key: string;
  label: string;
  multiline?: boolean;
};

type ListItem = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  raw: Record<string, unknown>;
};

const tabs: { key: AdminTab; label: string }[] = [
  { key: "handbook", label: "Handbook" },
  { key: "calendar", label: "Calendar" },
  { key: "offices", label: "Offices" },
  { key: "locations", label: "Map" },
  { key: "schedules", label: "Schedules" },
  { key: "courses", label: "Courses" },
  { key: "prospectus", label: "Prospectus" },
  { key: "students", label: "Students" },
  { key: "announcements", label: "Announcements" },
];

const announcementAudienceOptions = [
  "All users",
  "Students",
  "Faculty",
  "Visitors",
  "Employees",
] as const;

const calendarTypeOptions: AcademicEvent["type"][] = [
  "enrollment",
  "classes",
  "event",
  "deadline",
  "exam",
];
const announcementPriorityOptions: AnnouncementRecord["priority"][] = [
  "high",
  "normal",
  "low",
];
const locationCategoryOptions = [
  "College",
  "Office",
  "Student Service",
  "Landmark",
  "Gate",
  "Facility",
];
const reminderOptions = ["0", "5", "10", "15", "30", "60"];

const timeOptions = Array.from({ length: 29 }, (_, index) => {
  const totalMinutes = 7 * 60 + index * 30;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
});

const fieldConfigs: Record<AdminTab, FieldConfig[]> = {
  handbook: [
    { key: "chapter", label: "Chapter" },
    { key: "title", label: "Title" },
    { key: "content", label: "Content", multiline: true },
    { key: "tags", label: "Tags, comma separated" },
  ],
  calendar: [
    { key: "title", label: "Title" },
    { key: "eventDate", label: "Event date" },
    { key: "type", label: "Type" },
    { key: "audience", label: "Audience" },
    { key: "details", label: "Details", multiline: true },
  ],
  offices: [
    { key: "name", label: "Office name" },
    { key: "category", label: "Category" },
    { key: "summary", label: "Summary", multiline: true },
    { key: "services", label: "Services, comma separated" },
    { key: "location", label: "Location" },
    { key: "contact", label: "Contact" },
    { key: "hours", label: "Office hours" },
    { key: "tags", label: "Tags, comma separated" },
  ],
  locations: [
    { key: "name", label: "Location name" },
    { key: "category", label: "Category" },
    { key: "description", label: "Details", multiline: true },
    { key: "mapX", label: "Map X percent: 0-100" },
    { key: "mapY", label: "Map Y percent: 0-100" },
    { key: "latitude", label: "Latitude, optional" },
    { key: "longitude", label: "Longitude, optional" },
    { key: "street", label: "Street or campus route" },
    { key: "image", label: "Image URL, optional" },
    { key: "nearby", label: "Nearby places, comma separated" },
    { key: "tags", label: "Tags, comma separated" },
  ],
  schedules: [
    { key: "courseCode", label: "Course code" },
    { key: "courseTitle", label: "Course title" },
    { key: "scheduleDate", label: "Date" },
    { key: "startTime", label: "Start time" },
    { key: "endTime", label: "End time" },
    { key: "room", label: "Room" },
    { key: "reminderMinutes", label: "Alarm minutes before class" },
    { key: "reminder", label: "Reminder", multiline: true },
  ],
  courses: [
    { key: "college", label: "College" },
    { key: "program", label: "Program" },
    { key: "degree", label: "Degree" },
    { key: "overview", label: "Overview", multiline: true },
    { key: "tags", label: "Tags, comma separated" },
  ],
  prospectus: [
    { key: "programId", label: "Program ID" },
    { key: "program", label: "Program name" },
    { key: "yearLevel", label: "Year level" },
    { key: "semester", label: "Semester" },
    { key: "subjects", label: "Subjects, comma separated", multiline: true },
  ],
  students: [
    { key: "name", label: "Student name" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
  ],
  announcements: [
    { key: "title", label: "Title" },
    { key: "body", label: "Announcement body", multiline: true },
    { key: "dateLabel", label: "Date label" },
    { key: "priority", label: "Priority" },
    { key: "audience", label: "Audience" },
  ],
};

const defaultForm: Record<AdminTab, Record<string, string>> = {
  handbook: {
    chapter: "",
    title: "",
    content: "",
    tags: "",
  },
  calendar: {
    title: "",
    eventDate: "",
    type: "event",
    audience: "All users",
    details: "",
  },
  offices: {
    name: "",
    category: "",
    summary: "",
    services: "",
    location: "",
    contact: "",
    hours: "Monday to Friday, 8:00 AM to 5:00 PM",
    tags: "",
  },
  locations: {
    name: "",
    category: "College",
    description: "",
    mapX: "50",
    mapY: "50",
    latitude: "",
    longitude: "",
    street: "",
    image: "",
    nearby: "",
    tags: "",
  },
  schedules: {
    courseCode: "",
    courseTitle: "",
    scheduleDate: "",
    startTime: "08:00",
    endTime: "09:00",
    room: "",
    reminderMinutes: "15",
    reminder: "",
  },
  courses: {
    college: "",
    program: "",
    degree: "",
    overview: "",
    tags: "",
  },
  prospectus: {
    programId: "",
    program: "",
    yearLevel: "",
    semester: "",
    subjects: "",
  },
  students: {
    name: "",
    username: "",
    email: "",
    password: "",
  },
  announcements: {
    title: "",
    body: "",
    dateLabel: "Today",
    priority: "normal",
    audience: "All users",
  },
};

const splitList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const joinList = (value: unknown) =>
  Array.isArray(value) ? value.join(", ") : "";

const makeId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;

const toOptionalNumber = (value: string) => {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
};

const toMapPercent = (value: string, fallback: number) => {
  if (!value.trim()) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, 0), 100);
};

const pad = (value: number) => String(value).padStart(2, "0");

const formatTimeLabel = (time: string) => {
  const [rawHour, rawMinute] = time.split(":").map(Number);

  if (!Number.isFinite(rawHour) || !Number.isFinite(rawMinute)) {
    return time;
  }

  const suffix = rawHour >= 12 ? "PM" : "AM";
  const hour = rawHour % 12 || 12;

  return `${hour}:${pad(rawMinute)} ${suffix}`;
};

const formatDateLabel = (dateKey: string) => {
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

const isDateKey = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(new Date(`${value}T00:00:00`).getTime());

const getDayLabel = (dateKey: string) => {
  const date = new Date(`${dateKey}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, { weekday: "long" });
};

const getReminderAt = (
  scheduleDate: string,
  startTime: string,
  reminderMinutes: number,
) => {
  const startsAt = new Date(`${scheduleDate}T${startTime}:00`);

  if (Number.isNaN(startsAt.getTime())) {
    return undefined;
  }

  return new Date(startsAt.getTime() - reminderMinutes * 60 * 1000).toISOString();
};

const getReminderText = (minutes: number) =>
  minutes === 0 ? "Alarm at class start." : `Alarm ${minutes} minutes before class.`;

const getDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

function DateSelectField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const selectedDate = isDateKey(value)
    ? new Date(`${value}T00:00:00`)
    : new Date();
  const [visibleMonth, setVisibleMonth] = React.useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  React.useEffect(() => {
    if (isDateKey(value)) {
      const date = new Date(`${value}T00:00:00`);
      setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }, [value]);

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

  return (
    <View style={styles.datePicker}>
      <View style={styles.datePickerHeader}>
        <Pressable style={styles.iconButton} onPress={() => changeMonth(-1)}>
          <Ionicons name="chevron-back" size={18} color={colors.maroonDark} />
        </Pressable>
        <Text style={styles.datePickerTitle}>
          {visibleMonth.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Pressable style={styles.iconButton} onPress={() => changeMonth(1)}>
          <Ionicons name="chevron-forward" size={18} color={colors.maroonDark} />
        </Pressable>
      </View>
      <View style={styles.weekRow}>
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <Text key={`${day}-${index}`} style={styles.weekDay}>
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
          const selected = value === dateKey;

          return (
            <Pressable
              key={dateKey}
              style={[styles.dayCell, selected && styles.dayCellActive]}
              onPress={() => onChange(dateKey)}
            >
              <Text style={[styles.dayText, selected && styles.dayTextActive]}>
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.selectedDateText}>
        {isDateKey(value) ? formatDateLabel(value) : "Select a date"}
      </Text>
    </View>
  );
}

function recordToForm(tab: AdminTab, item: Record<string, unknown>) {
  const form = { ...defaultForm[tab] };

  Object.keys(form).forEach((key) => {
    if (key === "password") {
      form[key] = "";
      return;
    }

    form[key] = Array.isArray(item[key])
      ? joinList(item[key])
      : String(item[key] ?? "");
  });

  return form;
}

export default function AdminPanelScreen() {
  const session = useAuthSession();
  const data = useAppData();
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const [activeTab, setActiveTab] = React.useState<AdminTab>("handbook");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(defaultForm.handbook);
  const [query, setQuery] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const setTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setEditingId(null);
    setForm(defaultForm[tab]);
    setQuery("");
    setMessage("");
  };

  const updateField = (key: string, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const renderChoiceField = (key: string, options: readonly string[]) => (
    <View style={styles.choiceRow}>
      {options.map((option) => {
        const selected = form[key] === option;

        return (
          <Pressable
            key={option}
            style={[styles.choiceChip, selected && styles.choiceChipActive]}
            onPress={() => updateField(key, option)}
          >
            <Text
              style={[
                styles.choiceChipText,
                selected && styles.choiceChipTextActive,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderFieldInput = (field: FieldConfig) => {
    if (field.key === "eventDate" || field.key === "scheduleDate") {
      return (
        <DateSelectField
          value={form[field.key] ?? ""}
          onChange={(value) => updateField(field.key, value)}
        />
      );
    }

    if (field.key === "startTime" || field.key === "endTime") {
      const options =
        field.key === "endTime"
          ? timeOptions.filter(
              (time) =>
                !form.startTime ||
                Number(time.replace(":", "")) >
                  Number(form.startTime.replace(":", "")),
            )
          : timeOptions;

      return renderChoiceField(field.key, options);
    }

    if (activeTab === "calendar" && field.key === "type") {
      return renderChoiceField("type", calendarTypeOptions);
    }

    if (field.key === "audience") {
      return renderChoiceField("audience", announcementAudienceOptions);
    }

    if (activeTab === "announcements" && field.key === "priority") {
      return renderChoiceField("priority", announcementPriorityOptions);
    }

    if (activeTab === "locations" && field.key === "category") {
      return renderChoiceField("category", locationCategoryOptions);
    }

    if (field.key === "reminderMinutes") {
      return renderChoiceField("reminderMinutes", reminderOptions);
    }

    const numericField = ["mapX", "mapY", "latitude", "longitude"].includes(
      field.key,
    );

    return (
      <TextInput
        style={[styles.input, field.multiline && styles.inputMultiline]}
        value={form[field.key] ?? ""}
        onChangeText={(value) => updateField(field.key, value)}
        multiline={field.multiline}
        placeholder={field.label}
        placeholderTextColor="#998B8B"
        keyboardType={numericField ? "decimal-pad" : "default"}
        inputMode={numericField ? "decimal" : undefined}
      />
    );
  };

  const listItems = React.useMemo<ListItem[]>(() => {
    const mapItem = (
      raw: Record<string, unknown>,
      title: string,
      subtitle: string,
      body: string,
    ): ListItem => ({
      id: String(raw.id),
      title,
      subtitle,
      body,
      raw,
    });

    const items: ListItem[] =
      activeTab === "handbook"
        ? data.handbookEntries.map((item) =>
            mapItem(item, item.title, item.chapter, item.content),
          )
        : activeTab === "calendar"
          ? data.academicEvents.map((item) =>
              mapItem(item, item.title, item.dateLabel, item.details),
            )
          : activeTab === "offices"
            ? data.offices.map((item) =>
                mapItem(item, item.name, item.category, item.summary),
              )
            : activeTab === "locations"
              ? data.campusLocations.map((item) =>
                  mapItem(
                    item,
                    item.name,
                    item.category,
                    `${item.description} (${item.mapX}, ${item.mapY})`,
                  ),
                )
              : activeTab === "schedules"
                ? data.classSchedules.map((item) =>
                    mapItem(
                      item,
                      `${item.courseCode} - ${item.courseTitle}`,
                      `${item.scheduleDate ?? item.day}, ${item.time}`,
                      `${item.room}. ${item.reminder}`,
                    ),
                  )
                : activeTab === "courses"
                  ? data.coursePrograms.map((item) =>
                      mapItem(item, item.program, item.college, item.overview),
                    )
                  : activeTab === "prospectus"
                    ? data.prospectusRecords.map((item) =>
                        mapItem(
                          item,
                          `${item.program} - ${item.yearLevel}`,
                          item.semester,
                          item.subjects.join(", "),
                        ),
                      )
                    : activeTab === "students"
                      ? data.users
                          .filter((item) => item.role === "student")
                          .map((item) =>
                            mapItem(
                              item,
                              item.name,
                              item.username,
                              `${item.email} | ${item.role}`,
                            ),
                          )
                      : data.announcements.map((item) =>
                          mapItem(item, item.title, item.dateLabel, item.body),
                        );

    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      return items;
    }

    return items.filter((item) =>
      [item.title, item.subtitle, item.body]
        .join(" ")
        .toLowerCase()
        .includes(cleanQuery),
    );
  }, [activeTab, data, query]);

  const resetForm = () => {
    setEditingId(null);
    setForm(defaultForm[activeTab]);
  };

  const editItem = (item: ListItem) => {
    setEditingId(item.id);
    setForm(recordToForm(activeTab, item.raw));
    setMessage(`Editing ${item.title}`);
  };

  const deleteItem = async (item: ListItem) => {
    if (activeTab === "students") {
      const result = await deleteStudentAccount(item.id);
      setMessage(result.ok ? "Student account deleted." : result.message);
      return;
    }

    const key =
      activeTab === "handbook"
        ? "handbookEntries"
        : activeTab === "calendar"
          ? "academicEvents"
          : activeTab === "offices"
            ? "offices"
            : activeTab === "locations"
              ? "campusLocations"
              : activeTab === "schedules"
                ? "classSchedules"
                : activeTab === "courses"
                  ? "coursePrograms"
                  : activeTab === "prospectus"
                    ? "prospectusRecords"
                    : "announcements";

    const synced = await deleteRecord(key, item.id);
    setMessage(
      synced
        ? "Record deleted and synced."
        : `Supabase did not delete this record. ${
            getLastAppDataError() || "Check the schema and connection."
          }`,
    );
    resetForm();
  };

  const saveForm = async () => {
    if (isSaving) {
      return;
    }

    const id = editingId ?? makeId(activeTab);
    setIsSaving(true);
    setMessage("");

    if (activeTab === "students") {
      const payload = {
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password || "student123",
      };
      const result = editingId
        ? await updateStudentAccount(editingId, payload)
        : await createStudentAccount(payload);

      setMessage(
        result.ok
          ? editingId && form.password.trim()
            ? "Student profile saved. Password changes must be handled in Supabase Auth."
            : "Student account saved."
          : result.message,
      );

      if (result.ok) {
        resetForm();
      }

      setIsSaving(false);
      return;
    }

    let synced = false;

    if (activeTab === "handbook") {
      synced = await upsertRecord("handbookEntries", {
        id,
        chapter: form.chapter,
        title: form.title,
        content: form.content,
        tags: splitList(form.tags),
      } satisfies HandbookEntry);
    }

    if (activeTab === "calendar") {
      const eventDate = form.eventDate.trim();

      if (!isDateKey(eventDate)) {
        setMessage("Select a valid event date.");
        setIsSaving(false);
        return;
      }

      synced = await upsertRecord("academicEvents", {
        id,
        title: form.title,
        eventDate,
        dateLabel: formatDateLabel(eventDate),
        type: form.type as AcademicEvent["type"],
        audience: form.audience,
        details: form.details,
      } satisfies AcademicEvent);
    }

    if (activeTab === "offices") {
      synced = await upsertRecord("offices", {
        id,
        name: form.name,
        category: form.category,
        summary: form.summary,
        services: splitList(form.services),
        location: form.location,
        contact: form.contact,
        hours: form.hours,
        tags: splitList(form.tags),
      } satisfies OfficeRecord);
    }

    if (activeTab === "locations") {
      synced = await upsertRecord("campusLocations", {
        id,
        name: form.name,
        category: form.category,
        description: form.description,
        mapX: toMapPercent(form.mapX, 50),
        mapY: toMapPercent(form.mapY, 50),
        latitude: toOptionalNumber(form.latitude),
        longitude: toOptionalNumber(form.longitude),
        street: form.street.trim() || undefined,
        nearby: splitList(form.nearby),
        tags: splitList(form.tags),
        image: form.image.trim() || undefined,
      } satisfies CampusLocation);
    }

    if (activeTab === "schedules") {
      const reminderMinutes = Number(form.reminderMinutes || 15);
      const hasStructuredTime =
        isDateKey(form.scheduleDate.trim()) &&
        form.startTime.trim() &&
        form.endTime.trim();

      if (!hasStructuredTime) {
        setMessage("Select a valid class date, start time, and end time.");
        setIsSaving(false);
        return;
      }

      synced = await upsertRecord("classSchedules", {
        id,
        courseCode: form.courseCode,
        courseTitle: form.courseTitle,
        day: hasStructuredTime ? getDayLabel(form.scheduleDate) : "",
        time: hasStructuredTime
          ? `${formatTimeLabel(form.startTime)} - ${formatTimeLabel(form.endTime)}`
          : "",
        scheduleDate: form.scheduleDate.trim() || undefined,
        startTime: form.startTime.trim() || undefined,
        endTime: form.endTime.trim() || undefined,
        room: form.room,
        reminder: form.reminder.trim() || getReminderText(reminderMinutes),
        reminderMinutes: Number.isFinite(reminderMinutes) ? reminderMinutes : 15,
        reminderAt: hasStructuredTime
          ? getReminderAt(
              form.scheduleDate,
              form.startTime,
              Number.isFinite(reminderMinutes) ? reminderMinutes : 15,
            )
          : undefined,
      } satisfies ClassScheduleRecord);
    }

    if (activeTab === "courses") {
      synced = await upsertRecord("coursePrograms", {
        id,
        college: form.college,
        program: form.program,
        degree: form.degree,
        overview: form.overview,
        tags: splitList(form.tags),
      } satisfies CourseProgram);
    }

    if (activeTab === "prospectus") {
      synced = await upsertRecord("prospectusRecords", {
        id,
        programId: form.programId,
        program: form.program,
        yearLevel: form.yearLevel,
        semester: form.semester,
        subjects: splitList(form.subjects),
      } satisfies ProspectusRecord);
    }

    if (activeTab === "announcements") {
      synced = await upsertRecord("announcements", {
        id,
        title: form.title,
        body: form.body,
        dateLabel: form.dateLabel,
        priority: form.priority as AnnouncementRecord["priority"],
        audience: form.audience,
      } satisfies AnnouncementRecord);
    }

    setMessage(
      synced
        ? editingId
          ? "Record updated and synced."
          : "Record added and synced."
        : editingId
          ? `Supabase did not update this record. ${
              getLastAppDataError() || "Check the schema and connection."
            }`
          : `Supabase did not add this record. ${
              getLastAppDataError() || "Check the schema and connection."
            }`,
    );
    resetForm();
    setIsSaving(false);
  };

  if (session?.role !== "admin") {
    return (
      <SecondaryScreenLayout
        title="Admin Console"
        description="Only an admin account can manage app content."
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Admin access required</Text>
          <Text style={styles.cardBody}>
            Sign in using the fixed admin account. New admin accounts cannot be
            created from the app.
          </Text>
        </View>
      </SecondaryScreenLayout>
    );
  }

  return (
    <SecondaryScreenLayout
      title="Admin Console"
      description="Add, update, delete, and search app content from one place."
    >
      <View style={[styles.shell, isWide && styles.shellWide]}>
        <View style={styles.tabRow}>
          {tabs.map((tab) => {
            const active = activeTab === tab.key;

            return (
              <Pressable
                key={tab.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setTab(tab.key)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.maroon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${activeTab}...`}
            placeholderTextColor="#8B7D7D"
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.editorCard}>
          <View style={styles.editorHeader}>
            <Text style={styles.editorTitle}>
              {editingId ? "Update Record" : "Add Record"}
            </Text>
            {editingId ? (
              <Pressable style={styles.secondaryButton} onPress={resetForm}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.fieldGrid}>
            {fieldConfigs[activeTab].map((field) => (
              <View
                key={field.key}
                style={[
                  styles.field,
                  field.multiline && styles.fieldWide,
                  isWide && !field.multiline && styles.fieldHalf,
                ]}
              >
                <Text style={styles.fieldLabel}>{field.label}</Text>
                {renderFieldInput(field)}
              </View>
            ))}
          </View>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <Pressable
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={saveForm}
            disabled={isSaving}
          >
            <Ionicons name="save-outline" size={18} color={colors.surface} />
            <Text style={styles.saveButtonText}>
              {isSaving ? "Saving..." : editingId ? "Update" : "Add"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{tabs.find((tab) => tab.key === activeTab)?.label}</Text>
          <Text style={styles.listCount}>{listItems.length} record(s)</Text>
        </View>

        <View style={styles.list}>
          {listItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardKicker}>{item.subtitle}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody} numberOfLines={3}>
                {item.body}
              </Text>
              <View style={styles.actionRow}>
                <Pressable style={styles.editButton} onPress={() => editItem(item)}>
                  <Ionicons name="create-outline" size={16} color={colors.maroon} />
                  <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>
                <Pressable style={styles.deleteButton} onPress={() => deleteItem(item)}>
                  <Ionicons name="trash-outline" size={16} color={colors.surface} />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SecondaryScreenLayout>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: 14,
  },
  shellWide: {
    maxWidth: maxContentWidth,
  },
  tabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tab: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tabActive: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  tabText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  tabTextActive: {
    color: colors.surface,
  },
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
  editorCard: {
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  editorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  editorTitle: {
    color: colors.maroonDark,
    fontSize: 18,
    fontWeight: "900",
  },
  fieldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  field: {
    width: "100%",
  },
  fieldHalf: {
    width: "48.5%",
  },
  fieldWide: {
    width: "100%",
  },
  fieldLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 6,
  },
  input: {
    minHeight: 46,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
    fontSize: 14,
  },
  inputMultiline: {
    minHeight: 92,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  choiceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  choiceChip: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  choiceChipActive: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  choiceChipText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  choiceChipTextActive: {
    color: colors.surface,
  },
  datePicker: {
    padding: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  datePickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  datePickerTitle: {
    flex: 1,
    color: colors.maroonDark,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  weekRow: {
    flexDirection: "row",
    marginTop: 10,
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
    marginTop: 6,
  },
  dayCell: {
    width: "14.285%",
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.sm,
  },
  dayCellActive: {
    backgroundColor: colors.maroon,
  },
  dayText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "800",
  },
  dayTextActive: {
    color: colors.surface,
  },
  selectedDateText: {
    marginTop: 8,
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },
  message: {
    marginTop: 12,
    color: colors.success,
    fontSize: 13,
    fontWeight: "800",
  },
  saveButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: radii.pill,
    backgroundColor: colors.maroon,
  },
  saveButtonDisabled: {
    opacity: 0.58,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "900",
  },
  secondaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.maroonSoft,
  },
  secondaryButtonText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  listTitle: {
    color: colors.maroonDark,
    fontSize: 18,
    fontWeight: "900",
  },
  listCount: {
    color: colors.goldDark,
    fontSize: 12,
    fontWeight: "900",
  },
  list: {
    gap: 10,
  },
  card: {
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardKicker: {
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  cardTitle: {
    marginTop: 5,
    color: colors.maroonDark,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "900",
  },
  cardBody: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.maroonSoft,
  },
  editButtonText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: "900",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.danger,
  },
  deleteButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "900",
  },
});
