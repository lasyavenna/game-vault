import { useEffect } from "react";

export default function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      background: "#FFE66D", color: "#1a1a2e", fontFamily: "'Press Start 2P', monospace",
      fontSize: 10, padding: "12px 24px", borderRadius: 4, zIndex: 999,
      boxShadow: "4px 4px 0 #1a1a2e", animation: "slideUp 0.3s ease", whiteSpace: "nowrap",
    }}>
      {msg}
    </div>
  );
}