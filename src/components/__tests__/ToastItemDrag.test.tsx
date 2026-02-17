import { render } from "@testing-library/react-native";
import { ToastItem } from "../ToastItem";
import { Gesture } from "react-native-gesture-handler";
import * as Reanimated from "react-native-reanimated";
import * as ReactNative from "react-native";

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  const ReanimatedMock = {
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
    ...ReanimatedMock,
    default: ReanimatedMock,
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

jest.mock("../morph", () => {
  const { View } = require("react-native");
  return ({ header, children }: any) => (
    <View>
      {header}
      {children}
    </View>
  );
});

describe("ToastItem Drag Constraints", () => {
  const mockToast = {
    id: "1",
    type: "success" as const,
    title: "Test Toast",
    createdAt: Date.now(),
  };

  const defaultProps = {
    index: 0,
    position: "top-center",
    visibleToasts: 3,
    offset: 0,
    isExpanded: false,
    solidColors: false,
    swipeToDismissDirection: "up" as const,
  };

  let capturedOnUpdate: (e: any) => void;
  let sharedValues: any[] = [];

  beforeAll(() => {
    // Mock useWindowDimensions
    jest
      .spyOn(ReactNative, "useWindowDimensions")
      .mockReturnValue({ height: 1000, width: 500, scale: 1, fontScale: 1 });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    sharedValues = [];

    // Capture shared values
    (Reanimated.useSharedValue as jest.Mock).mockImplementation((init) => {
      const sv = { value: init };
      sharedValues.push(sv);
      return sv as any;
    });

    // Capture Gesture.Pan
    const mockGesture = {
      enabled: jest.fn().mockReturnThis(),
      onUpdate: jest.fn((cb) => {
        capturedOnUpdate = cb;
        return {
          onEnd: jest.fn().mockReturnThis(),
          runOnJS: jest.fn().mockReturnThis(),
        };
      }),
    };
    jest.spyOn(Gesture, "Pan").mockReturnValue(mockGesture as any);
  });

  it("clamps dragging DOWN for TOP toast (limit 10% of 1334 = 133.4)", () => {
    render(
      <ToastItem toast={mockToast} {...defaultProps} position="top-center" />
    );

    const translationY = sharedValues[0]; // First sharedValue is translationY

    // Drag down 50 (within limit)
    capturedOnUpdate({ translationY: 50 });
    expect(translationY.value).toBe(50);

    // Drag down 150 (exceeds limit 133.4)
    capturedOnUpdate({ translationY: 150 });
    expect(translationY.value).toBe(133.4); // Clamped
  });

  it("allows dragging UP for TOP toast (dismiss direction)", () => {
    render(
      <ToastItem toast={mockToast} {...defaultProps} position="top-center" />
    );

    const translationY = sharedValues[0];

    // Drag up 150
    capturedOnUpdate({ translationY: -150 });
    expect(translationY.value).toBe(-150); // Not clamped
  });

  it("clamps dragging UP for BOTTOM toast (limit 10% of 1334 = 133.4)", () => {
    render(
      <ToastItem
        toast={mockToast}
        {...defaultProps}
        position="bottom-center"
        swipeToDismissDirection="down"
      />
    );

    const translationY = sharedValues[0];

    // Drag up -50 (within limit)
    capturedOnUpdate({ translationY: -50 });
    expect(translationY.value).toBe(-50);

    // Drag up -150 (exceeds limit 133.4)
    capturedOnUpdate({ translationY: -150 });
    expect(translationY.value).toBe(-133.4); // Clamped
  });

  it("allows dragging DOWN for BOTTOM toast (dismiss direction)", () => {
    render(
      <ToastItem
        toast={mockToast}
        {...defaultProps}
        position="bottom-center"
        swipeToDismissDirection="down"
      />
    );

    const translationY = sharedValues[0];

    // Drag down 150
    capturedOnUpdate({ translationY: 150 });
    expect(translationY.value).toBe(150); // Not clamped
  });
});
