import { render, fireEvent } from "@testing-library/react-native";
import { ToastItem } from "../ToastItem";

const mockToast = {
  id: "test-id",
  title: "Test Toast",
  description: "This is a test toast",
  type: "success" as const,
  createdAt: Date.now(),
  duration: 3000,
};

describe("ToastItem", () => {
  it("renders correctly", () => {
    const { getByText } = render(
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
    expect(getByText("This is a test toast")).toBeTruthy();
  });

  it("calls onDismiss when close button is pressed", () => {
    const onDismiss = jest.fn();
    const { getByTestId } = render(
      <ToastItem
        toast={{ ...mockToast, onDismiss }}
        index={0}
        position="top-center"
        visibleToasts={3}
        offset={10}
        isExpanded={false}
      />
    );

    fireEvent.press(getByTestId("toast-close-button"));
    expect(onDismiss).toHaveBeenCalled();
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

    expect(getByText("Retry")).toBeTruthy();
    fireEvent.press(getByTestId("toast-action-button"));
    expect(onClick).toHaveBeenCalled();
  });
});
