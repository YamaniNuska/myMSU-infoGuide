import { supabase, isSupabaseConfigured } from "../../utils/supabase";
import type { AppData, CollectionKey } from "./appStore";
import type {
  AcademicEvent,
  AnnouncementRecord,
  CampusLocation,
  ClassScheduleRecord,
  CourseProgram,
  HandbookEntry,
  OfficeRecord,
  ProspectusRecord,
  TechnicalElective,
  UserRecord,
} from "./mymsuDatabase";

type DbRecord = Record<string, unknown>;

export const tableByCollection: Record<CollectionKey, string> = {
  users: "profiles",
  handbookEntries: "handbook_entries",
  offices: "administrative_offices",
  campusLocations: "campus_locations",
  classSchedules: "class_schedules",
  coursePrograms: "course_offerings",
  prospectusRecords: "prospectus_records",
  academicEvents: "academic_calendar",
  announcements: "notifications",
};

const asArray = (value: unknown) => (Array.isArray(value) ? value : []);
const optionalString = (value: unknown) =>
  value === null || value === undefined ? undefined : String(value);
const toTechnicalElective = (value: unknown): TechnicalElective => {
  if (value && typeof value === "object") {
    const row = value as Record<string, unknown>;

    return {
      code: String(row.code ?? "").trim(),
      title: String(row.title ?? "").trim(),
    };
  }

  const trimmed = String(value ?? "").trim();

  if (trimmed.includes("|")) {
    const [code = "", ...titleParts] = trimmed.split("|");

    return {
      code: code.trim(),
      title: titleParts.join("|").trim(),
    };
  }

  const codeMatch = trimmed.match(/^([A-Z]{2,}\s?\d+[A-Z]?)\s+(.+)$/i);

  return {
    code: codeMatch ? codeMatch[1].trim() : "",
    title: codeMatch ? codeMatch[2].trim() : trimmed,
  };
};

const toUser = (row: DbRecord): UserRecord => ({
  id: String(row.id),
  name: String(row.name ?? ""),
  role: (row.role as UserRecord["role"]) ?? "visitor",
  username: String(row.username ?? ""),
  email: String(row.email ?? ""),
  idNumber: optionalString(row.id_number) ?? optionalString(row.student_id),
  avatarUrl: optionalString(row.avatar_url),
  college: optionalString(row.college),
  program: optionalString(row.program),
  yearLevel: optionalString(row.year_level),
  section: optionalString(row.section),
  phone: optionalString(row.phone),
  address: optionalString(row.address),
  bio: optionalString(row.bio),
});

const toHandbookEntry = (row: DbRecord): HandbookEntry => ({
  id: String(row.id),
  chapter: String(row.chapter ?? ""),
  title: String(row.title ?? ""),
  content: String(row.content ?? ""),
  tags: asArray(row.tags) as string[],
});

const toOffice = (row: DbRecord): OfficeRecord => ({
  id: String(row.id),
  name: String(row.name ?? ""),
  category: String(row.category ?? ""),
  summary: String(row.summary ?? ""),
  services: asArray(row.services) as string[],
  location: String(row.location ?? ""),
  contact: String(row.contact ?? ""),
  hours: String(row.hours ?? ""),
  tags: asArray(row.tags) as string[],
});

const toCampusLocation = (row: DbRecord): CampusLocation => ({
  id: String(row.id),
  name: String(row.name ?? ""),
  category: String(row.category ?? ""),
  description: String(row.description ?? ""),
  mapX: Number(row.map_x ?? 50),
  mapY: Number(row.map_y ?? 50),
  latitude: row.latitude === null ? undefined : Number(row.latitude),
  longitude: row.longitude === null ? undefined : Number(row.longitude),
  street: optionalString(row.street),
  nearby: asArray(row.nearby) as string[],
  tags: asArray(row.tags) as string[],
  image: optionalString(row.image),
});

