import { interpolate, Extrapolation } from "react-native-reanimated";

const GEO_EXTRAPOLATE = {
  extrapolateLeft: Extrapolation.CLAMP,
  extrapolateRight: Extrapolation.EXTEND,
};

export interface GeometryParams {
  t: number;
  pillLeft: number;
  pillRight: number;
  pillTop: number;
  pillBottom: number;
  bodyLeft: number;
  bodyRight: number;
  totalBodyH: number;
  R: number;
}

export const getLeftMorphPath = ({
  t,
  pillLeft,
  pillRight,
  pillTop,
  pillBottom,
  bodyLeft,
  bodyRight,
  totalBodyH,
  R,
}: GeometryParams) => {
  "worklet";
  // --- LEFT MORPH GEOMETRY ---
  const filletEndX = interpolate(
    t,
    [0, 1],
    [pillRight - R, pillRight + R],
    GEO_EXTRAPOLATE
  );
  const shoulderEndX = interpolate(
    t,
    [0, 1],
    [pillLeft + R, bodyRight - R],
    GEO_EXTRAPOLATE
  );

  const c2_cx = interpolate(t, [0, 1], [pillLeft, bodyRight], GEO_EXTRAPOLATE); // Control X
  const c2_ex = interpolate(t, [0, 1], [pillLeft, bodyRight], GEO_EXTRAPOLATE); // End X
  const c2_ey = interpolate(
    t,
    [0, 1],
    [pillBottom - R, pillBottom + R],
    GEO_EXTRAPOLATE
  ); // End Y

  const rightWallY = interpolate(
    t,
    [0, 1],
    [pillBottom - R, totalBodyH - R],
    GEO_EXTRAPOLATE
  );

  const br_cx = interpolate(t, [0, 1], [pillLeft, bodyRight], GEO_EXTRAPOLATE);
  const br_cy = interpolate(
    t,
    [0, 1],
    [pillBottom - R, totalBodyH],
    GEO_EXTRAPOLATE
  );
  const br_ex = interpolate(
    t,
    [0, 1],
    [pillLeft, bodyRight - R],
    GEO_EXTRAPOLATE
  );
  const br_ey = interpolate(
    t,
    [0, 1],
    [pillBottom - R, totalBodyH],
    GEO_EXTRAPOLATE
  );

  const bottomWallX = interpolate(
    t,
    [0, 1],
    [pillLeft, bodyLeft + R],
    GEO_EXTRAPOLATE
  );

  const bl_cy = interpolate(
    t,
    [0, 1],
    [pillBottom - R, totalBodyH],
    GEO_EXTRAPOLATE
  );
  const bl_ey = interpolate(
    t,
    [0, 1],
    [pillBottom - R, totalBodyH - R],
    GEO_EXTRAPOLATE
  );

  return `
      M ${pillLeft} ${pillTop + R}
      Q ${pillLeft} ${pillTop} ${pillLeft + R} ${pillTop}
      H ${pillRight - R}
      Q ${pillRight} ${pillTop} ${pillRight} ${pillTop + R}
      V ${pillBottom - R}
      Q ${pillRight} ${pillBottom} ${filletEndX} ${pillBottom}
      H ${shoulderEndX}
      Q ${c2_cx} ${pillBottom} ${c2_ex} ${c2_ey}
      V ${rightWallY}
      Q ${br_cx} ${br_cy} ${br_ex} ${br_ey}
      H ${bottomWallX}
      Q ${bodyLeft} ${bl_cy} ${bodyLeft} ${bl_ey}
      Z
    `;
};

export const getRightMorphPath = ({
  t,
  pillLeft,
  pillRight,
  pillTop,
  pillBottom,
  bodyLeft,
  bodyRight,
  totalBodyH,
  R,
}: GeometryParams) => {
  "worklet";
  // --- RIGHT MORPH GEOMETRY ---
  const filletEndX = interpolate(
    t,
    [0, 1],
    [pillLeft + R, pillLeft - R],
    GEO_EXTRAPOLATE
  );
  const shoulderEndX = interpolate(
    t,
    [0, 1],
    [pillRight - R, bodyLeft + R],
    GEO_EXTRAPOLATE
  );

  const c2_cx = interpolate(t, [0, 1], [pillRight, bodyLeft], GEO_EXTRAPOLATE);
  const c2_ex = interpolate(t, [0, 1], [pillRight, bodyLeft], GEO_EXTRAPOLATE);
  const c2_ey = interpolate(
    t,
    [0, 1],
    [pillBottom - R, pillBottom + R],
    GEO_EXTRAPOLATE
  );

  const leftWallY = interpolate(
    t,
    [0, 1],
    [pillBottom - R, totalBodyH - R],
    GEO_EXTRAPOLATE
  );

  const bl_cx = interpolate(t, [0, 1], [pillRight, bodyLeft], GEO_EXTRAPOLATE);
  const bl_cy = interpolate(
    t,
    [0, 1],
    [pillBottom - R, totalBodyH],
    GEO_EXTRAPOLATE
  );
  const bl_ex = interpolate(
    t,
    [0, 1],
    [pillRight - R, bodyLeft + R],
    GEO_EXTRAPOLATE
  );
  const bl_ey = interpolate(
    t,
    [0, 1],
    [pillBottom - R, totalBodyH],
    GEO_EXTRAPOLATE
  );

  const bottomWallX = interpolate(
    t,
    [0, 1],
    [pillRight - R, bodyRight - R],
    GEO_EXTRAPOLATE
  );

  const br_cy = interpolate(
    t,
    [0, 1],
    [pillBottom - R, totalBodyH],
    GEO_EXTRAPOLATE
  );
  const br_ey = interpolate(
    t,
    [0, 1],
    [pillBottom - R, totalBodyH - R],
    GEO_EXTRAPOLATE
  );

  return `
      M ${pillRight} ${pillTop + R}
      Q ${pillRight} ${pillTop} ${pillRight - R} ${pillTop}
      H ${pillLeft + R}
      Q ${pillLeft} ${pillTop} ${pillLeft} ${pillTop + R}
      V ${pillBottom - R}
      Q ${pillLeft} ${pillBottom} ${filletEndX} ${pillBottom}
      H ${shoulderEndX}
      Q ${c2_cx} ${pillBottom} ${c2_ex} ${c2_ey}
      V ${leftWallY}
      Q ${bl_cx} ${bl_cy} ${bl_ex} ${bl_ey}
      H ${bottomWallX}
      Q ${bodyRight} ${br_cy} ${bodyRight} ${br_ey}
      Z
    `;
};

