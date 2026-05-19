// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.105.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type EmailPayload = {
  messageId?: string;
  officeId?: string;
  officeName?: string;
  officeEmail?: string;
  senderName?: string;
  senderEmail?: string;
  subject?: string;
  message?: string;
  attachmentName?: string;
  attachmentPath?: string;
};

const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const attachmentBucket = "admin-contact-files";

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const textToHtml = (value = "") =>
  escapeHtml(value).replace(/\r?\n/g, "<br />");

const cleanEmail = (value?: string) => value?.match(emailPattern)?.[0] ?? "";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail =
    Deno.env.get("OFFICE_EMAIL_FROM") ??
    "myMSU InfoGuide <onboarding@resend.dev>";
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!resendApiKey) {
    return json({ error: "RESEND_API_KEY is not configured." }, 500);
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Supabase service credentials are not configured." }, 500);
  }

  let payload: EmailPayload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const recipient = cleanEmail(payload.officeEmail);
  const senderEmail = cleanEmail(payload.senderEmail);

  if (!payload.messageId) {
    return json({ error: "Missing saved message id." }, 400);
  }

  if (!recipient) {
    return json({ error: "The selected office does not have a valid email." }, 400);
  }

  if (!senderEmail) {
    return json({ error: "The sender email is not valid." }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  let attachmentNote = "";
  let attachmentHtml = "";

  if (payload.attachmentPath) {
    const { data } = await supabase.storage
      .from(attachmentBucket)
      .createSignedUrl(payload.attachmentPath, 60 * 60 * 24 * 7);

    if (data?.signedUrl) {
      attachmentNote = `\n\nAttachment: ${payload.attachmentName ?? "File"}\n${data.signedUrl}`;
      attachmentHtml = `<p><strong>Attachment:</strong> <a href="${escapeHtml(
        data.signedUrl,
      )}">${escapeHtml(payload.attachmentName ?? "Open file")}</a></p>`;
    } else {
      attachmentNote = `\n\nAttachment uploaded in app: ${
        payload.attachmentName ?? payload.attachmentPath
      }`;
      attachmentHtml = `<p><strong>Attachment:</strong> ${escapeHtml(
        payload.attachmentName ?? payload.attachmentPath,
      )}</p>`;
    }
  }

  const subject = payload.subject?.trim() || `Inquiry for ${payload.officeName}`;
  const plainText = [
    `Office: ${payload.officeName ?? "Office"}`,
    `From: ${payload.senderName ?? "Sender"} <${senderEmail}>`,
    "",
    payload.message ?? "",
    attachmentNote.trim(),
  ]
    .filter(Boolean)
    .join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #251313;">
      <h2 style="margin: 0 0 12px;">${escapeHtml(subject)}</h2>
      <p><strong>Office:</strong> ${escapeHtml(payload.officeName ?? "Office")}</p>
      <p><strong>From:</strong> ${escapeHtml(
        payload.senderName ?? "Sender",
      )} &lt;${escapeHtml(senderEmail)}&gt;</p>
      <hr style="border: 0; border-top: 1px solid #eadede; margin: 18px 0;" />
      <p>${textToHtml(payload.message ?? "")}</p>
      ${attachmentHtml}
    </div>
  `;

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [recipient],
      reply_to: senderEmail,
      subject,
      text: plainText,
      html,
    }),
  });

  const emailResult = await emailResponse.json().catch(() => ({}));

  if (!emailResponse.ok) {
    await supabase
      .from("admin_contact_messages")
      .update({ status: "email_failed" })
      .eq("id", payload.messageId);

    return json(
      {
        error:
          typeof emailResult?.message === "string"
            ? emailResult.message
            : "The email provider could not send this message.",
      },
      502,
    );
  }

  await supabase
    .from("admin_contact_messages")
    .update({ status: "email_sent" })
    .eq("id", payload.messageId);

  return json({ ok: true, providerId: emailResult?.id ?? null });
});
