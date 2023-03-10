import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorBoundary } from "react-error-boundary";
import { Dimensions, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  Browser as SentryBrowser,
  init as SentryInit,
  Native as SentryNative,
} from "sentry-expo";
import { LanguageLoader } from "./src/components";
import { AppLoader } from "./src/components/core/AppLoader";
import { ErrorFragment } from "./src/components/fragments/ErrorFragment";
import { config } from "./src/config";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { persistor, store } from "./src/reducers/store";
import { useTw } from "./src/theme";
import { DomainError } from "./src/types";

export const WEB_APP_MAX_WIDTH_PX = 600;
export const SCREEN_AVAILABLE_WIDTH = Math.min(
  WEB_APP_MAX_WIDTH_PX,
  Dimensions.get("window").width
);

/**
 * Prevents user from leaving the page.
 * In order for it to work, the user must interact
 * at least a minimum on the page (transient user activation).
 * Unfortunately modern browsers removed support for custom alert messages.
 */
if (Platform.OS === "web") {
  window.addEventListener("beforeunload", function (e) {
    if (!__DEV__) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}

/**
 * Initializes Sentry bug-tracking capabilities.
 *
 * This will only work on Web and in EAS build: see
 * https://docs.expo.dev/guides/using-sentry/
 *
 * The DSN url is safe to keep public: see
 * https://docs.sentry.io/product/sentry-basics/dsn-explainer/
 */
SentryInit({
  dsn: "https://0290e10b60bc4d02959a039c66014912@o4504496397156352.ingest.sentry.io/4504496400957440",
  release: config.version ? `github-stargazers:v${config.version}` : undefined,
  enableInExpoDevelopment: false,
  debug: __DEV__,
  tracesSampleRate: 1,
});

/**
 * App-level Error boundary
 */
const onError = async (error: Error) => {
  switch (Platform.OS) {
    case "web":
      SentryBrowser.captureException(error);
      break;
    case "android":
    case "ios":
      SentryNative.captureException(error);
      break;
    default:
      break;
  }
  if (error instanceof DomainError && error.fatal) {
    await AsyncStorage.clear();
  }
};

export default function App() {
  const tw = useTw();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView
          style={tw`flex-1 flex-row bg-[#EEEEEE] justify-center`}
        >
          <View
            style={[
              tw`flex-1`,
              {
                maxWidth:
                  Platform.OS === "web" ? WEB_APP_MAX_WIDTH_PX : undefined,
              },
            ]}
          >
            <RootSiblingParent>
              <LanguageLoader />
              <ErrorBoundary
                onError={onError}
                FallbackComponent={({ error, resetErrorBoundary }) => {
                  return (
                    <ErrorFragment
                      error={error}
                      resetErrorBoundary={resetErrorBoundary}
                    />
                  );
                }}
              >
                <AppLoader>
                  <AppNavigator />
                </AppLoader>
              </ErrorBoundary>
            </RootSiblingParent>
          </View>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
