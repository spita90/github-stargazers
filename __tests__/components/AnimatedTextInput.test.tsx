import { fireEvent, render } from "@testing-library/react-native";
import * as React from "react";
import renderer from "react-test-renderer";
import { AnimatedTextInput } from "../../src/components";

it("renders correctly", () => {
  const tree = renderer.create(
    <AnimatedTextInput testID="ati0" label={"dummy"} />
  );
  expect(tree).toMatchSnapshot();
});

it("actually calls onFocus when focused", () => {
  const mockOnFocusFn = jest.fn();

  const { getByTestId } = render(
    <AnimatedTextInput testID="ati1" label={"dummy"} onFocus={mockOnFocusFn} />
  );
  fireEvent(getByTestId("ati1"), "focus");
  expect(mockOnFocusFn).toBeCalled();
});

it("not call onFocus when focused if disabled", () => {
  const mockOnFocusFn = jest.fn();

  const { getByTestId } = render(
    <AnimatedTextInput
      testID="ati2"
      label={"dummy"}
      onFocus={mockOnFocusFn}
      editable={false}
    />
  );
  fireEvent(getByTestId("ati2"), "focus");
  expect(mockOnFocusFn).not.toBeCalled();
});

it("actually calls onBlur when leaving", () => {
  const mockOnBlurFn = jest.fn();

  const { getByTestId } = render(
    <AnimatedTextInput testID="ati3" label={"dummy"} onBlur={mockOnBlurFn} />
  );
  fireEvent(getByTestId("ati3"), "blur");
  expect(mockOnBlurFn).toBeCalled();
});
