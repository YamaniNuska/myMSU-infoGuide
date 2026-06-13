import { useNavigation, useRouter, type Href } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

const hiddenTabBarStyle = {
  display: "none" as const,
};

export default function Index() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const currentUser = useAuthSession();
  const [step, setStep] = useState<FlowStep>(() =>
    currentUser ? "home" : "welcome",
  );

  useEffect(() => {
    if (currentUser) {
      setStep("home");
    }
  }, [currentUser]);

  useLayoutEffect(() => {
    const homeTabBarStyle = {
      height: 58 + Math.max(insets.bottom, Platform.OS === "android" ? 8 : 0),
      paddingBottom: Math.max(insets.bottom, Platform.OS === "android" ? 8 : 0),
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderColor: colors.line,
      borderRadius: 0,
      ...(Platform.OS === "web"
        ? { boxShadow: "0px -3px 12px rgba(29, 11, 11, 0.08)" }
        : {
            shadowColor: "#1D0B0B",
            shadowOpacity: 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: -2 },
            elevation: 4,
          }),
    };

    navigation.setOptions({
      tabBarStyle: step === "home" && currentUser ? homeTabBarStyle : hiddenTabBarStyle,
    });
  }, [currentUser, insets.bottom, navigation, step]);

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
