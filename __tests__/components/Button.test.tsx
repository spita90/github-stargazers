import { fireEvent, render } from "@testing-library/react-native";
import * as React from "react";
import renderer from "react-test-renderer";
import { Button, Text } from "../../src/components";

it("renders correctly", () => {
  const tree = renderer.create(
    <Button testID="button0">
      <Text>Login</Text>
    </Button>
  );
  expect(tree).toMatchSnapshot();
});

it("actually calls onPress when pressed", () => {
  const mockOnPressFn = jest.fn();
  mockOnPressFn.mockReturnValue({ called: true });

  const { getByTestId } = render(
    <Button testID="button1" onPress={mockOnPressFn}>
      <Text>Login</Text>
    </Button>
  );
  fireEvent.press(getByTestId("button1"));
  expect(mockOnPressFn.mock.results[0].value).toStrictEqual({
    called: true,
  });
});
