"use client";

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: "2px solid var(--border)",
          borderTopColor: "var(--text)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
