export default function ErrorBanner({ msg, onDismiss }) {
  return (
    <div style={{
      position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
      background: "#FF6B35", color: "#fff", fontFamily: "'Press Start 2P', monospace",
      fontSize: 8, padding: "12px 20px", borderRadius: 6, zIndex: 999,
      boxShadow: "4px 4px 0 rgba(0,0,0,0.4)", display: "flex", gap: 16, alignItems: "center",
      maxWidth: "90vw", textAlign: "center", animation: "slideUp 0.3s ease",
    }}>
      <span>{msg}</span>
      <span onClick={onDismiss} style={{ cursor: "pointer", opacity: 0.7 }}>✕</span>
    </div>
  );
}