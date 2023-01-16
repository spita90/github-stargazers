import Toast from "react-native-root-toast";
import { ColorsType } from "../theme/palette";

export const showToast = (
  message: string,
  color?: ColorsType,
  duration?: number
) => {
  Toast.show(message, {
    duration: duration ?? 3000,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    backgroundColor: color ?? "red",
    delay: 0,
  });
};