const toClassSchedule = (row: DbRecord): ClassScheduleRecord => ({
  id: String(row.id),
  userId: optionalString(row.user_id),
  courseCode: String(row.course_code ?? ""),
  courseTitle: String(row.course_title ?? ""),
  day: String(row.day ?? ""),
  time: String(row.time ?? ""),
  scheduleDate: optionalString(row.schedule_date),
  startTime: optionalString(row.start_time),
  endTime: optionalString(row.end_time),
  room: String(row.room ?? ""),
  reminder: String(row.reminder ?? ""),
  reminderMinutes: Number(row.reminder_minutes ?? 15),
  reminderAt: optionalString(row.reminder_at),
  notificationId: optionalString(row.notification_id),
});

const toCourseProgram = (row: DbRecord): CourseProgram => ({
  id: String(row.id),
  college: String(row.college ?? ""),
  program: String(row.program ?? ""),
  degree: String(row.degree ?? ""),
  overview: String(row.overview ?? ""),
  tags: asArray(row.tags) as string[],
});

const toProspectusRecord = (row: DbRecord): ProspectusRecord => ({
  id: String(row.id),
  programId: String(row.program_id ?? ""),
  program: String(row.program ?? ""),
  yearLevel: String(row.year_level ?? ""),
  semester: String(row.semester ?? ""),
  summary: optionalString(row.summary),
  technicalElectives: asArray(row.technical_electives)
    .map(toTechnicalElective)
    .filter((elective) => elective.code || elective.title),
  subjects: asArray(row.subjects) as string[],
});

const toAcademicEvent = (row: DbRecord): AcademicEvent => ({
  id: String(row.id),
  title: String(row.title ?? ""),
  eventDate: optionalString(row.event_date),
  dateLabel: String(row.date_label ?? ""),
  type: (row.type as AcademicEvent["type"]) ?? "event",
  audience: String(row.audience ?? ""),
  details: String(row.details ?? ""),
});

const toAnnouncement = (row: DbRecord): AnnouncementRecord => ({
  id: String(row.id),
  title: String(row.title ?? ""),
  body: String(row.body ?? ""),
  dateLabel: String(row.date_label ?? ""),
  priority: (row.priority as AnnouncementRecord["priority"]) ?? "normal",
  audience: String(row.audience ?? ""),
});

