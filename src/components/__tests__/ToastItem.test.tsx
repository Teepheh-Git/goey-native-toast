import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { ToastItem } from "../ToastItem";

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

jest.mock("../icons/index", () => ({
  CheckCircle: () => "CheckCircle",
  AlertCircle: () => "AlertCircle",
  AlertTriangle: () => "AlertTriangle",
  Info: () => "Info",
  Loader: () => "Loader",
  X: () => "X",
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

const mockToast = {
  id: "test-id",
  title: "Test Toast",
  description: "This is a test toast",
  type: "success" as const,
  createdAt: Date.now(),
  duration: 3000,
};

describe("ToastItem", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders title immediately but description after delay", async () => {
    const { getByText, queryByText } = render(
      <ToastItem
        toast={mockToast}
        index={0}
        position="top-center"
        visibleToasts={3}
        offset={10}
        isExpanded={false}
      />
    );

    expect(getByText("Test Toast")).toBeTruthy();
    // Description should be hidden initially (100ms delay)
    expect(queryByText("This is a test toast")).toBeNull();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(650);
    });

    await waitFor(() => {
      expect(getByText("This is a test toast")).toBeTruthy();
    });
  });

  it("calls action onClick when action button is pressed", () => {
    const onClick = jest.fn();
    const { getByText, getByTestId } = render(
      <ToastItem
        toast={{
          ...mockToast,
          action: { label: "Retry", onClick },
        }}
        index={0}
        position="top-center"
        visibleToasts={3}
        offset={10}
        isExpanded={false}
      />
    );

    act(() => {
      jest.advanceTimersByTime(650);
    });

    expect(getByText("Retry")).toBeTruthy();
    fireEvent.press(getByTestId("toast-action-button"));
    expect(onClick).toHaveBeenCalled();
  });
});
