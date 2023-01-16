import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Linking, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { clientResetGHToken } from "../api/client";
import { testGHToken } from "../api/github";
import { AnimatedTextInput, Button, Screen } from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { Text } from "../components/Text";
import { HomeTabScreenProps } from "../navigation/screens";
import { setLanguage } from "../reducers/languageReducer";
import { userState } from "../reducers/store";
import { setGHToken, wipeUser } from "../reducers/userReducer";
import { useTw } from "../theme";
import { showToast } from "../utils";

export function ProfileScreen({
  navigation,
  route,
}: HomeTabScreenProps<"ProfileScreen">) {
  const GITHUB_DOCS_CREATING_PERSONAL_ACCESS_TOKEN_URL =
    "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token";
  const LANGUAGES = ["it", "en"];

  const [tw] = useTw();
  const { ghToken } = useSelector(userState);
  const [saveGHTokenButtonEnabled, setSaveGHTokenButtonEnabled] =
    useState<boolean>(true);
  const [dataResetCounter, setDataResetCounter] = useState<number>(0);
  const [textInputGHToken, setTextInputGHToken] = useState<string>("");
  const [cachedGHToken, setCachedGHToken] = useState<string | undefined>(
    ghToken
  );

  useEffect(() => {
    setCachedGHToken(ghToken);
  }, [ghToken]);

  const saveGHToken = async () => {
    const trimmedGHToken = textInputGHToken.trim();
    if (trimmedGHToken.length === 0)
      return showToast(i18n.t("noTokenInserted"));
    setSaveGHTokenButtonEnabled(false);
    try {
      const result = await testGHToken(trimmedGHToken);
      if (!result) return showToast(i18n.t("tokenTestFailed"));
      setGHToken(textInputGHToken);
      showToast(i18n.t("tokenTestSucceded"), "green");
    } catch (e) {
      showToast(i18n.t("cannotTestToken"));
    } finally {
      setSaveGHTokenButtonEnabled(true);
    }
  };

  const dataResetStep = (clickType: "short" | "long") => {
    // ___ _ ___
    if (clickType === "short") {
      setDataResetCounter(
        dataResetCounter >= 1 && dataResetCounter < 2 ? dataResetCounter + 1 : 0
      );
    } else if (clickType === "long") {
      setDataResetCounter(
        dataResetCounter >= 1 && dataResetCounter < 2 ? 0 : dataResetCounter + 1
      );
    }
  };

  useEffect(() => {
    if (dataResetCounter === 3) {
      resetData();
      setDataResetCounter(0);
      setTextInputGHToken("");
      showToast(
        `${dataResetCounter.toString()} - ${i18n.t("resetDataDone")}`,
        "grey",
        1000
      );
    } else if (dataResetCounter > 0) {
      showToast(dataResetCounter.toString(), "grey", 1000);
    }
  }, [dataResetCounter]);

  const resetData = async () => {
    setCachedGHToken(undefined);
    wipeUser();
    clientResetGHToken();
    navigation.navigate("MainScreen");
  };

  return (
    <Screen>
      <View style={tw`flex h-full items-center`}>
        <Text style={tw`mt-xl`} textStyle={tw`text-4xl`} bold>
          {i18n.t("profile")}
        </Text>
        <ScrollView
          style={tw`flex w-[80%] mt-xl`}
          showsVerticalScrollIndicator={false}
        >
          {cachedGHToken ? (
            <Text>{`${i18n.t("ghTokenPresent")} ✅`}</Text>
          ) : (
            <>
              <View style={tw`flex flex-row`}>
                <Text style={tw`flex flex-1 mr-sm`}>🔴</Text>
                <View style={tw`flex flex-11`}>
                  <Text>{i18n.t("ghTokenDisclaimer")}</Text>
                  <Text
                    textStyle={tw`underline`}
                    onPress={() =>
                      Linking.openURL(
                        GITHUB_DOCS_CREATING_PERSONAL_ACCESS_TOKEN_URL
                      )
                    }
                  >
                    {i18n.t("moreInfo")}
                  </Text>
                </View>
              </View>
              <AnimatedTextInput
                style={tw`w-full h-[140px] mt-sm self-center`}
                multiline
                label={"GitHub Token"}
                value={textInputGHToken}
                onChangeText={setTextInputGHToken}
              />
              <Button
                onPress={saveGHToken}
                disabled={!saveGHTokenButtonEnabled}
              >
                <Text color="white">{i18n.t("save")}</Text>
              </Button>
            </>
          )}
          <Button
            style={tw`mt-xl`}
            onPress={() => {
              const currentLanguageIndex = LANGUAGES.indexOf(i18n.locale);
              i18n.locale =
                LANGUAGES[(currentLanguageIndex + 1) % LANGUAGES.length];
              setLanguage(i18n.locale);
            }}
          >
            <Text color="white">{i18n.t("changeLanguage")}</Text>
          </Button>
          <View style={tw`mt-[100px] mb-xl`}>
            <Button
              style={tw`border-2 border-black`}
              color="yellow"
              onPress={() => {
                showToast(i18n.t("testErrorThrowed"));
                throw new Error("testError");
              }}
            >
              <Text>{i18n.t("throwTestError")}</Text>
            </Button>
            <Button
              style={tw`mt-xl border-2 border-black`}
              color="red"
              onPress={() => {
                if (dataResetCounter === 0)
                  showToast(i18n.t("resetDataMessage"));
                dataResetStep("short");
              }}
              onLongPress={() => {
                dataResetStep("long");
              }}
            >
              <Text>{i18n.t("resetData")}</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}
