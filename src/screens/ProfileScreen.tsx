import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Linking, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { clientResetGHToken, clientSetGHToken } from "../api/client";
import { testGHToken } from "../api/github";
import { AnimatedTextInput, Button, Screen } from "../components";
import { i18n } from "../components/core/LanguageLoader";
import { Text } from "../components/Text";
import { config } from "../config";
import { HomeTabScreenProps } from "../navigation/screens";
import { setLanguage } from "../reducers/languageReducer";
import { userState } from "../reducers/store";
import {
  setGHToken as storeSetGHToken,
  wipeUser,
} from "../reducers/userReducer";
import { useTw } from "../theme";
import { showToast } from "../utils";

/**
 * Component for GitHub token related ui and logic
 */
const GHTokenManagement = () => {
  const tw = useTw();

  const GITHUB_DOCS_CREATING_PERSONAL_ACCESS_TOKEN_URL =
    "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token";

  const { ghToken } = useSelector(userState);
  const [cachedGHToken, setCachedGHToken] = useState<string | undefined>(
    ghToken
  );
  const [textInputGHToken, setTextInputGHToken] = useState<string>("");
  const [saveGHTokenButtonEnabled, setSaveGHTokenButtonEnabled] =
    useState<boolean>(true);

  useEffect(() => {
    setCachedGHToken(ghToken);
  }, [ghToken]);

  /**
   * Validates and saves user GitHub token.
   * Handles store and GitHub client headers.
   */
  const saveGHToken = async () => {
    const trimmedGHToken = textInputGHToken.trim();
    if (trimmedGHToken.length === 0)
      return showToast(i18n.t("noTokenInserted"));
    setSaveGHTokenButtonEnabled(false);
    try {
      const result = await testGHToken(trimmedGHToken);
      if (!result) return showToast(i18n.t("tokenTestFailed"));
      storeSetGHToken(textInputGHToken);
      clientSetGHToken(textInputGHToken);
      showToast(i18n.t("tokenTestSucceded"), "green");
    } catch (e) {
      showToast(i18n.t("cannotTestToken"));
    } finally {
      setSaveGHTokenButtonEnabled(true);
    }
  };

  return cachedGHToken ? (
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
              Linking.openURL(GITHUB_DOCS_CREATING_PERSONAL_ACCESS_TOKEN_URL)
            }
          >
            {i18n.t("moreInfo")}
          </Text>
        </View>
      </View>
      <AnimatedTextInput
        style={tw`w-full max-h-[140px] mt-sm mb-xs self-center`}
        multiline
        label={"GitHub Token"}
        value={textInputGHToken}
        onChangeText={setTextInputGHToken}
      />
      <Button onPress={saveGHToken} disabled={!saveGHTokenButtonEnabled}>
        {saveGHTokenButtonEnabled ? (
          <Text color="white">{i18n.t("save")}</Text>
        ) : (
          <ActivityIndicator size={20} color={"white"} />
        )}
      </Button>
    </>
  );
};

export function ProfileScreen({
  navigation,
}: HomeTabScreenProps<"ProfileScreen">) {
  const tw = useTw();

  const LANGUAGES = ["it", "en"];

  const [dataResetCounter, setDataResetCounter] = useState<number>(0);

  /**
   * Handles profile data reset at correct key-press
   * and shows progress in the while.
   */
  useEffect(() => {
    if (dataResetCounter === 3) {
      resetData();
      setDataResetCounter(0);
      showToast(
        `${dataResetCounter.toString()} - ${i18n.t("resetDataDone")}`,
        "grey",
        1000
      );
    } else if (dataResetCounter > 0) {
      showToast(dataResetCounter.toString(), "grey", 1000);
    }
  }, [dataResetCounter]);

  /**
   * Handles the data reset key combination.
   * In order to reset data the user must press the
   * reset button 3 times: one long, one short and one long again.
   */
  const dataResetStep = (clickType: "short" | "long") => {
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

  const resetData = async () => {
    wipeUser();
    clientResetGHToken();
    navigation.navigate("MainScreen");
  };

  const Header = useCallback(
    () => (
      <Text style={tw`mt-xl`} textStyle={tw`text-4xl`} bold>
        {i18n.t("profile")}
      </Text>
    ),
    []
  );

  const LanguageChanger = useCallback(
    () => (
      <Button
        style={tw`mt-[50px]`}
        onPress={() => {
          const currentLanguageIndex = LANGUAGES.indexOf(i18n.locale);
          i18n.locale =
            LANGUAGES[(currentLanguageIndex + 1) % LANGUAGES.length];
          setLanguage(i18n.locale);
        }}
      >
        <Text color="white">{i18n.t("changeLanguage")}</Text>
      </Button>
    ),
    []
  );

  const DangerZone = useCallback(
    () => (
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
            if (dataResetCounter === 0) showToast(i18n.t("resetDataMessage"));
            dataResetStep("short");
          }}
          onLongPress={() => {
            dataResetStep("long");
          }}
        >
          <Text>{i18n.t("resetData")}</Text>
        </Button>
      </View>
    ),
    [dataResetCounter]
  );

  const AppVersion = useCallback(
    () =>
      config.version ? (
        <Text style={tw`absolute right-3 top-[6px]`} size={"sm"} color="grey">
          v{config.version}
        </Text>
      ) : null,
    []
  );

  const ScreenContent = () => (
    <>
      <GHTokenManagement />
      <LanguageChanger />
      <DangerZone />
    </>
  );

  return (
    <Screen>
      <View style={tw`flex h-full items-center`}>
        <Header />
        <ScrollView
          style={tw`flex w-[80%] mt-xl`}
          showsVerticalScrollIndicator={false}
        >
          <ScreenContent />
        </ScrollView>
      </View>
      <AppVersion />
    </Screen>
  );
}
