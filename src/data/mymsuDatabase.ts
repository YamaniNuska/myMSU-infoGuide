export const DATABASE_VERSION = "2026.05.06";

export type UserRole = "student" | "visitor" | "faculty" | "admin";

export type UserRecord = {
  id: string;
  name: string;
  role: UserRole;
  username: string;
  email: string;
  passwordHash?: string;
};

export type HandbookEntry = {
  id: string;
  chapter: string;
  title: string;
  content: string;
  tags: string[];
};

export type OfficeRecord = {
  id: string;
  name: string;
  category: string;
  summary: string;
  services: string[];
  location: string;
  contact: string;
  hours: string;
  tags: string[];
};

export type CampusLocation = {
  id: string;
  name: string;
  category: string;
  description: string;
  nearby: string[];
  tags: string[];
};

export type CourseProgram = {
  id: string;
  college: string;
  program: string;
  degree: string;
  overview: string;
  tags: string[];
};

export type ProspectusRecord = {
  id: string;
  programId: string;
  program: string;
  yearLevel: string;
  semester: string;
  subjects: string[];
};

export type AcademicEvent = {
  id: string;
  title: string;
  dateLabel: string;
  type: "enrollment" | "classes" | "event" | "deadline" | "exam";
  audience: string;
  details: string;
};

export type AnnouncementRecord = {
  id: string;
  title: string;
  body: string;
  dateLabel: string;
  priority: "high" | "normal" | "low";
  audience: string;
};

export type ClassScheduleRecord = {
  id: string;
  courseCode: string;
  courseTitle: string;
  day: string;
  time: string;
  room: string;
  reminder: string;
};

export type SearchResult = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  body: string;
};

export const users: UserRecord[] = [
  {
    id: "user-student-demo",
    name: "Student Demo",
    role: "student",
    username: "student",
    email: "student@msumain.edu.ph",
    passwordHash: "demo:student123",
  },
  {
    id: "user-visitor-demo",
    name: "Campus Visitor",
    role: "visitor",
    username: "visitor",
    email: "visitor@example.com",
  },
  {
    id: "user-admin-demo",
    name: "DSA Admin",
    role: "admin",
    username: "admin",
    email: "admin@msumain.edu.ph",
    passwordHash: "demo:admin123",
  },
];

export const handbookEntries: HandbookEntry[] = [
  {
    id: "preface",
    chapter: "Preface",
    title: "Student Handbook Purpose",
    content:
      "The MSU student handbook is a guide for students during their stay in MSU Main Campus, Marawi City. It gathers university information, policies, offices, services, and academic guidelines so students can stay informed and properly guided.",
    tags: ["handbook", "guide", "student services"],
  },
  {
    id: "university-mandate",
    chapter: "Chapter I: The University",
    title: "The University",
    content:
      "Mindanao State University serves the MINSUPALA region through instruction, research, extension, and public service. The university promotes access to education, peace, development, and responsible citizenship.",
    tags: ["university", "mission", "campus"],
  },
  {
    id: "dsa-functions",
    chapter: "Chapter II: Frontline Offices",
    title: "Division of Student Affairs",
    content:
      "The Division of Student Affairs provides communication channels between students and the university, receives suggestions and grievances, explains university policies, and helps resolve student concerns or refer them to proper offices.",
    tags: ["dsa", "student affairs", "complaints", "guidance"],
  },
  {
    id: "housing",
    chapter: "Chapter II: Frontline Offices",
    title: "Housing Management Division",
    content:
      "The Housing Management Division supervises student dormitories, residence halls, and university housing units according to approved policies. Students should coordinate with the office for dormitory availability, rules, and concerns.",
    tags: ["housing", "dormitory", "residence"],
  },
  {
    id: "dormitory-conduct",
    chapter: "Chapter III: Code of Discipline",
    title: "Dormitory Conduct",
    content:
      "Dormitory residents are expected to contribute to an atmosphere suitable for study. Quiet hours, proper use of equipment, respect for others, and prohibition of alcohol or disorderly conduct are part of dormitory discipline.",
    tags: ["discipline", "dormitory", "conduct"],
  },
  {
    id: "discipline-grounds",
    chapter: "Chapter III: Code of Discipline",
    title: "Grounds for Discipline",
    content:
      "Students may be disciplined only for cause and after due process. Examples of grounds include cheating, dishonesty, carrying prohibited weapons, bringing or drinking alcoholic beverages inside campus, and other serious violations.",
    tags: ["discipline", "due process", "policy"],
  },
  {
    id: "sanctions",
    chapter: "Chapter III: Code of Discipline",
    title: "Sanctions",
    content:
      "Disciplinary sanctions may include suspension, dismissal, or expulsion depending on the gravity of the offense and surrounding circumstances. Related privileges may also be affected during the period of sanction.",
    tags: ["sanctions", "discipline", "student rights"],
  },
  {
    id: "campus-journalism",
    chapter: "Appendix",
    title: "Campus Journalism",
    content:
      "Campus journalism supports freedom of expression, responsible student publication, ethical values, critical thinking, and student development within the university community.",
    tags: ["journalism", "student publication", "appendix"],
  },
];

