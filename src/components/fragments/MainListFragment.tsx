import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import { ActivityIndicator, View } from "react-native";
import { AnimatedTextInput, Button, RepoListItem, Text } from "..";
import { getUserRepos, rateLimitExcedeed } from "../../api/github";
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

  const RESULTS_PER_PAGE = 1;

  const [userName, setUserName] = useState<string>("");
  const [pagedFoundRepos, setPagedFoundRepos] = useState<Repo[][]>([]);
  const [page, setPage] = useState<number>(0);

  const [resultViewHeight, setResultViewHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const onFinishedInsertingUsername = () => {
    setPage(0);
    setLoading(true);
    // first username fetch. Get first and second pages in parallel (GitHub pages are 1-indexed)
    fetchRepos([0, 1]);
    setLoading(false);
  };

  const onUserNameChanged = (text: string) => {
    setUserName(text);
    setPagedFoundRepos([]);
    setPage(0);
  };

  useEffect(() => {
    if (!pagedFoundRepos[page + 1]) {
      fetchRepos([page + 1]);
    }
  }, [page]);

  const fetchRepos = async (pages: number[], fatalIfError: boolean = false) => {
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
    } catch (e) {
      if (fatalIfError) return rootErrorhandler(e);
      if (rateLimitExcedeed(e)) return showToast(i18n.t("rateLimitExcedeed"));
      setPagedFoundRepos([]);
    }
  };

  const canGoBack = page > 0;
  const canGoNext =
    pagedFoundRepos[page + 1] && pagedFoundRepos[page + 1].length > 0;

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
      {pagedFoundRepos[page] && pagedFoundRepos[page].length > 0 && (
        <View
          style={tw`h-full mt-md`}
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

                // estimatedItemSize={43}
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
        </View>
      )}
    </>
  );
}
