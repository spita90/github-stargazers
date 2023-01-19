import { fireEvent, render } from "@testing-library/react-native";
import * as React from "react";
import renderer from "react-test-renderer";
import { Text } from "../../src/components";

it("renders correctly", () => {
  const tree = renderer.create(<Text testID="text0">dummy</Text>);
  expect(tree).toMatchSnapshot();
});

it("actually calls onPress when pressed", () => {
  const mockOnPressFn = jest.fn();
  mockOnPressFn.mockReturnValue({ called: true });

  const { getByTestId } = render(
    <Text testID="text1" onPress={mockOnPressFn}>
      dummy
    </Text>
  );
  fireEvent.press(getByTestId("text1"));
  expect(mockOnPressFn.mock.results[0].value).toStrictEqual({
    called: true,
  });
});
