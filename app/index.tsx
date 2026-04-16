import React, { useState } from "react";
import { View } from "react-native";
import AcademicCalendarScreen from "./screens/AcademicCalendar/AcademicCalendarScreen";
import AdminInfoScreen from "./screens/AdminInfo/AdminInfoScreen";
import AI from "./screens/AIchatbot/AI";
import CampusMapScreen from "./screens/CampusMap/CampusMapScreen";
import CourseOfferScreen from "./screens/CourseOfferings/CourseOfferScreen";
import DashboardScreen from "./screens/Dashboard/DashboardScreen";
import LoginScreen from "./screens/Login/LoginScreen";
import NotificationScreen from "./screens/Notification/NotificationScreen";
import ProfileScreen from "./screens/Profile/ProfileScreen";
import ProspectusScreen from "./screens/Prospectus/ProspectusScreen";
import WelcomeScreen from "./screens/Welcome/WelcomeScreen";

type ScreenName =
  | "welcome"
  | "login"
  | "dashboard"
  | "campusMap"
  | "adminInfo"
  | "ai"
  | "courseOffer"
  | "prospectus"
  | "academicCalendar"
  | "notification"
  | "profile";

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("welcome");

  return (
    <View style={{ flex: 1 }}>
      {currentScreen === "welcome" ? (
        <WelcomeScreen onGetStarted={() => setCurrentScreen("login")} />
      ) : null}

      {currentScreen === "login" ? (
        <LoginScreen onSignIn={() => setCurrentScreen("dashboard")} />
      ) : null}

      {currentScreen === "dashboard" ? (
        <DashboardScreen
          onNavigate={(destination) =>
            setCurrentScreen(destination as ScreenName)
          }
        />
      ) : null}

      {currentScreen === "campusMap" ? (
        <CampusMapScreen onBack={() => setCurrentScreen("dashboard")} />
      ) : null}

      {currentScreen === "adminInfo" ? (
        <AdminInfoScreen onBack={() => setCurrentScreen("dashboard")} />
      ) : null}

      {currentScreen === "ai" ? (
        <AI onBack={() => setCurrentScreen("dashboard")} />
      ) : null}

      {currentScreen === "courseOffer" ? (
        <CourseOfferScreen onBack={() => setCurrentScreen("dashboard")} />
      ) : null}

      {currentScreen === "prospectus" ? (
        <ProspectusScreen onBack={() => setCurrentScreen("dashboard")} />
      ) : null}

      {currentScreen === "academicCalendar" ? (
        <AcademicCalendarScreen onBack={() => setCurrentScreen("dashboard")} />
      ) : null}

      {currentScreen === "notification" ? (
        <NotificationScreen onBack={() => setCurrentScreen("dashboard")} />
      ) : null}

      {currentScreen === "profile" ? (
        <ProfileScreen onBack={() => setCurrentScreen("dashboard")} />
      ) : null}
    </View>
  );
}
