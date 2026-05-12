import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getLiveAssistantAnswer } from "../src/data/appStore";
import { colors, radii, shadow } from "../src/theme";
import { buildSystemPrompt } from "../src/data/msuKnowledge";

type AIScreenProps = {
  onBack?: () => void;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const SUGGESTIONS = [
  "Where is the Registrar's Office?",
  "What does the Student Handbook cover?",
  "Who should I contact for student concerns?",
  "How do I use this app?",
] as const;

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm your myMSU-Guide AI. Ask me about MSU Main Campus offices, handbook topics, schedules, programs, or how to use this app.",
};

type RemoteChatProvider = {
  apiKey: string;
  apiUrl: string;
  displayName: string;
  model: string;
};

type RemoteChatError = {
  error?: {
    message?: string;
  };
  message?: string;
};

const XAI_API_URL = "https://api.x.ai/v1/chat/completions";
const XAI_MODEL = process.env.EXPO_PUBLIC_XAI_MODEL || "grok-4.3";
const LEGACY_GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || "";
const GROK_ENV_API_KEY =
  process.env.EXPO_PUBLIC_GROK_API_KEY ||
  process.env.EXPO_PUBLIC_XAI_API_KEY ||
  "";
const GROK_API_KEY =
  GROK_ENV_API_KEY ||
  (LEGACY_GROQ_API_KEY.startsWith("xai-") ? LEGACY_GROQ_API_KEY : "");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL =
  process.env.EXPO_PUBLIC_GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_API_KEY = LEGACY_GROQ_API_KEY.startsWith("xai-")
  ? ""
  : LEGACY_GROQ_API_KEY;

const getRemoteChatProvider = (): RemoteChatProvider | null => {
  if (GROK_API_KEY) {
    return {
      apiKey: GROK_API_KEY,
      apiUrl: XAI_API_URL,
      displayName: "Grok",
      model: XAI_MODEL,
    };
  }

  if (GROQ_API_KEY) {
    return {
      apiKey: GROQ_API_KEY,
      apiUrl: GROQ_API_URL,
      displayName: "Groq",
      model: GROQ_MODEL,
    };
  }

  return null;
};

