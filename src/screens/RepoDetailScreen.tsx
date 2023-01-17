import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { getRepo } from "../api/github";
import { Button, Screen } from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { Text } from "../components/Text";
import { RootStackScreenProps } from "../navigation/screens";
import { useTw } from "../theme";
import { Repo } from "../types";
import moment from "moment";
import { StarIconSvg } from "../svgs/StarIcon";

export function RepoDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"RepoDetailScreen">) {
  const { devUsername, repoName } = route.params;

  const [tw] = useTw();
  const [dateFormat, setDateFormat] = useState<string>();
  const [repo, setRepo] = useState<Repo>();

  const boldCondition = Platform.OS !== "web";
  const languageShowCondition = !!repo && repo.language !== null;
  const stargazersCountShowCondition = !!repo && repo.stargazers_count > 0;

  useEffect(() => {
    switch (i18n.locale) {
      case "it":
        setDateFormat("DD/MM/YYYY");
        break;
      case "en":
        setDateFormat("MM/DD/YYYY");
    }
    fetchRepo();
  }, []);

  const fetchRepo = async () => {
    try {
      const repo = await getRepo(devUsername, repoName);
      setRepo(repo);
    } catch (e) {} //TODO
  };

  useEffect(() => {
    if (!!repo && stargazersCountShowCondition) {
      fetchStargazers();
    }
  }, [repo]);

  const fetchStargazers = async () => {
    try {
      const repo = await getRepo(devUsername, repoName);
      setRepo(repo);
    } catch (e) {}
  };

  const Header = () => (
    <View style={tw`flex flex-row h-[100px] w-full justify-center bg-grey50`}>
      <Button
        style={tw`flex-1 rounded-7 py-sm m-md`}
        onPress={() => {
          navigation.canGoBack() && navigation.goBack();
        }}
      >
        <Text color="white" textStyle={tw`text-4xl`}>
          {"<"}
        </Text>
      </Button>
      <View style={tw`flex flex-3 justify-center items-start`}>
        {dateFormat && (
          <Text
            style={tw`self-end mx-sm bg-grey50 p-md rounded-lg`}
            textStyle={tw`text-4xl`}
          >
            {moment(repo?.created_at).format(dateFormat)}
          </Text>
        )}
      </View>
    </View>
  );

  const AboveTheFold = () => (
    <View style={tw`bg-grey50 pb-md px-[24px]`}>
      <View style={tw`flex flex-row items-center`}>
        <Text textStyle={tw`text-5xl`} numberOfLines={1} bold={boldCondition}>
          {repo?.owner.login}
        </Text>
        <Text style={tw`ml-xs`} textStyle={tw`text-7xl`} bold={boldCondition}>
          /
        </Text>
      </View>
      <Text textStyle={tw`text-xl`} numberOfLines={1}>
        {repo?.name}
      </Text>
    </View>
  );

  const BelowTheFold = () => (
    <View style={tw`mt-md mx-sm px-[10px]`}>
      <Text
        style={tw`mt-sm bg-grey50 rounded-md px-md py-sm`}
        textStyle={tw`underline`}
        numberOfLines={1}
        bold
        onPress={() => Linking.openURL(repo!.html_url)}
      >
        {repo?.html_url}
      </Text>
      <View style={tw`px-[10px]`}>
        {repo?.description !== null && (
          <Text style={tw`mt-sm`} color="grey">
            {repo?.description}
          </Text>
        )}
        {(languageShowCondition || stargazersCountShowCondition) && (
          <View style={tw`flex flex-row items-center mt-md`}>
            {stargazersCountShowCondition && (
              <View style={tw`flex flex-row flex-1 items-center`}>
                <Text style={tw`px-xs`} textStyle={tw`text-4xl`}>
                  {repo.stargazers_count}
                </Text>
                <StarIconSvg width={30} height={30} />
              </View>
            )}
            {languageShowCondition && (
              <View style={tw`flex flex-1 items-end`}>
                <Text numberOfLines={1}>{`${i18n.t("language")}: ${
                  repo.language
                }`}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );

  const LoadingPlaceholder = () => (
    <View
      style={tw`h-[${Dimensions.get("window").height}px] flex justify-center`}
    >
      <ActivityIndicator size={40} color="black" />
    </View>
  );

  //TODO star icon must be shown and clickable (star/unstar)!
  return (
    <Screen>
      <View style={tw`flex items-center`}>
        <Header />
        {repo ? (
          <ScrollView style={tw`w-full`}>
            <AboveTheFold />
            <BelowTheFold />
          </ScrollView>
        ) : (
          <LoadingPlaceholder />
        )}
      </View>
    </Screen>
  );
}
