import { renderHook, act } from "@testing-library/react-native";
import { toast, useToastStore } from "../store";

describe("Toast Store", () => {
  beforeEach(() => {
    // Clear toasts before each test
    act(() => {
      toast.dismiss();
    });
  });

  it("should add a success toast", () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      toast.success("Success message");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]?.title).toBe("Success message");
    expect(result.current.toasts[0]?.type).toBe("success");
  });

  it("should add an error toast", () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      toast.error("Error message");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]?.type).toBe("error");
  });

  it("should dismiss a specific toast", () => {
    const { result } = renderHook(() => useToastStore());

    let id: string = "";
    act(() => {
      // @ts-ignore
      id = toast.success("To be deleted") as unknown as string; // toast.success returns void in current impl, need to fix impl to return id
      toast.success("Keep this one");
    });

    expect(result.current.toasts).toHaveLength(2);

    act(() => {
      // @ts-ignore
      toast.dismiss(id);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]?.title).toBe("Keep this one");
  });

  it("should dismiss all toasts", () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      toast.success("One");
      toast.error("Two");
    });

    expect(result.current.toasts).toHaveLength(2);

    act(() => {
      toast.dismiss();
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});
