jest.mock("i18n-js", () => ({
  I18n: () => {
    return {
      t: jest.fn((str) => str),
    };
  },
}));
