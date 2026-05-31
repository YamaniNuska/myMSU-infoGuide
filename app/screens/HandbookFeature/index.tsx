import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderUserAvatar from "../../../src/components/HeaderUserAvatar";
import { useAppData } from "../../../src/data/appStore";
import {
  bottomTabClearance,
  colors,
  maxContentWidth,
  radii,
  shadow,
} from "../../../src/theme";

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
  const didSetDefaultExpanded = React.useRef(!!handbookEntries[0]?.id);
  const [readerMode, setReaderMode] = React.useState<"bites" | "list">("bites");
  const [biteIndex, setBiteIndex] = React.useState(0);

  React.useEffect(() => {
    if (!didSetDefaultExpanded.current && handbookEntries[0]) {
      setExpandedId(handbookEntries[0].id);
      didSetDefaultExpanded.current = true;
    }
  }, [handbookEntries]);

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

  const featuredEntries = filteredEntries;
  const activeBite =
    featuredEntries.length > 0
      ? featuredEntries[Math.min(biteIndex, featuredEntries.length - 1)]
      : undefined;
  const activeBiteText = activeBite?.content.trim() ?? "";
  const biteProgress =
    featuredEntries.length > 0
      ? `Topic ${Math.min(biteIndex + 1, featuredEntries.length)} of ${featuredEntries.length}`
      : "No pages yet";

  React.useEffect(() => {
    setBiteIndex(0);
  }, [query]);

  React.useEffect(() => {
    if (biteIndex >= featuredEntries.length) {
      setBiteIndex(0);
    }
  }, [biteIndex, featuredEntries.length]);

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((current) => (current === id ? null : id));
  };

  const chooseTopic = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBiteIndex(index);
  };

  const nextTopic = () => {
    if (featuredEntries.length === 0) {
      return;
    }

    chooseTopic((biteIndex + 1) % featuredEntries.length);
  };

  const previousTopic = () => {
    const nextIndex =
      biteIndex === 0 ? Math.max(featuredEntries.length - 1, 0) : biteIndex - 1;
    chooseTopic(nextIndex);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <LinearGradient
        colors={[colors.maroonDark, colors.maroon]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View pointerEvents="none" style={styles.headerGoldLine} />
        <View pointerEvents="none" style={styles.headerGlassPlate} />
        <View style={[styles.headerInner, isWide && styles.headerInnerWide]}>
          <View style={styles.headerTopRow}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={20} color={colors.surface} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
            <HeaderUserAvatar light showName={false} style={styles.headerAvatar} />
          </View>

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
      </LinearGradient>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.content,
          isWide && styles.contentWide,
          styles.contentWithTabSpace,
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

        <View style={styles.modeSwitch}>
          <Pressable
            style={[
              styles.modeButton,
              readerMode === "bites" && styles.modeButtonActive,
            ]}
            onPress={() => setReaderMode("bites")}
          >
            <Ionicons
              name="sparkles"
              size={16}
              color={readerMode === "bites" ? colors.surface : colors.maroon}
            />
            <Text
              style={[
                styles.modeButtonText,
                readerMode === "bites" && styles.modeButtonTextActive,
              ]}
            >
              Page Mode
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.modeButton,
              readerMode === "list" && styles.modeButtonActive,
            ]}
            onPress={() => setReaderMode("list")}
          >
            <Ionicons
              name="list"
              size={16}
              color={readerMode === "list" ? colors.surface : colors.maroon}
            />
            <Text
              style={[
                styles.modeButtonText,
                readerMode === "list" && styles.modeButtonTextActive,
              ]}
            >
              Full List
            </Text>
          </Pressable>
        </View>

        {readerMode === "bites" && activeBite ? (
          <View style={styles.bitePanel}>
            <View style={styles.biteTopRow}>
              <View style={styles.biteBadge}>
                <Ionicons name="bookmarks" size={15} color={colors.teal} />
                <Text style={styles.biteBadgeText}>{biteProgress}</Text>
              </View>
            </View>

            <Text style={styles.biteChapter}>{activeBite.chapter}</Text>
            <Text style={styles.biteTitle}>{activeBite.title}</Text>
            <Text style={styles.biteText}>{activeBiteText}</Text>

            <View style={styles.biteActionRow}>
              <Pressable style={styles.biteActionButton} onPress={previousTopic}>
                <Ionicons name="chevron-back" size={18} color={colors.maroonDark} />
                <Text style={styles.biteActionText}>Previous topic</Text>
              </Pressable>
              <Pressable
                style={[styles.biteActionButton, styles.biteActionButtonPrimary]}
                onPress={nextTopic}
              >
                <Text style={styles.biteActionTextPrimary}>Next topic</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.surface} />
              </Pressable>
            </View>
          </View>
        ) : null}

        {readerMode === "list" ? filteredEntries.map((entry) => {
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
        }) : null}

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
    backgroundColor: colors.maroonDark,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    position: "relative",
    overflow: "hidden",
    zIndex: 2,
    elevation: 4,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 15,
    borderBottomLeftRadius: radii.md,
    borderBottomRightRadius: radii.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(216, 178, 74, 0.18)",
  },
  headerGoldLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 3,
    backgroundColor: colors.gold,
    opacity: 0.92,
  },
  headerGlassPlate: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 48,
    height: 72,
    borderRadius: radii.md,
    backgroundColor: "rgba(255, 255, 255, 0.055)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 74, 0.12)",
  },
  headerInner: {
    width: "100%",
    alignSelf: "center",
    position: "relative",
  },
  headerInnerWide: {
    maxWidth: maxContentWidth,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 6,
  },
  headerAvatar: {
    flexShrink: 0,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 74, 0.22)",
  },
  backText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "600",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginTop: 0,
    paddingVertical: 8,
    paddingLeft: 11,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(216, 178, 74, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 74, 0.28)",
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    color: colors.surface,
    fontSize: 21,
    lineHeight: 26,
    fontWeight: "900",
  },
  headerSubtitle: {
    marginTop: 3,
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    lineHeight: 17,
  },
  searchBox: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(216,178,74,0.35)",
    ...shadow,
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
  contentWithTabSpace: {
    paddingBottom: bottomTabClearance,
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
  modeSwitch: {
    flexDirection: "row",
    gap: 8,
    padding: 5,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  modeButton: {
    flex: 1,
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: radii.sm,
  },
  modeButtonActive: {
    backgroundColor: colors.maroon,
  },
  modeButtonText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: "900",
  },
  modeButtonTextActive: {
    color: colors.surface,
  },
  bitePanel: {
    overflow: "hidden",
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  biteTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  biteBadge: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.tealSoft,
  },
  biteBadgeText: {
    color: colors.teal,
    fontSize: 11,
    fontWeight: "900",
  },
  biteChapter: {
    marginTop: 16,
    color: colors.goldDark,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  biteTitle: {
    marginTop: 5,
    color: colors.maroonDark,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "900",
  },
  biteText: {
    marginTop: 12,
    color: colors.ink,
    fontSize: 15,
    lineHeight: 25,
  },
  biteActionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  biteActionButton: {
    flex: 1,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  biteActionButtonPrimary: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  biteActionText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  biteActionTextPrimary: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "900",
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
