import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Platform, View } from "react-native";
import { AnimatedTextInput, RepoListItem, SlidingPagedList } from "..";
import {
  getUserRepos,
  isError404NotFound,
  rateLimitExcedeed,
} from "../../api/github";
import { NAV_BAR_HEIGHT_PX } from "../../navigation/AppNavigator";
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

  const resultsViewRef = useRef(null);
  const [userName, setUserName] = useState<string>("");
  const [pagedFoundRepos, setPagedFoundRepos] = useState<GitHubRepo[][]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [resultViewVisible, setResultViewVisible] = useState<boolean>(false);

  const onFinishedInsertingUsername = () => {
    if (
      userName.trim().length === 0 ||
      (resultViewVisible && pagedFoundRepos.length > 0)
    )
      return;
    setPage(0);
    setLoading(true);
    // First username fetch.
    // Get first and second pages in parallel
    // (GitHub pages are 1-indexed)
    fetchRepos([0, 1], true);
  };

  const onUserNameChanged = (text: string) => {
    setUserName(text);
    setPagedFoundRepos([]);
    setPage(0);
    setResultViewVisible(false);
  };

  useEffect(() => {
    //@ts-ignore
    resultsViewRef.current?.rlvRef.scrollToOffset(0, 0, false, false);
    if (!pagedFoundRepos[page + 1]) {
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
        setResultViewVisible(true);
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
          devUsername: repo.owner.login,
          repoName: repo.name,
        });
      }}
    />
  );

  return (
    <View>
      <View style={[tw`flex flex-row justify-center items-center mt-sm`]}>
        <AnimatedTextInput
          style={tw`w-[70%]`}
          textStyle={tw`text-2xl font-bold`}
          labelStyle={tw`text-lg`}
          label={i18n.t("userName")}
          value={userName}
          onChangeText={onUserNameChanged}
          onBlur={onFinishedInsertingUsername}
        />
      </View>
      {loading && (
        <View style={tw`h-[80%] flex justify-center`}>
          <ActivityIndicator size={40} color="black" />
        </View>
      )}
      <SlidingPagedList
        dataMatrix={pagedFoundRepos}
        renderItem={renderListItem}
        page={page}
        setPage={setPage}
        visible={resultViewVisible}
        setVisible={setResultViewVisible}
        title={i18n.t("repos")}
        estimatedItemSize={100}
        height={Dimensions.get("window").height - 286}
        listRef={resultsViewRef}
      />
    </View>
  );
}
