export const DATABASE_VERSION = "2026.05.11.1";

export type UserRole = "student" | "visitor" | "faculty" | "employee" | "admin";

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
  mapX: number;
  mapY: number;
  latitude?: number;
  longitude?: number;
  street?: string;
  nearby: string[];
  tags: string[];
  image?: string;
};

export type RoadNode = {
  id: string;
  mapX: number;
  mapY: number;
};

export const roadNodes: RoadNode[] = [
  { id: "upper-west-gate", mapX: 38.6, mapY: 0.2 },
  { id: "upper-garcia-top", mapX: 38.8, mapY: 9.2 },
  { id: "alonto-west", mapX: 42.8, mapY: 18.8 },
  { id: "alonto-library", mapX: 52.6, mapY: 26.3 },
  { id: "alonto-marawi", mapX: 66.2, mapY: 29.5 },
  { id: "alonto-east", mapX: 78.1, mapY: 31.4 },
  { id: "main-entrance", mapX: 80.6, mapY: 34.8 },
  { id: "amai-north-east", mapX: 88.8, mapY: 19.6 },
  { id: "amai-entrance", mapX: 82.7, mapY: 31.9 },
  { id: "amai-mid", mapX: 75.0, mapY: 48.5 },
  { id: "amai-route-77", mapX: 77.6, mapY: 83.0 },
  { id: "marawi-north", mapX: 65.0, mapY: 12.4 },
  { id: "marawi-alonto", mapX: 65.1, mapY: 29.0 },
  { id: "marawi-mid", mapX: 67.4, mapY: 49.8 },
  { id: "marawi-south", mapX: 66.1, mapY: 65.2 },
  { id: "resort-west", mapX: 58.4, mapY: 64.2 },
  { id: "first-top", mapX: 43.7, mapY: 20.6 },
  { id: "first-admin", mapX: 42.6, mapY: 31.2 },
  { id: "first-library", mapX: 42.3, mapY: 39.8 },
  { id: "first-cnsm", mapX: 41.9, mapY: 48.4 },
  { id: "first-cssh", mapX: 43.0, mapY: 57.0 },
  { id: "first-residence", mapX: 46.2, mapY: 63.5 },
  { id: "cnsm-east", mapX: 50.0, mapY: 49.0 },
  { id: "cssh-east", mapX: 53.0, mapY: 58.2 },
  { id: "south-core", mapX: 57.5, mapY: 63.5 },
  { id: "dorm-east", mapX: 55.2, mapY: 69.0 },
  { id: "dorm-rdh", mapX: 52.8, mapY: 72.6 },
  { id: "dorm-sngd", mapX: 46.3, mapY: 72.7 },
  { id: "dorm-snbd", mapX: 47.0, mapY: 68.0 },
  { id: "lower-core", mapX: 42.0, mapY: 70.2 },
  { id: "lower-west", mapX: 35.6, mapY: 74.2 },
  { id: "lower-south", mapX: 34.0, mapY: 86.4 },
  { id: "agriculture", mapX: 38.5, mapY: 93.0 },
  { id: "business", mapX: 36.6, mapY: 84.8 },
  { id: "education", mapX: 42.7, mapY: 83.6 },
  { id: "law", mapX: 41.3, mapY: 89.0 },
  { id: "engineering", mapX: 49.0, mapY: 86.2 },
  { id: "gym-west", mapX: 26.8, mapY: 75.6 },
  { id: "gym", mapX: 29.8, mapY: 74.8 },
  { id: "spear", mapX: 27.8, mapY: 72.3 },
  { id: "fourth-top", mapX: 27.1, mapY: 32.0 },
  { id: "fourth-plh", mapX: 27.0, mapY: 43.8 },
  { id: "fourth-oval", mapX: 27.4, mapY: 61.8 },
  { id: "fourth-gym", mapX: 27.2, mapY: 72.5 },
  { id: "third-north", mapX: 31.0, mapY: 9.8 },
  { id: "third-infirmary", mapX: 31.8, mapY: 15.0 },
  { id: "third-cics", mapX: 32.0, mapY: 24.2 },
  { id: "third-icc", mapX: 32.0, mapY: 31.8 },
  { id: "third-plh", mapX: 32.0, mapY: 43.8 },
  { id: "third-oval", mapX: 32.2, mapY: 58.5 },
  { id: "garcia-north", mapX: 37.2, mapY: 9.4 },
  { id: "garcia-ri", mapX: 36.4, mapY: 16.6 },
  { id: "garcia-cics", mapX: 36.0, mapY: 23.0 },
  { id: "garcia-admin", mapX: 35.4, mapY: 31.2 },
  { id: "garcia-plh", mapX: 35.2, mapY: 43.8 },
  { id: "campus-west-mid", mapX: 27.2, mapY: 47.0 },
  { id: "west-town-mid", mapX: 22.0, mapY: 47.5 },
  { id: "west-town-south", mapX: 23.2, mapY: 63.8 },
  { id: "west-town-lower", mapX: 27.0, mapY: 66.6 },
  { id: "chtm", mapX: 49.2, mapY: 16.6 },
  { id: "pavilion", mapX: 39.0, mapY: 3.8 },
  { id: "infirmary", mapX: 35.4, mapY: 12.3 },
  { id: "cics", mapX: 36.8, mapY: 22.7 },
  { id: "icc", mapX: 34.6, mapY: 30.0 },
  { id: "admin", mapX: 39.8, mapY: 31.0 },
  { id: "dsa", mapX: 38.6, mapY: 31.5 },
  { id: "plh", mapX: 34.6, mapY: 41.5 },
  { id: "library", mapX: 45.9, mapY: 34.3 },
  { id: "ictc", mapX: 43.5, mapY: 42.0 },
  { id: "aga-khan", mapX: 47.4, mapY: 41.8 },
  { id: "cnsm", mapX: 47.8, mapY: 45.2 },
  { id: "cssh", mapX: 51.4, mapY: 53.7 },
  { id: "public-affairs", mapX: 42.6, mapY: 68.0 },
  { id: "fisheries", mapX: 57.4, mapY: 12.5 },
  { id: "forestry", mapX: 62.2, mapY: 23.0 },
  { id: "kfcaas", mapX: 75.5, mapY: 24.2 },
  { id: "chs", mapX: 86.5, mapY: 24.8 },
  { id: "upper-fisheries-road", mapX: 53.8, mapY: 18.6 },
  { id: "upper-forestry-road", mapX: 61.0, mapY: 20.2 },
  { id: "upper-kfcaas-road", mapX: 77.0, mapY: 26.4 },
  { id: "chs-road", mapX: 83.3, mapY: 31.0 },
  { id: "business-road", mapX: 36.2, mapY: 82.0 },
  { id: "education-road", mapX: 43.2, mapY: 80.0 },
  { id: "engineering-road", mapX: 49.4, mapY: 80.5 },
  { id: "law-road", mapX: 40.0, mapY: 87.4 },
  { id: "agriculture-road", mapX: 36.1, mapY: 89.8 },
  { id: "college-loop-east", mapX: 49.8, mapY: 76.4 },
  { id: "dorm-south-link", mapX: 52.4, mapY: 74.0 },
];

