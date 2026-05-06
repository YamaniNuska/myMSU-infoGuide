PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'visitor', 'faculty', 'admin')),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS handbook_entries (
  id TEXT PRIMARY KEY,
  chapter TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS administrative_offices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  services_json TEXT NOT NULL DEFAULT '[]',
  location TEXT NOT NULL,
  contact TEXT NOT NULL,
  hours TEXT NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campus_locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  nearby_json TEXT NOT NULL DEFAULT '[]',
  tags_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_schedules (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  course_code TEXT NOT NULL,
  course_title TEXT NOT NULL,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  room TEXT NOT NULL,
  reminder TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  date_label TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'normal', 'low')),
  audience TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS course_offerings (
  id TEXT PRIMARY KEY,
  college TEXT NOT NULL,
  program TEXT NOT NULL,
  degree TEXT NOT NULL,
  overview TEXT NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prospectus_records (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  program TEXT NOT NULL,
  year_level TEXT NOT NULL,
  semester TEXT NOT NULL,
  subjects_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES course_offerings (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS academic_calendar (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date_label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('enrollment', 'classes', 'event', 'deadline', 'exam')),
  audience TEXT NOT NULL,
  details TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_handbook_search
  ON handbook_entries (chapter, title);

CREATE INDEX IF NOT EXISTS idx_office_search
  ON administrative_offices (name, category);

CREATE INDEX IF NOT EXISTS idx_calendar_type
  ON academic_calendar (type);

CREATE INDEX IF NOT EXISTS idx_schedule_user
  ON class_schedules (user_id);
