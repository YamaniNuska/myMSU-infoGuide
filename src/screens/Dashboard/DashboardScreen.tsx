import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import {
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
  useWindowDimensions,
  type DimensionValue,
} from "react-native";
import {
  databaseTables,
  UserRecord,
} from "../../data/mymsuDatabase";
import { searchLiveKnowledgeBase, useAppData } from "../../data/appStore";
import {
  colors,
  getCardWidth,
  getColumnCount,
  maxContentWidth,
  radii,
  shadow,
} from "../../theme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type IconComponent = React.ComponentType<any>;

type GridItem = {
  key: string;
  title: string;
  subtitle: string;
  icon: string;
  IconComponent: IconComponent;
};

type EssentialInfo = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  IconComponent: IconComponent;
  bgColor: string;
  iconColor: string;
  details: string;
};

const GRID_ITEMS: GridItem[] = [
  {
    key: "map",
    title: "Campus Map",
    subtitle: "Explore locations",
    icon: "map",
    IconComponent: Feather,
  },
  {
    key: "admin",
    title: "Administrative Info",
    subtitle: "Offices and services",
    icon: "information-slab-box-outline",
    IconComponent: MaterialCommunityIcons,
  },
  {
    key: "chatbot",
    title: "AI Chatbot",
    subtitle: "Ask the guide",
    icon: "chatbox-outline",
    IconComponent: Ionicons,
  },
  {
    key: "schedule",
    title: "Class Schedule",
    subtitle: "Save reminders",
    icon: "event-note",
    IconComponent: MaterialIcons,
  },
  {
    key: "courses",
    title: "Course Offerings",
    subtitle: "Browse programs",
    icon: "subject",
    IconComponent: MaterialIcons,
  },
  {
    key: "prospectus",
    title: "Prospectus",
    subtitle: "Program flow",
    icon: "notes",
    IconComponent: MaterialIcons,
  },
  {
    key: "calendar",
    title: "Academic Calendar",
    subtitle: "Dates and deadlines",
    icon: "calendar",
    IconComponent: Entypo,
  },
];

const ADMIN_GRID_ITEM: GridItem = {
  key: "adminPanel",
  title: "Admin Console",
  subtitle: "Edit app content",
  icon: "shield-checkmark-outline",
  IconComponent: Ionicons,
};

const BASE_ESSENTIAL_INFO: EssentialInfo[] = [
  {
    id: "emergency",
    title: "Emergency Hotlines",
    subtitle: "Campus Security and Medical",
    icon: "call-outline",
    IconComponent: Ionicons,
    bgColor: "#FCE8E6",
    iconColor: colors.danger,
    details:
      "Campus Security: (062) 123-4567\nMedical Emergency: (062) 987-6543\nAvailable for urgent campus assistance.",
  },
  {
    id: "registrar-quick",
    title: "Registrar Services",
    subtitle: "Grades, clearances, documents",
    icon: "document-text-outline",
    IconComponent: Ionicons,
    bgColor: colors.maroonSoft,
    iconColor: colors.maroon,
    details:
      "Located at Ahmad Domocao Alonto Sr. Hall, First Floor.\nOffice Hours: Mon-Fri, 8:00 AM - 5:00 PM.\nEmail: registrar@msumain.edu.ph",
  },
  {
    id: "ict-quick",
    title: "ICT Helpdesk",
    subtitle: "Portal and connectivity support",
    icon: "wifi-outline",
    IconComponent: Ionicons,
    bgColor: "#FFF8E6",
    iconColor: colors.warning,
    details:
      "Visit the ICT Office for portal, campus connectivity, and technical assistance.",
  },
  {
    id: "infirmary-quick",
    title: "University Infirmary",
    subtitle: "Medical records and consultation",
    icon: "medkit-outline",
    IconComponent: Ionicons,
    bgColor: "#E8F5EE",
    iconColor: colors.success,
    details:
      "Bring a valid university ID for basic consultation and health-related support.",
  },
];

