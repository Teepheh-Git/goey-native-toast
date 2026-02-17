import { render, act } from "@testing-library/react-native";
import { Toaster } from "../Toaster";
import { useToastStore } from "../../core/store";

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  const Reanimated = {
    View,
    Text: View,
    createAnimatedComponent: (c: any) => c,
    useSharedValue: jest.fn((v) => ({ value: v })),
    useAnimatedStyle: jest.fn((cb) => cb()),
    withSpring: jest.fn(),
    withTiming: jest.fn(),
    withRepeat: jest.fn(),
    cancelAnimation: jest.fn(),
    Easing: { linear: jest.fn() },
    SlideInUp: {},
    SlideOutUp: {},
    SlideInDown: {},
    SlideOutDown: {},
    LinearTransition: { duration: jest.fn().mockReturnThis() },
    runOnJS: jest.fn((fn) => fn),
  };
  return {
    ...Reanimated,
    default: Reanimated,
  };
});

// Mock the store
const mockToasts = [
  {
    id: "1",
    title: "Toast 1",
    description: "Description 1",
    type: "success",
    createdAt: Date.now(),
    duration: 3000,
  },
  {
    id: "2",
    title: "Toast 2",
    description: "Description 2",
    type: "error",
    createdAt: Date.now(),
    duration: 3000,
  },
];

jest.mock("../../core/store", () => ({
  useToastStore: jest.fn(),
}));

// Mock SafeAreaContext
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 20, left: 0, right: 0 }),
}));

// Mock Morph to avoid double rendering issues
jest.mock("../morph", () => {
  const { View } = require("react-native");
  return ({ header, children }: any) => (
    <View>
      {header}
      {children}
    </View>
  );
});

describe("Toaster", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (useToastStore as unknown as jest.Mock).mockReturnValue({
      toasts: mockToasts,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders toasts from store", () => {
    const { getByText } = render(<Toaster />);

    act(() => {
      jest.advanceTimersByTime(650);
    });

    expect(getByText("Toast 1")).toBeTruthy();
    expect(getByText("Description 1")).toBeTruthy();
    expect(getByText("Toast 2")).toBeTruthy();
    expect(getByText("Description 2")).toBeTruthy();
  });

  it("renders with correct position style (top-center)", () => {
    const { getByTestId } = render(
      <Toaster position="top-center" offset={10} />
    );
    const container = getByTestId("toaster-container-top-center");

    // Check if style contains top: 50 (40 + 10)
    // Note: React Native styles are flattened or objects.
    // We can inspect style prop.
    const style = container.props.style;
    // flatten style if array
    const flattenedStyle = Array.isArray(style)
      ? Object.assign({}, ...style)
      : style;

    expect(flattenedStyle.top).toBe(50); // insets.top(40) + offset(10)
    expect(flattenedStyle.alignItems).toBe("center");
  });

  it("renders with correct position style (bottom-right)", () => {
    const { getByTestId } = render(
      <Toaster position="bottom-right" offset={20} />
    );
    const container = getByTestId("toaster-container-bottom-right");
    const flattenedStyle = Array.isArray(container.props.style)
      ? Object.assign({}, ...container.props.style)
      : container.props.style;

    expect(flattenedStyle.bottom).toBe(40); // insets.bottom(20) + offset(20)
    expect(flattenedStyle.right).toBe(20); // offset(20)
    expect(flattenedStyle.alignItems).toBe("flex-end");
  });

  it("renders multiple stacks when toasts have different positions", () => {
    (useToastStore as unknown as jest.Mock).mockReturnValue({
      toasts: [
        { ...mockToasts[0], position: "top-left" },
        { ...mockToasts[1], position: "bottom-right" },
      ],
    });

    const { getByTestId } = render(<Toaster />);

    expect(getByTestId("toaster-container-top-left")).toBeTruthy();
    expect(getByTestId("toaster-container-bottom-right")).toBeTruthy();
  });
});
