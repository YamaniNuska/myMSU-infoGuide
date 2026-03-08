import { View } from "react-native";
import DashboardScreen from "./screens/Dashboard/DashboardScreen";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <DashboardScreen />
    </View>
  );
}