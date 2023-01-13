import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Platform, StyleSheet, View } from "react-native";
import {
  Browser as SentryBrowser,
  init as SentryInit,
  Native as SentryNative,
} from "sentry-expo";
import { AppLoader } from "./src/components/core/AppLoader";
import { ErrorFragment } from "./src/components/ErrorFragment";
import { config } from "./src/config";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { DomainError } from "./src/types";

useEffect(() => {
  SentryInit({
    dsn: "https://0290e10b60bc4d02959a039c66014912@o4504496397156352.ingest.sentry.io/4504496400957440",
    release: `github-stargazers:v${config.version}`,
    enableInExpoDevelopment: false,
    debug: __DEV__,
    tracesSampleRate: config.environment === "prod" ? 0.8 : 0,
  });
}, []);

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
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 600,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
