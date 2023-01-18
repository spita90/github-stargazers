import { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, Easing, Platform, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Button, Text } from ".";
import { SCREEN_AVAILABLE_WIDTH } from "../../App";
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
  maxHeight: number;
  bottomMargin: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  listRef?: any;
}

/**
 * Animated bottom sheet sliding from the bottom
 * that contains a paged list of item
 * @param listRef a ref for the list
 * @param dataMatrix an array of arrays where each inner array contains items for its page
 * @param renderItem a function that, given an item, returns a relevant component
 * @param page the current page
 * @param setPage function to set the current page
 * @param title string to show in the component header
 * @param backgroundColor the background color
 * @param maxHeight the maximum height to which the component can extend
 * @param bottomMargin offset from the bottom
 * @param visible if the component is visible
 * @param setVisible function to set component visibility
 */
export const SlidingPagedList = ({
  listRef,
  dataMatrix,
  renderItem,
  page,
  setPage,
  title,
  backgroundColor,
  maxHeight,
  bottomMargin,
  visible,
  setVisible,
}: SlidingPagedListProps) => {
  const tw = useTw();

  const RESULTS_VIEW_HIDDEN_Y_POS_PX = Dimensions.get("window").height;

  const canGoBack = useMemo(() => page > 0, [page]);
  const canGoNext = useMemo(
    () => dataMatrix[page + 1] && dataMatrix[page + 1].length > 0,
    [dataMatrix, page]
  );

  const resultsViewSlideAnim = useRef(
    new Animated.Value(RESULTS_VIEW_HIDDEN_Y_POS_PX)
  ).current;

  /**
   * Handles the slide up/down animation when visibility
   * is set respectively to true/false
   */
  useEffect(() => {
    Animated.timing(resultsViewSlideAnim, {
      toValue: visible ? 0 : RESULTS_VIEW_HIDDEN_Y_POS_PX,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [visible]);

  /**
   * Bottom prev/next buttons for
   * page navigation
   */
  const NavButtons = useCallback(
    () => (
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
    ),
    [canGoBack, canGoNext]
  );

  const ListHeader = useCallback(
    () => (
      <View
        style={[
          tw`flex flex-row items-center justify-between
      pb-sm`,
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
    ),
    []
  );

  return (
    <Animated.View
      style={[
        tw`absolute w-full`,
        { bottom: -bottomMargin },
        { transform: [{ translateY: resultsViewSlideAnim }] },
      ]}
    >
      <View
        style={[
          { backgroundColor: backgroundColor },
          { maxHeight: maxHeight },
          {
            width: SCREEN_AVAILABLE_WIDTH - 40,
            marginLeft: 20,
          },
          tw`p-sm
        border-t-3 border-l-3 border-r-3 border-grey 
        rounded-t-lg`,
        ]}
      >
        <ListHeader />
        <FlatList
          ref={listRef}
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
