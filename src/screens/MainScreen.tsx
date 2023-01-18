import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Keyboard, Platform, View } from "react-native";
import { SCREEN_AVAILABLE_WIDTH } from "../../App";
import {
  MainListFragment,
  MainSearchFragment,
  Screen,
  Toggle,
} from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { HomeTabScreenProps } from "../navigation/screens";
import { OctocatSvg } from "../svgs";
import { useTw } from "../theme";

export function MainScreen({ navigation }: HomeTabScreenProps<"MainScreen">) {
  const tw = useTw();

  const [keyboardIsOpen, setKeyboardIsOpen] = useState(false);
  const [toggleActiveIndex, setToggleActiveIndex] = useState(0);

  const searchSlideAnim = useRef(
    new Animated.Value(
      -SCREEN_AVAILABLE_WIDTH * (Platform.OS === "web" ? 0.5 : 2)
    )
  ).current;
  const listSlideAnim = useRef(
    new Animated.Value(
      SCREEN_AVAILABLE_WIDTH * (Platform.OS === "web" ? 0.5 : 2)
    )
  ).current;
  const octocatOpacity = useRef(
    new Animated.Value(keyboardIsOpen ? 0 : 1)
  ).current;

  /**
   * Handles sub/unsub of Native keyboard events
   * and updates the keyboard state accordingly
   */
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardIsOpen(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardIsOpen(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  /**
   * Handles the in/out fading of the Octocat
   * when keyboard is respectively closed/open on Native
   */
  useEffect(() => {
    Animated.timing(octocatOpacity, {
      toValue: keyboardIsOpen ? 0 : 1,
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [keyboardIsOpen]);

  /**
   * Handles the horizontal movement of the search view
   * and the list view when the Toggle is clicked.
   */
  useEffect(() => {
    Animated.timing(searchSlideAnim, {
      toValue: -(
        toggleActiveIndex * SCREEN_AVAILABLE_WIDTH -
        SCREEN_AVAILABLE_WIDTH * (Platform.OS === "web" ? 0.5 : 0.75)
      ),
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
    Animated.timing(listSlideAnim, {
      toValue: -(
        toggleActiveIndex * SCREEN_AVAILABLE_WIDTH -
        SCREEN_AVAILABLE_WIDTH * (Platform.OS === "web" ? 0.5 : 0.75)
      ),
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [toggleActiveIndex]);

  const ScreenContent = useCallback(
    () => (
      <View style={tw`flex flex-row justify-center`}>
        <Animated.View
          style={[
            { width: SCREEN_AVAILABLE_WIDTH },
            { transform: [{ translateX: searchSlideAnim }] },
          ]}
        >
          <MainSearchFragment navigation={navigation} />
        </Animated.View>
        <Animated.View
          style={[
            { width: SCREEN_AVAILABLE_WIDTH },
            { transform: [{ translateX: listSlideAnim }] },
          ]}
        >
          <MainListFragment navigation={navigation} />
        </Animated.View>
      </View>
    ),
    []
  );

  const Octocat = useCallback(
    () => (
      <Animated.View
        style={[
          { zIndex: -10 },
          { opacity: octocatOpacity },
          tw`absolute w-full bottom-[50px] flex items-center justify-center`,
        ]}
      >
        <OctocatSvg width={200} height={200} />
      </Animated.View>
    ),
    []
  );

  return (
    <Screen>
      <View style={tw`flex items-center pt-xl h-full`}>
        <Toggle
          activeIndex={toggleActiveIndex}
          setActiveIndex={setToggleActiveIndex}
          label0={i18n.t("search")}
          label1={i18n.t("list")}
          labelStyle={tw`text-xl`}
        />
        <ScreenContent />
      </View>
      <Octocat />
    </Screen>
  );
}
