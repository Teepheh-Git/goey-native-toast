import { render } from "@testing-library/react-native";
import { Toaster } from "../Toaster";
import { useToastStore } from "../../core/store";

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

describe("Toaster", () => {
  beforeEach(() => {
    (useToastStore as unknown as jest.Mock).mockReturnValue({
      toasts: mockToasts,
    });
  });

  it("renders toasts from store", () => {
    const { getByText } = render(<Toaster />);

    expect(getByText("Toast 1")).toBeTruthy();
    expect(getByText("Description 1")).toBeTruthy();
    expect(getByText("Toast 2")).toBeTruthy();
    expect(getByText("Description 2")).toBeTruthy();
  });

  it("renders with correct position style (top-center)", () => {
    const { getByTestId } = render(
      <Toaster position="top-center" offset={10} />
    );
    const container = getByTestId("toaster-container");

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
    const container = getByTestId("toaster-container");
    const flattenedStyle = Array.isArray(container.props.style)
      ? Object.assign({}, ...container.props.style)
      : container.props.style;

    expect(flattenedStyle.bottom).toBe(40); // insets.bottom(20) + offset(20)
    expect(flattenedStyle.right).toBe(20); // offset(20)
    expect(flattenedStyle.alignItems).toBe("flex-end");
  });
});
