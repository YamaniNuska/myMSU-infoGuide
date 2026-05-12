import { createHash, randomUUID } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

let DatabaseSync;

try {
  ({ DatabaseSync } = await import("node:sqlite"));
} catch {
  console.error("This backend needs Node.js 22.5+ with the built-in node:sqlite module.");
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const loadEnvFile = () => {
  try {
    const envText = readFileSync(join(rootDir, ".env"), "utf8");

    for (const line of envText.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        continue;
      }

      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // The backend can still run with shell-provided env vars.
  }
};

loadEnvFile();

const dbPath =
  process.env.MYMSU_DB_PATH ?? join(rootDir, "database", "mymsu.sqlite");
const schemaPath = join(rootDir, "database", "schema.sql");
const port = Number(process.env.PORT ?? 8787);
const sessionDays = 30;
const msuEmailDomains = ["@s.msumain.edu.ph", "@msumain.edu.ph"];
const demoAccounts = [
  {
    id: "user-student-demo",
    name: "Student Demo",
    role: "student",
    username: "student",
    email: "student@msumain.edu.ph",
    password: "student123",
  },
  {
    id: "user-visitor-demo",
    name: "Campus Visitor",
    role: "visitor",
    username: "visitor",
    email: "visitor@gmail.com",
    password: "visitor123",
  },
  {
    id: "user-admin-demo",
    name: "DSA Admin",
    role: "admin",
    username: "admin",
    email: "admin@msumain.edu.ph",
    password: "admin123",
  },
];

mkdirSync(dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec(readFileSync(schemaPath, "utf8"));

const nowIso = () => new Date().toISOString();
const hashPassword = (password) => `demo:${password.trim()}`;
const clean = (value) => String(value ?? "").trim();
const normalize = (value) => clean(value).toLowerCase();
const isMsuEmail = (email) =>
  msuEmailDomains.some((domain) => email.endsWith(domain));
const toJson = (value) => JSON.stringify(Array.isArray(value) ? value : []);
const fromJson = (value) => {
  try {
    const parsed = JSON.parse(value ?? "[]");

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const send = (response, status, body) => {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  });
  response.end(body === undefined ? "" : JSON.stringify(body));
};

const readJsonBody = (request) =>
  new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });

    request.on("error", reject);
  });

const publicUser = (row) => ({
  id: row.id,
  name: row.name,
  role: row.role,
  username: row.username,
  email: row.email,
});

const requireFields = (record, fields) => {
  const missing = fields.filter((field) => !clean(record[field]));

  if (missing.length > 0) {
    throw new Error(`Missing required field(s): ${missing.join(", ")}.`);
  }
};

const collectionNames = [
  "users",
  "handbookEntries",
  "offices",
  "campusLocations",
  "classSchedules",
  "coursePrograms",
  "prospectusRecords",
  "academicEvents",
  "announcements",
];

const collectionMap = new Set(collectionNames);
const collectionTables = {
  users: "users",
  handbookEntries: "handbook_entries",
  offices: "administrative_offices",
  campusLocations: "campus_locations",
  classSchedules: "class_schedules",
  coursePrograms: "course_offerings",
  prospectusRecords: "prospectus_records",
  academicEvents: "academic_calendar",
  announcements: "notifications",
};

const roleForEmail = (email, requestedRole = "student") => {
  const cleanEmail = normalize(email);

  if (requestedRole === "admin") {
    throw new Error("Admin account creation is disabled.");
  }

  if (cleanEmail.endsWith("@gmail.com")) {
    return "visitor";
  }

  if (isMsuEmail(cleanEmail)) {
    return ["student", "faculty", "employee"].includes(requestedRole)
      ? requestedRole
      : "student";
  }

  throw new Error(
    "Use a Gmail address for visitor access or an MSU email address for MSU access.",
  );
};

const getUserByIdentifier = (identifier) =>
  db
    .prepare(
      "SELECT * FROM users WHERE lower(username) = ? OR lower(email) = ? LIMIT 1",
    )
    .get(normalize(identifier), normalize(identifier));

const getUserByEmail = (email) =>
  db.prepare("SELECT * FROM users WHERE lower(email) = ? LIMIT 1").get(
    normalize(email),
  );

const getUserById = (id) =>
  db.prepare("SELECT * FROM users WHERE id = ? LIMIT 1").get(id);

