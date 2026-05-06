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
  upsertRecord,
  useAppData,
} from "../../../src/data/appStore";
import {
  AcademicEvent,
  AnnouncementRecord,
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
  { key: "schedules", label: "Schedules" },
  { key: "courses", label: "Courses" },
  { key: "prospectus", label: "Prospectus" },
  { key: "students", label: "Students" },
  { key: "announcements", label: "Announcements" },
];

const fieldConfigs: Record<AdminTab, FieldConfig[]> = {
  handbook: [
    { key: "chapter", label: "Chapter" },
    { key: "title", label: "Title" },
    { key: "content", label: "Content", multiline: true },
    { key: "tags", label: "Tags, comma separated" },
  ],
  calendar: [
    { key: "title", label: "Title" },
    { key: "dateLabel", label: "Date label" },
    { key: "type", label: "Type: enrollment/classes/event/deadline/exam" },
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
  schedules: [
    { key: "courseCode", label: "Course code" },
    { key: "courseTitle", label: "Course title" },
    { key: "day", label: "Day" },
    { key: "time", label: "Time" },
    { key: "room", label: "Room" },
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
    { key: "priority", label: "Priority: high/normal/low" },
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
    dateLabel: "",
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
  schedules: {
    courseCode: "",
    courseTitle: "",
    day: "",
    time: "",
    room: "",
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
            : activeTab === "schedules"
              ? data.classSchedules.map((item) =>
                  mapItem(
                    item,
                    `${item.courseCode} - ${item.courseTitle}`,
                    `${item.day}, ${item.time}`,
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

  const deleteItem = (item: ListItem) => {
    if (activeTab === "students") {
      const result = deleteStudentAccount(item.id);
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
            : activeTab === "schedules"
              ? "classSchedules"
              : activeTab === "courses"
                ? "coursePrograms"
                : activeTab === "prospectus"
                  ? "prospectusRecords"
                  : "announcements";

    deleteRecord(key, item.id);
    setMessage("Record deleted.");
    resetForm();
  };

  const saveForm = () => {
    const id = editingId ?? makeId(activeTab);

    if (activeTab === "students") {
      const payload = {
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password || "student123",
      };
      const result = editingId
        ? updateStudentAccount(editingId, payload)
        : createStudentAccount(payload);

      setMessage(result.ok ? "Student account saved." : result.message);

      if (result.ok) {
        resetForm();
      }

      return;
    }

    if (activeTab === "handbook") {
      upsertRecord("handbookEntries", {
        id,
        chapter: form.chapter,
        title: form.title,
        content: form.content,
        tags: splitList(form.tags),
      } satisfies HandbookEntry);
    }

    if (activeTab === "calendar") {
      upsertRecord("academicEvents", {
        id,
        title: form.title,
        dateLabel: form.dateLabel,
        type: form.type as AcademicEvent["type"],
        audience: form.audience,
        details: form.details,
      } satisfies AcademicEvent);
    }

    if (activeTab === "offices") {
      upsertRecord("offices", {
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

    if (activeTab === "schedules") {
      upsertRecord("classSchedules", {
        id,
        courseCode: form.courseCode,
        courseTitle: form.courseTitle,
        day: form.day,
        time: form.time,
        room: form.room,
        reminder: form.reminder,
      } satisfies ClassScheduleRecord);
    }

    if (activeTab === "courses") {
      upsertRecord("coursePrograms", {
        id,
        college: form.college,
        program: form.program,
        degree: form.degree,
        overview: form.overview,
        tags: splitList(form.tags),
      } satisfies CourseProgram);
    }

    if (activeTab === "prospectus") {
      upsertRecord("prospectusRecords", {
        id,
        programId: form.programId,
        program: form.program,
        yearLevel: form.yearLevel,
        semester: form.semester,
        subjects: splitList(form.subjects),
      } satisfies ProspectusRecord);
    }

    if (activeTab === "announcements") {
      upsertRecord("announcements", {
        id,
        title: form.title,
        body: form.body,
        dateLabel: form.dateLabel,
        priority: form.priority as AnnouncementRecord["priority"],
        audience: form.audience,
      } satisfies AnnouncementRecord);
    }

    setMessage(editingId ? "Record updated." : "Record added.");
    resetForm();
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
            Sign in using the admin demo account or create an admin account from
            the login screen.
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
                <TextInput
                  style={[
                    styles.input,
                    field.multiline && styles.inputMultiline,
                  ]}
                  value={form[field.key] ?? ""}
                  onChangeText={(value) => updateField(field.key, value)}
                  multiline={field.multiline}
                  placeholder={field.label}
                  placeholderTextColor="#998B8B"
                />
              </View>
            ))}
          </View>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <Pressable style={styles.saveButton} onPress={saveForm}>
            <Ionicons name="save-outline" size={18} color={colors.surface} />
            <Text style={styles.saveButtonText}>
              {editingId ? "Update" : "Add"}
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
