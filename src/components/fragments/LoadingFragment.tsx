import Lottie from "lottie-react-native";
import { Image, View } from "react-native";
import { Text } from "..";
import { useTw } from "../../theme";
import { i18n } from "../core/LanguageLoader";

/**
 * Shows a cool animation with the app logo.
 * Uses Lottie for the animation
 */
export const LoadingFragment = () => {
  const tw = useTw();

  return (
    <View style={tw`h-full justify-center items-center`}>
      <Lottie
        style={tw`w-[80%]`}
        source={require("../../../assets/animations/github.json")}
        loop={true}
        autoPlay
      />
      <View style={tw`w-[50%] h-[100px]`}>
        <Image
          style={[tw`flex flex-1 w-full`, { resizeMode: "contain" }]}
          source={require("../../../assets/images/GitHub_Logo.png")}
        />
      </View>
      <Text size={"xl"} ignoreFontFamily>
        {`< ${i18n.t("stargazers")} />`}
      </Text>
    </View>
  );
};
