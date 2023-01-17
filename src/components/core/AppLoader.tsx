import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import { Animated, Platform } from "react-native";
import { clientSetGHToken, getGitHubClient } from "../../api/client";
import { config } from "../../config";
import { useTw } from "../../theme";
import { LoadingFragment } from "../fragments/LoadingFragment";

export function AppLoader({ children }: { children: JSX.Element }) {
  const [appInitialized, setappInitialized] = useState(false);
  const [canRenderChildren, setCanRenderChildren] = useState(false);
  const [tw] = useTw();

  const [fontsLoaded] = useFonts({
    "Circular-Std-Medium": require("../../../assets/fonts/CircularStd-Medium.ttf"),
  });

  const initializeApp = async () => {
    // init GH client
    getGitHubClient();
    clientSetGHToken();
    setTimeout(
      () => {
        setappInitialized(true);
      },
      __DEV__ ? 10 : 2300
    );
  };

  useEffect(() => {
    //Entry point
    if (config.environment !== "prod") {
      console.log(config.environment);
      console.log(config.version);
    }

    initializeApp();
  }, []);

  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!appInitialized || !fontsLoaded) return;
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: Platform.OS !== "web",
    }).start(({ finished }) => {
      if (!finished) return;
      setCanRenderChildren(true);
    });
  }, [appInitialized, fontsLoaded]);

  if (!canRenderChildren) {
    return (
      <Animated.View
        style={[tw`absolute top-0 w-full h-full`, { opacity: fadeOutAnim }]}
      >
        <LoadingFragment />
      </Animated.View>
    );
  }

  return children ?? null;
}
