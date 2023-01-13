import { View } from "react-native";
import { Text } from "../components/Text";
import { useTw } from "../theme";
import { Screen } from "../components";

export function RepoDetailScreen() {
  const [tw] = useTw();

  return (
    <Screen>
      <Text>Hello from RepoDetailScreen!</Text>
    </Screen>
  );
}
