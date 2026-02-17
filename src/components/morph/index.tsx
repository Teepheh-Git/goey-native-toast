import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  type SharedValue,
  Extrapolation,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import {
  getCenterMorphPath,
  getLeftMorphPath,
  getRightMorphPath,
} from "./geometry";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const SCREEN_WIDTH = Dimensions.get("window").width;

const GEO_EXTRAPOLATE = {
  extrapolateLeft: Extrapolation.CLAMP,
  extrapolateRight: Extrapolation.EXTEND,
};

export type MorphAlignment = "left" | "center" | "right";

export interface MorphProps {
  header: React.ReactNode;
  children: React.ReactNode;
  progress: SharedValue<number>;
  maxWidth?: number;
  alignment?: MorphAlignment;
  fill?: string;
  style?: ViewStyle;
  onReady?: () => void;
  onBodyLayout?: (layout: { width: number; height: number }) => void;
}

export default React.memo(function Morph({
  header,
  children,
  progress,
  maxWidth = SCREEN_WIDTH * 0.9,
  alignment = "center",
  fill = "#FFFFFF",
  style,
  onReady,
  onBodyLayout,
}: MorphProps) {
  const [pillDims, setPillDims] = useState({ width: 0, height: 0 });
  const [bodyDims, setBodyDims] = useState({ width: 0, height: 0 });

  // Geometric Constants
  const R = 22; // Corner Radius (ToastItem default)
  const PADDING_H = 12; // Horizontal Padding
  const PADDING_V = 1; // Vertical Padding
  const MIN_PILL_H = 40; // Minimum height for pill

  // Derived Dimensions
  const pillW = Math.ceil(
    Math.max(MIN_PILL_H, (pillDims.width || 100) + PADDING_H * 2)
  );
  const pillH = Math.ceil(
    Math.max(MIN_PILL_H, (pillDims.height || 20) + PADDING_V * 2)
  );

  const bodyContentW = Math.ceil(
    Math.max(pillW, (bodyDims.width || 200) + PADDING_H * 2)
  );
  const bodyContentH = Math.ceil(
    Math.max(20, (bodyDims.height || 20) + PADDING_V * 2)
  );

  const totalBodyW = bodyContentW;
  const totalBodyH = pillH + bodyContentH;

  const isReady = pillDims.width > 0;

  React.useEffect(() => {
    if (isReady && onReady) {
      onReady();
    }
  }, [isReady, onReady]);

  React.useEffect(() => {
    if (bodyDims.width > 0 && onBodyLayout) {
      // Trigger update on next frame to ensure layout is committed
      requestAnimationFrame(() => {
        onBodyLayout({ width: bodyContentW, height: bodyContentH });
      });
    }
  }, [bodyDims, onBodyLayout, bodyContentW, bodyContentH]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        progress.value,
        [0, 1],
        [pillW, totalBodyW],
        GEO_EXTRAPOLATE
      ),
      height: interpolate(
        progress.value,
        [0, 1],
        [pillH, totalBodyH],
        GEO_EXTRAPOLATE
      ),
      // Fix for center alignment jitter
      transform:
        alignment === "center"
          ? [
              {
                translateX: interpolate(
                  progress.value,
                  [0, 1],
                  [(totalBodyW - pillW) / 2, 0],
                  GEO_EXTRAPOLATE
                ),
              },
            ]
          : undefined,
    };
  });

  // Alignment Calculation
  let pillLeft = 0;

  if (alignment === "center") {
    pillLeft = (totalBodyW - pillW) / 2;
  } else if (alignment === "right") {
    pillLeft = totalBodyW - pillW;
  }
  // else 'left' -> pillLeft = 0

  const innerContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [-pillLeft, 0],
            GEO_EXTRAPOLATE
          ),
        },
      ],
      width: totalBodyW,
      height: totalBodyH,
      minWidth: pillW,
      minHeight: pillH,
    };
  });

  const pillRight = pillLeft + pillW;
  const pillTop = 0;
  const pillBottom = pillH;

  const bodyLeft = 0;
  const bodyRight = totalBodyW;

  const animatedProps = useAnimatedProps(() => {
    const t = progress.value;
    let d = "";

    const params = {
      t,
      pillLeft,
      pillRight,
      pillTop,
      pillBottom,
      bodyLeft,
      bodyRight,
      totalBodyH,
      R,
    };

    if (alignment === "left") {
      d = getLeftMorphPath(params);
    } else if (alignment === "right") {
      d = getRightMorphPath(params);
    } else {
      d = getCenterMorphPath({ ...params, pillH });
    }

    return { d };
  });

  const bodyStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        progress.value,
        [0.5, 1],
        [0, 1],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [-20, 0],
            GEO_EXTRAPOLATE
          ),
        },
      ],
    };
  });

  return (
    <View
      style={[
        style,
        {
          alignItems: "center",
          justifyContent: "center",
          opacity: isReady ? 1 : 0,
          ...Platform.select({
            ios: {
              shadowColor: "#00000070",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.15,
              shadowRadius: 3.84,
            },
            android: {
              filter: [
                {
                  dropShadow: {
                    offsetX: 0,
                    offsetY: 0,
                    standardDeviation: "2px",
                    color: "#00000030",
                  },
                },
              ],
              // elevation: 8, // Handled by parent container if needed, or rely on SVG
            },
          }),
        },
      ]}
    >
      <Animated.View style={[{ overflow: "hidden" }, containerAnimatedStyle]}>
        <Animated.View
          renderToHardwareTextureAndroid={true}
          style={innerContainerStyle}
        >
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <AnimatedPath fill={fill} animatedProps={animatedProps} />
          </Svg>

          <View
            style={{
              position: "absolute",
              left: pillLeft,
              width: pillW,
              height: pillH,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            {header}
          </View>

          <Animated.View
            style={[
              bodyStyle,
              {
                position: "absolute",
                top: pillH,
                width: totalBodyW,
                height: bodyContentH,
                paddingHorizontal: 5,
                zIndex: 1,
                marginTop: PADDING_V,
              },
            ]}
          >
            {children}
          </Animated.View>
        </Animated.View>
      </Animated.View>

      <View style={styles.measureContainer} pointerEvents="none">
        <View onLayout={(e) => setPillDims(e.nativeEvent.layout)}>
          {header}
        </View>
        <View
          style={{ maxWidth: maxWidth - PADDING_H * 2 }}
          onLayout={(e) => {
            setBodyDims(e.nativeEvent.layout);
            onBodyLayout?.(e.nativeEvent.layout);
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  measureContainer: {
    position: "absolute",
    opacity: 0,
    top: -1000,
    width: SCREEN_WIDTH,
    left: -SCREEN_WIDTH / 2,
    alignItems: "center",
  },
});
