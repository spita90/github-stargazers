import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeTabParamList, RootStackParamList } from "../../navigation/screens";
import { View } from "react-native";
import { Text } from "..";

export interface MainSearchFragmentProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<HomeTabParamList, "MainScreen", undefined>,
    StackNavigationProp<RootStackParamList, keyof RootStackParamList, undefined>
  >;
}
export function MainSearchFragment({ navigation }: MainSearchFragmentProps) {
  return (
    <View>
      <Text>dummy</Text>
    </View>
  );
}
