import { renderHook, act, waitFor } from "@testing-library/react-native";
import { toast, useToastStore } from "../store";

describe("Toast Promise", () => {
  beforeEach(() => {
    act(() => {
      toast.dismiss();
    });
  });

  it("should create a loading toast", () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      toast.loading("Loading...");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]?.title).toBe("Loading...");
    expect(result.current.toasts[0]?.type).toBe("loading");
    expect(result.current.toasts[0]?.duration).toBe(Infinity);
  });

  it("should resolve promise and update toast to success", async () => {
    const { result } = renderHook(() => useToastStore());
    const promise = new Promise<string>((resolve) => {
      setTimeout(() => resolve("Data loaded"), 100);
    });

    await act(async () => {
      toast.promise(promise, {
        loading: "Loading data...",
        success: "Success!",
        error: "Error!",
      });
    });

    // Check loading state
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]?.type).toBe("loading");
    expect(result.current.toasts[0]?.title).toBe("Loading data...");

    // Wait for promise resolution
    await waitFor(() => {
      expect(result.current.toasts[0]?.type).toBe("success");
    });

    // Check success state
    expect(result.current.toasts[0]?.title).toBe("Success");
    expect(result.current.toasts[0]?.description).toBe("Success!"); // verify resolved string is in description?
    // Wait, in my implementation:
    // success: "Success!" -> passed as string
    // implementation: successMessage = data.success (string) -> "Success!"
    // updateToast -> description: successMessage -> "Success!"
    // title: "Success" (hardcoded)

    // Wait, if promise resolves with "Data loaded", and success is "Success!",
    // successMessage is "Success!".
    // If success was a function: (data) => `Loaded ${data}`, it would be "Loaded Data loaded".

    // Let's test function case too.
  });

  it("should use function for success message", async () => {
    const { result } = renderHook(() => useToastStore());
    const promise = Promise.resolve("User 123");

    await act(async () => {
      toast.promise(promise, {
        loading: "Creating user...",
        success: (data) => `User created: ${data}`,
        error: "Failed",
      });
    });

    await waitFor(() => {
      expect(result.current.toasts[0]?.type).toBe("success");
    });

    expect(result.current.toasts[0]?.title).toBe("Success");
    expect(result.current.toasts[0]?.description).toBe(
      "User created: User 123"
    );
  });

  it("should reject promise and update toast to error", async () => {
    const { result } = renderHook(() => useToastStore());
    const promise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Network error")), 100);
    });

    await act(async () => {
      toast.promise(promise, {
        loading: "Loading...",
        success: "Success",
        error: (err) => `Failed: ${err.message}`,
      });
    });

    await waitFor(() => {
      expect(result.current.toasts[0]?.type).toBe("error");
    });

    expect(result.current.toasts[0]?.title).toBe("Error");
    expect(result.current.toasts[0]?.description).toBe("Failed: Network error");
  });
});
