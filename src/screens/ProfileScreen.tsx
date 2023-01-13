import { Text } from "../components/Text";
import { useTw } from "../theme";
import { Screen } from "../components";

export function ProfileScreen() {
  const [tw] = useTw();

  return (
    <Screen>
      <Text>Hello from ProfileScreen!</Text>
    </Screen>
  );
}
