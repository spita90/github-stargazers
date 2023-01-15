import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Platform, View } from "react-native";
import { APP_MAX_WIDTH_PX } from "../../App";
import {
  MainListFragment,
  MainSearchFragment,
  Screen,
  Toggle,
} from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { useTw } from "../theme";

export function MainScreen() {
  const [tw] = useTw();
  const [toggleActiveIndex, setToggleActiveIndex] = useState(0);

  const screenWidth = Math.min(
    APP_MAX_WIDTH_PX,
    Dimensions.get("screen").width
  );

  const searchSlideAnim = useRef(new Animated.Value(-screenWidth / 2)).current;
  const listSlideAnim = useRef(new Animated.Value(screenWidth / 2)).current;

  useEffect(() => {
    Animated.timing(searchSlideAnim, {
      toValue: -(toggleActiveIndex * screenWidth - screenWidth / 2),
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
    Animated.timing(listSlideAnim, {
      toValue: -(toggleActiveIndex * screenWidth - screenWidth / 2),
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [toggleActiveIndex]);

  return (
    <Screen>
      <View style={tw`flex items-center py-xl`}>
        <Toggle
          activeIndex={toggleActiveIndex}
          setActiveIndex={setToggleActiveIndex}
          label0={i18n.t("search")}
          label1={i18n.t("list")}
          labelStyle={tw`text-xl`}
        />

        <View style={tw`flex flex-row justify-center`}>
          <Animated.View
            style={[
              tw`bg-red`,
              { width: screenWidth },
              { transform: [{ translateX: searchSlideAnim }] },
            ]}
          >
            <MainSearchFragment />
          </Animated.View>
          <Animated.View
            style={[
              tw`bg-yellow`,
              { width: screenWidth },
              { transform: [{ translateX: listSlideAnim }] },
            ]}
          >
            <MainListFragment />
          </Animated.View>
        </View>
      </View>
    </Screen>
  );
}
