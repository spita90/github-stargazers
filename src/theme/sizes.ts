const XxSmall = "xxs";
const XSmall = "xs";
const Small = "sm";
const Medium = "md";
const Title = "tt";
const MediumPlus = "mdp";
const Large = "lg";
const XLarge = "xl";
const XLargePlus = "xlp";
const XxLarge = "xxl";
const XxLargePlus = "xxlp";

export const fontSizes = {
  [XSmall]: 12,
  [Small]: 14,
  [Medium]: 16,
  [Title]: 18,
  [Large]: 22,
  [XLarge]: 25,
};

export type FontSizeType = keyof typeof fontSizes;

export const borderRadius = {
  [XxSmall]: 4,
  [XSmall]: 6,
  [Small]: 10,
  [Medium]: 16,
  [Large]: 26,
  [XLarge]: 32,
  [XxLarge]: 40,
};

export const spacing = {
  [XxSmall]: 4,
  [XSmall]: 8,
  [Small]: 12,
  [Medium]: 16,
  [MediumPlus]: 20,
  [Large]: 24,
  [XLarge]: 32,
  [XLargePlus]: 40,
  [XxLarge]: 48,
  [XxLargePlus]: 56,
};

export type SpacingType = keyof typeof spacing;

export const margin = {
  ...spacing,
};

export const padding = {
  ...spacing,
};

export const Sizes = { borderRadius, margin, padding, spacing };