const fromAppRecord = (key: CollectionKey, item: AppData[CollectionKey][number]) => {
  switch (key) {
    case "users": {
      const user = item as UserRecord;
      return {
        id: user.id,
        name: user.name,
        role: user.role,
        username: user.username,
        email: user.email,
        id_number: user.idNumber ?? null,
        student_id: user.idNumber ?? null,
        avatar_url: user.avatarUrl ?? null,
        college: user.college ?? null,
        program: user.program ?? null,
        year_level: user.yearLevel ?? null,
        section: user.section ?? null,
        phone: user.phone ?? null,
        address: user.address ?? null,
        bio: user.bio ?? null,
      };
    }
    case "handbookEntries": {
      const entry = item as HandbookEntry;
      return {
        id: entry.id,
        chapter: entry.chapter,
        title: entry.title,
        content: entry.content,
        tags: entry.tags,
      };
    }
    case "offices": {
      const office = item as OfficeRecord;
      return {
        id: office.id,
        name: office.name,
        category: office.category,
        summary: office.summary,
        services: office.services,
        location: office.location,
        contact: office.contact,
        hours: office.hours,
        tags: office.tags,
      };
    }
    case "campusLocations": {
      const location = item as CampusLocation;
      return {
        id: location.id,
        name: location.name,
        category: location.category,
        description: location.description,
        map_x: location.mapX,
        map_y: location.mapY,
        latitude: location.latitude ?? null,
        longitude: location.longitude ?? null,
        street: location.street ?? null,
        nearby: location.nearby,
        tags: location.tags,
        image: location.image ?? null,
      };
    }
    case "classSchedules": {
      const schedule = item as ClassScheduleRecord;
      return {
        id: schedule.id,
        user_id: schedule.userId ?? null,
        course_code: schedule.courseCode,
        course_title: schedule.courseTitle,
        day: schedule.day,
        time: schedule.time,
        schedule_date: schedule.scheduleDate ?? null,
        start_time: schedule.startTime ?? null,
        end_time: schedule.endTime ?? null,
        room: schedule.room,
        reminder: schedule.reminder,
        reminder_minutes: schedule.reminderMinutes ?? 15,
        reminder_at: schedule.reminderAt ?? null,
        notification_id: schedule.notificationId ?? null,
      };
    }
    case "coursePrograms": {
      const program = item as CourseProgram;
      return {
        id: program.id,
        college: program.college,
        program: program.program,
        degree: program.degree,
        overview: program.overview,
        tags: program.tags,
      };
    }
    case "prospectusRecords": {
      const prospectus = item as ProspectusRecord;
      return {
        id: prospectus.id,
        program_id: prospectus.programId,
        program: prospectus.program,
        year_level: prospectus.yearLevel,
        semester: prospectus.semester,
        summary: prospectus.summary ?? null,
        technical_electives: prospectus.technicalElectives ?? [],
        subjects: prospectus.subjects,
      };
    }
    case "academicEvents": {
      const event = item as AcademicEvent;
      return {
        id: event.id,
        title: event.title,
        event_date: event.eventDate ?? null,
        date_label: event.dateLabel,
        type: event.type,
        audience: event.audience,
        details: event.details,
      };
    }
    case "announcements": {
      const announcement = item as AnnouncementRecord;
      return {
        id: announcement.id,
        title: announcement.title,
        body: announcement.body,
        date_label: announcement.dateLabel,
        priority: announcement.priority,
        audience: announcement.audience,
      };
    }
  }
};

const isMissingColumnError = (error: unknown, column: string) =>
  typeof error === "object" &&
  error !== null &&
  "message" in error &&
  typeof (error as { message?: unknown }).message === "string" &&
  (error as { message: string }).message.includes(`'${column}' column`);

const omitKey = (record: DbRecord, key: string) => {
  const { [key]: _removed, ...rest } = record;

  return rest;
};

async function upsertRowWithSchemaFallback(
  table: string,
  record: DbRecord,
  onConflict = "id",
) {
  const { error } = await supabase.from(table).upsert(record, { onConflict });

  if (!error) {
    return;
  }

  if (table === "academic_calendar" && isMissingColumnError(error, "event_date")) {
    const retry = await supabase
      .from(table)
      .upsert(omitKey(record, "event_date"), { onConflict });

    if (!retry.error) {
      return;
    }

    throw retry.error;
  }

  throw error;
}

async function verifyPersistedRow(table: string, id: unknown) {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(`Supabase accepted the write, but ${table}.${String(id)} was not found afterward.`);
  }
}

async function verifyDeletedRow(table: string, id: string) {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    throw new Error(`Supabase accepted the delete, but ${table}.${id} still exists.`);
  }
}

async function selectRows<T>(table: string, mapper: (row: DbRecord) => T) {
  const { data, error } = await supabase.from(table).select("*");

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapper(row as DbRecord));
}

export { isSupabaseConfigured };

export type AdminContactMessageInput = {
  officeId: string;
  officeName: string;
  officeEmail?: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  attachmentName?: string;
  attachmentPath?: string;
  attachmentMimeType?: string;
  attachmentSizeBytes?: number;
};

export type AdminContactAttachmentInput = {
  name: string;
  uri: string;
  size?: number | null;
  mimeType?: string | null;
};

export type AdminContactMessageRecord = {
  id: string;
  officeId?: string;
  officeName: string;
  officeEmail?: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  attachmentName?: string;
  attachmentPath?: string;
  attachmentMimeType?: string;
  attachmentSizeBytes?: number;
  status: string;
  createdAt?: string;
};

