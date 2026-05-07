import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Platform } from "react-native";
import { useAuthSession } from "../src/auth/localAuth";
import { UserRecord } from "../src/data/mymsuDatabase";
import DashboardScreen from "../src/screens/Dashboard/DashboardScreen";
import LoginScreen from "../src/screens/Login/LoginScreen";
import WelcomeScreen from "../src/screens/Welcome/WelcomeScreen";
import { colors } from "../src/theme";

const ROUTES: Record<string, string> = {
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
  left: 16,
  right: 16,
  bottom: Platform.OS === "ios" ? 18 : 14,
  height: Platform.OS === "ios" ? 72 : 66,
  backgroundColor: colors.surface,
  borderTopWidth: 0,
  borderWidth: 1,
  borderColor: colors.line,
  borderRadius: 22,
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
      router.push(route as any);
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
