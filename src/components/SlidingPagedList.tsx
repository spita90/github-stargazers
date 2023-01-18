import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Platform, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Button, Text } from ".";
import { useTw } from "../theme";
import { ColorsType } from "../theme/palette";
import { i18n } from "./core/LanguageLoader";

export interface SlidingPagedListProps {
  dataMatrix: any[][];
  renderItem: (item: any) => JSX.Element;
  page: number;
  setPage: (page: number) => void;
  title?: string;
  backgroundColor?: ColorsType;
  snapPoints: (string | number)[]; //starting from the top
  initialSnapIndex: number;
  height: number;
  bottomMargin: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  sliderRef?: any;
}

export const SlidingPagedList = ({
  sliderRef,
  dataMatrix,
  renderItem,
  page,
  setPage,
  title,
  backgroundColor,
  snapPoints,
  initialSnapIndex,
  height,
  bottomMargin,
  visible,
  setVisible,
}: SlidingPagedListProps) => {
  const [tw] = useTw();

  const canGoBack = page > 0;
  const canGoNext = dataMatrix[page + 1] && dataMatrix[page + 1].length > 0;

  const RESULTS_VIEW_HIDDEN_Y_POS_PX = Dimensions.get("window").height;

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

  const ListHeader = () => (
    <View
      style={[
        tw`flex flex-row items-center justify-between
      pb-md`,
        { backgroundColor: backgroundColor },
      ]}
    >
      {title && (
        <Text textStyle={tw`text-xl`} bold>
          {title}
        </Text>
      )}
      <Button style={tw`px-sm py-xs`} onPress={() => setVisible(false)}>
        <Text color="white">X</Text>
      </Button>
    </View>
  );

  useEffect(() => {
    // sliderRef.current.snapTo(visible ? 0 : snapPoints.length - 1);
  }, [visible]);

  return (
    <Animated.View
      style={[
        tw`absolute w-full`,
        { bottom: -bottomMargin },
        // { height: height, bottom: 0 },
        { transform: [{ translateY: resultsViewSlideAnim }] },
      ]}
    >
      <View
        style={[
          { backgroundColor: backgroundColor },
          { maxHeight: height },
          { width: Dimensions.get("window").width - 40, marginLeft: 20 },
          tw`p-sm
        border-t-3 border-l-3 border-r-3 border-grey 
        rounded-t-lg`,
        ]}
      >
        <ListHeader />
        <FlatList
          // ref={listRef}
          data={dataMatrix[page]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(itm) => itm.id.toString()}
          // estimatedItemSize={estimatedItemSize}
        />
        {(canGoBack || canGoNext) && <NavButtons />}
      </View>
    </Animated.View>
  );
};
