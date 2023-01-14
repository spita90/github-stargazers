import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import { View } from "react-native";
import { getUserRepos } from "../api/github";
import { AnimatedTextInput, Screen } from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { Text } from "../components/Text";
import { useTw } from "../theme";
import { Repo } from "../types";

export function MainScreen() {
  const [tw] = useTw();
  const rootErrorhandler = useErrorHandler();
  const [userName, setUserName] = useState<string>("");
  const [repoName, setRepoName] = useState<string>("");
  const [foundRepos, setFoundRepos] = useState<Repo[]>([]);

  const onFinishedInsertingUsername = async () => {
    const trimmedUserName = userName.trim();
    if (trimmedUserName.length === 0) return;
    try {
      const userRepos = await getUserRepos(trimmedUserName.trim());
      setFoundRepos(userRepos);
    } catch (e) {
      setFoundRepos([]);
      rootErrorhandler(e);
    }
  };

  return (
    <Screen>
      <View style={tw`flex items-center py-xl`}>
        <View style={tw`flex flex-row justify-center`}>
          <AnimatedTextInput
            style={tw`w-[60%]`}
            textStyle={tw`text-2xl font-bold`}
            labelStyle={tw`text-lg`}
            label={i18n.t("userName")}
            value={userName}
            onChangeText={setUserName}
            onBlur={onFinishedInsertingUsername}
          />
          <View style={tw`pl-md`}>
            <Text textStyle={tw`text-8xl`}>/</Text>
          </View>
        </View>
        <AnimatedTextInput
          style={tw`w-[70%] mt-md ml-xl`}
          textStyle={tw`text-lg`}
          label={i18n.t("repoName")}
          value={repoName}
          onChangeText={setRepoName}
        />
      </View>
      {foundRepos.length > 0 && (
        <View style={tw`flex flex-1`}>
          <View
            style={tw`flex flex-1 p-sm mx-md border-t-3 border-l-3 border-r-3 border-grey rounded-t-lg`}
          >
            <FlashList
              data={foundRepos}
              renderItem={({ item }) => (
                <View style={tw`py-sm`}>
                  <Text textStyle={tw`text-grey`}>{item.name}</Text>
                </View>
              )}
              keyExtractor={(itm) => itm.id.toString()}
              //estimatedItemSize={52}
            />
          </View>
        </View>
      )}
    </Screen>
  );
}
