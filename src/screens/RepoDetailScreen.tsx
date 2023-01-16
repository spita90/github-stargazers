import { View } from "react-native";
import { Text } from "../components/Text";
import { useTw } from "../theme";
import { Button, Screen } from "../components";
import { RootStackScreenProps } from "../navigation/screens";
import { i18n } from "../components/core/LanguageLoader";

export function RepoDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"RepoDetailScreen">) {
  const [tw] = useTw();

  const { devUsername, repoName } = route.params;

  return (
    <Screen>
      <View style={tw`flex items-center`}>
        <Text>Hello from RepoDetailScreen!</Text>
        <Text>{devUsername}</Text>
        <Text>{repoName}</Text>
        <Button
          onPress={() => {
            navigation.canGoBack() && navigation.goBack();
          }} //TODO implementa setFavourites
        >
          <Text color="white">{i18n.t("back")}</Text>
        </Button>
      </View>
    </Screen>
  );
}
