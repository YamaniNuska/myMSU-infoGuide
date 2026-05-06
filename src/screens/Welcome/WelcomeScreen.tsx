import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type WelcomeScreenProps = {
  onGetStarted?: () => void;
};

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <ImageBackground
      source={require("../../../assets/images/msu-background.webp")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.container}>
        <View style={styles.centerSpace} />

        <View style={styles.bottomContent}>
          <View style={styles.line} />

          <Text style={styles.title}>Welcome</Text>

          <Text style={styles.subtitle}>
            To the myMSU-InfoGuide App, your ultimate companion for navigating
            campus life with ease and confidence.
          </Text>

          <View style={styles.line} />

          <TouchableOpacity style={styles.button} onPress={onGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#00000033",
  },
  backgroundImage: {
    opacity: 0.45,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000084",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 75,
  },
  centerSpace: {
    flex: 0.58,
  },
  bottomContent: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  line: {
    width: 56,
    height: 2,
    backgroundColor: "#d9b13a",
    marginVertical: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#ffeed9",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.28)",
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 7,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: 0.6,
    color: "#ffeed9",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 25,
    textShadowColor: "rgba(0, 0, 0, 0.24)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  button: {
    backgroundColor: "#d9b13a",
    minWidth: 180,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "#4A0E0E",
    fontSize: 15,
    letterSpacing: 2,
  },
});
