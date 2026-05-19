import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuthSession } from "../../auth/localAuth";
import type { OfficeRecord } from "../../data/mymsuDatabase";
import {
  type AdminContactMessageRecord,
  formatBytes,
  getAdminAttachmentLimitBytes,
  supabaseCreateAdminContactMessage,
  supabaseGetAdminContactMessages,
  supabaseSendAdminContactEmail,
  supabaseUploadAdminContactAttachment,
} from "../../data/supabaseData";
import { colors, radii, shadow } from "../../theme";

type OfficeMessageThreadProps = {
  office: OfficeRecord;
};

type SelectedAttachment = {
  name: string;
  uri: string;
  size?: number | null;
  mimeType?: string | null;
};

const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const attachmentLimitBytes = getAdminAttachmentLimitBytes();

export const getOfficeEmail = (contact: string) =>
  contact.match(emailPattern)?.[0];

export default function OfficeMessageThread({
  office,
}: OfficeMessageThreadProps) {
  const session = useAuthSession();
  const officeEmail = getOfficeEmail(office.contact);
  const [senderName, setSenderName] = React.useState(session?.name ?? "");
  const [senderEmail, setSenderEmail] = React.useState(session?.email ?? "");
  const [subject, setSubject] = React.useState(`Inquiry for ${office.name}`);
  const [message, setMessage] = React.useState("");
  const [attachment, setAttachment] = React.useState<SelectedAttachment | null>(
    null,
  );
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [messages, setMessages] = React.useState<AdminContactMessageRecord[]>([]);
  const [loadingMessages, setLoadingMessages] = React.useState(false);

  React.useEffect(() => {
    if (session?.name && !senderName) {
      setSenderName(session.name);
    }

    if (session?.email && !senderEmail) {
      setSenderEmail(session.email);
    }
  }, [senderEmail, senderName, session]);

  React.useEffect(() => {
    setSubject(`Inquiry for ${office.name}`);
    setMessage("");
    setAttachment(null);
    setFeedback(null);
  }, [office.id, office.name]);

  React.useEffect(() => {
    let cancelled = false;
    const cleanSenderEmail = senderEmail.trim().toLowerCase();

    if (!cleanSenderEmail) {
      setMessages([]);
      setLoadingMessages(false);
      return () => {
        cancelled = true;
      };
    }

    const loadMessages = async () => {
      setLoadingMessages(true);

      try {
        const nextMessages = await supabaseGetAdminContactMessages({
          officeId: office.id,
          senderEmail: cleanSenderEmail,
          limit: 8,
        });

        if (!cancelled) {
          setMessages(nextMessages);
        }
      } catch (error) {
        if (!cancelled) {
          setMessages([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingMessages(false);
        }
      }
    };

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [office.id, senderEmail]);

  const formatSentAt = (value?: string) => {
    if (!value) {
      return "Saved";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Saved";
    }

    return date.toLocaleString();
  };

  const pickAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: "*/*",
      });

      if (result.canceled || !result.assets.length) {
        return;
      }

      const nextAttachment = result.assets[0];

      if (
        typeof nextAttachment.size === "number" &&
        nextAttachment.size > attachmentLimitBytes
      ) {
        setFeedback({
          type: "error",
          message: `Attachment must be smaller than ${formatBytes(attachmentLimitBytes)}.`,
        });
        return;
      }

      setAttachment({
        name: nextAttachment.name,
        uri: nextAttachment.uri,
        size: nextAttachment.size,
        mimeType: nextAttachment.mimeType,
      });
      setFeedback(null);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to open the file picker right now.",
      });
    }
  };

  const sendMessage = async () => {
    const cleanName = senderName.trim();
    const cleanEmail = senderEmail.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanEmail || !cleanSubject || !cleanMessage) {
      setFeedback({
        type: "error",
        message: "Complete your name, email, subject, and message.",
      });
      return;
    }

    if (!emailPattern.test(cleanEmail)) {
      setFeedback({
        type: "error",
        message: "Enter a valid sender email address.",
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const uploadedAttachment = attachment
        ? await supabaseUploadAdminContactAttachment(attachment)
        : null;

      const messagePayload = {
        officeId: office.id,
        officeName: office.name,
        officeEmail,
        senderName: cleanName,
        senderEmail: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        attachmentName: uploadedAttachment?.name,
        attachmentPath: uploadedAttachment?.path,
        attachmentMimeType: uploadedAttachment?.mimeType,
        attachmentSizeBytes: uploadedAttachment?.sizeBytes,
      };
      const messageId = await supabaseCreateAdminContactMessage(messagePayload);

      await supabaseSendAdminContactEmail({
        ...messagePayload,
        messageId,
      });

      setMessage("");
      setAttachment(null);
      setFeedback({
        type: "success",
        message: "Email sent to the office and saved in your message history.",
      });
      const nextMessages = await supabaseGetAdminContactMessages({
        officeId: office.id,
        senderEmail: cleanEmail,
        limit: 8,
      });
      setMessages(nextMessages);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send this office message right now.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.officeCard}>
        <View style={styles.officeCardTop}>
          <View style={styles.officeAvatar}>
            <Ionicons name="mail" size={18} color={colors.surface} />
          </View>
          <View style={styles.officeCardBody}>
            <Text style={styles.officeCardLabel}>Office Inbox</Text>
            <Text style={styles.officeCardTitle}>{office.name}</Text>
          </View>
        </View>
        <Text style={styles.officeCardText}>
          Send a formal message here. Attaching a file is optional.
        </Text>
        <Text style={styles.officeCardMeta}>
          {officeEmail ? `Destination: ${officeEmail}` : office.contact}
        </Text>
      </View>

      <View style={styles.composerCard}>
        <View style={styles.formGrid}>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#8B7D7D"
            value={senderName}
            onChangeText={setSenderName}
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Your email"
            placeholderTextColor="#8B7D7D"
            value={senderEmail}
            onChangeText={setSenderEmail}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Subject"
          placeholderTextColor="#8B7D7D"
          value={subject}
          onChangeText={setSubject}
        />

        <TextInput
          style={[styles.input, styles.messageInput]}
          multiline
          placeholder="State your concern, request, or supporting details..."
          placeholderTextColor="#8B7D7D"
          value={message}
          onChangeText={setMessage}
        />

        <View style={styles.attachmentRow}>
          <Pressable style={styles.attachButton} onPress={pickAttachment}>
            <Ionicons name="attach-outline" size={16} color={colors.maroonDark} />
            <Text style={styles.attachButtonText}>Attach File</Text>
          </Pressable>
          <Text style={styles.attachmentHint}>
            Optional, up to {formatBytes(attachmentLimitBytes)}
          </Text>
        </View>

        {attachment ? (
          <View style={styles.selectedAttachment}>
            <View style={styles.selectedAttachmentInfo}>
              <Ionicons name="document-text-outline" size={18} color={colors.teal} />
              <View style={styles.selectedAttachmentTextWrap}>
                <Text numberOfLines={1} style={styles.selectedAttachmentName}>
                  {attachment.name}
                </Text>
                <Text style={styles.selectedAttachmentMeta}>
                  {attachment.size ? formatBytes(attachment.size) : "File selected"}
                </Text>
              </View>
            </View>
            <Pressable onPress={() => setAttachment(null)}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          </View>
        ) : null}

        <Pressable
          style={[styles.sendButton, submitting && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.surface} size="small" />
          ) : (
            <Ionicons name="send" size={16} color={colors.surface} />
          )}
          <Text style={styles.sendText}>
            {submitting ? "Sending..." : "Send Email"}
          </Text>
        </Pressable>

        {feedback ? (
          <View
            style={[
              styles.feedbackBanner,
              feedback.type === "success"
                ? styles.feedbackBannerSuccess
                : styles.feedbackBannerError,
            ]}
          >
            <Ionicons
              name={
                feedback.type === "success"
                  ? "checkmark-circle"
                  : "alert-circle"
              }
              size={16}
              color={
                feedback.type === "success" ? colors.success : colors.danger
              }
            />
            <Text
              style={[
                styles.feedbackText,
                feedback.type === "success"
                  ? styles.feedbackTextSuccess
                  : styles.feedbackTextError,
              ]}
            >
              {feedback.message}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>Sent Messages</Text>
        <Text style={styles.historyText}>
          Messages you sent to this office appear here after they are saved.
        </Text>

        {loadingMessages ? (
          <Text style={styles.historyEmpty}>Loading sent messages...</Text>
        ) : messages.length === 0 ? (
          <Text style={styles.historyEmpty}>No sent messages yet.</Text>
        ) : (
          <View style={styles.historyList}>
            {messages.map((entry) => (
              <View key={entry.id} style={styles.historyItem}>
                <View style={styles.historyItemTop}>
                  <Text numberOfLines={1} style={styles.historyItemTitle}>
                    {entry.subject}
                  </Text>
                  <Text style={styles.historyItemDate}>
                    {formatSentAt(entry.createdAt)}
                  </Text>
                </View>
                <Text style={styles.historyItemBody}>{entry.message}</Text>
                <View style={styles.historyMetaRow}>
                  <Text style={styles.historyStatus}>
                    Status: {entry.status.toUpperCase()}
                  </Text>
                  {entry.attachmentName ? (
                    <Text numberOfLines={1} style={styles.historyAttachment}>
                      Attachment: {entry.attachmentName}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 14,
  },
  officeCard: {
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 8,
    ...shadow,
  },
  officeCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  officeAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.maroon,
  },
  officeCardBody: {
    flex: 1,
    minWidth: 0,
  },
  officeCardLabel: {
    color: colors.goldDark,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  officeCardTitle: {
    marginTop: 4,
    color: colors.maroonDark,
    fontSize: 16,
    fontWeight: "800",
  },
  officeCardText: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 19,
  },
  officeCardMeta: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  composerCard: {
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 10,
    ...shadow,
  },
  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  input: {
    flexGrow: 1,
    minWidth: 160,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
    fontSize: 13,
  },
  messageInput: {
    minHeight: 116,
    textAlignVertical: "top",
  },
  attachmentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  attachButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.maroonSoft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  attachButtonText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  attachmentHint: {
    flex: 1,
    textAlign: "right",
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  selectedAttachment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 11,
    borderRadius: radii.sm,
    backgroundColor: colors.tealSoft,
    borderWidth: 1,
    borderColor: "rgba(15, 118, 110, 0.18)",
  },
  selectedAttachmentInfo: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectedAttachmentTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  selectedAttachmentName: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "800",
  },
  selectedAttachmentMeta: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  sendButton: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.maroon,
  },
  sendButtonDisabled: {
    opacity: 0.72,
  },
  sendText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  feedbackBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 11,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  feedbackBannerSuccess: {
    backgroundColor: "#EDF8F1",
    borderColor: "rgba(36, 122, 77, 0.24)",
  },
  feedbackBannerError: {
    backgroundColor: "#FCECEA",
    borderColor: "rgba(180, 35, 24, 0.2)",
  },
  feedbackText: {
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
  feedbackTextSuccess: {
    color: colors.success,
  },
  feedbackTextError: {
    color: colors.danger,
  },
  historyCard: {
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 10,
    ...shadow,
  },
  historyTitle: {
    color: colors.maroonDark,
    fontSize: 16,
    fontWeight: "800",
  },
  historyText: {
    color: colors.maroonDark,
    fontSize: 12,
    lineHeight: 18,
  },
  historyEmpty: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
  historyList: {
    gap: 10,
  },
  historyItem: {
    padding: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 7,
  },
  historyItemTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  historyItemTitle: {
    flex: 1,
    color: colors.maroonDark,
    fontSize: 13,
    fontWeight: "800",
  },
  historyItemDate: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
  },
  historyItemBody: {
    color: colors.ink,
    fontSize: 12,
    lineHeight: 18,
  },
  historyMetaRow: {
    gap: 4,
  },
  historyStatus: {
    color: colors.goldDark,
    fontSize: 10,
    fontWeight: "900",
  },
  historyAttachment: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  statusText: {
    color: colors.maroonDark,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
});
