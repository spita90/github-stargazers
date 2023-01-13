import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { useTw } from "../theme";
import { ColorsType } from "../theme/palette";
import { Text } from "./Text";

export interface ButtonProps extends ViewProps {
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: string | React.ReactNode;
  color?: ColorsType;
  textColor?: ColorsType;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  disabled,
  style,
  textStyle,
  children,
  color,
  textColor,
}: ButtonProps) => {
  const [tw] = useTw();
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.6}
      onPress={() => {
        if (!disabled && onPress) {
          onPress();
        }
      }}
    >
      <View
        style={[
          tw`py-md px-lg rounded-5 bg-${
            (!disabled ? color : undefined) ?? "black"
          }`,
          style,
        ]}
      >
        {children !== undefined && (
          <Text
            bold
            center
            textStyle={textStyle}
            color={(!disabled ? textColor : undefined) ?? "white"}
          >
            {children}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
