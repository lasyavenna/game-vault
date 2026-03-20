export default function PlayerChip({ player, isHost }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 8, padding: "8px 14px",
    }}>
      <span style={{ fontSize: 22 }}>{player.avatar}</span>
      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: "#e0e0e0" }}>
        {player.name}
      </span>
      {isHost && (
        <span style={{
          marginLeft: 6, background: "#FFE66D", color: "#1a1a2e",
          fontFamily: "'Press Start 2P', monospace", fontSize: 7, padding: "2px 6px", borderRadius: 3,
        }}>HOST</span>
      )}
    </div>
  );
}