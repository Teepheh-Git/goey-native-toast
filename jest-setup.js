/* global jest */
import "react-native-gesture-handler/jestSetup";
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";

jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);

jest.mock("react-native-keyboard-controller", () => {
  return {
    useAnimatedKeyboard: jest.fn(() => ({
      height: { value: 0 },
      progress: { value: 0 },
    })),
    KeyboardController: {
      setInputMode: jest.fn(),
      setDefaultMode: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    KeyboardProvider: ({ children }) => children,
  };
});

jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native").View;
  return {
    __esModule: true,
    GestureDetector: View,
    Gesture: {
      Pan: () => ({
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
        runOnJS: jest.fn().mockReturnThis(),
        onStart: jest.fn().mockReturnThis(),
        onFinalize: jest.fn().mockReturnThis(),
      }),
    },
  };
});

jest.mock(
  "react-native-worklets",
  () => ({
    __esModule: true,
    useWorklet: jest.fn(),
    createSerializable: jest.fn((fn) => fn),
    registerWorklet: jest.fn(),
  }),
  { virtual: true }
);

jest.mock("react-native-svg", () => {
  const React = require("react");
  const Svg = (props) => React.createElement("Svg", props, props.children);
  const Path = (props) => React.createElement("Path", props, props.children);
  const Circle = (props) =>
    React.createElement("Circle", props, props.children);
  const Polyline = (props) =>
    React.createElement("Polyline", props, props.children);
  const Line = (props) => React.createElement("Line", props, props.children);
  return {
    __esModule: true,
    default: Svg,
    Path,
    Circle,
    Polyline,
    Line,
  };
});

// Mock Reanimated
jest.mock("react-native-reanimated", () => {
  const { View, Text, Image, ScrollView } = require("react-native");

  const Reanimated = {
    View: View,
    Text: Text,
    Image: Image,
    ScrollView: ScrollView,
    createAnimatedComponent: (component) => component,
    useSharedValue: jest.fn((v) => ({ value: v })),
    useAnimatedStyle: jest.fn(() => ({})),
    useEvent: jest.fn(),
    useHandler: jest.fn(),
    withTiming: jest.fn((v) => v),
    withSpring: jest.fn((v) => v),
    withSequence: jest.fn((...args) => args[args.length - 1]),
    runOnJS: jest.fn((fn) => fn),
    LinearTransition: {
      springify: jest.fn().mockReturnThis(),
      damping: jest.fn().mockReturnThis(),
      stiffness: jest.fn().mockReturnThis(),
    },
    FadeIn: {
      duration: jest.fn().mockReturnThis(),
    },
    FadeOut: {
      duration: jest.fn().mockReturnThis(),
    },
    SlideInUp: {
      springify: jest.fn().mockReturnThis(),
      damping: jest.fn().mockReturnThis(),
      stiffness: jest.fn().mockReturnThis(),
      duration: jest.fn().mockReturnThis(),
    },
    SlideOutUp: {
      springify: jest.fn().mockReturnThis(),
      damping: jest.fn().mockReturnThis(),
      stiffness: jest.fn().mockReturnThis(),
      duration: jest.fn().mockReturnThis(),
    },
    SlideInDown: {
      springify: jest.fn().mockReturnThis(),
      damping: jest.fn().mockReturnThis(),
      stiffness: jest.fn().mockReturnThis(),
      duration: jest.fn().mockReturnThis(),
    },
    SlideOutDown: {
      springify: jest.fn().mockReturnThis(),
      damping: jest.fn().mockReturnThis(),
      stiffness: jest.fn().mockReturnThis(),
      duration: jest.fn().mockReturnThis(),
    },
  };

  return {
    __esModule: true,
    default: Reanimated,
    ...Reanimated,
  };
});