export const roadEdges: [string, string][] = [
  ["upper-west-gate", "upper-garcia-top"],
  ["upper-garcia-top", "pavilion"],
  ["pavilion", "alonto-west"],
  ["alonto-west", "alonto-library"],
  ["alonto-library", "alonto-marawi"],
  ["alonto-marawi", "alonto-east"],
  ["alonto-east", "main-entrance"],
  ["marawi-north", "marawi-alonto"],
  ["marawi-alonto", "marawi-mid"],
  ["marawi-mid", "marawi-south"],
  ["marawi-alonto", "alonto-marawi"],
  ["marawi-south", "resort-west"],
  ["resort-west", "south-core"],
  ["main-entrance", "amai-entrance"],
  ["amai-north-east", "amai-entrance"],
  ["amai-entrance", "amai-mid"],
  ["amai-mid", "amai-route-77"],
  ["first-top", "first-admin"],
  ["first-admin", "first-library"],
  ["first-library", "first-cnsm"],
  ["first-cnsm", "first-cssh"],
  ["first-cssh", "first-residence"],
  ["first-top", "alonto-west"],
  ["first-admin", "admin"],
  ["first-admin", "library"],
  ["first-library", "ictc"],
  ["first-cnsm", "cnsm"],
  ["first-cnsm", "cnsm-east"],
  ["cnsm-east", "cssh-east"],
  ["cssh-east", "cssh"],
  ["cssh-east", "south-core"],
  ["first-residence", "south-core"],
  ["first-residence", "public-affairs"],
  ["south-core", "dorm-east"],
  ["dorm-east", "dorm-rdh"],
  ["dorm-east", "dorm-snbd"],
  ["dorm-rdh", "dorm-sngd"],
  ["dorm-snbd", "dorm-sngd"],
  ["dorm-sngd", "lower-core"],
  ["lower-core", "lower-west"],
  ["lower-west", "lower-south"],
  ["lower-south", "business-road"],
  ["business-road", "business"],
  ["business-road", "agriculture-road"],
  ["agriculture-road", "agriculture"],
  ["business-road", "law-road"],
  ["law-road", "law"],
  ["business-road", "education-road"],
  ["education-road", "education"],
  ["education-road", "engineering-road"],
  ["engineering-road", "engineering"],
  ["engineering-road", "college-loop-east"],
  ["college-loop-east", "dorm-south-link"],
  ["dorm-south-link", "dorm-rdh"],
  ["lower-west", "gym"],
  ["gym-west", "gym"],
  ["gym", "spear"],
  ["spear", "fourth-gym"],
  ["fourth-top", "fourth-plh"],
  ["fourth-plh", "campus-west-mid"],
  ["campus-west-mid", "fourth-oval"],
  ["fourth-oval", "fourth-gym"],
  ["third-north", "third-infirmary"],
  ["third-infirmary", "third-cics"],
  ["third-cics", "third-icc"],
  ["third-icc", "third-plh"],
  ["third-plh", "third-oval"],
  ["third-oval", "fourth-oval"],
  ["third-infirmary", "infirmary"],
  ["third-cics", "cics"],
  ["third-icc", "icc"],
  ["third-plh", "plh"],
  ["third-north", "upper-garcia-top"],
  ["third-cics", "first-top"],
  ["garcia-north", "garcia-ri"],
  ["garcia-ri", "garcia-cics"],
  ["garcia-cics", "garcia-admin"],
  ["garcia-admin", "garcia-plh"],
  ["garcia-north", "upper-garcia-top"],
  ["garcia-ri", "chtm"],
  ["garcia-cics", "cics"],
  ["garcia-admin", "admin"],
  ["garcia-plh", "plh"],
  ["garcia-plh", "first-cnsm"],
  ["campus-west-mid", "west-town-mid"],
  ["west-town-mid", "west-town-south"],
  ["west-town-south", "west-town-lower"],
  ["west-town-lower", "fourth-gym"],
  ["chtm", "alonto-west"],
  ["chtm", "upper-fisheries-road"],
  ["alonto-library", "upper-fisheries-road"],
  ["upper-fisheries-road", "fisheries"],
  ["upper-fisheries-road", "upper-forestry-road"],
  ["upper-forestry-road", "forestry"],
  ["upper-forestry-road", "alonto-marawi"],
  ["alonto-east", "upper-kfcaas-road"],
  ["upper-kfcaas-road", "kfcaas"],
  ["amai-entrance", "chs-road"],
  ["chs-road", "chs"],
  ["dsa", "admin"],
  ["library", "aga-khan"],
  ["aga-khan", "cnsm"],
];

