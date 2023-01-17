import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
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
import { DomainError } from "./src/types";

export const APP_MAX_WIDTH_PX = 600;

// Prevents user from leaving the page.
// In order for it to work, the user must have interacted
// a minimum on the page (transient user activation).
// Unfortunately modern browsers removed support for custom alert messages.
if (Platform.OS === "web") {
  window.addEventListener("beforeunload", function (e) {
    if (!__DEV__) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}

SentryInit({
  dsn: "https://0290e10b60bc4d02959a039c66014912@o4504496397156352.ingest.sentry.io/4504496400957440",
  release: `github-stargazers:v${config.version}`,
  enableInExpoDevelopment: false,
  debug: __DEV__,
  tracesSampleRate: 1,
});

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
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          <View style={styles.app}>
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
        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  app: {
    flex: 1,
    maxWidth: APP_MAX_WIDTH_PX,
  },
});
