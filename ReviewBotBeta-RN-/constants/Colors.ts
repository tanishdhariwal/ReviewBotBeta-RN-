/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  WHITE: "#ffff",
  BLACK: "#000",
  CREAM: "#fffdf0",
  RANDOM: "#964B00",
  GRAY: "#808080",
  RED: "#FF0000",
  GREEN: "#00FF00",
  BLUE: "#0000FF",
  YELLOW: "#FFFF00",
  ORANGE: "#FFA500",
  PURPLE: "#800080",
  PINK: "#FFC0CB",
  BROWN: "#A52A2A",
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    icon: '#fff',
    tabIconDefault: '#fff',
    tabIconSelected: tintColorDark,
  },
};
