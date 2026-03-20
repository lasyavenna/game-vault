import { useState } from "react";
import { GAMES } from "../constants";

export default function HomeScreen({ onCreateRoom, onJoinRoom, loading }) {
  const [joinCode, setJoinCode] = useState("");
  const [shake, setShake] = useState(false);

  function handleJoin() {
    if (joinCode.trim().length < 4) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onJoinRoom(joinCode.toUpperCase().trim());
  }

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>

      {/* TOP HERO SECTION */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 48, padding: "60px 80px",
      }}>

        {/* LEFT — branding */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(36px, 6vw, 72px)",
            color: "#FFE66D",
            textShadow: "4px 4px 0 #FF6B35, 8px 8px 0 rgba(255,107,53,0.25)",
            letterSpacing: 2, lineHeight: 1.25,
            animation: "float 3s ease-in-out infinite",
          }}>
            GAME<br />VAULT
          </div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace", fontSize: 10,
            color: "#4ECDC4", letterSpacing: 5,
          }}>
            MULTIPLAYER HUB
          </div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace", fontSize: 7,
            color: "rgba(255,255,255,0.25)", letterSpacing: 2, marginTop: 8,
          }}>
            UP TO 8 PLAYERS · NO ACCOUNT NEEDED
          </div>
        </div>

        {/* RIGHT — actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 380, flex: "0 0 380px" }}>
          <button
            onClick={onCreateRoom}
            disabled={loading}
            style={{
              background: loading ? "rgba(255,230,109,0.4)" : "#FFE66D",
              color: "#1a1a2e", fontFamily: "'Press Start 2P', monospace", fontSize: 14,
              border: "none", padding: "22px 32px", borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 0 #d4c050", transition: "all 0.1s", letterSpacing: 1,
              width: "100%",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 0 #d4c050"; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 0 #d4c050"; }}
            onMouseDown={e => { if (!loading) { e.currentTarget.style.transform = "translateY(3px)"; e.currentTarget.style.boxShadow = "0 3px 0 #d4c050"; }}}
            onMouseUp={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 0 #d4c050"; }}}
          >
            {loading ? "..." : "✦ CREATE ROOM"}
          </button>

          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            color: "rgba(255,255,255,0.2)", fontFamily: "'Press Start 2P', monospace", fontSize: 8,
          }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            OR JOIN ONE
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && handleJoin()}
              placeholder="ROOM CODE"
              maxLength={8}
              disabled={loading}
              style={{
                flex: 1, background: "rgba(255,255,255,0.07)",
                border: shake ? "2px solid #FF6B35" : "2px solid rgba(255,255,255,0.15)",
                borderRadius: 8, color: "#fff",
                fontFamily: "'Press Start 2P', monospace", fontSize: 12,
                padding: "18px", outline: "none", letterSpacing: 4,
                transition: "border 0.2s",
                animation: shake ? "shake 0.4s ease" : "none",
              }}
            />
            <button
              onClick={handleJoin}
              disabled={loading}
              style={{
                background: "#4ECDC4", color: "#1a1a2e",
                fontFamily: "'Press Start 2P', monospace", fontSize: 10,
                border: "none", padding: "18px 22px", borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 5px 0 #35a89f", transition: "all 0.1s", whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
              onMouseDown={e => { if (!loading) { e.currentTarget.style.transform = "translateY(3px)"; e.currentTarget.style.boxShadow = "0 2px 0 #35a89f"; }}}
              onMouseUp={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 5px 0 #35a89f"; }}}
            >
              JOIN →
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM — game grid */}
      <div style={{ padding: "0 80px 60px 80px" }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace", fontSize: 8,
          color: "rgba(255,255,255,0.3)", letterSpacing: 3, marginBottom: 20,
        }}>
          AVAILABLE GAMES
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}>
          {GAMES.map((g) => (
            <div key={g.id} style={{
              background: "rgba(255,255,255,0.04)", border: `2px solid ${g.color}22`,
              borderRadius: 12, padding: "24px", display: "flex", flexDirection: "column", gap: 10,
              transition: "all 0.2s", cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = `${g.color}12`; e.currentTarget.style.borderColor = g.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = `${g.color}22`; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 28 }}>{g.icon}</span>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#fff" }}>{g.name}</span>
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
                {g.desc}
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: g.color, marginTop: 4 }}>
                {g.players} players
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}