import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { colors, maxContentWidth, radii } from "../theme";

type SecondaryScreenLayoutProps = {
  title: string;
  description: string;
  onBack?: () => void;
  children?: React.ReactNode;
};

export default function SecondaryScreenLayout({
  title,
  description,
  onBack,
  children,
}: SecondaryScreenLayoutProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 760;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.headerInner, isWide && styles.headerInnerWide]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    backgroundColor: colors.maroon,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
    borderBottomLeftRadius: radii.md,
    borderBottomRightRadius: radii.md,
  },
  headerInner: {
    width: "100%",
    alignSelf: "center",
  },
  headerInnerWide: {
    maxWidth: maxContentWidth,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  backText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: "800",
  },
  description: {
    marginTop: 8,
    color: "rgba(255, 255, 255, 0.82)",
    fontSize: 14,
    lineHeight: 21,
  },
  content: {
    width: "100%",
    alignSelf: "center",
    padding: 18,
    gap: 14,
  },
  contentWide: {
    maxWidth: maxContentWidth,
    paddingVertical: 24,
  },
});
