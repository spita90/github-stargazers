import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleProp,
  TextStyle,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text } from ".";
import { useTw } from "../theme";

export interface ToggleProps {
  activeIndex: number;
  setActiveIndex: (activeIndex: number) => void;
  label0: string;
  label1: string;
  style?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const Toggle = ({
  activeIndex,
  setActiveIndex,
  label0,
  label1,
  labelStyle,
  style,
}: ToggleProps) => {
  const [containerViewWidth, setContainerViewWidth] = useState(0);
  const [toggleViewWidth, setToggleViewWidth] = useState(0);
  const [tw] = useTw();

  const PADDING_X_PX = 10;

  const handleViewRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(PADDING_X_PX)).current;
  const textFade0Anim = useRef(new Animated.Value(1)).current;
  const textFade1Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue:
        PADDING_X_PX +
        activeIndex * (containerViewWidth - toggleViewWidth - 2 * PADDING_X_PX),
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
    Animated.timing(textFade0Anim, {
      toValue: 1 - activeIndex,
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
    Animated.timing(textFade1Anim, {
      toValue: activeIndex,
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [activeIndex]);

  const Label0View = () => (
    <View style={tw`flex flex-1 flex-row justify-center`}>
      <Animated.View
        style={[tw`flex w-[50%] mx-lg`, { opacity: textFade0Anim }]}
      >
        <Text textStyle={[tw`text-center`, labelStyle]}>{label0}</Text>
      </Animated.View>
      <Animated.View
        style={[tw`absolute flex w-[50%] mx-lg`, { opacity: textFade1Anim }]}
      >
        <Text color="white" textStyle={[tw`text-center`, labelStyle]}>
          {label0}
        </Text>
      </Animated.View>
    </View>
  );

  const Label1View = () => (
    <View style={tw`flex flex-1 flex-row justify-center`}>
      <Animated.View
        style={[tw`flex w-[50%] mx-lg`, { opacity: textFade0Anim }]}
      >
        <Text color="white" textStyle={[tw`text-center`, labelStyle]}>
          {label1}
        </Text>
      </Animated.View>
      <Animated.View
        style={[tw`absolute flex w-[50%] mx-lg`, { opacity: textFade1Anim }]}
      >
        <Text textStyle={[tw`text-center`, labelStyle]}>{label1}</Text>
      </Animated.View>
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setActiveIndex((activeIndex + 1) % 2);
      }}
      onLayout={(event) => {
        const width = event.nativeEvent.layout.width;
        if (!width) return;
        setContainerViewWidth(width);
      }}
    >
      <View
        style={[
          tw`min-w-[300px] w-[60%] flex py-md rounded-lg justify-center bg-black`,
          style,
        ]}
      >
        <Animated.View
          ref={handleViewRef}
          style={[
            tw`absolute bg-white w-[48%] rounded-md`,
            { height: Platform.OS === "web" ? "70%" : "160%" },
            { transform: [{ translateX: slideAnim }] },
          ]}
          onLayout={(event) => {
            const width = event.nativeEvent.layout.width;
            if (!width) return;
            setToggleViewWidth(width);
          }}
        />
        <View style={tw`flex flex-row w-full justify-between`}>
          <Label0View />
          <Label1View />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
