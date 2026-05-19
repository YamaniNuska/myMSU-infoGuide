import { useNavigation, useRouter, type Href } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Platform } from "react-native";
import { useAuthSession } from "../src/auth/localAuth";
import { UserRecord } from "../src/data/mymsuDatabase";
import DashboardScreen from "../src/components/home/DashboardScreen";
import LoginScreen from "../src/components/home/LoginScreen";
import WelcomeScreen from "../src/components/home/WelcomeScreen";
import { colors } from "../src/theme";

const ROUTES: Record<string, Href> = {
  campusMap: "/screens/CampusMap",
  adminInfo: "/screens/AdminInfo",
  ai: "/AI-Chatbot",
  courseOffer: "/screens/CourseOfferings",
  prospectus: "/screens/Prospectus",
  academicCalendar: "/screens/AcademicCalendar",
  classSchedule: "/screens/ClassSchedule",
  notification: "/screens/Notification",
  profile: "/profile",
  handbook: "/screens/HandbookFeature",
  adminPanel: "/screens/AdminPanel",
};

type FlowStep = "welcome" | "login" | "home";

const homeTabBarStyle = {
  position: "absolute" as const,
  left: Platform.OS === "web" ? 16 : 0,
  right: Platform.OS === "web" ? 16 : 0,
  bottom: 0,
  height: Platform.OS === "ios" ? 84 : Platform.OS === "web" ? 66 : 74,
  backgroundColor: colors.surface,
  borderTopWidth: 0,
  borderWidth: 1,
  borderColor: colors.line,
  borderRadius: Platform.OS === "web" ? 22 : 0,
  borderTopLeftRadius: Platform.OS === "web" ? 22 : 22,
  borderTopRightRadius: Platform.OS === "web" ? 22 : 22,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  ...(Platform.OS === "web"
    ? { boxShadow: "0px 8px 22px rgba(29, 11, 11, 0.14)" }
    : {
        shadowColor: "#1D0B0B",
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
      }),
};

const hiddenTabBarStyle = {
  display: "none" as const,
};

export default function Index() {
  const router = useRouter();
  const navigation = useNavigation();
  const currentUser = useAuthSession();
  const [step, setStep] = useState<FlowStep>(() =>
    currentUser ? "home" : "welcome",
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: step === "home" && currentUser ? homeTabBarStyle : hiddenTabBarStyle,
    });
  }, [currentUser, navigation, step]);

  const handleNavigate = (destination: string) => {
    const route = ROUTES[destination];
    if (route) {
      router.push(route);
    }
  };

  const handleGetStarted = () => setStep("login");
  const handleSignIn = (_user: UserRecord) => setStep("home");

  if (step === "welcome") {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (step === "login") {
    return <LoginScreen onSignIn={handleSignIn} />;
  }

  if (!currentUser) {
    return <LoginScreen onSignIn={handleSignIn} />;
  }

  return <DashboardScreen user={currentUser} onNavigate={handleNavigate} />;
}
