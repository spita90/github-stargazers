import Toast from "react-native-root-toast";

export const showToast = (message: string) => {
  Toast.show(message, {
    duration: 3000,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    backgroundColor: "red",
    delay: 0,
  });
};
