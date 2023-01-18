import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeTabParamList, RootStackParamList } from "../../navigation/screens";
import { ActivityIndicator, Platform, View } from "react-native";
import { AnimatedTextInput, Text } from "..";
import { useTw } from "../../theme";
import { i18n } from "../core/LanguageLoader";
import { useRef, useState } from "react";
import {
  getRepo,
  isError404NotFound,
  rateLimitExcedeed,
} from "../../api/github";
import { showToast } from "../../utils";
import { OctocatSvg } from "../../svgs";

export interface MainSearchFragmentProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<HomeTabParamList, "MainScreen", undefined>,
    StackNavigationProp<RootStackParamList, keyof RootStackParamList, undefined>
  >;
}

export function MainSearchFragment({ navigation }: MainSearchFragmentProps) {
  const [tw] = useTw();

  const repoTextInputRef = useRef(null);
  const [userName, setUserName] = useState<string>("");
  const [repoName, setRepoName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const USERNAME_INPUT_WIDTH_PERC = Platform.OS === "web" ? 70 : 76;

  const onUsernameInputValueChanged = (text: string) => {
    setUserName(text);
    setRepoName("");
  };

  const onUsernameInputBlur = () => {};

  const onRepoNameInputValueChanged = (text: string) => {
    setRepoName(text);
  };

  const onRepoNameInputBlur = () => {
    setLoading(true);
    fetchRepo();
  };

  const fetchRepo = async () => {
    try {
      const trimmedUserName = userName.trim();
      const trimmedRepoName = repoName.trim();
      if (trimmedUserName.length === 0 || trimmedRepoName.length === 0) return;
      const repo = await getRepo(trimmedUserName, trimmedRepoName);
      //TODO test not found
      navigation.navigate("RepoDetailScreen", {
        repo: repo,
      });
    } catch (e) {
      if (rateLimitExcedeed(e)) return showToast(i18n.t("rateLimitExcedeed"));
      if (isError404NotFound(e)) return showToast(i18n.t("repoNotFound"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`h-full items-center`}>
      <View style={[tw`flex-row justify-center items-center mt-sm px-md`]}>
        <AnimatedTextInput
          style={tw`w-[${USERNAME_INPUT_WIDTH_PERC}%]`}
          textStyle={tw`text-2xl font-bold`}
          labelStyle={tw`text-lg`}
          label={i18n.t("userName")}
          value={userName}
          onChangeText={onUsernameInputValueChanged}
          onBlur={onUsernameInputBlur}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            //@ts-ignore
            repoTextInputRef.current.focus();
          }}
        />
        <View style={tw`ml-xs`}>
          <Text textStyle={tw`pt-[10px] text-8xl`}>/</Text>
        </View>
      </View>
      <View style={tw`w-full items-center px-xl`}>
        <AnimatedTextInput
          textInputRef={repoTextInputRef}
          style={tw`w-[100%] max-w-[360px] mt-xs`}
          textStyle={tw`text-xl`}
          labelStyle={tw`text-lg`}
          label={i18n.t("repoName")}
          value={repoName}
          onChangeText={onRepoNameInputValueChanged}
          onBlur={onRepoNameInputBlur}
          returnKeyType="search"
        />
      </View>
      {loading && (
        <View style={tw`h-[50%] flex justify-center`}>
          <ActivityIndicator size={40} color="black" />
        </View>
      )}
    </View>
  );
}