export const locationRoadAnchors: Record<string, string> = {
  "college-agriculture": "agriculture-road",
  "college-business": "business-road",
  "college-education": "education-road",
  "college-engineering": "engineering-road",
  "college-fisheries": "upper-fisheries-road",
  "college-forestry": "upper-forestry-road",
  "college-hospitality-tourism": "chtm",
  "college-cics": "garcia-cics",
  "college-law": "law-road",
  "college-medicine": "chs-road",
  "college-cnsm": "first-cnsm",
  "college-public-affairs": "lower-core",
  "college-social-sciences-humanities": "cssh-east",
  "college-spear": "spear",
  "college-king-faisal": "upper-kfcaas-road",
  "research-institute": "garcia-ri",
  "international-convention-center": "icc",
  "ict-office": "ictc",
  plh: "plh",
  "super-new-boys-dormitory": "dorm-snbd",
  "super-new-girls-dormitory": "dorm-sngd",
  "rajah-dumdumla-hall": "dorm-rdh",
  "rajah-dumdumla-hall-ii": "dorm-rdh",
  "rsd-male-dormitory": "dorm-east",
  infirmary: "infirmary",
  "main-entrance": "main-entrance",
  "alonto-hall": "admin",
  "administration-building": "garcia-admin",
  "university-library": "first-library",
  "aga-khan-museum": "first-cnsm",
  "dimaporo-gym": "gym",
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
    email: "visitor@gmail.com",
    passwordHash: "demo:visitor123",
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
    id: "infirmary",
    name: "University Infirmary",
    category: "Health Services",
    summary:
      "Provides basic medical consultations, health records assistance, and referrals for enrolled students.",
    services: [
      "Basic consultation",
      "Medical record support",
      "Health referrals",
    ],
    location: "University Infirmary, MSU Main Campus",
    contact: "Visit the infirmary with a valid university ID",
    hours: "Office hours may vary during holidays and emergencies",
    tags: ["infirmary", "health", "medical"],
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
    id: "college-agriculture",
    name: "College of Agriculture",
    category: "College",
    description:
      "Academic area for agriculture programs, farm-based learning, research, and extension activities on the lower First Street academic row.",
    mapX: 38.2,
    mapY: 94,
    latitude: 7.99335,
    longitude: 124.26125,
    street: "1st Street",
    nearby: [
      "College of Engineering",
      "Lower academic row",
      "Plant Science",
      "Animal Science",
    ],
    tags: ["coa", "agriculture", "college", "1st street"],
  },
  {
    id: "college-business",
    name: "College of Business Administration and Accountancy",
    category: "College",
    description:
      "Home of business, management, entrepreneurship, and accountancy programs.",
    mapX: 36.6,
    mapY: 84.8,
    latitude: 7.9938703,
    longitude: 124.2581029,
    street: "1st Street",
    nearby: ["College of Law", "College of Education", "Lower academic row"],
    tags: ["cbaa", "business", "accountancy", "college"],
    image:
      "https://www.msumain.edu.ph/wp-content/uploads/2024/06/CBAA-Ad-Photo-2-700x450.jpg",
  },
  {
    id: "college-education",
    name: "College of Education",
    category: "College",
    description:
      "Teacher education college connected with basic education, laboratory school, and professional preparation.",
    mapX: 42.7,
    mapY: 83.6,
    latitude: 7.9937856,
    longitude: 124.2596358,
    street: "1st Street",
    nearby: ["College of Law", "College of Engineering", "Lower academic row"],
    tags: ["ced", "education", "teacher education", "college"],
    image: "https://www.msumain.edu.ph/wp-content/uploads/2023/03/IMG_7152-700x450.jpg",
  },
  {
    id: "college-engineering",
    name: "College of Engineering",
    category: "College",
    description:
      "Engineering academic cluster for technical programs, laboratories, and department offices.",
    mapX: 49,
    mapY: 86.2,
    latitude: 7.9935034,
    longitude: 124.2602946,
    street: "1st Street",
    nearby: ["College of Education", "College of Agriculture", "Lower academic row"],
    tags: ["coe", "engineering", "college"],
  },
  {
    id: "college-fisheries",
    name: "College of Fisheries and Aquatic Sciences",
    category: "College",
    description:
      "Academic unit focused on fisheries, aquatic sciences, and Lake Lanao-related research and extension.",
    mapX: 57.4,
    mapY: 12.5,
    latitude: 8.0007676,
    longitude: 124.261937,
    street: "Upper campus route",
    nearby: ["College of Forestry", "CHTM", "King Faisal Center"],
    tags: ["cfas", "fisheries", "aquatic sciences", "college"],
    image:
      "https://www.msumain.edu.ph/wp-content/uploads/2024/06/CFAS-header-photo-1-700x450.png",
  },
  {
    id: "college-forestry",
    name: "College of Forestry and Environmental Studies",
    category: "College",
    description:
      "Forestry and environmental studies area for natural resource, environmental, and graduate programs.",
    mapX: 62.2,
    mapY: 23,
    latitude: 7.9998425,
    longitude: 124.26249,
    street: "Upper campus route",
    nearby: ["College of Fisheries", "CHTM", "King Faisal Center"],
    tags: ["cfes", "forestry", "environment", "college"],
    image: "https://www.msumain.edu.ph/wp-content/uploads/2023/04/bsf2.png",
  },
  {
    id: "college-hospitality-tourism",
    name: "College of Hospitality and Tourism Management",
    category: "College",
    description:
      "College for hospitality and tourism management learning near the upper campus cluster.",
    mapX: 49.3,
    mapY: 14,
    latitude: 8.0007177,
    longitude: 124.2606033,
    street: "Upper campus route",
    nearby: ["College of Fisheries", "College of Forestry", "MSU Pavilion"],
    tags: ["chtm", "hospitality", "tourism", "college"],
  },
  {
    id: "college-cics",
    name: "College of Information and Computing Sciences",
    category: "College",
    description:
      "Academic college for computing and information technology programs.",
    mapX: 36.8,
    mapY: 22.7,
    latitude: 7.9997985,
    longitude: 124.257926,
    street: "2nd Street",
    nearby: ["Research Institute", "International Convention Center", "PLH"],
    tags: ["cics", "computing", "information technology", "college"],
    image:
      "https://www.msumain.edu.ph/wp-content/uploads/2023/03/MSU-Web-CICS-Banner-1-700x450.jpg",
  },
  {
    id: "college-law",
    name: "College of Law",
    category: "College",
    description:
      "Academic unit for legal education, law programs, and legal aid-related learning.",
    mapX: 41.3,
    mapY: 89,
    latitude: 7.9930974,
    longitude: 124.259018,
    street: "1st Street",
    nearby: ["CBAA", "College of Education", "Lower academic row"],
    tags: ["law", "college of law", "college"],
  },
  {
    id: "college-medicine",
    name: "College of Health Sciences",
    category: "College",
    description:
      "Health sciences academic area below King Faisal Center, near the main entrance and nursing area.",
    mapX: 86.5,
    mapY: 24.8,
    latitude: 7.9996,
    longitude: 124.2673,
    street: "Main Entrance Road",
    nearby: [
      "Main Entrance",
      "Nursing area",
      "King Faisal Center",
      "College of Forestry",
      "College of Fisheries",
    ],
    tags: ["chs", "nursing", "health sciences", "medicine", "health", "college"],
    image: "https://www.msumain.edu.ph/wp-content/uploads/2024/10/20240815_170746-1024x536.jpg",
  },
  {
    id: "college-cnsm",
    name: "College of Natural Sciences and Mathematics",
    category: "College",
    description:
      "Science and mathematics academic cluster for instruction, research, and laboratory learning.",
    mapX: 47.8,
    mapY: 45.2,
    latitude: 7.9965725,
    longitude: 124.2603837,
    street: "1st Street",
    nearby: ["MSU-Main Library", "CSSH", "ICTC"],
    tags: ["cnsm", "science", "mathematics", "college"],
  },
  {
    id: "college-public-affairs",
    name: "College of Public Affairs",
    category: "College",
    description:
      "Academic unit for public affairs, governance, community development, and social welfare-oriented programs.",
    mapX: 42.6,
    mapY: 68,
    latitude: 7.9951878,
    longitude: 124.2591209,
    street: "1st Street",
    nearby: ["CNSM", "CSSH", "CBAA"],
    tags: ["cpa", "public affairs", "governance", "college"],
  },
  {
    id: "college-social-sciences-humanities",
    name: "College of Social Sciences and Humanities",
    category: "College",
    description:
      "Academic college for humanities, communication, history, sociology, anthropology, and related programs.",
    mapX: 51.4,
    mapY: 53.7,
    latitude: 7.9972432,
    longitude: 124.2598771,
    street: "1st Street",
    nearby: ["CNSM", "College of Public Affairs", "MSU Oval"],
    tags: ["cssh", "social sciences", "humanities", "college"],
  },
  {
    id: "college-spear",
    name: "College of Sports, Physical Education and Recreation",
    category: "College",
    description:
      "Sports, physical education, recreation, fitness, coaching, and dance academic area around the MSU Grandstand west of Dimaporo Gymnasium.",
    mapX: 27.8,
    mapY: 72.3,
    latitude: 7.9946388,
    longitude: 124.2568347,
    street: "4th Street",
    nearby: ["MSU Grandstand", "Dimaporo Gymnasium", "Sports grounds"],
    tags: ["cspear", "spear", "grandstand", "sports", "college"],
  },
  {
    id: "college-king-faisal",
    name: "King Faisal Center for Islamic, Arabic and Asian Studies",
    category: "College",
    description:
      "Academic center for Islamic, Arabic, and Asian studies and related departments.",
    mapX: 75.5,
    mapY: 24.2,
    latitude: 7.9996941,
    longitude: 124.2655957,
    street: "Upper campus route",
    nearby: ["College of Health Sciences", "College of Forestry", "College of Fisheries"],
    tags: [
      "kfciaas",
      "kfcaas",
      "king faisal",
      "islamic studies",
      "arabic",
      "asian studies",
      "college",
    ],
  },
  {
    id: "research-institute",
    name: "RI Female Dormitory",
    category: "Dormitory",
    description:
      "Female student dormitory commonly marked as RI on the campus map.",
    mapX: 37.8,
    mapY: 17.4,
    latitude: 7.99955,
    longitude: 124.25855,
    street: "2nd Street",
    nearby: ["University Infirmary", "CICS", "3rd Street"],
    tags: ["ri", "female dormitory", "women dormitory", "residence"],
  },
  {
    id: "international-convention-center",
    name: "International Convention Center",
    category: "Landmark",
    description:
      "Campus venue commonly referred to as ICC, used for conventions, assemblies, seminars, and large university gatherings.",
    mapX: 34.6,
    mapY: 30,
    latitude: 7.99935,
    longitude: 124.25825,
    street: "2nd Street",
    nearby: ["CICS", "Research Institute", "PLH"],
    tags: ["icc", "international convention center", "convention", "events"],
  },
  {
    id: "plh",
    name: "Princess Lawansa Hall",
    category: "Dormitory",
    description:
      "Female student dormitory commonly referenced as PLH, located near the Second Street academic support cluster.",
    mapX: 34.6,
    mapY: 41.5,
    latitude: 7.9976973,
    longitude: 124.2575373,
    street: "2nd Street",
    nearby: ["CICS", "International Convention Center", "2nd Street"],
    tags: [
      "plh",
      "princess lawansa hall",
      "princess lawanen hall",
      "female dormitory",
      "residence",
    ],
  },
  {
    id: "super-new-boys-dormitory",
    name: "Super New Boys Dormitory",
    category: "Dormitory",
    description:
      "Male student dormitory marked as SNBD on the residence area of the campus map.",
    mapX: 47.1,
    mapY: 67.4,
    latitude: 7.99528,
    longitude: 124.25992,
    street: "Residence Hall Road",
    nearby: ["SNGD", "RDH", "MSU Oval"],
    tags: ["snbd", "super new boys dormitory", "boys dormitory", "residence"],
  },
  {
    id: "super-new-girls-dormitory",
    name: "Super New Girls Dormitory",
    category: "Dormitory",
    description:
      "Female student dormitory marked as SNGD near the lower residence hall cluster.",
    mapX: 46.8,
    mapY: 72.4,
    latitude: 7.9949,
    longitude: 124.25985,
    street: "Residence Hall Road",
    nearby: ["SNBD", "RDH", "RSD"],
    tags: ["sngd", "super new girls dormitory", "girls dormitory", "residence"],
  },
  {
    id: "rajah-dumdumla-hall",
    name: "Rajah Dumdumla Hall",
    category: "Dormitory",
    description:
      "Male student dormitory marked as RDH in the residence hall area.",
    mapX: 51.2,
    mapY: 74.8,
    latitude: 7.99475,
    longitude: 124.26055,
    street: "Residence Hall Road",
    nearby: ["SNGD", "SNBD", "RSD"],
    tags: ["rdh", "rajah dumdumla hall", "boys dormitory", "residence"],
  },
  {
    id: "rsd-male-dormitory",
    name: "RSD Male Dormitory",
    category: "Dormitory",
    description:
      "Male student dormitory in the residence hall cluster near RDH and SNBD.",
    mapX: 52,
    mapY: 69.2,
    latitude: 7.99505,
    longitude: 124.2607,
    street: "Residence Hall Road",
    nearby: ["RDH", "SNBD", "SNGD"],
    tags: ["rsd", "male dormitory", "boys dormitory", "residence"],
  },
  {
    id: "infirmary",
    name: "University Infirmary",
    category: "Health",
    description:
      "Campus health facility providing medical consultation and health services.",
    mapX: 35.4,
    mapY: 12.3,
    latitude: 8.00086,
    longitude: 124.2576,
    street: "3rd Street",
    nearby: ["Research Institute", "CICS", "Student services"],
    tags: ["infirmary", "health", "medical", "3rd street"],
  },
  {
    id: "main-entrance",
    name: "MSU Main Entrance",
    category: "Landmark",
    description:
      "Primary campus entrance on the Amai Pakpak Avenue side near the College of Health Sciences and King Faisal Center.",
    mapX: 80.5,
    mapY: 34.7,
    latitude: 7.9986,
    longitude: 124.2661,
    street: "Main Entrance Road",
    nearby: ["College of Health Sciences", "Nursing area", "Basak health side"],
    tags: ["entry", "entrance", "chs", "nursing", "landmark"],
  },
  {
    id: "alonto-hall",
    name: "Senator Ahmad Domocao Alonto Sr. Hall",
    category: "Administration",
    description:
      "Administrative building associated with registrar and student transaction offices.",
    mapX: 40.5,
    mapY: 31,
    latitude: 7.998959,
    longitude: 124.2588745,
    street: "1st Street",
    nearby: ["Registrar", "MSU-Main Library", "Antonio Isidro Administration Building"],
    tags: ["registrar", "admin", "records"],
  },
  {
    id: "administration-building",
    name: "Antonio Isidro Administration Building",
    category: "Administration",
    description:
      "Main administration building across the library side of the campus core.",
    mapX: 38.6,
    mapY: 31.5,
    latitude: 7.9989278,
    longitude: 124.2584556,
    street: "Carlos P. Garcia Street",
    nearby: ["MSU-Main Library", "Senator Ahmad Domocao Alonto Sr. Hall", "1st Street"],
    tags: ["admin", "administration", "antonio isidro", "2nd street"],
  },
  {
    id: "university-library",
    name: "MSU-Main Library",
    category: "Student Services",
    description:
      "Central academic resource area for library services, research support, and reading spaces.",
    mapX: 45.9,
    mapY: 34.3,
    latitude: 7.9986701,
    longitude: 124.259542,
    street: "1st Street",
    nearby: ["Antonio Isidro Administration Building", "CNSM", "Aga Khan Museum"],
    tags: ["library", "research", "student services"],
  },
  {
    id: "aga-khan-museum",
    name: "Aga Khan Museum",
    category: "Landmark",
    description:
      "Campus museum located across the ICTC side of the academic core.",
    mapX: 47.4,
    mapY: 41.8,
    latitude: 7.99842,
    longitude: 124.25988,
    street: "1st Street",
    nearby: ["ICTC", "MSU-Main Library", "CNSM"],
    tags: ["aga khan", "museum", "akm", "landmark"],
  },
  {
    id: "dimaporo-gym",
    name: "Dimaporo Gymnasium",
    category: "Landmark",
    description:
      "Major event, sports, and commencement venue inside MSU Main Campus.",
    mapX: 29.8,
    mapY: 74.8,
    latitude: 7.9946388,
    longitude: 124.2568347,
    street: "4th Street",
    nearby: ["CSPEAR", "Sports grounds", "Lower campus"],
    tags: ["gym", "sports", "events", "commencement"],
  },
  {
    id: "ict-office",
    name: "ICTC",
    category: "Academic Support",
    description:
      "Information and Communication Technology Center in the academic core, across from Aga Khan Museum.",
    mapX: 43.5,
    mapY: 42,
    latitude: 7.99935,
    longitude: 124.25825,
    street: "2nd Street",
    nearby: ["Aga Khan Museum", "MSU-Main Library", "CNSM"],
    tags: ["ictc", "information technology center", "portal", "wifi"],
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
  "sessions",
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

  campusLocations.forEach((location) => {
    if (
      includesQuery(query, [
        location.name,
        location.category,
        location.description,
        location.street ?? "",
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
