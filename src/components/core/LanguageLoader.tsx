import { I18n } from "i18n-js";
import { useSelector } from "react-redux";
import { TRANSLATIONS_EN } from "../../locale/en/translations_en";
import { TRANSLATIONS_IT } from "../../locale/it/translations_it";
import { languageState } from "../../reducers/store";

export const i18n = new I18n({ it: TRANSLATIONS_IT, en: TRANSLATIONS_EN });

/**
 * Manages initialization of translation system
 */
export function initI18n() {
  i18n.locale = useSelector(languageState).code;
  i18n.enableFallback = true;
  i18n.defaultLocale = "en";
}

export const LanguageLoader = () => {
  initI18n();
  return null;
};
