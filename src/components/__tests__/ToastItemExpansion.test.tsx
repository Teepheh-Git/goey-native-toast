import { render, act } from "@testing-library/react-native";
import { ToastItem } from "../ToastItem";
import { withSpring, withTiming } from "react-native-reanimated";

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

// Mock dependencies
jest.mock("../../core/store", () => ({
  toast: {
    dismiss: jest.fn(),
  },
}));

jest.mock("../icons/index", () => ({
  CheckCircle: () => "CheckCircle",
  AlertCircle: () => "AlertCircle",
  AlertTriangle: () => "AlertTriangle",
  Info: () => "Info",
  Loader: () => "Loader",
  X: () => "X",
}));

// Mock Morph to avoid double rendering issues in this test
jest.mock("../morph", () => {
  const { View } = require("react-native");
  const { useEffect } = require("react");
  return ({ header, children, onBodyLayout }: any) => {
    useEffect(() => {
      if (children) {
        onBodyLayout?.();
      }
    }, [children, onBodyLayout]);
    return (
      <View>
        {header}
        {children}
      </View>
    );
  };
});

describe("ToastItem Spring Configuration", () => {
  const mockToast = {
    id: "1",
    type: "success" as const,
    title: "Test Toast",
    description: "Description",
    createdAt: Date.now(),
  };

  const defaultProps = {
    index: 0,
    position: "top-center",
    visibleToasts: 3,
    offset: 0,
    isExpanded: false,
    solidColors: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("uses withSpring by default (expandWithSpring undefined)", () => {
    render(<ToastItem toast={mockToast} {...defaultProps} />);

    // Fast-forward time to trigger expansion (100ms delay)
    act(() => {
      jest.advanceTimersByTime(650);
    });

    expect(withSpring).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        damping: 12,
        stiffness: 250,
        mass: 0.8,
      })
    );
  });

  it("uses withSpring when expandWithSpring is true", () => {
    render(
      <ToastItem
        toast={{ ...mockToast, expandWithSpring: true }}
        {...defaultProps}
      />
    );

    act(() => {
      jest.advanceTimersByTime(650);
    });

    expect(withSpring).toHaveBeenCalled();
  });

  it("uses withTiming when expandWithSpring is false", () => {
    render(
      <ToastItem
        toast={{ ...mockToast, expandWithSpring: false }}
        {...defaultProps}
      />
    );

    act(() => {
      jest.advanceTimersByTime(650);
    });

    expect(withTiming).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        duration: 300,
      })
    );

    // Should not use spring for expansion (damping 12 is specific to expansion)
    expect(withSpring).not.toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        damping: 12,
      })
    );
  });
});
