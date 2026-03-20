import { useState, useEffect, useRef } from "react";
import supabase from "./supabase";
import { GAMES } from "./constants";
import { generateCode, getOrCreatePlayer } from "./helpers";
import Stars from "./components/Stars";
import Toast from "./components/Toast";
import ErrorBanner from "./components/ErrorBanner";
import HomeScreen from "./screens/HomeScreen";
import LobbyScreen from "./screens/LobbyScreen";
import GameStartScreen from "./screens/GameStartScreen";

export default function App() {
  const [screen, setScreen]   = useState("home");
  const [room, setRoom]       = useState(null);
  const [player]              = useState(getOrCreatePlayer);
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);
  const [error, setError]     = useState(null);
  const channelRef            = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("room");
    if (code) handleJoinRoom(code);
  }, []);

  useEffect(() => {
    if (!room || screen === "home") return;
    if (channelRef.current) supabase.removeChannel(channelRef.current);

    const channel = supabase
      .channel("room:" + room.code)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `room_code=eq.${room.code}` },
        async () => {
          const { data } = await supabase
            .from("players").select("*").eq("room_code", room.code).order("joined_at", { ascending: true });
          if (data) setRoom(r => ({ ...r, players: data }));
        }
      )
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "rooms", filter: `code=eq.${room.code}` },
        ({ new: updated }) => {
          const game = GAMES.find(g => g.id === updated.selected_game) || null;
          setRoom(r => ({ ...r, selectedGame: game }));
          if (updated.status === "playing") setScreen("game");
          if (updated.status === "waiting") setScreen("lobby");
        }
      )
      .on("postgres_changes",
        { event: "DELETE", schema: "public", table: "rooms", filter: `code=eq.${room.code}` },
        () => {
          setRoom(null);
          setScreen("home");
          window.history.pushState({}, "", window.location.pathname);
          showToast("HOST LEFT · ROOM CLOSED");
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); channelRef.current = null; };
  }, [room?.code, screen]);

  function showToast(msg) { setToast(msg); }
  function showError(msg) { setError(msg); }

  async function handleCreateRoom() {
    setLoading(true);
    try {
      const code = generateCode();
      const { error: roomErr } = await supabase
        .from("rooms").insert({ code, host_name: player.name, status: "waiting" });
      if (roomErr) throw roomErr;
      const { error: playerErr } = await supabase
        .from("players").insert({ room_code: code, name: player.name, avatar: player.avatar, is_host: true });
      if (playerErr) throw playerErr;
      setRoom({ code, players: [{ ...player, is_host: true }], selectedGame: null });
      setScreen("lobby");
      window.history.pushState({}, "", `?room=${code}`);
    } catch (e) {
      showError("COULDN'T CREATE ROOM · CHECK YOUR SUPABASE KEYS");
      console.error(e);
    } finally { setLoading(false); }
  }

  async function handleJoinRoom(code) {
    setLoading(true);
    const upperCode = code.toUpperCase();
    try {
      const { data: roomData, error: roomErr } = await supabase
        .from("rooms").select("*, players(*)").eq("code", upperCode).single();
      if (roomErr || !roomData) {
        showError(`ROOM "${upperCode}" NOT FOUND`);
        window.history.pushState({}, "", window.location.pathname);
        return;
      }
      if (roomData.players.length >= 8) { showError("ROOM IS FULL (8/8)"); return; }
      const alreadyIn = roomData.players.some(p => p.name === player.name);
      if (!alreadyIn) {
        const { error: joinErr } = await supabase
          .from("players").insert({ room_code: upperCode, name: player.name, avatar: player.avatar, is_host: false });
        if (joinErr) throw joinErr;
      }
      const selectedGame = GAMES.find(g => g.id === roomData.selected_game) || null;
      const players = alreadyIn ? roomData.players : [...roomData.players, { ...player, is_host: false }];
      setRoom({ code: upperCode, players, selectedGame });
      setScreen(roomData.status === "playing" ? "game" : "lobby");
      window.history.pushState({}, "", `?room=${upperCode}`);
    } catch (e) {
      showError("COULDN'T JOIN · TRY AGAIN");
      console.error(e);
    } finally { setLoading(false); }
  }

  async function handleLeave() {
    if (!room) return;
    const isHost = room.players[0]?.name === player.name;
    try {
      if (isHost) {
        await supabase.from("rooms").delete().eq("code", room.code);
      } else {
        await supabase.from("players").delete().eq("room_code", room.code).eq("name", player.name);
      }
    } catch (e) { console.error("Leave error:", e); }
    setRoom(null);
    setScreen("home");
    window.history.pushState({}, "", window.location.pathname);
  }

  async function handleSelectGame(game) {
    if (!room) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("rooms").update({ selected_game: game.id }).eq("code", room.code);
      if (error) throw error;
      setRoom(r => ({ ...r, selectedGame: game }));
    } catch (e) {
      showError("COULDN'T UPDATE GAME SELECTION");
      console.error(e);
    } finally { setLoading(false); }
  }

  async function handleStartGame() {
    if (!room?.selectedGame) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("rooms").update({ status: "playing" }).eq("code", room.code);
      if (error) throw error;
      setScreen("game");
    } catch (e) {
      showError("COULDN'T START GAME");
      console.error(e);
    } finally { setLoading(false); }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0d1a; }
        @keyframes twinkle { 0%,100%{opacity:0} 50%{opacity:0.8} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-10px);opacity:1} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes slideUp { from{opacity:0;transform:translateX(-50%) translateY(20px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        input::placeholder { color: rgba(255,255,255,0.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 20% 20%, #1a1a3e 0%, #0d0d1a 50%, #0a0a15 100%)",
        position: "relative",
      }}>
        <Stars />
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "linear-gradient(rgba(78,205,196,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(78,205,196,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
          {screen === "home" && (
            <HomeScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} loading={loading} />
          )}
          {screen === "lobby" && room && (
            <LobbyScreen
              room={room} player={player} loading={loading}
              onStartGame={handleStartGame} onLeave={handleLeave}
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
      {error && <ErrorBanner msg={error} onDismiss={() => setError(null)} />}
    </>
  );
}