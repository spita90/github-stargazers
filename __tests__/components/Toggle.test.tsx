import { fireEvent, render } from "@testing-library/react-native";
import * as React from "react";
import renderer from "react-test-renderer";
import { Toggle } from "../../src/components";

it("renders correctly", () => {
  const tree = renderer.create(
    <Toggle
      testID="toggle0"
      activeIndex={0}
      setActiveIndex={() => {}}
      label0={"Label0"}
      label1={"Label1"}
    />
  );
  expect(tree).toMatchSnapshot();
});

it("actually changes activeIndex on press 0 -> 1", () => {
  const mockOnPressFn = jest.fn();

  const { getByTestId } = render(
    <Toggle
      testID={"toggle1"}
      activeIndex={0}
      setActiveIndex={mockOnPressFn}
      label0={"Label2"}
      label1={"Label3"}
    />
  );
  fireEvent.press(getByTestId("toggle1"));
  expect(mockOnPressFn).toBeCalledWith(1);
});

it("actually changes activeIndex on press 1 -> 0", () => {
  const mockOnPressFn = jest.fn();

  const { getByTestId } = render(
    <Toggle
      testID={"toggle2"}
      activeIndex={1}
      setActiveIndex={mockOnPressFn}
      label0={"Label2"}
      label1={"Label3"}
    />
  );
  fireEvent.press(getByTestId("toggle2"));
  expect(mockOnPressFn).toBeCalledWith(0);
});
