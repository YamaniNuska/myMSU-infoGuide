import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Image,
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
import PopupSelect from "../../../src/components/PopupSelect";
import SecondaryScreenLayout from "../../../src/components/SecondaryScreenLayout";
import {
  deleteRecord,
  getLastAppDataError,
  upsertRecord,
  useAppData,
} from "../../../src/data/appStore";
import {
  buildProspectusInfoRecordId,
  buildProspectusRecordId,
  getProgramProspectusStats,
  isProspectusTermRecord,
  parseProspectusSubject,
  prospectusInfoSemester,
  prospectusInfoYearLevel,
} from "../../../src/data/curriculum";
import AdminLocationMapPicker from "../../../src/features/campusMap/AdminLocationMapPicker";
import {
  AcademicEvent,
  AnnouncementRecord,
  CampusLocation,
  CourseProgram,
  HandbookEntry,
  OfficeRecord,
  ProspectusRecord,
  TechnicalElective,
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

type RecordViewMode = "cards" | "table";

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

type CalendarHeaderDraft = {
  schoolYearLabel: string;
  officeLabel: string;
  title: string;
  firstSemester: string;
  secondSemester: string;
  summer: string;
};

const tabs: { key: AdminTab; label: string }[] = [
  { key: "handbook", label: "Handbook" },
  { key: "calendar", label: "Calendar" },
  { key: "offices", label: "Offices" },
  { key: "locations", label: "Map" },
  { key: "courses", label: "Courses" },
  { key: "prospectus", label: "Prospectus" },
  { key: "students", label: "Users" },
  { key: "announcements", label: "Announcements" },
];

const facultyTabs: AdminTab[] = ["courses", "prospectus"];
const curriculumCollegeOptions = [
  "College of Engineering",
  "College of Information and Computing Sciences",
];
const allProspectusCollegeOption = "All Colleges";


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
const calendarTableColumns = [
  { key: "tableActivity", title: "Activity", width: 360 },
  { key: "firstSemester", title: "First Semester", width: 220 },
  { key: "secondSemester", title: "Second Semester", width: 220 },
  { key: "summer", title: "Summer", width: 170 },
] as const;
const calendarHeaderRecordId = "cal-2025-2026-header";
const calendarHeaderActivityToken = "__calendar_header__";
const defaultCalendarHeader: CalendarHeaderDraft = {
  schoolYearLabel: "Academic Calendar, School Year 2025-2026",
  officeLabel: "Office of the University Registrar",
  title: "Academic Calendar, School Year 2025-2026",
  firstSemester: "August - December 2025",
  secondSemester: "January - May 2026",
  summer: "June - July 2026",
};
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
const prospectusImportanceSelectOptions = prospectusImportanceOptions.map(
  (option) => ({
    value: option,
    label: option,
  }),
);

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
    { key: "tableRows", label: "Table view row", multiline: true },
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
    { key: "prospectusUrl", label: "Prospectus URL, optional" },
    { key: "tags", label: "Tags, comma separated" },
  ],
  prospectus: [
    { key: "programId", label: "Program ID" },
    { key: "program", label: "Program name" },
    {
      key: "technicalElectives",
      label: "Technical electives offered",
      multiline: true,
    },
    { key: "yearLevel", label: "Year level" },
    { key: "semester", label: "Semester" },
    { key: "subjects", label: "Subjects, comma separated", multiline: true },
  ],
  students: [
    { key: "name", label: "Student name / username" },
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
    tableActivity: "",
    firstSemester: "",
    secondSemester: "",
    summer: "",
    tableHighlight: "",
    tableSection: "",
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
    college: "College of Engineering",
    program: "",
    degree: "",
    overview: "",
    prospectusUrl: "",
    tags: "",
  },
  prospectus: {
    programId: "",
    program: "",
    technicalElectives: "",
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

const stringifyListItem = (value: unknown) => {
  if (
    value &&
    typeof value === "object" &&
    ("code" in value || "title" in value)
  ) {
    return getTechnicalElectiveLabel(parseTechnicalElective(value as TechnicalElective));
  }

  return String(value ?? "");
};

const joinList = (value: unknown) =>
  Array.isArray(value)
    ? value.map(stringifyListItem).filter(Boolean).join(", ")
    : "";

const toStringList = (value: unknown) =>
  Array.isArray(value)
    ? value.map(stringifyListItem).filter(Boolean)
    : splitList(String(value ?? ""));

const defaultProspectusSubjectDraft: ProspectusSubjectDraft = {
  code: "",
  title: "",
  units: "3",
  lec: "3",
  lab: "0",
  prereq: "",
  coreq: "",
  importance: "standard",
};

const formatProspectusSubject = (draft: ProspectusSubjectDraft) =>
  [
    draft.code,
    draft.title,
    `Units: ${draft.units.trim() || "0"}`,
    `Lec: ${draft.lec.trim() || "0"}`,
    `Lab: ${draft.lab.trim() || "0"}`,
    `Prereq: ${draft.prereq}`,
    `Coreq: ${draft.coreq}`,
    `Importance: ${draft.importance.trim() || "standard"}`,
  ].join(" | ");

const formatProspectusSubjectForSave = (subject: string) => {
  const draft = parseProspectusSubjectDraft(subject);

  return formatProspectusSubject({
    ...draft,
    prereq: draft.prereq.trim() || "None",
    coreq: draft.coreq.trim() || "None",
  });
};

const stripTableSeparatorPadding = (value: string) => {
  let nextValue = value;

  if (nextValue.startsWith(" ")) {
    nextValue = nextValue.slice(1);
  }

  if (nextValue.endsWith(" ")) {
    nextValue = nextValue.slice(0, -1);
  }

  return nextValue;
};

const getDraftSubjectValue = (parts: string[], label: string) => {
  const part =
    parts.find((item) =>
      item.trimStart().toLowerCase().startsWith(`${label.toLowerCase()}:`),
    ) ?? "";
  const value = stripTableSeparatorPadding(part)
    .split(":")
    .slice(1)
    .join(":");

  return value.startsWith(" ") ? value.slice(1) : value;
};

const parseProspectusSubjectDraft = (subject: string): ProspectusSubjectDraft => {
  const parts = subject.split("|");

  return {
    code: stripTableSeparatorPadding(parts[0] ?? ""),
    title: stripTableSeparatorPadding(parts[1] ?? ""),
    units: getDraftSubjectValue(parts, "Units") || "0",
    lec: getDraftSubjectValue(parts, "Lec") || "0",
    lab: getDraftSubjectValue(parts, "Lab") || "0",
    prereq: getDraftSubjectValue(parts, "Prereq"),
    coreq: getDraftSubjectValue(parts, "Coreq"),
    importance: getDraftSubjectValue(parts, "Importance").trim() || "standard",
  };
};

const getTechnicalElectiveLabel = (elective: TechnicalElective) =>
  [elective.code.trim(), elective.title.trim()].filter(Boolean).join(" | ");

const parseTechnicalElective = (
  value: string | TechnicalElective,
): TechnicalElective => {
  if (typeof value !== "string") {
    return {
      code: value.code?.trim() ?? "",
      title: value.title?.trim() ?? "",
    };
  }

  const trimmed = value.trim();

  if (trimmed.includes("|")) {
    const [code = "", ...titleParts] = trimmed.split("|");

    return {
      code: stripTableSeparatorPadding(code),
      title: stripTableSeparatorPadding(titleParts.join("|")),
    };
  }

  const codeMatch = trimmed.match(/^([A-Z]{2,}\s?\d+[A-Z]?)\s+(.+)$/i);

  return {
    code: codeMatch ? codeMatch[1].trim() : "",
    title: codeMatch ? codeMatch[2].trim() : trimmed,
  };
};

const formatTechnicalElectiveDraft = (code: string, title: string) =>
  `${code} | ${title}`;

const formatTechnicalElectiveForSave = (value: string) => {
  const parsed = parseTechnicalElective(value);

  return {
    code: parsed.code.trim(),
    title: parsed.title.trim(),
  };
};

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
      const timeout = setTimeout(() => {
        setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      }, 0);

      return () => clearTimeout(timeout);
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
  const [activeTab, setActiveTab] = React.useState<AdminTab>("courses");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(defaultForm.courses);
  const [query, setQuery] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSavingCalendarHeader, setIsSavingCalendarHeader] = React.useState(false);
  const [calendarHeaderDraft, setCalendarHeaderDraft] =
    React.useState<CalendarHeaderDraft>(defaultCalendarHeader);
  const [prospectusSubjects, setProspectusSubjects] = React.useState<string[]>([]);
  const [technicalElectiveRows, setTechnicalElectiveRows] = React.useState<string[]>([]);
  const [courseTagDraft, setCourseTagDraft] = React.useState("");
  const [courseTags, setCourseTags] = React.useState<string[]>([]);
  const [activeProspectusCollege, setActiveProspectusCollege] = React.useState(
    allProspectusCollegeOption,
  );
  const [recordViewMode, setRecordViewMode] =
    React.useState<RecordViewMode>("table");
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const canUseConsole = session?.role === "admin" || session?.role === "faculty";
  const isFacultyConsole = session?.role === "faculty";
  const visibleTabs = React.useMemo(
    () =>
      isFacultyConsole
        ? tabs.filter((tab) => facultyTabs.includes(tab.key))
        : tabs,
    [isFacultyConsole],
  );
  const canDeleteRecords = session?.role === "admin";

  const calendarHeaderRecord = React.useMemo(
    () =>
      data.academicEvents.find(
        (event) =>
          event.id === calendarHeaderRecordId ||
          event.tableActivity === calendarHeaderActivityToken,
      ) ?? null,
    [data.academicEvents],
  );

  React.useEffect(() => {
    setCalendarHeaderDraft({
      schoolYearLabel:
        calendarHeaderRecord?.details || defaultCalendarHeader.schoolYearLabel,
      officeLabel:
        calendarHeaderRecord?.audience || defaultCalendarHeader.officeLabel,
      title: calendarHeaderRecord?.title || defaultCalendarHeader.title,
      firstSemester:
        calendarHeaderRecord?.firstSemester ||
        defaultCalendarHeader.firstSemester,
      secondSemester:
        calendarHeaderRecord?.secondSemester ||
        defaultCalendarHeader.secondSemester,
      summer: calendarHeaderRecord?.summer || defaultCalendarHeader.summer,
    });
  }, [calendarHeaderRecord]);

  const courseCollegeOptions = React.useMemo(
    () =>
      Array.from(
        new Set([
          ...curriculumCollegeOptions,
          ...data.coursePrograms
            .map((program) => program.college.trim())
            .filter(Boolean),
        ]),
      ).sort((left, right) => left.localeCompare(right)),
    [data.coursePrograms],
  );

  const prospectusCollegeOptions = React.useMemo(
    () => [allProspectusCollegeOption, ...courseCollegeOptions],
    [courseCollegeOptions],
  );

  const activeProspectusPrograms = React.useMemo(
    () =>
      activeProspectusCollege === allProspectusCollegeOption
        ? data.coursePrograms
        : data.coursePrograms.filter(
            (program) => program.college === activeProspectusCollege,
          ),
    [activeProspectusCollege, data.coursePrograms],
  );

  const selectedProspectusProgram = React.useMemo(
    () =>
      data.coursePrograms.find((program) => program.id === form.programId) ?? null,
    [data.coursePrograms, form.programId],
  );

  const selectedProspectusStats = React.useMemo(
    () =>
      form.programId
        ? getProgramProspectusStats(form.programId, data.prospectusRecords)
        : null,
    [data.prospectusRecords, form.programId],
  );

  const getProspectusMetaForProgram = React.useCallback(
    (programId: string) =>
      data.prospectusRecords.find(
        (record) =>
          record.programId === programId &&
          record.technicalElectives?.length,
      ) ?? null,
    [data.prospectusRecords],
  );

  const setTab = React.useCallback((tab: AdminTab) => {
    if (isFacultyConsole && !facultyTabs.includes(tab)) {
      return;
    }

    setActiveTab(tab);
    setEditingId(null);
    setForm(defaultForm[tab]);
    setProspectusSubjects([]);
    setTechnicalElectiveRows([]);
    setCourseTagDraft("");
    setCourseTags([]);
    setQuery("");
    setMessage("");
    if (tab === "prospectus") {
      setActiveProspectusCollege(allProspectusCollegeOption);
    }
  }, [isFacultyConsole]);

  const updateField = (key: string, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleField = (key: string) => {
    setForm((current) => ({
      ...current,
      [key]: current[key] === "true" ? "" : "true",
    }));
  };

  const updateCalendarHeaderField = (
    key: keyof CalendarHeaderDraft,
    value: string,
  ) => {
    setCalendarHeaderDraft((current) => ({ ...current, [key]: value }));
  };

  const saveCalendarHeader = async () => {
    if (isSavingCalendarHeader) {
      return;
    }

    setIsSavingCalendarHeader(true);
    const synced = await upsertRecord("academicEvents", {
      id: calendarHeaderRecordId,
      title: calendarHeaderDraft.title.trim() || defaultCalendarHeader.title,
      dateLabel: "Calendar header",
      type: "event",
      audience:
        calendarHeaderDraft.officeLabel.trim() ||
        defaultCalendarHeader.officeLabel,
      details:
        calendarHeaderDraft.schoolYearLabel.trim() ||
        defaultCalendarHeader.schoolYearLabel,
      tableActivity: calendarHeaderActivityToken,
      firstSemester:
        calendarHeaderDraft.firstSemester.trim() ||
        defaultCalendarHeader.firstSemester,
      secondSemester:
        calendarHeaderDraft.secondSemester.trim() ||
        defaultCalendarHeader.secondSemester,
      summer:
        calendarHeaderDraft.summer.trim() || defaultCalendarHeader.summer,
      tableHighlight: false,
      tableSection: false,
    } satisfies AcademicEvent);

    setMessage(
      synced
        ? "Calendar table header updated and synced."
        : `Supabase did not update the calendar header. ${
            getLastAppDataError() || "Check the schema and connection."
          }`,
    );
    setIsSavingCalendarHeader(false);
  };

  const selectProspectusProgram = (programId: string) => {
    const program = data.coursePrograms.find((item) => item.id === programId);
    const prospectusMeta = getProspectusMetaForProgram(programId);
    const nextTechnicalElectives = prospectusMeta?.technicalElectives ?? [];

    setForm((current) => ({
      ...current,
      programId,
      program: program?.program ?? current.program,
      technicalElectives: nextTechnicalElectives
        .map((elective) => getTechnicalElectiveLabel(parseTechnicalElective(elective)))
        .filter(Boolean)
        .join(", "),
    }));
    setTechnicalElectiveRows(
      nextTechnicalElectives
        .map((elective) => getTechnicalElectiveLabel(parseTechnicalElective(elective)))
        .filter(Boolean),
    );
  };

  const setProspectusSubjectRows = (
    nextSubjects:
      | string[]
      | ((currentSubjects: string[]) => string[]),
  ) => {
    setProspectusSubjects((currentSubjects) => {
      const resolvedSubjects =
        typeof nextSubjects === "function"
          ? nextSubjects(currentSubjects)
          : nextSubjects;

      setForm((current) => ({
        ...current,
        subjects: resolvedSubjects.join(", "),
      }));

      return resolvedSubjects;
    });
  };

  const setTechnicalElectiveRowList = (nextElectives: string[]) => {
    setTechnicalElectiveRows(nextElectives);
    updateField(
      "technicalElectives",
      nextElectives
        .map((elective) =>
          getTechnicalElectiveLabel(formatTechnicalElectiveForSave(elective)),
        )
        .filter(Boolean)
        .join(", "),
    );
  };

  const updateProspectusSubjectRow = (
    indexToUpdate: number,
    patch: Partial<ProspectusSubjectDraft>,
  ) => {
    setProspectusSubjectRows((currentSubjects) =>
      currentSubjects.map((subject, index) => {
        if (index !== indexToUpdate) {
          return subject;
        }

        const parsed = parseProspectusSubjectDraft(subject);

        return formatProspectusSubject({
          code: patch.code ?? parsed.code,
          title: patch.title ?? parsed.title,
          units: patch.units ?? parsed.units,
          lec: patch.lec ?? parsed.lec,
          lab: patch.lab ?? parsed.lab,
          prereq: patch.prereq ?? parsed.prereq,
          coreq: patch.coreq ?? parsed.coreq,
          importance: patch.importance ?? parsed.importance,
        });
      }),
    );
  };

  const addProspectusSubjectRow = () => {
    setProspectusSubjectRows([
      ...prospectusSubjects,
      formatProspectusSubject(defaultProspectusSubjectDraft),
    ]);
  };

  const removeProspectusSubject = (indexToRemove: number) => {
    const nextSubjects = prospectusSubjects.filter(
      (_, index) => index !== indexToRemove,
    );
    setProspectusSubjectRows(nextSubjects);
  };

  const moveProspectusSubject = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= prospectusSubjects.length) {
      return;
    }

    const nextSubjects = [...prospectusSubjects];
    const current = nextSubjects[index];
    nextSubjects[index] = nextSubjects[targetIndex];
    nextSubjects[targetIndex] = current;
    setProspectusSubjectRows(nextSubjects);
  };

  const addTechnicalElectiveRow = () => {
    setTechnicalElectiveRowList([...technicalElectiveRows, ""]);
  };

  const updateTechnicalElectiveRow = (
    indexToUpdate: number,
    patch: Partial<{ code: string; title: string }>,
  ) => {
    const nextElectives = technicalElectiveRows.map((elective, index) => {
      if (index !== indexToUpdate) {
        return elective;
      }

      const parsed = parseTechnicalElective(elective);

      return formatTechnicalElectiveDraft(
        patch.code ?? parsed.code,
        patch.title ?? parsed.title,
      );
    });

    setTechnicalElectiveRowList(nextElectives);
  };

  const removeTechnicalElectiveRow = (indexToRemove: number) => {
    const nextElectives = technicalElectiveRows.filter(
      (_, index) => index !== indexToRemove,
    );
    setTechnicalElectiveRowList(nextElectives);
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
    if (activeTab === "calendar" && field.key === "tableRows") {
      const sectionActive = form.tableSection === "true";
      const highlightActive = form.tableHighlight === "true";

      return (
        <View style={styles.calendarTableEditor}>
          <View style={styles.subjectTableToolbar}>
            <Text style={styles.helperText}>
              Fill this table row when the record should appear in the Academic
              Calendar table view. Leave it blank to save only a dated month
              event.
            </Text>
            <View style={styles.calendarTableToggleRow}>
              <Pressable
                style={[
                  styles.calendarTableToggle,
                  sectionActive && styles.calendarTableToggleActive,
                ]}
                onPress={() => toggleField("tableSection")}
              >
                <Ionicons
                  name={sectionActive ? "checkbox" : "square-outline"}
                  size={17}
                  color={sectionActive ? colors.surface : colors.maroonDark}
                />
                <Text
                  style={[
                    styles.calendarTableToggleText,
                    sectionActive && styles.calendarTableToggleTextActive,
                  ]}
                >
                  Section row
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.calendarTableToggle,
                  highlightActive && styles.calendarTableToggleActive,
                ]}
                onPress={() => toggleField("tableHighlight")}
              >
                <Ionicons
                  name={highlightActive ? "checkbox" : "square-outline"}
                  size={17}
                  color={highlightActive ? colors.surface : colors.maroonDark}
                />
                <Text
                  style={[
                    styles.calendarTableToggleText,
                    highlightActive && styles.calendarTableToggleTextActive,
                  ]}
                >
                  Highlight row
                </Text>
              </Pressable>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.calendarEditorTable}>
              <View style={[styles.calendarEditorRow, styles.calendarEditorHeader]}>
                {calendarTableColumns.map((column) => (
                  <Text
                    key={column.key}
                    style={[
                      styles.calendarEditorCell,
                      { width: column.width },
                      column.key === "summer" && styles.calendarEditorLastCell,
                    ]}
                  >
                    {column.title}
                  </Text>
                ))}
              </View>
              <View
                style={[
                  styles.calendarEditorRow,
                  sectionActive && styles.calendarEditorSectionRow,
                  highlightActive && styles.calendarEditorHighlightRow,
                ]}
              >
                {calendarTableColumns.map((column) => (
                  <View
                    key={column.key}
                    style={[
                      styles.calendarEditorCell,
                      { width: column.width },
                      column.key === "summer" && styles.calendarEditorLastCell,
                    ]}
                  >
                    <TextInput
                      style={[
                        styles.calendarEditorInput,
                        column.key === "tableActivity" && styles.calendarEditorActivityInput,
                        sectionActive && styles.calendarEditorSectionInput,
                      ]}
                      value={form[column.key] ?? ""}
                      onChangeText={(value) => updateField(column.key, value)}
                      placeholder={
                        column.key === "tableActivity"
                          ? "Activity / official table row"
                          : column.key === "firstSemester"
                            ? "Mon, 11 Aug"
                            : column.key === "secondSemester"
                              ? "Mon, 26 Jan"
                              : "Mon, 08 Jun"
                      }
                      placeholderTextColor="#998B8B"
                      multiline
                    />
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }

    if (activeTab === "locations" && field.key === "image") {
      const imageUrl = form.image.trim();

      return (
        <View style={styles.locationImageEditor}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.locationImagePreview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.locationImagePlaceholder}>
              <Ionicons name="image-outline" size={34} color={colors.muted} />
              <Text style={styles.locationImagePlaceholderText}>
                This is the picture shown in the location info panel.
              </Text>
            </View>
          )}
          <View style={styles.locationImageControls}>
            <TextInput
              style={[styles.input, styles.locationImageInput]}
              value={form.image ?? ""}
              onChangeText={(value) => updateField("image", value)}
              placeholder="Paste image URL for the location info panel"
              placeholderTextColor="#998B8B"
              autoCapitalize="none"
            />
            {imageUrl ? (
              <Pressable
                style={styles.secondaryInlineButton}
                onPress={() => updateField("image", "")}
              >
                <Text style={styles.secondaryInlineButtonText}>Clear Image</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      );
    }

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
      return (
        <View style={styles.choiceStack}>
          {renderChoiceField("college", courseCollegeOptions)}
          <TextInput
            style={styles.input}
            value={form.college ?? ""}
            onChangeText={(value) => updateField("college", value)}
            placeholder="Type a new college name"
            placeholderTextColor="#998B8B"
          />
        </View>
      );
    }

    if (activeTab === "prospectus" && field.key === "yearLevel") {
      return renderChoiceField("yearLevel", prospectusYearOptions);
    }

    if (activeTab === "prospectus" && field.key === "semester") {
      return renderChoiceField("semester", prospectusSemesterOptions);
    }

    if (
      activeTab === "prospectus" &&
      field.key === "programId"
    ) {
      if (data.coursePrograms.length === 0) {
        return (
          <Text style={styles.helperText}>
            Add a course/program first, then select it here.
          </Text>
        );
      }

      return (
        <View style={styles.choiceStack}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.programChoiceRow}
          >
            {prospectusCollegeOptions.map((college) => {
              const selected = activeProspectusCollege === college;

              return (
                <Pressable
                  key={college}
                  style={[styles.choiceChip, selected && styles.choiceChipActive]}
                  onPress={() => setActiveProspectusCollege(college)}
                >
                  <Text
                    style={[
                      styles.choiceChipText,
                      selected && styles.choiceChipTextActive,
                    ]}
                  >
                    {college}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {activeProspectusPrograms.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.programChoiceRow}
            >
              {activeProspectusPrograms.map((program) => {
                const selected = form.programId === program.id;
                const stats = getProgramProspectusStats(
                  program.id,
                  data.prospectusRecords,
                );

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
                    <Text
                      style={[
                        styles.programChoiceMeta,
                        selected && styles.choiceChipTextActive,
                      ]}
                    >
                      {stats.recordCount} term(s) | {stats.subjectCount} subject(s)
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.helperText}>
              No course/program records found for this college yet.
            </Text>
          )}
        </View>
      );
    }

    if (
      activeTab === "prospectus" &&
      field.key === "program"
    ) {
      return (
        <View style={styles.readonlyField}>
          <Text style={styles.readonlyFieldText}>
            {form.program || "Choose a program above."}
          </Text>
        </View>
      );
    }

    if (activeTab === "prospectus" && field.key === "technicalElectives") {
      return (
        <View style={styles.subjectBuilder}>
          <View style={styles.subjectTableToolbar}>
            <Pressable style={styles.inlineAddButton} onPress={addTechnicalElectiveRow}>
              <Ionicons name="add" size={18} color={colors.surface} />
              <Text style={styles.inlineAddButtonText}>Add Elective</Text>
            </Pressable>
            <Text style={styles.helperText}>
              Add one technical elective per row.
            </Text>
          </View>

          {technicalElectiveRows.length > 0 ? (
            <View style={styles.electiveTable}>
              <View style={[styles.prospectusInfoTableRow, styles.subjectTableHeader]}>
                <Text style={[styles.subjectTableCell, styles.electiveNumberCell]}>#</Text>
                <Text style={[styles.subjectTableCell, styles.electiveCodeCell]}>
                  Code
                </Text>
                <Text style={[styles.subjectTableCell, styles.electiveValueCell]}>
                  Elective title
                </Text>
                <Text style={[styles.subjectTableCell, styles.electiveActionCell]}>
                  Action
                </Text>
              </View>
              {technicalElectiveRows.map((elective, index) => {
                const parsed = parseTechnicalElective(elective);

                return (
                  <View key={`technical-elective-${index}`} style={styles.prospectusInfoTableRow}>
                    <Text style={[styles.subjectTableCell, styles.electiveNumberCell]}>
                      {index + 1}
                    </Text>
                    <View style={[styles.subjectTableCell, styles.electiveCodeCell]}>
                      <TextInput
                        style={styles.prospectusInfoInput}
                        value={parsed.code}
                        onChangeText={(value) =>
                          updateTechnicalElectiveRow(index, { code: value })
                        }
                        placeholder="ITD100"
                        placeholderTextColor="#998B8B"
                        autoCapitalize="characters"
                      />
                    </View>
                    <View style={[styles.subjectTableCell, styles.electiveValueCell]}>
                      <TextInput
                        style={styles.prospectusInfoInput}
                        value={parsed.title}
                        onChangeText={(value) =>
                          updateTechnicalElectiveRow(index, { title: value })
                        }
                        placeholder="Course title"
                        placeholderTextColor="#998B8B"
                      />
                    </View>
                    <View style={[styles.subjectTableCell, styles.electiveActionCell]}>
                      <Pressable onPress={() => removeTechnicalElectiveRow(index)}>
                        <Ionicons name="close-circle" size={18} color={colors.muted} />
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.helperText}>
              Add an elective row when this prospectus has technical electives.
            </Text>
          )}
        </View>
      );
    }

    if (activeTab === "prospectus" && field.key === "subjects") {
      return (
        <View style={styles.subjectBuilder}>
          <View style={styles.subjectTableToolbar}>
            <Pressable style={styles.inlineAddButton} onPress={addProspectusSubjectRow}>
              <Ionicons name="add" size={18} color={colors.surface} />
              <Text style={styles.inlineAddButtonText}>Add Row</Text>
            </Pressable>
            <Text style={styles.helperText}>
              Edit subjects directly in the table. Leave prerequisites or
              co-requisites blank when there are none.
            </Text>
          </View>

          {prospectusSubjects.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.subjectTable}>
                <View style={[styles.subjectTableRow, styles.subjectTableHeader]}>
                  <Text style={[styles.subjectTableCell, styles.subjectNumberCell]}>#</Text>
                  <Text style={[styles.subjectTableCell, styles.subjectCodeCell]}>Code</Text>
                  <Text style={[styles.subjectTableCell, styles.subjectProgramCell]}>Program / Subject</Text>
                  <Text style={[styles.subjectTableCell, styles.subjectSmallCell]}>Units</Text>
                  <Text style={[styles.subjectTableCell, styles.subjectSmallCell]}>Lec</Text>
                  <Text style={[styles.subjectTableCell, styles.subjectSmallCell]}>Lab</Text>
                  <Text style={[styles.subjectTableCell, styles.subjectReqCell]}>Pre-requisite</Text>
                  <Text style={[styles.subjectTableCell, styles.subjectReqCell]}>Co-requisite</Text>
                  <Text style={[styles.subjectTableCell, styles.subjectImportanceCell]}>Importance</Text>
                  <Text style={[styles.subjectTableCell, styles.subjectActionCell]}>Actions</Text>
                </View>
                {prospectusSubjects.map((subject, index) => {
                  const parsed = parseProspectusSubjectDraft(subject);

                  return (
                    <View key={`prospectus-subject-${index}`} style={styles.subjectTableRow}>
                      <Text style={[styles.subjectTableCell, styles.subjectNumberCell]}>{index + 1}</Text>
                      <View style={[styles.subjectTableCell, styles.subjectCodeCell]}>
                        <TextInput
                          style={styles.subjectTableInput}
                          value={parsed.code}
                          onChangeText={(value) =>
                            updateProspectusSubjectRow(index, { code: value })
                          }
                          placeholder="Code"
                          placeholderTextColor="#998B8B"
                          autoCapitalize="characters"
                        />
                      </View>
                      <View style={[styles.subjectTableCell, styles.subjectProgramCell]}>
                        <TextInput
                          style={styles.subjectTableInput}
                          value={parsed.title}
                          onChangeText={(value) =>
                            updateProspectusSubjectRow(index, { title: value })
                          }
                          placeholder="Program / subject title"
                          placeholderTextColor="#998B8B"
                        />
                      </View>
                      <View style={[styles.subjectTableCell, styles.subjectSmallCell]}>
                        <TextInput
                          style={[styles.subjectTableInput, styles.subjectTableInputCenter]}
                          value={parsed.units}
                          onChangeText={(value) =>
                            updateProspectusSubjectRow(index, { units: value })
                          }
                          placeholder="3"
                          placeholderTextColor="#998B8B"
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={[styles.subjectTableCell, styles.subjectSmallCell]}>
                        <TextInput
                          style={[styles.subjectTableInput, styles.subjectTableInputCenter]}
                          value={parsed.lec}
                          onChangeText={(value) =>
                            updateProspectusSubjectRow(index, { lec: value })
                          }
                          placeholder="3"
                          placeholderTextColor="#998B8B"
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={[styles.subjectTableCell, styles.subjectSmallCell]}>
                        <TextInput
                          style={[styles.subjectTableInput, styles.subjectTableInputCenter]}
                          value={parsed.lab}
                          onChangeText={(value) =>
                            updateProspectusSubjectRow(index, { lab: value })
                          }
                          placeholder="0"
                          placeholderTextColor="#998B8B"
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={[styles.subjectTableCell, styles.subjectReqCell]}>
                        <TextInput
                          style={styles.subjectTableInput}
                          value={parsed.prereq}
                          onFocus={() => {
                            if (parsed.prereq.trim().toLowerCase() === "none") {
                              updateProspectusSubjectRow(index, { prereq: "" });
                            }
                          }}
                          onChangeText={(value) =>
                            updateProspectusSubjectRow(index, { prereq: value })
                          }
                          placeholder="Optional"
                          placeholderTextColor="#998B8B"
                        />
                      </View>
                      <View style={[styles.subjectTableCell, styles.subjectReqCell]}>
                        <TextInput
                          style={styles.subjectTableInput}
                          value={parsed.coreq}
                          onFocus={() => {
                            if (parsed.coreq.trim().toLowerCase() === "none") {
                              updateProspectusSubjectRow(index, { coreq: "" });
                            }
                          }}
                          onChangeText={(value) =>
                            updateProspectusSubjectRow(index, { coreq: value })
                          }
                          placeholder="Optional"
                          placeholderTextColor="#998B8B"
                        />
                      </View>
                      <View style={[styles.subjectTableCell, styles.subjectImportanceCell]}>
                        <PopupSelect
                          compact
                          label="Importance"
                          value={parsed.importance}
                          options={prospectusImportanceSelectOptions}
                          onChange={(value) =>
                            updateProspectusSubjectRow(index, {
                              importance: value,
                            })
                          }
                        />
                      </View>
                      <View style={[styles.subjectTableCell, styles.subjectActionCell, styles.subjectItemActions]}>
                        <Pressable onPress={() => moveProspectusSubject(index, -1)}>
                          <Ionicons name="arrow-up-circle-outline" size={18} color={colors.muted} />
                        </Pressable>
                        <Pressable onPress={() => moveProspectusSubject(index, 1)}>
                          <Ionicons name="arrow-down-circle-outline" size={18} color={colors.muted} />
                        </Pressable>
                        <Pressable onPress={() => removeProspectusSubject(index)}>
                          <Ionicons name="close-circle" size={18} color={colors.muted} />
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          ) : (
            <Text style={styles.helperText}>
              Add a row to start encoding this semester.
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
    const prospectusProgramsForList =
      activeProspectusCollege === allProspectusCollegeOption
        ? data.coursePrograms
        : data.coursePrograms.filter(
            (program) => program.college === activeProspectusCollege,
          );
    const prospectusProgramCollegeMap = new Map(
      data.coursePrograms.map((program) => [program.id, program.college]),
    );

    const items: ListItem[] =
      activeTab === "handbook"
        ? data.handbookEntries.map((item) =>
            mapItem(item, item.title, item.chapter, item.content),
          )
        : activeTab === "calendar"
          ? data.academicEvents.map((item) =>
              mapItem(
                item,
                item.tableActivity || item.title,
                item.tableActivity ? "Table view row" : item.dateLabel,
                item.tableActivity
                  ? [
                      item.firstSemester,
                      item.secondSemester,
                      item.summer,
                    ]
                      .filter(Boolean)
                      .join(" | ")
                  : item.details,
              ),
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
                    mapItem(
                      item,
                      item.program,
                      item.college,
                      `${item.overview} ${
                        item.prospectusUrl ? `Prospectus: ${item.prospectusUrl}. ` : ""
                      }Linked prospectus terms: ${
                        getProgramProspectusStats(item.id, data.prospectusRecords)
                          .recordCount
                      }.`,
                    ),
                  )
                : activeTab === "prospectus"
                  ? [
                      ...prospectusProgramsForList.map((program) => {
                        const meta = getProspectusMetaForProgram(program.id);

                        return mapItem(
                          {
                            id: meta?.id ?? buildProspectusInfoRecordId(program.id),
                            programId: program.id,
                            program: program.program,
                            technicalElectives: meta?.technicalElectives ?? [],
                            yearLevel: "",
                            semester: "",
                            subjects: [],
                          },
                          program.program,
                          `${program.college} | Prospectus info`,
                          `Technical electives: ${
                            meta?.technicalElectives?.length ?? 0
                          }.`,
                        );
                      }),
                      ...data.prospectusRecords.filter((item) => {
                        const college = prospectusProgramCollegeMap.get(item.programId);

                        return (
                          isProspectusTermRecord(item) &&
                          (activeProspectusCollege === allProspectusCollegeOption ||
                            college === activeProspectusCollege)
                        );
                      }).map((item) => {
                        const stats = item.subjects.length;

                        return mapItem(
                          item,
                          `${item.program} - ${item.yearLevel}`,
                          item.semester,
                          `${stats} subject(s). ${item.subjects.join(", ")}`,
                        );
                      }),
                    ]
                    : activeTab === "students"
                    ? data.users
                        .filter((item) => item.role === "student")
                        .map((item) =>
                          mapItem(
                            item,
                            item.name,
                            item.email,
                            item.role,
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
  }, [activeProspectusCollege, activeTab, data, getProspectusMetaForProgram, query]);

  const prospectusCollegeGroups = React.useMemo(() => {
    const programCollegeMap = new Map(
      data.coursePrograms.map((program) => [program.id, program.college]),
    );
    const groups = new Map<string, ListItem[]>();

    listItems.forEach((item) => {
      const programId = String(item.raw.programId ?? "");
      const college =
        programCollegeMap.get(programId) ||
        item.subtitle.split("|")[0]?.trim() ||
        "Other Colleges";

      groups.set(college, [...(groups.get(college) ?? []), item]);
    });

    return Array.from(groups, ([college, items]) => ({
      college,
      items,
    })).sort((left, right) => left.college.localeCompare(right.college));
  }, [data.coursePrograms, listItems]);

  const renderRecordCard = (item: ListItem) => (
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
        {canDeleteRecords ? (
          <Pressable style={styles.deleteButton} onPress={() => deleteItem(item)}>
            <Ionicons name="trash-outline" size={16} color={colors.surface} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  const renderRecordTable = (items: ListItem[]) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.recordTable}>
        <View style={[styles.recordTableRow, styles.recordTableHeader]}>
          <Text style={[styles.recordTableCell, styles.recordTitleCell]}>
            Record
          </Text>
          <Text style={[styles.recordTableCell, styles.recordMetaCell]}>
            Category
          </Text>
          <Text style={[styles.recordTableCell, styles.recordBodyCell]}>
            Details
          </Text>
          <Text style={[styles.recordTableCell, styles.recordActionCell]}>
            Actions
          </Text>
        </View>
        {items.map((item) => (
          <View
            key={item.id}
            style={[
              styles.recordTableRow,
              editingId === item.id && styles.recordTableRowActive,
            ]}
          >
            <Text
              style={[
                styles.recordTableCell,
                styles.recordTitleCell,
                styles.recordTitleText,
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text
              style={[styles.recordTableCell, styles.recordMetaCell]}
              numberOfLines={2}
            >
              {item.subtitle}
            </Text>
            <Text
              style={[styles.recordTableCell, styles.recordBodyCell]}
              numberOfLines={3}
            >
              {item.body}
            </Text>
            <View style={[styles.recordTableCell, styles.recordActionCell]}>
              <Pressable style={styles.tableIconButton} onPress={() => editItem(item)}>
                <Ionicons name="create-outline" size={17} color={colors.maroon} />
              </Pressable>
              {canDeleteRecords ? (
                <Pressable
                  style={[styles.tableIconButton, styles.tableDeleteButton]}
                  onPress={() => deleteItem(item)}
                >
                  <Ionicons name="trash-outline" size={17} color={colors.danger} />
                </Pressable>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderCalendarRecordTable = (items: ListItem[]) => {
    const tableItems = items.filter((item) =>
      String(item.raw.tableActivity ?? "").trim(),
    );

    if (tableItems.length === 0) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No table rows yet</Text>
          <Text style={styles.emptyBody}>
            Fill the large table editor above and save it to publish an Academic
            Calendar table row.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.calendarRecordsTable}>
        <View style={[styles.calendarRecordsRow, styles.calendarRecordsHeader]}>
          {calendarTableColumns.map((column) => (
            <Text
              key={column.key}
              style={[
                styles.calendarRecordsCell,
                { width: column.width },
                column.key === "summer" && styles.calendarRecordsSummerCell,
              ]}
            >
              {column.title}
            </Text>
          ))}
          <Text style={[styles.calendarRecordsCell, styles.calendarRecordsActionCell]}>
            Actions
          </Text>
        </View>
        {tableItems.map((item) => {
          const raw = item.raw as Partial<AcademicEvent>;
          const section = Boolean(raw.tableSection);
          const highlight = Boolean(raw.tableHighlight);

          return (
            <View
              key={item.id}
              style={[
                styles.calendarRecordsRow,
                section && styles.calendarRecordsSectionRow,
                highlight && styles.calendarRecordsHighlightRow,
                editingId === item.id && styles.calendarRecordsActiveRow,
              ]}
            >
              {calendarTableColumns.map((column) => (
                <Text
                  key={column.key}
                  style={[
                    styles.calendarRecordsCell,
                    styles.calendarRecordsText,
                    { width: column.width },
                    column.key === "tableActivity" && styles.calendarRecordsActivityText,
                    column.key === "summer" && styles.calendarRecordsSummerCell,
                    section && styles.calendarRecordsSectionText,
                  ]}
                  numberOfLines={3}
                >
                  {String(raw[column.key] ?? "")}
                </Text>
              ))}
              <View style={[styles.calendarRecordsCell, styles.calendarRecordsActionCell]}>
                <Pressable style={styles.tableIconButton} onPress={() => editItem(item)}>
                  <Ionicons name="create-outline" size={17} color={colors.maroon} />
                </Pressable>
                {canDeleteRecords ? (
                  <Pressable
                    style={[styles.tableIconButton, styles.tableDeleteButton]}
                    onPress={() => deleteItem(item)}
                  >
                    <Ionicons name="trash-outline" size={17} color={colors.danger} />
                  </Pressable>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
      </ScrollView>
    );
  };

  const renderRecordCollection = (items: ListItem[]) =>
    activeTab === "calendar" && recordViewMode === "table"
      ? renderCalendarRecordTable(items)
      : recordViewMode === "table"
      ? renderRecordTable(items)
      : items.map((item) => renderRecordCard(item));

  const resetForm = () => {
    setEditingId(null);
    setForm(defaultForm[activeTab]);
    setProspectusSubjects([]);
    setTechnicalElectiveRows([]);
    setCourseTagDraft("");
    setCourseTags([]);
  };

  const editItem = (item: ListItem) => {
    setEditingId(item.id);
    let nextForm = recordToForm(activeTab, item.raw);
    if (activeTab === "prospectus") {
      const meta = nextForm.programId
        ? getProspectusMetaForProgram(nextForm.programId)
        : null;
      const linkedProgram = nextForm.programId
        ? data.coursePrograms.find((program) => program.id === nextForm.programId)
        : null;

      nextForm = {
        ...nextForm,
        technicalElectives:
          nextForm.technicalElectives ||
          (meta?.technicalElectives ?? [])
            .map((elective) =>
              getTechnicalElectiveLabel(parseTechnicalElective(elective)),
            )
            .filter(Boolean)
            .join(", "),
      };

      setProspectusSubjects(toStringList(item.raw.subjects));
      setTechnicalElectiveRows(splitList(nextForm.technicalElectives));
      if (linkedProgram?.college) {
        setActiveProspectusCollege(linkedProgram.college);
      }
    }
    setForm(nextForm);
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
    if (!canDeleteRecords) {
      setMessage("Faculty accounts can add and edit courses and prospectus, but only admin can delete records.");
      return;
    }

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

    const linkedProspectusCount =
      activeTab === "courses"
        ? data.prospectusRecords.filter((record) => record.programId === item.id).length
        : 0;
    const synced = await deleteRecord(key, item.id);
    setMessage(
      synced
        ? activeTab === "courses" && linkedProspectusCount > 0
          ? `Program deleted with ${linkedProspectusCount} linked prospectus term(s).`
          : "Record deleted and synced."
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

    if (isFacultyConsole && !facultyTabs.includes(activeTab)) {
      setMessage("Faculty accounts can only manage course offerings and prospectus records.");
      return;
    }

    const wasEditing = Boolean(editingId);
    let id = editingId ?? makeId(activeTab);
    setIsSaving(true);
    setMessage("");

    if (activeTab === "students") {
      const payload = {
        name: form.name,
        username: form.name,
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

      if (result.ok && !wasEditing) {
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
      const tableActivity = form.tableActivity.trim();

      if (!tableActivity && !isDateKey(eventDate)) {
        setMessage("Select a valid event date.");
        setIsSaving(false);
        return;
      }

      synced = await upsertRecord("academicEvents", {
        id,
        title: tableActivity || form.title,
        eventDate: tableActivity ? undefined : eventDate,
        dateLabel: tableActivity
          ? [
              form.firstSemester.trim(),
              form.secondSemester.trim(),
              form.summer.trim(),
            ]
              .filter(Boolean)
              .join(" | ") || "Table view row"
          : formatDateLabel(eventDate),
        type: form.type as AcademicEvent["type"],
        audience: form.audience,
        details: form.details,
        tableActivity: tableActivity || undefined,
        firstSemester: form.firstSemester.trim() || undefined,
        secondSemester: form.secondSemester.trim() || undefined,
        summer: form.summer.trim() || undefined,
        tableHighlight: form.tableHighlight === "true",
        tableSection: form.tableSection === "true",
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
        college: form.college.trim(),
        program: form.program.trim(),
        degree: form.degree.trim(),
        overview: form.overview.trim(),
        prospectusUrl: form.prospectusUrl.trim() || undefined,
        tags: courseTags,
      } satisfies CourseProgram);
    }

    if (activeTab === "prospectus") {
      const linkedProgram =
        data.coursePrograms.find((program) => program.id === form.programId) ?? null;

      if (!form.programId.trim() || !linkedProgram) {
        setMessage("Choose a program before saving the prospectus.");
        setIsSaving(false);
        return;
      }

      const cleanedTechnicalElectives = technicalElectiveRows
        .map(formatTechnicalElectiveForSave)
        .filter((elective) => elective.code || elective.title);
      const hasSemesterDraft =
        Boolean(form.yearLevel.trim()) ||
        Boolean(form.semester.trim()) ||
        prospectusSubjects.length > 0;

      if (hasSemesterDraft && (!form.yearLevel.trim() || !form.semester.trim())) {
        setMessage("Choose the year level and semester, or leave both blank to save only technical electives.");
        setIsSaving(false);
        return;
      }

      if (hasSemesterDraft && prospectusSubjects.length === 0) {
        setMessage("Add at least one subject line for this semester.");
        setIsSaving(false);
        return;
      }

      const incompleteSubject = prospectusSubjects.some((subject) => {
        const parsed = parseProspectusSubject(subject);

        return !parsed.code.trim() || !parsed.title.trim();
      });

      if (hasSemesterDraft && incompleteSubject) {
        setMessage("Every subject row needs a code and program / subject title.");
        setIsSaving(false);
        return;
      }

      const infoSynced = await upsertRecord("prospectusRecords", {
        id: buildProspectusInfoRecordId(form.programId),
        programId: form.programId,
        program: linkedProgram.program,
        yearLevel: prospectusInfoYearLevel,
        semester: prospectusInfoSemester,
        summary: undefined,
        technicalElectives: cleanedTechnicalElectives,
        subjects: [],
      } satisfies ProspectusRecord);

      if (!hasSemesterDraft) {
        synced = infoSynced;
      } else {
        const infoRecordId = buildProspectusInfoRecordId(form.programId);
        const editingTermId =
          editingId && editingId !== infoRecordId ? editingId : null;
        const duplicateTerm = data.prospectusRecords.find(
          (record) =>
            record.programId === form.programId &&
            record.yearLevel === form.yearLevel &&
            record.semester === form.semester &&
            record.id !== editingTermId,
        );

        if (editingTermId) {
          id = editingTermId;
        }

        if (!editingTermId && duplicateTerm) {
          id = duplicateTerm.id;
        }

        if (!editingTermId && !duplicateTerm) {
          id = buildProspectusRecordId(
            form.programId,
            form.yearLevel,
            form.semester,
          );
        }

        const termSynced = await upsertRecord("prospectusRecords", {
          id,
          programId: form.programId,
          program: linkedProgram.program,
          yearLevel: form.yearLevel,
          semester: form.semester,
          subjects: prospectusSubjects.map(formatProspectusSubjectForSave),
        } satisfies ProspectusRecord);

        synced = infoSynced && termSynced;
      }
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
          : activeTab === "prospectus"
            ? "Prospectus saved and linked to its course program."
            : "Record added and synced."
        : editingId
          ? `Supabase did not update this record. ${
              getLastAppDataError() || "Check the schema and connection."
            }`
          : `Supabase did not add this record. ${
              getLastAppDataError() || "Check the schema and connection."
            }`,
    );
    if (synced && !wasEditing) {
      resetForm();
    }
    setIsSaving(false);
  };

  if (!canUseConsole) {
    return (
      <SecondaryScreenLayout
        title="Content Console"
        description="Only admin and faculty accounts can manage curriculum content."
        scrollEnabled={scrollEnabled}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Console access required</Text>
          <Text style={styles.cardBody}>
            Sign in with the fixed admin account or an MSU faculty email ending
            in @msumain.edu.ph.
          </Text>
        </View>
      </SecondaryScreenLayout>
    );
  }

  return (
    <SecondaryScreenLayout
      title={isFacultyConsole ? "Faculty Console" : "Admin Console"}
      description={
        isFacultyConsole
          ? "Add, update, and search course offerings and prospectus records."
          : "Add, update, delete, and search app content from one place."
      }
      scrollEnabled={scrollEnabled}
    >
      <View style={[styles.shell, isWide && styles.shellWide]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {visibleTabs.map((tab) => {
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
        </ScrollView>

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

          {activeTab === "calendar" ? (
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Academic Calendar Table</Text>
              <Text style={styles.infoCardText}>
                {editingId
                  ? "You are editing the selected table row. Change the cells, use Section for bold divider rows or Highlight for yellow rows, then press Update."
                  : "Edit the official table one row at a time. Save the header here, then fill the row cells below and press Add."}
              </Text>
              <View style={styles.calendarHeaderEditor}>
                <View style={styles.inlineFieldRow}>
                  <View style={styles.calendarHeaderFieldWide}>
                    <Text style={styles.inlineFieldLabel}>School year label</Text>
                    <TextInput
                      style={styles.input}
                      value={calendarHeaderDraft.schoolYearLabel}
                      onChangeText={(value) =>
                        updateCalendarHeaderField("schoolYearLabel", value)
                      }
                      placeholder="Academic Calendar, School Year 2025-2026"
                      placeholderTextColor="#998B8B"
                    />
                  </View>
                  <View style={styles.calendarHeaderFieldWide}>
                    <Text style={styles.inlineFieldLabel}>Registrar header</Text>
                    <TextInput
                      style={styles.input}
                      value={calendarHeaderDraft.officeLabel}
                      onChangeText={(value) =>
                        updateCalendarHeaderField("officeLabel", value)
                      }
                      placeholder="Office of the University Registrar"
                      placeholderTextColor="#998B8B"
                    />
                  </View>
                </View>
                <View style={styles.inlineFieldRow}>
                  <View style={styles.calendarHeaderFieldWide}>
                    <Text style={styles.inlineFieldLabel}>Table title</Text>
                    <TextInput
                      style={styles.input}
                      value={calendarHeaderDraft.title}
                      onChangeText={(value) =>
                        updateCalendarHeaderField("title", value)
                      }
                      placeholder="Academic Calendar, School Year 2025-2026"
                      placeholderTextColor="#998B8B"
                    />
                  </View>
                </View>
                <View style={styles.inlineFieldRow}>
                  <View style={styles.calendarHeaderField}>
                    <Text style={styles.inlineFieldLabel}>First semester subtitle</Text>
                    <TextInput
                      style={styles.input}
                      value={calendarHeaderDraft.firstSemester}
                      onChangeText={(value) =>
                        updateCalendarHeaderField("firstSemester", value)
                      }
                      placeholder="August - December 2025"
                      placeholderTextColor="#998B8B"
                    />
                  </View>
                  <View style={styles.calendarHeaderField}>
                    <Text style={styles.inlineFieldLabel}>Second semester subtitle</Text>
                    <TextInput
                      style={styles.input}
                      value={calendarHeaderDraft.secondSemester}
                      onChangeText={(value) =>
                        updateCalendarHeaderField("secondSemester", value)
                      }
                      placeholder="January - May 2026"
                      placeholderTextColor="#998B8B"
                    />
                  </View>
                  <View style={styles.calendarHeaderField}>
                    <Text style={styles.inlineFieldLabel}>Summer subtitle</Text>
                    <TextInput
                      style={styles.input}
                      value={calendarHeaderDraft.summer}
                      onChangeText={(value) =>
                        updateCalendarHeaderField("summer", value)
                      }
                      placeholder="June - July 2026"
                      placeholderTextColor="#998B8B"
                    />
                  </View>
                </View>
                <Pressable
                  style={[
                    styles.secondaryInlineButton,
                    isSavingCalendarHeader && styles.saveButtonDisabled,
                  ]}
                  onPress={saveCalendarHeader}
                  disabled={isSavingCalendarHeader}
                >
                  <Text style={styles.secondaryInlineButtonText}>
                    {isSavingCalendarHeader ? "Saving Header..." : "Save Header"}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {activeTab === "courses" && editingId ? (
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Connected Prospectus</Text>
              <Text style={styles.infoCardText}>
                {
                  getProgramProspectusStats(editingId, data.prospectusRecords)
                    .recordCount
                }{" "}
                term(s) are linked to this program. Saving a program rename updates
                those linked prospectus records too.
              </Text>
            </View>
          ) : null}

          {activeTab === "prospectus" ? (
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Prospectus</Text>
              <Text style={styles.infoCardText}>
                {selectedProspectusProgram
                  ? `${selectedProspectusProgram.program} is linked to ${
                      selectedProspectusStats?.recordCount ?? 0
                    } term(s) and ${
                      selectedProspectusStats?.subjectCount ?? 0
                    } subject line(s).`
                  : "Choose a course program first. Prospectus terms stay linked to the selected program."}
              </Text>
              {selectedProspectusProgram ? (
                <>
                  <Text style={styles.infoCardText}>
                    Technical electives:{" "}
                    {splitList(form.technicalElectives).length > 0
                      ? splitList(form.technicalElectives).join(", ")
                      : "None listed"}
                  </Text>
                </>
              ) : null}
              {selectedProspectusStats && selectedProspectusStats.terms.length > 0 ? (
                <View style={styles.linkedTermList}>
                  {selectedProspectusStats.terms.map((term) => (
                    <Pressable
                      key={term.id}
                      style={styles.linkedTermChip}
                      onPress={() =>
                        editItem({
                          id: term.id,
                          title: term.label,
                          subtitle: selectedProspectusProgram?.program ?? "",
                          body: "",
                          raw:
                            data.prospectusRecords.find((record) => record.id === term.id) ??
                            {},
                        })
                      }
                    >
                      <Text style={styles.linkedTermChipText}>
                        {term.label} | {term.subjectCount}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}

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
                  latitude: toOptionalNumber(form.latitude),
                  longitude: toOptionalNumber(form.longitude),
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
                  (field.multiline ||
                    (activeTab === "calendar" && field.key === "tableRows") ||
                    (activeTab === "locations" && field.key === "image")) &&
                    styles.fieldWide,
                  isWide &&
                    !field.multiline &&
                    !(activeTab === "calendar" && field.key === "tableRows") &&
                    !(activeTab === "locations" && field.key === "image") &&
                    styles.fieldHalf,
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
          <View style={styles.listHeaderCopy}>
            <Text style={styles.listTitle}>{visibleTabs.find((tab) => tab.key === activeTab)?.label}</Text>
            <Text style={styles.listCount}>{listItems.length} record(s)</Text>
          </View>
          <View style={styles.viewModeToggle}>
            {(["table", "cards"] as const).map((mode) => {
              const active = recordViewMode === mode;

              return (
                <Pressable
                  key={mode}
                  style={[
                    styles.viewModeButton,
                    active && styles.viewModeButtonActive,
                  ]}
                  onPress={() => setRecordViewMode(mode)}
                >
                  <Ionicons
                    name={mode === "table" ? "grid-outline" : "albums-outline"}
                    size={16}
                    color={active ? colors.surface : colors.maroonDark}
                  />
                  <Text
                    style={[
                      styles.viewModeButtonText,
                      active && styles.viewModeButtonTextActive,
                    ]}
                  >
                    {mode === "table" ? "Table" : "Cards"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {activeTab === "prospectus" ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.programChoiceRow}
          >
            {prospectusCollegeOptions.map((college) => {
              const selected = activeProspectusCollege === college;

              return (
                <Pressable
                  key={`prospectus-list-${college}`}
                  style={[styles.choiceChip, selected && styles.choiceChipActive]}
                  onPress={() => setActiveProspectusCollege(college)}
                >
                  <Text
                    style={[
                      styles.choiceChipText,
                      selected && styles.choiceChipTextActive,
                    ]}
                  >
                    {college}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}

        {activeTab === "prospectus" ? (
          <View style={styles.list}>
            {prospectusCollegeGroups.length > 0 ? prospectusCollegeGroups.map((group) => (
              <View key={group.college} style={styles.collegeGroup}>
                <View style={styles.collegeGroupHeader}>
                  <Text style={styles.collegeGroupTitle}>{group.college}</Text>
                  <Text style={styles.collegeGroupCount}>
                    {group.items.length} record(s)
                  </Text>
                </View>
                <View style={styles.list}>
                  {renderRecordCollection(group.items)}
                </View>
              </View>
            )) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No matching records</Text>
                <Text style={styles.emptyBody}>
                  Add a record above or adjust the search filter.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.list}>
            {listItems.length > 0 ? renderRecordCollection(listItems) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No matching records</Text>
                <Text style={styles.emptyBody}>
                  Add a record above or adjust the search filter.
                </Text>
              </View>
            )}
          </View>
        )}
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
    gap: 8,
    paddingRight: 16,
  },
  tab: {
    minHeight: 42,
    justifyContent: "center",
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
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  infoCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 8,
  },
  infoCardTitle: {
    color: colors.maroonDark,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  infoCardText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  linkedTermList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  linkedTermChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  linkedTermChipText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "800",
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
    flexBasis: "100%",
    flexGrow: 1,
  },
  fieldHalf: {
    flexBasis: 320,
    flexGrow: 1,
  },
  fieldWide: {
    flexBasis: "100%",
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
  calendarHeaderEditor: {
    gap: 10,
    marginTop: 14,
  },
  calendarHeaderField: {
    flexBasis: 220,
    flexGrow: 1,
  },
  calendarHeaderFieldWide: {
    flexBasis: 320,
    flexGrow: 1,
  },
  locationImageEditor: {
    gap: 10,
  },
  locationImagePreview: {
    width: "100%",
    height: 190,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  locationImagePlaceholder: {
    minHeight: 150,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: "dashed",
  },
  locationImagePlaceholderText: {
    maxWidth: 320,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  locationImageControls: {
    gap: 10,
  },
  locationImageInput: {
    minHeight: 46,
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
    minHeight: 40,
    justifyContent: "center",
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
  programChoiceMeta: {
    marginTop: 6,
    color: colors.goldDark,
    fontSize: 10,
    fontWeight: "900",
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
  secondaryInlineButton: {
    minHeight: 40,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  secondaryInlineButtonText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  subjectList: {
    gap: 8,
  },
  subjectTableToolbar: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  calendarTableEditor: {
    gap: 10,
  },
  calendarTableToggleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  calendarTableToggle: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  calendarTableToggleActive: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  calendarTableToggleText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  calendarTableToggleTextActive: {
    color: colors.surface,
  },
  calendarEditorTable: {
    minWidth: 970,
    borderWidth: 1,
    borderColor: "#2C2424",
    borderRadius: radii.sm,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  calendarEditorHeader: {
    backgroundColor: colors.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2424",
  },
  calendarEditorRow: {
    flexDirection: "row",
    alignItems: "stretch",
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D0CB",
  },
  calendarEditorSectionRow: {
    backgroundColor: "#F3EEE7",
  },
  calendarEditorHighlightRow: {
    backgroundColor: "#FFF4A8",
  },
  calendarEditorCell: {
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRightWidth: 1,
    borderRightColor: "#2C2424",
    color: colors.maroonDark,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
  },
  calendarEditorLastCell: {
    borderRightWidth: 0,
  },
  calendarEditorInput: {
    minHeight: 44,
    paddingHorizontal: 0,
    paddingVertical: 0,
    color: colors.ink,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    textAlignVertical: "top",
  },
  calendarEditorActivityInput: {
    fontWeight: "800",
  },
  calendarEditorSectionInput: {
    color: colors.maroonDark,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  prospectusInfoTable: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  prospectusInfoTableRow: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  prospectusInfoLabelCell: {
    width: 120,
    color: colors.maroonDark,
    fontWeight: "900",
  },
  prospectusInfoValueCell: {
    flex: 1,
    minWidth: 180,
  },
  prospectusInfoInput: {
    minHeight: 28,
    paddingHorizontal: 0,
    paddingVertical: 0,
    color: colors.ink,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
  },
  prospectusInfoInputMultiline: {
    minHeight: 104,
    textAlignVertical: "top",
  },
  prospectusInfoHint: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  electiveTable: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  electiveNumberCell: {
    width: 42,
    color: colors.goldDark,
    fontWeight: "900",
  },
  electiveCodeCell: {
    width: 110,
    color: colors.maroonDark,
    fontWeight: "900",
  },
  electiveValueCell: {
    flex: 1,
    minWidth: 220,
  },
  electiveActionCell: {
    width: 76,
    alignItems: "center",
    borderRightWidth: 0,
  },
  subjectTable: {
    minWidth: 1040,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  subjectTableHeader: {
    backgroundColor: colors.maroonSoft,
  },
  subjectTableRow: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  subjectTableCell: {
    minHeight: 44,
    paddingHorizontal: 9,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: colors.line,
    color: colors.ink,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
  },
  subjectTableInput: {
    minHeight: 26,
    paddingHorizontal: 0,
    paddingVertical: 0,
    color: colors.ink,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
  },
  subjectTableInputCenter: {
    textAlign: "center",
  },
  subjectNumberCell: {
    width: 42,
    color: colors.goldDark,
    fontWeight: "900",
  },
  subjectCodeCell: {
    width: 100,
    color: colors.maroonDark,
    fontWeight: "900",
  },
  subjectTitleCell: {
    width: 230,
  },
  subjectProgramCell: {
    width: 280,
  },
  subjectSmallCell: {
    width: 64,
    textAlign: "center",
  },
  subjectReqCell: {
    width: 150,
  },
  subjectImportanceCell: {
    width: 190,
  },
  subjectActionCell: {
    width: 150,
    borderRightWidth: 0,
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
  subjectItemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    minWidth: 0,
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
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  listHeaderCopy: {
    flex: 1,
    minWidth: 180,
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
  viewModeToggle: {
    flexDirection: "row",
    gap: 6,
    padding: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  viewModeButton: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
  },
  viewModeButtonActive: {
    backgroundColor: colors.maroon,
  },
  viewModeButtonText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  viewModeButtonTextActive: {
    color: colors.surface,
  },
  list: {
    gap: 10,
  },
  recordTable: {
    minWidth: 920,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  recordTableHeader: {
    backgroundColor: colors.maroonSoft,
  },
  recordTableRow: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  recordTableRowActive: {
    backgroundColor: colors.surfaceMuted,
  },
  recordTableCell: {
    minHeight: 48,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: colors.line,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
  },
  recordTitleCell: {
    width: 260,
  },
  recordMetaCell: {
    width: 190,
  },
  recordBodyCell: {
    width: 340,
  },
  recordActionCell: {
    width: 128,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRightWidth: 0,
  },
  recordTitleText: {
    color: colors.maroonDark,
    fontWeight: "900",
  },
  tableIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.maroonSoft,
  },
  tableDeleteButton: {
    backgroundColor: "#FCE8E6",
  },
  calendarRecordsTable: {
    minWidth: 1098,
    borderWidth: 1,
    borderColor: "#2C2424",
    borderRadius: radii.sm,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  calendarRecordsHeader: {
    backgroundColor: colors.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2424",
  },
  calendarRecordsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D0CB",
  },
  calendarRecordsSectionRow: {
    backgroundColor: "#F3EEE7",
  },
  calendarRecordsHighlightRow: {
    backgroundColor: "#FFF4A8",
  },
  calendarRecordsActiveRow: {
    borderLeftWidth: 4,
    borderLeftColor: colors.maroon,
  },
  calendarRecordsCell: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRightWidth: 1,
    borderRightColor: "#2C2424",
    color: colors.maroonDark,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
  },
  calendarRecordsText: {
    color: colors.ink,
    fontWeight: "700",
    textAlign: "left",
    textTransform: "none",
  },
  calendarRecordsActivityText: {
    fontWeight: "800",
  },
  calendarRecordsSectionText: {
    color: colors.maroonDark,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  calendarRecordsSummerCell: {
    borderRightWidth: 1,
  },
  calendarRecordsActionCell: {
    width: 128,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRightWidth: 0,
  },
  collegeGroup: {
    gap: 10,
  },
  collegeGroupHeader: {
    marginTop: 6,
    paddingHorizontal: 2,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  collegeGroupTitle: {
    flex: 1,
    color: colors.maroonDark,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
  },
  collegeGroupCount: {
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: "900",
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
  emptyCard: {
    padding: 18,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  emptyTitle: {
    color: colors.maroonDark,
    fontSize: 15,
    fontWeight: "900",
  },
  emptyBody: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
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
