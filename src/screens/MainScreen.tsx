import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import { View } from "react-native";
import Toast from "react-native-root-toast";
import { getUserRepos } from "../api/github";
import { AnimatedTextInput, Screen } from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { Text } from "../components/Text";
import { useTw } from "../theme";
import { Repo } from "../types";
import { showToast } from "../utils";

export function MainScreen() {
  const [tw] = useTw();
  const rootErrorhandler = useErrorHandler();
  const [userName, setUserName] = useState<string>("");
  const [repoName, setRepoName] = useState<string>("");
  const [foundRepos, setFoundRepos] = useState<Repo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);

  const onUserNameChanged = (text: string) => {
    setUserName(text);
    setRepoName("");
    setFoundRepos([]);
  };

  const onRepoNameChanged = (text: string) => {
    setRepoName(text);
  };

  const onRepoInputFocused = () => {
    if (userName.trim().length === 0) showToast(i18n.t("specifyUserNameFirst"));
  };

  const onFinishedInsertingUsername = async () => {
    const trimmedUserName = userName.trim();
    if (trimmedUserName.length === 0) return;
    try {
      const userRepos = await getUserRepos(trimmedUserName.trim());
      if (userRepos.length === 0) showToast(i18n.t("noRepoFound"));
      setFoundRepos(
        userRepos.sort((a, b) =>
          a.stargazers_count > b.stargazers_count ? -1 : 1
        )
      );
    } catch (e) {
      setFoundRepos([]);
      rootErrorhandler(e);
    }
  };

  useEffect(() => {
    const trimmedRepoName = repoName.trim();
    if (trimmedRepoName.length === 0) return setFilteredRepos(foundRepos);
    setFilteredRepos(
      foundRepos.filter((repo) =>
        repo.name.toLowerCase().includes(trimmedRepoName.toLowerCase())
      )
    );
  }, [foundRepos, repoName]);

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
            onChangeText={onUserNameChanged}
            onBlur={onFinishedInsertingUsername}
          />
          <View style={tw`pl-md`}>
            <Text textStyle={tw`text-8xl`}>/</Text>
          </View>
        </View>
        <AnimatedTextInput
          editable={userName.trim().length > 0}
          style={tw`w-[70%] mt-md ml-xl`}
          textStyle={tw`text-lg`}
          label={i18n.t("repoName")}
          value={repoName}
          onFocus={onRepoInputFocused}
          onChangeText={onRepoNameChanged}
        />
      </View>
      {filteredRepos.length > 0 && (
        <View style={tw`flex flex-1`}>
          <View
            style={tw`flex flex-1 p-sm mx-md border-t-3 border-l-3 border-r-3 border-grey rounded-t-lg`}
          >
            <FlashList
              data={filteredRepos}
              showsVerticalScrollIndicator={false}
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