export const offices: OfficeRecord[] = [
  {
    id: "registrar",
    name: "Office of the University Registrar",
    category: "Academic Records",
    summary:
      "Handles enrollment support, grades, scholastic records, academic credentials, clearances, graduation logistics, and academic calendar concerns.",
    services: [
      "Registration and enrollment support",
      "Transcript and academic records",
      "Certificates and clearances",
      "Graduation-related records",
    ],
    location:
      "Ahmad Domocao Alonto Sr. Hall, First Floor, 1st Street, MSU Main Campus",
    contact: "+63 912 239 1288, registrar@msumain.edu.ph",
    hours: "Monday to Friday, 8:00 AM to 5:00 PM",
    tags: ["registrar", "records", "enrollment", "grades"],
  },
  {
    id: "admissions",
    name: "Office of Admissions",
    category: "Admissions",
    summary:
      "Supports applicants and incoming students through admission procedures, examinations, and entry requirements.",
    services: [
      "Admission inquiries",
      "Scholarship examination support",
      "Application requirements",
      "New student guidance",
    ],
    location: "MSU Main Campus, Marawi City",
    contact: "Coordinate with the Office of Admissions for updated requirements",
    hours: "Monday to Friday, 8:00 AM to 5:00 PM",
    tags: ["admissions", "applicant", "freshmen", "requirements"],
  },
  {
    id: "dsa",
    name: "Division of Student Affairs",
    category: "Student Services",
    summary:
      "Assists students with guidance, student organizations, handbook concerns, good moral certificates, grievances, and special concerns.",
    services: [
      "Guidance and counseling",
      "Student organization accreditation",
      "Good moral character certificate",
      "Student concerns and grievance support",
    ],
    location: "Ground Floor, Domocao Alonto Hall, 1st Street, MSU Main Campus",
    contact: "+63 919 246 2209, dsa@msumain.edu.ph",
    hours: "Monday to Friday, 8:00 AM to 5:00 PM",
    tags: ["dsa", "student affairs", "good moral", "organizations"],
  },
  {
    id: "president",
    name: "Office of the President",
    category: "Administration",
    summary:
      "Provides leadership, planning, coordination, policy direction, and university system administration.",
    services: [
      "University leadership concerns",
      "Policy coordination",
      "Administrative referrals",
    ],
    location:
      "Sr. Domocao Alonto Building, New Administration Building, MSU Main Campus",
    contact: "op@msumain.edu.ph",
    hours: "Monday to Friday, 8:00 AM to 5:00 PM",
    tags: ["president", "administration", "policy"],
  },
  {
    id: "ovcaa",
    name: "Office of the Vice Chancellor for Academic Affairs",
    category: "Academic Affairs",
    summary:
      "Supports academic administration, college coordination, academic policies, and related student academic concerns.",
    services: [
      "Academic affairs support",
      "College coordination",
      "Academic policy guidance",
    ],
    location: "MSU Main Campus, Marawi City",
    contact: "ovcaa.info@msumain.edu.ph",
    hours: "Monday to Friday, 8:00 AM to 5:00 PM",
    tags: ["academic affairs", "ovcaa", "college"],
  },
  {
    id: "clinic",
    name: "University Clinic",
    category: "Health Services",
    summary:
      "Provides basic medical consultations, health records assistance, and referrals for enrolled students.",
    services: [
      "Basic consultation",
      "Medical record support",
      "Health referrals",
    ],
    location: "University Clinic, MSU Main Campus",
    contact: "Visit the clinic with a valid university ID",
    hours: "Office hours may vary during holidays and emergencies",
    tags: ["clinic", "health", "medical"],
  },
  {
    id: "ict",
    name: "ICT Office",
    category: "Technology Support",
    summary:
      "Supports campus portal, connectivity, technical assistance, and related digital services.",
    services: [
      "Portal assistance",
      "Connectivity support",
      "Technical troubleshooting",
    ],
    location: "ICT Office, MSU Main Campus",
    contact: "Visit the ICT Office for current support channels",
    hours: "Monday to Friday, 8:00 AM to 5:00 PM",
    tags: ["ict", "wifi", "portal", "technology"],
  },
];

