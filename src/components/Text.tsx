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
  testID?: string;
}

/**
 * A practical and highly configurable text component
 * that replaces the default one
 * @param children the content of the text field (can also be another Text)
  @param size the font size
  @param bold thickens the font
  @param color the font color
  @param center centers the text
  @param onPress a function executen on text press
  @param style the style of the text container
  @param textStyle the style of the text itself
  @param numberOfLines if the text rows exceed this number, 3 dots will be shown
  @param mtop the top margin
  @param padding the text padding from the container
  @param allowFontScaling enables font scaling
  @param ignoreFontFamily uses the default system font
 */
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
  testID,
}: Props) {
  let bg = "transparent";
  const tw = useTw();

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
    textAlign: center ? "center" : "auto",
  };

  let marginTop;
  if (mtop)
    marginTop =
      typeof mtop === "boolean" ? Sizes.spacing.md : Sizes.spacing[mtop];

  const wrapperStyle: StyleProp<ViewStyle> = [
    tw`m-0`,
    { backgroundColor: bg, padding: padding, marginTop },
  ];

  const TextComponent = () => (
    <RNText
      allowFontScaling={allowFontScaling}
      numberOfLines={numberOfLines}
      style={[
        fontSize,
        fontFamily,
        fontStyle,
        textStyle,
        bold ? tw`font-bold` : undefined,
        tw`text-${color ?? "black"}`,
      ]}
    >
      {children}
    </RNText>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        style={[wrapperStyle, style]}
      >
        <TextComponent />
      </TouchableOpacity>
    );
  }

  return (
    <View testID={testID} style={[wrapperStyle, style]}>
      <TextComponent />
    </View>
  );
}