const createSession = (userId) => {
  const token = randomUUID();
  const expiresAt = new Date(
    Date.now() + sessionDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  db.prepare(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
  ).run(token, userId, expiresAt);

  return token;
};

const getSessionUser = (request) => {
  const authorization = request.headers.authorization ?? "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return null;
  }

  const session = db
    .prepare(
      `SELECT users.*
       FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.token = ? AND sessions.expires_at > ?
       LIMIT 1`,
    )
    .get(match[1], nowIso());

  return session ?? null;
};

const requireAdmin = (request) => {
  const user = getSessionUser(request);

  if (!user || user.role !== "admin") {
    throw new Error("Admin access is required.");
  }

  return user;
};

const requireSignedIn = (request) => {
  const user = getSessionUser(request);

  if (!user) {
    throw new Error("Sign in is required.");
  }

  return user;
};

const ensureUniqueUser = (id, username, email) => {
  const duplicate = db
    .prepare(
      `SELECT id FROM users
       WHERE id != ? AND (lower(username) = ? OR lower(email) = ?)
       LIMIT 1`,
    )
    .get(id, normalize(username), normalize(email));

  if (duplicate) {
    throw new Error("Username or email is already registered.");
  }
};

const upsertUser = (record, options = {}) => {
  requireFields(record, ["name", "username", "email"]);

  const id = clean(record.id) || `user-${Date.now()}-${randomUUID()}`;
  const existing = getUserById(id);
  const requestedRole = clean(record.role || existing?.role || "student");
  const role = options.allowAdmin && requestedRole === "admin"
    ? "admin"
    : roleForEmail(record.email, requestedRole);
  const passwordHash =
    clean(record.passwordHash) ||
    clean(record.password_hash) ||
    (clean(record.password) ? hashPassword(record.password) : "") ||
    existing?.password_hash;

  if (!passwordHash) {
    throw new Error("Password is required for new accounts.");
  }

  if (role === "admin") {
    const admin = db
      .prepare("SELECT id FROM users WHERE role = 'admin' AND id != ? LIMIT 1")
      .get(id);

    if (admin) {
      throw new Error("Only one admin account is allowed.");
    }
  }

  ensureUniqueUser(id, record.username, record.email);

  db.prepare(
    `INSERT INTO users (id, name, role, username, email, password_hash)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       role = excluded.role,
       username = excluded.username,
       email = excluded.email,
       password_hash = excluded.password_hash`,
  ).run(
    id,
    clean(record.name),
    role,
    clean(record.username),
    clean(record.email),
    passwordHash,
  );

  return publicUser(getUserById(id));
};

const ensureDemoAccounts = () => {
  for (const account of demoAccounts) {
    const existing = db
      .prepare(
        `SELECT * FROM users
         WHERE id = ? OR lower(username) = ? OR lower(email) = ?
         LIMIT 1`,
      )
      .get(account.id, normalize(account.username), normalize(account.email));

    db.prepare(
      `INSERT INTO users (id, name, role, username, email, password_hash)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         role = excluded.role,
         username = excluded.username,
         email = excluded.email,
         password_hash = excluded.password_hash`,
    ).run(
      existing?.id ?? account.id,
      account.name,
      account.role,
      account.username,
      account.email,
      hashPassword(account.password),
    );
  }
};

