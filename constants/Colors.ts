/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const MagicPalette = {
  purple: '#7F7FD5',
  pink: '#E684AE',
  blue: '#86A8E7',
  teal: '#91EAE4',
  orange: '#FEC163',
  hotPink: '#FF6F91',
  yellow: '#FFD700',
  white: '#fff',
  black: '#222',
  gray: '#f8f9fa',
  darkGray: '#687076',
  green: '#2ecc40',
  lightGray: '#f0f4f8',
};

export const MagicGradients = {
  main: ['#7F7FD5', '#E684AE', '#86A8E7', '#91EAE4'],
  chip: ['#FEC163', '#FF6F91'],
  card: ['#7F7FD5', '#E684AE', '#86A8E7'],
  accent: ['#FFD700', '#FF6F91'],
  purple: ['#7F7FD5', '#E684AE'],
};

export const Colors = {
  light: {
    text: MagicPalette.black,
    background: MagicPalette.gray,
    tint: MagicPalette.purple,
    icon: MagicPalette.darkGray,
    tabIconDefault: MagicPalette.darkGray,
    tabIconSelected: MagicPalette.purple,
    ...MagicPalette,
  },
  dark: {
    text: MagicPalette.white,
    background: '#151718',
    tint: MagicPalette.white,
    icon: MagicPalette.teal,
    tabIconDefault: MagicPalette.teal,
    tabIconSelected: MagicPalette.white,
    ...MagicPalette,
  },
};
