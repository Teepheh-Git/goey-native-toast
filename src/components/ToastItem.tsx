import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  SlideInUp,
  SlideOutUp,
  SlideInDown,
  SlideOutDown,
  LinearTransition,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import type { ToastMessage, SwipeDirection } from "../types";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Loader,
} from "./icons/index";
import { toast } from "../core/store";

interface ToastItemProps {
  toast: ToastMessage;
  index: number;
  position: string;
  visibleToasts: number;
  offset: number;
  isExpanded: boolean;
  swipeToDismissDirection?: SwipeDirection;
  theme?: "light" | "dark" | "system";
  richColors?: boolean;
}

const TYPE_COLORS = {
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
};

const TYPE_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export const ToastItem: React.FC<ToastItemProps> = ({
  toast: item,
  index,
  position,
  visibleToasts,
  offset,
  isExpanded,
  richColors,
  swipeToDismissDirection = "up",
}) => {
  const isTop = position.includes("top");
  const translationY = useSharedValue(0);
  const translationX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  // Auto-dismiss logic
  useEffect(() => {
    if (item.duration !== Infinity && item.duration !== 0) {
      const timer = setTimeout(() => {
        toast.dismiss(item.id);
        item.onAutoClose?.();
      }, item.duration);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [item, item.id, item.duration, item.onAutoClose]);

  const handleDismiss = () => {
    toast.dismiss(item.id);
    item.onDismiss?.();
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((event) => {
      if (
        swipeToDismissDirection === "left" ||
        swipeToDismissDirection === "right"
      ) {
        translationX.value = event.translationX;
      } else {
        translationY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      isDragging.value = false;
      const DISMISS_THRESHOLD = 50;

      if (
        (swipeToDismissDirection === "up" &&
          event.translationY < -DISMISS_THRESHOLD) ||
        (swipeToDismissDirection === "down" &&
          event.translationY > DISMISS_THRESHOLD) ||
        (swipeToDismissDirection === "left" &&
          event.translationX < -DISMISS_THRESHOLD) ||
        (swipeToDismissDirection === "right" &&
          event.translationX > DISMISS_THRESHOLD)
      ) {
        runOnJS(handleDismiss)();
      } else {
        translationX.value = withSpring(0);
        translationY.value = withSpring(0);
      }
    });

  const Icon = item.icon
    ? () => item.icon
    : TYPE_ICONS[item.type as keyof typeof TYPE_ICONS];
  const iconColor = richColors
    ? "#FFF"
    : TYPE_COLORS[item.type as keyof typeof TYPE_COLORS];

  const animatedStyle = useAnimatedStyle(() => {
    // Stack effect logic
    const translateY = index * (isTop ? 1 : -1) * offset + translationY.value;
    const translateX = translationX.value;
    const scale = 1 - index * 0.05;
    const opacity = 1 - index * 0.1;

    return {
      transform: [
        { translateY: withSpring(translateY) },
        { translateX: withSpring(translateX) },
        { scale: withSpring(isExpanded ? 1 : scale) },
      ],
      opacity: withTiming(isExpanded ? 1 : opacity),
      zIndex: visibleToasts - index,
      // Add shadow for better depth perception in stack
      shadowOpacity: withTiming(index === 0 ? 0.1 : 0),
    };
  });

  const entering = isTop ? SlideInUp : SlideInDown;
  const exiting = isTop ? SlideOutUp : SlideOutDown;

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        layout={LinearTransition.springify()}
        entering={entering}
        exiting={exiting}
        style={[
          styles.container,
          richColors && {
            backgroundColor: TYPE_COLORS[item.type as keyof typeof TYPE_COLORS],
          },
          item.style,
          animatedStyle,
          // Hide toasts beyond visible limit
          index >= visibleToasts && styles.hidden,
        ]}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {/* @ts-ignore - Valid React Node */}
            {item.type === "loading" ? (
              <Loader color={richColors ? "#FFF" : "#000"} />
            ) : (
              <Icon color={iconColor} />
            )}
          </View>

          <View style={styles.textContainer}>
            {item.title && (
              <Text
                style={[
                  styles.title,
                  richColors && styles.richText,
                  item.textStyle,
                ]}
              >
                {item.title}
              </Text>
            )}
            {item.description && (
              <Text
                style={[
                  styles.description,
                  richColors && styles.richDescription,
                  item.descriptionStyle,
                ]}
              >
                {item.description}
              </Text>
            )}
          </View>

          {item.dismissible !== false && (
            <TouchableOpacity
              testID="toast-close-button"
              onPress={handleDismiss}
              style={styles.closeButton}
            >
              <X color={richColors ? "#FFF" : "#666"} width={16} height={16} />
            </TouchableOpacity>
          )}
        </View>

        {item.action && (
          <TouchableOpacity
            testID="toast-action-button"
            style={[styles.actionButton, richColors && styles.richActionButton]}
            onPress={item.action.onClick}
          >
            <Text
              style={[styles.actionText, richColors && styles.richActionText]}
            >
              {item.action.label}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "90%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  actionButton: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    padding: 12,
    alignItems: "center",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },
  hidden: {
    display: "none",
  },
  richText: {
    color: "#FFF",
  },
  richDescription: {
    color: "rgba(255,255,255,0.8)",
  },
  richActionButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  richActionText: {
    color: "#FFF",
  },
});
