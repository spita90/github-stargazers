import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTw } from "../theme";

type Props = React.ComponentProps<typeof TextInput> & {
  textStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  label: string;
  editable?: boolean;
  textInputRef?: any;
};

/**
 * A Text input whit an animated label
 * @param textStyle the style for the input text
 * @param labelStyle the style for the animated label
 * @param label the label string
 * @param editable if the component can accept text input
 * @param textInputRef the ref for the text input
 * @param value the value in the component
 * @param style the style for the main component
 * @param onBlur function executed when user leaves text input
 * @param onFocus function executed when user enters text input
 */
export const AnimatedTextInput: React.FC<Props> = (props) => {
  const {
    textStyle,
    labelStyle,
    label,
    editable = true,
    textInputRef,
    value,
    style,
    onBlur,
    onFocus,
    ...restOfProps
  } = props;
  const tw = useTw();

  const [isFocused, setIsFocused] = useState(false);

  const inputRef = textInputRef ?? useRef<TextInput>(null);
  const focusAnim = useRef(new Animated.Value(0)).current;

  /**
   * Handles label animation on user interaction
   */
  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 150,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [focusAnim, isFocused, value]);

  const Label = useCallback(
    () => (
      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
        <Animated.View
          style={[
            tw`absolute px-[8px] bg-white rounded-sm`,
            {
              transform: [
                {
                  scale: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.75],
                  }),
                },
                {
                  translateY: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, -12],
                  }),
                },
                {
                  translateX: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[tw`text-4`, labelStyle]}>{label}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    ),
    []
  );

  return (
    <View style={style}>
      <TextInput
        style={[
          tw`p-6 border-3 border-${
            editable ? "black" : "grey"
          } rounded-lg text-4`,
          textStyle,
        ]}
        ref={inputRef}
        {...restOfProps}
        value={value}
        editable={editable}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        onFocus={(event) => {
          if (editable) setIsFocused(true);
          onFocus?.(event);
        }}
      />
      <Label />
    </View>
  );
};
