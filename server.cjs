const fs = require("fs");
const http = require("http");
const path = require("path");
const nodemailer = require("nodemailer");

const port = Number(process.env.PORT || 3000);
const distDir = path.join(__dirname, "dist");
const indexFile = path.join(distDir, "index.html");
const attachmentBucket = "admin-contact-files";
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const apiHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function sendJson(response, status, body) {
  response.writeHead(status, {
    ...apiHeaders,
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

function getRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1024 * 1024) {
        reject(new Error("Request body is too large."));
        request.destroy();
      }
    });

    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    request.on("error", reject);
  });
}

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function textToHtml(value = "") {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

function cleanEmail(value) {
  return typeof value === "string" ? value.match(emailPattern)?.[0] ?? "" : "";
}

function requiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

async function supabaseFetch(pathname, options = {}) {
  const supabaseUrl = requiredEnv("SUPABASE_URL").replace(/\/+$/, "");
  const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const response = await fetch(`${supabaseUrl}${pathname}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      errorText || `Supabase request failed with status ${response.status}.`,
    );
  }

  return response;
}

async function updateMessageStatus(messageId, status) {
  if (!messageId) {
    return;
  }

  await supabaseFetch(
    `/rest/v1/admin_contact_messages?id=eq.${encodeURIComponent(messageId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ status }),
    },
  );
}

async function getOfficeRecipient(officeId) {
  const response = await supabaseFetch(
    `/rest/v1/administrative_offices?id=eq.${encodeURIComponent(
      officeId,
    )}&select=name,contact`,
  );
  const rows = await response.json();
  const office = Array.isArray(rows) ? rows[0] : null;
  const recipient = cleanEmail(office?.contact);

  return {
    recipient,
    officeName: typeof office?.name === "string" ? office.name : "",
  };
}

async function createAttachmentSignedUrl(attachmentPath) {
  if (!attachmentPath) {
    return "";
  }

  const encodedPath = attachmentPath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  const response = await supabaseFetch(
    `/storage/v1/object/sign/${attachmentBucket}/${encodedPath}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn: 60 * 60 * 24 * 7 }),
    },
  );
  const data = await response.json();

  if (typeof data.signedURL === "string") {
    return `${requiredEnv("SUPABASE_URL").replace(/\/+$/, "")}/storage/v1${data.signedURL}`;
  }

  if (typeof data.signedUrl === "string") {
    return data.signedUrl;
  }

  return "";
}

async function handleSendEmail(request, response) {
  let payload;

  try {
    payload = await getRequestBody(request);
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : "Invalid request body.",
    });
    return;
  }

  const senderEmail = cleanEmail(payload.senderEmail);

  if (!payload.messageId) {
    sendJson(response, 400, { error: "Missing saved message id." });
    return;
  }

  if (!payload.officeId) {
    sendJson(response, 400, { error: "Missing office id." });
    return;
  }

  if (!senderEmail) {
    sendJson(response, 400, { error: "The sender email is not valid." });
    return;
  }

  try {
    const gmailUser = requiredEnv("GMAIL_USER");
    const gmailAppPassword = requiredEnv("GMAIL_APP_PASSWORD");
    const fromEmail =
      process.env.EMAIL_FROM?.trim() ||
      process.env.OFFICE_EMAIL_FROM?.trim() ||
      gmailUser;
    const officeRecipient = await getOfficeRecipient(payload.officeId);
    const recipient = officeRecipient.recipient;

    if (!recipient) {
      await updateMessageStatus(payload.messageId, "email_failed");
      sendJson(response, 400, {
        error: "The selected office does not have a valid email.",
      });
      return;
    }

    const officeName = officeRecipient.officeName || payload.officeName || "Office";
    const attachmentUrl = await createAttachmentSignedUrl(payload.attachmentPath);
    const attachmentName = payload.attachmentName || "File";
    const attachmentNote = attachmentUrl
      ? `\n\nAttachment: ${attachmentName}\n${attachmentUrl}`
      : payload.attachmentPath
        ? `\n\nAttachment uploaded in app: ${attachmentName}`
        : "";
    const attachmentHtml = attachmentUrl
      ? `<p><strong>Attachment:</strong> <a href="${escapeHtml(
          attachmentUrl,
        )}">${escapeHtml(attachmentName)}</a></p>`
      : payload.attachmentPath
        ? `<p><strong>Attachment:</strong> ${escapeHtml(attachmentName)}</p>`
        : "";
    const subject =
      typeof payload.subject === "string" && payload.subject.trim()
        ? payload.subject.trim()
        : `Inquiry for ${officeName}`;
    const plainText = [
      `Office: ${officeName}`,
      `From: ${payload.senderName || "Sender"} <${senderEmail}>`,
      "",
      payload.message || "",
      attachmentNote.trim(),
    ]
      .filter(Boolean)
      .join("\n");
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #251313;">
        <h2 style="margin: 0 0 12px;">${escapeHtml(subject)}</h2>
        <p><strong>Office:</strong> ${escapeHtml(officeName)}</p>
        <p><strong>From:</strong> ${escapeHtml(
          payload.senderName || "Sender",
        )} &lt;${escapeHtml(senderEmail)}&gt;</p>
        <hr style="border: 0; border-top: 1px solid #eadede; margin: 18px 0;" />
        <p>${textToHtml(payload.message || "")}</p>
        ${attachmentHtml}
      </div>
    `;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });
    const result = await transporter.sendMail({
      from: fromEmail,
      to: recipient,
      replyTo: senderEmail,
      subject,
      text: plainText,
      html,
    });

    await updateMessageStatus(payload.messageId, "email_sent");
    sendJson(response, 200, { ok: true, providerId: result.messageId ?? null });
  } catch (error) {
    console.error("Failed to send office email:", error);

    try {
      await updateMessageStatus(payload.messageId, "email_failed");
    } catch (statusError) {
      console.error("Failed to update email status:", statusError);
    }

    sendJson(response, 502, {
      error:
        error instanceof Error
          ? error.message
          : "The email provider could not send this message.",
    });
  }
}

function sendFile(response, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      console.error(`Failed to read ${filePath}:`, error);
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(`Internal Server Error: failed to read ${path.basename(filePath)}`);
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (url.pathname === "/send-email") {
    if (request.method === "OPTIONS") {
      response.writeHead(204, apiHeaders);
      response.end();
      return;
    }

    if (request.method !== "POST") {
      sendJson(response, 405, { error: "Method not allowed." });
      return;
    }

    void handleSendEmail(request, response);
    return;
  }

  const decodedPath = decodeURIComponent(url.pathname);
  const requestedPath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(distDir, requestedPath);

  if (!filePath.startsWith(distDir)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(response, filePath);
      return;
    }

    sendFile(response, indexFile);
  });
});

if (!fs.existsSync(indexFile)) {
  console.error(`Missing ${indexFile}. Run "npm run build" before "npm run serve".`);
  process.exit(1);
}

server.listen(port, "0.0.0.0", () => {
  console.log(`Serving dist on port ${port}`);
});
