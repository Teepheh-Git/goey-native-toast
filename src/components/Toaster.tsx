import React, { useMemo } from "react";
import { StyleSheet, Platform } from "react-native";
import {
  useSafeAreaInsets,
  type EdgeInsets,
} from "react-native-safe-area-context";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useKeyboardAnimation } from "../core/keyboard";
import type { ToasterProps, ToastMessage, ToastPosition } from "../types";
import { useToastStore } from "../core/store";
import { ToastItem } from "./ToastItem";

interface ToastStackProps extends Omit<ToasterProps, "position"> {
  position: ToastPosition;
  toasts: ToastMessage[];
  insets: EdgeInsets;
}

const ToastStack: React.FC<ToastStackProps> = ({
  position,
  toasts,
  insets,
  offset = 16,
  gutter = 8,
  containerStyle,
  visibleToasts = 3,
  swipeToDismissDirection,
  theme,
  solidColors,
  toastOptions,
}) => {
  const { height } = useKeyboardAnimation();

  const positionStyle = useMemo(() => {
    const [vertical, horizontal] = position.split("-");
    const isBottom = vertical === "bottom";

    return {
      top: vertical === "top" ? insets.top + offset : undefined,
      bottom: isBottom ? insets.bottom + offset : undefined,
      left:
        horizontal === "left"
          ? offset
          : horizontal === "center"
          ? 0
          : undefined,
      right:
        horizontal === "right"
          ? offset
          : horizontal === "center"
          ? 0
          : undefined,
      alignItems:
        horizontal === "center"
          ? "center"
          : horizontal === "left"
          ? "flex-start"
          : "flex-end",
    } as const;
  }, [position, insets, offset]);

  const keyboardStyle = useAnimatedStyle(() => {
    // On Android with adjustResize (default), the window shrinks, so bottom-positioned views move up automatically.
    // Animating them would cause a double adjustment.
    // On iOS, the window size doesn't change, so we must manually adjust.
    if (Platform.OS === "android") {
      return { transform: [] };
    }

    const isBottom = position.startsWith("bottom");
    return {
      transform: [{ translateY: isBottom ? -height.value : 0 }],
    };
  });

  // Sort toasts based on position and reverseOrder
  const sortedToasts = useMemo(() => {
    // Create a copy to avoid mutating store
    const items = [...toasts];
    return items.reverse();
  }, [toasts]);

  return (
    <Animated.View
      testID={`toaster-container-${position}`}
      style={[styles.container, positionStyle, containerStyle, keyboardStyle]}
      pointerEvents="box-none"
    >
      {sortedToasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={{ ...toastOptions, ...toast }}
          index={index}
          position={position}
          visibleToasts={visibleToasts}
          offset={gutter + ((toast.style?.height as number) || 60)} // Approximate height if not measured
          isExpanded={false}
          swipeToDismissDirection={swipeToDismissDirection}
          theme={theme}
          solidColors={solidColors || toast.solidColors}
        />
      ))}
    </Animated.View>
  );
};

export const Toaster: React.FC<ToasterProps> = ({
  position = "top-center",
  ...props
}) => {
  const { toasts } = useToastStore();
  const insets = useSafeAreaInsets();

  const toastsByPosition = useMemo(() => {
    const groups = new Map<ToastPosition, ToastMessage[]>();

    toasts.forEach((t) => {
      const pos = t.position || position;
      if (!groups.has(pos)) {
        groups.set(pos, []);
      }
      groups.get(pos)!.push(t);
    });

    return Array.from(groups.entries());
  }, [toasts, position]);

  return (
    <>
      {toastsByPosition.map(([pos, groupToasts]) => (
        <ToastStack
          key={pos}
          position={pos}
          toasts={groupToasts}
          insets={insets}
          {...props}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 9999,
    width: "100%",
  },
});
