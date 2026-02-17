import { useSharedValue } from "react-native-reanimated";

let useReanimatedKeyboardAnimationHook: any;

try {
  // safe import for optional dependency
  const lib = require("react-native-keyboard-controller");
  useReanimatedKeyboardAnimationHook = lib.useReanimatedKeyboardAnimation;
} catch {
  // Library not installed
}

const useMockKeyboardAnimation = () => {
  const height = useSharedValue(0);
  const progress = useSharedValue(0);
  return { height, progress };
};

export const useKeyboardAnimation =
  useReanimatedKeyboardAnimationHook || useMockKeyboardAnimation;
