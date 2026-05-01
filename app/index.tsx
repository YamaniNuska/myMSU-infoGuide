import { useRouter } from "expo-router";
import DashboardScreen from "./screens/Dashboard/DashboardScreen";

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

export default function Index() {
  const router = useRouter();

  const handleNavigate = (destination: string) => {
    const route = ROUTES[destination];
    if (route) {
      router.push(route as any);
    }
  };

  return <DashboardScreen onNavigate={handleNavigate} />;
}