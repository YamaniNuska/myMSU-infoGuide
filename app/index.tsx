import { useRouter } from "expo-router";
import DashboardScreen from "./screens/Dashboard/DashboardScreen";

const ROUTES: Record<string, string> = {
  campusMap: "/screens/CampusMap/CampusMapScreen",
  adminInfo: "/screens/AdminInfo/AdminInfoScreen",
  ai: "/AI-Chatbot",
  courseOffer: "/screens/CourseOfferings/CourseOfferScreen",
  prospectus: "/screens/Prospectus/ProspectusScreen",
  academicCalendar: "/screens/AcademicCalendar/AcademicCalendarScreen",
  notification: "/screens/Notification/NotificationScreen",
  profile: "/profile",
};

export default function Index() {
  const router = useRouter();

  const handleNavigate = (destination: string) => {
    const route = ROUTES[destination];
    if (route) {
      router.push(route);
    }
  };

  return <DashboardScreen onNavigate={handleNavigate} />;
}
