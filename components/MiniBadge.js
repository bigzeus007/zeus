import React from "react";

const colorMap = {
  default: { bg: "#e5e7eb", fg: "#111827", border: "#d1d5db" },
  primary: { bg: "#2563eb", fg: "white", border: "#1d4ed8" },
  secondary: { bg: "#7c3aed", fg: "white", border: "#6d28d9" },
  success: { bg: "#16a34a", fg: "white", border: "#15803d" },
  warning: { bg: "#f59e0b", fg: "#111827", border: "#d97706" },
  error: { bg: "#dc2626", fg: "white", border: "#b91c1c" },
};

const sizeMap = {
  xs: { fontSize: 10, padX: 6, padY: 2, minH: 16 },
  sm: { fontSize: 11, padX: 7, padY: 2, minH: 18 },
  md: { fontSize: 12, padX: 8, padY: 3, minH: 20 },
  lg: { fontSize: 13, padX: 9, padY: 4, minH: 22 },
  xl: { fontSize: 14, padX: 10, padY: 5, minH: 24 },
};

function normalizeOffset(v, fallback) {
  if (v === undefined || v === null || v === "") return fallback;
  return typeof v === "number" ? `${v}px` : `${v}`;
}

export default function MiniBadge({
  children,
  content = "",
  color = "default",
  size = "sm",
  variant = "solid", // "solid" | "flat" | "points"
  placement = "top-right",
  horizontalOffset,
  verticalOffset,
  enableShadow = false,
  disableOutline = false,
  isSquared = false,
  shape, // legacy prop (ignored if isSquared)
  css,
  style,
}) {
  const c = colorMap[color] || colorMap.default;
  const s = sizeMap[size] || sizeMap.sm;

  // placement defaults
  const basePos = (() => {
    switch (placement) {
      case "top-left":
        return { top: 0, left: 0, transform: "translate(-35%, -35%)" };
      case "bottom-left":
        return { bottom: 0, left: 0, transform: "translate(-35%, 35%)" };
      case "bottom-right":
        return { bottom: 0, right: 0, transform: "translate(35%, 35%)" };
      case "top-right":
      default:
        return { top: 0, right: 0, transform: "translate(35%, -35%)" };
    }
  })();

  const right = normalizeOffset(horizontalOffset, basePos.right);
  const left = normalizeOffset(horizontalOffset, basePos.left);
  const top = normalizeOffset(verticalOffset, basePos.top);
  const bottom = normalizeOffset(verticalOffset, basePos.bottom);

  const showBadge =
    content !== null &&
    content !== undefined &&
    `${content}`.trim().length > 0;

  const badgeStyle = {
    position: "absolute",
    zIndex: 10,
    display: showBadge ? "inline-flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    minHeight: s.minH,
    padding: variant === "points" ? "0px" : `${s.padY}px ${s.padX}px`,
    fontSize: s.fontSize,
    lineHeight: 1,
    borderRadius: isSquared || shape === "rectangle" ? 6 : 9999,
    background:
      variant === "flat" ? "rgba(255,255,255,0.85)" : c.bg,
    color: variant === "flat" ? "#111827" : c.fg,
    border: disableOutline ? "none" : `1px solid ${c.border}`,
    boxShadow: enableShadow ? "0 6px 16px rgba(0,0,0,0.15)" : "none",
    ...basePos,
    ...(right !== undefined ? { right } : {}),
    ...(left !== undefined ? { left } : {}),
    ...(top !== undefined ? { top } : {}),
    ...(bottom !== undefined ? { bottom } : {}),
  };

  const pointsStyle =
    variant === "points"
      ? {
          width: 10,
          height: 10,
          borderRadius: 9999,
          background: c.bg,
          border: disableOutline ? "none" : `1px solid ${c.border}`,
          boxShadow: enableShadow ? "0 6px 16px rgba(0,0,0,0.15)" : "none",
        }
      : null;

  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      {children}
      <span style={badgeStyle}>
        {variant === "points" ? <span style={pointsStyle} /> : content}
      </span>
    </span>
  );
}
