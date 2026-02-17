import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  SlideOutDown,
  SlideOutUp,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";
import { toast } from "../core/store";
import type { SwipeDirection, ToastMessage } from "../types";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader,
} from "./icons/index";
import Morph, { type MorphAlignment } from "./morph";

interface ToastItemProps {
  toast: ToastMessage;
  index: number;
  position: string;
  visibleToasts: number;
  offset: number;
  isExpanded: boolean;
  swipeToDismissDirection?: SwipeDirection;
  theme?: "light" | "dark" | "system";
  solidColors?: boolean;
}

const TYPE_COLORS = {
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  loading: "#6B7280",
  custom: "#3B82F6",
};

const TYPE_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader,
  custom: Info,
};

export const ToastItem: React.FC<ToastItemProps> = ({
  toast: item,
  index,
  position,
  visibleToasts,
  offset,
  isExpanded,
  solidColors,
  swipeToDismissDirection = "up",
  theme = "light",
}) => {
  const isTop = position.includes("top");
  const { height: screenHeight } = useWindowDimensions();
  const DRAG_LIMIT = screenHeight * 0.1;
  const translationY = useSharedValue(0);
  const translationX = useSharedValue(0);
  const initialOffset = useSharedValue(isTop ? -300 : 300); // Start off-screen vertically
  const [isReady, setIsReady] = useState(false);
  const spin = useSharedValue(0);

  useEffect(() => {
    if (item.type === "loading") {
      spin.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1
      );
    } else {
      cancelAnimation(spin);
      spin.value = 0;
    }
  }, [item.type, spin]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${spin.value}deg` }],
    };
  });

  // 0 = Pill, 1 = Expanded
  const expansionProgress = useSharedValue(0);
  const [showDescription, setShowDescription] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Expansion Logic
  const needsExpansionRef = React.useRef(false);

  useEffect(() => {
    if (!item.description && !item.action && !item.customBody) return;

    // Delay expansion by 100ms after entry
    const timer = setTimeout(() => {
      needsExpansionRef.current = true;
      setShowDescription(true);
    }, 600); // 100ms delay as per spec

    return () => clearTimeout(timer);
  }, [item.description, item.action, item.customBody]);

  const handleBodyLayout = useCallback(() => {
    if (needsExpansionRef.current) {
      needsExpansionRef.current = false;
      if (item.expandWithSpring === false) {
        expansionProgress.value = withTiming(1, {
          duration: 300,
        });
      } else {
        expansionProgress.value = withSpring(1, {
          damping: 12,
          stiffness: 250,
          mass: 0.8,
        });
      }
    }
  }, [expansionProgress, item.expandWithSpring]);

  const handleDelayDismiss = useCallback(() => {
    setTimeout(() => {
      toast.dismiss(item.id);
      item.onDismiss?.();
    }, 600);
  }, [item]);

  const handleDismiss = useCallback(
    (forceImmediate = false) => {
      if (isExiting) return;

      if (
        forceImmediate ||
        (!item.description && !item.action && !item.customBody)
      ) {
        toast.dismiss(item.id);
        item.onDismiss?.();
        return;
      }

      setIsExiting(true);

      // Collapse first (Morph back to Pill)
      setShowDescription(false);
      expansionProgress.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(handleDelayDismiss)();
        }
      });
    },
    [item, isExiting, expansionProgress, handleDelayDismiss]
  );

  // Auto-dismiss logic
  useEffect(() => {
    if (item.autoDismiss && item.duration !== Infinity && item.duration !== 0) {
      const timer = setTimeout(() => {
        handleDismiss(false);
        item.onAutoClose?.();
      }, item.duration);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [item, item.duration, item.onAutoClose, handleDismiss, item.autoDismiss]);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(item.dismissible !== false)
        .onUpdate((event) => {
          if (
            swipeToDismissDirection === "left" ||
            swipeToDismissDirection === "right"
          ) {
            translationX.value = event.translationX;
          } else {
            if (isTop) {
              // Allow dragging up (negative) to dismiss, but limit dragging down (positive)
              translationY.value = Math.min(event.translationY, DRAG_LIMIT);
            } else {
              // Allow dragging down (positive) to dismiss, but limit dragging up (negative)
              translationY.value = Math.max(event.translationY, -DRAG_LIMIT);
            }
          }
        })
        .onEnd((event) => {
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
            runOnJS(handleDismiss)(true);
          } else {
            translationX.value = withSpring(0);
            translationY.value = withSpring(0);
          }
        }),
    [
      DRAG_LIMIT,
      handleDismiss,
      isTop,
      swipeToDismissDirection,
      translationX,
      translationY,
      item.dismissible,
    ]
  );

  const Icon = useMemo(
    () =>
      item.icon
        ? () => item.icon
        : TYPE_ICONS[item.type as keyof typeof TYPE_ICONS],
    [item.icon, item.type]
  );
  const iconColor = item.iconColor
    ? item.iconColor
    : solidColors
    ? "#FFF"
    : TYPE_COLORS[item.type as keyof typeof TYPE_COLORS];

  const animatedStyle = useAnimatedStyle(() => {
    // Stack effect logic
    const translateY =
      index * (isTop ? 1 : -1) * offset +
      translationY.value +
      initialOffset.value;
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

  const exiting = isTop ? SlideOutUp : SlideOutDown;

  const alignment: MorphAlignment = (() => {
    if (position.includes("left")) return "left";
    if (position.includes("right")) return "right";
    return "center";
  })();

  // const alignSelf = (() => {
  //   if (alignment === "right") return "flex-end";
  //   if (alignment === "center") return "center";
  //   return "flex-start";
  // })();

  const isDark = theme === "dark";

  const backgroundColor = item.backgroundColor
    ? item.backgroundColor
    : solidColors
    ? TYPE_COLORS[item.type as keyof typeof TYPE_COLORS]
    : isDark
    ? "#1F2937"
    : "white";

  const header = useMemo(
    () => (
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          {/* @ts-ignore - Valid React Node */}
          {item.type === "loading" ? (
            <Animated.View style={animatedIconStyle}>
              <Loader color={iconColor} />
            </Animated.View>
          ) : (
            <Icon color={iconColor} />
          )}
        </View>

        <View style={styles.textContainer}>
          {item.title && (
            <Text
              textBreakStrategy="simple"
              android_hyphenationFrequency="none"
              style={[
                styles.title,
                isDark && styles.darkText,
                solidColors && styles.solidText,
                item.textStyle,
                Platform.select({ android: { includeFontPadding: false } }),
              ]}
            >
              {item.title}
            </Text>
          )}
        </View>

        {/* Close button removed */}
      </View>
    ),
    [
      item.type,
      item.title,
      item.textStyle,
      solidColors,
      iconColor,
      isDark,
      animatedIconStyle,
      Icon,
    ]
  );

  const childrenContent = useMemo(() => {
    if (!showDescription) return null;

    if (item.customBody) {
      return <View style={styles.bodyContent}>{item.customBody}</View>;
    }

    if (item.description || item.action) {
      return (
        <View style={styles.bodyContent}>
          {item.description && (
            <Text
              textBreakStrategy="simple"
              android_hyphenationFrequency="none"
              style={[
                styles.description,
                isDark && styles.darkDescription,
                solidColors && styles.solidDescription,
                item.descriptionStyle,
                Platform.select({ android: { includeFontPadding: false } }),
              ]}
            >
              {item.description}
            </Text>
          )}
          {item.action && (
            <TouchableOpacity
              testID="toast-action-button"
              style={[
                styles.actionButton,
                isDark && styles.darkActionButton,
                solidColors && styles.solidActionButton,
              ]}
              onPress={item.action.onClick}
            >
              <Text
                textBreakStrategy="simple"
                android_hyphenationFrequency="none"
                style={[
                  styles.actionText,
                  isDark && styles.darkActionText,
                  solidColors && styles.solidActionText,
                  Platform.select({ android: { includeFontPadding: false } }),
                ]}
              >
                {item.action.label}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return null;
  }, [
    item.description,
    item.action,
    item.customBody,
    item.descriptionStyle,
    showDescription,
    solidColors,
    isDark,
  ]);

  const handleMorphReady = useCallback(() => {
    if (!isReady) {
      setIsReady(true);
      initialOffset.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [isReady, initialOffset]);

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        // layout={LinearTransition.duration(100)}
        // entering={entering}
        exiting={exiting}
        style={[
          styles.container,
          isTop ? { top: 0 } : { bottom: 0 },
          item.style,
          animatedStyle,
          // Hide toasts beyond visible limit
          index >= visibleToasts && styles.hidden,
          // Hide until ready to prevent FOUC
          !isReady && { opacity: 0 },
        ]}
      >
        <Morph
          header={header}
          children={childrenContent}
          progress={expansionProgress}
          alignment={alignment}
          fill={backgroundColor}
          // style={{ alignSelf }}
          onReady={handleMorphReady}
          onBodyLayout={handleBodyLayout}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bodyContent: {
    padding: 10,
    // backgroundColor: "cyan",
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {},
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    marginBottom: 8,
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
  solidText: {
    color: "#FFF",
  },
  solidDescription: {
    color: "rgba(255,255,255,0.8)",
  },
  solidActionButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  solidActionText: {
    color: "#FFF",
  },
  darkText: {
    color: "#F9FAFB",
  },
  darkDescription: {
    color: "#D1D5DB",
  },
  darkActionButton: {
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  darkActionText: {
    color: "#F9FAFB",
  },
});
