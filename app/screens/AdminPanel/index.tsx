import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Pressable,
  ScrollView,
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
import AdminLocationMapPicker from "../../../src/features/campusMap/AdminLocationMapPicker";
import {
  AcademicEvent,
  AnnouncementRecord,
  CampusLocation,
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

type ProspectusSubjectDraft = {
  code: string;
  title: string;
  units: string;
  lec: string;
  lab: string;
  prereq: string;
  coreq: string;
  importance: string;
};

const tabs: { key: AdminTab; label: string }[] = [
  { key: "handbook", label: "Handbook" },
  { key: "calendar", label: "Calendar" },
  { key: "offices", label: "Offices" },
  { key: "locations", label: "Map" },
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
const prospectusYearOptions = [
  "First Year",
  "Second Year",
  "Third Year",
  "Fourth Year",
] as const;
const prospectusSemesterOptions = [
  "First Semester",
  "Second Semester",
  "Summer",
] as const;
const prospectusImportanceOptions = [
  "standard",
  "dependent",
  "gateway",
  "foundation",
] as const;

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

const defaultProspectusSubjectDraft: ProspectusSubjectDraft = {
  code: "",
  title: "",
  units: "3",
  lec: "3",
  lab: "0",
  prereq: "None",
  coreq: "None",
  importance: "standard",
};

const formatProspectusSubject = (draft: ProspectusSubjectDraft) =>
  [
    draft.code.trim(),
    draft.title.trim(),
    `Units: ${draft.units.trim() || "0"}`,
    `Lec: ${draft.lec.trim() || "0"}`,
    `Lab: ${draft.lab.trim() || "0"}`,
    `Prereq: ${draft.prereq.trim() || "None"}`,
    `Coreq: ${draft.coreq.trim() || "None"}`,
    `Importance: ${draft.importance.trim() || "standard"}`,
  ].join(" | ");

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
  const [prospectusSubjectDraft, setProspectusSubjectDraft] = React.useState("");
  const [prospectusStructuredDraft, setProspectusStructuredDraft] =
    React.useState<ProspectusSubjectDraft>(defaultProspectusSubjectDraft);
  const [prospectusSubjects, setProspectusSubjects] = React.useState<string[]>([]);
  const [courseTagDraft, setCourseTagDraft] = React.useState("");
  const [courseTags, setCourseTags] = React.useState<string[]>([]);
  const [scrollEnabled, setScrollEnabled] = React.useState(true);

  const courseCollegeOptions = React.useMemo(
    () =>
      Array.from(new Set(data.coursePrograms.map((item) => item.college))).filter(
        Boolean,
      ),
    [data.coursePrograms],
  );

  const setTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setEditingId(null);
    setForm(defaultForm[tab]);
    setProspectusSubjectDraft("");
    setProspectusStructuredDraft(defaultProspectusSubjectDraft);
    setProspectusSubjects([]);
    setCourseTagDraft("");
    setCourseTags([]);
    setQuery("");
    setMessage("");
  };

  const updateField = (key: string, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateProspectusSubjectDraft = (
    key: keyof ProspectusSubjectDraft,
    value: string,
  ) => {
    setProspectusStructuredDraft((current) => ({ ...current, [key]: value }));
  };

  React.useEffect(() => {
    if (activeTab !== "prospectus") {
      return;
    }

    setProspectusSubjects(splitList(form.subjects));
  }, [activeTab, form.subjects]);

  React.useEffect(() => {
    if (activeTab !== "courses") {
      return;
    }

    setCourseTags(splitList(form.tags));
  }, [activeTab, form.tags]);

  const selectProspectusProgram = (programId: string) => {
    const program = data.coursePrograms.find((item) => item.id === programId);

    setForm((current) => ({
      ...current,
      programId,
      program: program?.program ?? current.program,
    }));
  };

  const addProspectusSubject = () => {
    const subject =
      prospectusSubjectDraft.trim() ||
      formatProspectusSubject(prospectusStructuredDraft);

    if (
      !prospectusSubjectDraft.trim() &&
      (!prospectusStructuredDraft.code.trim() ||
        !prospectusStructuredDraft.title.trim())
    ) {
      return;
    }

    const nextSubjects = [...prospectusSubjects, subject];
    setProspectusSubjects(nextSubjects);
    updateField("subjects", nextSubjects.join(", "));
    setProspectusSubjectDraft("");
    setProspectusStructuredDraft(defaultProspectusSubjectDraft);
  };

  const removeProspectusSubject = (subject: string) => {
    const nextSubjects = prospectusSubjects.filter((item) => item !== subject);
    setProspectusSubjects(nextSubjects);
    updateField("subjects", nextSubjects.join(", "));
  };

  const addCourseTag = () => {
    const tag = courseTagDraft.trim();

    if (!tag) {
      return;
    }

    const nextTags = [...courseTags, tag];
    setCourseTags(nextTags);
    updateField("tags", nextTags.join(", "));
    setCourseTagDraft("");
  };

  const removeCourseTag = (tag: string) => {
    const nextTags = courseTags.filter((item) => item !== tag);
    setCourseTags(nextTags);
    updateField("tags", nextTags.join(", "));
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
    if (field.key === "eventDate") {
      return (
        <DateSelectField
          value={form[field.key] ?? ""}
          onChange={(value) => updateField(field.key, value)}
        />
      );
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

    if (activeTab === "courses" && field.key === "college") {
      return courseCollegeOptions.length > 0 ? (
        <View style={styles.choiceStack}>
          {renderChoiceField("college", courseCollegeOptions)}
          <TextInput
            style={styles.input}
            value={form.college ?? ""}
            onChangeText={(value) => updateField("college", value)}
            placeholder="Or type a new college name"
            placeholderTextColor="#998B8B"
          />
        </View>
      ) : (
        <TextInput
          style={styles.input}
          value={form.college ?? ""}
          onChangeText={(value) => updateField("college", value)}
          placeholder="College"
          placeholderTextColor="#998B8B"
        />
      );
    }

    if (activeTab === "prospectus" && field.key === "yearLevel") {
      return renderChoiceField("yearLevel", prospectusYearOptions);
    }

    if (activeTab === "prospectus" && field.key === "semester") {
      return renderChoiceField("semester", prospectusSemesterOptions);
    }

    if (activeTab === "prospectus" && field.key === "programId") {
      if (data.coursePrograms.length === 0) {
        return (
          <Text style={styles.helperText}>
            Add a course/program first, then select it here.
          </Text>
        );
      }

      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.programChoiceRow}
        >
          {data.coursePrograms.map((program) => {
            const selected = form.programId === program.id;

            return (
              <Pressable
                key={program.id}
                style={[
                  styles.programChoice,
                  selected && styles.choiceChipActive,
                ]}
                onPress={() => selectProspectusProgram(program.id)}
              >
                <Text
                  style={[
                    styles.programChoiceTitle,
                    selected && styles.choiceChipTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {program.degree || program.id}
                </Text>
                <Text
                  style={[
                    styles.programChoiceSubtitle,
                    selected && styles.choiceChipTextActive,
                  ]}
                  numberOfLines={2}
                >
                  {program.program}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      );
    }

    if (activeTab === "prospectus" && field.key === "program") {
      return (
        <View style={styles.readonlyField}>
          <Text style={styles.readonlyFieldText}>
            {form.program || "Choose a program above."}
          </Text>
        </View>
      );
    }

    if (activeTab === "prospectus" && field.key === "subjects") {
      return (
        <View style={styles.subjectBuilder}>
          <View style={styles.prospectusSubjectForm}>
            <View style={styles.inlineFieldRow}>
              <View style={styles.inlineFieldWide}>
                <Text style={styles.inlineFieldLabel}>Subject code</Text>
                <TextInput
                  style={styles.input}
                  value={prospectusStructuredDraft.code}
                  onChangeText={(value) =>
                    updateProspectusSubjectDraft("code", value)
                  }
                  placeholder="ITE183"
                  placeholderTextColor="#998B8B"
                  autoCapitalize="characters"
                />
              </View>
              <View style={styles.inlineFieldWide}>
                <Text style={styles.inlineFieldLabel}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={prospectusStructuredDraft.title}
                  onChangeText={(value) =>
                    updateProspectusSubjectDraft("title", value)
                  }
                  placeholder="Web Systems and Technologies"
                  placeholderTextColor="#998B8B"
                />
              </View>
            </View>

            <View style={styles.inlineFieldRow}>
              <View style={styles.inlineField}>
                <Text style={styles.inlineFieldLabel}>Units</Text>
                <TextInput
                  style={styles.input}
                  value={prospectusStructuredDraft.units}
                  onChangeText={(value) =>
                    updateProspectusSubjectDraft("units", value)
                  }
                  placeholder="3"
                  placeholderTextColor="#998B8B"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inlineField}>
                <Text style={styles.inlineFieldLabel}>Lec</Text>
                <TextInput
                  style={styles.input}
                  value={prospectusStructuredDraft.lec}
                  onChangeText={(value) =>
                    updateProspectusSubjectDraft("lec", value)
                  }
                  placeholder="3"
                  placeholderTextColor="#998B8B"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inlineField}>
                <Text style={styles.inlineFieldLabel}>Lab</Text>
                <TextInput
                  style={styles.input}
                  value={prospectusStructuredDraft.lab}
                  onChangeText={(value) =>
                    updateProspectusSubjectDraft("lab", value)
                  }
                  placeholder="0"
                  placeholderTextColor="#998B8B"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inlineFieldRow}>
              <View style={styles.inlineFieldWide}>
                <Text style={styles.inlineFieldLabel}>Prerequisite</Text>
                <TextInput
                  style={styles.input}
                  value={prospectusStructuredDraft.prereq}
                  onChangeText={(value) =>
                    updateProspectusSubjectDraft("prereq", value)
                  }
                  placeholder="CCC181 or None"
                  placeholderTextColor="#998B8B"
                />
              </View>
              <View style={styles.inlineFieldWide}>
                <Text style={styles.inlineFieldLabel}>Co-requisite</Text>
                <TextInput
                  style={styles.input}
                  value={prospectusStructuredDraft.coreq}
                  onChangeText={(value) =>
                    updateProspectusSubjectDraft("coreq", value)
                  }
                  placeholder="STT071.1 or None"
                  placeholderTextColor="#998B8B"
                />
              </View>
            </View>

            <View>
              <Text style={styles.inlineFieldLabel}>Importance</Text>
              <View style={styles.choiceRow}>
                {prospectusImportanceOptions.map((option) => {
                  const selected = prospectusStructuredDraft.importance === option;

                  return (
                    <Pressable
                      key={option}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      onPress={() =>
                        updateProspectusSubjectDraft("importance", option)
                      }
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
            </View>

            <TextInput
              style={[styles.input, styles.subjectComposerInput]}
              value={prospectusSubjectDraft}
              onChangeText={setProspectusSubjectDraft}
              placeholder="Optional: paste a complete subject line instead"
              placeholderTextColor="#998B8B"
              multiline
            />

            <Text style={styles.helperText}>
              Saved format: Code | Title | Units | Lec | Lab | Prereq | Coreq |
              Importance.
            </Text>

            <Pressable style={styles.inlineAddButton} onPress={addProspectusSubject}>
              <Ionicons name="add" size={18} color={colors.surface} />
              <Text style={styles.inlineAddButtonText}>Add Subject</Text>
            </Pressable>
          </View>

          {prospectusSubjects.length > 0 ? (
            <View style={styles.subjectList}>
              {prospectusSubjects.map((subject, index) => (
                <View key={`${subject}-${index}`} style={styles.subjectItem}>
                  <Text style={styles.subjectItemIndex}>{index + 1}</Text>
                  <Text style={styles.subjectItemText}>{subject}</Text>
                  <Pressable onPress={() => removeProspectusSubject(subject)}>
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={colors.muted}
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.helperText}>
              Add each prospectus subject as its own line.
            </Text>
          )}
        </View>
      );
    }

    if (activeTab === "courses" && field.key === "tags") {
      return (
        <View style={styles.subjectBuilder}>
          <View style={styles.subjectComposer}>
            <TextInput
              style={styles.input}
              value={courseTagDraft}
              onChangeText={setCourseTagDraft}
              placeholder="Add one tag at a time"
              placeholderTextColor="#998B8B"
            />
            <Pressable style={styles.inlineAddButton} onPress={addCourseTag}>
              <Ionicons name="add" size={18} color={colors.surface} />
              <Text style={styles.inlineAddButtonText}>Add Tag</Text>
            </Pressable>
          </View>

          {courseTags.length > 0 ? (
            <View style={styles.tagList}>
              {courseTags.map((tag) => (
                <View key={tag} style={styles.tagItem}>
                  <Text style={styles.tagItemText}>{tag}</Text>
                  <Pressable onPress={() => removeCourseTag(tag)}>
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={colors.muted}
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.helperText}>
              Add tags that make the program easier to search.
            </Text>
          )}
        </View>
      );
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
    setProspectusSubjectDraft("");
    setProspectusStructuredDraft(defaultProspectusSubjectDraft);
    setProspectusSubjects([]);
    setCourseTagDraft("");
    setCourseTags([]);
  };

  const editItem = (item: ListItem) => {
    setEditingId(item.id);
    const nextForm = recordToForm(activeTab, item.raw);
    setForm(nextForm);
    if (activeTab === "prospectus") {
      setProspectusSubjectDraft("");
      setProspectusStructuredDraft(defaultProspectusSubjectDraft);
      setProspectusSubjects(splitList(nextForm.subjects));
    }
    if (activeTab === "courses") {
      setCourseTagDraft("");
      setCourseTags(splitList(nextForm.tags));
    }
    setMessage(`Editing ${item.title}`);
  };

  const editCampusLocationById = (id: string) => {
    const location = data.campusLocations.find((item) => item.id === id);

    if (!location) {
      return;
    }

    editItem({
      id: location.id,
      title: location.name,
      subtitle: location.category,
      body: location.description,
      raw: location,
    });
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

    if (activeTab === "courses") {
      if (!form.college.trim() || !form.program.trim() || !form.degree.trim()) {
        setMessage("Complete the college, program, and degree first.");
        setIsSaving(false);
        return;
      }

      synced = await upsertRecord("coursePrograms", {
        id,
        college: form.college,
        program: form.program,
        degree: form.degree,
        overview: form.overview,
        tags: courseTags,
      } satisfies CourseProgram);
    }

    if (activeTab === "prospectus") {
      if (!form.programId.trim() || !form.program.trim()) {
        setMessage("Choose a program before saving the prospectus.");
        setIsSaving(false);
        return;
      }

      if (!form.yearLevel.trim() || !form.semester.trim()) {
        setMessage("Choose the year level and semester.");
        setIsSaving(false);
        return;
      }

      if (prospectusSubjects.length === 0) {
        setMessage("Add at least one subject line for the prospectus.");
        setIsSaving(false);
        return;
      }

      synced = await upsertRecord("prospectusRecords", {
        id,
        programId: form.programId,
        program: form.program,
        yearLevel: form.yearLevel,
        semester: form.semester,
        subjects: prospectusSubjects,
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
        scrollEnabled={scrollEnabled}
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
      scrollEnabled={scrollEnabled}
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

          {activeTab === "locations" ? (
            <View style={styles.mapEditorBlock}>
              <AdminLocationMapPicker
                locations={data.campusLocations.filter(
                  (location) => location.id !== editingId,
                )}
                draftLocation={{
                  id: editingId || form.name.trim() || "draft-location",
                  name: form.name,
                  category: form.category,
                  mapX: toMapPercent(form.mapX, 50),
                  mapY: toMapPercent(form.mapY, 50),
                }}
                onDraftMove={(position) => {
                  updateField("mapX", position.mapX.toFixed(1));
                  updateField("mapY", position.mapY.toFixed(1));
                  updateField("latitude", position.latitude.toFixed(6));
                  updateField("longitude", position.longitude.toFixed(6));
                }}
                onSelectExistingLocation={editCampusLocationById}
                onInteractionChange={(active) => setScrollEnabled(!active)}
              />
            </View>
          ) : null}

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
  mapEditorBlock: {
    marginTop: 14,
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
  choiceStack: {
    gap: 10,
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
  programChoiceRow: {
    gap: 8,
    paddingRight: 16,
  },
  programChoice: {
    width: 190,
    minHeight: 68,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  programChoiceTitle: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  programChoiceSubtitle: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  readonlyField: {
    minHeight: 46,
    justifyContent: "center",
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    backgroundColor: colors.maroonSoft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  readonlyFieldText: {
    color: colors.maroonDark,
    fontSize: 13,
    fontWeight: "800",
  },
  subjectBuilder: {
    gap: 10,
  },
  prospectusSubjectForm: {
    gap: 12,
    padding: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  inlineFieldRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  inlineField: {
    flex: 1,
    minWidth: 84,
  },
  inlineFieldWide: {
    flex: 1,
    minWidth: 180,
  },
  inlineFieldLabel: {
    marginBottom: 6,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
  },
  subjectComposer: {
    gap: 10,
  },
  subjectComposerInput: {
    minHeight: 78,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  inlineAddButton: {
    minHeight: 42,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.teal,
  },
  inlineAddButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "900",
  },
  subjectList: {
    gap: 8,
  },
  tagList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tagItemText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "800",
  },
  subjectItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 11,
    borderRadius: radii.sm,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  subjectItemIndex: {
    width: 18,
    color: colors.goldDark,
    fontSize: 12,
    fontWeight: "900",
  },
  subjectItemText: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
  helperText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800",
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
