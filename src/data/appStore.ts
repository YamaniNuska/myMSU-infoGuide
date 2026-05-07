import * as React from "react";
import {
  AcademicEvent,
  AnnouncementRecord,
  CampusLocation,
  ClassScheduleRecord,
  CourseProgram,
  HandbookEntry,
  OfficeRecord,
  ProspectusRecord,
  SearchResult,
  UserRecord,
  academicEvents,
  announcements,
  campusLocations,
  classSchedules,
  coursePrograms,
  handbookEntries,
  offices,
  prospectusRecords,
  users,
} from "./mymsuDatabase";

export type AppData = {
  users: UserRecord[];
  handbookEntries: HandbookEntry[];
  offices: OfficeRecord[];
  campusLocations: CampusLocation[];
  classSchedules: ClassScheduleRecord[];
  coursePrograms: CourseProgram[];
  prospectusRecords: ProspectusRecord[];
  academicEvents: AcademicEvent[];
  announcements: AnnouncementRecord[];
};

type CollectionKey = keyof AppData;
type CollectionItem<K extends CollectionKey> = AppData[K][number];

const cloneArray = <T,>(items: T[]) =>
  items.map((item) => ({ ...item })) as T[];

let appData: AppData = {
  users: cloneArray(users),
  handbookEntries: cloneArray(handbookEntries),
  offices: cloneArray(offices),
  campusLocations: cloneArray(campusLocations),
  classSchedules: cloneArray(classSchedules),
  coursePrograms: cloneArray(coursePrograms),
  prospectusRecords: cloneArray(prospectusRecords),
  academicEvents: cloneArray(academicEvents),
  announcements: cloneArray(announcements),
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeAppData(listener: () => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function getAppData() {
  return appData;
}

export function useAppData() {
  return React.useSyncExternalStore(
    subscribeAppData,
    getAppData,
    getAppData,
  );
}

export function upsertRecord<K extends CollectionKey>(
  key: K,
  item: CollectionItem<K> & { id: string },
) {
  const items = appData[key] as (CollectionItem<K> & { id: string })[];
  const index = items.findIndex((record) => record.id === item.id);
  const nextItems =
    index >= 0
      ? items.map((record) => (record.id === item.id ? item : record))
      : [item, ...items];

  appData = {
    ...appData,
    [key]: nextItems,
  };
  emit();
}

export function deleteRecord<K extends CollectionKey>(key: K, id: string) {
  const items = appData[key] as (CollectionItem<K> & { id: string })[];

  appData = {
    ...appData,
    [key]: items.filter((item) => item.id !== id),
  };
  emit();
}

const normalize = (value: string) => value.toLowerCase().trim();

const includesQuery = (query: string, values: string[]) =>
  values.some((value) => normalize(value).includes(query));

export function searchLiveKnowledgeBase(rawQuery: string, limit = 8) {
  const query = normalize(rawQuery);

  if (!query) {
    return [] as SearchResult[];
  }

  const data = getAppData();
  const results: SearchResult[] = [];

  data.handbookEntries.forEach((entry) => {
    if (
      includesQuery(query, [
        entry.chapter,
        entry.title,
        entry.content,
        ...entry.tags,
      ])
    ) {
      results.push({
        id: entry.id,
        type: "Handbook",
        title: entry.title,
        subtitle: entry.chapter,
        body: entry.content,
      });
    }
  });

  data.offices.forEach((office) => {
    if (
      includesQuery(query, [
        office.name,
        office.category,
        office.summary,
        office.location,
        office.contact,
        office.hours,
        ...office.services,
        ...office.tags,
      ])
    ) {
      results.push({
        id: office.id,
        type: "Office",
        title: office.name,
        subtitle: office.category,
        body: `${office.summary} Location: ${office.location}. Contact: ${office.contact}.`,
      });
    }
  });

  data.coursePrograms.forEach((program) => {
    if (
      includesQuery(query, [
        program.college,
        program.program,
        program.degree,
        program.overview,
        ...program.tags,
      ])
    ) {
      results.push({
        id: program.id,
        type: "Program",
        title: program.program,
        subtitle: program.college,
        body: program.overview,
      });
    }
  });

  data.campusLocations.forEach((location) => {
    if (
      includesQuery(query, [
        location.name,
        location.category,
        location.description,
        ...location.nearby,
        ...location.tags,
      ])
    ) {
      results.push({
        id: location.id,
        type: "Campus Map",
        title: location.name,
        subtitle: location.category,
        body: `${location.description} Nearby: ${location.nearby.join(", ")}.`,
      });
    }
  });

  data.academicEvents.forEach((event) => {
    if (
      includesQuery(query, [
        event.title,
        event.dateLabel,
        event.audience,
        event.details,
        event.type,
      ])
    ) {
      results.push({
        id: event.id,
        type: "Calendar",
        title: event.title,
        subtitle: event.dateLabel,
        body: event.details,
      });
    }
  });

  data.announcements.forEach((announcement) => {
    if (
      includesQuery(query, [
        announcement.title,
        announcement.body,
        announcement.audience,
        announcement.priority,
      ])
    ) {
      results.push({
        id: announcement.id,
        type: "Announcement",
        title: announcement.title,
        subtitle: announcement.dateLabel,
        body: announcement.body,
      });
    }
  });

  data.classSchedules.forEach((schedule) => {
    if (
      includesQuery(query, [
        schedule.courseCode,
        schedule.courseTitle,
        schedule.day,
        schedule.time,
        schedule.room,
        schedule.reminder,
      ])
    ) {
      results.push({
        id: schedule.id,
        type: "Class Schedule",
        title: `${schedule.courseCode} - ${schedule.courseTitle}`,
        subtitle: `${schedule.day}, ${schedule.time}`,
        body: `${schedule.room}. ${schedule.reminder}`,
      });
    }
  });

  return results.slice(0, limit);
}

export function getLiveAssistantAnswer(question: string) {
  const results = searchLiveKnowledgeBase(question, 4);

  if (results.length === 0) {
    return "I do not have an exact local record for that yet. Try searching for handbook, registrar, DSA, admissions, schedule, prospectus, or academic calendar.";
  }

  return `Here is what I found in the offline myMSU database:\n${results
    .map(
      (result, index) =>
        `${index + 1}. ${result.type}: ${result.title} - ${result.body}`,
    )
    .join("\n")}`;
}
