import { View } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

export const ProfileIconSvg = ({
  width,
  height,
  color,
  fillOpacity,
}: SvgProps) => {
  return (
    <View style={{ width, height }}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 16 16"
        fill={color}
        fillOpacity={fillOpacity}
      >
        <Path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z" />
        <Path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <Path
          fillRule="evenodd"
          d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"
        />
      </Svg>
    </View>
  );
};
