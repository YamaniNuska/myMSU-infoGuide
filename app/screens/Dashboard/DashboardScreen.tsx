import * as React from "react";
import {
    Animated,
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GRID_ITEMS = [
  { key: "map", title: "Campus Map", icon: "map", IconComponent: Feather },
  {
    key: "admin",
    title: "Administrative Information",
    icon: "information-slab-box-outline",
    IconComponent: MaterialCommunityIcons,
  },
  {
    key: "chatbot",
    title: "AI Chatbot",
    icon: "chatbox-outline",
    IconComponent: Ionicons,
  },
  {
    key: "courses",
    title: "Course/Program offerings",
    icon: "subject",
    IconComponent: MaterialIcons,
  },
  {
    key: "prospectus",
    title: "Prospectus",
    icon: "notes",
    IconComponent: MaterialIcons,
  },
  {
    key: "calendar",
    title: "Academic Calendar",
    icon: "calendar",
    IconComponent: Entypo,
  },
];

// Added "details" to each item for the expanded view
const ESSENTIAL_INFO = [
  {
    id: "emergency",
    title: "Emergency Hotlines",
    subtitle: "Campus Security & Medical",
    icon: "phone-call",
    IconComponent: Feather,
    bgColor: "#ffebee",
    iconColor: "#d32f2f",
    details:
      "🚨 Campus Security: (062) 123-4567\n🚑 Medical Emergency: (062) 987-6543\nAvailable 24/7 for all students and staff.",
  },
  {
    id: "registrar",
    title: "Registrar Services",
    subtitle: "Grades, clearances, documents",
    icon: "file-document-outline",
    IconComponent: MaterialCommunityIcons,
    bgColor: "#e3f2fd",
    iconColor: "#1976d2",
    details:
      "📍 Located at the Main Administration Building, 1st Floor.\n🕒 Office Hours: Mon-Fri, 8:00 AM - 5:00 PM.\nEmail: registrar@msu.edu.ph",
  },
  {
    id: "it_help",
    title: "IT Helpdesk",
    subtitle: "Portal & WiFi assistance",
    icon: "headset-mic",
    IconComponent: MaterialIcons,
    bgColor: "#fff8e1",
    iconColor: "#ffa000",
    details:
      "Need help logging into your portal or connecting to campus WiFi?\nSubmit a ticket at ithelp.msu.edu.ph or visit the ICT Office.",
  },
  {
    id: "clinic",
    title: "University Clinic",
    subtitle: "Medical records & consultations",
    icon: "medical-bag",
    IconComponent: MaterialCommunityIcons,
    bgColor: "#e8f5e9",
    iconColor: "#388e3c",
    details:
      "Free basic consultations for enrolled students. Please bring your valid University ID. Dental services are available by appointment.",
  },
];

const AnimatedGridCard = ({ item, onPress }: any) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const IconComp = item.IconComponent;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      bounciness: 12,
      useNativeDriver: true,
    }).start();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={styles.cardWrapper}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.iconCircle}>
          <IconComp name={item.icon} size={22} color="#ffffff" />
        </View>
        <Text style={styles.cardText}>{item.title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

type DashboardScreenProps = {
  onNavigate?: (destination: string) => void;
};

export default function Dashboard({ onNavigate }: DashboardScreenProps) {
  const handbookScale = React.useRef(new Animated.Value(1)).current;

  // State to track which essential info card is expanded
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const handleHandbookPressIn = () =>
    Animated.spring(handbookScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  const handleHandbookPressOut = () =>
    Animated.spring(handbookScale, {
      toValue: 1,
      bounciness: 12,
      useNativeDriver: true,
    }).start();

  // Function to toggle the expanded card with a smooth animation
  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleGridPress = (key: string) => {
    const destinations: Record<string, string> = {
      map: "campusMap",
      admin: "adminInfo",
      chatbot: "ai",
      courses: "courseOffer",
      prospectus: "prospectus",
      calendar: "academicCalendar",
    };

    const destination = destinations[key];

    if (destination) {
      onNavigate?.(destination);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.appName}>myMSU-InfoGuide</Text>
            <Text style={styles.greeting}>Hello, msuwone 👋</Text>
            <Text style={styles.subtitle}>Find what you need today</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => onNavigate?.("notification")}
          >
            <Ionicons name="notifications-outline" size={26} color="#ffffff" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#800505"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for maps, courses, info..."
            placeholderTextColor="#888"
          />
        </View>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 20 }]} showsVerticalScrollIndicator={false}>
        {/* Student Handbook */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handleHandbookPressIn}
          onPressOut={handleHandbookPressOut}
          onPress={() => console.log("Redirect")}
        >
          <Animated.View
            style={[styles.handbook, { transform: [{ scale: handbookScale }] }]}
          >
            <View>
              <Text style={styles.handbookTitle}>Student Handbook</Text>
              <Text style={styles.handbookText}>
                Access all university policies
              </Text>
            </View>
            <View style={[styles.iconCircle, { backgroundColor: "#D4AF37" }]}>
              <FontAwesome5 name="book-open" size={20} color="#ffffff" />
            </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Grid */}
        <View style={styles.grid}>
          {GRID_ITEMS.map((item) => (
            <AnimatedGridCard
              key={item.key}
              item={item}
              onPress={() => handleGridPress(item.key)}
            />
          ))}
        </View>

        {/* EXPANDABLE: Common Needed Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Essential Information</Text>

          {ESSENTIAL_INFO.map((info) => {
            const IconComp = info.IconComponent;
            const isExpanded = expandedId === info.id;

            return (
              <TouchableOpacity
                key={info.id}
                style={styles.listCard}
                activeOpacity={0.8}
                onPress={() => toggleExpand(info.id)}
              >
                {/* Always Visible Row */}
                <View style={styles.listCardHeader}>
                  <View
                    style={[
                      styles.listIconWrapper,
                      { backgroundColor: info.bgColor },
                    ]}
                  >
                    <IconComp
                      name={info.icon as any}
                      size={22}
                      color={info.iconColor}
                    />
                  </View>

                  <View style={styles.listTextContainer}>
                    <Text style={styles.listTitle}>{info.title}</Text>
                    <Text style={styles.listSubtitle}>{info.subtitle}</Text>
                  </View>

                  {/* Icon changes based on expanded state */}
                  <Entypo
                    name={
                      isExpanded ? "chevron-small-up" : "chevron-small-down"
                    }
                    size={24}
                    color="#888"
                  />
                </View>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <Text style={styles.expandedText}>{info.details}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },

  header: {
    backgroundColor: "#800505",
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    fontSize: 12,
    color: "#D4AF37",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 26,
    color: "#ffffff",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
    fontWeight: "500",
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
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
    backgroundColor: "#D4AF37",
    borderWidth: 2,
    borderColor: "#800505",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#333", fontWeight: "500" },

  content: { padding: 20, paddingTop: 25 },

  handbook: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    padding: 22,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    shadowColor: "#800505",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  handbookTitle: { fontSize: 20, color: "#4A0E0E", fontWeight: "700" },
  handbookText: {
    fontSize: 13,
    color: "#4A0E0E",
    opacity: 0.6,
    marginTop: 4,
    fontWeight: "500",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: { width: "47%", marginBottom: 16 },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    padding: 20,
    alignItems: "center",
    borderRadius: 16,
    height: 140,
    justifyContent: "center",
    shadowColor: "#800505",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    marginTop: 12,
    fontSize: 13,
    color: "#4A0E0E",
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 18,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#800505",
    alignItems: "center",
    justifyContent: "center",
  },

  // --- EXPANDABLE LIST STYLES ---
  sectionContainer: { marginTop: 10 },
  sectionTitle: {
    fontSize: 18,
    color: "#4A0E0E",
    fontWeight: "700",
    marginBottom: 15,
    marginLeft: 5,
  },
  listCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    shadowColor: "#800505",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  listCardHeader: { flexDirection: "row", alignItems: "center" },
  listIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  listTextContainer: { flex: 1 },
  listTitle: {
    fontSize: 16,
    color: "#4A0E0E",
    fontWeight: "700",
    marginBottom: 3,
  },
  listSubtitle: { fontSize: 13, color: "#666", fontWeight: "500" },

  // New styles for the hidden content
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  expandedText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    fontWeight: "500",
  },
});
