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
import { useAuthSession } from "../../../src/auth/localAuth";
import { useAppData } from "../../../src/data/appStore";
import {
  bottomTabClearance,
  colors,
  maxContentWidth,
  radii,
  shadow,
} from "../../../src/theme";

type SimpleStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const storage =
  typeof globalThis !== "undefined"
    ? (globalThis as unknown as { localStorage?: SimpleStorage }).localStorage
    : undefined;

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
  const currentUser = useAuthSession();
  const isWide = width >= 760;
  const [query, setQuery] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>(
    handbookEntries[0]?.id ?? null,
  );
  const didSetDefaultExpanded = React.useRef(!!handbookEntries[0]?.id);
  const [readerMode, setReaderMode] = React.useState<"bites" | "list">("bites");
  const [biteIndex, setBiteIndex] = React.useState(0);
  const [markedEntryId, setMarkedEntryId] = React.useState<string | null>(null);
  const progressStorageKey = React.useMemo(
    () => `mymsu.handbook.progress.${currentUser?.id ?? "guest"}`,
    [currentUser?.id],
  );

  React.useEffect(() => {
    if (!didSetDefaultExpanded.current && handbookEntries[0]) {
      setExpandedId(handbookEntries[0].id);
      didSetDefaultExpanded.current = true;
    }
  }, [handbookEntries]);

  React.useEffect(() => {
    const storedEntryId = storage?.getItem(progressStorageKey) ?? null;
    const isValidStoredEntry = handbookEntries.some(
      (entry) => entry.id === storedEntryId,
    );

    setMarkedEntryId(isValidStoredEntry ? storedEntryId : null);
  }, [handbookEntries, progressStorageKey]);

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
  const activeBiteIndex = activeBite
    ? featuredEntries.findIndex((entry) => entry.id === activeBite.id)
    : -1;
  const topicRailStart =
    featuredEntries.length <= 8
      ? 0
      : Math.min(
          Math.max(activeBiteIndex - 3, 0),
          Math.max(featuredEntries.length - 8, 0),
        );
  const topicRailEntries = featuredEntries.slice(
    topicRailStart,
    topicRailStart + 8,
  );
  const activeBiteText = activeBite?.content.trim() ?? "";
  const biteProgress =
    featuredEntries.length > 0
      ? `Topic ${Math.min(biteIndex + 1, featuredEntries.length)} of ${featuredEntries.length}`
      : "No pages yet";
  const progressPercent =
    featuredEntries.length > 0
      ? ((Math.min(biteIndex, featuredEntries.length - 1) + 1) /
          featuredEntries.length) *
        100
      : 0;
  const markedEntry = handbookEntries.find((entry) => entry.id === markedEntryId);
  const markedFilteredIndex = markedEntryId
    ? featuredEntries.findIndex((entry) => entry.id === markedEntryId)
    : -1;
  const canContinueFromMarker = markedFilteredIndex >= 0;
  const activeBiteIsMarked = !!activeBite && activeBite.id === markedEntryId;

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

  const markCurrentTopic = () => {
    if (!activeBite) {
      return;
    }

    setMarkedEntryId(activeBite.id);
    storage?.setItem(progressStorageKey, activeBite.id);
  };

  const clearMarker = () => {
    setMarkedEntryId(null);
    storage?.removeItem(progressStorageKey);
  };

  const continueFromMarker = () => {
    if (!canContinueFromMarker) {
      return;
    }

    setReaderMode("bites");
    chooseTopic(markedFilteredIndex);
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
          <Text style={styles.summaryTitle}>Read, search, and return later</Text>
          <Text style={styles.summaryText}>
            Move through handbook topics one page at a time, save your last
            progress marker, or switch to the full list when you need to scan.
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
            <View style={styles.readerToolbar}>
              <View style={styles.biteBadge}>
                <Ionicons name="reader" size={15} color={colors.teal} />
                <Text style={styles.biteBadgeText}>{biteProgress}</Text>
              </View>
              <Pressable
                style={[
                  styles.markerButton,
                  activeBiteIsMarked && styles.markerButtonActive,
                ]}
                onPress={markCurrentTopic}
              >
                <Ionicons
                  name={activeBiteIsMarked ? "bookmark" : "bookmark-outline"}
                  size={17}
                  color={activeBiteIsMarked ? colors.surface : colors.maroon}
                />
                <Text
                  style={[
                    styles.markerButtonText,
                    activeBiteIsMarked && styles.markerButtonTextActive,
                  ]}
                >
                  {activeBiteIsMarked ? "Marked" : "Mark here"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>

            {markedEntry ? (
              <View style={styles.markerCard}>
                <View style={styles.markerCardIcon}>
                  <Ionicons name="flag" size={17} color={colors.goldDark} />
                </View>
                <View style={styles.markerCardCopy}>
                  <Text style={styles.markerCardLabel}>Last progress marker</Text>
                  <Text style={styles.markerCardTitle} numberOfLines={1}>
                    {markedEntry.title}
                  </Text>
                </View>
                {canContinueFromMarker ? (
                  <Pressable
                    style={styles.markerCardAction}
                    onPress={continueFromMarker}
                  >
                    <Text style={styles.markerCardActionText}>Continue</Text>
                  </Pressable>
                ) : null}
                <Pressable style={styles.markerClearButton} onPress={clearMarker}>
                  <Ionicons name="close" size={17} color={colors.muted} />
                </Pressable>
              </View>
            ) : null}

            <View style={styles.articleHeader}>
              <Text style={styles.biteChapter}>{activeBite.chapter}</Text>
              <Text style={styles.biteTitle}>{activeBite.title}</Text>
              <View style={styles.articleMetaRow}>
                <View style={styles.articleMetaItem}>
                  <Ionicons name="document-text" size={15} color={colors.blue} />
                  <Text style={styles.articleMetaText}>
                    {activeBiteText.split(/\s+/).filter(Boolean).length} words
                  </Text>
                </View>
                <View style={styles.articleMetaItem}>
                  <Ionicons name="albums" size={15} color={colors.blue} />
                  <Text style={styles.articleMetaText}>
                    Section {activeBiteIndex + 1}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.articleBody}>
              <View style={styles.articleBodyRule} />
              <Text style={styles.biteText}>{activeBiteText}</Text>
            </View>

            {activeBite.tags.length > 0 ? (
              <View style={styles.topicTagRow}>
                {activeBite.tags.map((tag) => (
                  <Text key={tag} style={styles.topicTag}>
                    {tag}
                  </Text>
                ))}
              </View>
            ) : null}

            <View style={styles.biteActionRow}>
              <Pressable style={styles.biteActionButton} onPress={previousTopic}>
                <Ionicons name="chevron-back" size={18} color={colors.maroonDark} />
                <Text style={styles.biteActionText}>Previous</Text>
              </Pressable>
              <Pressable
                style={[styles.biteActionButton, styles.biteActionButtonPrimary]}
                onPress={nextTopic}
              >
                <Text style={styles.biteActionTextPrimary}>Next</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.surface} />
              </Pressable>
            </View>

            <View style={styles.topicRail}>
              {topicRailEntries.map((entry, index) => {
                const entryIndex = topicRailStart + index;
                const selected = entry.id === activeBite.id;
                const marked = entry.id === markedEntryId;

                return (
                  <Pressable
                    key={entry.id}
                    style={[
                      styles.topicRailItem,
                      selected && styles.topicRailItemActive,
                    ]}
                    onPress={() => chooseTopic(entryIndex)}
                  >
                    <Text
                      style={[
                        styles.topicRailNumber,
                        selected && styles.topicRailNumberActive,
                      ]}
                    >
                      {entryIndex + 1}
                    </Text>
                    {marked ? (
                      <Ionicons name="bookmark" size={11} color={colors.goldDark} />
                    ) : null}
                  </Pressable>
                );
              })}
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
    borderColor: "rgba(255, 255, 255, 0.18)",
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
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
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
    borderColor: "rgba(255,255,255,0.28)",
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
  readerToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
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
  markerButton: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.maroonSoft,
    borderWidth: 1,
    borderColor: "rgba(116, 16, 26, 0.14)",
  },
  markerButtonActive: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  markerButtonText: {
    color: colors.maroon,
    fontSize: 11,
    fontWeight: "900",
  },
  markerButtonTextActive: {
    color: colors.surface,
  },
  progressTrack: {
    height: 8,
    marginTop: 14,
    overflow: "hidden",
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  progressFill: {
    height: "100%",
    borderRadius: radii.pill,
    backgroundColor: colors.gold,
  },
  markerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
    padding: 12,
    borderRadius: radii.sm,
    backgroundColor: "#FFF9E8",
    borderWidth: 1,
    borderColor: "#F0D98E",
  },
  markerCardIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.sm,
    backgroundColor: "rgba(216, 178, 74, 0.22)",
  },
  markerCardCopy: {
    flex: 1,
    minWidth: 0,
  },
  markerCardLabel: {
    color: colors.goldDark,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  markerCardTitle: {
    marginTop: 2,
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900",
  },
  markerCardAction: {
    minHeight: 32,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#F0D98E",
  },
  markerCardActionText: {
    color: colors.maroon,
    fontSize: 11,
    fontWeight: "900",
  },
  markerClearButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
  },
  articleHeader: {
    marginTop: 18,
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  biteChapter: {
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
  articleMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  articleMetaItem: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.blueSoft,
  },
  articleMetaText: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: "900",
  },
  articleBody: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 16,
  },
  articleBodyRule: {
    width: 4,
    minHeight: 92,
    alignSelf: "stretch",
    borderRadius: radii.pill,
    backgroundColor: colors.gold,
  },
  biteText: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 15,
    lineHeight: 26,
  },
  topicTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  topicTag: {
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radii.pill,
    backgroundColor: colors.tealSoft,
    color: colors.teal,
    fontSize: 11,
    fontWeight: "900",
  },
  biteActionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
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
  topicRail: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  topicRailItem: {
    minWidth: 38,
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  topicRailItemActive: {
    backgroundColor: colors.maroonSoft,
    borderColor: "rgba(116, 16, 26, 0.18)",
  },
  topicRailNumber: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
  },
  topicRailNumberActive: {
    color: colors.maroon,
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
