import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
  useWindowDimensions,
} from "react-native";
import { useAppData } from "../../../src/data/appStore";
import { colors, maxContentWidth, radii, shadow } from "../../../src/theme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HandbookScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { handbookEntries } = useAppData();
  const isWide = width >= 760;
  const [query, setQuery] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>(
    handbookEntries[0]?.id ?? null,
  );

  const filteredEntries = handbookEntries.filter((entry) => {
    const searchable = [
      entry.chapter,
      entry.title,
      entry.content,
      ...entry.tags,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query.trim().toLowerCase());
  });

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={[styles.headerInner, isWide && styles.headerInnerWide]}>
          <Pressable style={styles.backButton} onPress={() => router.push("/")}>
            <Ionicons name="arrow-back" size={20} color={colors.surface} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View style={styles.headerTitleRow}>
            <View style={styles.headerIcon}>
              <Ionicons name="book" size={24} color={colors.gold} />
            </View>
            <View style={styles.headerCopy}>
              <Text style={styles.headerTitle}>Student Handbook</Text>
              <Text style={styles.headerSubtitle}>
                Search MSU policies, offices, services, and student guidance.
              </Text>
            </View>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={colors.maroon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search policies, chapters, offices..."
              placeholderTextColor="#8B7D7D"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
            />
            {query ? (
              <Pressable onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={20} color="#B5A8A8" />
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          isWide && styles.contentWide,
          { paddingBottom: 34 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Digital handbook database</Text>
          <Text style={styles.summaryText}>
            The handbook content is stored as searchable records and syncs with
            the shared Supabase handbook table.
          </Text>
        </View>

        {filteredEntries.map((entry) => {
          const expanded = expandedId === entry.id;

          return (
            <Pressable
              key={entry.id}
              style={styles.accordionCard}
              onPress={() => toggle(entry.id)}
            >
              <View style={styles.accordionHeader}>
                <View style={styles.accordionTitleWrap}>
                  <Text style={styles.chapterText}>{entry.chapter}</Text>
                  <Text style={styles.accordionTitle}>{entry.title}</Text>
                </View>
                <Ionicons
                  name={expanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.goldDark}
                />
              </View>

              {expanded ? (
                <View style={styles.accordionContent}>
                  <Text style={styles.contentText}>{entry.content}</Text>
                  <View style={styles.tagRow}>
                    {entry.tags.map((tag) => (
                      <Text key={tag} style={styles.tag}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                </View>
              ) : null}
            </Pressable>
          );
        })}

        {filteredEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No handbook result</Text>
            <Text style={styles.emptyText}>
              Try discipline, DSA, registrar, housing, or campus journalism.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    backgroundColor: colors.maroon,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: radii.sm,
    borderBottomRightRadius: radii.sm,
  },
  headerInner: {
    width: "100%",
    alignSelf: "center",
  },
  headerInnerWide: {
    maxWidth: maxContentWidth,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  backText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "800",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 18,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: "900",
  },
  headerSubtitle: {
    marginTop: 6,
    color: "rgba(255,255,255,0.84)",
    fontSize: 14,
    lineHeight: 20,
  },
  searchBox: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 18,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    width: "100%",
    alignSelf: "center",
    padding: 18,
    gap: 12,
  },
  contentWide: {
    maxWidth: maxContentWidth,
    paddingVertical: 24,
  },
  summaryCard: {
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  summaryTitle: {
    color: colors.maroonDark,
    fontSize: 17,
    fontWeight: "900",
  },
  summaryText: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  accordionCard: {
    overflow: "hidden",
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 16,
  },
  accordionTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  chapterText: {
    color: colors.goldDark,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  accordionTitle: {
    marginTop: 5,
    color: colors.maroonDark,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "900",
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  contentText: {
    marginTop: 14,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 23,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  tag: {
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radii.pill,
    backgroundColor: colors.maroonSoft,
    color: colors.maroonDark,
    fontSize: 11,
    fontWeight: "800",
  },
  emptyState: {
    alignItems: "center",
    padding: 24,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  emptyTitle: {
    color: colors.maroonDark,
    fontSize: 18,
    fontWeight: "900",
  },
  emptyText: {
    marginTop: 8,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
  },
});
