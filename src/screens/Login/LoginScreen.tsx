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
import {
  getDemoAccounts,
  signIn,
  signUp,
} from "../../auth/localAuth";
import { UserRecord, UserRole } from "../../data/mymsuDatabase";
import { colors, maxContentWidth, radii } from "../../theme";

type LoginScreenProps = {
  onSignIn?: (user: UserRecord) => void;
};

type SignupRole = Extract<UserRole, "student" | "admin">;

export default function LoginScreen({ onSignIn }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<SignupRole>("student");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const resetMessage = () => setMessage("");

  const handleSubmit = () => {
    resetMessage();

    if (isSignUp) {
      if (password !== confirmPassword) {
        setMessageType("error");
        setMessage("Passwords do not match.");
        return;
      }

      const result = signUp({
        name,
        username,
        email,
        password,
        role,
      });

      if (!result.ok) {
        setMessageType("error");
        setMessage(result.message);
        return;
      }

      setMessageType("success");
      setMessage(`Created ${result.user.role} account.`);
      onSignIn?.(result.user);
      return;
    }

    const result = signIn(username, password);

    if (!result.ok) {
      setMessageType("error");
      setMessage(result.message);
      return;
    }

    onSignIn?.(result.user);
  };

  const fillDemoAccount = (demo: ReturnType<typeof getDemoAccounts>[number]) => {
    setIsSignUp(false);
    setUsername(demo.username);
    setPassword(demo.password);
    setMessageType("success");
    setMessage(`${demo.label} filled. Tap Sign in.`);
  };

  const switchMode = () => {
    setIsSignUp((current) => !current);
    setMessage("");
  };

  return (
    <LinearGradient
      colors={["#6e0505", "#5a0b0b", "#2d0000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.card}>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <View style={styles.brandSquare} />
                <View style={styles.brandSquareSmall} />
              </View>
              <Text style={styles.brandText}>myMSU-infoGuide</Text>
            </View>

            <Text style={styles.tagline}>
              {isSignUp
                ? "Create a student or admin account for this prototype."
                : "Sign in using a student or admin account."}
            </Text>

            <Text style={styles.heading}>
              {isSignUp ? "Create Account" : "Sign In"}
            </Text>

            {!isSignUp ? (
              <View style={styles.demoPanel}>
                <Text style={styles.demoTitle}>Demo Accounts</Text>
                <View style={styles.demoRow}>
                  {getDemoAccounts().map((demo) => (
                    <TouchableOpacity
                      key={demo.username}
                      style={styles.demoChip}
                      activeOpacity={0.82}
                      onPress={() => fillDemoAccount(demo)}
                    >
                      <Text style={styles.demoChipRole}>{demo.role}</Text>
                      <Text style={styles.demoChipText}>
                        {demo.username} / {demo.password}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.form}>
              {isSignUp ? (
                <View style={styles.inputShell}>
                  <FontAwesome5
                    name="user-alt"
                    size={14}
                    color="#4B1118"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    placeholderTextColor="#8A6469"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              ) : null}

              <View style={styles.inputShell}>
                <FontAwesome5
                  name="user-alt"
                  size={14}
                  color="#4B1118"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={isSignUp ? "Username" : "Username or email"}
                  placeholderTextColor="#8A6469"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              {isSignUp ? (
                <View style={styles.inputShell}>
                  <FontAwesome5
                    name="envelope"
                    size={14}
                    color="#4B1118"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#8A6469"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              ) : null}

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

              {isSignUp ? (
                <>
                  <View style={styles.inputShell}>
                    <FontAwesome5
                      name="lock"
                      size={14}
                      color="#4b1118"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm password"
                      placeholderTextColor="#8A6469"
                      secureTextEntry
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                  </View>

                  <View style={styles.roleRow}>
                    {(["student", "admin"] as const).map((item) => {
                      const selected = role === item;

                      return (
                        <TouchableOpacity
                          key={item}
                          style={[
                            styles.roleChip,
                            selected && styles.roleChipSelected,
                          ]}
                          onPress={() => setRole(item)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.roleChipText,
                              selected && styles.roleChipTextSelected,
                            ]}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              ) : null}

              {message ? (
                <Text
                  style={[
                    styles.message,
                    messageType === "success"
                      ? styles.messageSuccess
                      : styles.messageError,
                  ]}
                >
                  {message}
                </Text>
              ) : null}

              <LinearGradient
                colors={["#220608", "#110203"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.button}
              >
                <TouchableOpacity
                  style={styles.buttonInner}
                  activeOpacity={0.85}
                  onPress={handleSubmit}
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
              <TouchableOpacity onPress={switchMode}>
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
  card: {
    width: "100%",
    maxWidth: Math.min(440, maxContentWidth),
    minHeight: 600,
    borderRadius: radii.sm,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255, 214, 220, 0.12)",
    shadowColor: "#140405",
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 20 },
    elevation: 18,
  },
  brandRow: {
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
    color: colors.maroonDark,
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: "800",
  },
  tagline: {
    marginTop: 28,
    textAlign: "center",
    color: colors.maroonDark,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
  },
  heading: {
    marginTop: 18,
    marginBottom: 20,
    textAlign: "center",
    color: colors.maroonDark,
    fontSize: 28,
    fontWeight: "800",
  },
  demoPanel: {
    padding: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.maroonSoft,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 18,
  },
  demoTitle: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  demoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  demoChip: {
    flexGrow: 1,
    minWidth: 150,
    padding: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  demoChipRole: {
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  demoChipText: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800",
  },
  form: {
    marginTop: 2,
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: radii.sm,
    minHeight: 44,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: "#341015",
    fontSize: 14,
    paddingVertical: 0,
  },
  roleRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
    marginBottom: 10,
  },
  roleChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: "#F8F6F2",
    borderWidth: 1,
    borderColor: colors.line,
  },
  roleChipSelected: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  roleChipText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  roleChipTextSelected: {
    color: colors.surface,
  },
  message: {
    marginTop: 4,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
  messageError: {
    color: colors.danger,
    backgroundColor: "#FCE8E6",
  },
  messageSuccess: {
    color: colors.success,
    backgroundColor: "#E8F5EE",
  },
  button: {
    alignSelf: "flex-end",
    borderRadius: radii.sm,
    marginTop: 18,
    shadowColor: colors.maroonDark,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  buttonInner: {
    minWidth: 106,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "900",
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
    color: colors.maroonDark,
    fontSize: 12,
  },
  footerLink: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
});
