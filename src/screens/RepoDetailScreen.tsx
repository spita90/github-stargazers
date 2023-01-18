import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { getRepo, getRepoStargazers, rateLimitExcedeed } from "../api/github";
import { Button, Screen, SlidingPagedList, UserListItem } from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { Text } from "../components/Text";
import { RootStackScreenProps } from "../navigation/screens";
import { StarIconSvg } from "../svgs/StarIcon";
import { useTw } from "../theme";
import { GitHubUser, GitHubRepo } from "../types";
import { showToast } from "../utils";

export function RepoDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"RepoDetailScreen">) {
  const { devUsername, repoName } = route.params;

  const RESULTS_PER_PAGE = 30;
  const HEADER_HEIGHT_PX = 100;

  const [tw] = useTw();
  const [dateFormat, setDateFormat] = useState<string>();
  const [repo, setRepo] = useState<GitHubRepo>();
  const [pagedRepoStargazers, setPagedRepoStargazers] = useState<
    GitHubUser[][]
  >([]);
  const [page, setPage] = useState<number>(0);
  const [stargazersViewVisible, setStargazersResultViewVisible] =
    useState<boolean>(false);
  const stargazersViewRef = useRef(null);

  const boldCondition = Platform.OS !== "web";
  const languageShowCondition = !!repo && repo.language !== null;
  const stargazersShowCondition = !!repo && repo.stargazers_count > 0;

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
    if (!!repo && stargazersShowCondition) {
      fetchStargazers([0, 1]);
    }
  }, [repo]);

  useEffect(() => {
    //@ts-ignore
    stargazersViewRef.current?.rlvRef.scrollToOffset(0, 0, false, false);
    if (!pagedRepoStargazers[page + 1]) {
      fetchStargazers([page + 1]);
    }
  }, [page]);

  const fetchStargazers = async (
    pages: number[],
    showResults: boolean = false
  ) => {
    try {
      const resultStargazers = await Promise.all(
        pages.map(
          async (page) =>
            await getRepoStargazers(
              devUsername,
              repoName,
              RESULTS_PER_PAGE,
              page + 1
            )
        )
      );
      let stargazersFound = [...pagedRepoStargazers];
      resultStargazers.forEach((resultPage, index) => {
        stargazersFound[pages[index]] = resultPage;
      });
      setPagedRepoStargazers(stargazersFound);
      if (showResults) {
        setStargazersResultViewVisible(true);
      }
    } catch (e) {
      if (rateLimitExcedeed(e)) return showToast(i18n.t("rateLimitExcedeed"));
      setPagedRepoStargazers([]);
    }
  };

  const Header = () => (
    <View
      style={[
        { height: HEADER_HEIGHT_PX },
        tw`flex flex-row w-full justify-center bg-grey50`,
      ]}
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
        {dateFormat && repo && (
          <Text style={tw`self-end mx-sm p-md`} textStyle={tw`text-4xl`}>
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
        {(languageShowCondition || stargazersShowCondition) && (
          <View style={tw`flex flex-row items-center mt-md`}>
            {stargazersShowCondition && (
              <View style={tw`flex flex-row flex-1 items-center`}>
                <Text style={tw`px-xs`} textStyle={tw`text-4xl`}>
                  {repo.stargazers_count}
                </Text>
                <StarIconSvg width={30} height={30} />
              </View>
            )}
            {languageShowCondition && (
              <View style={tw`flex flex-2 items-end`}>
                <Text numberOfLines={1}>{`${i18n.t("language")}: ${
                  repo.language
                }`}</Text>
              </View>
            )}
          </View>
        )}
        {stargazersShowCondition && (
          <Button
            style={tw`mt-lg`}
            onPress={() => setStargazersResultViewVisible(true)}
          >
            <Text color="white">{i18n.t("showStargazers")}</Text>
          </Button>
        )}
      </View>
    </View>
  );

  const renderListItem = (user: GitHubUser) => <UserListItem user={user} />;

  const LoadingPlaceholder = () => (
    <View
      style={tw`h-[${Dimensions.get("window").height}px] flex justify-center`}
    >
      <ActivityIndicator size={40} color="black" />
    </View>
  );

  //TODO star/unstar

  return (
    <Screen>
      <View style={tw`flex h-full items-center`}>
        <Header />
        {repo ? (
          <>
            <ScrollView style={tw`w-full`}>
              <AboveTheFold />
              <BelowTheFold />
            </ScrollView>
            <SlidingPagedList
              dataMatrix={pagedRepoStargazers}
              renderItem={renderListItem}
              page={page}
              setPage={setPage}
              visible={stargazersViewVisible}
              setVisible={setStargazersResultViewVisible}
              title={i18n.t("stargazers")}
              backgroundColor="white"
              estimatedItemSize={61}
              height={Dimensions.get("window").height - 216}
              bottomMargin={0}
              listRef={stargazersViewRef}
            />
          </>
        ) : (
          <LoadingPlaceholder />
        )}
      </View>
    </Screen>
  );
}
