export default function GameStartScreen({ room, onBack }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, minHeight: "100vh", padding: 40 }}>
      <div style={{ fontSize: 64, animation: "float 2s ease-in-out infinite" }}>{room.selectedGame.icon}</div>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "clamp(18px, 4vw, 32px)",
        color: "#FFE66D", textShadow: "3px 3px 0 #FF6B35",
        textAlign: "center", animation: "pulse 1s ease-in-out infinite",
      }}>
        {room.selectedGame.name}
      </div>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#4ECDC4", textAlign: "center", letterSpacing: 2 }}>
        LAUNCHING WITH {room.players.length} PLAYER{room.players.length !== 1 ? "S" : ""}...
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: "50%", background: "#FFE66D",
            animation: `bounce 0.8s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 20 }}>
        (GAME INTEGRATION COMING SOON)
      </div>
      <button
        onClick={onBack}
        style={{
          background: "transparent", border: "2px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.5)", fontFamily: "'Press Start 2P', monospace",
          fontSize: 8, padding: "12px 24px", borderRadius: 6, cursor: "pointer", transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#4ECDC4"; e.currentTarget.style.color = "#4ECDC4"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
      >
        ← BACK TO LOBBY
      </button>
    </div>
  );
}