export const getCenterMorphPath = ({
  t,
  pillLeft,
  pillRight,
  pillTop,
  pillBottom,
  bodyLeft,
  bodyRight,
  totalBodyH,
  R,
}: GeometryParams & { pillH: number }) => {
  "worklet";
  // --- CENTER (EXACT) MORPH GEOMETRY ---
  const pathHead = `
      M ${pillLeft + R} ${pillTop}
      H ${pillRight - R}
      Q ${pillRight} ${pillTop} ${pillRight} ${pillTop + R}
      V ${pillBottom - R}
    `;

  const wingW = bodyRight - pillRight;
  const filletR = Math.min(R, Math.max(0, wingW / 2));
  const shoulderR = filletR;

  const p1_x = interpolate(
    t,
    [0, 1],
    [pillRight - R, pillRight + filletR],
    GEO_EXTRAPOLATE
  );
  const p1_y = pillBottom;

  const cp1_x = pillRight;
  const cp1_y = pillBottom;

  const p2_x = interpolate(
    t,
    [0, 1],
    [pillRight - R, bodyRight - shoulderR],
    GEO_EXTRAPOLATE
  );
  const p2_y = pillBottom;

  const p3_x = interpolate(
    t,
    [0, 1],
    [pillRight - R, bodyRight],
    GEO_EXTRAPOLATE
  );
  const p3_y = interpolate(
    t,
    [0, 1],
    [pillBottom, pillBottom + shoulderR],
    GEO_EXTRAPOLATE
  );

  const cp2_x = interpolate(
    t,
    [0, 1],
    [pillRight - R, bodyRight],
    GEO_EXTRAPOLATE
  );
  const cp2_y = pillBottom;

  // We need pillH for center calculation as per original code
  // const currentTotalH = interpolate(t, [0, 1], [pillH, totalBodyH], GEO_EXTRAPOLATE);
  // Wait, pillH is derived from pillBottom - pillTop usually, but let's check original.
  // Original uses `pillH` variable.
  const pillH = pillBottom - pillTop; // Derived

  const currentTotalH = interpolate(
    t,
    [0, 1],
    [pillH, totalBodyH],
    GEO_EXTRAPOLATE
  );
  const bottomR = interpolate(t, [0, 1], [0, R], GEO_EXTRAPOLATE);

  const p4_y = Math.max(p3_y, currentTotalH - bottomR);

  const p5_x = interpolate(
    t,
    [0, 1],
    [pillRight - R, bodyRight - R],
    GEO_EXTRAPOLATE
  );
  const p5_y = currentTotalH;

  const p6_x = interpolate(
    t,
    [0, 1],
    [pillLeft + R, bodyLeft + R],
    GEO_EXTRAPOLATE
  );

  const l_p3_x = interpolate(
    t,
    [0, 1],
    [pillLeft + R, bodyLeft],
    GEO_EXTRAPOLATE
  );
  const l_cp2_x = interpolate(
    t,
    [0, 1],
    [pillLeft + R, bodyLeft],
    GEO_EXTRAPOLATE
  );
  const l_cp2_y = cp2_y;

  const l_p2_x = interpolate(
    t,
    [0, 1],
    [pillLeft + R, bodyLeft + shoulderR],
    GEO_EXTRAPOLATE
  );
  const l_p1_x = interpolate(
    t,
    [0, 1],
    [pillLeft + R, pillLeft - filletR],
    GEO_EXTRAPOLATE
  );
  const l_cp1_x = pillLeft;

  return `
      ${pathHead}
      Q ${cp1_x} ${cp1_y} ${p1_x} ${p1_y}
      H ${p2_x}
      Q ${cp2_x} ${cp2_y} ${p3_x} ${p3_y}
      V ${p4_y}
      Q ${p3_x} ${currentTotalH} ${p5_x} ${p5_y}
      H ${p6_x}
      Q ${l_p3_x} ${currentTotalH} ${l_p3_x} ${p4_y}
      V ${p3_y}
      Q ${l_cp2_x} ${l_cp2_y} ${l_p2_x} ${p2_y}
      H ${l_p1_x}
      Q ${l_cp1_x} ${cp1_y} ${pillLeft} ${pillBottom - R}
      V ${pillTop + R}
      Q ${pillLeft} ${pillTop} ${pillLeft + R} ${pillTop}
      Z
    `;
};