export type AdminContactEmailInput = AdminContactMessageInput & {
  messageId: string;
};

const ADMIN_CONTACT_ATTACHMENT_BUCKET = "admin-contact-files";
const MAX_ADMIN_ATTACHMENT_BYTES = 30 * 1024 * 1024;

const sanitizeFileName = (value: string) =>
  value.replace(/[^a-zA-Z0-9._-]/g, "_");

export function getAdminAttachmentLimitBytes() {
  return MAX_ADMIN_ATTACHMENT_BYTES;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function supabaseUploadAdminContactAttachment(
  attachment: AdminContactAttachmentInput,
) {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Add the Supabase URL and publishable key to upload an attachment.",
    );
  }

  if (attachment.size && attachment.size > MAX_ADMIN_ATTACHMENT_BYTES) {
    throw new Error(
      `Attachment must be smaller than ${formatBytes(MAX_ADMIN_ATTACHMENT_BYTES)}.`,
    );
  }

  const response = await fetch(attachment.uri);
  const blob = await response.blob();

  if (blob.size > MAX_ADMIN_ATTACHMENT_BYTES) {
    throw new Error(
      `Attachment must be smaller than ${formatBytes(MAX_ADMIN_ATTACHMENT_BYTES)}.`,
    );
  }

  const path = `office-messages/${Date.now()}-${sanitizeFileName(
    attachment.name || "attachment",
  )}`;
  const { error } = await supabase.storage
    .from(ADMIN_CONTACT_ATTACHMENT_BUCKET)
    .upload(path, blob, {
      contentType: attachment.mimeType ?? blob.type ?? "application/octet-stream",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return {
    path,
    name: attachment.name,
    mimeType: attachment.mimeType ?? blob.type ?? "application/octet-stream",
    sizeBytes: attachment.size ?? blob.size,
  };
}

export async function supabaseCreateAdminContactMessage(
  input: AdminContactMessageInput,
) {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Add the Supabase URL and publishable key to send in-app office messages.",
    );
  }

  const id = `admin-message-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const { error } = await supabase.from("admin_contact_messages").insert({
    id,
    office_id: input.officeId,
    office_name: input.officeName,
    office_email: input.officeEmail ?? null,
    sender_name: input.senderName,
    sender_email: input.senderEmail,
    subject: input.subject,
    message: input.message,
    attachment_name: input.attachmentName ?? null,
    attachment_path: input.attachmentPath ?? null,
    attachment_mime_type: input.attachmentMimeType ?? null,
    attachment_size_bytes: input.attachmentSizeBytes ?? null,
    status: "new",
  });

  if (error) {
    throw error;
  }

  await verifyPersistedRow("admin_contact_messages", id);

  return id;
}

export async function supabaseSendAdminContactEmail(
  input: AdminContactEmailInput,
) {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Add the Supabase URL and publishable key to send real office emails.",
    );
  }

  if (!input.officeEmail) {
    throw new Error(
      "This office does not have an email address in its contact details.",
    );
  }

  const { data, error } = await supabase.functions.invoke("send-office-email", {
    body: input,
  });

  if (error) {
    throw error;
  }

  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    throw new Error(data.error);
  }

  return data;
}

export async function supabaseGetAdminContactMessages(input: {
  officeId: string;
  senderEmail?: string;
  limit?: number;
}) {
  if (!isSupabaseConfigured()) {
    return [] as AdminContactMessageRecord[];
  }

  let query = supabase
    .from("admin_contact_messages")
    .select("*")
    .eq("office_id", input.officeId)
    .order("created_at", { ascending: false })
    .limit(input.limit ?? 8);

  if (input.senderEmail?.trim()) {
    query = query.eq("sender_email", input.senderEmail.trim().toLowerCase());
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map(
    (row) =>
      ({
        id: String(row.id),
        officeId: optionalString(row.office_id),
        officeName: String(row.office_name ?? ""),
        officeEmail: optionalString(row.office_email),
        senderName: String(row.sender_name ?? ""),
        senderEmail: String(row.sender_email ?? ""),
        subject: String(row.subject ?? ""),
        message: String(row.message ?? ""),
        attachmentName: optionalString(row.attachment_name),
        attachmentPath: optionalString(row.attachment_path),
        attachmentMimeType: optionalString(row.attachment_mime_type),
        attachmentSizeBytes:
          row.attachment_size_bytes === null ||
          row.attachment_size_bytes === undefined
            ? undefined
            : Number(row.attachment_size_bytes),
        status: String(row.status ?? "new"),
        createdAt: optionalString(row.created_at),
      }) satisfies AdminContactMessageRecord,
  );
}

export async function supabaseGetData(): Promise<AppData> {
  const [
    users,
    handbookEntries,
    offices,
    campusLocations,
    classSchedules,
    coursePrograms,
    prospectusRecords,
    academicEvents,
    announcements,
  ] = await Promise.all([
    selectRows("profiles", toUser),
    selectRows("handbook_entries", toHandbookEntry),
    selectRows("administrative_offices", toOffice),
    selectRows("campus_locations", toCampusLocation),
    selectRows("class_schedules", toClassSchedule),
    selectRows("course_offerings", toCourseProgram),
    selectRows("prospectus_records", toProspectusRecord),
    selectRows("academic_calendar", toAcademicEvent),
    selectRows("notifications", toAnnouncement),
  ]);

  return {
    users,
    handbookEntries,
    offices,
    campusLocations,
    classSchedules,
    coursePrograms,
    prospectusRecords,
    academicEvents,
    announcements,
  };
}

export async function supabaseSeedData(data: AppData) {
  await supabaseUpsertRecords("handbookEntries", data.handbookEntries);
  await supabaseUpsertRecords("offices", data.offices);
  await supabaseUpsertRecords("campusLocations", data.campusLocations);
  await supabaseUpsertRecords("classSchedules", data.classSchedules);
  await supabaseUpsertRecords("coursePrograms", data.coursePrograms);
  await supabaseUpsertRecords("prospectusRecords", data.prospectusRecords);
  await supabaseUpsertRecords("academicEvents", data.academicEvents);
  await supabaseUpsertRecords("announcements", data.announcements);

  return supabaseGetData();
}

export async function supabaseUpsertRecords<K extends CollectionKey>(
  key: K,
  items: AppData[K],
) {
  if (items.length === 0) {
    return;
  }

  const table = tableByCollection[key];
  const records = items.map((item) => fromAppRecord(key, item)) as DbRecord[];
  const { error } = await supabase.from(table).upsert(records, {
    onConflict: "id",
  });

  if (!error) {
    return;
  }

  if (key === "academicEvents" && isMissingColumnError(error, "event_date")) {
    const retry = await supabase
      .from(table)
      .upsert(records.map((record) => omitKey(record, "event_date")), {
        onConflict: "id",
      });

    if (!retry.error) {
      return;
    }

    throw retry.error;
  }

  throw error;
}

export async function supabaseUpsertRecord<K extends CollectionKey>(
  key: K,
  item: AppData[K][number],
) {
  const record = fromAppRecord(key, item) as DbRecord;
  const table = tableByCollection[key];

  await upsertRowWithSchemaFallback(
    table,
    record,
  );
  await verifyPersistedRow(table, record.id);
}

export async function supabaseDeleteRecord(key: CollectionKey, id: string) {
  const table = tableByCollection[key];
  const { error } = await supabase
    .from(table)
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  await verifyDeletedRow(table, id);
}

export function supabaseSubscribeToDataChanges(onChange: () => void) {
  if (!isSupabaseConfigured()) {
    return () => undefined;
  }

  const channel = supabase.channel("mymsu-app-data");

  Object.values(tableByCollection).forEach((table) => {
    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table,
      },
      onChange,
    );
  });

  channel.subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
