import { useState, useEffect, useRef } from "react";

const GAMES = [
  { id: "trivia", name: "Trivia Blitz", icon: "🧠", desc: "Answer fast, score big", players: "2–8", color: "#FF6B35" },
  { id: "wordchain", name: "Word Chain", icon: "🔤", desc: "Keep the chain alive", players: "2–6", color: "#4ECDC4" },
  { id: "drawing", name: "Quick Draw", icon: "🎨", desc: "Sketch it before time runs out", players: "3–8", color: "#FFE66D" },
  { id: "numbers", name: "Number Duel", icon: "🔢", desc: "Math battles, no mercy", players: "2–4", color: "#A8E6CF" },
];

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text).catch(() => {});
}

const AVATARS = ["🦊", "🐼", "🦁", "🐸", "🦄", "🐙", "🦋", "🐺", "🦅", "🐬"];
const NAMES = ["Foxy", "Panda", "Leo", "Ribbit", "Uni", "Octo", "Flutterby", "Wolf", "Eagle", "Dolphin"];

function getOrCreatePlayer() {
  const idx = Math.floor(Math.random() * AVATARS.length);
  return { avatar: AVATARS[idx], name: NAMES[idx] + Math.floor(Math.random() * 99 + 1) };
}

// Pixel/arcade star animation
function Stars() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
    dur: Math.random() * 2 + 2,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff",
            opacity: 0,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      background: "#FFE66D", color: "#1a1a2e", fontFamily: "'Press Start 2P', monospace",
      fontSize: 10, padding: "12px 24px", borderRadius: 4, zIndex: 999,
      boxShadow: "4px 4px 0 #1a1a2e", animation: "slideUp 0.3s ease",
      whiteSpace: "nowrap",
    }}>
      {msg}
    </div>
  );
}

function PlayerChip({ player, isHost }) {
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
          fontFamily: "'Press Start 2P', monospace", fontSize: 7,
          padding: "2px 6px", borderRadius: 3,
        }}>HOST</span>
      )}
    </div>
  );
}

// ---- SCREENS ----

