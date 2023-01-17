import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Platform, View } from "react-native";
import { WEB_APP_MAX_WIDTH_PX } from "../../App";
import {
  MainListFragment,
  MainSearchFragment,
  Screen,
  Toggle,
} from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { HomeTabScreenProps } from "../navigation/screens";
import { useTw } from "../theme";

export function MainScreen({
  navigation,
  route,
}: HomeTabScreenProps<"MainScreen">) {
  const [tw] = useTw();
  const [toggleActiveIndex, setToggleActiveIndex] = useState(0);

  const screenWidth = Math.min(
    WEB_APP_MAX_WIDTH_PX,
    Dimensions.get("window").width
  );

  const searchSlideAnim = useRef(
    new Animated.Value(-screenWidth * (Platform.OS === "web" ? 0.5 : 2))
  ).current;
  const listSlideAnim = useRef(
    new Animated.Value(screenWidth * (Platform.OS === "web" ? 0.5 : 2))
  ).current;

  useEffect(() => {
    Animated.timing(searchSlideAnim, {
      toValue: -(
        toggleActiveIndex * screenWidth -
        screenWidth * (Platform.OS === "web" ? 0.5 : 0.75)
      ),
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
    Animated.timing(listSlideAnim, {
      toValue: -(
        toggleActiveIndex * screenWidth -
        screenWidth * (Platform.OS === "web" ? 0.5 : 0.75)
      ),
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [toggleActiveIndex]);

  return (
    <Screen>
      <View style={tw`flex h-full items-center py-xl`}>
        <Toggle
          activeIndex={toggleActiveIndex}
          setActiveIndex={setToggleActiveIndex}
          label0={i18n.t("search")}
          label1={i18n.t("list")}
          labelStyle={tw`text-xl`}
        />
        <View style={tw`flex flex-row h-full justify-center`}>
          <Animated.View
            style={[
              { width: screenWidth },
              { transform: [{ translateX: searchSlideAnim }] },
            ]}
          >
            <MainSearchFragment navigation={navigation} />
          </Animated.View>
          <Animated.View
            style={[
              { width: screenWidth },
              { transform: [{ translateX: listSlideAnim }] },
            ]}
          >
            <MainListFragment navigation={navigation} />
          </Animated.View>
        </View>
      </View>
    </Screen>
  );
}
