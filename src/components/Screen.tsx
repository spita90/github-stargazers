import {
  SafeAreaView,
  StatusBar,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useTw } from "../theme";

export interface ScreenProps {
  statusBackgroundColor?: string;
  padded?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  statusBackgroundColor,
  style,
  padded,
}: ScreenProps) {
  const statusBg = statusBackgroundColor
    ? statusBackgroundColor
    : "transparent";
  const [tw] = useTw();
  return (
    <SafeAreaView style={[{ flex: 1 }, style]}>
      <StatusBar
        backgroundColor={statusBg}
        barStyle={"dark-content"}
        animated
      />
      <View style={[{ flex: 1 }, tw`${padded ? "px-xs" : ""}`]}>
        {children}
      </View>
    </SafeAreaView>
  );
}
