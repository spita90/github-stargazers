import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { getRepoStargazers, rateLimitExcedeed } from "../api/github";
import { Button, Screen, SlidingPagedList, UserListItem } from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { Text } from "../components/Text";
import { RootStackScreenProps } from "../navigation/screens";
import { StarIconSvg } from "../svgs";
import { useTw } from "../theme";
import { GitHubUser } from "../types";
import { showToast } from "../utils";

export function RepoDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"RepoDetailScreen">) {
  const tw = useTw();

  const RESULTS_PER_PAGE = 30;
  const HEADER_HEIGHT_PX = 100;

  const { repo } = route.params;

  const [pagedRepoStargazers, setPagedRepoStargazers] = useState<
    GitHubUser[][]
  >([]);
  const [page, setPage] = useState<number>(0);
  const [stargazersSliderVisible, setStargazersSliderVisible] =
    useState<boolean>(false);

  const stargazersListRef = useRef(null);

  const boldText = useMemo(() => Platform.OS !== "web", []);
  const showLanguage = useMemo(() => repo.language !== null, []);
  const showStargazers = useMemo(() => repo.stargazers_count > 0, []);
  const dateFormat = useMemo(() => {
    switch (i18n.locale) {
      case "it":
        return "DD/MM/YYYY";
      case "en":
        return "MM/DD/YYYY";
    }
  }, []);

  useEffect(() => {
    if (showStargazers) {
      fetchStargazers([0, 1]);
    }
  }, []);

  /**
   * Handles next/prev navigation of
   * stargazers list
   */
  useEffect(() => {
    //@ts-ignore
    stargazersListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    if (pagedRepoStargazers.length > 0 && !pagedRepoStargazers[page + 1]) {
      fetchStargazers([page + 1]);
    }
  }, [page]);

  const fetchStargazers = async (pages: number[]) => {
    try {
      const resultStargazers = await Promise.all(
        pages.map(
          async (page) =>
            await getRepoStargazers(
              repo.owner.login,
              repo.name,
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
    } catch (e) {
      if (rateLimitExcedeed(e)) return showToast(i18n.t("rateLimitExcedeed"));
      setPagedRepoStargazers([]);
    }
  };

  const Header = useCallback(
    () => (
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
          {dateFormat && (
            <Text style={tw`self-end mx-sm p-md`} textStyle={tw`text-4xl`}>
              {moment(repo.created_at).format(dateFormat)}
            </Text>
          )}
        </View>
      </View>
    ),
    []
  );

  const AboveTheFold = useCallback(
    () => (
      <View style={tw`bg-grey50 pb-md px-[24px]`}>
        <View style={tw`flex flex-row items-center`}>
          <Text textStyle={tw`text-5xl`} numberOfLines={1} bold={boldText}>
            {repo.owner.login}
          </Text>
          <Text style={tw`ml-xs`} textStyle={tw`text-7xl`} bold={boldText}>
            /
          </Text>
        </View>
        <Text textStyle={tw`text-xl`} numberOfLines={1}>
          {repo.name}
        </Text>
      </View>
    ),
    []
  );

  const BelowTheFold = useCallback(
    () => (
      <View style={tw`mt-md mx-sm px-[10px]`}>
        <Text
          style={tw`mt-sm bg-grey50 rounded-md px-md py-sm`}
          textStyle={tw`underline`}
          numberOfLines={1}
          bold
          onPress={() => Linking.openURL(repo.html_url)}
        >
          {repo.html_url}
        </Text>
        <View style={tw`px-[10px]`}>
          {repo.description !== null && (
            <Text style={tw`mt-sm`} color="grey">
              {repo.description}
            </Text>
          )}
          {(showLanguage || showStargazers) && (
            <View style={tw`flex flex-row items-center mt-md`}>
              {showStargazers && (
                <View style={tw`flex flex-row flex-1 items-center`}>
                  <Text style={tw`px-xs`} textStyle={tw`text-4xl`}>
                    {repo.stargazers_count}
                  </Text>
                  <StarIconSvg width={30} height={30} />
                </View>
              )}
              {showLanguage && (
                <View style={tw`flex flex-2 items-end`}>
                  <Text numberOfLines={1}>{`${i18n.t("language")}: ${
                    repo.language
                  }`}</Text>
                </View>
              )}
            </View>
          )}
          {showStargazers && (
            <Button
              style={tw`mt-lg`}
              onPress={() => setStargazersSliderVisible(true)}
            >
              <Text color="white">{i18n.t("showStargazers")}</Text>
            </Button>
          )}
        </View>
      </View>
    ),
    []
  );

  const StargazersSlider = useCallback(
    () => (
      <SlidingPagedList
        visible={stargazersSliderVisible}
        setVisible={(visible) => setStargazersSliderVisible(visible)}
        dataMatrix={pagedRepoStargazers}
        renderItem={(user: GitHubUser) => <UserListItem user={user} />}
        page={page}
        setPage={setPage}
        title={i18n.t("stargazers")}
        backgroundColor="white"
        bottomMargin={0}
        listRef={stargazersListRef}
        maxHeight={(Dimensions.get("window").height * 64) / 100}
      />
    ),
    [stargazersSliderVisible]
  );

  return (
    <Screen>
      <View style={tw`flex h-full items-center`}>
        <Header />
        <ScrollView style={tw`w-full`}>
          <AboveTheFold />
          <BelowTheFold />
        </ScrollView>
        <StargazersSlider />
      </View>
    </Screen>
  );
}
