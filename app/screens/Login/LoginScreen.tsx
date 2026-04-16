import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type LoginScreenProps = {
  onSignIn?: () => void;
};

export default function LoginScreen({ onSignIn }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <LinearGradient
      colors={["#6e0505", "#5a0b0b", "#2d0000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.backgroundCircleTop} />
        <View style={styles.backgroundCircleBottom} />
        <View style={styles.backgroundGlow} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.card}>
            <TouchableOpacity style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <View style={styles.brandSquare} />
                <View style={styles.brandSquareSmall} />
              </View>
              <Text style={styles.brandText}>COMPANY</Text>
            </View>

            <Text style={styles.tagline}>
              Convert Your Smart Idea {"\n"}To The Great Business
            </Text>

            <Text style={styles.heading}>
              {isSignUp ? "Sign Up to continue" : "Sign In to continue"}
            </Text>

            <View style={styles.form}>
              {isSignUp && (
                <View style={styles.inputShell}>
                  <FontAwesome5
                    name="user-alt"
                    size={14}
                    color="#4B1118"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    placeholderTextColor="#8A6469"
                  />
                </View>
              )}

              <View style={styles.inputShell}>
                <FontAwesome5
                  name="user-alt"
                  size={14}
                  color="#4B1118"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#8A6469"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputShell}>
                <FontAwesome5
                  name="lock"
                  size={14}
                  color="#4b1118"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#8A6469"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {isSignUp && (
                <View style={styles.inputShell}>
                  <FontAwesome5
                    name="lock"
                    size={14}
                    color="#4b1118"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#8A6469"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>
              )}

              <TouchableOpacity style={styles.checkRow} activeOpacity={0.8}>
                <View style={styles.checkCircle} />
                <Text style={styles.checkText}>remember me</Text>
              </TouchableOpacity>

              <LinearGradient
                colors={["#220608", "#110203"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.button}
              >
                <TouchableOpacity
                  style={styles.buttonInner}
                  activeOpacity={0.85}
                  onPress={!isSignUp ? onSignIn : undefined}
                >
                  <Text style={styles.buttonText}>
                    {isSignUp ? "Sign up" : "Sign in"}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerMuted}>
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </Text>
              <TouchableOpacity
                onPress={() => setIsSignUp((current) => !current)}
              >
                <Text style={styles.footerLink}>
                  {isSignUp ? " Login" : " Create Account"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
  backgroundCircleTop: {
    position: "absolute",
    top: -90,
    left: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(154, 42, 58, 0.2)",
  },
  backgroundCircleBottom: {
    position: "absolute",
    bottom: -110,
    right: -70,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(17, 5, 6, 0.35)",
  },
  backgroundGlow: {
    position: "absolute",
    top: "26%",
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(123, 16, 28, 0.2)",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: 360,
    minHeight: 620,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(255, 214, 220, 0.12)",
    shadowColor: "#140405",
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 20 },
    elevation: 18,
    opacity: 25,
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  closeButtonText: {
    color: "rgba(255, 255, 255, 0.92)",
    fontSize: 16,
    fontWeight: "500",
  },
  brandRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  brandMark: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  brandSquare: {
    position: "absolute",
    width: 12,
    height: 12,
    borderWidth: 1.2,
    borderColor: "#941d2d",
    transform: [{ rotate: "45deg" }],
  },
  brandSquareSmall: {
    width: 5,
    height: 5,
    backgroundColor: "#F7CCD2",
    transform: [{ rotate: "45deg" }],
  },
  brandText: {
    color: "#3b0101",
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: "700",
  },
  tagline: {
    marginTop: 36,
    textAlign: "center",
    color: "#3b0101",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
  },
  heading: {
    marginTop: 26,
    marginBottom: 28,
    textAlign: "center",
    color: "#3b0101",
    fontSize: 26,
    fontWeight: "300",
  },
  form: {
    marginTop: 4,
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    height: 42,
    marginBottom: 14,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#341015",
    fontSize: 13,
    paddingVertical: 0,
  },
  checkRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  checkCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3b0101",
    marginRight: 8,
  },
  checkText: {
    color: "rgba(118, 1, 18, 0.74)",
    fontSize: 11,
    textTransform: "capitalize",
  },
  button: {
    alignSelf: "flex-end",
    borderRadius: 14,
    marginTop: 24,
    shadowColor: "#3b0101",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  buttonInner: {
    minWidth: 86,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  footer: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    paddingTop: 26,
  },
  footerMuted: {
    color: "#3b0101",
    fontSize: 11,
  },
  footerLink: {
    color: "#3b0101",
    fontSize: 11,
    fontWeight: "600",
  },
});
