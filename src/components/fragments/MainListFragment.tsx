import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Platform,
  View,
} from "react-native";
import { AnimatedTextInput, Button, RepoListItem, Text } from "..";
import {
  getUserRepos,
  isError404NotFound,
  rateLimitExcedeed,
} from "../../api/github";
import { NAV_BAR_HEIGHT_PX } from "../../navigation/AppNavigator";
import { HomeTabParamList, RootStackParamList } from "../../navigation/screens";
import { useTw } from "../../theme";
import { Repo } from "../../types";
import { showToast } from "../../utils";
import { i18n } from "../core/LanguageLoader";

export interface MainListFragmentProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<HomeTabParamList, "MainScreen", undefined>,
    StackNavigationProp<RootStackParamList, keyof RootStackParamList, undefined>
  >;
}

export function MainListFragment({ navigation }: MainListFragmentProps) {
  const rootErrorhandler = useErrorHandler();
  const [tw] = useTw();

  const RESULTS_PER_PAGE = 20;

  const [userName, setUserName] = useState<string>("");
  const [pagedFoundRepos, setPagedFoundRepos] = useState<Repo[][]>([]);
  const [page, setPage] = useState<number>(0);

  const [resultViewHeight, setResultViewHeight] = useState<number>(0);
  const [resultViewVisible, setResultViewVisible] = useState<boolean>(false);
  const [resultViewToBecomeHidden, setResultViewToBecomeHidden] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onFinishedInsertingUsername = () => {
    if (userName.trim().length === 0 || pagedFoundRepos.length > 0) return;
    setPage(0);
    setLoading(true);
    setResultViewVisible(true);
    // first username fetch. Get first and second pages in parallel (GitHub pages are 1-indexed)
    fetchRepos([0, 1], false, true);
  };

  const onUserNameChanged = (text: string) => {
    setUserName(text);
    setPagedFoundRepos([]);
    setPage(0);
    setResultViewVisible(false);
  };

  useEffect(() => {
    if (!pagedFoundRepos[page + 1]) {
      fetchRepos([page + 1]);
    }
  }, [page]);

  const RESULTS_VIEW_HIDDEN_Y_POS_PX = Dimensions.get("screen").height;

  const resultsViewSlideAnim = useRef(
    new Animated.Value(RESULTS_VIEW_HIDDEN_Y_POS_PX)
  ).current;

  useEffect(() => {
    if (!resultViewVisible) setResultViewToBecomeHidden(true);
    Animated.timing(resultsViewSlideAnim, {
      toValue: resultViewVisible ? 0 : RESULTS_VIEW_HIDDEN_Y_POS_PX,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [resultViewVisible]);

  const fetchRepos = async (
    pages: number[],
    fatalIfError: boolean = false,
    stopLoading: boolean = false
  ) => {
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
      if (stopLoading) setLoading(false);
    } catch (e) {
      if (fatalIfError) return rootErrorhandler(e);
      if (rateLimitExcedeed(e)) return showToast(i18n.t("rateLimitExcedeed"));
      if (isError404NotFound(e)) return showToast(i18n.t("userNotFound"));
      setPagedFoundRepos([]);
    }
  };

  const canGoBack = page > 0;
  const canGoNext =
    pagedFoundRepos[page + 1] && pagedFoundRepos[page + 1].length > 0;

  //TODO flashlist move to top on page change
  return (
    <>
      <View style={tw`flex flex-row justify-center items-center mt-sm`}>
        <AnimatedTextInput
          style={tw`w-[60%]`}
          textStyle={tw`text-2xl font-bold`}
          labelStyle={tw`text-lg`}
          label={i18n.t("userName")}
          value={userName}
          onChangeText={onUserNameChanged}
          onBlur={onFinishedInsertingUsername}
        />
      </View>
      {(resultViewVisible || resultViewToBecomeHidden) && (
        <Animated.View
          style={[
            tw`h-full mt-md`,
            { transform: [{ translateY: resultsViewSlideAnim }] },
          ]}
          onLayout={(event) => {
            const height = event.nativeEvent.layout.height;
            if (!height) return;
            setResultViewHeight(height);
          }}
        >
          <View
            style={[
              { height: resultViewHeight - NAV_BAR_HEIGHT_PX * 1.78 },
              tw`p-sm mx-lg border-t-3 border-l-3 border-r-3 border-grey rounded-t-lg`,
            ]}
          >
            {!loading ? (
              <FlashList
                data={pagedFoundRepos[page]}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <RepoListItem
                    repo={item}
                    onPress={() => {
                      navigation.navigate("RepoDetailScreen", {
                        devUsername: item.owner.login,
                        repoName: item.name,
                      });
                    }}
                  />
                )}
                keyExtractor={(itm) => itm.id.toString()}
                estimatedItemSize={100}
              />
            ) : (
              <View
                style={tw`h-[${resultViewHeight - 235}px] flex justify-center`}
              >
                <ActivityIndicator size={40} color="black" />
              </View>
            )}
            {(canGoBack || canGoNext) && (
              <View style={tw`flex flex-row h-[54px] mt-sm justify-evenly`}>
                <Button
                  style={tw`flex flex-1`}
                  disabled={loading || !canGoBack}
                  onPress={() => {
                    if (!canGoBack) return;
                    // setResultsLoading(true);
                    setPage(page - 1);
                  }}
                >
                  <Text color="white">{i18n.t("prev")}</Text>
                </Button>
                <Button
                  style={tw`flex flex-1`}
                  disabled={loading || !canGoNext}
                  onPress={() => {
                    if (!canGoNext) return;
                    // setResultsLoading(true);
                    setPage(page + 1);
                  }}
                >
                  <Text color={"white"}>{i18n.t("next")}</Text>
                </Button>
              </View>
            )}
          </View>
        </Animated.View>
      )}
    </>
  );
}
