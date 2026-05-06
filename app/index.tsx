import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuthSession } from "../src/auth/localAuth";
import { UserRecord } from "../src/data/mymsuDatabase";
import DashboardScreen from "../src/screens/Dashboard/DashboardScreen";
import LoginScreen from "../src/screens/Login/LoginScreen";
import WelcomeScreen from "../src/screens/Welcome/WelcomeScreen";

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

export default function Index() {
  const router = useRouter();
  const currentUser = useAuthSession();
  const [step, setStep] = useState<FlowStep>("welcome");

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
