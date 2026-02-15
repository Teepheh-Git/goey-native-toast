import React, { useMemo } from "react";
import { StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useAnimatedKeyboard } from "react-native-keyboard-controller";
import type { ToasterProps } from "../types";
import { useToastStore } from "../core/store";
import { ToastItem } from "./ToastItem";

export const Toaster: React.FC<ToasterProps> = ({
  position = "top-center",
  toastOptions,
  gutter = 8,
  containerStyle,
  theme = "light",
  richColors,
  offset = 16,
  visibleToasts = 3,
  swipeToDismissDirection,
}) => {
  const { toasts } = useToastStore();
  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();

  // Group toasts by position if we want to support multiple stacks (future)
  // For now, assume global position from props
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
      transform: [{ translateY: isBottom ? -keyboard.height.value : 0 }],
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
      testID="toaster-container"
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
          richColors={richColors || toast.richColors}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 9999,
    width: "100%",
  },
});