const readAllData = () => ({
  users: db.prepare("SELECT * FROM users ORDER BY created_at DESC").all().map(publicUser),
  handbookEntries: db
    .prepare("SELECT * FROM handbook_entries ORDER BY updated_at DESC")
    .all()
    .map((row) => ({
      id: row.id,
      chapter: row.chapter,
      title: row.title,
      content: row.content,
      tags: fromJson(row.tags_json),
    })),
  offices: db
    .prepare("SELECT * FROM administrative_offices ORDER BY updated_at DESC")
    .all()
    .map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      summary: row.summary,
      services: fromJson(row.services_json),
      location: row.location,
      contact: row.contact,
      hours: row.hours,
      tags: fromJson(row.tags_json),
    })),
  campusLocations: db
    .prepare("SELECT * FROM campus_locations ORDER BY updated_at DESC")
    .all()
    .map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description,
      mapX: row.map_x,
      mapY: row.map_y,
      latitude: row.latitude ?? undefined,
      longitude: row.longitude ?? undefined,
      street: row.street ?? undefined,
      nearby: fromJson(row.nearby_json),
      tags: fromJson(row.tags_json),
      image: row.image ?? undefined,
    })),
  classSchedules: db
    .prepare("SELECT * FROM class_schedules ORDER BY created_at DESC")
    .all()
    .map((row) => ({
      id: row.id,
      courseCode: row.course_code,
      courseTitle: row.course_title,
      day: row.day,
      time: row.time,
      room: row.room,
      reminder: row.reminder,
    })),
  coursePrograms: db
    .prepare("SELECT * FROM course_offerings ORDER BY updated_at DESC")
    .all()
    .map((row) => ({
      id: row.id,
      college: row.college,
      program: row.program,
      degree: row.degree,
      overview: row.overview,
      tags: fromJson(row.tags_json),
    })),
  prospectusRecords: db
    .prepare("SELECT * FROM prospectus_records ORDER BY updated_at DESC")
    .all()
    .map((row) => ({
      id: row.id,
      programId: row.program_id,
      program: row.program,
      yearLevel: row.year_level,
      semester: row.semester,
      subjects: fromJson(row.subjects_json),
    })),
  academicEvents: db
    .prepare("SELECT * FROM academic_calendar ORDER BY updated_at DESC")
    .all()
    .map((row) => ({
      id: row.id,
      title: row.title,
      dateLabel: row.date_label,
      type: row.type,
      audience: row.audience,
      details: row.details,
    })),
  announcements: db
    .prepare("SELECT * FROM notifications ORDER BY created_at DESC")
    .all()
    .map((row) => ({
      id: row.id,
      title: row.title,
      body: row.body,
      dateLabel: row.date_label,
      priority: row.priority,
      audience: row.audience,
    })),
});

const tableCount = (table) =>
  db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count;

const nonDemoUserCount = () => {
  const demoIds = demoAccounts.map((account) => account.id);
  const placeholders = demoIds.map(() => "?").join(", ");

  return db
    .prepare(
      `SELECT COUNT(*) AS count FROM users WHERE id NOT IN (${placeholders})`,
    )
    .get(...demoIds).count;
};

const databaseIsEmpty = () =>
  nonDemoUserCount() === 0 &&
  [
    "handbook_entries",
    "administrative_offices",
    "campus_locations",
    "class_schedules",
    "notifications",
    "course_offerings",
    "prospectus_records",
    "academic_calendar",
  ].every((table) => tableCount(table) === 0);

const collectionHasSeedableData = (collection) => {
  if (collection === "users") {
    return nonDemoUserCount() > 0;
  }

  const table = collectionTables[collection];

  return table ? tableCount(table) > 0 : true;
};

