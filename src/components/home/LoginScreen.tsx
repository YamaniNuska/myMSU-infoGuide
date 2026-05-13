import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  signIn,
  signUp,
} from "../../auth/localAuth";
import { UserRecord } from "../../data/mymsuDatabase";
import { colors, maxContentWidth, radii } from "../../theme";

type LoginScreenProps = {
  onSignIn?: (user: UserRecord) => void;
};

export default function LoginScreen({ onSignIn }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const entry = React.useRef(new Animated.Value(0)).current;
  const ctaPress = React.useRef(new Animated.Value(0)).current;

  const resetMessage = React.useCallback(() => setMessage(""), []);

  React.useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entry]);

  const handleSubmit = async () => {
    resetMessage();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    if (isSignUp) {
      if (password !== confirmPassword) {
        setMessageType("error");
        setMessage("Passwords do not match.");
        setIsSubmitting(false);
        return;
      }

      const result = await signUp({
        name,
        username,
        email,
        password,
      });

      if (!result.ok) {
        setMessageType("error");
        setMessage(result.message);
        setIsSubmitting(false);
        return;
      }

      setMessageType("success");
      setMessage(`Created ${result.user.role} account.`);
      onSignIn?.(result.user);
      setIsSubmitting(false);
      return;
    }

    const result = await signIn(username, password);

    if (!result.ok) {
      setMessageType("error");
      setMessage(result.message);
      setIsSubmitting(false);
      return;
    }

    onSignIn?.(result.user);
    setIsSubmitting(false);
  };

  const switchMode = () => {
    setIsSignUp((current) => !current);
    setMessage("");
  };

  const animateCta = (toValue: number) => {
    Animated.spring(ctaPress, {
      toValue,
      friction: 7,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const ctaScale = ctaPress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.98],
  });

  return (
    <LinearGradient
      colors={[colors.maroonDark, "#5F0A12", "#180506"]}
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
          <Animated.View
            style={[
              styles.card,
              {
                opacity: entry,
                transform: [
                  {
                    translateY: entry.interpolate({
                      inputRange: [0, 1],
                      outputRange: [24, 0],
                    }),
                  },
                  {
                    scale: entry.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.98, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <View style={styles.brandSquare} />
                <View style={styles.brandSquareSmall} />
              </View>
              <Text style={styles.brandText}>myMSU-infoGuide</Text>
            </View>

            <Text style={styles.tagline}>
              {isSignUp
                ? "Create your account with your @s.msumain.edu.ph email."
                : "Sign in using your MSU email, username, or admin account."}
            </Text>

            <Text style={styles.heading}>
              {isSignUp ? "Create Account" : "Sign In"}
            </Text>

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
                    placeholder="MSU email (@s.msumain.edu.ph)"
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

              <Animated.View style={{ transform: [{ scale: ctaScale }] }}>
                <LinearGradient
                  colors={[colors.maroon, colors.maroonDark]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.button}
                >
                  <TouchableOpacity
                    style={styles.buttonInner}
                    activeOpacity={0.88}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    onPressIn={() => animateCta(1)}
                    onPressOut={() => animateCta(0)}
                  >
                    <Text style={styles.buttonText}>
                      {isSubmitting
                        ? "Please wait..."
                        : isSignUp
                          ? "Sign up"
                          : "Sign in"}
                    </Text>
                    <FontAwesome5
                      name="arrow-right"
                      size={12}
                      color={colors.surface}
                    />
                  </TouchableOpacity>
                </LinearGradient>
              </Animated.View>

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
          </Animated.View>
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
    paddingHorizontal: 14,
    paddingVertical: 24,
  },
  card: {
    width: "100%",
    maxWidth: Math.min(440, maxContentWidth),
    borderRadius: radii.sm,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.28)",
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 18px 36px rgba(20, 4, 5, 0.24)" }
      : {
          shadowColor: "#140405",
          shadowOpacity: 0.26,
          shadowRadius: 26,
          shadowOffset: { width: 0, height: 18 },
          elevation: 12,
        }),
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
    letterSpacing: 0,
    fontWeight: "800",
  },
  tagline: {
    marginTop: 22,
    textAlign: "center",
    color: colors.maroonDark,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
  },
  heading: {
    marginTop: 16,
    marginBottom: 18,
    textAlign: "center",
    color: colors.maroonDark,
    fontSize: 28,
    fontWeight: "800",
  },
  form: {
    marginTop: 2,
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.sm,
    minHeight: 44,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.line,
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
    borderRadius: radii.sm,
    marginTop: 18,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 6px 16px rgba(58, 8, 13, 0.2)" }
      : {
          shadowColor: colors.maroonDark,
          shadowOpacity: 0.22,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        }),
  },
  buttonInner: {
    minWidth: "100%",
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "900",
  },
  footer: {
    marginTop: 22,
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
