import {
  StyleProp,
  Text as RNText,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTw } from "../theme";
import { ColorsType } from "../theme/palette";
import { fontSizes, FontSizeType, Sizes, SpacingType } from "../theme/sizes";

export interface Props {
  children: React.ReactNode | string;
  size?: FontSizeType | number;
  color?: ColorsType;
  bold?: boolean;
  center?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
  mtop?: SpacingType | boolean;
  padding?: number;
  allowFontScaling?: boolean;
  ignoreFontFamily?: boolean;
}

export function Text({
  children,
  size,
  bold,
  color,
  center,
  onPress,
  style,
  numberOfLines,
  textStyle,
  mtop,
  padding,
  allowFontScaling,
  ignoreFontFamily,
}: Props) {
  let bg = "transparent";
  const [tw] = useTw();

  const getSize = () => {
    if (!size) return fontSizes.md;
    if (typeof size === typeof Number) return size as number;
    return fontSizes[size as FontSizeType];
  };

  const fontSize = { fontSize: getSize() };
  const fontFamily = !ignoreFontFamily
    ? { fontFamily: "Circular-Std-Medium" }
    : undefined;
  const fontStyle: StyleProp<TextStyle> = {
    fontWeight: bold ? (fontSize.fontSize > 20 ? "700" : "600") : "normal",
    textAlign: center ? "center" : "auto",
  };

  let marginTop;
  if (mtop)
    marginTop =
      typeof mtop === "boolean" ? Sizes.spacing.md : Sizes.spacing[mtop];

  const wrapperStyle: StyleProp<ViewStyle> = {
    marginTop,
    backgroundColor: bg,
    padding: padding,
    margin: 0,
    marginBottom: 0,
  };

  const TextComponent = () => (
    <RNText
      allowFontScaling={allowFontScaling}
      numberOfLines={numberOfLines}
      style={[
        fontSize,
        fontFamily,
        fontStyle,
        textStyle,
        tw`text-${color ?? "black"}`,
      ]}
    >
      {children}
    </RNText>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={[wrapperStyle, style]}>
        <TextComponent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[wrapperStyle, style]}>
      <TextComponent />
    </View>
  );
}
