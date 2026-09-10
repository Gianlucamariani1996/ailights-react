export function formatTime(totalSeconds) {
  if (totalSeconds == null || Number.isNaN(totalSeconds)) return "00:00";
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" });
  } catch {
    return "";
  }
}

/** Divide "Milan vs Inter" in ["Milan", "Inter"]. Se il formato non combacia, torna []. */
export function splitTeams(title) {
  if (!title) return [];
  const parts = title.split(/\s+vs\.?\s+/i);
  return parts.length === 2 ? parts.map((p) => p.trim()) : [];
}
