import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Platform, View } from "react-native";
import { Button, Text } from ".";
import { NAV_BAR_HEIGHT_PX } from "../navigation/AppNavigator";
import { useTw } from "../theme";
import { i18n } from "./core/LanguageLoader";

export interface SlidingPagedListProps {
  dataMatrix: any[][];
  renderItem: (item: any) => JSX.Element;
  page: number;
  setPage: (page: number) => void;
  visible: boolean;
  listRef?: any;
}

export const SlidingPagedList = ({
  dataMatrix,
  renderItem,
  page,
  setPage,
  visible,
  listRef,
}: SlidingPagedListProps) => {
  const [tw] = useTw();

  const RESULTS_VIEW_HIDDEN_Y_POS_PX = Dimensions.get("window").height;

  const [resultViewHeight, setResultViewHeight] = useState<number>(0);

  const resultsViewSlideAnim = useRef(
    new Animated.Value(RESULTS_VIEW_HIDDEN_Y_POS_PX)
  ).current;

  useEffect(() => {
    Animated.timing(resultsViewSlideAnim, {
      toValue: visible ? 0 : RESULTS_VIEW_HIDDEN_Y_POS_PX,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [visible]);

  const canGoBack = page > 0;
  const canGoNext = dataMatrix[page + 1] && dataMatrix[page + 1].length > 0;

  const NavButtons = () => (
    <View style={tw`flex flex-row h-[54px] mt-sm justify-evenly`}>
      <Button
        style={tw`flex flex-1`}
        disabled={!canGoBack}
        onPress={() => {
          if (!canGoBack) return;
          setPage(page - 1);
        }}
      >
        <Text color="white">{i18n.t("prev")}</Text>
      </Button>
      <Button
        style={tw`flex flex-1`}
        disabled={!canGoNext}
        onPress={() => {
          if (!canGoNext) return;
          setPage(page + 1);
        }}
      >
        <Text color={"white"}>{i18n.t("next")}</Text>
      </Button>
    </View>
  );

  return (
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
          { height: resultViewHeight - NAV_BAR_HEIGHT_PX - 60 },
          tw`p-sm mx-lg border-t-3 border-l-3 border-r-3 border-grey rounded-t-lg`,
        ]}
      >
        <FlashList
          ref={listRef}
          data={dataMatrix[page]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(itm) => itm.id.toString()}
          estimatedItemSize={100}
        />

        {(canGoBack || canGoNext) && <NavButtons />}
      </View>
    </Animated.View>
  );
};
