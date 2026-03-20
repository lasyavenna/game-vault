import { GAMES } from "../constants";
import { copyToClipboard } from "../helpers";
import PlayerChip from "../components/PlayerChip";

export default function LobbyScreen({ room, player, onStartGame, onLeave, onCopyCode, onCopyLink, onSelectGame, loading }) {
  const isHost = room.players[0]?.name === player.name;
  const shareUrl = `${window.location.origin}${window.location.pathname}?room=${room.code}`;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minHeight: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "40px 20px", maxWidth: 640, width: "100%" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: "#4ECDC4", letterSpacing: 3, marginBottom: 6 }}>
              ROOM CODE
            </div>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(24px, 6vw, 38px)",
              color: "#FFE66D", textShadow: "3px 3px 0 #FF6B35", letterSpacing: 6,
            }}>
              {room.code}
            </div>
          </div>
          <button
            onClick={onLeave}
            style={{
              background: "transparent", border: "2px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.5)", fontFamily: "'Press Start 2P', monospace",
              fontSize: 8, padding: "10px 14px", borderRadius: 6, cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF6B35"; e.currentTarget.style.color = "#FF6B35"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          >
            ← LEAVE
          </button>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => { copyToClipboard(room.code); onCopyCode(); }}
            style={{
              flex: 1, background: "rgba(78,205,196,0.15)", border: "2px solid #4ECDC4",
              color: "#4ECDC4", fontFamily: "'Press Start 2P', monospace", fontSize: 8,
              padding: "12px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(78,205,196,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(78,205,196,0.15)"}
          >
            📋 COPY CODE
          </button>
          <button
            onClick={() => { copyToClipboard(shareUrl); onCopyLink(); }}
            style={{
              flex: 1, background: "rgba(255,107,53,0.15)", border: "2px solid #FF6B35",
              color: "#FF6B35", fontFamily: "'Press Start 2P', monospace", fontSize: 8,
              padding: "12px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,53,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,107,53,0.15)"}
          >
            🔗 COPY LINK
          </button>
        </div>

        <div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginBottom: 12 }}>
            PLAYERS ({room.players.length}/8)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {room.players.map((p, i) => (
              <PlayerChip key={p.name} player={p} isHost={i === 0} />
            ))}
            {Array.from({ length: Math.max(0, 4 - room.players.length) }).map((_, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)",
                borderRadius: 8, padding: "8px 14px",
              }}>
                <span style={{ fontSize: 22, opacity: 0.2 }}>👤</span>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "rgba(255,255,255,0.2)" }}>
                  WAITING...
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginBottom: 12 }}>
            SELECT GAME {!isHost && <span style={{ color: "rgba(255,255,255,0.2)" }}>· HOST ONLY</span>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {GAMES.map((g) => {
              const selected = room.selectedGame?.id === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => isHost && !loading && onSelectGame(g)}
                  style={{
                    background: selected ? `${g.color}22` : "rgba(255,255,255,0.04)",
                    border: `2px solid ${selected ? g.color : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 10, padding: "16px",
                    cursor: isHost ? "pointer" : "default",
                    transition: "all 0.2s",
                    transform: selected ? "scale(1.02)" : "none",
                    opacity: loading ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { if (isHost) { e.currentTarget.style.background = `${g.color}18`; e.currentTarget.style.borderColor = g.color; }}}
                  onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 28 }}>{g.icon}</span>
                    {selected && <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: g.color }}>✓ SELECTED</span>}
                  </div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#fff", marginTop: 8 }}>{g.name}</div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{g.desc}</div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: g.color, marginTop: 8 }}>{g.players} players</div>
                </div>
              );
            })}
          </div>
        </div>

        {isHost && (
          <button
            onClick={onStartGame}
            disabled={!room.selectedGame || loading}
            style={{
              background: room.selectedGame && !loading ? "#FF6B35" : "rgba(255,255,255,0.1)",
              color: room.selectedGame && !loading ? "#fff" : "rgba(255,255,255,0.3)",
              fontFamily: "'Press Start 2P', monospace", fontSize: 13,
              border: "none", padding: "20px", borderRadius: 8,
              cursor: room.selectedGame && !loading ? "pointer" : "not-allowed",
              boxShadow: room.selectedGame && !loading ? "0 6px 0 #c0522a" : "none",
              transition: "all 0.2s", letterSpacing: 1,
            }}
            onMouseEnter={e => { if (room.selectedGame && !loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
          >
            {loading ? "SAVING..." : room.selectedGame ? `▶ START ${room.selectedGame.name.toUpperCase()}` : "SELECT A GAME FIRST"}
          </button>
        )}

        {!isHost && room.selectedGame && (
          <div style={{
            fontFamily: "'Press Start 2P', monospace", fontSize: 8,
            color: "#4ECDC4", textAlign: "center", padding: "16px",
            background: "rgba(78,205,196,0.08)", borderRadius: 8,
            border: "1px solid rgba(78,205,196,0.2)",
            animation: "pulse 2s ease-in-out infinite",
          }}>
            ⏳ WAITING FOR HOST TO START...
          </div>
        )}

      </div>
    </div>
  );
}