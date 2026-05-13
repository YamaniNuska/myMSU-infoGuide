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
  UserRecord,
} from "./mymsuDatabase";

type DbRecord = Record<string, unknown>;

const tableByCollection: Record<CollectionKey, string> = {
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

const toUser = (row: DbRecord): UserRecord => ({
  id: String(row.id),
  name: String(row.name ?? ""),
  role: (row.role as UserRecord["role"]) ?? "visitor",
  username: String(row.username ?? ""),
  email: String(row.email ?? ""),
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

async function selectRows<T>(table: string, mapper: (row: DbRecord) => T) {
  const { data, error } = await supabase.from(table).select("*");

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapper(row as DbRecord));
}

export { isSupabaseConfigured };

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

  const { error } = await supabase
    .from(tableByCollection[key])
    .upsert(items.map((item) => fromAppRecord(key, item)) as DbRecord[], {
      onConflict: "id",
    });

  if (error) {
    throw error;
  }
}

export async function supabaseUpsertRecord<K extends CollectionKey>(
  key: K,
  item: AppData[K][number],
) {
  const { error } = await supabase
    .from(tableByCollection[key])
    .upsert(fromAppRecord(key, item) as DbRecord, { onConflict: "id" });

  if (error) {
    throw error;
  }
}

export async function supabaseDeleteRecord(key: CollectionKey, id: string) {
  const { error } = await supabase
    .from(tableByCollection[key])
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
