import { useRouter } from "expo-router";
import { useState } from "react";
import DashboardScreen from "./screens/Dashboard/DashboardScreen";
import LoginScreen from "./screens/Login/LoginScreen";
import WelcomeScreen from "./screens/Welcome/WelcomeScreen";

const ROUTES: Record<string, string> = {
  campusMap: "/screens/CampusMap",
  adminInfo: "/screens/AdminInfo",
  ai: "/AI-Chatbot",
  courseOffer: "/screens/CourseOfferings",
  prospectus: "/screens/Prospectus",
  academicCalendar: "/screens/AcademicCalendar",
  notification: "/screens/Notification",
  profile: "/profile",
  handbook: "/screens/HandbookFeature",
};

type FlowStep = "welcome" | "login" | "home";

export default function Index() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>("welcome");

  const handleNavigate = (destination: string) => {
    const route = ROUTES[destination];
    if (route) {
      router.push(route as any);
    }
  };

  const handleGetStarted = () => setStep("login");
  const handleSignIn = () => setStep("home");

  if (step === "welcome") {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (step === "login") {
    return <LoginScreen onSignIn={handleSignIn} />;
  }

  return <DashboardScreen onNavigate={handleNavigate} />;
}
