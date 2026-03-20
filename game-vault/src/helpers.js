import { AVATARS, NAMES } from "./constants";

export function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function copyToClipboard(text) {
  navigator.clipboard?.writeText(text).catch(() => {});
}

export function getOrCreatePlayer() {
  const stored = sessionStorage.getItem("gv_player");
  if (stored) return JSON.parse(stored);
  const idx = Math.floor(Math.random() * AVATARS.length);
  const p = { avatar: AVATARS[idx], name: NAMES[idx] + Math.floor(Math.random() * 99 + 1) };
  sessionStorage.setItem("gv_player", JSON.stringify(p));
  return p;
}