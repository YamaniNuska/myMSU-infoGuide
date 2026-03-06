import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React, { useState } from "react";
import {
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
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Student Portal</Text>
      </View>

      {/* Logo */}
      <View style={styles.logo}>
        <FontAwesome5 name="user-graduate" 
        size={24} color="white" />
      </View>

      <Text style={styles.title}>
        {isSignUp ? "Create Account" : "Sign In"}
      </Text>

      {/* Name fields */}
      {isSignUp && (
        <View style={styles.row}>
          <TextInput
            style={styles.halfInput}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.halfInput}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
      )}

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="student@example.com"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm password */}
      {isSignUp && (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      )}

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          {isSignUp ? "Create Account" : "Sign In"}
        </Text>
      </TouchableOpacity>

      {/* Forgot */}
      {!isSignUp && (
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      )}

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>or</Text>
        <View style={styles.line} />
      </View>

      {/* Toggle */}
      <View style={styles.toggle}>
        <Text style={styles.toggleText}>
          {isSignUp
            ? "Already have an account?"
            : "Don't have an account?"}
        </Text>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.link}>
            {isSignUp ? " Sign In" : " Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center"
  },

  header: {
    backgroundColor: "#4A0E0E",
    padding: 18,
    borderRadius: 10,
    marginBottom: 25,
    alignItems: "center"
  },

  headerText: {
    color: "white",
    fontSize: 23,
    fontWeight: "500"
  },

  logo: {
    alignSelf: "center",
    width: 80,
    height: 80,
    backgroundColor: "#c79c0f",
    borderRadius: 40,
    borderLeftWidth: 2, borderRightWidth: 2, borderTopWidth: 2, borderBottomWidth: 2,
    borderColor: "#4A0E0E", 
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },

  logoText: {
    fontSize: 32
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 25,
    color: "#4A0E0E"
  },

  row: {
    flexDirection: "row",
    gap: 10
  },

  halfInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#D4AF37",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },

  input: {
    borderWidth: 2,
    borderColor: "#D4AF37",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },

  button: {
    backgroundColor: "#4A0E0E",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  },

  buttonText: {
    color: "white",
    fontSize: 16
  },

  forgot: {
    textAlign: "center",
    marginTop: 12,
    color: "#D4AF37"
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D4AF37"
  },

  or: {
    marginHorizontal: 10,
    color: "#4A0E0E"
  },

  toggle: {
    flexDirection: "row",
    justifyContent: "center"
  },

  toggleText: {
    color: "#4A0E0E"
  },

  link: {
    color: "#D4AF37"
  }

});