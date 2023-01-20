import {
  StyleProp,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { useTw } from "../theme";
import { ColorsType } from "../theme/palette";

export interface ButtonProps extends ViewProps {
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: string | React.ReactNode;
  color?: ColorsType;
  testID?: string;
}

/**
 * An highly customizable Button component that replaces
 * the default one
 * @param onPress function that executes on button press
 * @param onLongPress function that executes on button long press
 * @param disabled disables the button
 * @param style the button style
 * @param children the button content
 * @param color the button color
 */
export const Button: React.FC<ButtonProps> = ({
  onPress,
  onLongPress,
  disabled,
  style,
  children,
  color,
  testID,
}: ButtonProps) => {
  const tw = useTw();

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={disabled ? 1 : 0.6}
      onPress={() => {
        if (!disabled && onPress) {
          onPress();
        }
      }}
      onLongPress={() => {
        if (!disabled && onLongPress) {
          onLongPress();
        }
      }}
    >
      <View
        style={[
          tw`py-md px-lg rounded-5 flex items-center justify-center bg-${
            color ?? "black"
          }`,
          { opacity: !disabled ? 1 : 0.6 },
          style,
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};