export const campusLocations: CampusLocation[] = [
  {
    id: "alonto-hall",
    name: "Ahmad Domocao Alonto Sr. Hall",
    category: "Administration",
    description:
      "Administrative building associated with registrar and student transaction offices.",
    nearby: ["Registrar", "1st Street", "Main administration area"],
    tags: ["registrar", "admin", "records"],
  },
  {
    id: "dsa-hall",
    name: "Domocao Alonto Hall",
    category: "Student Services",
    description:
      "Student affairs area where learners can ask about handbook, good moral, organizations, and student concerns.",
    nearby: ["Division of Student Affairs", "1st Street"],
    tags: ["dsa", "student affairs", "good moral"],
  },
  {
    id: "cics",
    name: "College of Information and Computing Sciences",
    category: "College",
    description:
      "Academic college for computing and information technology programs.",
    nearby: ["Classrooms", "Faculty offices", "Student laboratories"],
    tags: ["cics", "computing", "information technology"],
  },
  {
    id: "clinic",
    name: "University Clinic",
    category: "Health",
    description:
      "Campus health facility for basic consultation and health-related support.",
    nearby: ["Student service areas"],
    tags: ["clinic", "health", "medical"],
  },
];

export const coursePrograms: CourseProgram[] = [
  {
    id: "bsit",
    college: "College of Information and Computing Sciences",
    program: "Bachelor of Science in Information Technology",
    degree: "BSIT",
    overview:
      "Focuses on software development, databases, networking, web technologies, and applied information systems.",
    tags: ["it", "software", "database", "web"],
  },
  {
    id: "bscs",
    college: "College of Information and Computing Sciences",
    program: "Bachelor of Science in Computer Science",
    degree: "BSCS",
    overview:
      "Focuses on computing theory, programming, algorithms, data structures, and software systems.",
    tags: ["computer science", "programming", "algorithms"],
  },
  {
    id: "bsis",
    college: "College of Information and Computing Sciences",
    program: "Bachelor of Science in Information Systems",
    degree: "BSIS",
    overview:
      "Focuses on information systems, business processes, systems analysis, and organizational technology solutions.",
    tags: ["information systems", "business", "analysis"],
  },
  {
    id: "engineering",
    college: "College of Engineering",
    program: "Engineering Programs",
    degree: "Engineering",
    overview:
      "Program group for students pursuing engineering fields. Students should check the college for the active curriculum and specialization list.",
    tags: ["engineering", "college", "curriculum"],
  },
  {
    id: "education",
    college: "College of Education",
    program: "Education Programs",
    degree: "Education",
    overview:
      "Program group for students preparing for teaching, education leadership, and learner support fields.",
    tags: ["education", "teaching", "college"],
  },
  {
    id: "business",
    college: "College of Business Administration and Accountancy",
    program: "Business and Accountancy Programs",
    degree: "Business",
    overview:
      "Program group for students pursuing management, accountancy, entrepreneurship, and related business fields.",
    tags: ["business", "accountancy", "management"],
  },
];

export const prospectusRecords: ProspectusRecord[] = [
  {
    id: "bsit-y1-s1",
    programId: "bsit",
    program: "BS Information Technology",
    yearLevel: "First Year",
    semester: "First Semester",
    subjects: [
      "Introduction to Computing",
      "Computer Programming 1",
      "Mathematics in the Modern World",
      "Purposive Communication",
      "Physical Education 1",
    ],
  },
  {
    id: "bsit-y1-s2",
    programId: "bsit",
    program: "BS Information Technology",
    yearLevel: "First Year",
    semester: "Second Semester",
    subjects: [
      "Computer Programming 2",
      "Discrete Structures",
      "Data Communications",
      "Readings in Philippine History",
      "Physical Education 2",
    ],
  },
  {
    id: "bsit-y2-s1",
    programId: "bsit",
    program: "BS Information Technology",
    yearLevel: "Second Year",
    semester: "First Semester",
    subjects: [
      "Data Structures and Algorithms",
      "Database Management Systems",
      "Web Systems and Technologies",
      "Human Computer Interaction",
      "Ethics",
    ],
  },
  {
    id: "bscs-y1-s1",
    programId: "bscs",
    program: "BS Computer Science",
    yearLevel: "First Year",
    semester: "First Semester",
    subjects: [
      "Introduction to Computing",
      "Computer Programming 1",
      "Calculus 1",
      "Purposive Communication",
      "Physical Education 1",
    ],
  },
  {
    id: "bsis-y1-s1",
    programId: "bsis",
    program: "BS Information Systems",
    yearLevel: "First Year",
    semester: "First Semester",
    subjects: [
      "Introduction to Information Systems",
      "Computer Programming 1",
      "Organization and Management Concepts",
      "Mathematics in the Modern World",
      "Physical Education 1",
    ],
  },
];

