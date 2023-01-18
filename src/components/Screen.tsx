import {
  SafeAreaView,
  StatusBar,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useTw } from "../theme";

export interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  statusBackgroundColor?: string;
}

/**
 * A configurable screen wrapper
 * @param children the screen content
 * @param style the style for the component
 * @param padded redices the children available space
 * @param statusBackgroundColor the background color for the status bar
 */
export function Screen({
  children,
  padded,
  style,
  statusBackgroundColor,
}: ScreenProps) {
  const statusBg = statusBackgroundColor
    ? statusBackgroundColor
    : "transparent";
  const tw = useTw();
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
