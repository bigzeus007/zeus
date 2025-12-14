export default function MiniBadge({ children, style }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        lineHeight: "16px",
        border: "1px solid #ccc",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