const normalizePrompt = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getDirectAssistantReply = (rawText: string) => {
  const text = normalizePrompt(rawText);

  if (!text) {
    return null;
  }

  if (
    /^(hi|hello|hey|yo|kumusta|salam|assalamu alaikum|good morning|good afternoon|good evening)(\s+(po|there|sir|maam|ma'am|guide))*$/.test(
      text,
    )
  ) {
    return "Hi! I am here. Ask me about campus offices, the handbook, programs, schedules, announcements, or the map.";
  }

  if (
    /^(thanks|thank you|ty|salamat|okay thanks|ok thanks)(\s+(po|sir|maam|ma'am))*$/.test(
      text,
    )
  ) {
    return "You are welcome. I am here if you need help finding an office, policy, program, or campus location.";
  }

  if (
    /^(who are you|what are you|what can you do|help|help me|how can you help)$/.test(
      text,
    )
  ) {
    return "I am myMSU-Guide AI. I can help you search the handbook, find campus offices, explain app sections, look up programs, and guide you around the campus map.";
  }

  return null;
};

const getResponseErrorMessage = async (response: Response) => {
  const fallback = `Request failed with status ${response.status}.`;

  try {
    const errorBody = (await response.json()) as RemoteChatError;

    return errorBody.error?.message ?? errorBody.message ?? fallback;
  } catch {
    return fallback;
  }
};

export default function AI({ onBack }: AIScreenProps) {
  const router = useRouter();
  const entry = React.useRef(new Animated.Value(0)).current;
  const remoteProvider = getRemoteChatProvider();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    INITIAL_MESSAGE,
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const scrollRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 460,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entry]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 80);

    return () => clearTimeout(timeout);
  }, [messages, isLoading]);

  const sendMessage = async (rawText?: string) => {
    const content = (rawText ?? input).trim();

    if (!content || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setErrorMessage(null);

    const directReply = getDirectAssistantReply(content);

    if (directReply) {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant-direct`,
          role: "assistant",
          content: directReply,
        },
      ]);
      setIsLoading(false);
      return;
    }

    if (!remoteProvider) {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant-local`,
          role: "assistant",
          content: getLiveAssistantAnswer(content),
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(remoteProvider.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${remoteProvider.apiKey}`,
        },
        body: JSON.stringify({
          model: remoteProvider.model,
          temperature: 0.3,
          max_tokens: 900,
          messages: [
            {
              role: "system",
              content: buildSystemPrompt(),
            },
            ...nextMessages.slice(-12).map((message) => ({
              role: message.role,
              content: message.content,
            })),
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }

      const data = await response.json();
      const assistantText =
        data?.choices?.[0]?.message?.content?.trim() ??
        "I couldn't generate a response right now.";

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: assistantText,
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `Something went wrong while contacting ${remoteProvider.displayName}.`;

      setErrorMessage(`${remoteProvider.displayName}: ${message}`);
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant-error`,
          role: "assistant",
          content: getLiveAssistantAnswer(content),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </Pressable>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>AI Chatbot</Text>
            <Text style={styles.headerSubtitle}>
              MSU guide with offline database fallback
            </Text>
          </View>

          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>AI</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: entry,
              transform: [
                {
                  translateY: entry.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
              ],
            }}
          >
            <View style={styles.heroCard}>
              <Text style={styles.heroTitle}>Ask about MSU Main Campus</Text>
              <Text style={styles.heroText}>
                Handbook topics, registrar concerns, admissions, student
                affairs, schedules, programs, and app navigation support are
                built in.
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionRow}
            >
              {SUGGESTIONS.map((suggestion) => (
                <Pressable
                  key={suggestion}
                  style={styles.suggestionChip}
                  onPress={() => sendMessage(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>

          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  isUser ? styles.messageRowUser : styles.messageRowAssistant,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.assistantBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isUser ? styles.userText : styles.assistantText,
                    ]}
                  >
                    {message.content}
                  </Text>
                </View>
              </View>
            );
          })}

          {isLoading ? (
            <View style={[styles.messageRow, styles.messageRowAssistant]}>
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <View style={styles.typingRow}>
                  <ActivityIndicator size="small" color={colors.maroon} />
                  <Text style={styles.typingText}>
                    {remoteProvider?.displayName ?? "AI"} is thinking...
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.composerWrap}>
          <TextInput
            style={styles.input}
            placeholder="Message myMSU-Guide AI..."
            placeholderTextColor="#9D8A8A"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <Pressable
            style={[
              styles.sendButton,
              !input.trim() || isLoading ? styles.sendButtonDisabled : null,
            ]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || isLoading}
          >
            <Ionicons name="arrow-up" size={20} color="#ffffff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.maroon,
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.muted,
  },
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.maroonSoft,
  },
  headerBadgeText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: "700",
  },
  chatContent: {
    padding: 16,
    paddingBottom: 112,
  },
  heroCard: {
    borderRadius: radii.sm,
    padding: 18,
    backgroundColor: colors.maroon,
    marginBottom: 14,
    ...shadow,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  heroText: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 13,
    lineHeight: 20,
  },
  suggestionRow: {
    paddingBottom: 8,
    gap: 10,
  },
  suggestionChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  suggestionText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  messageRow: {
    marginTop: 12,
    flexDirection: "row",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageRowAssistant: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "84%",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: colors.maroon,
    borderBottomRightRadius: 8,
  },
  assistantBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  userText: {
    color: "#FFFFFF",
  },
  assistantText: {
    color: colors.ink,
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  typingText: {
    color: colors.muted,
    fontSize: 13,
  },
  errorBanner: {
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#FCE8E6",
    borderWidth: 1,
    borderColor: "#F5C2BE",
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    lineHeight: 18,
  },
  composerWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 22 : 14,
    marginBottom: Platform.OS === "ios" ? 92 : 86,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    minHeight: 52,
    maxHeight: 120,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
    fontSize: 14,
  },
  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.maroon,
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
});
