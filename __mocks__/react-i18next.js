import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

const tSpy = jest.fn((str) => str);
const useTranslationSpy = useTranslation;

useTranslationSpy.mockReturnValue({
  t: tSpy,
  i18n: {
    changeLanguage: () => new Promise(() => {}),
  },
});
