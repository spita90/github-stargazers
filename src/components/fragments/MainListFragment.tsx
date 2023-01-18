import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { AnimatedTextInput, RepoListItem, SlidingPagedList } from "..";
import {
  getUserRepos,
  isError404NotFound,
  rateLimitExcedeed,
} from "../../api/github";
import { HomeTabParamList, RootStackParamList } from "../../navigation/screens";
import { useTw } from "../../theme";
import { GitHubRepo } from "../../types";
import { showToast } from "../../utils";
import { i18n } from "../core/LanguageLoader";

export interface MainListFragmentProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<HomeTabParamList, "MainScreen", undefined>,
    StackNavigationProp<RootStackParamList, keyof RootStackParamList, undefined>
  >;
}

export function MainListFragment({ navigation }: MainListFragmentProps) {
  const [tw] = useTw();

  const RESULTS_PER_PAGE = 20;

  const resultsListRef = useRef(null);
  const [userName, setUserName] = useState<string>("");
  const [resultsSliderVisible, setResultsSliderVisible] =
    useState<boolean>(false);
  const [pagedFoundRepos, setPagedFoundRepos] = useState<GitHubRepo[][]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const onUsernameInputFocus = () => {
    if (resultsSliderVisible) setResultsSliderVisible(false);
  };

  const onUsernameInputBlur = () => {
    if (
      userName.trim().length === 0 ||
      (resultsSliderVisible && pagedFoundRepos.length > 0)
    )
      return;
    setPage(0);
    setLoading(true);
    // First username fetch.
    // Get first and second pages in parallel
    // (GitHub pages are 1-indexed)
    fetchRepos([0, 1], true);
  };

  const onUsernameInputValueChanged = (text: string) => {
    setUserName(text);
    setPagedFoundRepos([]);
    setPage(0);
    setResultsSliderVisible(false);
  };

  useEffect(() => {
    //@ts-ignore
    resultsListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    if (pagedFoundRepos.length > 0 && !pagedFoundRepos[page + 1]) {
      fetchRepos([page + 1]);
    }
  }, [page]);

  const fetchRepos = async (pages: number[], showResults: boolean = false) => {
    const trimmedUserName = userName.trim();
    if (trimmedUserName.length === 0) return;
    try {
      const resultPages = await Promise.all(
        pages.map(
          async (page) =>
            await getUserRepos(trimmedUserName, RESULTS_PER_PAGE, page + 1)
        )
      );
      let pagesFound = [...pagedFoundRepos];
      resultPages.forEach((resultPage, index) => {
        pagesFound[pages[index]] = resultPage;
      });
      setPagedFoundRepos(pagesFound);
      if (showResults) {
        setResultsSliderVisible(true);
      }
    } catch (e) {
      if (rateLimitExcedeed(e)) return showToast(i18n.t("rateLimitExcedeed"));
      if (isError404NotFound(e)) return showToast(i18n.t("userNotFound"));
      setPagedFoundRepos([]);
    } finally {
      if (showResults) {
        setLoading(false);
      }
    }
  };

  const renderListItem = (repo: GitHubRepo) => (
    <RepoListItem
      repo={repo}
      onPress={() => {
        navigation.navigate("RepoDetailScreen", {
          repo: repo,
        });
      }}
    />
  );

  return (
    <View
      style={{
        height: Dimensions.get("window").height - 304,
      }}
    >
      <View style={[tw`flex flex-row justify-center items-center mt-lg`]}>
        <AnimatedTextInput
          style={tw`w-[76%] max-w-[360px]`}
          textStyle={tw`text-2xl font-bold`}
          labelStyle={tw`text-lg`}
          label={i18n.t("userName")}
          value={userName}
          onChangeText={onUsernameInputValueChanged}
          onFocus={onUsernameInputFocus}
          onBlur={onUsernameInputBlur}
          returnKeyType="search"
        />
      </View>
      {loading && (
        <View style={tw`h-[50%] flex justify-center`}>
          <ActivityIndicator size={40} color="black" />
        </View>
      )}
      <SlidingPagedList
        visible={resultsSliderVisible}
        setVisible={(visible) => setResultsSliderVisible(visible)}
        dataMatrix={pagedFoundRepos}
        renderItem={renderListItem}
        page={page}
        setPage={setPage}
        title={i18n.t("repos")}
        backgroundColor="white"
        bottomMargin={132}
        listRef={resultsListRef}
        maxHeight={(Dimensions.get("window").height * 60) / 100}
      />
    </View>
  );
}
