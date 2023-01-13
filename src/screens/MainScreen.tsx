import { useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import { TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import { getRepo } from "../api/github";
import { Button, Screen } from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { Text } from "../components/Text";
import { useTw } from "../theme";

export function MainScreen() {
  const [tw] = useTw();
  const rootErrorHandler = useErrorHandler();
  const [userName, setUserName] = useState("");
  const [repoName, setRepoName] = useState("");

  const onSearch = async () => {
    if (userName.trim().length === 0) return showToast("dfsdfsd"); //TODO
    if (repoName.trim().length === 0) return showToast("grgeafreferf"); //TODO
    try {
      const result = await getRepo(userName.trim(), repoName.trim());
      console.log(result);
    } catch (e) {
      rootErrorHandler(e);
    }
  };

  const showToast = (message: string) => {
    Toast.show(message, {
      duration: 5000,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      backgroundColor: "red",
      delay: 0,
    });
  };

  return (
    <Screen>
      <View style={tw`flex items-center`}>
        <Text>Hello from MainScreen!</Text>
        <TextInput value={userName} onChangeText={setUserName} />
        <TextInput value={repoName} onChangeText={setRepoName} />
        <Button onPress={onSearch}>{i18n.t("search")}</Button>
      </View>
    </Screen>
  );
}
