export const DATABASE_VERSION = "2026.05.11.1";

export type UserRole = "student" | "visitor" | "faculty" | "employee" | "admin";

export type UserRecord = {
  id: string;
  name: string;
  role: UserRole;
  username: string;
  email: string;
  idNumber?: string;
  college?: string;
  program?: string;
  yearLevel?: string;
  section?: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatarUrl?: string;
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
  { id: "agriculture", mapX: 38.5, mapY: 95.2 },
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
  { id: "cnsm", mapX: 51.4, mapY: 53.7 },
  { id: "cssh", mapX: 47.8, mapY: 45.2 },
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
  { id: "agriculture-road", mapX: 37.2, mapY: 92.6 },
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
  "college-cnsm": "cssh-east",
  "college-public-affairs": "lower-core",
  "college-social-sciences-humanities": "first-cnsm",
  "college-spear": "third-oval",
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

export type TechnicalElective = {
  code: string;
  title: string;
};

export type ProspectusRecord = {
  id: string;
  programId: string;
  program: string;
  yearLevel: string;
  semester: string;
  summary?: string;
  technicalElectives?: TechnicalElective[];
  subjects: string[];
};

export type AcademicEvent = {
  id: string;
  title: string;
  eventDate?: string;
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
  userId?: string;
  courseCode: string;
  courseTitle: string;
  day: string;
  time: string;
  scheduleDate?: string;
  startTime?: string;
  endTime?: string;
  room: string;
  reminder: string;
  reminderMinutes?: number;
  reminderAt?: string;
  notificationId?: string;
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
    email: "student@s.msumain.edu.ph",
    passwordHash: "demo:student123",
  },
  {
    id: "user-faculty-demo",
    name: "Faculty Demo",
    role: "faculty",
    username: "faculty",
    email: "faculty@msumain.edu.ph",
    passwordHash: "demo:faculty123",
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
    "id": "student-handbook-2019-2020-p030",
    "chapter": "Student Handbook 2019-2020 - Preface",
    "title": "P R E F A C E",
    "content": "P R E F A C E\nFor any navigation to be successful, a radar or global positioning system (GPS) is needed, to guide a\ntraveller or navigator in his/her own way. This student handbook is one guide for incoming student travellers\nin MSU-Main Campus, Marawi City.\nTo be able to come up with wide-ranging and updated information about student matters, the\ncommittee that is tasked to review, revise and publish this Student Handbook takes into consideration the\nlatest developments on campus, that are in line with the vision of the present university administration under\nthe leadership of MSU System President, Dr. Habib W. Macaayong, for a world class MSU by 2020.\nFor your easy reference, this handbook has been divided into major sections as follows:\n1. Student Planner\n2. Chapter I The University\n3. Chapter II Frontline Offices for Student Services\n4. Chapter III Code of Discipline and Laws\n5. Chapter IV Colleges and Courses Offered\n6. Appendix\nIt is hoped that this handbook will be useful and helpful for you as MSU students to become well\ninformed and properly guided during your stay or journey in the University. You are, therefore, encouraged to\nfamiliarize yourselves with the valuable information contained herein so that you could greatly benefit from\nthem as intended. Should you have any query or clarification that you need to ask, you may refer to the Division\nof Student Affairs (DSA) or to any of the offices concerned.\nThe student handbook may be revised every academic year as maybe appropriate and necessary for\nupdating purposes.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university",
      "courses",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p031",
    "chapter": "Student Handbook 2019-2020 - Messages",
    "title": "OFFICE OF THE PRESIDENT",
    "content": "Republic of the Philippines\nMINDANAO STATE UNIVERSITY\nMarawi City\nOFFICE OF THE PRESIDENT\nMessage\nThrough the years the Mindanao State University has survived,\nthrived and flourish amidst the enormous challenges of her time. She has been\nsteadfastly strong and resilient even in the face of her darkest history- the terror\ninspired by the Marawi Siege. Instead of sulking in the shadow of this horrifying\nreality, she rather rose to the occasion, inspired hope to the people and helped\nrekindle vitality in the region.\nMSU breathes and lives for the realization of her unbounded mandate as a national formulation for\npeace and development in the MINSUPALA. Her stout resolution lies in the vision and missions inscribed in her\ncreation as an inimitable institution. Hence, this Student Handbook shall not only serve as a repository of\npertinent guidelines, rules and policies governing the academic life of every student of this University, but also\nas a chronicle of our dear MSU over the years. It is hoped that beyond the prints and the texts etched on its\npages, the students shall imbibe the spirit, essence and values that the Mindanao State University has been\nstalwartly and proudly fighting for.\nMy commendation to the inestimable efforts and dedication of the good men and women of the\nDivision of Student Affairs for this handbook.\nVivat crescat floreat.\nHABIB W. MACAAYONG, DPA\nMSU System President",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p032",
    "chapter": "Student Handbook 2019-2020 - Messages",
    "title": "OFFICE OF THE VICE PRESIDENT FOR ACADEMIC AFFAIRS",
    "content": "Republic of the Philippines\nMINDANAO STATE UNIVERSITY\nMarawi City\nOFFICE OF THE VICE PRESIDENT FOR ACADEMIC AFFAIRS\nMessage\nOur heartfelt congratulations to the great women and men who have\ncontributed to make this Student Handbook a reality. It is long overdue. This has\nbeen in the making for some time and finally, now it can be available for our\nstudents as an important tool and basic reference in their journey as a college\nstudent of MSU at Marawi Main Campus.\nTo our dear students, we wish you all the best! Thank you for coming to\nMSU as we will do our best to provide you access to quality education. You are\nlucky. You come at a very opportune time. We are offering you revised curricular programs to align with\nlatest development in various fields to enhance your competencies and skills to prepare you for leadership\npositions and greater employability.\nWe hope MSU will be successful in molding you towards becoming responsible and patriotic citizens\nof our country. We pray that as true MSUans, you will be peace-builders and peace-makers. Your commitment\nand dedication to your studies will make it easier for you to reach the finish line. Remember your success in\nMSU will pave the way to changing your life story, your family, and your community. In that sense, MSU will\nbe proud to have contributed meaningfully to your transformation throughout your stay in MSU Campus. You\nwill form part of MSU’s contribution to nation-building. Make your parents and families proud. Make MSU\nproud of you. Your individual success story will be the same with the success stories of many generations of\nMSU alumni who came ahead of you. Because of them, because of you, because of the future generations of\nMSU students that we never falter, we will always be inspired to give you our best dedicated performance.\nGod bless us all!\nALMA E. BEROWA, Ph.D.\nVice President for Academic Affairs",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p033",
    "chapter": "Student Handbook 2019-2020 - Messages",
    "title": "OFFICE OF THE VICE PRESIDENT FOR PLANNING AND DEVELOPMENT",
    "content": "Republic of the Philippines\nMINDANAO STATE UNIVERSITY\nMarawi City\nOFFICE OF THE VICE PRESIDENT FOR PLANNING AND DEVELOPMENT\nMessage\nMy dearest students welcome to the Mindanao State University\n(MSU)! I am glad to have you as part of our MSU family. As you commence your\nacademic career in this university, use this Student Handbook as your guiding\nprinciple in your academic journey. Thus, it is imperative that you should know\nyour rights and responsibilities as students, and understand the procedures,\nrules, and policies of the university. This student handbook is your handy\ntoolkit and reference to help you steer your directions while you are studying\nin MSU. Be familiar of the valuable information written in this handbook and you should internalize all the\ninformation provided for you, and be duty-bounded in following the instructions herein for your own welfare.\nMy dearest students, while you are staying in MSU, you will meet new friends, new teachers, new\nknowledge, and a variety of opportunities. Get involved and embark a path full of promise and hope. MSU want\nevery student to prosper, and the university constituents are devoted to working with you and your parents or\nguardians to guarantee that you can learn and professionally grow in a harmless, supportive and conducive\nlearning environment. Likewise, MSU officials are dedicated to meeting all your needs, provide you a committed\nfaculty and outstanding staff, a beautiful campus, and an atmosphere favorable to your academic goals.\nThis Student Handbook may serve as our covenant and guide while you are staying in this university.\nI hope that your stay in Mindanao State University will be your best lived experience. As Neil Armstrong said\n“It’s one small step for man, one giant leap for mankind.” Give your best and be a role model student in the\nuniversity. Have a wonderful journey with great opportunities at this prestigious institution.\nGod Bless Us All!\nPROF. RASID M. PACA, JD\nVice President for Planning and Development",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p034",
    "chapter": "Student Handbook 2019-2020 - Messages",
    "title": "OFFICE OF THE VICE CHANCELLOR FOR ACADEMIC AFFAIRS",
    "content": "Republic of the Philippines\nMINDANAO STATE UNIVERSITY\nMarawi City\nOFFICE OF THE VICE CHANCELLOR FOR ACADEMIC AFFAIRS\nMessage\nThis student handbook is a clear manifestation that the Division of\nStudent Affairs has gradually reached its goal to create a well-informed\nstudentry of the University. The contemporary world is characterized by\nvarious perspectives, beliefs, opinions, methods, and even truths competing\neach other. A handbook described a reservoir of information is but necessary\nto guide searchers of wisdom in choosing better perspective to clearly\nunderstand their state of affairs, to formulate better opinions and to give acceptable moral judgements\nArmed with this handbook made available to us particularly to our students through the collective\neffort of DSA staff headed by Director Labimombao Macabando, I am confident to say that our students are\nnow in the proper direction towards making responsible choices in the academe. They should bring sense of\nresponsibility to their homes and to their local communities. In doing this, they would enjoy peaceful co-\nexistence with others as a direct effect of responsible choices.\nI commend DSA for having been exemplary of responsible choices. This handbook by being a product\nof such choice is one wisest move you did.\nKudos!\nFLORENCIO A. RECOLETO, JR., Ph.D.\nVice Chancellor for Academic Affairs",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p035",
    "chapter": "Student Handbook 2019-2020 - Messages",
    "title": "OFFICE OF THE VICE PRESIDENT FOR ADMINISTRATION AND FINANCE",
    "content": "Republic of the Philippines\nMINDANAO STATE UNIVERSITY\nMarawi City\nOFFICE OF THE VICE PRESIDENT FOR ADMINISTRATION AND FINANCE\nMessage\nAssalamu’alaikum warahmatullahi wabarakatuhu.\nThe Mindanao State University has been in existence for decades.\nWith the long years of struggle, it has proven its stance as one of the most\ncompetitive universities not only in Mindanao but all throughout the country.\nHopefully, it will remain competent to pursue its mission in the years to come.\nThis handbook serves as a guide for the incoming students as well as the old ones. It tackles about\nvarious information such as: the mission, vision, goals and objectives of the institution, the rules and\nregulations governing the University and its general and academic policies.\nAs one of the leading officials of the University, I hope and pray to the Almighty Allah that MSU will\nmaintain its academic standards and continue its competence on the years to come.\nATTY. JAMALODEN A. BASAR\nVice President for Administration and Finance",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p036",
    "chapter": "Student Handbook 2019-2020 - Messages",
    "title": "OFFICE OF THE VICE CHANCELLOR FOR ADMINISTRATION AND FINANCE",
    "content": "Republic of the Philippines\nMINDANAO STATE UNIVERSITY\nMarawi City\nOFFICE OF THE VICE CHANCELLOR FOR ADMINISTRATION AND FINANCE\nMessage\nAs one of the professorial lecturers and a humble servant of this\nUniversity, it is our bounded duty and obligation to serve the interest of the\nstudents in every possible way to achieve their goal in sterling academic\nexcellence and good citizenship.\nThe revival of the student handbook is a manifestation of laudable sincerity\nof MSU’s administration commitment to continue provides the students with\nquality education and technical knowledge not only for their self-development but also for the economic\ngrowth of Mindanao. I laud Dir. Labimombao A.D Macabado and her staff in their effort for the revival of the\nStudent Handbook with comprehensive information about the academic programs of the University. May this\nstudent handbook serve as a guide to illuminate during their stay at the campus.\nFor the new students of this university, I welcome you to the new chapter of your life as a young\nprofessional in the making. I encourage you to be the best out yourself and be an inspiration to the youth in\nbuilding progressive community through peace and education. Just remember that there are no secrets in\nsuccess. It is the result of preparation, hard work, and learning from failure.\nOn behalf of this great institution, we sincerely thank all the students and its academic mentors for\nentrusting your time and loyalty in building progress through your mutual support in molding a society of\npeace and development in the region. Your success is the success of this University and its goal. Long live\nMindanao State University and God bless us all!\nATTY.\nSAADUDDIN MASACAL ALAUYA Jr., CPA\nVice Chancellor for Administration and Finance",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p037",
    "chapter": "Student Handbook 2019-2020 - Messages",
    "title": "OFFICE OF THE UNIVERSITY SECRETARY",
    "content": "Republic of the Philippines\nMINDANAO STATE UNIVERSITY\nMarawi City\nOFFICE OF THE UNIVERSITY SECRETARY\nMessage\nThis is I think, the 2nd Edition of the MSU-Marawi Student’s\nHandbook being prepared and published by the Division of Student Affairs\nunder the leadership of its Director Labimombao Macabando, Ph. D.\nThis edition perhaps is more complete than the previous one. Just the same, this undertaking is a\nmanifestation of the strong advocacy of the present administration in promoting transparency and\naccountability in governance.\nMay this handbook serve the purpose in providing informative materials for our students and other\nstakeholders of the University.\nAround of applause and congratulations to DSA and all people behind in the successful production of\nthis student’s handbook.\nUSMAN D. ARAGASI, MPA, JD\nSecretary of the University\nand of the Board of Regents",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p038",
    "chapter": "Student Handbook 2019-2020 - Messages",
    "title": "DIVISION OF STUDENT AFFAIRS",
    "content": "Republic of the Philippines\nMINDANAO STATE UNIVERSITY\nMarawi City\nDIVISION OF STUDENT AFFAIRS\nMessage\nBismillahir Rahmannir Rahim!\nMindanao State University as one of the prestigious Universities in\nMindanao, serving numerous communities for decades not only in the Province of\nLanao del Sur but Mindanao as a whole, holds significant role in drawing a better\npicture of living for Mindanaoans. MSU stands strong against storms and waves\nthat challenge communities surrounding it, especially now that MSU is at the\nforefront of restoring Marawi from its unforgettable wailing experience.\nMy appreciation and gratitude to our President Dr. Habib W. Macaayong for the approval and\nencouragement of revision of the Student Handbook which made it realized, to Vice President for Academic\nAffairs Dr. Alma E. Berowa for inspiration and never-ending support, to the Director of the University Budget\nOffice Soraida A. Esmail for the assistance on finance aspect which mobilized the printing and production of\nthis student handbook and to the Directors’ League and other MSU Officials who express their support to the\nDivision of Student Affairs in many ways. I thank you all and I hope we all continue to work together for the\nwelfare of the MSU stakeholders especially the students who are the main engine of this University.\nTo the students, I hope this handbook will equip you toward better adjustment while studying in this\nUniversity and consequently become an important wheel to find better career after your studies. I pray for your\nwellness and strength to withstand challenges and difficulties in your journey as a student.\nI pray that DSA with all the capacity it possesses, we can execute smoothly our mandate for the\nstudents to become responsible individuals in achieving meaningful living inside and outside the University\npremises.\nENGR. LABIMOMBAO A.D. MACABANDO, Ph.D., CSEE\nDirector, Division of student affairs",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p044",
    "chapter": "Chapter I - The University",
    "title": "BRIEF HISTORY",
    "content": "BRIEF HISTORY\nThe Mindanao State University was created under Republic Act 1387 as\namended. It was formally organized with the induction into office of the UP Vice\nPresident Antonio Isidro as the first President of the first public university in\nSouthern Philippines before Pres. Carlos P. Garcia at Malacañang on September 1,\n1961.\nPres. Garcia signed Proclamation No. 806 which reserved 1,000 hectares out\nof the Camp Keithley military reservation in Marawi City some 2,256 feet above sea\nlevel overlooking the blue and serene waters of Lake Lanao. It is located about four\nkilometers from downtown Marawi and about forty kilometers from Iligan City. This\nproclamation was later enacted into law when Congress ceded the 1,000-hectare\nreservation to the University under R.A 3791.\nMSU formally opened its first classes on June 13, 1962 with 282 students\nfrom all the provinces and cities of Mindanao, Sulu, Palawan, Visayas and even as far\nas Luzon. Nine Filipino faculty members assisted by a group of Peace Corp Volunteers\nwere the initial teaching force for the three (3) core colleges: Community\nDevelopment, Liberal Arts and Education. Today, MSU has grown into a multi-campus\nUniversity System with 17 colleges and degree-granting units in the Marawi Campus\nalone, and seven (7) other autonomous campuses in strategic locations in Mindanao:\nMSU-Iligan, MSU-Naawan, MSU-General Santos, MSU-Maguindanao, MSU-Tawi-Tawi,\nMSU-Sulu, and MSU-Buug.\nPHILOSOPHY\nMindanao State University System is committed to the total\ndevelopment of man and to the search for truth, virtue and\nacademic excellence.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p045",
    "chapter": "Chapter I - The University",
    "title": "VISION",
    "content": "VISION\nMSU System aspires to be a Center of Excellence in Instruction, Research and\nExtension transforming itself into a premier and globally competitive national\npeace university.\nMISSION\nMSU System is committed to:\n1. Lead in social transformation through peace education and integration of the Muslims and\nother cultural minority groups into the mainstream society;\n2. Ensure excellence in instruction, research development, innovation, extension, and\nenvironmental education and discovery;\n3. Advance national and international linkages through collaborations and,\n4. Demonstrates greater excellence, relevance, and inclusiveness for Mindanao and the Filipino\nnation.\nGOALS\nThe MSU-Main Campus is committed to:\n1. Promote and strengthen academic excellence in all levels of education to produce\ngraduates who are competent to meet future needs of humankind;\n2. Enhance the visibility of the University through production of high impact researches and\ninnovation;\n3. Respond to globalization trends through partnerships and collaborative relationships\nwith national and international universities, research institutions, and industries;\n4. Secure and preserve the University resources and facilities;\n5. Integrate peace education programs in the University Curricula;\n6. Strengthen and sustain extension services; and\n7. Transform the University through investments in human resource development,\ninfrastructures and equipment.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p046",
    "chapter": "Chapter I - The University",
    "title": "Core Values",
    "content": "Core Values\nMSU-Main is a community characterized by “Unity in Diversity” motivated with the following core\nvalues:\n1. Mutual Respect, the University stakeholders and constituents respect and understand\nindividual regardless of race, culture, and religion.\n2. Service Orientedness, the University stakeholders provides efficient and effective services.\n3. Unity and Teamwork, the University stakeholders collaboratively exercise in all aspect in\naccordance to national and global standards, interlink with colleagues and in other academic\ninstitutions, government, and industry through sharing and collaboration of knowledge\nexpertise and skills towards career development and job placement.\n4. Multiculturalism with Means-tested Benefits, acceptance and tolerance of other cultures geared\ntowards social welfare and development.\n5. Academic Excellence, the University maintain its highest standard of excellence both in\nacademic and service performance as it’s mandated through instruction, research, extension,\ncommunity services, peace development, innovations, production, entrepreneurship, and\nglobalization.\n6. Integrity and Trustworthiness, the University lead with Transparency, Respect, Understanding,\nService and Teamwork (TRUST) in upholding public trust. Different activities are or will be\nperformed with the highest standard of honesty, accountability and transparency.\n7. Nobility and Professionalism, the University ensure strong camaraderie’s among stakeholders,\nintellectual discourse among other colleagues is encouraged upholding the great ideals of\nethical behavior and genuine understanding with each other.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p050",
    "chapter": "Chapter I - The University",
    "title": "Dr. Antonio Isidro",
    "content": "Dr. Antonio Isidro\n1962 - 1969\nDr. Mauyag M.\nTamano\n1970 -1975\nDr. Ahmad E. Alonto,\nJr.\n1987 -1992\nHadja Sittie\nNurlaylah\nEmily M.\nMarohombsar\n1993\nMacapado A. Muslim,\nPh.D.\nMar. 5, 2010-Mar. 7, 2016\nJan. 4 2008-Mar. 4, 2010\nCamar A. Umpa, Ph.D.\n1999 - 2005\nHabib W. Macaayong, DPA\nMarch 8, 2016 - Present",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p051",
    "chapter": "Chapter I - The University",
    "title": "Ricardo F. De Leon,",
    "content": "Ricardo F. De Leon,\nPh.D.\n2005\nProf. Diamael M.\nLucman\nJan. – Sept. 1999\nMangigin D.\nMagomnang\n1986\nGov. Mohamad Ali M.\nDimaporo\n1976 - 1986\nAtty. Tocod Macaraya,\nSr.\n1974 - 1975\nDr. Alfredo Q. Primero\n1969 - 1970",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p052",
    "chapter": "Chapter I - The University",
    "title": "HIMNO NG PAMANTASANG MINDANAO",
    "content": "HIMNO NG PAMANTASANG MINDANAO\nLyrics: Prof. Angelito G. Flores, Sr.\nMusic: Lucio San Pedro\nSilahis ang katulad mong\nNagsabog ng Liwanag\nNg pag-asa’t hangarin\nAt pag-unlad.\nAng pook ng Mindanao\nTinanglawa’t pinalad\nNang ikaw’y isilang\nNa dakila ang hangad.\nAting ipagkapuri\nItong pamantasan\nAng buhay at pag-ibig\nSa kanya’y iaalay.\nSaan man naroroon ay\nBigyang karangalan,\nDakilang paaralan\nPamantasang Mindanao.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p055",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "DIVISION OF STUDENT AFFAIRS",
    "content": "DIVISION OF STUDENT AFFAIRS\nIn accordance with RA. No. 7722, known as the “Higher Education Act No. of 1994”, BP. 232, and Res.\nNo. 321-2013 Commission en banc dated April 8, 2013, the Commission on Higher Education, pursuant to its\ncommitment to the utmost achievement of quality, relevant and efficient higher education in the country,\nhereby adopted and promulgated the following Enhanced Policies and Guidelines of Student Affairs and\nServices (CMOA, Series of 2013), which define the scope, procedures, the extent of regulations as well as the\nmechanics of evaluating student welfare and activities for students enrolled in Higher Education Institutions\n(HEIs) thus:\nStudent Affairs and Services\n(Article V)\nSection 10. Student Affairs and Services (SAS)- Student Affairs and Services are the services and programs in\nhigher education institutions that are concerned with academic support experiences of students to attain\nholistic student development. Academic support services are: those that relate to student welfare, student\ndevelopment and those that relate to institutional programs and services. Implementation of these services can\nbe unique to an institution.\n10.1 Student Welfare Services are basic services and programs needed to ensure and promote the\nwell-being of students.\n10.2 Student Development Service refer to the services and programs designed for the\nexploration, enhancement and development of the student’s full potential for personal development,\nleadership, and social responsibility through various institutional and/or student-initiated\nactivities.\n10.3 Institutional Student Programs and Services – refer to the services and programs designed to\npro-actively respond to the basic health, food, shelter and safety concerns of students including students\nwith special needs and disabilities in the school.\nFunctions and Services of the Division of Student Affairs\nof MSU-Main Campus\n(Per BOR Res. No. 496, Series of 1970)\n1. Provides an effective channel of communication between the student body, on the one hand, and the\nadministration, faculty and staff on the other;",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p056",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "improvement of the University as well as complaints and grievances of students;",
    "content": "2. Receives from the students and student organizations’ suggestions and recommendations for the\nimprovement of the University as well as complaints and grievances of students;\n3. Endeavors to explain the policies of the university;\n4. Endeavors to resolve student problems, provided that those that cannot be solved or lie beyond its\ncompetence shall be transmitted to higher authorities of the University for information, guidance or\nappropriate action;\n5. Coordinates the operation of units in charge of student services such as:\na. University Infirmary\nb. Student Organizations\nc. Student Publications\nd. Student Residence Halls and Villages\ne. University Library\nGuidance and Counseling\nAn integral part of education and vital component of human development, Guidance and Counseling\nprovides professional assistance to the students and other constituents.\nThe guidance program endeavors to assist the students to formulate realistic life goals and make wise\nchoices and decisions; and to assist students cope with their personal, social, emotional, academic and other\nchallenges in order to facilitate their adjustment to college life.\n1. Counseling\n➢ Assists students to render proper decision and lay possible alternatives regarding their academic,\nsocial, career and other aspects or concerns.\n2. Testing\n➢ Provides objective measurement of the client’s behavior through administering, scoring and\ninterpreting tests, and informs them of the result. Translates the result through counseling and makes\nthe clients know their strengths and weaknesses (i.e aptitude, mental ability, personality, etc.).\n3. Information\n➢ Gives accurate information to the students.\n➢ Posts relevant information to different colleges. Make sure that guidance services are known and\navailable to all constituents of the University.\n4. Placement\n➢ Assists students derive right decision in choosing their course or profession through career pathing.\n➢ Coordinates with different employment agencies and facilitates job-fairs, seminars and workshops for\nthe graduating students and other interested constituents.\n5. Follow-up\n➢ Monitors and determines/identifies the current status of the students through call or text and sends\ncommunication letters after assessment on the previous counseling has been done.\n6. Research and Evaluation",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p057",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "services.",
    "content": "➢ Conducts research, evaluation and studies concerning students/clients as strong bases for\nintervention in organizing programs and activities for the students. Finds out the status of the guidance\nservices.\n7. Students Individual Inventory\n➢ Gathers and keeps confidentially relevant data of students and their profile as basis for counseling and\nother intervention programs to address students’ academic, career, social and other concerns that are\naffecting their studies.\n8. Shifting of Courses\n➢ Provides shifting orientation, group processing and counseling session and recommends students who\nare shifting of program of study to appropriate courses.\n➢ Renders counseling and recommends students who got dismissed for re-admission.\nSpecial Concerns and\nOther Activities\nMainly responsible in handling, serving students’ needs and other activities in coordination with\nother stakeholders. Specifically, this section shall perform the following services, to wit:\n1. Darangen- Preparation to include the pictorials of graduating students, printing-production and releasing\nof the yearbook. Evaluate the liquidation of expenses and the early selection and creation of the Editorial\nBoard/Staff and Advisers.\n2. Students’ Insurance Coverage- Facilitating, coordinating with legitimate insurance company providing\ninsurance coverage to the students, as well as processing, facilitating and coordinating the insurance claims\nof the students.\n3. Educational and Research Fieldtrips- Managing, coordinating, facilitating the processing of the insurance\ncertification of the students undergoing educational fieldtrips, practicum, OJT, seminars, training and the\nlikes and issuance of necessary special orders from the University President.\n4. Student Discipline Board- Serves as the secretary and co-chair of the disciplinary board. Keeps the records,\nreceives complaints, provides notice of meeting and issues subpoena to parties involved in any hearing or\nproposed amicable settlement to the board.\n5. Student Handbook- Takes the lead, facilitates all the activities of stakeholders relative to the preparation,\nprinting-production and distribution of the University Student Handbook.\n6. Mindanao Varsitarian- Guides, coordinates, facilitates and assists the preparation, publication, production\nand distribution of the Mindanao Varsitarian (student publication). Evaluates the liquidation of expenses\nand the early selection of the Editorial Board/staff.\n7. University Student Leadership Award (USLA) - Takes the lead in selecting, facilitating, evaluating, and\nscreening the students who may apply and qualify for the following: University Student Leadership Award",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p058",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "Rizal and others.",
    "content": "(USLA), Ayala Young Leaders Congress (AYLC), Ten Outstanding Students of the Philippines (TOSP), Jose\nRizal and others.\n8. Students’ Trainings, Seminar- Workshop Opportunities both Domestic and Foreign, Campus-Wide\nand System- Wide Leadership Summit - Takes the lead and facilitates linkaging and networking for the\nstudents attendance or participation in the trainings, workshops, seminars, and conferences, both domestic\nand foreign, including system-wide leadership summits.\n9. Obituaries and Other Crises - takes the lead, organizes, facilitates the students’ financial and other forms\nof assistance to be extended to any student affected.\n10. Student Welfare Assistantship Program (SWAP) - Takes the lead, facilitates, approves the\nimplementation of the SWAP pursuant to BOR Resolution No. 06, Series of 1992.\n11. DSA Outstanding Student Leaders - Recognizing significant leadership performance of student leaders\nfrom the Association of Registered Campus Student Organizations (ARCSO), Supreme Student Government\n(SSG), and Seniors Council.\n12. DSA Student Service Award – Those students who extend Assistance or Services to the different student\nactivities and programs of DSA pertaining to student activities which may either be co-curricular or extra-\ncurricular.\nStudent Organizations Welfare and Development\n(Chapter 62, University Code, June 1977)\nA student organization of the University or of any college or school thereof shall be any association,\nclub, fraternity, sorority, and order of any other form of organized group whose members are bonafide students\nof the University (Article 460, MSU Code).\nOrganizations that are sectarian, provincial, sectional or sectionalistic in name and in nature are not\nallowed in the University. Any organization which identifies itself with any cultural, religious or linguistic group\nwhich may tend to promote division instead of unification of students is not authorized (Article 461, MSU Code).\nOrganizations which aim to promote artistic, literary, dramatic, civic, cultural or other worthwhile\ngoals are under the control and supervision of an adviser recommended by the students in coordination with\nthe Director of Student Affairs and approved by the President (Article 462, MSU Code).\nMainly responsible to handle and address issues and concerns involving the welfare and development\nof Campus Student Organizations.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p059",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "organizations for issues and concerns affecting them.",
    "content": "1. Continuous Dialogue-Consultation with the Campus Student Organizations- takes the lead, organizes,\ncoordinates and facilitates occasional dialogue and consultations with the various campus student\norganizations for issues and concerns affecting them.\n2. Registration and Accreditation of Campus Student Organizations- Evaluates, facilitates and approves\nthe registration and accreditation of campus student organizations being a partner of the administration\nin the improvement of the university. Registration of campus organization is during the 1st Month of the 1st\nsemester of the academic year.\n3. Supreme Student Government Activities, Colleges’ Student Councils, and Seniors’ Council (SC)-\nAdministers, facilitates, and monitors the conduct of SSG Election. Monitors the conduct of election of every\ncollege student council. Monitors, implements, assists in the reorganization of the SC members, planning\nand implementation until the realization of all the activities and auditing of the disbursement of funds.\n4. Campus Student Organizations Co-Curricular and Extra-Curricular Activities- Assists in organizing,\nregulating, and coordinating the conduct and implementation of the extra- curricular activities duly\napproved by the organization and the university administration through the DSA.\n5. Recognition and Incentives of Campus Student Organizations - Plans, evaluates, and implements\nprograms in recognition of the exemplary performances, accomplishments and citations of any\norganization. Provisioning or awarding of prizes or incentives for motivation purposes.\n6. Implementation of the Anti-Hazing and Other Relevant Laws -Conducts and organizes symposia, fora\nand dialogue-consultations or activities that will promote student awareness on the Anti-Hazing Law and\nother relevant laws duly promulgated by the CHED, DEPED, etc.\n7. Leadership Training and Development -Plans, organizes and conducts student leadership training and\ndevelopment as intervention in sustaining, motivating and strengthening the campus student\norganizations as partners in the campus wide development.\n8. Student Organization’s Involvement in the Cleanliness, Sanitation and Beautification -Plans,\nfacilitates, coordinates the effective participation of the Campus Student Organizations in the university-\nwide cleanliness, sanitation and beautification drive.\n9. Campus Student Organization Participation in the Security, Peace and Order- Plans, organizes,\nconducts seminars, and coordinates with the Security Services Department on how to involve, sustain and\nmaintain the cooperation between the student organizations and the Security Services Department.\n10. Financial Assistance, Exchange Program and Linkages-Plans, initiates, coordinates and links the\ncampus student organizations with other organizations, entities both domestic and foreign, for any\npossible financial, scholarship or exchange program assistance.\nAdministrative and Finance\nMainly responsible in handling the administrative and financial support services for the employees or\npersonnel and the smooth operation of the entire DSA office.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p060",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "1. Property, Supply and Logistics Support",
    "content": "1. Property, Supply and Logistics Support\nPlans and implements programs on inventory and safekeeping of office supplies and properties.\nEnsures the availability of the needed supplies through scheduling, recording and requesting.\n2. Financing, Collection and Disbursement\nPlans and implements program on how to effectively collect, handle, keep safe the collection of the\noffice in the form of trust, donation and standing fund being generated and to properly monitor, conduct\ninventory of the disbursement and utilization thereof.\n3. Office Maintenance and Cleanliness\nPlans on how to sustain the cleanliness and maintenance of the office area in order to achieve and\nmaintain healthy and conducive working environment.\n4. Personnel Concern Including Attendance, Leave Application, Travel, and Daily Time Record (DTR)\nPlans, monitors and keeps record of the personnel attendance, leave application (i.e. sick, maternity,\nvacation and study), travel and DTR and forwarding of the same to proper offices.\n5. Professional Growth and Study Grants\nPlans, recommends and supports personnel to pursue graduate and post graduate studies, attend\nseminars, workshops and trainings both local and international.\n6. Liaisoning\nPlans programs on how to strengthen coordination, linkages and cooperation with other offices of the\nUniversity, other government agencies, non-government organizations (NGO) and other private entities.\nSpecifically, facilitates effective communication and engagement with other colleges and offices/units of the\nUniversity.\n7. Signing of Student University Clearance\nRecords, keeps confidentially important or relevant students’ data. Signs the University clearance of\ntransferees and graduating students to ensure that students leave the University without liabilities from their\nrespective colleges and other offices they have officially transacted with.\n8. Lost and Found Services\nRecords, keep safe and facilitates the return of the lost and found money or materials to the rightful\nowner as entrusted to the DSA office.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p061",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "9. Preparing and Releasing the Certificate of Good Moral Character",
    "content": "9. Preparing and Releasing the Certificate of Good Moral Character\nThe certificate of good moral character will be issued to students who want to transfer to other\nuniversity or to other academic institutions, to students who want to apply for employment as well as to\nstudents who wish to apply for scholarship grants and for any legal purposes. After preparing the same, it will\nbe released to the former after having been approved by the DSA Director.\n10. Recognition and Incentives\nPlans strategies, evaluates and monitors the accomplishment performance of every employee and the\nprovisioning of recognition and incentive to deserving employees.\n11. Continuous Office Teambuilding\nPlans strategies on how to sustain the conduct of office teambuilding purposely to strengthen\ncamaraderie among employees thereby making them more efficient and effective in the discharge of their\nduties and responsibilities.\n12. Complaints and Grievances\nFacilitates and settles misunderstanding that may arise between and among employees with the end\nview of maintaining a harmonious relationship among them. Otherwise, if such concern is beyond the control\nof the management, the same shall be referred to the higher ups for resolutions.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p062",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "FOOD SERVICE DIVISION",
    "content": "FOOD SERVICE DIVISION\nServices Offered\n1. Prepares and maintains facilities and amenities available in the Convention Center for formal\ngatherings like meetings, seminars, conferences, convention, acquaintance parties, thank giving,\nweddings and other special events.\n2. Well maintained facilities provided to both private and university constituents during events.\n3. Cleanliness and maintenance of all the area in and outside the building including the façade, lobby,\nCRs, function hall, etc.\n4. Reservation and booking of venue.\n5. Venue preparation and set-up banquet and function area.\n6. Production of quality food and beverages to students, faculty, staff officials and guest of the\nuniversity from Monday to Friday at a reasonable price.\n7. Provides and prepares food and beverage, meals from breakfast to dinner, for various special\noccasions.\n8. Offers different banquet service like plate-in service, buffet or food station and etc.\n9. Assigned food service personnel to assist during university function to ensure quality service.\n10. Provides waiter/waitress services for serving food before, during and after the event.\n11. Ensures proper storage and maintenance of banquet wares and equipment.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p063",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "HOUSING MANAGEMENT DIVISION",
    "content": "HOUSING MANAGEMENT DIVISION\nThe Housing Management Division supervises student dormitories and residence halls for faculty, staff\nand other MSU employees in accordance with approved rules and regulations. It also administers the\nestablished housing policies to the university-owned housing units.\nThe five (5) girls’ dormitories can accommodate a total of 1,600 residents while the three (3) men’s\ndormitories can accommodate a total of 800 residents. Accommodation at the dormitories is free to all scholars\nand grants in-aid recipients. For paying students, the semestral fee per resident is P350 (subject to change\nanytime to cope with inflation), to be paid at the University Business Office (UBO).\nI. Dormitories/Residence Halls\n1. Rajah Indarapatra Hall Ladies Dormitory-North Wing – Girl’s dorm.\n2. Rajah Indarapatra Hall Ladies Dormitory- South Wing – Girl’s dorm.\n3. Princess Lawanen Hall-North Wing – Girl’s dorm.\n4. Princess Lawanen Hall-South Wing – Girl’s dorm.\n5. Super New Girls’ Dormitory – Girl’s dorm.\n6. Super New Boys’ Dormitory – Boy’s dorm.\n7. Rajah Solaiman Hall – Boy’s dorm.\n8. Rajah Dumduma Hall – Boy’s dorm.\n9. Bolawan Hall (transient) - Boy’s dorm.\n10. Torogan Hall (transient) - Boy’s dorm.\nEach room is assigned with four (4) to eight (8) students and is provided with basic furnishing such as\nstudy tables, chairs, bed with foam mattresses and lockers. Bath and comfort rooms are common.\nII. Objectives\n1. To ensure a sociocultural integration in all University dormitories;\n2. To ensure that scholars and other deserving students are prioritized and are accordingly awarded bed\nspaces;\n3. To come up with an updated master-list of student residents in the Housing Management Division; and\n4. To facilitate the admission of qualified students in all University dormitories.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p064",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "III. General Policies and Guidelines",
    "content": "III. General Policies and Guidelines\n1. Accommodation in all University dormitories shall be in accordance with the following prioritization\nscheme:\nFirst Priority: Scholars\n1. Academic Scholars\n2. State Scholars\nSecond Priority: Grants-in-Aid Recipients and Members of\nPerforming Cultural Groups\n1. Special Muslim Grantees\n2. Economic Development Grantees, Cultural Community Grantees, PUP Passers\n3. Band and Combo Scholars, Darangen Members, Sining Kambayoka Members, Sining Pananadem\nMembers\n4. College Bound Program (CBP) Grantees\n5. Student Welfare Assistantship Program (SWAP) Beneficiaries\nThird Priority: Paying Students\n1. Those who lost their scholarship\n2. Those from far-flung provinces and cities\n3. Those from nearby provinces and cities\n4. Those from Marawi City and other parts of Lanao del Sur\n2. Accommodation in all University dormitories is a privilege, hence, selective. Moreover, contract for\naccommodation is to be renewed on semestral basis.\n3. All residents are to vacate their rooms every summer and semestral break. If they intend to live in the\ndorm the following semester, then they must apply for accommodation three weeks before the last day\nof classes.\n4. Freshmen students shall be equally distributed to all dormitories.\n5. Mini-restaurants inside the dormitories are strictly prohibited.\n6. No student-resident maybe allowed to stay in the dormitories beyond a maximum of five- year period.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p065",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "IV. Requirements for Dormitory Admission",
    "content": "IV. Requirements for Dormitory Admission\n1. Scholar/Grants-in-Aid Recipients/Members of Performing Cultural Groups\na. Contract of Scholarship Agreement\nb. Approved Certificate of Registration (Requirements 1 and 2 are to be submitted only after\nthe student is enrolled. Non-compliance should cause the dismissal of the student from the\ndormitory)\nc. Interview (for freshmen and conditional old students only) by the Dormitory\nManagers/HMD Director.\nNote: Upon arrival in the campus, freshmen scholars and other grantees are afforded temporary\naccommodation at the dormitories by this office.\n2. Paying Students\na. Approved Certificate of Registration\nb. Payment of P350.00 lodging fee per semester to be paid at the University Business Office (UBO)\nc. Interview (for freshmen and old conditional students only)\nd. A properly accomplished application form for accommodation\nV. When to Apply\nScholars and other new and old grantees may apply for dorm admission two (2) weeks before\nenrollment. Paying students will only be entertained one week after the enrollment. The former is thus\nencouraged to apply before enrollment to benefit from the prioritization accorded to them. All students\napplying for dormitory shall go directly to the unit manager of the different university-owned dormitories and\npresent the requirements for dormitory admission to the manager. If the applicant passes the interview, the\nmanager issues an accommodation slip for payment of lodging fee to the University Business Office (UBO)\nbefore the approval of the application by the Director of the Housing Management Division.\nVI. Personal Conduct\nThe residents in the different university-owned dormitories shall comply with the rules and\nregulations so as to maintain an atmosphere contributory to the well-being of other residents. Any student\nwho conducts himself prejudicial to other residents may be refused future accommodations in any of the",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p066",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "examination days.",
    "content": "dormitories. It is the responsibility of each resident in both his/her personal conduct and his/her attitude\ntoward others to contribute to an atmosphere conducive to study. Radios, record players, CD players, tape\nrecorders and other musical instruments must be operated with due consideration of the comfort of other\nresidents and in observance of quiet hours. Silence should be observed on the following study hours in the\nevening: 8:00 to 12:00. Lights in the room must be switched off after 12:00 midnight except during review and\nexamination days.\nWhen there is no one in the room, all lights should be turned off. Violence against person or property\nis an offense, hence, subject to disciplinary action. Drinking liquor or any alcoholic drink is strictly prohibited\ninside the residence halls or in the University premises; creating disturbances while under the influence of\nalcohol is an unbecoming conduct which is ground for disciplinary action and eventual dismissal from the\ndormitory. Smoking is prohibited in the room except in the receiving halls. Gambling in any form is forbidden.\nTwo offenses of this nature should be a ground for expulsion. Everyone should realize the dangers involved in\npossessing firearms and fireworks where students live in close proximity. Possession of firearms of any type is\na ground for expulsion from the hall and from the University. Possession or use of long knives, pallet guns,\nfirecrackers and other bladed weapons will result in expulsion.\nAll visitors shall be entertained at the receiving hall of every dormitory. Parents, friends and relatives\nmay be allowed to visit dormitory resident(s) provided the door of the room remain open and such visit is\nmade after prior approval of the dormitory management. Ladies entertaining visitors must not be in their\nbedroom attire. Wearing of “short shorts” is prohibited. Women are not allowed to enter inside the men’s\ndormitory except during the open house or with chaperon and with the permission of the management.\nThe following are the approved visiting hours, to wit:\nMen’s Dormitory Ladies’ Dormitory\n8:00 – 11:00 AM 9:00 – 11:00 AM\n3:00 – 7:00 PM 5:00 – 6:00 PM\nIn order to maintain cleanliness in dormitories and their facilities, student residents are held\nresponsible for their proper use. Willful damage or improper use of any of the University facilities will result\nto disciplinary action plus payment or replacement cost. Any student resident caught in the possession of\nfirearms and other deadly weapons (as mentioned earlier), prohibited drugs (possession or use), caught in\nhabitual drunkenness (three times or more) and found gambling twice should be immediately dismissed from\nthe dormitory and refused admission in any other University residence hall.\nThese rules and regulations shall bind the resident effective upon his/her admission to any of the MSU\nowned dormitories. Violation or infraction of any of these rules and regulations is punishable by either\nreprimand, suspension or expulsion from the dormitories and suspension or expulsion from the University in\naddition to reparation or replacement cost.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p067",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "VII. Norms of Conduct/Responsibility of Dormitory Residents",
    "content": "VII. Norms of Conduct/Responsibility of Dormitory Residents\n1. The resident should respect the peace and privacy of his/her co-residents and observe proper\ndecorum. Silence shall be strictly observed from 9:00 PM to 5:00 AM.\n2. The residents should cooperate with the residence hall management in maintaining the cleanliness\nand orderliness of the dormitory/hall. No resident shall be allowed to cook inside his/her room.\n3. The residents should use toilet and bathroom properly. The ladies should dispose their sanitary\nnapkins properly.\n4. The resident shall be held liable for any damage done to the facilities issued to them and the furnishing\nof the hall.\n5. The possession of firearms, deadly weapons, gambling device and pornographic materials is strictly\nprohibited in the residence hall.\n6. Any resident using an electric fan, radio or tape recorder which may need electric power, should first\nsecure a permit from the residence head.\n7. The resident should cooperate with the dormitory or residence hall management in the adoption of\nmeasures to prevent fire, accidents and theft. The dormitory/ hall does not assume responsibility of\nany loss of personal items.\n8. Radios, Phones and other musical instruments must be tuned at such volume so as not to disturb or\nmake the other residents inconvenient.\n9. Study and visiting hours shall be observed at all times. Residents must strictly observe curfew hours\nwhich begin at 7:00 PM and ends at 5:00 AM.\n10. The resident shall not be allowed to transfer from one room to another except if permitted by the\nresidence head and duly approved by the housing division.\n11. Keeping pets in the residence hall, hanging wet clothes, leaving soiled foot wears and other wet\nmaterials in the hallway are prohibited.\n12. Loitering around, room neighboring, singing, serenading, shouting, running along the stairs and\nhallways, and other deliberate actions that attract attention or may disturb other residents during\nnight time or any appointed hours are strictly prohibited.\n13. No student is allowed to use paste in posting notices on the bulletin board and walls.\n14. No students shall be allowed to use his/her room or any of the premises of dormitory for any\ncommercial activity.\n15. The resident is prohibited to introduce alteration and/or renovation of the premises.\n16. Dependent or unregistered person shall not be allowed to stay with a legitimate resident. However, a\ntransient may be accommodated on a case-to-case basis upon approval by the HMD director.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p068",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "MSU-MEDICAL SERVICES AND HOSPITAL",
    "content": "MSU-MEDICAL SERVICES AND HOSPITAL\nThe MSU-Medical Services and Hospital is open to all students twenty-four hours or 24/7 especially for\nconfinement/admission, for consultation -Monday to Friday except holidays, which will start at 8:30 am\nto 4:30 pm.\nI. Requirements for Consultation/Admission:\na. Students should bring their I.D. or COR.\nb. Filled-up Students’ Health Form from the Record’s Section.\nc. Secure ITR (Individual Treatment Form) for Consultation/Admission.\nd. Dental Form for Dental Extraction/Consultation.\nII. Rules for Consultation/Admission:\na. One or two watchers are allowed with the same sex.\nb. Tapes and radios are not allowed to avoid disturbance to other patients.\nc. Vandalism and absconding are strictly prohibited.\nd. Discharging of patients after confinement should be during office hours.\nIII. Visiting Hours for Confined Patients:\n9:00 A.M. to 10:00 A.M.\n4:00 P.M. to 6:00 P.M.\nIV. Enrolment Procedure for All Freshmen Students:\nIn the RECORD SECTION present the following for the issuance of STUDENT HEALTH PROFILE FORM\n(Male: BLUE health form and Female: PINK health form):\na. PRF/SASE result\nb. High School Report Card\nc. 1x1 I.D. picture\nd. Upon receiving the form write full name clearly and legibly in CAPITAL LETTERS.\nExample: ABAD, AIDA ARIONG\nSurname First Name Middle Name\ne. Follow written instructions in the Student Health Profile Form and answer all questions as\ndirected, then affix signature at the space provided.\nIn the NURSING SECTION: Vital signs: Height, weight, blood pressure, pulse\nrate etc.\nIn the DENTAL SECTION: Tooth/denture examination for Dentist’s\nsignature.\nWith the DOCTORS/PHYSICIAN: Present the Student Health Profile form and\nMedical certificate for enrolment form for Physician’s signature.\nV. Enrolment Procedure for Freshmen Nursing Students:\nIn the RECORD SECTION secure a STUDENT HEALTH PROFILE FORM (Male: BLUE; Female: PINK):\na. Write full name clearly and legibly in CAPITAL LETTERS.\nExample: ABAD, AIDA ARIONG\nSurname First Name Middle Name\nb. Follow written instructions in the Student Health Profile Form and answer all questions as\ndirected, then affix signature at the space provided.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p069",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "In the LABORATORY SECTION: Complete Blood Count -- 150.00",
    "content": "In the LABORATORY SECTION: Complete Blood Count -- 150.00\nBlood Typing -- 100.00\nUrinalysis -- 50.00\n*Wait for the Laboratory results to be presented to the Nursing Section.\nIn the NURSING SECTION: Vital Signs: Height, weight, blood pressure, pulse\nrate etc.\nIn the DENTAL SECTION: Tooth/Denture Examination for Dentist’s\nsignature.\nWith the PHYSICIAN: Present Student Health Profile Form and Medical\nCertificate for Enrolment form for Physician’s signature.\nVI. Issuance of Medical Certificates:\nA. Sick Leave of Absences:\na.) Medical Certificates should be issued only to those who consulted in the MSU-Medical\nServices and Hospital. Medical certificates issued outside should be noted by the Medical\nDirector or the MOD- Medical Officer on Duty depending upon the duration of the sick leave.\nb.) One (1) to five (5) days sick leave should be issued by the Medical Officer on duty.\nc.) Sick leaves above six days should be issued by the Medical Director.\nd.) Those for exemption like adapted P.E. and ROTC should be deliberated by the Medical\nCommittee and be approved by the Medical Director depending upon the severity of the case.\nB. Detail at the DAST Office for ROTC/ Adopted P.E.\nDepending upon the severity or extent of the incapacity or ailment of any student concerned,\nanybody seeking medical certificate for detail at the DAST Office, or wishing to take up adapted PE will\nbe scrutinized and subsequently recommended by the Medical Committee composed of three (3)\nphysicians and one (1) dentist to be submitted to the Medical Director for approval.\nC. Students who have no Health Record Form could not avail of the students’ privileges in this\nUniversity.\nD. Students with Self-inflicted Injuries do not enjoy medical privileges like taking drugs, attempting\nsuicide, self-inflicted wounds, hence, they have to pay full charges.\nE. Confined students could avail of Free Confinement (no room fee) with Free Laboratory\nExaminations if needed, only if officially enrolled; OPD or outpatient students are not entitled to\nfree laboratory examination.\nF. Students who are Not Officially Enrolled- (those who did not undergo medical examination\nupon enrolment and no health record) cannot avail of free room fee and free laboratory examinations\nif confined.\nVII. Forms/Documents Issued by the Medical Services & Hospital to the University Students:\n1. Medical certificate for enrollment and P. E. subject purposes.\n2. Medical certificate for medico-legal cases.\n3. Medical certificate for prenatal to be used as support document for maternity\nleave.\n4. Medical certificate for P.E. & ROTC exemption.\n5. Medical certificate for confined students.\n6. Medical certificate for outpatient cases for excuse from classes.\n7.Medical certificate for study leave, scholarship grants.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p070",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "OFFICE OF ADMISSIONS",
    "content": "OFFICE OF ADMISSIONS\nI. General Admission Requirement\nThe University provides students the opportunity of an updated curricular programs designed for\nholistic development of the person to prepare them for top-caliber on leadership roles in their chosen fields.\nThe Office of Admissions (OAD) was created to effectively control the admission of students and ensure\nadherence to the demands of academic excellence.\nThe Office of Admissions takes charge of the following functions:\n1. implements existing admission policies and functions;\n2. administers and implements the University Scholarship Programs as may be assigned from time to\ntime;\n3. assists the Office of the Vice President for Academic Affairs (OVPAA) to administer and supervise the\nMarawi Campus MSU System Admission and Scholarship Examination (MSU-SASE) and College\nEntrance Test (CET);\n4. undertakes studies and recommends improvements and admission policies and procedures;\n5. renders assistance to students who have admission problems; and\n6. establishes and promotes goodwill and rapport with the public especially with all high schools in the\nMINSUPALA region for continuous recruitment of freshmen students.\nII. Admission Requirements in the Undergraduate\nand Post-Graduate Programs\nA. New Applicants (Freshmen):\n1. MSU-SASE/CET or CBP Report of Rating\n2. Senior High School Report Card/Form138A (Original)\n3. Certificate of Good Moral Character from Senior High School Principal\n4. Birth Certificate (PSA-SECPA authenticated)\n5. Medical Certificate from the University Infirmary & Medical Services\n6. 2pcs 2x2 photo with name-tag\n7. 1 long brown envelope with plastic transparent envelope\nB. Transferee(s):\n1. Honorable Dismissal/Transfer Certificate\n2. Transcript of Records or Evaluation of Grades (signed by the Registrar)\n3. Certificate of Good Moral Character\n4. Birth Certificate (PSA-SECPA authenticated)\n5. SASE/CET Report of Rating (for transferees from non-MSU Campuses)\n6. 2pcs 2x2 ID photo with name-tag\n7. Medical Certificate from the University Infirmary & Medical Services\n8. 1 long brown envelope with plastic transparent envelope\nC. Second Degree Applicant:",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p071",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "1. Honorable Dismissal/Transfer Certificate",
    "content": "1. Honorable Dismissal/Transfer Certificate\n2. Transcript of Records\n3. Certificate of Good Moral Character\n4. Birth Certificate (PSA-SECPA authenticated)\n5. 2pcs 2x2 ID photo with name-tag\n6. Medical Certificate from the University Infirmary & Medical Services\n7. 1 long brown envelope with plastic transparent envelope\nD. Master’s/Doctorate Degree Applicant:1\n1. Qualifying Examination administered by Graduate School\n2. Honorable Dismissal/Transfer Certificate\n3. Transcript of Records\n4. Certificate of Good Moral Character\n5. Birth Certificate (NSO-SECPA authenticated)\n6. Copy of Certificate of Marriage (NSO-SECPA authenticated)\n7. 2pcs 2x2 ID photo with name-tag\n8. 1 long brown envelope with plastic transparent envelope\nNote: The student applicant must comply and submit the above requirements to the Office of Admissions upon\nconfirmation of acceptance from the degree-granting College/Unit.\n1 Graduate and post-graduate programs are subject to Graduate School Center Admission Policies & Guidelines",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p073",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "III. MSU Scholarships & Study Grant Programs",
    "content": "III. MSU Scholarships & Study Grant Programs\nThe Mindanao State University, as conceived under RA 1387, has three major\ngoals:\n1) To perform the traditional functions of the University, namely: instruction, research and\nextension service;\n2) To accelerate the program of integration among the peoples of Southern Philippines\nparticularly the Muslim and other cultural minority groups; and\n3) To provide trained manpower skills and technical know-how for the economic development\nof the MINSUPALA region.\nTo achieve these goals the University has adopted scholarships and grants-in-aid\nschemes that are aimed at attracting not only bright and promising students from the service\nareas to maintain a high academic standard but also other students especially from less\nprivileged families in the cultural communities who do not have the luxury or opportunity to send\ntheir children to well-equipped and standard higher institutions of learning. For the former, a\nvery competitive scholarship is given through the MSU System Admission and Scholarship\nExamination (MSU-SASE). The latter are provided with special study skills/grants.\nA. FULL SCHOLARSHIP\nAwarded to the top examinees in the MSU System Admission and Scholarship Exam\n(SASE) whose campus choice is MSU-Marawi Campus (Main)\nGrade Maintenance: 2.20 or better Grade Point Average (GPA), with no failure in any\nacademic subject.\nPrivileges:\na. P5,000.00 monthly stipend;\nb. Free tuition and other school fees;\nc. Free dormitory accommodation; and\nd. Free personal accident insurance coverage.\nB. PARTIAL SCHOLARSHIP\nAwarded to the next top examinee in the MSU SASE whose campus choice is MSU-\nMarawi and will enroll in non-priority courses.\nGrade Maintenance: 2.50 or better Grade Point Average (GPA), with no failure in any\nacademic subject.\nPrivileges:\na. P3,500.00 monthly stipend;\nb. Free tuition and other school fees;\nc. Free dormitory accommodation; and\nd. Free personal accident insurance coverage.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p074",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "C. SPECIAL MUSLIM GRANT (SPL)",
    "content": "C. SPECIAL MUSLIM GRANT (SPL)\nAwarded to the next top Muslim examinees in the SASE for MSU-Marawi Campus only.\nGrade Maintenance: 2.75 or better Grade Point Average (GPA), with no failure in any\nacademic subject.\nPrivileges:\na. P2,500.00 monthly stipend;\nb. Free tuition and other school fees; and\nc. Free dormitory accommodation.\nD. COLLEGE BOUND PROGRAM (CBP) GRANT\nAwarded to the top 40 participants of the Summer College Bound Program (CBP)\nremedial class.\nGrade Maintenance: 3.00 or better Grade Point Average (GPA), with one subject\nfailure allowed per semester.\nPrivileges:\na. P2,000.00 monthly stipend;\nb. Free tuition and other school fees; and\nc. Free dormitory accommodation.\nE. INDIGENOUS PEOPLE GRANT (IPG)\nFormerly known as Cultural Community Grant (CCG) is awarded to selected students\nwho belong to the indigenous people of the MINSUPALA areas and who passed the SASE but are\nfinancially handicapped to study in the University as determined by the screening committee.\nGrade Maintenance: 3.00 or better Grade Point Average (GPA), with one subject\nfailure allowed per semester.\nPrivileges:\na. P2,000.00 monthly stipend;\nb. Free tuition and other school fees; and\nc. Free dormitory accommodation.\nF. SPECIAL STUDY SKILLS/GRANTS\nStudents with special skills and talents who, after screening, became regular\nmembers of talent, performing, and athletic groups are awarded Study Grants in any of the\nfollowing, as appropriate:",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p075",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "1. Darangen Cultural Troupe Grant",
    "content": "1. Darangen Cultural Troupe Grant\n2. Sining Kambayoka Cultural Grant\n3. Sining Pananadem Cultural Grant\n4. University Band Grant\n5. University Combo Study Grant\n6. Varsity Grant\nPrivileges:\na. P2,000.00 monthly stipend;\nb. Free tuition and other school fees;\nc. Free dormitory accommodation.\nG. The Honor’s list of scholars in recognition of high academic performance\nDEAN’S HONORS’ List\nScholars who obtain a Cumulative Grade Point Average (CGPA) of 1.75 or better\nduring the previous semester.\nPrivilege:\na. Award of Certificate of Commendation.\nCHANCELLOR’S HONORS’ List\nScholars who obtain a Cumulative Grade Point Average (CGPA) of 1.25 or better\nduring the previous semester.\nPrivileges:\na. Additional monthly stipend of P200.00 during the semester only.\nb. Award of Certificate of Commendation.\nPRESIDENT’S HONORS’ List\nScholars who obtain a Cumulative Grade Point Average (CGPA) of 1.00 during the\nprevious semester.\nPrivileges:\na. Additional monthly stipend of P300.00 during the semester only.\nb. A cash gift of P1,000.00.\nc. Award of Certificate of Commendation.\nH. SHIFTING OF COURSE\nScholars or grantees are not allowed to shift to another program, otherwise\nscholarship or grant is FORFEITED.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p076",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "In very exceptional cases, shifting within the same college may be allowed only with",
    "content": "In very exceptional cases, shifting within the same college may be allowed only with\nthe permission of the Campus Scholarship Committee.\nI. COMPUTATION OF GRADE FOR MAINTENANCE AND GAINING OF SCHOLARSHIP/STUDY\nGRANT\na) The computation of Grade Maintenance shall be by Cumulative Grade Point Average\n(CGPA).\nb) The maintenance grade requirement shall not be imposed during the first semester to\nprovide for the adjustment of students in College.\nc) Gaining of Scholarship is computed after a minimum of two (2) semesters at 1.500 CGPA\nor better for Full Scholars; and 1.750 CGPA or better for Partial Scholars.\nGaining of FULL Scholarship\nGuidelines and Requirements:\n1. Submit to the Office of Admissions (OAD) grade cards at least taken in two (2)\nconsecutive semesters in the course program.\n2. Must have reached a Grade Point Average (GPA) of 1.50 or better.\n3. Must be enrolled in at least 18 units as prescribed in the curriculum. If there is one\nfailing mark, then one is automatically disqualified.\n4. Application for gaining Full Scholarship is entertained/allowed during enrolment\nperiod only.\n5. Gainers will be notified if they are qualified after computation.\n6. Concerned student gaining Full Scholarship will enroll in the following immediate\nsemester to be allowed to enjoy privileges.\nGaining of PARTIAL Scholarship\nGuidelines and Requirements:\n1. Submit to the Office of Admissions (OAD) grade cards at least taken in two (2)\nconsecutive semesters in the course program.\n2. Must have reached a Grade Point Average (GPA) of 1.75 or better.\n3. Must be enrolled in at least 18 units as prescribed in the curriculum. If there is one\nfailing mark, then one is automatically disqualified.\n4. Application for gaining Full Scholarship is entertained/allowed during enrolment\nperiod only.\n5. Gainers will be notified if they are qualified after computation.\n6. Concerned student gaining Partial Scholarship will enroll in the following immediate\nsemester to be allowed to enjoy privileges.\nJ. COMPLETION OF GRADES\nAn INCOMPLETE (INC) grade must be completed ON or BEFORE the close of the\nregistration of the ensuing semester. Scholars must complete INC within the week of enrolment\nand late registration period only, otherwise forfeiture of scholarship grant becomes\nautomatic.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p077",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "K. SCHOLARSHIP POLICIES",
    "content": "K. SCHOLARSHIP POLICIES\n1) Submit to a medical and physical examination with the Mindanao State University\nPhysician as a prerequisite to enrollment;\n2) Take not less than the semestral number of units and only the subjects prescribed in the\ncurriculum;\n3) Pass all subjects and maintain the Grade Point Average (GPA) prescribed in the\nscholarship grant during the succeeding semesters; provided complete all Incomplete\n(INC) grade(s) on or before the close of the registration of the ensuing semester.\n4) Comply with, and observe all the rules and regulations of the Mindanao State University\nand the Laws of the land;\n5) Concentrate on studies and refrain from accepting, without previous permission from the\nproper University authorities, any form of employment and from participating in\nactivities which may be detrimental to the scholarship;\n6) Inform the Chairman of the MSU Campus Scholarship Committee of any other scholarship\nthat may be received, and the plan or intention to give up the MSU Scholarship; and any\nchange in civil status, citizenship or residence;\n7) Accept direct supervision and guidance from the University authorities, and as an act of\ngratitude, will render service of utmost five (5) hours weekly during the semester, or 100\nhours a semester as may be determined from time to time, depending upon the exigencies\nof the service;\n8) Finish the course within the prescribed period indicated in the curriculum;\n9) Shift only at the start of the second year to another program in the college or to a priority\nprogram in another college with the consent and approval of the Campus Scholarship\nCommittee; and\n10) File an Official Leave of Absence subject only to the following conditions:\na. The leave is highly justifiable, supported by pertinent documents;\nb. A written permission from the University is granted;\nc. The maximum duration of the leave is one academic year, and the expiration date\nshall be immediately before the start of the ensuing semester; and\nd. Upon return, will submit a report, which will be used as basis for determining the\nvalidity of the leave and resumption of scholarship and/or privileges.\nL. FORFEITURE OF SCHOLARSHIP GRANT\n1) Violation of Scholarship Policies;\n2) Membership in any organization that engages in illegal, violent, or subversive activities,\nor participation in any such activities;\n3) Taking prohibited drugs, threatening a faculty member, an official or an employee of the\nUniversity, committing any act of immorality, drunkenness, dishonesty, discourtesy,\ndisrespect, defamation whether verbal/non-verbal or online, and defiance of authority\nand any other form of misconduct adversely affecting the integrity of the University and\ninimical to the interest of the Philippine Government;\n4) Deliberate or willful failure to pay just and valid obligations, such as board and lodging\nand other financial accountabilities;\n5) Falsification of official records;\n6) Expulsion or dismissal from the college or the University; and\n7) Non-availability or exhaustion of scholarship funds.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p078",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "M. GOVERNMENT FUNDED AND OTHER SCHOLARSHIPS 2",
    "content": "M. GOVERNMENT FUNDED AND OTHER SCHOLARSHIPS 2\n1) CHED UniFAST Tertiary Education Subsidy (TES)\n2) CHED Scholarship (for Postgraduate Programs)\n3) GSIS Scholarship\n4) DOST Scholarship\n5) DBP RISE Scholarship\n2Subject to the Funding Agency’s Memorandum of Agreement",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p079",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "1) BFAR Scholarship",
    "content": "1) BFAR Scholarship\n2) NGCP Educate\n3) Cherry Mobile Scholarship\n4) Chief of Staff Scholarship\n5) Chinese Scholarship\n6) Tuition and Other School Fees (TOSF)\n7) EY Scholarship\n(Updated 2019)",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p080",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "OFFICE OF THE REGISTRAR",
    "content": "OFFICE OF THE REGISTRAR\nI. Mandated Functions, Goals and Objectives\nThe Office of the University Registrar plays a vital role in preserving, if not improving the good\nimage and prestige of the University. It is charged with the responsibility of enforcing University rules on\nadmission, registration, assessment of fees and scholastic records. In coordination with the Office of\nAdmissions, it is also charged of enforcing academic rules pertinent to the different scholarship programs\nof the university. It is likewise the custodian and guardian of all scholastic records of students and sees to\nit that its confidentiality is always being safeguarded.\nFurthermore, it provides or furnishes data and information as requested by the different government\nagencies which may be necessary in plans and policy-making processes; keeps and updates records of\nstudents’ evaluation sheets from the date of admission until their graduation; furnishes other higher\ninstitutions of learning records of transferring students whenever requested; services Alumni as to\nrequested Official Transcript of Records and other public documents.\nMoreover, the Office of the University Registrar aims to be the Center of Computerized Information\nregarding students’ records and scholastic data in tertiary and graduate level at the MSU main campus and\nits extension programs at the other campuses of the MSU System.\nII. Tuition Fees and Other School Expenses\nStarting First Semester Academic Year 2018-2019, MSU has fully implemented RA 10931 or the Access\nto Quality Higher Education (or the Free Tuition Law). All MSU officially enrolled full-time undergraduate\nstudents in the University are no longer required to pay the tuition and other miscellaneous fees.\nHowever, repeat subjects will still be paid in accordance with the approved policy of P100.00 per unit.\nThe College of Law and Graduate students are not covered by the Free Tuition Law (RA 10931) and\ncollects tuition and other necessary school fees that are consistent with the approved policies. The\nfollowing financial obligations should be carefully noted and taken into account in the budget expenses for\nthe semester or academic year during which they are done, to wit:\na. P 300.00 Application for Graduation\nb. P 100.00 Diploma / Diploma Folder P 150.00\nc. Annual Yearbook (Darangen) P 550.00\nd. An NSTP fee of P 50.00 must be paid each semester for two semesters during the first two\nyears. Students are supposed to enroll the said subjects as prescribed in their curriculum\ne. Alumni fee P 200.00\nf. Rental (Cap and Gown) P 50.00\nIII. Special Fees\nThe following fees are imposed under certain conditions:\nP 100.00 – fine for late registration per day but not to exceed 10 days\nP 20.00 – change in matriculation involving and additional subject substitution of one subject\nfor another, or dropping of a subject\nP 20.00 – validating test taken outside the regular period for validation per subject\nP 10.00 – laboratory deposit for loss or breakage of University property (refundable)\nP 50.00 – transcript fee per page\nP 50.00 – certification for graduation\nP 30.00 – certification of enrollment for one semester only, etc.\nP 20.00 – for certification not covered by any rules",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p081",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "the BOR. Meanwhile, all expenses and fees above mentioned are waived in compliance to the",
    "content": "Note: All amounts for the special fees shall be subject for revision and subsequent approval of the APC or\nthe BOR. Meanwhile, all expenses and fees above mentioned are waived in compliance to the\nUniversal Access to Free Tertiary Education Act otherwise known as RA 10931.\nIV. Computation of Grade for Maintenance and Gaining of Scholarship and Study Grant\nThe computation of Grade Maintenance shall be by Cumulative Grade Point Average (CGPA).\na. The maintenance grade requirement shall not be imposed during the first semester to provide for\nthe adjustment of students in college.\nb. Full and Partial scholarships can be gained within the first two (2) semesters of study in the\nUniversity. Gaining of Scholarships is computed at 1.75 CGPA or better.\nGrading System for all Degree or Professional Courses\nThe academic performance of students shall be graded at the end semester in accordance with the\nfollowing system:\nA. Grading System for All Degrees or Professional Courses\n1.0\n1.25 Excellent\n1.5\n1.75 Very Good\n2.0\n2.25 - Good\n2.5 Satisfactory\n2.75\n3.0 - Passing\n5.0 - Failure\nINC - Incomplete\nA mark of “INC” is given if a student, whose class standing throughout the semester is PASSING, fails\nto appear for the final examination due to an illness or other valid reasons. If, in the opinion of the Dean, the\nabsence from the examination is justifiable, the student may be given consideration and be given a special set\nof examination. In case the class standing is not passing and the student fails to take the final examination for\nany reason, a grade of “5.0” is given. “INC” is also given for work that is of passing quality, however, some part\nof which is, for good reason unfinished. The deficiency indicated by the grade of “INC” must be removed within\nthe prescribed time, otherwise, the grade becomes “5.0”. The period for the removal of grades of “Incomplete”\nmust not extend beyond an academic year from the time the grade was received. The one-year academic period\nallowed for the removal shall be interpreted as extending to the semestral removing period immediately\nfollowing the one-year allowance. If a student passes an examination for the removal of an “INC”, he shall be\ngiven a final grade of “3.00” or better. If he fails, the final grade shall be “5.00”.\nRe-examination shall be permitted only for the purpose of removing grades of “INC”. A student who\nhas received a passing grade in a given course is not allowed re-examination for the purpose of improving his\ngrade.\nB. Grading System for Technology Course\n“E” (Excellent) - Passing\n“S” (Satisfactory) - Passing\n“INC” (Incomplete) - Failure until Removed\n“U” Unsatisfactory - Failure",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p082",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "Completion of Grades",
    "content": "Completion of Grades\nAll “Incomplete (INC)” grades should be completed on or before the close of registration of the ensuing\nsemester.\nV. Academic Policies and Guidelines\nMaximum Academic Load for Cross-Registration\nThe total number of units of credit for which a student may register in two or more colleges or schools\nin the University shall not exceed the maximum allowed by the rules on academic load.\nFrom Another Institution\nOn cross-registrants from other universities, no student registered in any other institution shall be\nadmitted to the University without a written permit from his Dean, Director, or Registrar. The permit shall state\nthe number of units for which the student will be registered and the subject that he will be authorized to take\nin the University.\nMindanao State University shall give NO credit for any subject taken by its students in any other\nuniversities, colleges or schools, unless the taking of that subject has been authorized in writing beforehand by\nthe Vice Chancellor for Academic Affairs, upon the written recommendation of the Department Chairman and\nDean or Director concerned. The authorization shall be noted and recorded by the University Registrar or his\nrepresentative and shall specify and describe the subject authorized and indicate the semester, school year,\nand the name of school where the subject is taken. The school shall be limited to another MSU campus with\nvery high quality/standard. Otherwise, the student shall be given no credit for courses taken without prior\napproval.\nPhysical Education Requirements\nBasic Physical Education is a pre-requisite for graduation. All students shall comply with the\nrequirements during their freshmen and sophomore years.\nEight (8) units of P.E. are required for all undergraduate students.\nChanging of Classes\nAll transferees to other classes after registration shall be made only for valid reasons. No change of\nmatriculation involving the taking of a new subject shall be allowed after 12% of regular class meeting have\nbeen held. Changes in matriculation shall be allowed by means of the Change of Matriculation Form and must\nbe recommended by the Adviser, approved by the Dean and submitted to the Registrar for assessment and\nnotation, and upon payment of P 20.00 for every change of subject.\nDropping of Course\nA student may, with the consent of his instructor and Dean, drop a subject by filling out the prescribed\nform, provided that he is not currently enjoying a scholarship or grant. If after three-fourths of the hours\nprescribed for the course has elapsed, the instructor concerned shall be requested to state whether or not the\nstudent shall be given a grade of “5.0” for the course.\nRegistration privileges of any student who drops a course without the approval of his Dean shall be\ncurtailed or entirely withdrawn.\nStudents who are aspiring for graduation with honors must make sure dropping of course/s will not\nresult to underloading which disqualifies any graduating student with such distinction.\nSubstitution of Subjects\nSubstitution of subject course may be allowed upon petition of the student concerned under the\nfollowing conditions: (1) must be recommended by the Adviser and the Head of the department concerned; (2)\nmust be approved by the Dean concerned. In case the action of the Dean is adverse to the recommendation of",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p083",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "possible; if not, the subjects must carry about the same number of units as the latter.",
    "content": "the Adviser and the Head of the department concerned, the student may appeal to the Vice Chancellor for\nAcademic Affairs, whose decision shall be final; (3) must involve subjects within the same department, if\npossible; if not, the subjects must carry about the same number of units as the latter.\nEvery petition for substitution must be based on at least one of the following: (1) when a student is\npursuing a curriculum that has been superseded by a new one and the substitution tends to bring the old\ncurriculum in line with the new; (2) conflict of hours between a required subject and other required subjects;\n(3) when the required subject is not given.\nAll petitions for substitution must be submitted to the Office of the Dean concerned before 12 regular\nmeetings have been held during the semester. Any petition submitted thereafter shall not be considered for the\nfollowing semester.\nNo substitution shall be allowed for any subject prescribed in the curriculum in which the student has\nfailed or received a grade of “5.0” except when, in the opinion of the department offering the prescribed subject,\nthe proposed substitute covers substantially the same subject matter as the required subject.\nAttendance Requirements\nThe rules on attendance, unless otherwise specifically provided, shall be followed in all colleges and\nunits of the University, including the National Service Training Program and Physical Education.\nAny student who, for unavoidable cause, is obliged to be absent from the class must obtain an excuse\nslip from his Dean to be presented to the instructor concerned not later than the second session of the class\nafter the date of the student’s return.\nA certificate of illness must be secured from the University Physician. An illness causing absence from\nclass shall be reported by the sick student concerned to the University Infirmary within three days after his\nabsence.\nExcuses are for time missed only. All work covered by the class during his absence shall be made up to\nthe satisfaction of the instructor within a reasonable time.\nWhenever a student has been absent from his class from two consecutive class meetings, a report\nthereof should be sent by the faculty member concerned to the Registrar, through his Dean. The Registrar shall\ncall the student and notify his parents immediately.\nWhen the number of hours lost by absence in one semester reaches 20 percent of the hours of\nrecitation, lecture, laboratory or any other scheduled work in one subject for that semester, the student shall\nbe dropped from the class roll. If the majority of absences are excused, the student shall not be given a grade of\n“5.0” but a grade of “dropped”. Time lost by late enrollment shall be considered as time lost by absence.\nProlonged leave of absence must be sought by a written petition to the Dean. The petition must state\nthe reason of which the leave is desired and must specify the period of the leave which must not exceed one\nacademic year.\nFor leave of absence availed of during the second half of the semester, the faculty member concerned\nshall be required to indicate the class standing of the student (passing or failing) at the time of the application\nfor the leave. No application for the leave of absence shall be approved without indicating the student’s class\nstanding by the instructor concerned. This information, however, should not be entered in the official report of\ngrades.\nIf a student withdraws after three-fourths of the total number of hours prescribed for the course has\nelapsed, his instructor may give him a grade of “5.0” if his class standing up to the time of withdrawal is below\n“3.0”.\nNo leave of absence shall be granted later than two weeks before the last day of classes during the\nsemester. If the inability of the student to continue with his classes is due to illness or similar justifiable causes,\nhis absence during this period shall be considered. In such a case, the student shall be required to apply an\nexcuse letter and shall present the excuse slip to the faculty members concerned.\nA student, whose withdrawal from the college is without formal leave of absence, shall have his\nregistration privileges curtailed or entirely withdrawn.\nAny student under scholarship and /or grant may apply for a sick leave of absence for justifiable reason\nduly certified to and recommended by the University Physician without forfeiting his scholarship and/or grant.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p084",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "Maximum Residency Rule",
    "content": "Such privilege can only be granted for a total period of one academic year or its equivalent. Only two (2) sick\nleaves of absence can be allowed during the entire duration of the scholarship and/or grant. A third leave of\nabsence automatically forfeits the student from the enjoyment of the scholarship and/or grant.\nMaximum Residency Rule\nThe tenure of the students in Mindanao State University is limited to a maximum of six years for the\nconferment of a degree in a four-year program, or seven years in a five-year program, provided that this policy\nshall not apply to part-time students enrolling in not more than twelve (12) unit per semester and those\nadmitted under special programs which normally require longer time for students to complete the course\nrequirements; and provided further that special cases shall be at the discretion of the President of the\nUniversity upon recommendation of the Dean of College.\nThe effectivity of the maximum residency rule started in the AY 1973-74.\nHonorable Dismissal\nA student in good standing who desires to severe his connection with his college shall present to the\nRegistrar a written petition signed by his parent or guardian to this effect. If the petition is granted, the student\nshall be given an honorable dismissal. Without such petition and favorable action, no record of honorable\ndismissal shall be issued.\nAll indebtedness to the University shall be settled before a statement of honorable dismissal be issued.\nThe statement shall indicate that the withdrawing student is in good standing as far as his character and\nconduct is concerned. If the student has been dropped from the roll on account of poor scholarship, a statement\nto the effect shall be added to the honorable dismissal.\nGraduate with Academic Honors\nAll students who garnered the following Cumulative Grade Point Average shall be awarded as Highest\nHonors in the University and is given during their graduation, to wit:\n1.0 – 1.20 – Summa Cum Laude\n1.21 – 1.45 – Magna Cum Laude\n1.46 – 1.75 – Cum Laude\nStudents aspiring to graduate with academic honors must enroll not lower than fifteen (15) units per\nsemester. This is strictly enforced.\nGraduate with Distinct University Award\nThe University Student Leadership Award (USLA) is the highest leadership award that the Mindanao\nState University affords to a student as a recognition of his/her potentials, performance and achievements as a\nTOTAL LEADER, one who is an epitome of scholastic and moral excellence, integrated personality, inspiring\nleadership, idealism, and performance and a vision that sets the awardee apart from the rest. It personifies the\ncommitment of MSU student constituents to the goals and ideals of the University leading by his/her tangible\nachievements, which are distinctly above those of his/her peers.\nMS/CWTS\nA two-year basic course in military training (MS or CWTS) for male and female students is required for\ngraduation, as established and maintained under the authority of RA 9163 or the NSTP Law. Except for those\nwho are exempted or disqualified, all physically-able Filipino students of undergraduate status shall comply\nwith this requirement within the first two years of residence in the University.\nDECS Order No. 9, s. 1990 further provides that “starting school year 1991-1992, no male student shall\nbe allowed to enroll in the fourth curriculum year of his academic course without having completed the CMT\nrequirement.” Please refer to RA 9163 called the National Service Training Program Act of 2001 in the last\nportion of this handbook.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p085",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "Scholastic Delinquency",
    "content": "Scholastic Delinquency\nAny student whose scholastic performance in class is below a grade of “3.0” or “passing” shall be\nsubject to the following rules:\n1. Warning. Any student who obtains final grades at the end of the semester below “3.0” in 25 percent\nto 49 percent of the total number of academic units for which he is registered shall be warned by the\nDean to improve his work.\n2. Probation. Any student who obtains at the end of the semester final grades below “3.0” in 50 percent\nof the total number of academic units enrolled shall be placed on probation for the succeeding\nsemester and his load shall be limited to the extent to be determined by the Dean; provided, that this\nshall not apply to a student who receives final grades in less than six academic unit. Probation maybe\nremoved: a.) by raising the number of units passed to over 50 percent of the total number of units in\nwhich he has final grades by passing removal examination, or waiver examinations, or by removing\nthe “INC” grades before the close of the next succeeding terms; b.) passing in more than 100 percent\nof the units in which he has final grades in the succeeding semester.\n3. Dismissal.\na. Any student, who, at the end of the semester, obtains final grades below “3.0” in at least 76\npercent of the total number of academic units enrolled in shall be dropped from the roll of his\ncollege or school; provided that this shall not apply to students who receive final grades in less\nthan nine academic units.\nb. Any student on probation in accordance with rule No. 2, who again fails in 50 percent or more\nin the total number of units enrolled in shall be dropped from the roll of his college or school.\nc. Any student dismissed under paragraphs (a) and (b) but has grades of “Inc” or “W”, may take\nremoval examination or waiver examination or may complete his grades before the next\nregistration period. His dismissal may be lifted provided that, after taking the examination,\nthe units in which his final grades are below “3” constitute less than 76 percent or 50 percent\n(see a & b ) of the academic units enrolled in. if he fails to take the removal examination before\nthe close of the next registration period, his dismissal shall be final, and he can no longer take\nremoval examinations.\nThe phrase “next registration period” in the above rule refers to the period following his\ndismissal.\nd. Any student dropped from one college or school shall not be admitted to another unit of the\nMindanao State University, however, in extraordinary cases where the student’s natural\naptitude is along another line than that where he has failed, he may, on recommendation of\nthe University Committee on Scholarship and Delinquency which may be created for said\npurpose, be allowed by the President to enroll in another college, school, or department where\nhis natural aptitude may be developed.\n4. Permanent Disqualification\na. Any student who, at the end of the semester, obtains final grades below “3” in 100 percent of\nthe academic units enrolled in shall be permanently barred from readmission to any college\nor school of the University; provided further, that this shall not apply to student who received\nfinal grades in less than 12 academic units.\nb. Likewise, any student who has dropped in accordance with rule 3 (a) or (b) and again fails, so\nthat it becomes necessary again to drop him, shall not be eligible for readmission to any college\nor school of the University.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p086",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "of “5” were due to the students authorized dropping of the subjects and not to poor",
    "content": "c. The scholarship rule regarding permanent disqualification (Rule 4), does not apply to cases\nwhere, on the recommendation of the instructor concerned, the faculty certifies that the grade\nof “5” were due to the students authorized dropping of the subjects and not to poor\nscholarship. However, if the unauthorized withdrawal takes place after the mid-term and the\nstudent’s class standing is poor; his grades of “5” shall be counted against him for the purpose\nof this scholarship rule. The Committee on Scholarship and Delinquency shall deal with this\ncases on their individual merits and shall recommend to the President that the student be\ndismissed and be allowed to transfer to another department or college or be placed on\nprobation; but in no case of readmission shall their action be lighter than probation.\nd. Any student who fails twice in any basic course shall be dismissed from the University without\nthe benefit of readmission. However, a student who fails in any major course maybe\nreadmitted to another course upon approval by the Dean of the College concerned.\n5. Scholastic Standing. For purposes of determining the scholastic standing of any student, the grades\nreceived during the summer session and the first semester of the ensuing academic year shall be\nconsidered as having been received in one semester so that the standing of the student for the ensuing\nsecond semester is the result of the computation of his summer and first semester general weighted\naverage grade, provided that, the subject’s taken during summer is/are clearly defined as a regular\noffering in a given summer in the approved curriculum the student is following.\n6. Non-admission of Dismissed Students. Non-admission of a student seeking transfer to other college\nafter having been dismissed from his/her college due to scholastic deficiency shall be enforced.\nTransfer to the two-year technology course is an exception.\n7. The application of this rules shall be under the supervision of the Registrar.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p087",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "UNIVERSITY LIBRARY",
    "content": "UNIVERSITY LIBRARY\nI. Readers Services\n(Main Library & College/Unit Libraries)\nFUNCTION\nServicing library resources and assisting clientele in the use of library and information sources.\nORGANIZATION\nFor greater accessibility to materials, the open shelf system is adopted except in the Filipiniana,\nSerials, Reserve and Depository Section.\nSERVICE HOURS\nMonday to Friday - 8:00 a.m. - 5:00 p.m.\nSaturday and Sunday - 9:00 a.m. - 4:00 p.m.\nCOLLECTION OF EACH SECTION\n1. Reference - contains a) general references which are intended to be consulted only for\nspecific or brief top call inquiry rather than to be read from cover to cover; b) the Vertical File\nmaterials; c) Audio-visual materials: microfiche, video tapes, etc.\n2. Circulation - houses the main bulk of the library collection. These books are supplemental\nmaterials to basic textbooks used in the service colleges.\n3. Filipiniana - contains library resources about Philippines regardless of authors, and those\npublished in the Philippines.\n4. Reserve -contains collateral reading materials recommended by faculty as required reading\nfor courses and for the shared use of all students enrolled in the said courses.\n5. Depository - contains materials published in the Philippines as provided in the Presidential\nDecree 812 on Legal and Cultural Deposit.\n6. Serials - contains foreign and local publications of: magazines and journals, newspapers and\nclippings.\nII. Policies and Procedures\nREQUIREMENTS\nTo avail of library facilities and services, users are required to present:\n1. University ID (countersigned in the Library of the current semester)",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p088",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "2. Borrower’s Card (validated for the current semester)",
    "content": "2. Borrower’s Card (validated for the current semester)\n3. Referral slip and ID (for outsiders)\nLENDING POLICIES\n1. For Room Use\na) Filipiniana & Reference collection\nb) Deposit publications\nc) Periodicals and newspapers\nd) Vertical File materials\ne) Clippings\nf) Audio-Visual materials\n2. Three Day Book Loan\nCirculation books for home use are usually loaned out for three days renewable for a like\nperiod unless needed by other users. Three books may be borrowed at a time.\n3. Hourly and Overnight Loan\nDue to limited copies and demand, Reserved Books are restricted to hourly and overnight\nloans.\na) Hourly Loans - two hours without renewal during the day\nb) Overnight Loans - the book may be borrowed after 3:00 pm and to be returned not\nlater than 9:00 a.m. the next working day.\n4. Photocopying\nMaterials for room use may be borrowed for 30 minutes for photocopying.\n5. Online Resources\na) Users are allowed:\n• For academic research or private study only\n• To browse and search\n• To make and save a digital copy of limited exacts from the database for academic\npurposes\n• To print out copies of limited portions for reports, essays, projects and similar\nmaterials created with appropriate acknowledgment of the sources (such as\nfootnotes, endnotes or other citations)\n• Limited extracts may be shared with other academic users\nb) Users are not allowed:\n• To sell or otherwise re-distribute data to third parties without expressed\npermission. This includes but is not limited to posting on public sources like Google\nDocs, Tableau, and others",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p089",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "• To use database or any part of the information comprised in the database content",
    "content": "• To use database or any part of the information comprised in the database content\nfor commercial research, for example, research that is done under a funding or\nconsultant contract, internship, or other relationship in which the results are\ndelivered to a for-profit organization\n• To engage in bulk reproduction or distribution of the licensed materials in any\nform\n• To engage in extensive downloading or copying of content\n• To use automated searching or querying, including, but not limited to the use of\nSpiders or other external software for text and data mining\n• To store a vast amount of data on your personal computers.\nLENDING PROCEDURES\n1. Charging of Circulation Books\na) Borrower presents the book he wants to borrow together with his ID and BC\n• Writes the call number or Barcode in the Borrower’s card and\n• Prints and signs his name in the book card.\nb) Charging Personnel\n• Examines ID, BC and book card for correct information\n• Writes dues date in BC, book card and date due slip;\n• Releases book/s to the borrower; BC, book card and ID of borrower are retained;\n• Takes down statistics and interfiles BC in the charging tray which is alphabetically\narranged by borrower.\nc) Control List for Faculty and Staff\n• Borrowing of faculty and staff list are recorded in 5’ x 8” cards called the “Control\nList”. The cards are arranged alphabetically by surname of the borrower.\n2. Discharging\na) Borrower presents the book at the charging desk\nb) Personnel gets the book card from the charging tray and initials it with written\ndate and “ret” for returned and shelves the book if it is a reserve book\nc) Borrower shelves the book if it is a circulation book.\nOVERDUE BOOKS\nAll overdue books are subject to payment of fines. For faculty and staff with overdue borrowing\nare sent with a recall notice to remind them to return the materials which are already overdue. For\nstudents with over dues, name will be posted in the bulletin board.\nFINES\n1. Assessment",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p090",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "a) Circulation books: P10.00 per book",
    "content": "a) Circulation books: P10.00 per book\nb) Reserved books: P2.00 are imposed for first hour; P20.00 for\neach full day\n2. Issue receipt based on the assessment indicated in the delinquent slip issued by the section\nconcerned.\n3. Collection should be remitted monthly to the Cashier’s Office.\n4. Submit O.R. and receipt stubs to the Auxiliary Services together with the monthly report of\ncollection.\nOUTSIDE USERS\n1. This refers to users who are not constituents of MSU.\n2. Outside users are required to present their ID and a letter of recommendation from their\nsupervisor of their institution.\n3. The user fills out the form for UL permit to use and have it approved by the Director.\n4. The user pays P5.00/day, P20.00 for a week use of the library and P200.00 for one semester.\n5. The permit is to be signed and issued by the Director or the Assistant University Librarian.\n6. The section/unit where the user is referred checks the permit form.\n7. Allowed inside reading only.\nISSUANCE OF BORROWER’S CARD\nStudents, Faculty and Staff should present:\n• Library Registration form or ID Registration;\n• Two (2) pcs. 1x1 ID Pictures (Latest);\n• COR/EBF;\n• P10.00\nFor Faculty and Staff:\nA letter of introduction from the department chairman or unit head is required for issuance of\nborrower’s card to faculty or employee of permanent/probationary status. Contractual faculty and\nemployees are not allowed to sign out library materials.\nREPLACEMENT/REAPPLICATION FOR LOST BORROWER’S CARD\n1. Filled-up/worn-out BC is replaced upon presentation and request of the user.\n2. For a lost BC, re-application is required.\na) Borrower reports the loss to the Record Section;\nb) Present an Affidavit of Loss signed by the Public Attorney’s Office (PAO) or the MSU Legal\nServices Division;",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p091",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "c) Present COR/EBF;",
    "content": "c) Present COR/EBF;\nd) 2pcs. 1xq ID picture (latest)\ne) P20.00 (Borrower’s Card fee plus penalty);\nf) The records Personnel stamps “cleared” on the back of the COR and date of the report of loss.\ng) BC will be issued after one week. Affix signature and date of issuance in the registration form and\nback of COR.\nRESPONSIBILITIES OF LIBRARY USERS\n1. Library materials borrowed should be returned by the borrower himself/or authorized\nrepresentative provided BC is presented.\n2. The limited number and period of book loans is imposed in fairness to other users. Books should be\nreturned promptly on or before the due date.\n3. Any book on loan may be recalled if:\na) In demand by clienteles;\nb) Officials of the University have an urgent need of the book;\nc) A book is to be placed on “Reserve” for a course or is to be given shorter loan period;\nd) It is overdue; or\ne) The libraries are conducting their mandated physical annual inventory.\n4. Any person who loses or fails to return a book within seven (7) days after due date or recall shall either\nreplace it with the same title and author or pay its current price value within thirty (30) days plus\n10% processing fee and a fine equivalent to 25% of the cost of the book.\n5. Fine for a lost book shall continue until it is replaced but the amount must not exceed the current price\nof the book.\nGENERAL CONDUCT\n1. Proper conduct is expected of all library users. Courtesy, politeness and respect for others should\nbe observed at all times. Loud conversation, smoking, eating and littering are deemed improper inside\nthe library.\n2. Return catalog trays, books, periodicals and chairs to their proper places after using them.\n3. Treat the library materials you use with care. Mutilating, marking or damaging materials shall be\nsubject to suspension of library privileges for not more than one (1) month and made to pay the current\nprice of the destroyed property.\nVIOLATIONS OF LIBRARY RULES AND REGULATIONS\nRepeated violations of library rules and misconduct will be justification for the curtailment of the library\nprivileges.\n1. Three times overdue - warning.\n2. Four times overdue - curtailment of borrowing privileges for one week.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "courses",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p092",
    "chapter": "Chapter II - Frontline Offices for Student Services",
    "title": "of the offense.",
    "content": "3. Misconduct - curtailment of library privileges, suspension or expulsion depending on the gravity\nof the offense.\nOTHER SERVICES\n1. Referrals\nTo avail of the facilities of other libraries, the MSU Library issues a Referral Slip. This may be\nrequested from the Office of the Director.\na. Present ID and Borrower’s Card\nb. Request for the Referral Slip from the desk in charge\nc. Fill-up slip and return for approval of the Director of Libraries.\n2. Outside Users\nAlumni and researchers from educational institutions or agencies may be allowed to avail of the\nlibrary facilities limited to room use of materials and subject to library rules and regulations.\nOutside users are required to present their IDs and a letter of recommendation/introduction from\nthe following: the librarian, head of school of agency/institution.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p094",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "UNIVERSITY CODE",
    "content": "UNIVERSITY CODE\n(Chapter 67)\nArt. 475. Conduct and Discipline. The following rules and regulations on the conduct and discipline\nof students are hereby promulgated:\nBasis of Discipline: Students at all times should observe the laws of the land and the rules and\nregulations of the University.\nArt. 476. Grounds for Discipline. No student shall be suspended, expelled or dismissed except for\ncause and after due process as provided by this Code.\nThe following shall be grounds for disciplinary action:\n1. Cheating in any form in any examination or any act of dishonesty in relation to his/her studies;\n2. Carrying within the University premises any firearms, bladed, dangerous or deadly weapon, provided\nthat this shall not apply to one who has permit from the Dean or Director of his College to possess any\nof the above-mentioned weapons in connection with his/her studies in addition to a permit from\ncompetent authorities where the carrying of such weapon is so required;\n3. Bringing, selling, keeping or drinking any alcoholic beverage within the campus of the University;\n4. Hoarding, selling, or taking, administering or giving out any regulated or prohibited drug without prior\nprescription by a duly licensed physician;\n5. Any violation of law connected with marijuana, opium, morphine and other prohibited drugs;\n6. Involvement in Illegal gambling;\n7. Threatening another student with the imputation upon his person, honor or property of any wrong\namounting to a crime;\n8. Violation of curfew hours duly prescribed by competent authorities;\n9. Vandalism of textbooks, references or other reading materials belonging to the University;\n10. Destroying any property belonging to the University;\n11. Indulging in any immoral act in and outside the campus of the University;\n12. Any student who shall, by means of force or violence, assault or attack another student shall\nsuffer the penalty of expulsion or dismissal from the University;\n13. The penalty of expulsion or dismissal from the University shall be imposed upon any student who\nshall, by means of violence, prevent another student from doing something not prohibited by law or the\nCode of the University or compel him to do something against his will, whether it be right or wrong;",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p095",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "the filing of criminal charges;",
    "content": "14. Any student carrying any firearm within the University premises, unless in connection with his\nROTC training and is duly authorized by competent authorities, shall suffer the penalty of expulsion or\ndismissal. If the firearm shall have been discharged or used to threaten another student, the penalty to be\nimposed on the offender shall also be expulsion or dismissal from the University without prejudice to\nthe filing of criminal charges;\n15. Any student carrying any firearm within the University premises, unless in connection with his\nROTC training and is duly authorized by competent authorities, shall suffer the penalty of\nexpulsion or dismissal. If the firearm shall have been discharged or used to threaten another\nstudent, the penalty to be imposed on the offender shall also be expulsion or dismissal from the\nUniversity without prejudice to the filing of criminal charges;\nThe penalty that may be imposed for any violation of numbers 1 to 11 of this Articles shall range from\nsuspension to dismissal depending on the gravity of each particular case, provided that in case where\nthe offender has previously been penalized for any offense defined in this Code, the STUDENT\nDISCIPLINE BOARD may recommend for his expulsion and/or dismissal.\nNo complaint against any student shall be given due course unless the same is in writing and subscribed\nand sworn to by the complainant. However, when initiated by the University authorities it is enough\nthat the complaint is in writing and states insubstantial recital the facts of the alleged offense.\nArt. 477. Procedure in Filling Complaint and Answer Involving Student Discipline.\na. Any or all complaints should be filed and/or indorsed to the STUDENT DISCIPLINE BOARD\nthrough the Division of Student Affairs. The Student Discipline Board shall be composed of the\nfollowing:\n1. Director, Legal Services Division ……... Chairman\n2. Director, Division of Student Affairs ……... Co-Chair\n3. President of the Faculty Association ……... Member\n4. One Senior Employee from the Office of the\nVice President for Academic Affairs ……… Member\n5. Chief Security Officer ……… Member\n6. University Registrar ……… Member\n7. SSG President ……… Member\nProvided that the Directors of Legal Services Division and Division of Student Affairs as well\nas the University Registrar may appoint any of their senior staff to act in their place and stead.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p096",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "manner:",
    "content": "Even before the actual constitution of the STUDENT DISCIPLINE BOARD for any particular case, any\ncomplaint filed or indorsed to the Board through the DSA shall be proceeded within the following\nmanner:\n1. The Director of the DSA or his representative confers with the Director of the Legal Services\nDivision or the latter’s representative to determine whether or not a prima facie case exist. The\nrespondent shall be notified in writing of the charge against him, attaching to said notice copies of\ncomplaint sworn statements and other documents submitted and the respondent shall be\nallowed not less than seventy-two hours to answer the charges in writing under oath. In the notice, the\nrespondent shall be informed that he is entitled the assistance of a lawyer and he should indicate\nwhether or not he elects a formal investigation if his answer is not considered satisfactory. If the\nanswer is found satisfactory the SDB shall recommend dismissal of the case.\n2. While the notice to the respondent is being served, the OVPAA and the Dean of the respondent shall\nbe notified for record purposes.\n3. Even if a respondent does not request a formal investigation, one shall nevertheless be conducted\nwhen from the complaint and the answer including their supporting documents the merits of the case\ncannot be decided judiciously without conducting such an investigation.\nArt. 478. Hearing. Hearing by the SDB shall begin not later than one week after receipt of the respondent’s\nanswer or after expiration of the period within which the respondent should answer.\nArt. 479. Frequency and Duration of Hearing. In the interest of speedy justice, the SDB shall hold a hearing\nat least once a week until the case has been resolved. In case of failure to adhere to these rules,\nwritten explanation in every case shall be submitted by the Board Chairman to the University\nPresident. No hearing on any case shall last beyond two (2) calendar months.\nArt. 480. Notice of Hearing. All parties concerned shall be notified of the date set for hearing at least two (2)\ndays before such hearing. The respondent, may defend himself personally or by counselor\nrepresentative of his own choice. If the complainant or the respondent should desire but is unable\nto secure the services of a counsel, he should manifest such fact to the SDB before the date set for\nhearing and shall designate a counsel for him from among members of the University constituents.\nArt. 481. Failure to Appear at Hearing. Should either complainant or respondent fail to appear for the initial\nhearing after due notice and without sufficient cause the SDB shall note this fact and thereafter\nproceed to hear the case exparte without prejudice to the appearance of the absent party in\nsubsequent hearings.\nArt. 482. Postponement. The SDB on the application of either the complainant or the respondent or in its\nown motion, may at its discretion and for good cause, postpone the hearing for such period of time\nas the ends of justice and the rights of the parties for speedy hearing require. As much as possible,\npostponement should be limited to a maximum of three (3) days.\nArt. 483. Amicable Settlement. Amicable settlement made by and between the parties (complainant and\nrespondent) will not prevent the University from proceeding with the case for the purpose of\ninstilling discipline among the studentry.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p097",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "forwarded to the OVPAA within fifteen (15) days after the termination of the hearing. The",
    "content": "Art. 484. Comment and Recommendations. The complete records of the case, with the report of findings\nthereon and the recommendation signed by a majority of the members of the committee shall be\nforwarded to the OVPAA within fifteen (15) days after the termination of the hearing. The\nrecommendation shall state the findings of facts and the specifics on which it is based.\nArt. 485. Action by OVPAA. The OVPAA shall submit within ten (10) days after the receipt of the Board\nreport, a recommendation to the President of the University.\nArt.486. Action by the President. The decision of the University President shall be rendered within ten\n(10) days after receipt of the recommendation of the OVPAA. All decisions of suspensions not\nexceeding one year must be confirmed by the Board of Regents; provided, that the President cannot\nimpose but only recommend cases of expulsion and/ or dismissal to the Board of Regents. All\ndecisions not needing the confirmation of the Board may be appealed to the Board within ten (10)\ndays after the respondent received the copy of the decision.\nArt. 487. How an Appeal is Made. An appeal shall be made, within ten (10) days after the respondent has\nreceived a copy of the decision, by filing to the President the notice of appeal. The appeal shall not\nin anyway stay, the decision appealed.\nArt. 488. Action by the Board of Regents. If the Board deems the appeal meritorious, especially in the cases\nof recommendations for expulsion and/or dismissal, it shall refer the pertinent records to a\ncommittee of its members for review. Said committee shall submit a report thereon with its\nrecommendations at the next meeting of the Board.\nArt. 489. Motion for Reconsideration. If the respondent has filed a petition for reconsideration with the\nPresident, and such petition for reconsideration is denied by the President, he may still file an\nappeal to the Board of Regents, provided the same is submitted within ten (10) days following\nnotice of denial of the reconsideration.\nArt. 490. Effect of Decision. In case final decision involving suspension or dismissal is rendered within\nthirty (30) days prior to any final examination, the penalty shall take effect during the subsequent\nsemester except when the respondent is graduating in which case the penalty shall immediately\ntake effect.\nArt. 491. Records. All proceedings before the SDB shall be put in writing by a competent\nstenographer/typist. All original records pertaining to student discipline shall be under the\ncustody of the Director of Student Affairs. Such records are hereby declared confidential and no\nperson shall have access to the same for the inspection or copying unless he/she is involved\ntherein, or unless he has legal right that cannot be protected or vindicated without access or\ncopying of such records. Any University official or employee who shall violate the confidential\nnature of such records shall be subject to disciplinary action.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p098",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "any unit of the University.",
    "content": "Art. 492. Sanctions. The penalty of expulsion or dismissal shall carry with it the accessory penalty of\nwithholding graduation or permanent disqualification of the respondent to continue studying in\nany unit of the University. The penalty of suspension shall carry with the accessory penalty of\nforfeiture of the privilege to enjoy scholarships benefits, and dormitory and library facilities, during\nthe period of suspension. The gravity of the offense committed and the circumstances attending its\ncommission shall determine the nature of disciplinary action taken against the student and shall be\nreported to his parents or guardians. Refusal to submit to the jurisdiction of the University by any\nperson not enrolled at the time a charge against him is filed shall prejudice his future enrollment in\nany unit of the University.\nArt. 493. Summary Action. Any provision in these rules notwithstanding a Dean or Director may upon the\nrecommendation of the SDB, immediately suspend for a period not exceeding fifteen (15) days any\nstudent in his/her unit for any breach of order or discipline. The order of suspension shall state the\nground, the circumstances showing the responsibility of the student and the period of suspension.\nBefore the order or suspension is served on the student copy thereof shall be furnished to the\nPresident, the Vice President for Academic Affairs and the Director of Student Affairs. The order of\nsuspension may be appealed to the President. If the appeal of any suspension made under this article\nis filed with the University President, the latter may order the holding in abeyance of the suspension.\nIf no such order is made within two (2) days after the appeal is filed, the suspension shall take effect.\nArt. 494. Definition. The following terms shall have their meanings set forth for the purpose of these\nregulations:\na. “STUDENT” shall include any person enrolled in any academic unit of the University on regular\nor part-time basis at the time the charge or report involving him/her is filed. Regardless of\nwhether or not he/she enrolled in any unit of the University during the pendency of the\ndisciplinary proceeding against him.\nb. “LAWS OF THE LAND” shall refer to the general statutes currently in force within the Republic\nof the Philippines with particular reference to the Revised Penal Code and Civil Code.\nc. “BOARD” shall refer to the SDB unless explicitly stated otherwise.\nd. “OFFICIAL REPORT” shall include any report duly submitted in writing to any proper authority\nin the University by a faculty member, any member of the University security force, any official\nof a college or unit, or any official of the university administration.\nANTI-HAZING ACT OF 2018\nRepublic Act No. 11053\nAn Act Prohibiting Hazing and Regulating Other Forms of Initiation Rites of Fraternities, Sororities, and Other\nOrganizations, and Providing Penalties for Violations thereof, amending for the purpose Republic Act No. 8049,",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p099",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "Organizations and Providing Penalties Therefor”.",
    "content": "Entitled “An Act Regulating Hazing and Other Forms of Initiation Rites in Fraternities, Sororities, and\nOrganizations and Providing Penalties Therefor”.\nSECTION 1. A new section to be denominated as Section is hereby inserted in Republic Act. No. 8049, to read\nas follows:\n“SEC. 1. Short title. – This Act shall be known as the “Anti-Hazing Act of 2018”.\nSECTION 2. Section 1 of the same Act is hereby amended to read as follows:\n“SEC. 2. Definition of Terms. – As used in this Act:\n“(a) Hazing refers SEC 2. (A) HAZING refers to any act that results in physical or psychological suffering,\nharm, or injury inflicted on a recruit, neophyte, applicant, or member as part of an initiation rite or practice\nmade as a pre-requisite for admission or a requirement for continuing membership in a fraternity, sorority, or\norganization including but not limited to, paddling, whipping, beating, branding, forced calisthenics, exposure\nto the weather, forced consumption of any food, liquor, beverage, drug or other substance, or any other brutal\ntreatment or forced physical activity which is likely to adversely affect the physical and psychological health of\nsuch recruit, neophyte, applicant, or member. This shall also include any activity, intentionally made or\notherwise, by one person alone or acting with others, that tends to humiliate or embarrass, degrade, abuse or\nendanger by requiring a recruit, neophyte, applicant, or member to do mental, silly or foolish tasks.\n“(b) Initiation or Initiation Rites – refer to ceremonies, practices, rituals, or other acts, whether formal\nor informal, that a person must perform or take part in order to be accepted into a fraternity, sorority, or\norganization as a full-fledged member. It includes ceremonies, practices, rituals, and other acts in all stages of\nmembership in a fraternity, sorority or organization.\n“(c) Organization refers to an organized body of people which includes, but not limited to, any club,\nassociation, group, fraternity, and sorority. This term shall include the Armed Forces of the Philippines (AFP),\nthe Philippine National Police (PNP), the Philippine Military Academy (PMA), the Philippine National Police\nAcademy (PNPA), and other similar uniformed service learning institutions.\n“(d) Schools refer to colleges, universities, and all other educational institutions.”\nSECTION 3. A new section to be denominated as Section 3 is hereby inserted in the same Act to read as follows:\nSEC. 3. Prohibition on Hazing – All forms of hazing shall be prohibited in fraternities, sororities, and\norganizations in schools, including citizens’ military training and citizens’ army training. This prohibition shall",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p100",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "certificate.",
    "content": "likewise apply to all other fraternities, sororities, and organizations that are not school-based, such as\ncommunity-based and other fraternities, sororities, and organizations. Provided, that the physical, mental, and\npsychological testing and training procedures and practices to determine and enhance the physical, mental,\nand psychological fitness of prospective regular members of the AFP and the PNP as approved by the Secretary\nof National Defense and the National Police Commission, duly recommended by the Chief of Staff of the AFP\nand the Director General of the PNP, shall not be considered as hazing for purposes of this Act. Provided, further,\nThat the exception provided herein shall likewise apply to similar procedures and practices approved by the\nrespective heads of other uniformed learning institutions as to their prospective members, nor shall this\nprovision apply to any customary athletic events or other similar contests or competitions or any activity or\nconduct that furthers a legal and legitimate objective, subject to prior submission of a medical clearance or\ncertificate.\n“In no case shall hazing be made a requirement for employment in any business or corporation.”\nSECTION 4. Section 2 of the same Act is hereby amended to read as follows:\n“Sec. 4. Regulation of School-Based Initiation Rites – Only initiation rites or practices that do not\nconstitute hazing shall be allowed: Provided, That:\n“(a) A written application to conduct initiation rites shall be made to the proper authorities of the\nschool not later than seven (7) days prior to the scheduled initiation date;\n“(b) The written application shall indicate the place and date of the initiation rites and the names of\nthe recruits, neophytes, or applicants to be initiated and the manner by which they will conduct the initiation\nrites;\n“(c) Such written application shall further contain an undertaking that no harm of any kind shall be\ncommitted by anybody during the initiation rites;\n“(d) The initiation rites shall not last more than three (3) days;\n“(e) The application shall contain the names of the incumbent officers of the fraternities, sororities,\nand organization and any person or persons who will take charge in the conduct of initiation rites;\n“(f) The application shall be under oath with a declaration that it has been posted in the official school\nbulletin board, the bulletin board of the office of the fraternities, sororities, or organization, and two (2) other\nconspicuous places in the school or in the premises of the organization; and",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p101",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "of the initiation rites.",
    "content": "“(g) The application shall be posted from the time of submission of the written notice to the school\nauthorities or head of organization and shall only be removed from its posting three (3) days after the conduct\nof the initiation rites.\n“The school, fraternity, sorority, or organization shall provide for their respective bulletin boards for\npurposes of this section.\n“Guidelines for the approval or denial of the application to conduct initiation rites by a registered\nfraternities, sororities, or organization shall be promulgated by the appropriate school officials not later than\nsixty (60) days after the approval of this Act. The appropriate school authorities shall have the obligation to\ndisapprove the application to conduct initiation rites that do not conform with any of the requirements of this\nsection, and the reasons thereof shall be stated clearly and in unequivocal terms in a formal advice to the\nfraternities, sororities, or organization concerned, taking into consideration the safety and security of\nparticipants in the activity.\n“Schools officials shall have the authority to impose, after due notice and summary hearing,\ndisciplinary sanctions, in accordance with the school’s guidelines and regulations on the matter, which shall\ninclude, but shall not be limited to, reprimand, suspension, exclusion, or expulsion, to the head and all other\nofficers of the fraternity, sorority, or organization which conducts an initiation without first securing the\nnecessary approval of the school as required under this section. All members of the fraternity, sorority, or\norganization, who participated in the unauthorized initiation rites, even if no hazing was conducted, shall also\nbe punished accordingly.\n“In case the written application for the conduct of initiation rites contains false or inaccurate\ninformation, appropriate disciplinary sanctions in information, appropriate disciplinary sanctions in\naccordance with the school’s guidelines and regulations on the matter ranging from reprimand to expulsion\nshall be imposed, after due notice and summary hearing, against the person who prepared the application or\nsupplied the false and inaccurate information and to the head and other officers of the fraternity, sorority, or\norganization concerned.\nSECTION 5. Section 3 of the same Act is hereby amended to read as follows:\n“Sec. 5. Monitoring of Initiation Rites. - The head of the school or an authorized representative must\nassign at least two (2) representatives of the school to be present during the initiation. It is the duty of the\nschool representatives to see to it that no hazing is conducted during the initiation rites, and to document the\nentire proceedings. Thereafter, said representatives who were present during the initiation rites to the\nappropriate officials of the school regarding the conduct of the said initiation: Provided, That if hazing is still\ncommitted despite their presence, no liability shall attach to them unless it is proven that they failed to perform\nan overt act to prevent or stop the commission thereof.”\nSECTION 6. A new section to be denominated as Section 6 is hereby inserted in the same Act to read as follows:",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p102",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "jurisdiction not later than sixty (60) days from the approval of this Act.",
    "content": "“Sec. 6. Registration of Fraternities, Sororities, or Other Organizations. – All existing fraternities,\nsororities, and other organizations otherwise not created or organized by the school but has existing members\nwho are students or plans to recruit students to be its members shall be required to register with the proper\nschool authorities before it conducts activities whether on or off-campus, including recruitment of members.\n“A newly established fraternities, sororities, or organization in a school shall immediately register with\nthe proper school authorities during the semester or trimester in which it was established or organized:\nProvided, That the new fraternities, sororities, or organization has complied with the requirements prescribed\nby the school in establishing a fraternities, sororities, or organization: Provided, further, That schools shall\npromulgate their guidelines in the registration of fraternities, sororities, and organizations within their\njurisdiction not later than sixty (60) days from the approval of this Act.\n“Upon registration, all fraternities, sororities, and organizations shall submit a comprehensive list of\nmembers, which shall be updated not later than thirty (30) days from the start of every semester or trimester,\ndepending on the academic calendar of the school.\n“School officials shall have the authority to impose, after due notice and summary hearings,\ndisciplinary penalties in accordance with the school’s guidelines and regulations on the matter including\nsuspension to the head and other officers of the fraternities, sororities, or organization who fail to register or\nupdate their roster of members as required under this section.\n“Failure to comply with any of the requirements in this section shall result in the cancellation of the\nregistration of the fraternity, sorority, or organization.”\nSECTION 7. A new section to be denominated as Section 7 is hereby inserted in the same Act to read as follows:\n“SEC. 7. Faculty Adviser – Schools shall require all fraternities, sororities, and organizations, as a\ncondition to the grant of accreditation or registration, to submit the name or names of their faculty adviser or\nadvisers who must not be members of the respective fraternity, sorority, or organization. The submission shall\nalso include a written acceptance or consent on the part of the selected faculty adviser or advisers.\n“The faculty adviser or advisers shall be responsible for monitoring the activities of fraternities,\nsororities, or organization. Each faculty adviser must be a duly recognized active member, in good standing, of\nthe faculty at the school in which the fraternities, sororities, or organization is established or registered.\n“In case of violation of any of the provisions of this Act, it is presumed that the faculty adviser has\nknowledge and consented to the commission of any of the unlawful acts stated therein.”",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p103",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "activities that involve hazing.",
    "content": "SECTION 8. A new section to be denominated as Section 8 is hereby inserted in the same Act to read as follows:\n“SEC. 8. Role of Educational Institutions. – The responsibility of schools to exercise reasonable\nsupervision in loco parentis over the conduct of its students requires the diligence that prudent parents would\nemploy in the same circumstance when disciplining and protecting their children. To this end, it shall be the\nduty of schools to take more proactive steps to protect its students from the dangers of participating in\nactivities that involve hazing.\n“Schools shall implement an information dissemination campaign as the start of the semester or\ntrimester to provide adequate information to students and parents or guardians regarding the consequences\nof conducting and participating in hazing.\n“An orientation program relating to membership in a fraternity, sorority, or organization shall also be\nconducted by schools at the start of every semester or trimester.\nSchools shall encourage fraternities, sororities, and organizations to engage in undertakings that foster\nholistic personal growth and development and activities that contribute to solving relevant and pressing issues\nof society”\nSECTION 9. A new section to be denominated as Section 9 is hereby inserted in the same Act to read as follows:\n` “SEC. 9. Registration of Community-Based and Other Similar Fraternities, Sororities, or Organizations. –\nAll new and existing community-based fraternities, sororities, or organizations, including their respective local\nchapters, shall register with the barangay, municipality, or city wherein they are primarily based.\n“Upon registration, all community-based fraternities, sororities, or organizations, including their\nrespective local chapters, shall submit a comprehensive list of members and officers which shall be updated\nyearly from the date of registration.”\nSECTION 10. A new section to be denominated as Section 10 is hereby inserted in the same Act to read as\nfollows:\n“SEC. 10. Regulation of initiation Rites for Community-Based Fraternities, Sororities, or Organizations. –\nOnly initiation rites or practices that do not constitute hazing shall be allowed: Provided, That:\n“(a) A written application to conduct the same shall be made to the punong barangay in the barangay\nor the municipal or city mayor in the municipality or city where the community-based fraternity, sorority, or\norganization is based, not later than seven (7) days prior to the scheduled initiation date;",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p104",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "the recruits, neophytes, or applicants to be initiated;",
    "content": "“(b) The written application shall indicate the place and date of the initiation rites and the names of\nthe recruits, neophytes, or applicants to be initiated;\n“(c) Such written application shall further contain an undertaking that no harm of any kind shall be\ncommitted by anybody during the initiation rites;\n“(d) A medical certificate of the recruit, neophyte, or application must be attached to the application to\nensure fitness to undergo initiation when it involves physical activity not falling under the definition of hazing\nas used in this Act;\n“(e) The initiation rites shall not last more than three (3) days;\n“(f) The application shall contain the names of the incumbent officers of the community-based\nfraternity, sorority, or organization and any person or persons who will take charge in the initiation rites;\n“(g) The application shall be under oath with a declaration that it has been posted on the official\nbulletin board of the barangay hall or the municipal or city hall where the community-based fraternity, sorority,\nor organization is based, and on the bulletin board of the office of the community-based fraternity, sorority, or\norganization; and\n“(h) The application shall be posted from the time of submission of the written notice to the punong\nbarangay or municipal or city mayor and shall only be removed from its posting three (3) days after the conduct\nof the initiation rites.”\nSECTION 11. A new section to be denominated as Section 11 is hereby inserted in the same Act to read as\nfollows:\n“SEC. 11. Monitoring of Initiation Rite of Community-Based and All Similar Fraternities, Sororities, or\nOrganizations. – The punong barangay of the barangay or the municipal or city where the community-based\nfraternity, sorority, or organization is based must assign at least two (2) barangay or municipal or city officials\nto be present during the initiation and to document the entire proceedings. Thereafter, said representatives\nwho were present during the initiation shall make a report of the initiation rites to the punong barangay, or the\nmunicipal or city mayor regarding the conduct of the initiation: Provided, that if hazing is still committed\ndespite their presence, no liability shall attach to them unless it is proven that they failed to perform an overt\nact to prevent or stop the commission thereof.”\nSECTION 12. A new section to be denominated as Section 12 is hereby inserted in the same Act to read as\nfollows:",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p105",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "the parties.",
    "content": "“SEC. 12. Nullity of Waiver and Consent. – Any form of approval, consent, or agreement, whether written\nor otherwise, or of an express waiver of the right to object to the initiation rite or proceeding which consists of\nhazing as defined in this Act, made by a recruit, neophyte, or applicant prior to an initiation rite that involves\ninflicting physical or psychological suffering, harm, or injury, shall be void and without any binding effect on\nthe parties.\n“The defense that the recruit, neophyte, or applicant consented to being subjected to hazing shall not\nbe available to persons prosecuted under this Act.”\nSECTION 13. A new section to be denominated as Section 13 is hereby inserted in the same Act to read as\nfollows:\n“SEC. 13. Administrative Sanctions. – The responsible officials of the school, the uniformed learning\ninstitutions, the AFP or the PNP may impose the appropriate administrative sanctions, after due notice and\nsummary hearing, on the person or the persons charged under this Act even before their conviction.”\nSECTION 14. Section 4 of the same Act is hereby amended to read as follows:\n“SEC 14. Penalties. – The following penalties shall be imposed:\n“(a) The penalty of reclusion perpetua and a fine of three million pesos (P3,000,000.00) shall be\nimposed upon those who actually planned or participated in the hazing if, as a consequence of the hazing, death,\nrape, sodomy, or mutilation results therefrom;\n“(b) The penalty of reclusion perpetua and a fine of Two million pesos (P2,000,000.00) shall be imposed\nupon:\n“(1) All persons who actually planned or participated in the conduct of hazing;\n“(2) All officers of the fraternity, sorority, or organization who are actually present during the hazing;\n“(3) The adviser of a fraternity; sorority; or organization who is present when the acts constituting the\nhazing were committed and failed to take action to prevent the same from occurring or failed to promptly\nreport the same to the law enforcement authorities if such adviser or advisers can do so without peril to their\nperson or their family;\n“(4) All former officers, non-resident members, or alumni of the fraternity, sorority, or organization\nwho are also present during the hazing; Provided, That should the former officer, non-resident member, or\nalumnus be a member of the Philippine Bar, such member shall immediately be subjected to disciplinary",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p106",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "Board;",
    "content": "proceedings by the Supreme Court pursuant to its power to discipline members of the Philippine Bar: Provided,\nfurther, That should the former officer, non-resident member, or alumnus belong to any other profession\nsubject to regulation by the Professional Regulation Commission (PRC), such professional shall immediately be\nsubjected to disciplinary proceedings by the concerned Professional Regulatory Board, the imposable penalty\nfor which shall include, but is not limited to, suspension for a period of not less than three (3) years or\nrevocation of the professional license pursuant to this section may be reinstated upon submission of affidavits\nfrom at least three (3) disinterested persons, good moral certifications from different unaffiliated and credible\ngovernment, religious, and socio-civic organizations, and such other relevant evidence to show that the\nconcerned professional has become morally fit for readmission into the profession: Provided, That said\nreadmission into the profession shall be subject to the approval of the respective Professional Regulatory\nBoard;\n“(5) Officers or members of a fraternity, sorority, or organization who knowingly cooperated in\ncarrying out the hazing by inducing the victim to be present thereat; and\n“(6) Members of the fraternity, sorority, or organization who are present during the hazing when they\nare intoxicated or under the influence of alcohol or illegal drugs;\n“(c) The penalty of reclusion temporal in its maximum period and a fine of one million pesos\n(P1,000,000.00) shall be imposed upon all persons who are present in the conduct of the hazing;\n“(d) The penalty of reclusion temporal and a fine of one million pesos (P1,000,000.00) shall be imposed\nupon former officers, non-resident members, or alumni of the fraternity, sorority, or organization who, after\nthe commission of any of the prohibited acts proscribed herein will perform any act to hide, conceal, or\notherwise hamper or obstruct any investigation that will be conducted thereafter: Provided, That should the\nformer officer, non-resident member, or alumnus be a member of the Philippine Bar, such member shall\nimmediately be subjected to disciplinary proceedings by the Supreme Court pursuant to its power to discipline\nmembers of the Philippine Bar: Provided, further, That should the former officer, non-resident member, or\nalumnus belong to any other profession subject to regulation by the Professional Regulation Commission\n(PRC), such professional shall immediately be subjected to disciplinary proceedings by the concerned\nProfessional Regulatory Board, the imposable penalty for which shall include, but is not limited to, suspension\nfor a period of not less than three (3) years or revocation of the professional license pursuant to this section\nmay be reinstated upon submission of affidavits from at least three (3) disinterested persons, good moral\ncertifications from different unaffiliated and credible government, religious, and socio-civic organizations, and\nsuch other relevant evidence to show that the concerned professional has become morally fit for readmission\ninto the profession: Provided, That said readmission into the profession shall be subject to the approval of the\nrespective Professional Regulatory Board;\n“(e) The penalty of prision correccional in its minimum period shall be imposed upon any person who\nshall intimidate, threaten, force, or employ, or administer any form of vexation against another person for the\npurpose of recruitment in joining or promoting a particular fraternity, sorority, or organization. The persistent\nand repeated proposal or invitation made to a person who had twice refused to participate or join the proposed\nfraternity, sorority, or organization, shall be prima facie evidence of vexation for purposes of this section; and",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p107",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "sanctions it may impose, as well as provide assistance to police authorities.”",
    "content": "“(f) A fine of one million pesos (P1,000,000.00) shall be imposed on the school if the fraternity, sorority,\nor organization filed a written application to conduct an initiation which was subsequently approved by the\nschool and hazing occurred during the initiation rites or when no representatives from the school were present\nduring the initiation as provided under Section 5 of this Act: Provided, That if hazing has been committed in\ncircumvention of the provision of this Act, it is incumbent upon school officials to investigate motu proprio and\ntake an active role to ascertain factual events and identify witnesses in order to determine the disciplinary\nsanctions it may impose, as well as provide assistance to police authorities.”\n“The owner or lessee of the place where hazing is conducted shall be liable as principal and penalized\nunder paragraphs (a) or (b) of this section, when such owner or lessee has actual knowledge of the hazing\nconducted therein but failed to take any action to prevent the same from occurring or failed to promptly report\nthe same to the law enforcement authorities if they can do so without peril to their person or their family. If the\nhazing is held in the home of one of the officers or members of the fraternity, sorority, or organization, the\nparents shall be held liable as principals and penalized under paragraphs (a) or (b) hereof when they have\nactual knowledge of the hazing conducted therein but failed to take any action to prevent the same from\noccurring or failed to promptly report the same to the law enforcement authorities if such parents can do so\nwithout peril to their person or their family.\n“The school authorities including faculty members as well as barangay, municipal, or city officials shall\nbe liable as an accomplice and likewise be held administratively accountable for hazing conducted by\nfraternities, sororities, and other organizations, if it can be shown that the school or barangay, municipal, or\ncity officials allowed or consented to the conduct of hazing or where there is actual knowledge of hazing, but\nsuch officials failed to take any action to prevent the same from occurring or failed to promptly report to the\nlaw enforcement authorities if the same can be done without peril to their person or their family.\n“The presence of any person, even if such person is not a member of the fraternity, sorority, or\norganization, during the hazing is prima facie evidence of participation therein as a principal unless such person\nor persons prevented the commission of the acts punishable herein or promptly reported the same to the law\nenforcement authorities if they can so without peril to their person or their family.\n“The incumbent officers of the fraternity, sorority, or the organization concerned shall be jointly liable\nwith those members who are actually participated in the hazing.\n“Any person charged under this Act shall not be entitled to the mitigating circumstance that there was\nno intention to commit so grave a wrong.\n“This section shall apply to the president, manager, director, or other responsible officer of businesses\nor corporations engaged in hazing as a requirement for employment in the manner provided herein.\n“Any conviction by final judgment shall be reflected in the scholastic record, personal, or employment\nrecord of the person convicted, regardless of when the judgment of conviction has become final.”",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p108",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "follows:",
    "content": "SECTION 15. A new section to be denominated as Section 15 is hereby inserted in the same Act to read as\nfollows:\n“SEC. 15. Implementing Rules and Regulations (IRR). – The Commission on Higher Education (CHED),\ntogether with the Department of Education (DepEd), Department of Justice (DOJ), Department of the Interior\nand Local Government (DILG), Department of Social Welfare and Development (DSWD), AFP, PNP, and National\nYouth Commission (NYC), shall promulgate the IRR within ninety (90) days from the effectivity of this Act.”\nSECTION 16. Separability Clause. – If any provision or part of this Act is declared invalid or unconstitutional,\nthe other parts or provisions hereof shall remain valid and effective.\nSECTION 17. Repealing Clause. – Republic Act No. 8049 and all other laws, decrees, executive orders,\nproclamations, rules or regulations or parts thereof which are inconsistent with or contrary to the provisions\nof this Act are hereby amended or modified accordingly.\nSECTION 18. Effectivity Clause. – This Act shall take effect fifteen (15) days after its publication in the Official\nGazette or in at least two (2) national newspapers of general circulation.\nApproved,\n(SGD) PANTALEON D. ALVAREZ Speaker of the House of\nRepresentative\n(SGD) AQUILINO “koko” PIMENTEL III\nPresident of the Senate\nThis Act which is a consolidation of the Senate Bill No. 1662 and House Bill No. 6573 was passed by\nthe Senate and the House of Representatives on March 12, 2018 and March 13, 2018, respectively.\n(SGD) CESAR STRAIT PAREJA\nSecretary General House of Representative\n(SGD) LUTGARDO B. BARBO\nSecretary of the Senate\nApproved: JUNE 29, 2018\n(SGD) RODRIGO ROA DUTERTE\nPresident of the Philippines",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p109",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "Republic Act No. 7079",
    "content": "Republic Act No. 7079\nAN ACT PROVIDING FOR THE DEVELOPMENT\nAND PROMOTION OF CAMPUS JOURNALISM AND FOR OTHER PURPOSES\nBe it enacted by the Senate and House of Representatives of the\nPhilippines in Congress Assembled\nSECTION 1. Title- This act shall be known and referred to as the “Campus Journalism Act of 1991.”\nSECTION 2. Declaration of Policy- It is the declared policy of the State to uphold and protect the freedom of\nthe press even at the campus level and promote the development and growth of campus journalism as a means\nof strengthening ethical values, encouraging critical and creative thinking, and developing moral character and\npersonal discipline of the Filipino youth. In furtherance of this policy, the State shall undertake various\nprograms and projects aimed at improving the journalistic skills of students concerned and promoting\nresponsible and free journalism.\nSECTION 3. Definition of terms.\na) School- An institution of learning in the elementary, secondary or tertiary level\ncomprised of the studentry, administration, faculty and non-faculty personnel.\nb) Student Publication- The issue of any printed materials that is independently published by, and which\nmeets the needs and interests of the studentry.\nc) Student Journalist- Any bona fide student enrolled for the current semester or term who has passed or\nmet the qualification and standards of the editorial board. He/She must likewise maintain a satisfactory\nacademic standing.\nd) Editorial Board- In the tertiary level, the editorial board shall be composed of student journalists who\nhave qualified in placement examinations. In the case of elementary and high school levels, the board shall\nbe composed of a duly appointed faculty adviser, the editor who qualified and a representative of the\nparents-teachers’ Association, who will determine the editorial policies to be implemented by the editor\nand staff members of the student publication concerned.\ne) Editorial Policies- A set of guidelines by which a student publication is operated and managed, taking into\naccount pertinent laws as well as school administration’s policies. Said guidelines shall determine the\nfrequency of publication, the manner of selecting articles and features and other similar matters.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p110",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "of students selected by fair and competitive examinations.",
    "content": "SECTION 4. Student Publication- The student body through an editorial board and publication staff composed\nof students selected by fair and competitive examinations.\nOnce the publication is established, its editorial board shall freely determine its editorial policies and\nmanage the publication’s funds.\nSECTION 5. Funding of Student Publication – Funding for the student publication may include the savings of\nthe respective school’s appropriations, student subscriptions, donations, and other sources of funds.\nIn no instance shall the Department of Education, Culture and Sports or the school administration\nconcerned withhold the release of funds sourced from the savings of the appropriations of the respective\nschools and other sources intended for student publication.\nSubscription fees collected by the school administration shall be released automatically to the student\npublication concerned\nSECTION 6. Publication Adviser- The publication adviser shall be selected by the school administration from\na list of recommended submitted by the publication staff. The function of the adviser shall be limited to one of\ntechnical guidance.\nSECTION 7. Security of Tenure- A member of the publication staff must maintain his or her status as student\nin order to retain membership in the publication staff. A student shall not be expelled/suspended solely on the\nbasis of articles he or she has written, or on the basis of the performance of his or her duties in the student\npublication.\nSECTION 8. Press conference and Training Seminars- The Department of Education, Culture and Sports\nshall sponsor periodic competitions, press conferences and training seminars in which student-editors/writers\nand teacher advisers of student publication in the elementary, secondary and tertiary levels shall be held at the\ninstitutional, divisional and regional levels, culminating with the holding of the annual elementary, secondary\nor tertiary School Press Conferences in the places of historical and/or cultural interest in the country.\nSECTION 9. Rules and Regulations- The Department of Education, Culture and sports in coordination with\nthe officers of the national elementary, secondary tertiary organizations or official advisers of student\npublications, together with the student journalist at the tertiary level and existing organizations of student\njournalists, shall promulgate the rules and regulations necessary for the effective implementation of this Act.\nSECTION 10. Tax Exemption- Pursuant to paragraph 4, section 4, Article XIV of the Constitution, all grants,\nendowments, donations or contributions used actually directly and exclusively for the promotion of campus\njournalism as provided for in this Act shall be exempt from donor’s or gift tax.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p111",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "in the General Appropriations Act.",
    "content": "SECTION 11. Appropriations- For the initial year of implementation, the sum of Five million pesos\n(5,000,000.00) is hereby authorized to be charged against the savings from the current appropriations of the\nDepartment of Education, Culture and Sports. Thereafter, such amount as may be necessary shall be included\nin the General Appropriations Act.\nSECTION 12. Effectivity- This act shall take effect after fifteen (15) days following the completion of its\npublication in the Official Gazette or in at least two (2) newspapers of general publication.\nRepublic Act No. 7877\nAN ACT DECLARING SEXUAL HARASSMENT\nUNLAWFUL IN THE EMPLOYMENT, EDUCATION,\nOR TRAINING ENVIRONMENT AND FOR OTHER PURPOSES.\nSECTION 1. Title- This act shall be known as the “Anti-Sexual Harassment Act of 1995.”\nSECTION 2. Declaration Policy- The State shall value the dignity of every individual, enhance development of\nits human resources, guarantee full respect for human rights, and uphold the dignity of workers, employees,\napplicant for employment students or those undergoing training, instruction or education. Toward this end. All\nforms of sexual harassment in the employment, education, or training environment are hereby declared\nunlawful.\nSECTION 3. Work, Education or Training-related Sexual Harassment Defined- Work, education or training\nrelated to sexual harassment is committed by an employment; employee, manager, supervisor, agent of\nemployer, teacher instructor, professor, coach, trainor, or any person who, having authority, influence or moral\nascendancy over another in a work or training or education environment, demands, request or otherwise\nrequires any sexual favor from the other, regardless of whether the demand , request or requirement for\nsubmission is accepted by the object of said Act.\na) In a work-related or employment environment sexual harassment committed when:\n1. The sexual favor is made as a condition in the hiring or in the employment, re-employment or\ncontinued employment of said individual, or in granting said individual favorable compensation,\nterms, conditions, promotion or privileges, or refusal to grant the sexual favor results in limiting,\nsegregating or classifying the employee which in any way would discriminate, deprive or diminish\nemployment opportunities otherwise adversely affect said employee.\n2. The above Acts would impair the employee’s rights or privileges under existing labor laws; or\n3. The above Acts would result in an intimidating, hostile, or offensive environment for the employee.\nb) In education or training environment, sexual harassment is committed.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p112",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "1. Against one who is under the care, custody or supervision of the offender;",
    "content": "1. Against one who is under the care, custody or supervision of the offender;\n2. Against one whose education, training, apprenticeship or tutorship is entrusted to the offender;\n3. When the sexual favor is made a condition to the giving of a passing grade, or the granting of honors\nand scholarships, or the payment of a stipend, allowance or other benefits, privileges, or consideration;\nor\n4. When the sexual advances result in an intimidating, hostile or offensive environment for the student,\ntrainee or apprentice.\nAny person who directs or induces another to commit any Act of sexual harassment as herein defined, or who\ncooperates in the commission thereof by another without which it would not had been committed, shall be also\nheld in liable under this Act.\nSECTION 4. Duty of the Employer of Office in a Work-related, Education or Training Environment – It\nshall be the duty of the employer or the head of the work-related educational or training environment or\ninstitution, to prevent or deter the commission of acts of sexual harassment and to provide the procedures for\nthe resolution, settlement or prosecution of acts of sexual harassment. Toward this end, the employer or head\nof the office shall:\na. Promulgate appropriate rules and regulations in consultation with and jointly approved by the\nemployees or students or trainees, through their duly designated representatives, prescribing the\nprocedure for the investigation of sexual harassment cases and administrative sanctions thereof.\nAdministrative sanctions shall not be a bar to prosecution in the proper courts for unlawful acts\nof sexual harassment.\nThe said rules and regulations issued pursuant to this sub-section (a) shall include, among the others,\nguidelines on proper decorum in the workplace and educational or training institutions. (b) Create a committee\non decorum and investigation of cases on sexual harassment. The committee shall conduct meetings, as the\ncase may be, with officers and employees, teachers, instructors, professors, coaches, trainers and students or\ntrainees to increase understanding and prevent incidents of sexual harassment. It shall also conduct the\ninvestigation of alleged cases constituting sexual harassment.\nIn the case of work-related environment, the committee shall be composed of at least one (1)\nrepresentative each from the management, the union, if any the employees from the supervisory rank, and from\nthe rank and employees.\nIn the case of the educational training institutions, the committee shall be composed of at least one (1)\nrepresentative from the administration, the trainers, teachers, instructors, professors or coaches and students\nor trainees, as the case may be.\nThe employer or the head of office, educational or training institution shall disseminate or post a copy\nof this Act for the information of all concerned.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p113",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "action is taken thereon.",
    "content": "SECTION 5. Liability of the Employer, Head of Office, Educational or training institution – The employer\nor head of office, educational or training institution shall be solely liable for the damages arising from the acts\nof sexual harassment committed in the employment, education or training environment if the employer or the\nhead of office, educational or training institution is informed of such acts by the offended and no immediate\naction is taken thereon.\n`\nSECTION 6. Independent Action for Damages – Nothing in this Act shall preclude the victim of work,\neducation or training-related sexual harassment from instituting a separate and independent action for\ndamages and other affirmative relief.\nSECTION 7. Penalties. Any person who violates the provision of this Act shall upon conviction, be penalized\nby imprisonment of not less than one (1) month nor more than six months, or a fine of not less than Ten\nthousand pesos (10,000.00), nor more than Twenty thousand pesos (20,000.00), or both such fine and\nimprisonment at the discretion of the court.\nAny action arising from the violation of the provisions of this Act shall prescribe in three (3) years.\nSECTION 8. Separability Clause. If any portion on provision of this Act is declared void or unconstitutional,\nthe remaining portions or provisions hereof or provisions hereof shall not be affected by such declaration.\nSECTION 9. Repealing Clause. All laws, decrees, orders, rules and regulations, other issuances or parts thereof\ninconsistent with the provisions of this Act are hereby repealed or modified accordingly.\nSECTION 10. Effectivity Clause – This Act shall take effect fifteen (15) days after this complete publication in\nat least two (2) national newspapers of the general circulations.\nThis Act which is a consolidation of House Bill No. 9425 and Senate Bill No. 1632 was finally passed by\nthe House of Representatives and the Senate on February 8, 1995.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p114",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "Republic Act No. 9163",
    "content": "Republic Act No. 9163\nAN ACT ESTABLISHING THE NATIONAL SERVICE TRAINING\nPROGRAM (NSTP) FOR TERTIARY LEVEL STUDENTS,\nAMENDING FOR THE PURPOSE REPUBLIC ACT NO. 7077 AND\nPRESIDENTIAL DECREE NO. 1706, AND FOR OTHER PURPOSE.\nBe it enacted by the Senate and House of Representatives\nin Congress Assembled\nSECTION 1. Short Title – This Act shall be known as the “National Service TRAINING Program (NSTP) Act\nof 2001.”\nSECTION 2. Declaration of Policy – It is hereby affirmed the prime duty of the government to serve and\nprotect its citizens. In turn, it shall be the responsibility of all citizens to defend the security of the State and in\nfulfillment thereof, the government may require its citizens to render personal, military and civil service.\nRecognizing the youth’s vital role in nation-building, the state shall promote civic consciousness among\nthe youth and shall develop their physical, moral, spiritual, intellectual and social well-being. It shall inculcate\nin the youth patriotism, nationalism, and advance their involvement in public and civic affairs.\nIn pursuit of these goals, the youth, the most valuable resources of the nation, shall be motivated,\ntrained, organized and mobilized in military training, literacy, civic welfare and other similar endeavors in the\nservice of the nation.\nSECTION 3. Definition of Terms- For the purpose of this Act, the following are hereby defined as follows:\n(a) “National Service Training program (NSTP)” is a program aimed at enhancing civic consciousness\nand defense preparedness in the youth by developing the ethics of service and patriotism while\nundergoing training in any of its three (3) program components. Its various components are specially\ndesigned to enhance the youth’s active contribution to the general welfare.\n(b) “Reserve Officer Training Corps (ROTC)” is a preparation institutionalized under Section 38 and 39\nof the Republic Act No. 7077 designed to provide military training to tertiary level students in order to\nmotivate, train, organize and mobilize them for national defense preparedness.\n(c) “Literary Training Service” is a program designed to train students to become teachers of literacy\nand numeracy skills to school children, out of school youth, and other segments of society in need of\ntheir service.",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p115",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "recreation and morals to the citizenry.",
    "content": "(d) “Civic Welfare Training Service” refers to programs or activities contributory to the general welfare\nand the betterment of life for the members of the community or the enhancement of its facilities,\nespecially those devoted to improving health education, environment, entrepreneurship, safety\nrecreation and morals to the citizenry.\n(e) “Program Component” shall refer to the service components of the NSTP as enumerated in Section\n4 of this Act.\nSECTION 4. Establishment of the National Service Training Program. There is hereby established a\nNational Service Training Program (NSTP), which shall form part of the curricula of all baccalaureate degree\ncourses and of at least two (2)- year technical-vocational courses and is a requisite for graduation, consisting\nof the following service components:\n(1) The Reserve Officers Training Corps (ROTC), which is hereby made\noptional and voluntary upon the effectivity of this Act;\n(2) The Literacy Training Services; and\n(3) The Civic Welfare Training Service\nThe ROTC under the NSTP shall instill patriotism, respect for rights of civilians, and adherence to the\nConstitution, among others. Citizenship training shall be given emphasis in all three (3) program\ncomponents.\nThe Commission on Higher Education (CHED) and Technical Education and Skills Development\nAuthority (TESDA), in consultation with the Department of National Defense (DND), Philippine Association of\nState Universities and Colleges (PASUC), Coordinating Council of Private Educational Association of the\nPhilippines (COCOPEA) and other concerned government agencies, may design and implement such program\ncomponents as may be necessary in consonance with the provisions of this Act.\nSECTION 5. Coverage- Students, male and female, of any baccalaureate degree course or at least two (2)-year\ntechnical-vocational courses in public and private educational institutions shall be required to complete one\n(1) of the NSTP components as requisite for graduation.\nSECTION 6. Duration and Equivalent Course Unit- Each of the aforementioned NSTP program components\nshall be undertaken for an academic period of two (2) semesters.\nSECTION 7. NSTP Offering in Higher and Technical- Vocational Educational institutions- All higher and\ntechnical-vocational institutions, public and private, must offer at least one of the program components:\nProvided, that the State Universities and Colleges offer ROTC component and at least one other component as\nprovided herein; provided, further, that private higher and technical-vocational education institutions may also",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p116",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "Philippines (AFP), CHED and TESDA to which schools are identified.",
    "content": "offer ROTC if they have at least three hundred and fifty (350) cadet students. In offering the NSTP whether\nduring the semestral or summer periods, clustering of affected students from different educational institutions\nmay be done, taking into account logistics, branch of service and geographical considerations. Schools that do\nnot meet the required number of students to maintain the optional ROTC and any of the NSTP components\nshall allow their students to cross-enroll to other schools irrespective of whether or not the NSTP components\nin said schools are being administered by the same or another branch of service in the Armed Forces of the\nPhilippines (AFP), CHED and TESDA to which schools are identified.\nSECTION 8. Fees and Incentives- Higher and technical-vocational institutions shall not collect any fee for any\nof the NSTP components except basic tuition fees which shall not be more than fifty percent (50%) of what is\ncurrently charged by schools per unit. In the case of the ROTC, the DND shall formulate and adopt a program of\nassistance and/or incentives to those who will take the said component.\nSECTION 9. Scholarship- There is hereby created special Scholarship Program for qualified students taking\nthe NSTP which shall be administered by the CHED TESDA. Funds for this purpose shall be included in the\nannual regular appropriations of the CHED and TESDA.\nSECTION 10. Management of the NSTP Components- The school authorities shall exercise academic and\nadministrative supervision over the design, formulation, adoption and implementation of the different NSTP\ncomponents in their respective schools: Provided, that in case CHED or TESDA accredited non-government\norganization (NGO) has been contracted to formulate and administer a training module for any NSTP\ncomponents, such academic and administrative supervision shall be exercised jointly with the accredited NGO.\nProvided, further, that such training modules shall be accredited by CHED and TESDA. The CHED and TESDA\nregional offices shall oversee and monitor the implementation of the NSTP under their jurisdiction to\ndetermine if the training is being conducted in consonance with the objectives of this Act. Periodic reports shall\nbe submitted to the CHED, TESDA and DND in this regard.\nSECTION 11. Creation of the National Service Reserve Corps- There is hereby created a National Service\nReserve Corps, to be composed of the graduates, non-ROTC components. Members of this Corps may be tapped\nby the Senate for literacy and civic welfare activities through the joint effort of the DND, CHED and TESDA.\nGraduate of the ROTC shall form part of the Citizens Armed Force, pursuant to Republic Act No. 7077\nSECTION 12. Implementing Rules- The DND, CHED and TESDA shall have the joint responsibility for the\nadoption of the implementing rules of this Act within sixty (60) days from the approval of this Act.\nThese three (3) shall consult with the other concerned government agencies, the PASUC and COCOPEA, NGOs\nand recognized student organizations in drafting the implementing rules. The implementing rules shall include\nthe guidelines for the adoption of the appropriate curriculum for each of the NSTP components as well as for\nthe accreditation of the same.\nSECTION 13. Transitory Provisions- Students who have yet to complete the Basic ROTC, except those falling\nunder Section 14 of this Act, may either continue in the program component they are currently enrolled or shift\nto any of the other program components of their choice: Provided, that in case he shifts to another program\ncomponents, the Basic ROTC courses he/she has completed shall be counted for the purpose of completing the",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p117",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "complete the NSTP in that component.",
    "content": "NSTP requirement; Provided, further, that once he has shifted to another program component, he shall\ncomplete the NSTP in that component.\nSECTION 14. Suspension of ROTC Requirement- The completion of ROTC training as a requisite for\ngraduation is hereby set aside for those students who despite completing all their academic units as of the\neffectivity of this Act have not been allowed to graduate.\nSECTION 15. Separability Clause- If any section or provision of this Act shall be declared unconstitutional or\ninvalid, the other sections or provisions not affected thereby shall remain in full force and effect.\nSECTION 16. Amendatory Clause- Section 35 of Commonwealth Act No. 1, Executive Order No. 207 of 1939,\nSection 2 and 3 of Presidential Decree No. 1706, and Section 38 and 39 of Republic Act No. 7077, as well as all\nlaws, decrees, orders, rules and regulations and other issuance inconsistent with the provisions of this Act\nhereby deemed amended and modified accordingly.\nSECTION 17. Effectivity- This Act shall take effect fifteen (15) days after its publication in two (2) newspapers\nof national circulation, but implementation of this Act shall commence in the school year of 2002-2003.\nEXECUTIVE ORDER NO. 200\nBY THE PRESIDENTS OF THE PHILIPPINES\nCODE OF STUDENT RIGHTS\nWHEREAS, it is in interest of the State and Society that the college and university education, in both\npublic and private institutions, provide facilities therein for academic development as condition for intelligent\nsocial participation; and\nWHEREAS, it is necessary for the attainment of this objective, that rapport be promoted between\nschool authorities and students by establishing student rights and defining student responsibilities;\nNOW, THEREFORE I, FERDINAND E. MARCOS, President of the Philippines, by virtue of the powers\nvested in me by law, do hereby promulgate the following Manual or Student Rights and Responsibilities.\nSECTION 1. Student rights- Every student enrolled in post-secondary course in college or university\nauthorized or recognized by the government shall, among other things, enjoy the following rights.\na) The right to organize a free student government that can administer, legislate and adjudicate within its\napproved constitutional jurisdiction;\nb) The right to be represented on all policy-determining bodies of the educational institution, through the\nduly authorized student government representative, whenever policies relating to curriculum student",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p118",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "the provisions of the law; and",
    "content": "discipline, and the use or collection of student fees, funds, and contributions are considered for adoption\nor amendment. This right shall be exercised by participation in the discussion and by voting subject to\nthe provisions of the law; and\nc) The right to establish and issue within the bounds of law, good morals and school regulations and\nobjectives, regular student-controlled publications free from censorship, or any pressure aimed at\ncontrolling editorial policy or staff appointments; Provided, That the publication expense shall be paid\nout from student funds.\nSECTION 2. Student Responsibilities- Every student enrolled in a post-secondary course in a college or\nuniversity authorized or recognized by the government shall among other things, bear the following\nresponsibilities;\na) The responsibility to fulfill the duties imposed upon him/her by his/her duly constituted student\ngovernment or other legally constituted student officers or organizations to which he/she has\nvoluntarily affiliated;\nb) The responsibility to recognize and comply with the policies and regulations concerning school duties,\ncampus activities and discipline within the school;\nc) The responsibility, in his/her publications, to abide by laws of the land, school regulations and the ethics\nof journalism.\nSECTION 3. Implementing Rules and Regulations- The Secretary of Education shall issue the appropriate\nrules and regulations including such sanctions as maybe necessary to implement the provisions of this order.\nSECTION 4. This Order shall take effect immediately- Executive Order No. 170 dated February 19, 1969, is\nhereby revoked.\nDone in the City of Manila, this fifth day of December in the year of our Lord, Nineteen Hundred and\nSixty-Nine.\n(SGD.) FERDINAND E. MARCOS\nPresident of the Philippines",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p121",
    "chapter": "Chapter III - Code of Discipline and Laws",
    "title": "DEGREE PROGRAMS OFFERED IN MSU-MAIN CAMPUS",
    "content": "DEGREE PROGRAMS OFFERED IN MSU-MAIN CAMPUS\nCollege of Agriculture:\na. Bachelor of Science in Agricultural Business Management\nb. BSA Agronomy\nc. BSA Animal Science\nd. BSA major in Extension Education\ne. BSA Farming Systems\nf. BS Agricultural & Bio Systems Engineering\ng. BSA Horticulture\nh. BSA Agricultural Food Processing\ni. DAT Crop Production\nj. DABMT Food Processing\nCollege of Business Administration and Accountancy:\na. Bachelor of Science in Accountancy\nb. Bachelor of Science in Business Administration (BSBA)\nBusiness Economics\nc. Bachelor of Science in Business Administration (BSBA)\nEconomics\nd. Bachelor of Science in Business Administration (BSBA)\nManagement\ne. Bachelor of Science in Business Administration (BSBA)\nHuman Resource Management\nf. Bachelor of Science in Business Administration (BSBA)\nEntrepreneurial Marketing\ng. Bachelor of Science in Business Administration (BSBA) Marketing Management\nh. Bachelor of Science in Business Administration (BSBA) Entrepreneurship\nCollege of Education:\na. Bachelor of Secondary Education (BSED) Biology\nb. Bachelor of Secondary Education (BSED) English\nc. Bachelor of Secondary Education (BSED) Filipino\nd. Bachelor of Secondary Education (BSED) History\ne. Bachelor of Secondary Education (BSED) Mathematics\nf. Bachelor of Secondary Education (BSED) Physics\ng. Bachelor of Secondary Education (BSED) Technology and\nLivelihood Education\nh. Bachelor of Secondary Education (BSED) Sciences\ni. Bachelor of Secondary Education (BSED) Social Studies\nj. Bachelor of Elementary Education (BEED) major in Early\nChildhood Education & Development\nk. Bachelor of Elementary Education (BEED) major in General Education\nl. BTVTED Home Economics\nm. BTLED Bachelor of Technology and Livelihood Education major in Home Economics",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "discipline",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p122",
    "chapter": "Chapter IV - Colleges and Courses Offered",
    "title": "College of Engineering:",
    "content": "College of Engineering:\na. Bachelor of Science in Chemical Engineering\nb. Bachelor of Science in Civil Engineering\nc. Bachelor of Science in Electronics Engineering\nd. Bachelor of Science in Electrical Engineering\ne. Bachelor of Science in Mechanical Engineering\nDivision of Engineering Technology\na. BS in Engineering Technology (Construction Engineering\nManagement)\nb. BS in Engineering Technology (Electrical and Renewable\nEnergy)\nc. BS in Engineering Technology (Machining and Fabrication)\nd. Diploma in Technology major in Construction Technology\ne. Diploma in Technology major in Machine Shop Technology\nCollege of Fisheries:\na. Bachelor of Science in Fisheries\nb. Diploma in Technology major in Fish Processing\nc. Diploma in Technology major in Aquaculture\nCollege of Forestry and Environmental Studies:\na. Bachelor of Science in Forestry\nb. Bachelor of Science in Forestry major in Agroforestry\nc. Bachelor of Science in Environmental Science",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p123",
    "chapter": "Chapter IV - Colleges and Courses Offered",
    "title": "College of Health Sciences:",
    "content": "College of Health Sciences:\na. Bachelor of Science in Nursing\nCollege of Hotel and Restaurant Management:\na. Bachelor of Science in Hospitality Management\nb. Bachelor of Science in Tourism Management\nc. Basic Courses:\n• Bread and Pastry Production\n• Cookery\n• Housekeeping\n• Front Office\n• Tour Guiding Services\n• Food and Beverage Services\nCollege of Information Technology:\na. Bachelor of Science in Computer Science\nb. Bachelor of Science in Information System\nc. Bachelor of Science in Entertainment and Multimedia\nComputing\nd. Bachelor of Science in Information Technology (Major in\nNetworking, Database System)\nKing Faisal Center for Islamic, Arabic and Asian Studies:\na. Bachelor of Arts in Islamic Studies (Shari’ah)\nb. Bachelor of Science in Teaching Arabic\nc. Bachelor of Science in International Relations\nCollege of Natural Sciences and Mathematics:\na. Bachelor of Science in Biology\nb. Bachelor of Science in Chemistry\nc. Bachelor of Science in Mathematics\nd. Bachelor of Science in Physics\ne. Bachelor of Science in Statistics\nf. Bachelor of Science in Zoology\ng. BS Biology major in Animal Biology",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p124",
    "chapter": "Chapter IV - Colleges and Courses Offered",
    "title": "College of Public Affairs:",
    "content": "College of Public Affairs:\na. Bachelor of Science in Community Development\nb. Bachelor of Science in Sustainable Community\nDevelopment\nc. Bachelor of Public Administration\nd. Bachelor of Science in Social Work\nCollege of Social Sciences and Humanities:\na. Bachelor of Arts in History\nb. Bachelor of Arts in Psychology\nc. Bachelor of Science in Psychology\nd. Bachelor of Arts in Filipino\ne. Bachelor of Arts in Panitikan\nf. Bachelor of Arts in History Philippine and Asian History\nTrack\ng. Bachelor of Arts in History – Public Development Track\nh. Bachelor of Arts in History – International History Track\ni. Bachelor of Arts in Sociology\nj. Bachelor of Arts in Philosophy\nk. Bachelor of Library and Information Science\nl. Bachelor of Science in Development Communication\nm. Bachelor of Arts in Communication Studies\nn. Bachelor of Arts in Journalism\no. Bachelor of Science in Communication Arts\np. Bachelor of Arts in English\nq. Bachelor of Arts in English Language Studies\nr. Bachelor of Arts in Political Studies\nCollege of Sports, Physical Education and Recreation:\na. Bachelor of Science in Physical Education\nCollege of Law:\na. Bachelor of Laws\nCollege of Medicine:\na. Doctor of Medicine",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p125",
    "chapter": "Chapter IV - Colleges and Courses Offered",
    "title": "Graduate School:",
    "content": "Graduate School:\nPh.D. in Science Education (DOST consortium)\n• Biology\n• Mathematics\n• Physics\nPh.D. in Educational Management\nPh.D. in Language Studies\nPh.D. in Philippine Studies\nDoctor of Public Administration (DPA)\nMaster of Science in Animal Science\nMaster of Science in Farming Systems\nMaster of Science in Biology\nMaster of Science in Physics\nMaster of Science in Mathematics\nMSCIED Secondary Mathematics\nMaster of Science in Physical Education\nMaster of Science in Community Development\nMaster of Public Administration\n• Organization & Management\n• Public Personnel Administration\n• Public Fiscal Administration\n• Local Government Administration\n• Human Resources Management\nMaster of Science in Teaching\n• Elementary Mathematics\n• Elementary Science\n• General Science\n• Physical Science\nMaster of Arts in Education\n• School Administration\n• Guidance & Counseling\n• Reading\nMaster of Arts in Filipino\nMaster of Arts in Language Studies\nMaster of Arts in English Language Teaching\nMaster of Arts in Psychology (Social Psychology)\nMaster of Arts in Peace & Development Studies\nMaster of Arts in Philippine Studies\nMaster of Arts in History\nMaster of Arts in Global Studies (American Studies)\nMaster of Arts in Islamic Studies (Muslim Law)\nMaster of Arts in Nursing (Nursing Administration)\nCertificate in Governmental Management",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p126",
    "chapter": "Chapter IV - Colleges and Courses Offered",
    "title": "Certificate in Professional Teaching",
    "content": "Certificate in Professional Teaching\nCertificate in Statistics\nDiploma in Islamic Studies\nDiploma in Community Development\nProfessional Diploma in Physical Education",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "courses"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p128",
    "chapter": "Appendix",
    "title": "MSU MAIN CAMPUS ACADEMIC CALENDAR",
    "content": "MSU MAIN CAMPUS ACADEMIC CALENDAR\nTentative School Year 2020-2021\n1st Semester\n2020-2021\n2nd Semester\n2020-2021\nSummer 2019\n1. Special SASE Examination/CET\nExamination\n2. Enrolment for Freshmen/New\nStudents\n3. Enrollment for Old students\n4. Last Day for Validation of\nEnrollment and Billing Forms\n(EBF)\n5. Last Day for Changing Academic\nStatus\n6. Last Day for Submission of\nCompletion Grades\nFor INC Grades Incurred:\na) 2nd sem 2018-2019\nb) Summer 2018/1st\nsem 2019-2020\n7. Late Registration with fines\n8. START OF CLASSES\nCET-Jul 5 2020\nSASE-Nov 8 2020\nMo, 20 Jul-Fr, 24 Jul\nMo, 27 Jul-Th, 30 Jul\nTh, 30 Jul\nFr, 7 Aug\nMo, 3 Aug\nMo, 3 Aug\nMo, 3 Aug\nMo, 4 Jan-Fr, 8 Jan\nFr, 8 Jan\nFr, 8 Jan\nMo, 11 Jan\nMo, 11 Jan\nMo, 11 Jan\nM,31May-F,4Jun\nFr, 4 Jun\nMo, 7 Jun\nMo, 7 Jun\n9. Change/Add Matriculation and\nValidation period\n10. Last Day for Submission of\nTentative List of Candidates for\nGraduation (with Evaluation\nSheets)\n11. General Convocation & College\nOrientation Program___________\n12. MSU 58th Foundation Day\n13. Last Day for submission of any\nappeal from any Graduating\nstudents re: Graduation Matters to\nthe Committee on Appeals\n14. First Preliminary Department\nExaminations:\na) Mathematics\nb) Chemistry\nc) Physics\n15. First Preliminary\nExaminations (all others)\n16. Period of Dropping Subjects\nMo, 3 Aug-Fr, 7 Aug\nMo, 17 Aug\n(includes Summerians\n2019)\nTu, 1 Sept\nMo, 7 Sept\nMo,14 Sept whole day\nTu, 15 Sept a.m.\nTu, 15 Sept p.m.\nWe, 16 Sept-\nSat, 19 Sept\nMo, 28 Sept-Fr, 9 Oct\nMo, 11Jan-Fr, 15Jan\nWe, 20 Jan\n(includes\nSummerians 2020)\nMo, 15 Feb\nMo,15Feb whole day\nTue, 16 Feb a.m.\nTue, 16 Feb p.m.\nWe, 17 Feb-\nFr, 19 Feb\nMo, 22Feb- Fr, 5Mar\n17. Special Committee of MSU\nMain Campus Council Meeting\n18. Removal/Completion Period\nof Previous INC grades of\nGraduating Students\n19. MSU Main Campus Council\nMeeting\n20. MSU System Council Meeting\n21. Crème de la Crème\n22. Second Preliminary\nDepartment Examinations:\na) Mathematics\nb) Chemistry\nc) Physics\n23. Second Preliminary\nExaminations (all others subjects)\n24. Last Day for Graduating\nStudents to Clear their\nDeficiencies Other than the\nCurrently Taking Courses\n25. Pre-enrollment for Incoming\nSemester for Graduating Students\n29. Last day for Filling Leave of\nAbsence for graduating students\nWe, 23 Sept\nMo, 5 Oct-Mo, 9 Nov\nWe, 14 Oct\nWe, 28 Oct\nMo, 19 Oct whole day\nTu, 20 Oct a.m.\nTu, 20 Oct p.m.\nWe, 21 Oct-Fr, 23 Oct\nMo, 2 Nov\nMo, 9 Nov-Fr, 13 Nov\nWe, 25 Nov\nWed, 3 Mar\nMo, 8 Mar- Mo, 5 Apr\nWed, 10 Mar\nWed, 14 Apr\nMo, 22Mar whole day\nTu, 23 Mar a.m.\nTu, 23 Mar p.m.\nWe, 24Mar-Fr, 26Mar\nMo, 5 Apr\nWed, 7 Apr-Fr, 9 Apr\nFr, 9 Apr\nMo, 21 Jun-\nTue, 6 Jul\nMo, 21 Jun",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "courses",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p129",
    "chapter": "Appendix",
    "title": "26. Last day of Filling Application",
    "content": "26. Last day of Filling Application\nfor graduation/Submission of all\nother Graduation Requirements\n27. BOR’s Approval of\nCandidates for Graduation\n28. Senior High School Entrance\nExamination K-12 New\n29. Dissemination of Application\nfor SASE\n30. END OF CLASSES\nWe, 18 Nov\nDec 2020\nFr, 4 Dec\nMo, 13 Apr\nJune 2020\nWed, 6 May\nMo, 21 Jun\nFr, 9 Jul\n31. FINAL DEPARTMENTAL\nEXAMINATIONS:\na) English\nb) Philo\nc) Mathematics\nd) Chemistry\ne) Physics\n32. FINAL EXAMINATIONS\nPERIODS (for all others\nsubjects)____________________\n33. CHRISTMAS VACATION/\nSEMESTRAL BREAK\n34. Last Day for Submission of\nGrades:\nGraduating_____________\nService PE Courses, English,\nPhilo, Math, & Other subjects with\ndepartmentalized Exams held\nprior to Regular Final Exam\nPeriod\nNon-Graduating________\n35. Pre-Commencement\nExercises\n36. Commencement Proper\nMo, 7 Dec a.m.\nMo, 7 Dec p.m.\nTu, 8 Dec whole day\nWe, 9 Dec a.m.\nWe, 9 Dec p.m.\nMo, 14 Dec-Fr, 18 Dec\nMo, 21 Dec-Fr, 4 Jan\nTu, 15 Dec___\nWe, 6 Jan\nFr, 18 Dec____\nWe, 27 Jan\nTh, 28 Jan\nWed, 12 May a.m.\nWed, 12 May p.m.\nMo,10May whole day\nFr, 14 May a.m.\nFr, 14 May p.m.\nMo, 17 May-\nFr, 21 May\nMo,24May-F,28May\nWed, 19 May______\nFri, 21 May\nMo, 24 May___________\nWed, 23 Jun\nThu, 24 Jun\nWed, 21 Jul-\nFri, 23 Jul\nMo, 19\nJul_________\nFr, 16 Jul_________\nWed, 14 Jul\nDepartment Representative Election (SSG) 1st week of April\nCollege Representative election (SSG) 2nd week of April\nSSG Parliamentary Election 3rd week of April\nMo, 20 July 2020 First Day of Service of Faculty Members (SY 2020-2021)\nFr, 14 May 2021 Long Vacation of Faculty Members Begins\nMo, 19 July 2021 First Day of Service of Faculty Members (SY 2021-2021)\nAPC Approved: _______________\nBOR Approved: _______________\nHolidays and Observances:\n2020\nApril 3 Al-Isra Wal Mi Raj\nMay 24 Eid’l Fitr\nJuly 31 Eid’l Adha-ha\nAugust 20 Amon Jadeed\nAugust 21 Ninoy Aquino Day\nAugust 31 National Heroes Day\nOctober 29 Maulidan Nabi\nNovember 1 All Saint’s Day\nNovember 30 Bonifacio Day\nDecember 24 Christmas Eve\nDecember 25 Christmas Day\nDecember 30 Rizal day\nDecember 31 New Year’s Eve\n2021",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "courses",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p130",
    "chapter": "Appendix",
    "title": "January 1 New Year’s Day",
    "content": "January 1 New Year’s Day\nFebruary 12 Chinese Lunar New Year’s Day\nMarch 11 Lailatul Isra Wal Mi Raj\nApril 1 Maundy Thursday\nApril 2 Good Friday\nApril 9 The Day of Valor\nMay 1 Labor Day\nMay 13 Eid’l Fitr\nJune 12 Independence Day\nJuly 20 Eid’l Adh-ha\nNote:\n1st Semester 2nd Semester\nDeadline for Submission of\nBook bound Thesis (Graduate Level) December 2020\nDeadline for Submission of\nBook bound Thesis (Undergraduate Level) December 2020\nGeneral convocation &\nCollege Orientation Program August 2021\nSundays should not be examination days because of ROTC and should not encroach on another’s time",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "courses",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p131",
    "chapter": "Appendix",
    "title": "OTHER FACILITIES AVAILABLE ON CAMPUS",
    "content": "OTHER FACILITIES AVAILABLE ON CAMPUS\nStores, shops, parlors, barbershops, pharmacies, eateries and boarding\nhouses are situated on campus. The commercial center located near the MSU\nGymnasium has establishments that can sufficiently provide for the needs of MSU\nconstituents like resto, snack inns, groceries, school supplies, shoe repair shops,\nphoto shops, mosques, chapel, bakeshops, photocopy services, Wi-Fi services area,\nbookbinding, lamination, boutiques and other facilities.\nAccessible facilities and amenities inside the campus:\nPNB\nLandbank of the Philippines\nAmanah Islamic Bank\nMarawi Resort Hotel\nMSU Hostel\nVIP Hostel\nOthers\nPrivate Internet Café -\nCommercial Center\nWi-Fi zone area\nOval (jogging, hataw)\nGrandstand\nDimaporo Gymnasium\nGlobe Telecommunication\nSmart Tawag Center\nM/Lhuillier (Pera Padala &\nPawnshop)\nPalawan Express\nJeepneys\nVans\nMotorcycle\nMSU School Buses\nPKF - 0905 128 3978\n0950 583 1117\nSSG - 0917 150 0138\n0939 378 0105\n0999 539 9210\nDSA - 0906-127-9503\n0917-716-4703\n0918-736-4613\n0967-584-0982",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p132",
    "chapter": "Appendix",
    "title": "UNIVERSITY OFFICIALS",
    "content": "UNIVERSITY OFFICIALS\nCOMPOSITION OF THE MSU BOARD OF\nREGENTS\nEX-OFFICIO MEMBERS\nHON. J. PROSPERO E. DE VERA III\nChairperson, Commission on Higher Education\nHON. HABIB W. MACAAYONG\nPresident, Mindanao State University System\nVice Chairman\nHON. EMMANUEL JOEL VILLANUEVA\nChairperson, Senate Committee on Higher and\nTechnical Education\nHON. MARK O. GO\nChairman, House Committee on Higher and\nTechnical Education\nHON. WENDEL E. AVISADO\nSecretary, Department of Budget and Management\n(Represented by USec. Herman Jumilla)\nHON. ERNESTO DEL MAR PERNIA\nDirector-General, National Economic\nDevelopment Authority\n(Represented by USec. Adoracion M. Navarro)\nHON. MOHAGHER IQBAL\nMinister, Basic Higher Technical Education\n(BARMM)\nHON. SUKARNO D. TANGGOL\nChancellor, MSU-Iligan Institute of Technology\nHON. MARY JOYCE Z. GUINTO-SALI\nChancellor, MSU-Tawi-Tawi College of Technology\nand Oceanography\nHON. ANSHARI P. ALI, Ph.D.\nChancellor, MSU General Santos\nHON. ROBERTO N. LIM\nPresident, MSU Alumni Association\nHON. SANTIAGO R. EVASCO, JR.\nPresident, MSU Faculty Federation\nHON. RON DENVER C. GONZALES\nPresident, Federation of MSU System Student\nCouncils\nAPPOINTIVE MEMBERS\nHON. SANCHEZ A. ALI\nHON. AMINA RASUL BERNARDO\n(Cultural Communities)\nAppointive Members\nUSMAN D. ARAGASI, J.D., MPA\nSecretary of the University and of the Board o",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "university",
      "courses",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p133",
    "chapter": "Appendix",
    "title": "SYSTEM OFFICIALS",
    "content": "MINDANAO STATE UNIVERSITY\nSYSTEM OFFICIALS\nHABIB W. MACAAYONG, DPA\nPresident\nMACABANGKIT P. ATI, DPA\nExecutive Vice President\nALMA E. BEROWA, Ph.D.\nVice President for Academic Affairs\nATTY. JAMALODEN A. BASAR\nVice President for Administration and Finance\nRASID M. PACA, J.D., MSA\nVice President for Planning and Development\nSAERAH B. MACABAGO, J.D., Ph.D.\nAssistant Vice President for Academic Affairs\nSALIHA M. GUINAL, CPA\nAssistant Vice President for Administration and\nFinance\nRODRIGO S. BAID, MSCE\nAssistant Vice President for Planning and\nDevelopment\nUSMAN D. ARAGASI, J.D., MPA\nSecretary of the University and of the Board of\nRegents\nMUHAIMEN C. UMPAT\nSystem Budget Director\nCHANCELLORS OF MSU CAMPUSES\nHABIB W. MACAAYONG, DPA\nMSU-Main Campus Marawi\nSUKARNO D. TANGGOL, DPA\nMSU-Iligan Institute of Technology\nIligan City\nMARY JOYCE Z. GUINTO-SALI, Ph.D.\nMSU-Tawi-Tawi College of Technology and\nOceanography, Bongao, Tawi-Tawi\nANSHARI P. ALI, Ph.D.\nMSU-General Santos\nGeneral Santos City\nELNOR C. ROA, Ph.D.\nMSU-Naawan\nNaawan, Misamis Oriental\nBAI SORAYA Q. SINSUAT, Ph.D.\nMSU-Maguindanao\nDatu Odin Sinsuat, Maguindanao\nNAGDER J. ABDURAHMAN, Ed.D.\nMSU-Sulu, Jolo, Sulu\nPANGANDAG M. MAGOLAMA, Ph.D.\nMSU-Buug\nBuug, Zamboanga Sibugay\nMSU-MAIN CAMPUS OFFICIALS\nHABIB W. MACAAYONG, DPA\nPresident\nMACABANGKIT P. ATI, DPA\nExecutive Vice President\nALMA E. BEROWA, Ph.D.\nVice President for Academic Affairs\nATTY. JAMALODEN A. BASAR\nVice President for Administration and Finance\nRASID M. PACA, J.D., MSA\nVice President for Planning and Development\nSAERAH B. MACABAGO, J.D., Ph.D.\nAssistant Vice President for Academic Affairs\nSALIHA M. GUINAL, CPA\nAssistant Vice President for Administration and\nFinance\nRODRIGO S. BAID, MSCE\nAssistant Vice President for Planning and\nDevelopment\nATTY. SAADUDDIN M. ALAUYA, JR., CPA\nVice Chancellor for Administration and Finance\nFLORENCIO D. RECOLETO JR., Ph.D.\nVice Chancellor for Academic Affairs",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "courses",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p134",
    "chapter": "Appendix",
    "title": "CESAR A. DE LA SEÑA, Ph.D.",
    "content": "CESAR A. DE LA SEÑA, Ph.D.\nVice Chancellor for Research and Extension\nUSMAN D. ARAGASI, J.D., MPA\nSecretary of the University and of the Board of\nRegents\nHEDJIARA M. DISOMANGCOP, Ph.D.\nAsst. Secretary of the University and of the Board\nof Regents\nHEADS OF ACADEMIC UNITS OF\nMARAWI CAMPUS\nFLORENCIO D. RECOLETO JR., Ph.D.\nVice Chancellor for Academic affairs\nFARIDA B. MUTI, MA\nAssistant Vice Chancellor for Academic Affairs,\nExternal Units\nMINOMBAO R. MAYO, Ph.D.\nDean, Graduate School\nATTY. ALIZEDNEY M. DITUCALAN\nDean, College of Law\nHAYDEE G. CABILDO, M.D.\nDean, College of Medicine\nRASID M. PACA, J.D., MSA\nOIC Dean, College of Agriculture\nPAPALA P. MASORONG, CPA, Ph.D.\nDean, College of Business Administration and\nAccountancy\nMONTIA D. SARIP, Ph.D.\nDean, College of Education\nRODRIGO S. BAID, MSCE\nDean, College of Engineering\nEVELYN C. MOLDEZ, MS, RFT\nDean, College of Fisheries\nDANILO C. MERO, MS\nDean, College of Forestry and Environmental\nStudies\nNAIMA D. MALA, Ph.D.\nDean, College of Health Sciences\nOLIVIA M. SONAJO, MBA\nDean, College of Hotel and Restaurant\nManagement\nMAIMONA M. ASUM, MITE\nDean, College of Information Technology\nABDULCADER M. AYO, Ph.D.\nDean, King Faisal Center for Islamic, Arabic and\nAsian Studies\nHENRY P. ARINGA, Ph.D.\nDean, College of Natural Sciences and Mathematics\nVIOLETA H. ENGRACIA, Ph.D.\nDean, College of Public Affairs\nELENA M. TABANAO, MPA\nDean, College of Social Sciences and Humanities\nHENDELY A. ADLAWAN, Ph.D.\nDean, College of Sports, Physical Education and\nRecreation\nBARTOLOME L. CAGAS, Ph.D.\nDean, Institute of Science Education and\nDirector, Regional Science Training Center\nSAMBITORY A. BAZAR\nDirector, Division of Engineering Technology\nJUNAINA M. DIMALNA\nDirector, Senior High School\nEDENAIRAH P. ESMAIL, Ph.D.\nDirector, MSU University Training Center\nNURHAYYA EBERSAMEN W. DIPATUAN\nAssistant Dean, MSU Integrated Laboratory School\nHEADS OF SEMI-ACADEMIC UNITS\nANSANO M. AMPOG, Ph.D.\nSystem University Registrar\nMINERVA-SAMINAH M. NAGA, Ph.D.\nDirector, Office of Admission",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "courses",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p135",
    "chapter": "Appendix",
    "title": "ALEEM ANWAR M. RADIAMODA, MA",
    "content": "ALEEM ANWAR M. RADIAMODA, MA\nDirector, Shariah Center\nELIN ANISHA CAPAL-GURO, Ph.D.\nOIC Director, University Library\nENG’R. LABIMOMBAO A.D. MACABANDO, Ph.D.,\nCSEE\nDirector, Division of Student Affairs\nRAMLI V. USMAN, M.D.\nDirector, University Medical Services and Hospital\nSAIDAMEN O. LIMGAS\nActing Director, Office of Information, Press and\nPublication\nACRAM A. LATIPH, Ph.D.\nExecutive Director, Institute for Peace and\nDevelopment in Mindanao\nRAQUELA T. DIMALOTANG\nExecutive Director, Center for Women Studies\nLINANG M. CABUGATAN, Ph.D.\nDirector, Agakhan Museum & Natural Science\nMuseum\nNASSER M. ANDAM\nDirector, Audio-Visual Center\nHEDJARAH U. RANDE-CARES, MPA\nManager, University Book Center\nJUHARY B. PANGANDAMAN, Ph.D.\nDirector, Cultural Affairs office\nNORKAYA S. MOHAMAD, MPA\nActing Director, Institute of Local Governance\n1LT. LAKIBUDDIN H. ISRAIL, (INF) PA\nCommandant, ROTC Unit\nPROF. SAMBITORY A. BAZAR\nOIC Director, National Service Training Program\n(NSTP)\nHEADS OF RESEARCH AND EXTENSION\nSERVICES\nCESAR A. DE LA SEÑA, Ph.D.\nVice Chancellor for Research and Extension\nFEMA M. ABAMO, Ph.D.\nDirector, Mamitua Saber Research & Technology\nCenter (MSRTC)\nPANDAO O. BULA\nDirector, University Extension Services Center\n(UESC)\nSARIFA SOFIA A. MACARAMBON-ALI, JD\nDirector, Regional Adaptive Technology Center\n(RATC)\nENGR. ACSARA A. GUMAL, Ph.D.\nDirector, MSU Ceramics Development Center\n(CDC)\nENGR. KRISTINE MARFE A. MAROHOMSALIC\nChief TIC-Intellectual Property Office\nRICHARD S. CELESTE, REB, MBM\nChief TIC-Entrepreneurship Training and\nPromotion Office\nHEADS OF ADMINISTRATIVE UNITS\nATTY. SAADUDDIN M. ALAUYA, JR., CPA\nVice Chancellor for Administration and Finance\nMACAUMBAO U. BAUNTO, J.D.\nAssistant Vice Chancellor for Administration and\nFinance\nALIAH P. CALI-PASCAN, J.D, MPA, Sh.L.\nDirector, Presidential Management Staff\nRASID B. SALIC, JD, Sh.L., MPA\nDirector, Administrative Services Division\nATTY. SHIDIK T. ABANTAS\nDirector, Legal Services Division\nAMER D. PANGANDAMAN, MPA\nDirector, Human Resource Development Office",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "courses",
      "appendix"
    ]
  },
  {
    "id": "student-handbook-2019-2020-p136",
    "chapter": "Appendix",
    "title": "SORAIDA A. ESMAIL, CPA, D.M.",
    "content": "SORAIDA A. ESMAIL, CPA, D.M.\nDirector, Campus/System Budget Office\nMANGAYAO R. OLAY\nChief, University Business Office\nSALIHA M. GUINAL, CPA\nUniversity Chief Accountant\nTARHATA M. CAPAL, CPA\nFinance Director\nHASHMINA M. DIMALNA, CPA, MPA\nUniversity Chief Cashier\nENGR. AGAY M. MANGONDAYA\nDirector, Physical Plant Division\nENGR. SABDULLAH D. MACARAMBON, MPA\nOIC Director, Motor Pool and Water System\nDivision\nDATUDACULA L. MANDANGAN, MPA\nDirector, Supply Management Division\nZENAIDA B. OMAR\nDirector, Property Division\nHANIMAH S. LAO, RN, MPA\nDirector, Office of Alumni Relations\nNORLINDA M. ALONTO\nOIC Director, Institutional Research and\nEvaluation office\nNAGARANAO A. SANGCOPAN, MPA\nDirector, Housing Management Division\nMACMOD G. MARUHOM, JD\nDirector, Community Relations Office\nNORAISAH G. ALI\nOIC Director, Auxiliary Services Division\nANNIE JANE T. DISOMANGCOP\nManager, Food Service Division\nAMELADIN M. POLAO\nState Auditor, Commission on Audit\nMUHAIMEN C. UMPAT\nChief, Campus Budget Office\nHANNAH G. MARQUEZ, RN, MPH\nDirector, MSU-Manila Information Office\nIHSAN M. AMANODDIN\nChief, Radio and Telecommunications Office\nNORMEN MARMAY BISTON\nDirector, Security Services Department/ Fire\nDepartment\nFAISAH CADER-SANGCOPAN\nManager, University Hostel and VIP Lounge\nENGR. PRECIOSA A. DIMAPORO, CESE\nUniversity Engineer\nFAISAL P. MANGANDOG\nChief, Internal Fiscal Review Office\nRONALD M. SILVOSA\nDirector, Information and Communication\nTechnology\nHEADS OF INTEGRATED MSU\nCAMPUSES\nCAIRANY D. GANDAMRA, LLB\nSuperintendent\nMSU-Lanao National College of Arts and Trade\n(LNCAT), Marawi City\nMACABANGKIT P. ATI, DPA\nOIC Head/Superintendent (on Concurrent\nCapacity) MSU-Maigo School of Arts and Trade\n(MSAT), Maigo, Lanao del Norte\nINDIHRA D. TAWANTAWAN, Ph.D.\nSuperintendent, MSU-Lanao del Norte Agriculture\nCollege (LNAC) Sultan Naga Dimaporo, Lanao del\nNorte",
    "tags": [
      "student handbook",
      "2019-2020",
      "msu",
      "student services",
      "university",
      "courses",
      "appendix"
    ]
  }
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
      "Academic area for agriculture programs, farm-based learning, research, and extension activities near the Law and CBAA lower-campus cluster.",
    mapX: 38.5,
    mapY: 95.2,
    latitude: 7.9924848,
    longitude: 124.258215,
    street: "1st Street",
    nearby: [
      "College of Law",
      "CBAA",
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
    mapX: 51.4,
    mapY: 53.7,
    latitude: 7.9966763,
    longitude: 124.260666,
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
    mapX: 47.8,
    mapY: 45.2,
    latitude: 7.9975348,
    longitude: 124.259982,
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
    mapX: 31.7,
    mapY: 62,
    latitude: 7.995838,
    longitude: 124.256923,
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

export const coursePrograms: CourseProgram[] = [];

export const prospectusRecords: ProspectusRecord[] = [];

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
    startTime: "08:00",
    endTime: "09:30",
    room: "CICS Room 101",
    reminder: "Arrive 10 minutes early during the first week.",
    reminderMinutes: 15,
  },
  {
    id: "sample-ge-1",
    courseCode: "GE 1",
    courseTitle: "Purposive Communication",
    day: "Tuesday and Thursday",
    time: "10:00 AM - 11:30 AM",
    startTime: "10:00",
    endTime: "11:30",
    room: "Assigned classroom",
    reminder: "Check the department board for room updates.",
    reminderMinutes: 15,
  },
];

export const databaseTables = [
  "auth.users",
  "profiles",
  "colleges",
  "handbook_entries",
  "handbook_entry_offices",
  "administrative_offices",
  "office_services",
  "campus_locations",
  "campus_location_links",
  "admin_contact_messages",
  "class_schedules",
  "notifications",
  "notification_recipients",
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
