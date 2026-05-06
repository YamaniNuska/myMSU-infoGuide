import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
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
import { getLiveAssistantAnswer } from "../../data/appStore";
import { buildSystemPrompt } from "./msuKnowledge";

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

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export default function AI({ onBack }: AIScreenProps) {
  const router = useRouter();

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

  const groqApiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY ?? "";

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

    if (!groqApiKey) {
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
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
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
        const errorText = await response.text();
        throw new Error(errorText || "Groq request failed.");
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
          : "Something went wrong while contacting Groq.";

      setErrorMessage(message);
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
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Ask about MSU Main Campus</Text>
            <Text style={styles.heroText}>
              Handbook topics, registrar concerns, admissions, student affairs,
              schedules, programs, and app navigation support are built in.
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
                  <ActivityIndicator size="small" color="#7F0A0A" />
                  <Text style={styles.typingText}>Groq is thinking...</Text>
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
    backgroundColor: "#F3F1EE",
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F1EE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5DCD7",
    backgroundColor: "#FAF8F6",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7F0A0A",
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2F1F1F",
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#8B7E7E",
  },
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E9DBD0",
  },
  headerBadgeText: {
    color: "#7F0A0A",
    fontSize: 12,
    fontWeight: "700",
  },
  chatContent: {
    padding: 16,
    paddingBottom: 26,
  },
  heroCard: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "#7F0A0A",
    marginBottom: 14,
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6DEDA",
  },
  suggestionText: {
    color: "#5F4E4E",
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
    backgroundColor: "#7F0A0A",
    borderBottomRightRadius: 8,
  },
  assistantBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: "#E7DFDB",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  userText: {
    color: "#FFFFFF",
  },
  assistantText: {
    color: "#2C2727",
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  typingText: {
    color: "#6C6060",
    fontSize: 13,
  },
  errorBanner: {
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#FEE8E8",
    borderWidth: 1,
    borderColor: "#F2B8B8",
  },
  errorText: {
    color: "#8B1E1E",
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
    borderTopWidth: 1,
    borderTopColor: "#E5DCD7",
    backgroundColor: "#FAF8F6",
  },
  input: {
    flex: 1,
    minHeight: 52,
    maxHeight: 120,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5DCD7",
    color: "#2E2222",
    fontSize: 14,
  },
  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7F0A0A",
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
});