function HomeScreen({ onCreateRoom, onJoinRoom }) {
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48, padding: "60px 20px" }}>
      {/* Logo */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(28px, 6vw, 52px)",
          color: "#FFE66D",
          textShadow: "4px 4px 0 #FF6B35, 8px 8px 0 rgba(255,107,53,0.3)",
          letterSpacing: 2,
          lineHeight: 1.3,
          animation: "float 3s ease-in-out infinite",
        }}>
          GAME<br />VAULT
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace", fontSize: 9,
          color: "#4ECDC4", marginTop: 12, letterSpacing: 4,
        }}>
          MULTIPLAYER HUB
        </div>
      </div>

      {/* Game previews */}
      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 560,
      }}>
        {GAMES.map((g) => (
          <div key={g.id} style={{
            background: "rgba(255,255,255,0.05)", border: `2px solid ${g.color}22`,
            borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center",
            gap: 8, transition: "all 0.2s", cursor: "default",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${g.color}22`; e.currentTarget.style.borderColor = g.color; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = `${g.color}22`; }}
          >
            <span style={{ fontSize: 20 }}>{g.icon}</span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#e0e0e0" }}>{g.name}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 400 }}>
        <button
          onClick={onCreateRoom}
          style={{
            background: "#FFE66D", color: "#1a1a2e",
            fontFamily: "'Press Start 2P', monospace", fontSize: 13,
            border: "none", padding: "18px 32px", borderRadius: 8, cursor: "pointer",
            boxShadow: "0 6px 0 #d4c050", transition: "all 0.1s",
            letterSpacing: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 0 #d4c050"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 0 #d4c050"; }}
          onMouseDown={e => { e.currentTarget.style.transform = "translateY(3px)"; e.currentTarget.style.boxShadow = "0 3px 0 #d4c050"; }}
          onMouseUp={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 0 #d4c050"; }}
        >
          ✦ CREATE ROOM
        </button>

        <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
          <input
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === "Enter" && handleJoin()}
            placeholder="ROOM CODE"
            maxLength={8}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.07)",
              border: shake ? "2px solid #FF6B35" : "2px solid rgba(255,255,255,0.15)",
              borderRadius: 8, color: "#fff",
              fontFamily: "'Press Start 2P', monospace", fontSize: 12,
              padding: "16px 18px", outline: "none", letterSpacing: 4,
              transition: "border 0.2s",
              animation: shake ? "shake 0.4s ease" : "none",
            }}
          />
          <button
            onClick={handleJoin}
            style={{
              background: "#4ECDC4", color: "#1a1a2e",
              fontFamily: "'Press Start 2P', monospace", fontSize: 10,
              border: "none", padding: "16px 20px", borderRadius: 8, cursor: "pointer",
              boxShadow: "0 5px 0 #35a89f", transition: "all 0.1s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
            onMouseDown={e => { e.currentTarget.style.transform = "translateY(3px)"; e.currentTarget.style.boxShadow = "0 2px 0 #35a89f"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 5px 0 #35a89f"; }}
          >
            JOIN →
          </button>
        </div>
      </div>

      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "rgba(255,255,255,0.25)", letterSpacing: 2 }}>
        UP TO 8 PLAYERS · NO ACCOUNT NEEDED
      </div>
    </div>
  );
}

function LobbyScreen({ room, player, onStartGame, onLeave, onCopyCode, onCopyLink, onSelectGame }) {
  const isHost = room.players[0]?.name === player.name;
  const shareUrl = `${window.location.origin}${window.location.pathname}?room=${room.code}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "40px 20px", maxWidth: 640, margin: "0 auto", width: "100%" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: "#4ECDC4", letterSpacing: 3, marginBottom: 6 }}>
            ROOM CODE
          </div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(24px, 6vw, 38px)",
            color: "#FFE66D",
            textShadow: "3px 3px 0 #FF6B35",
            letterSpacing: 6,
          }}>
            {room.code}
          </div>
        </div>
        <button
          onClick={onLeave}
          style={{
            background: "transparent", border: "2px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.5)", fontFamily: "'Press Start 2P', monospace", fontSize: 8,
            padding: "10px 14px", borderRadius: 6, cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF6B35"; e.currentTarget.style.color = "#FF6B35"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        >
          ← LEAVE
        </button>
      </div>

      {/* Share buttons */}
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

      {/* Players */}
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

      {/* Game picker */}
      <div>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginBottom: 12 }}>
          SELECT GAME
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {GAMES.map((g) => {
            const selected = room.selectedGame?.id === g.id;
            return (
              <div
                key={g.id}
                onClick={() => isHost && onSelectGame(g)}
                style={{
                  background: selected ? `${g.color}22` : "rgba(255,255,255,0.04)",
                  border: `2px solid ${selected ? g.color : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 10, padding: "16px", cursor: isHost ? "pointer" : "default",
                  transition: "all 0.2s",
                  transform: selected ? "scale(1.02)" : "none",
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
        {!isHost && (
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "rgba(255,255,255,0.3)", marginTop: 10, textAlign: "center" }}>
            WAITING FOR HOST TO SELECT A GAME
          </div>
        )}
      </div>

      {/* Start button (host only) */}
      {isHost && (
        <button
          onClick={onStartGame}
          disabled={!room.selectedGame}
          style={{
            background: room.selectedGame ? "#FF6B35" : "rgba(255,255,255,0.1)",
            color: room.selectedGame ? "#fff" : "rgba(255,255,255,0.3)",
            fontFamily: "'Press Start 2P', monospace", fontSize: 13,
            border: "none", padding: "20px", borderRadius: 8,
            cursor: room.selectedGame ? "pointer" : "not-allowed",
            boxShadow: room.selectedGame ? "0 6px 0 #c0522a" : "none",
            transition: "all 0.2s", letterSpacing: 1,
          }}
          onMouseEnter={e => { if (room.selectedGame) e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
        >
          {room.selectedGame ? `▶ START ${room.selectedGame.name.toUpperCase()}` : "SELECT A GAME FIRST"}
        </button>
      )}
    </div>
  );
}

function GameStartScreen({ room, onBack }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, minHeight: "60vh", padding: 40 }}>
      <div style={{ fontSize: 64, animation: "float 2s ease-in-out infinite" }}>{room.selectedGame.icon}</div>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "clamp(18px, 4vw, 32px)",
        color: "#FFE66D",
        textShadow: "3px 3px 0 #FF6B35",
        textAlign: "center",
        animation: "pulse 1s ease-in-out infinite",
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
          fontSize: 8, padding: "12px 24px", borderRadius: 6, cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#4ECDC4"; e.currentTarget.style.color = "#4ECDC4"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
      >
        ← BACK TO LOBBY
      </button>
    </div>
  );
}

// ---- MAIN APP ----
export default function App() {
  const [screen, setScreen] = useState("home"); // home | lobby | game
  const [room, setRoom] = useState(null);
  const [player] = useState(getOrCreatePlayer);
  const [toast, setToast] = useState(null);

  // Check URL for room code on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("room");
    if (code) handleJoinRoom(code);
  }, []);

  function showToast(msg) {
    setToast(msg);
  }

  function handleCreateRoom() {
    const code = generateCode();
    const newRoom = {
      code,
      players: [player],
      selectedGame: null,
      createdAt: Date.now(),
    };
    setRoom(newRoom);
    setScreen("lobby");
    window.history.pushState({}, "", `?room=${code}`);
  }

  function handleJoinRoom(code) {
    // In a real app, this would connect to a server. Here we simulate joining.
    const upperCode = code.toUpperCase();
    const newRoom = {
      code: upperCode,
      players: [
        { avatar: "🦁", name: "Leo42" },
        { avatar: "🐼", name: "Panda7" },
        player,
      ],
      selectedGame: null,
      createdAt: Date.now(),
    };
    setRoom(newRoom);
    setScreen("lobby");
    window.history.pushState({}, "", `?room=${upperCode}`);
  }

  function handleLeave() {
    setRoom(null);
    setScreen("home");
    window.history.pushState({}, "", window.location.pathname);
  }

  function handleSelectGame(game) {
    setRoom(r => ({ ...r, selectedGame: game }));
  }

  function handleStartGame() {
    if (room?.selectedGame) setScreen("game");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0d1a; }
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-10px); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
      `}</style>

      {/* Background */}
      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 20% 20%, #1a1a3e 0%, #0d0d1a 50%, #0a0a15 100%)",
        position: "relative",
      }}>
        <Stars />

        {/* Grid overlay */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "linear-gradient(rgba(78,205,196,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(78,205,196,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
          {screen === "home" && (
            <HomeScreen
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
            />
          )}
          {screen === "lobby" && room && (
            <LobbyScreen
              room={room}
              player={player}
              onStartGame={handleStartGame}
              onLeave={handleLeave}
              onCopyCode={() => showToast("CODE COPIED!")}
              onCopyLink={() => showToast("LINK COPIED!")}
              onSelectGame={handleSelectGame}
            />
          )}
          {screen === "game" && room && (
            <GameStartScreen room={room} onBack={() => setScreen("lobby")} />
          )}
        </div>
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}