const AnimatedGridCard = ({
  item,
  width,
  onPress,
  index,
}: {
  item: GridItem;
  width: DimensionValue;
  onPress: () => void;
  index: number;
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const appear = React.useRef(new Animated.Value(0)).current;
  const IconComp = item.IconComponent;

  React.useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 420,
      delay: 110 + index * 38,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [appear, index]);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      bounciness: 8,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[styles.cardWrapper, { width }]}
    >
      <Animated.View
        style={[
          styles.card,
          {
            opacity: appear,
            transform: [
              {
                translateY: appear.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
              { scale },
            ],
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <IconComp name={item.icon} size={22} color={colors.surface} />
        </View>
        <Text style={styles.cardText} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

type DashboardScreenProps = {
  user?: UserRecord;
  onNavigate?: (destination: string) => void;
};

export default function Dashboard({ user, onNavigate }: DashboardScreenProps) {
  const handbookScale = React.useRef(new Animated.Value(1)).current;
  const entry = React.useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const columns = getColumnCount(width);
  const isWide = width >= 760;
  const data = useAppData();
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const searchResults = searchLiveKnowledgeBase(searchQuery, 6);

  React.useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entry]);

  const essentialInfo = React.useMemo<EssentialInfo[]>(
    () => [
      ...BASE_ESSENTIAL_INFO,
      ...data.offices.slice(0, 2).map((office) => ({
        id: office.id,
        title: office.name,
        subtitle: office.category,
        icon: "business-outline",
        IconComponent: Ionicons,
        bgColor: colors.maroonSoft,
        iconColor: colors.maroon,
        details: `${office.summary}\nLocation: ${office.location}\nContact: ${office.contact}`,
      })),
    ],
    [data.offices],
  );

  const visibleGridItems = React.useMemo(
    () => (user?.role === "admin" ? [ADMIN_GRID_ITEM, ...GRID_ITEMS] : GRID_ITEMS),
    [user?.role],
  );

  const handleHandbookPressIn = () => {
    Animated.spring(handbookScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handleHandbookPressOut = () => {
    Animated.spring(handbookScale, {
      toValue: 1,
      bounciness: 8,
      useNativeDriver: true,
    }).start();
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((current) => (current === id ? null : id));
  };

  const handleGridPress = (key: string) => {
    const destinations: Record<string, string> = {
      map: "campusMap",
      admin: "adminInfo",
      chatbot: "ai",
      courses: "courseOffer",
      prospectus: "prospectus",
      calendar: "academicCalendar",
      schedule: "classSchedule",
      adminPanel: "adminPanel",
    };

    const destination = destinations[key];

    if (destination) {
      onNavigate?.(destination);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.headerMotion,
          {
            opacity: entry,
            transform: [
              {
                translateY: entry.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-18, 0],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.maroonDark, colors.maroon]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={[styles.headerInner, isWide && styles.headerInnerWide]}>
          <View style={styles.headerTop}>
            <View style={styles.headerCopy}>
              <Text style={styles.appName}>myMSU-InfoGuide</Text>
              <Text style={styles.greeting}>Hello, {user?.name ?? "Guest"}</Text>
              <Text style={styles.subtitle}>
                {user?.role === "admin"
                  ? "Admin mode: review and manage guide content"
                  : "Find what you need today"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => onNavigate?.("notification")}
            >
              <Ionicons
                name="notifications-outline"
                size={25}
                color={colors.surface}
              />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.maroon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search handbook, offices, programs..."
              placeholderTextColor="#887A7A"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#B7AAAA" />
              </TouchableOpacity>
            ) : null}
          </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          isWide && styles.contentWide,
          { paddingBottom: 112 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.contentMotion,
            {
              opacity: entry,
              transform: [
                {
                  translateY: entry.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
              ],
            },
          ]}
        >
        {searchQuery.trim() ? (
          <View style={styles.searchResults}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {searchResults.map((result) => (
              <View key={`${result.type}-${result.id}`} style={styles.resultCard}>
                <Text style={styles.resultType}>{result.type}</Text>
                <Text style={styles.resultTitle}>{result.title}</Text>
                <Text style={styles.resultBody} numberOfLines={3}>
                  {result.body}
                </Text>
              </View>
            ))}
            {searchResults.length === 0 ? (
              <Text style={styles.noResultsText}>
                No local result found for {searchQuery}.
              </Text>
            ) : null}
          </View>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handleHandbookPressIn}
          onPressOut={handleHandbookPressOut}
          onPress={() => onNavigate?.("handbook")}
        >
          <Animated.View
            style={[styles.handbook, { transform: [{ scale: handbookScale }] }]}
          >
            <View style={styles.handbookCopy}>
              <Text style={styles.handbookTitle}>Student Handbook</Text>
              <Text style={styles.handbookText}>
                Policies, offices, services, discipline, and campus guide
                content.
              </Text>
            </View>
            <View style={[styles.iconCircle, styles.handbookIcon]}>
              <FontAwesome5 name="book-open" size={20} color={colors.surface} />
            </View>
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{databaseTables.length}</Text>
            <Text style={styles.statLabel}>Data Tables</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{data.offices.length}</Text>
            <Text style={styles.statLabel}>Offices</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{data.announcements.length}</Text>
            <Text style={styles.statLabel}>Alerts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {user?.role === "admin" ? "Admin" : "User"}
            </Text>
            <Text style={styles.statLabel}>Access</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {visibleGridItems.map((item, index) => (
            <AnimatedGridCard
              key={item.key}
              item={item}
              width={getCardWidth(columns)}
              index={index}
              onPress={() => handleGridPress(item.key)}
            />
          ))}
        </View>

        <View style={styles.alertStrip}>
          <View style={styles.alertTextWrap}>
            <Text style={styles.alertTitle}>
              {data.announcements[0]?.title ?? "No announcements yet"}
            </Text>
            <Text style={styles.alertBody}>
              {data.announcements[0]?.body ??
                "Admin can add announcements from the Admin Console."}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.alertButton}
            onPress={() => onNavigate?.("notification")}
          >
            <Text style={styles.alertButtonText}>Open</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Essential Information</Text>

          {essentialInfo.map((info) => {
            const IconComp = info.IconComponent;
            const isExpanded = expandedId === info.id;

            return (
              <TouchableOpacity
                key={info.id}
                style={styles.listCard}
                activeOpacity={0.82}
                onPress={() => toggleExpand(info.id)}
              >
                <View style={styles.listCardHeader}>
                  <View
                    style={[
                      styles.listIconWrapper,
                      { backgroundColor: info.bgColor },
                    ]}
                  >
                    <IconComp
                      name={info.icon}
                      size={22}
                      color={info.iconColor}
                    />
                  </View>

                  <View style={styles.listTextContainer}>
                    <Text style={styles.listTitle}>{info.title}</Text>
                    <Text style={styles.listSubtitle}>{info.subtitle}</Text>
                  </View>

                  <Entypo
                    name={
                      isExpanded ? "chevron-small-up" : "chevron-small-down"
                    }
                    size={24}
                    color="#8A7E7E"
                  />
                </View>

                {isExpanded ? (
                  <View style={styles.expandedContent}>
                    <Text style={styles.expandedText}>{info.details}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  headerMotion: {
    zIndex: 2,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 22,
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 18,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  appName: {
    fontSize: 12,
    color: colors.gold,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0,
  },
  greeting: {
    marginTop: 4,
    fontSize: 26,
    color: colors.surface,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 3,
    fontSize: 14,
    color: "rgba(255,255,255,0.82)",
    fontWeight: "600",
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: colors.maroon,
  },
  searchContainer: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    color: colors.ink,
    fontWeight: "600",
  },
  content: {
    width: "100%",
    alignSelf: "center",
    padding: 18,
  },
  contentMotion: {
    width: "100%",
    gap: 16,
  },
  contentWide: {
    maxWidth: maxContentWidth,
    paddingVertical: 24,
  },
  searchResults: {
    gap: 10,
  },
  resultCard: {
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  resultType: {
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  resultTitle: {
    marginTop: 5,
    color: colors.maroonDark,
    fontSize: 15,
    fontWeight: "800",
  },
  resultBody: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  noResultsText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  handbook: {
    minHeight: 112,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    borderRadius: radii.sm,
    ...shadow,
  },
  handbookCopy: {
    flex: 1,
    minWidth: 0,
  },
  handbookTitle: {
    fontSize: 20,
    color: colors.maroonDark,
    fontWeight: "800",
  },
  handbookText: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 5,
    lineHeight: 19,
    fontWeight: "600",
  },
  handbookIcon: {
    backgroundColor: colors.gold,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: "46%",
    minHeight: 74,
    justifyContent: "center",
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  statValue: {
    color: colors.maroon,
    fontSize: 20,
    fontWeight: "900",
  },
  statLabel: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  cardWrapper: {
    minWidth: 0,
  },
  card: {
    minHeight: 132,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    alignItems: "center",
    borderRadius: radii.sm,
    justifyContent: "center",
    ...shadow,
  },
  cardText: {
    marginTop: 12,
    fontSize: 13,
    color: colors.maroonDark,
    textAlign: "center",
    fontWeight: "800",
    lineHeight: 18,
  },
  cardSubtitle: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.maroon,
    alignItems: "center",
    justifyContent: "center",
  },
  alertStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.maroon,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  alertTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  alertTitle: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "900",
  },
  alertBody: {
    marginTop: 5,
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    lineHeight: 18,
  },
  alertButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.gold,
  },
  alertButtonText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  sectionContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.maroonDark,
    fontWeight: "900",
  },
  listCard: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  listCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  listIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: radii.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  listTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  listTitle: {
    fontSize: 15,
    color: colors.maroonDark,
    fontWeight: "800",
    lineHeight: 21,
  },
  listSubtitle: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "700",
    lineHeight: 17,
  },
  expandedContent: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  expandedText: {
    fontSize: 13,
    color: colors.ink,
    lineHeight: 21,
    fontWeight: "600",
  },
});
