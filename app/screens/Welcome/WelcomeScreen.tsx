import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      
      {/* Gold line */}
      <View style={styles.line} />

      {/* Main heading */}
      <Text style={styles.title}>Welcome</Text>

      {/* Subheading */}
      <Text style={styles.subtitle}>
        To the myMSU-InfoGuide App, your ultimate companion for navigating campus life with ease and confidence.
      </Text>

      {/* Gold line */}
      <View style={styles.line} />

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },

  line: {
    width: 70,
    height: 2,
    backgroundColor: "#bd9512",
    marginVertical: 20,
  },

  title: {
    fontSize: 42,
    fontWeight: "300",
    letterSpacing: 2,
    color: "#800808",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "300",
    letterSpacing: 2,
    color: "#4A0E0E",
    opacity: 1.4,
    textAlign: "center",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#d1a61a",
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 20,
    borderRadius: 12,
  },

  buttonText: {
    color: "#4A0E0E",
    fontSize: 16,
    letterSpacing: 3,
  },
});