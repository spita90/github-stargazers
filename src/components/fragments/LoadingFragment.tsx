import Lottie from "lottie-react-native";
import { Platform, View, Image } from "react-native";
import { useTw } from "../../theme";
import { Text } from "..";
import { i18n } from "../core/LanguageLoader";

export const LoadingFragment = () => {
  const [tw] = useTw();

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
      <Text size={"lg"} ignoreFontFamily>
        {i18n.t("stargazers")}
      </Text>
    </View>
  );
};
