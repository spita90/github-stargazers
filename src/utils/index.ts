import Toast from "react-native-root-toast";
import { ColorsType } from "../theme/palette";

/**
 * Shows a toast message to the app user
 * @param message the message to display
 * @param color the background color (default red)
 * @param duration ms, time before the toast fades out (default 3000)
 */
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