export const academicEvents: AcademicEvent[] = [
  {
    id: "enrollment",
    title: "Enrollment Period",
    dateLabel: "Before each semester",
    type: "enrollment",
    audience: "Students",
    details:
      "Check your college and the Registrar for current enrollment steps, requirements, and clearance concerns.",
  },
  {
    id: "classes-start",
    title: "Start of Classes",
    dateLabel: "Posted by the university",
    type: "classes",
    audience: "Students and faculty",
    details:
      "Class schedules and room assignments should be verified with your department or college before the first week.",
  },
  {
    id: "foundation",
    title: "University Foundation Day",
    dateLabel: "Annual university event",
    type: "event",
    audience: "MSU community",
    details:
      "Campus-wide activities may affect office traffic, class meetings, and student organization schedules.",
  },
  {
    id: "midterm",
    title: "Midterm Examination Window",
    dateLabel: "Mid-semester",
    type: "exam",
    audience: "Students",
    details:
      "Confirm examination schedules with instructors and watch for official college announcements.",
  },
  {
    id: "clearance",
    title: "Clearance and Records Processing",
    dateLabel: "End of semester",
    type: "deadline",
    audience: "Students",
    details:
      "Prepare college, library, dormitory, and administrative clearances early to avoid processing delays.",
  },
];

export const announcements: AnnouncementRecord[] = [
  {
    id: "handbook-digital",
    title: "Digital Handbook Available",
    body:
      "Students, visitors, faculty, and staff can browse handbook topics, policies, offices, and guide information in myMSU-InfoGuide.",
    dateLabel: "Today",
    priority: "high",
    audience: "All users",
  },
  {
    id: "dsa-support",
    title: "Student Concerns and DSA Support",
    body:
      "For good moral certificate, student organizations, dormitory concerns, and handbook clarification, coordinate with the Division of Student Affairs.",
    dateLabel: "This week",
    priority: "normal",
    audience: "Students",
  },
  {
    id: "schedule-reminder",
    title: "Keep Your Class Schedule Updated",
    body:
      "Add your class time, room, and reminder notes in the Class Schedule screen so your guide stays organized.",
    dateLabel: "Reminder",
    priority: "normal",
    audience: "Students",
  },
];

export const classSchedules: ClassScheduleRecord[] = [
  {
    id: "sample-ite-101",
    courseCode: "ITE 101",
    courseTitle: "Introduction to Computing",
    day: "Monday and Wednesday",
    time: "8:00 AM - 9:30 AM",
    room: "CICS Room 101",
    reminder: "Arrive 10 minutes early during the first week.",
  },
  {
    id: "sample-ge-1",
    courseCode: "GE 1",
    courseTitle: "Purposive Communication",
    day: "Tuesday and Thursday",
    time: "10:00 AM - 11:30 AM",
    room: "Assigned classroom",
    reminder: "Check the department board for room updates.",
  },
];

export const databaseTables = [
  "users",
  "handbook_entries",
  "administrative_offices",
  "campus_locations",
  "class_schedules",
  "notifications",
  "course_offerings",
  "prospectus_records",
  "academic_calendar",
] as const;

export const mymsuDatabase = {
  version: DATABASE_VERSION,
  users,
  handbookEntries,
  offices,
  campusLocations,
  coursePrograms,
  prospectusRecords,
  academicEvents,
  announcements,
  classSchedules,
  databaseTables,
};

const normalize = (value: string) => value.toLowerCase().trim();

const includesQuery = (query: string, values: string[]) =>
  values.some((value) => normalize(value).includes(query));

export function searchKnowledgeBase(rawQuery: string, limit = 8) {
  const query = normalize(rawQuery);

  if (!query) {
    return [] as SearchResult[];
  }

  const results: SearchResult[] = [];

  handbookEntries.forEach((entry) => {
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

  offices.forEach((office) => {
    if (
      includesQuery(query, [
        office.name,
        office.category,
        office.summary,
        office.location,
        office.contact,
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

  coursePrograms.forEach((program) => {
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

  academicEvents.forEach((event) => {
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

  announcements.forEach((announcement) => {
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
        type: "Notification",
        title: announcement.title,
        subtitle: announcement.dateLabel,
        body: announcement.body,
      });
    }
  });

  return results.slice(0, limit);
}

export function getLocalAssistantAnswer(question: string) {
  const results = searchKnowledgeBase(question, 4);

  if (results.length === 0) {
    return "I do not have an exact local record for that yet. Try searching for handbook, registrar, DSA, admissions, schedule, prospectus, or academic calendar.";
  }

  const lines = results.map(
    (result, index) =>
      `${index + 1}. ${result.type}: ${result.title} - ${result.body}`,
  );

  return `Here is what I found in the offline myMSU database:\n${lines.join(
    "\n",
  )}`;
}
