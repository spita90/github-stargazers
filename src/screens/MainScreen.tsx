import { View } from "react-native";
import { Text } from "../components/Text";
import { useTw } from "../theme";
import { Screen } from "../components";

export function MainScreen() {
  const [tw] = useTw();

  return (
    <Screen>
      <Text>Hello from MainScreen!</Text>
    </Screen>
  );
}
