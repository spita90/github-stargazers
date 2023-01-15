import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import { LoadingFragment } from "../fragments/LoadingFragment";
import { config } from "../../config";
import { Animated, Platform } from "react-native";
import { useTw } from "../../theme";

export function AppLoader({ children }: { children: JSX.Element }) {
  const rootErrorHandler = useErrorHandler();
  const [appInitialized, setappInitialized] = useState(false);
  const [canRenderChildren, setCanRenderChildren] = useState(false);
  const [tw] = useTw();

  const [fontsLoaded] = useFonts({
    "Circular-Std-Medium": require("../../../assets/fonts/CircularStd-Medium.ttf"),
  });

  const initializeApp = async () => {
    try {
      //TODO do something
      setTimeout(
        () => {
          setappInitialized(true);
        },
        __DEV__ ? 10 : 2300
      );
    } catch (e) {
      rootErrorHandler(e);
    }
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
