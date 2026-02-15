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
    ...config,
  };

  memoryToasts = [...memoryToasts, newToast];
  notifyListeners();
  return id;
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
    addToast(message, "info", config),
  dismiss: (id?: string) => {
    if (id) {
      memoryToasts = memoryToasts.filter((t) => t.id !== id);
    } else {
      memoryToasts = [];
    }
    notifyListeners();
  },
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
