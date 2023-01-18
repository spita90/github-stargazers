import { create, TailwindFn, TwConfig } from "twrnc";
import { Palette } from "./palette";
import tailwindConfig from "./tailwind.config";

const defaultConfig = (): TailwindFn => {
  const cfg: TwConfig = {
    theme: { ...tailwindConfig.theme, colors: { ...Palette } },
    plugins: [...tailwindConfig.plugins],
  };
  return create(cfg);
};

const tw_theme = {
  default: defaultConfig(),
};

/**
 * Tailwind hook
 */
export function useTw(): TailwindFn {
  return tw_theme.default;
}