const upsertCollectionRecord = (collection, item, options = {}) => {
  if (!collectionMap.has(collection)) {
    throw new Error("Unknown collection.");
  }

  if (collection === "users") {
    return upsertUser(item, options);
  }

  const id = clean(item.id) || `${collection}-${Date.now()}-${randomUUID()}`;

  if (collection === "handbookEntries") {
    requireFields(item, ["chapter", "title", "content"]);
    db.prepare(
      `INSERT INTO handbook_entries (id, chapter, title, content, tags_json, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         chapter = excluded.chapter,
         title = excluded.title,
         content = excluded.content,
         tags_json = excluded.tags_json,
         updated_at = excluded.updated_at`,
    ).run(id, clean(item.chapter), clean(item.title), clean(item.content), toJson(item.tags), nowIso());
  }

  if (collection === "offices") {
    requireFields(item, ["name", "category", "summary", "location", "contact", "hours"]);
    db.prepare(
      `INSERT INTO administrative_offices
       (id, name, category, summary, services_json, location, contact, hours, tags_json, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         category = excluded.category,
         summary = excluded.summary,
         services_json = excluded.services_json,
         location = excluded.location,
         contact = excluded.contact,
         hours = excluded.hours,
         tags_json = excluded.tags_json,
         updated_at = excluded.updated_at`,
    ).run(
      id,
      clean(item.name),
      clean(item.category),
      clean(item.summary),
      toJson(item.services),
      clean(item.location),
      clean(item.contact),
      clean(item.hours),
      toJson(item.tags),
      nowIso(),
    );
  }

  if (collection === "campusLocations") {
    requireFields(item, ["name", "category", "description"]);
    db.prepare(
      `INSERT INTO campus_locations
       (id, name, category, description, map_x, map_y, latitude, longitude, street, nearby_json, tags_json, image, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         category = excluded.category,
         description = excluded.description,
         map_x = excluded.map_x,
         map_y = excluded.map_y,
         latitude = excluded.latitude,
         longitude = excluded.longitude,
         street = excluded.street,
         nearby_json = excluded.nearby_json,
         tags_json = excluded.tags_json,
         image = excluded.image,
         updated_at = excluded.updated_at`,
    ).run(
      id,
      clean(item.name),
      clean(item.category),
      clean(item.description),
      Number(item.mapX ?? 50),
      Number(item.mapY ?? 50),
      item.latitude ?? null,
      item.longitude ?? null,
      clean(item.street) || null,
      toJson(item.nearby),
      toJson(item.tags),
      clean(item.image) || null,
      nowIso(),
    );
  }

  if (collection === "classSchedules") {
    requireFields(item, ["courseCode", "courseTitle", "day", "time", "room", "reminder"]);
    db.prepare(
      `INSERT INTO class_schedules
       (id, user_id, course_code, course_title, day, time, room, reminder)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         user_id = excluded.user_id,
         course_code = excluded.course_code,
         course_title = excluded.course_title,
         day = excluded.day,
         time = excluded.time,
         room = excluded.room,
         reminder = excluded.reminder`,
    ).run(
      id,
      clean(item.userId) || null,
      clean(item.courseCode),
      clean(item.courseTitle),
      clean(item.day),
      clean(item.time),
      clean(item.room),
      clean(item.reminder),
    );
  }

  if (collection === "coursePrograms") {
    requireFields(item, ["college", "program", "degree", "overview"]);
    db.prepare(
      `INSERT INTO course_offerings (id, college, program, degree, overview, tags_json, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         college = excluded.college,
         program = excluded.program,
         degree = excluded.degree,
         overview = excluded.overview,
         tags_json = excluded.tags_json,
         updated_at = excluded.updated_at`,
    ).run(
      id,
      clean(item.college),
      clean(item.program),
      clean(item.degree),
      clean(item.overview),
      toJson(item.tags),
      nowIso(),
    );
  }

  if (collection === "prospectusRecords") {
    requireFields(item, ["programId", "program", "yearLevel", "semester"]);
    db.prepare(
      `INSERT INTO prospectus_records
       (id, program_id, program, year_level, semester, subjects_json, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         program_id = excluded.program_id,
         program = excluded.program,
         year_level = excluded.year_level,
         semester = excluded.semester,
         subjects_json = excluded.subjects_json,
         updated_at = excluded.updated_at`,
    ).run(
      id,
      clean(item.programId),
      clean(item.program),
      clean(item.yearLevel),
      clean(item.semester),
      toJson(item.subjects),
      nowIso(),
    );
  }

  if (collection === "academicEvents") {
    requireFields(item, ["title", "dateLabel", "type", "audience", "details"]);
    db.prepare(
      `INSERT INTO academic_calendar (id, title, date_label, type, audience, details, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         date_label = excluded.date_label,
         type = excluded.type,
         audience = excluded.audience,
         details = excluded.details,
         updated_at = excluded.updated_at`,
    ).run(
      id,
      clean(item.title),
      clean(item.dateLabel),
      clean(item.type),
      clean(item.audience),
      clean(item.details),
      nowIso(),
    );
  }

  if (collection === "announcements") {
    requireFields(item, ["title", "body", "dateLabel", "priority", "audience"]);
    db.prepare(
      `INSERT INTO notifications (id, title, body, date_label, priority, audience, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         body = excluded.body,
         date_label = excluded.date_label,
         priority = excluded.priority,
         audience = excluded.audience`,
    ).run(
      id,
      clean(item.title),
      clean(item.body),
      clean(item.dateLabel),
      clean(item.priority),
      clean(item.audience),
      nowIso(),
    );
  }

  return { ...item, id };
};

