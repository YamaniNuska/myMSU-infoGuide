import type { CourseProgram, ProspectusRecord } from "./mymsuDatabase";

export const prospectusTermOrder: Record<string, number> = {
  "First Year|First Semester": 1,
  "First Year|Second Semester": 2,
  "First Year|Summer": 3,
  "Second Year|First Semester": 4,
  "Second Year|Second Semester": 5,
  "Second Year|Summer": 6,
  "Third Year|First Semester": 7,
  "Third Year|Second Semester": 8,
  "Third Year|Summer": 9,
  "Fourth Year|First Semester": 10,
  "Fourth Year|Second Semester": 11,
  "Fourth Year|Summer": 12,
};

export const prospectusInfoYearLevel = "Program Info";
export const prospectusInfoSemester = "Summary";

export type ParsedProspectusSubject = {
  raw: string;
  code: string;
  title: string;
  units: string;
  unitValue: number;
  lec: string;
  lab: string;
  prereq: string;
  coreq: string;
  importance: string;
};

const getSubjectValue = (parts: string[], label: string) =>
  parts
    .find((part) => part.toLowerCase().startsWith(`${label.toLowerCase()}:`))
    ?.split(":")
    .slice(1)
    .join(":")
    .trim() ?? "";

export const parseProspectusSubject = (
  subject: string,
): ParsedProspectusSubject => {
  const parts = subject.split("|").map((part) => part.trim());
  const units = getSubjectValue(parts, "Units");
  const unitValue = Number(units.replace(/[()]/g, "")) || 0;

  return {
    raw: subject,
    code: parts[0] ?? "",
    title: parts[1] ?? subject,
    units,
    unitValue,
    lec: getSubjectValue(parts, "Lec") || "0",
    lab: getSubjectValue(parts, "Lab") || "0",
    prereq: getSubjectValue(parts, "Prereq") || "None",
    coreq: getSubjectValue(parts, "Coreq") || "None",
    importance: getSubjectValue(parts, "Importance") || "standard",
  };
};

export const sortProspectusRecords = (records: ProspectusRecord[]) =>
  [...records].sort(
    (left, right) =>
      (prospectusTermOrder[`${left.yearLevel}|${left.semester}`] ?? 99) -
      (prospectusTermOrder[`${right.yearLevel}|${right.semester}`] ?? 99),
  );

export const isProspectusTermRecord = (record: ProspectusRecord) =>
  record.subjects.length > 0 &&
  record.yearLevel !== prospectusInfoYearLevel &&
  record.semester !== prospectusInfoSemester;

export const buildProspectusInfoRecordId = (programId: string) =>
  `${programId}-info`;

export const getProgramProspectusRecords = (
  programId: string,
  records: ProspectusRecord[],
) =>
  sortProspectusRecords(
    records.filter(
      (record) => record.programId === programId && isProspectusTermRecord(record),
    ),
  );

export const getProgramProspectusStats = (
  programId: string,
  records: ProspectusRecord[],
) => {
  const programRecords = getProgramProspectusRecords(programId, records);
  const subjectCount = programRecords.reduce(
    (total, record) => total + record.subjects.length,
    0,
  );
  const totalUnits = programRecords.reduce(
    (total, record) =>
      total +
      record.subjects.reduce(
        (recordTotal, subject) =>
          recordTotal + parseProspectusSubject(subject).unitValue,
        0,
      ),
    0,
  );

  return {
    recordCount: programRecords.length,
    subjectCount,
    totalUnits,
    terms: programRecords.map((record) => ({
      id: record.id,
      label: `${record.yearLevel} - ${record.semester}`,
      yearLevel: record.yearLevel,
      semester: record.semester,
      subjectCount: record.subjects.length,
    })),
  };
};

export const buildProspectusRecordId = (
  programId: string,
  yearLevel: string,
  semester: string,
) => {
  const yearToken = yearLevel
    .toLowerCase()
    .replace(" year", "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 2);
  const semesterToken = semester
    .toLowerCase()
    .replace(" semester", "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 2);

  return `${programId}-${yearToken}-${semesterToken}`;
};

export const syncProspectusPrograms = (
  programs: CourseProgram[],
  records: ProspectusRecord[],
) => {
  const programMap = new Map(programs.map((program) => [program.id, program]));

  return records.map((record) => {
    const program = programMap.get(record.programId);

    if (!program || record.program === program.program) {
      return record;
    }

    return {
      ...record,
      program: program.program,
    };
  });
};
