import { StyleSheet, Text, View } from "react-native";

export default function AIChatbotScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AI Chatbot</Text>
      <Text style={styles.subtext}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A0E0E",
  },
  subtext: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
});
