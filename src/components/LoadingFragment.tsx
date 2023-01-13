import Lottie from "lottie-react-native";
import { Platform, View } from "react-native";
import { useTw } from "../theme";

export const LoadingFragment = () => {
  const [tw] = useTw();

  return (
    <View style={tw`h-full justify-center items-center`}>
      {Platform.OS === "web" && (
        <Lottie
          style={tw`w-[80%]`}
          source={require("../../assets/animations/github.json")}
          loop={true}
          autoPlay
        />
      )}
    </View>
  );
};
