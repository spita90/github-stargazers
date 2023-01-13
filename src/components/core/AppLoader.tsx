import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import { LoadingFragment } from "..";
import { config } from "../../config";

export function AppLoader({ children }: { children: JSX.Element }) {
  const rootErrorHandler = useErrorHandler();
  const [appInitialized, setappInitialized] = useState(false);

  const [fontsLoaded] = useFonts({
    "Circular Std Medium": require("../../assets/fonts/CircularStd-Medium.ttf"),
  });

  const setAppInitializedWithTimeout = (value: boolean, timeout?: number) => {
    setTimeout(
      () => {
        setappInitialized(value);
      },
      __DEV__ ? 10 : timeout ?? 2300
    );
  };

  const initializeApp = async () => {
    try {
      setAppInitializedWithTimeout(true);
      //TODO else
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

  if (!appInitialized || !fontsLoaded) {
    return <LoadingFragment />;
  }

  return children ?? null;
}
