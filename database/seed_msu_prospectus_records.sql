-- Real BSIT Database Systems Track prospectus records from
-- C:\Users\msu-wone\Downloads\BS-IT-Database-Prospectus.pdf.
--
-- Run after database/schema.sql and database/seed_msu_prospectus_courses.sql.
-- This replaces any existing BSIT Database Systems prospectus rows.

INSERT INTO public.course_offerings (
  id,
  college_id,
  college,
  program,
  degree,
  overview,
  prospectus_url,
  tags
)
VALUES (
  'cics-bsit-dbs',
  'cics',
  'College of Information and Computing Sciences',
  'Bachelor of Science in Information Technology - Database Systems Track',
  'BSIT-DBS',
  'Official 2018 BSIT Database Systems Track prospectus from the College of Information Technology.',
  'https://msu-prospectus.vercel.app/CICS/msu-bsit-database-prospectus.pdf',
  '["cics", "it", "bsit", "database", "database systems", "dbs", "2018 prospectus"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  college_id = EXCLUDED.college_id,
  college = EXCLUDED.college,
  program = EXCLUDED.program,
  degree = EXCLUDED.degree,
  overview = EXCLUDED.overview,
  prospectus_url = EXCLUDED.prospectus_url,
  tags = EXCLUDED.tags;

DELETE FROM public.prospectus_records
WHERE program_id = 'cics-bsit-dbs';

INSERT INTO public.prospectus_records (
  id,
  program_id,
  program,
  year_level,
  semester,
  summary,
  technical_electives,
  subjects
)
VALUES
  (
    'cics-bsit-dbs-info',
    'cics-bsit-dbs',
    'Bachelor of Science in Information Technology - Database Systems Track',
    'Program Info',
    'Summary',
    'Grand total: 150 (156) units. Database Systems Track, 2018 prospectus.',
    jsonb_build_array(
      jsonb_build_object('code', 'ITD100', 'title', 'Data Warehousing and Data Mining'),
      jsonb_build_object('code', 'ITD101', 'title', 'Distributed Databases'),
      jsonb_build_object('code', 'ITD102', 'title', 'R Programming Language'),
      jsonb_build_object('code', 'ITD103', 'title', 'Modern Query Languages'),
      jsonb_build_object('code', 'ITD104', 'title', 'Database Security, Admin & Management'),
      jsonb_build_object('code', 'ITD105', 'title', 'Big Data Analysis'),
      jsonb_build_object('code', 'ITD106', 'title', 'Lexical Databases'),
      jsonb_build_object('code', 'ITD107', 'title', 'Information Assurance'),
      jsonb_build_object('code', 'ITD108', 'title', 'Information Engineering'),
      jsonb_build_object('code', 'ITD109', 'title', 'Knowledge Base Systems'),
      jsonb_build_object('code', 'ITD110', 'title', 'NoSQL Databases'),
      jsonb_build_object('code', 'ITD111', 'title', 'Business Intelligence'),
      jsonb_build_object('code', 'ITD112', 'title', 'Data Visualization Techniques'),
      jsonb_build_object('code', 'ITD113', 'title', 'Applied Linear Models'),
      jsonb_build_object('code', 'ITD114', 'title', 'Software Quality Assurance and Metrics'),
      jsonb_build_object('code', 'ITD115', 'title', 'Platform Technologies')
    ),
    '[]'::jsonb
  ),
  (
    'cics-bsit-dbs-fi-fi',
    'cics-bsit-dbs',
    'Bachelor of Science in Information Technology - Database Systems Track',
    'First Year',
    'First Semester',
    'Total: 20 (23) units; 18 lecture hours, 6 laboratory hours, 24 (27) total hours per week.',
    '[]'::jsonb,
    jsonb_build_array(
      'GEC101 | Understanding the Self | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'GEC102 | Purposive Communication | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'MAT104 | Discrete Structures | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'GEC104 | Mathematics in the Modern World | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'CCC100 | Fundamentals of Computing | Units: 3 | Lec: 2 | Lab: 3 | Prereq: None | Coreq: None | Importance: standard',
      'CCC101 | Computer Programming 1 | Units: 3 | Lec: 2 | Lab: 3 | Prereq: None | Coreq: None | Importance: standard',
      'PED001 | Exercise Prescription and Management | Units: 2 | Lec: 2 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'NST001 | National Service Training Program 1 | Units: (3) | Lec: 0 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard'
    )
  ),
  (
    'cics-bsit-dbs-fi-se',
    'cics-bsit-dbs',
    'Bachelor of Science in Information Technology - Database Systems Track',
    'First Year',
    'Second Semester',
    'Total: 22 (25) units; 21 lecture hours, 3 laboratory hours, 24 (27) total hours per week.',
    '[]'::jsonb,
    jsonb_build_array(
      'GEC103 | The Contemporary World | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'GEC105 | Readings in Philippine History | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'GEC106 | Art Appreciation | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'FPE101 | Fundamental of Peace Education | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'MAT051 | Calculus 1 | Units: 5 | Lec: 5 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'CCC102 | Computer Programming 2 | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC101 | Coreq: None | Importance: standard',
      'PED002 | Dance / Martial Arts | Units: 2 | Lec: 2 | Lab: 0 | Prereq: PED001 | Coreq: None | Importance: standard',
      'NST002 | National Service Training Program 2 | Units: (3) | Lec: 0 | Lab: 0 | Prereq: NST001 | Coreq: None | Importance: standard'
    )
  ),
  (
    'cics-bsit-dbs-se-fi',
    'cics-bsit-dbs',
    'Bachelor of Science in Information Technology - Database Systems Track',
    'Second Year',
    'First Semester',
    'Total: 22 units; 21 lecture hours, 3 laboratory hours, 24 total hours per week.',
    '[]'::jsonb,
    jsonb_build_array(
      'GEC107 | Ethics | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'GEC108 | Science, Technology and Society | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'Lang Elect | Foreign Language | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'MAT061 | Calculus 2 | Units: 5 | Lec: 5 | Lab: 0 | Prereq: MAT051 | Coreq: None | Importance: standard',
      'CCC121 | Data Structures and Algorithms | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC102 | Coreq: None | Importance: standard',
      'ITE131 | Computer Architecture and Operating Systems | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'PED003 | Individual/Dual Sports/Traditional/Recreational Games | Units: 2 | Lec: 2 | Lab: 0 | Prereq: PED001 | Coreq: None | Importance: standard'
    )
  ),
  (
    'cics-bsit-dbs-se-se',
    'cics-bsit-dbs',
    'Bachelor of Science in Information Technology - Database Systems Track',
    'Second Year',
    'Second Semester',
    'Total: 20 units; 15 lecture hours, 15 laboratory hours, 30 total hours per week.',
    '[]'::jsonb,
    jsonb_build_array(
      'GEC109 | Life and Works of Rizal | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'ITE114/MAT121/* | Numerical Linear Algebra and Matrix Theory / Linear Algebra / Technical Elective | Units: 3 | Lec: 2 | Lab: 3 | Prereq: MAT104 and CCC101 | Coreq: None | Importance: standard',
      'STT071 | Probability and Statistical Inference for Computing Systems | Units: 2 | Lec: 2 | Lab: 0 | Prereq: CCC102 | Coreq: STT071.1 | Importance: standard',
      'STT071.1 | Probability and Statistical Inference for Computing Systems (Lab) | Units: 1 | Lec: 0 | Lab: 3 | Prereq: CCC102 | Coreq: STT071 | Importance: standard',
      'ITE125 | Introduction to Human Computer Interaction | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC102 | Coreq: None | Importance: standard',
      'ITE132 | Fundamentals of Computer Networks | Units: 3 | Lec: 2 | Lab: 3 | Prereq: ITE131 | Coreq: None | Importance: standard',
      'CCC151 | Information Management | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC121 | Coreq: None | Importance: standard',
      'PED004 | Team Sports | Units: 2 | Lec: 2 | Lab: 0 | Prereq: PED001 | Coreq: None | Importance: standard'
    )
  ),
  (
    'cics-bsit-dbs-th-fi',
    'cics-bsit-dbs',
    'Bachelor of Science in Information Technology - Database Systems Track',
    'Third Year',
    'First Semester',
    'Total: 21 units; 17 lecture hours, 12 laboratory hours, 29 total hours per week.',
    '[]'::jsonb,
    jsonb_build_array(
      'HIS003 | History of Filipino Muslims and the Indigenous Peoples of MINSUPALA | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'FIL101 | Wika at Kultura sa Mapayapang Lipunan | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'ITE152 | Advance Databases | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC151 | Coreq: None | Importance: standard',
      'ISY108 | Requirements Engineering | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC151 | Coreq: None | Importance: standard',
      'CCC181 | Application Development and Emerging Technologies | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC151 | Coreq: None | Importance: standard',
      'ITE191/ITE198 | CAPSTONE 1 / Research Methods | Units: 3 | Lec: 3 | Lab: 0 | Prereq: ITE132/CCC151 | Coreq: None | Importance: standard',
      'Tech Elect 1 | Technical Elective 1 | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC151 | Coreq: None | Importance: standard'
    )
  ),
  (
    'cics-bsit-dbs-th-se',
    'cics-bsit-dbs',
    'Bachelor of Science in Information Technology - Database Systems Track',
    'Third Year',
    'Second Semester',
    'Total: 21 units; 18 lecture hours, 9 laboratory hours, 27 total hours per week.',
    '[]'::jsonb,
    jsonb_build_array(
      'FIL102 | Ekokritisismo at Pagpahalaga sa Kalikasan | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'ITE153 | Introduction to Artificial Intelligence and Expert Systems | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC121 | Coreq: None | Importance: standard',
      'ITE182 | System Integration, Administration and Maintenance | Units: 3 | Lec: 3 | Lab: 0 | Prereq: CCC151 | Coreq: None | Importance: standard',
      'ITE193 | Special Topics in IT | Units: 3 | Lec: 3 | Lab: 0 | Prereq: ITE152 | Coreq: None | Importance: standard',
      'ITE192/ITE199 | CAPSTONE 2 / UNDERGRADUATE THESIS | Units: 3 | Lec: 3 | Lab: 0 | Prereq: ITE191/ITE198 | Coreq: None | Importance: standard',
      'Tech Elect 2 | Technical Elective 2 | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC151 | Coreq: None | Importance: standard',
      'Tech Elect 3 | Technical Elective 3 | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC151 | Coreq: None | Importance: standard'
    )
  ),
  (
    'cics-bsit-dbs-fo-fi',
    'cics-bsit-dbs',
    'Bachelor of Science in Information Technology - Database Systems Track',
    'Fourth Year',
    'First Semester',
    'Total: 18 units; 15 lecture hours, 9 laboratory hours, 24 total hours per week.',
    '[]'::jsonb,
    jsonb_build_array(
      'ENT101 | Startup Essentials: Fundamentals of Innovation-driven Entrepreneurship | Units: 3 | Lec: 3 | Lab: 0 | Prereq: None | Coreq: None | Importance: standard',
      'ITE183 | Web Systems and Technologies | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC181 | Coreq: None | Importance: standard',
      'ITE184 | Social, Legal and Professional Issues in Computing | Units: 3 | Lec: 3 | Lab: 0 | Prereq: GEC107 | Coreq: None | Importance: standard',
      'ITE185 | Information Assurance and Security | Units: 3 | Lec: 3 | Lab: 0 | Prereq: CCC151 | Coreq: None | Importance: standard',
      'Tech Elect 4 | Technical Elective 4 | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC151 | Coreq: None | Importance: standard',
      'Tech Elect 5 | Technical Elective 5 | Units: 3 | Lec: 2 | Lab: 3 | Prereq: CCC151 | Coreq: None | Importance: standard'
    )
  ),
  (
    'cics-bsit-dbs-fo-se',
    'cics-bsit-dbs',
    'Bachelor of Science in Information Technology - Database Systems Track',
    'Fourth Year',
    'Second Semester',
    'Total: 6 units; 0 lecture hours, 40 laboratory/training hours, 40 total hours per week.',
    '[]'::jsonb,
    jsonb_build_array(
      'ITE197 | On-the-Job Training | Units: 6 | Lec: 0 | Lab: 40 | Prereq: None | Coreq: None | Importance: standard'
    )
  );
