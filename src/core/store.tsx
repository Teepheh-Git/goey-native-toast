import { useState, useEffect } from "react";
import type { ToastMessage, ToastConfig, ToastType } from "../types";

let listeners: Array<(toasts: ToastMessage[]) => void> = [];
let memoryToasts: ToastMessage[] = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener(memoryToasts));
};

const addToast = (
  message: string,
  type: ToastType,
  config?: Partial<ToastConfig>
) => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastMessage = {
    id,
    title: message,
    type,
    createdAt: Date.now(),
    duration: 3000,
    autoDismiss: type !== "custom",
    ...config,
  };

  memoryToasts = [...memoryToasts, newToast];
  notifyListeners();
  return id;
};

const updateToast = (id: string, updates: Partial<ToastMessage>) => {
  memoryToasts = memoryToasts.map((t) =>
    t.id === id ? { ...t, ...updates } : t
  );
  notifyListeners();
};

export const toast = {
  success: (message: string, config?: Partial<ToastConfig>) =>
    addToast(message, "success", config),
  error: (message: string, config?: Partial<ToastConfig>) =>
    addToast(message, "error", config),
  warning: (message: string, config?: Partial<ToastConfig>) =>
    addToast(message, "warning", config),
  info: (message: string, config?: Partial<ToastConfig>) =>
    addToast(message, "info", config),
  custom: (message: string, config?: Partial<ToastConfig>) =>
    addToast(message, "custom", config),
  loading: (message: string, config?: Partial<ToastConfig>) =>
    addToast(message, "loading", { ...config, duration: Infinity }),
  promise: <T,>(
    promise: Promise<T>,
    data: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    config?: Partial<ToastConfig>
  ) => {
    const id = toast.loading(data.loading, { ...config, duration: Infinity });

    promise
      .then((response) => {
        const successMessage =
          typeof data.success === "function"
            ? data.success(response)
            : data.success;

        updateToast(id, {
          type: "success",
          title: "Success",
          description: successMessage,
          duration: 3000,
        });
      })
      .catch((error) => {
        const errorMessage =
          typeof data.error === "function" ? data.error(error) : data.error;

        updateToast(id, {
          type: "error",
          title: "Error",
          description: errorMessage,
          duration: 3000,
        });
      });

    return id;
  },
  dismiss: (id?: string) => {
    if (id) {
      memoryToasts = memoryToasts.filter((t) => t.id !== id);
    } else {
      memoryToasts = [];
    }
    notifyListeners();
  },
  update: (id: string, updates: Partial<ToastMessage>) =>
    updateToast(id, updates),
};

export const useToastStore = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>(memoryToasts);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  return { toasts };
};
