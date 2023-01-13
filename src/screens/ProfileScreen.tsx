import { Text } from "../components/Text";
import { useTw } from "../theme";
import { Screen } from "../components";
import { View } from "react-native";

export function ProfileScreen() {
  const [tw] = useTw();

  return (
    <Screen>
      <View style={tw`flex items-center`}>
        <Text>Hello from ProfileScreen!</Text>
      </View>
    </Screen>
  );
}
