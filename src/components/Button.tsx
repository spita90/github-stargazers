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
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: string | React.ReactNode;
  color?: ColorsType;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  disabled,
  style,
  children,
  color,
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
