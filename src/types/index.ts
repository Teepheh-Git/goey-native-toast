import type { ReactNode } from "react";
import type { ViewStyle, TextStyle } from "react-native";

export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading"
  | "custom";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type SwipeDirection = "up" | "down" | "left" | "right";

export interface ToastConfig {
  duration?: number;
  position?: ToastPosition;
  icon?: ReactNode;
  iconColor?: string;
  backgroundColor?: string;
  theme?: "light" | "dark" | "system";
  solidColors?: boolean;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  description?: string;
  descriptionStyle?: TextStyle;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  onAutoClose?: () => void;
  autoDismiss?: boolean;
  dismissible?: boolean;
  expandWithSpring?: boolean;
  customBody?: ReactNode;
}

export interface ToastMessage extends ToastConfig {
  id: string;
  title?: string;
  type: ToastType;
  createdAt: number;
}

export interface ToasterProps {
  position?: ToastPosition;
  toastOptions?: Partial<ToastConfig>;
  reverseOrder?: boolean;
  gutter?: number;
  containerStyle?: ViewStyle;
  toastClassName?: string;
  icons?: Partial<Record<ToastType, ReactNode>>;
  theme?: "light" | "dark" | "system";
  solidColors?: boolean;
  closeButton?: boolean;
  offset?: number;
  dir?: "ltr" | "rtl" | "auto";
  hotkey?: string[];
  expand?: boolean;
  duration?: number;
  visibleToasts?: number;
  swipeToDismissDirection?: SwipeDirection;
  ToastWrapper?: React.ComponentType<{ children: ReactNode }>;
}
