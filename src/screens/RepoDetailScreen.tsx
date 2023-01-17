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

export function RepoDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"RepoDetailScreen">) {
  const { devUsername, repoName } = route.params;

  const [tw] = useTw();
  const [dateFormat, setDateFormat] = useState<string>();
  const [repo, setRepo] = useState<Repo>();

  const platformConditionalBold = Platform.OS !== "web";

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
    } catch (e) {}
  };

  return (
    <Screen>
      <View style={tw`flex items-center`}>
        <View
          style={tw`flex flex-row h-[100px] w-full justify-center bg-grey50`}
        >
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
            {repo && dateFormat && (
              <Text
                style={tw`self-end mx-sm bg-grey50 p-md rounded-lg`}
                textStyle={tw`text-4xl`}
              >
                {moment(repo.created_at).format(dateFormat)}
              </Text>
            )}
          </View>
        </View>
        {repo ? (
          <ScrollView style={tw`w-full`}>
            <View style={tw`bg-grey50 pb-md px-[24px]`}>
              <View style={tw`flex flex-row items-center`}>
                <Text
                  textStyle={tw`text-5xl`}
                  numberOfLines={1}
                  bold={platformConditionalBold}
                >
                  {repo.owner.login}
                </Text>
                <Text
                  style={tw`ml-xs`}
                  textStyle={tw`text-7xl`}
                  bold={platformConditionalBold}
                >
                  /
                </Text>
              </View>
              <Text textStyle={tw`text-xl`} numberOfLines={1}>
                {repo.name}
              </Text>
            </View>
            <View style={tw`mt-md mx-sm px-[24px]`}>
              <Text
                style={tw`mt-sm`}
                textStyle={tw`underline`}
                numberOfLines={1}
                bold
                onPress={() => Linking.openURL(repo.html_url)}
              >
                {repo.html_url}
              </Text>
              {repo.description !== null && (
                <Text style={tw`mt-sm`} color="grey">
                  {repo.description}
                </Text>
              )}
              {repo.language !== null && (
                <Text style={tw`mt-xl`}>{`${i18n.t("language")}: ${
                  repo.language
                }`}</Text>
              )}
            </View>
          </ScrollView>
        ) : (
          <View
            style={tw`h-[${
              Dimensions.get("screen").height - 235
            }px] flex justify-center`}
          >
            <ActivityIndicator size={40} color="black" />
          </View>
        )}
      </View>
    </Screen>
  );
}