const seedData = (data) => {
  const missingCollections = collectionNames.filter(
    (collection) => !collectionHasSeedableData(collection),
  );

  if (!databaseIsEmpty() && missingCollections.length === 0) {
    return readAllData();
  }

  db.exec("BEGIN");

  try {
    const collectionsToSeed =
      missingCollections.length > 0 ? missingCollections : collectionNames;

    for (const collection of collectionsToSeed) {
      for (const item of data[collection] ?? []) {
        upsertCollectionRecord(collection, item, {
          allowAdmin: collection === "users",
        });
      }
    }

    db.exec("COMMIT");
    ensureDemoAccounts();
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return readAllData();
};

const deleteCollectionRecord = (collection, id) => {
  const table = collectionTables[collection];

  if (!table) {
    throw new Error("Unknown collection.");
  }

  if (collection === "users") {
    const user = getUserById(id);

    if (user?.role === "admin") {
      throw new Error("The fixed admin account cannot be deleted.");
    }
  }

  db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
};

const handleRequest = async (request, response) => {
  if (request.method === "OPTIONS") {
    send(response, 204);
    return;
  }

  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const parts = url.pathname.split("/").filter(Boolean);

    if (request.method === "GET" && url.pathname === "/api/health") {
      send(response, 200, { ok: true });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/data") {
      send(response, 200, readAllData());
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/data/seed") {
      const body = await readJsonBody(request);
      send(response, 200, seedData(body));
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/auth/sign-in") {
      const body = await readJsonBody(request);
      const identifier = clean(body.identifier);
      const password = clean(body.password);

      const user = getUserByIdentifier(identifier);

      if (!user || user.password_hash !== hashPassword(password)) {
        send(response, 401, { message: "Invalid account or password." });
        return;
      }

      send(response, 200, {
        user: publicUser(user),
        token: createSession(user.id),
      });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/auth/sign-up") {
      const body = await readJsonBody(request);
      requireFields(body, ["name", "username", "email", "password"]);

      const role = roleForEmail(body.email, clean(body.role || "student"));
      const user = upsertUser(
        {
          id: `user-${role}-${createHash("sha1")
            .update(`${body.email}-${Date.now()}`)
            .digest("hex")
            .slice(0, 12)}`,
          name: body.name,
          username: body.username,
          email: body.email,
          password: body.password,
          role,
        },
        { allowAdmin: false },
      );

      send(response, 201, {
        user,
        token: createSession(user.id),
      });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/users") {
      requireAdmin(request);
      const body = await readJsonBody(request);
      const role = roleForEmail(body.email, clean(body.role || "student"));
      const user = upsertUser(
        {
          id: `user-${role}-${Date.now()}-${randomUUID().slice(0, 8)}`,
          ...body,
          role,
        },
        { allowAdmin: false },
      );
      send(response, 201, { user });
      return;
    }

    if (parts[0] === "api" && parts[1] === "users" && parts[2]) {
      requireAdmin(request);
      const id = decodeURIComponent(parts[2]);

      if (request.method === "PUT") {
        const current = getUserById(id);

        if (!current || current.role !== "student") {
          throw new Error("Student account was not found.");
        }

        const body = await readJsonBody(request);
        const nextRole = roleForEmail(body.email ?? current.email, "student");

        if (nextRole !== "student") {
          throw new Error("Student accounts must use an MSU email address.");
        }

        const user = upsertUser(
          {
            ...current,
            ...body,
            id,
            role: "student",
            passwordHash: clean(body.password)
              ? hashPassword(body.password)
              : current.password_hash,
          },
          { allowAdmin: false },
        );
        send(response, 200, { user });
        return;
      }

      if (request.method === "DELETE") {
        const current = getUserById(id);

        if (!current || current.role !== "student") {
          throw new Error("Student account was not found.");
        }

        deleteCollectionRecord("users", id);
        send(response, 204);
        return;
      }
    }

    if (parts[0] === "api" && parts[1] === "data" && parts[2]) {
      const collection = decodeURIComponent(parts[2]);

      if (request.method === "POST") {
        if (collection === "classSchedules") {
          requireSignedIn(request);
        } else {
          requireAdmin(request);
        }

        const body = await readJsonBody(request);
        const item = upsertCollectionRecord(collection, body, {
          allowAdmin: false,
        });
        send(response, 200, { item });
        return;
      }

      if (request.method === "DELETE" && parts[3]) {
        if (collection === "classSchedules") {
          requireSignedIn(request);
        } else {
          requireAdmin(request);
        }

        deleteCollectionRecord(collection, decodeURIComponent(parts[3]));
        send(response, 204);
        return;
      }
    }

    send(response, 404, { message: "Route not found." });
  } catch (error) {
    send(response, 400, {
      message: error instanceof Error ? error.message : "Request failed.",
    });
  }
};

ensureDemoAccounts();

createServer(handleRequest).listen(port, "0.0.0.0", () => {
  console.log(`myMSU backend running on http://localhost:${port}`);
  console.log(`SQLite database: ${dbPath}`);
});
