import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.logoRing}>
            <View style={styles.logo}>
              <FontAwesome5 name="user-graduate" size={32} color="white" />
            </View>
          </View>
          <Text style={styles.headerText}>Student Portal</Text>
          <Text style={styles.subHeaderText}>
            {isSignUp ? "Create a new account to get started" : "Welcome back! Please sign in."}
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          
          {isSignUp && (
            <View style={styles.row}>
              <View style={[styles.inputWrapper, styles.halfInput]}>
                <FontAwesome5 name="user" size={16} color="#a1a1a1" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="#a1a1a1"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={[styles.inputWrapper, styles.halfInput]}>
                <FontAwesome5 name="user" size={16} color="#a1a1a1" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#a1a1a1"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>
          )}

          <View style={styles.inputWrapper}>
            <FontAwesome5 name="envelope" size={16} color="#a1a1a1" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="student@example.com"
              placeholderTextColor="#a1a1a1"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <FontAwesome5 name="lock" size={16} color="#a1a1a1" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#a1a1a1"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {isSignUp && (
            <View style={styles.inputWrapper}>
              <FontAwesome5 name="lock" size={16} color="#a1a1a1" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#a1a1a1"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          )}

          {!isSignUp && (
            <TouchableOpacity style={styles.forgotWrapper}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
            <Text style={styles.buttonText}>
              {isSignUp ? "Create Account" : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View style={styles.footerContainer}>
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.linkText}>
                {isSignUp ? " Sign In" : " Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Slightly off-white background makes white inputs pop
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fbeeb8", // Very light gold background
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "#D4AF37",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A0E0E",
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 15,
    color: "#6c757d",
  },
  formContainer: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 0.48, // Leaves a small gap between first/last name
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
    // Subtle shadow for inputs
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  forgotWrapper: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    color: "#D4AF37",
    fontWeight: "600",
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: "#4A0E0E",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#4A0E0E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerContainer: {
    marginTop: 40,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  orText: {
    marginHorizontal: 16,
    color: "#a1a1a1",
    fontSize: 14,
    fontWeight: "600",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  toggleText: {
    color: "#6c757d",
    fontSize: 15,
  },
  linkText: {
    color: "#D4AF37",
    fontSize: 15,
    fontWeight: "bold",
  },
});