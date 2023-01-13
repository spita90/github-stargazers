import axios from "axios";
import React, { useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-root-toast";
import { config } from "../config";
import { useTw } from "../theme";
import { DomainError } from "../types";
import { i18n } from "./core/LanguageLoader";
import { Text } from ".";

export interface ErrorPageProps {
  error: Error;
  resetErrorBoundary?: (...args: Array<unknown>) => void;
}

/**
 * To be used for blocking errors
 */
export function ErrorFragment({ error, resetErrorBoundary }: ErrorPageProps) {
  const [tw] = useTw();

  useEffect(() => {
    if (
      axios.isAxiosError(error) &&
      error.code &&
      error.config &&
      error.config.url
    ) {
      error.message = `${error.message} (${error.code} in ${error.config.url}).`;
    }
    if (error && error.hasOwnProperty("message")) {
      const message =
        error instanceof DomainError
          ? i18n.t((error as DomainError).message)
          : error.message;
      Toast.show(message, {
        duration: 5000,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: "red",
        delay: 0,
      });
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        alignContent: "stretch",
        justifyContent: "center",
      }}
    >
      <Text
        size={"lg"}
        style={{ alignSelf: "center", padding: 10, marginBottom: 20 }}
      >
        {i18n.t("error")}
      </Text>
      <View
        style={tw`absolute right-6 bottom-6 w-[50%] h-[50px] justify-end items-end`}
      >
        <Text size={"sm"} color="black_opacque">
          v{config.version}
        </Text>
      </View>
    </View>
  );
}
