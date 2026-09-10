import {
  IconBallFootball,
  IconTarget,
  IconHandStop,
  IconCards,
  IconCircleLetterP,
} from "../components/icons.jsx";

/**
 * Fonte unica di verità per le tipologie di highlight.
 *
 * ⚠️ CONTRATTO DA CONFERMARE COL BACKEND:
 * ci aspettiamo che ogni highlight nel JSON di risposta abbia un campo
 * `type` con uno di questi valori esatti (stringa). Se il backend usa
 * nomi diversi, basta aggiornare le chiavi di questo oggetto.
 *
 * `teamLabel(team)` decide come mostrare la squadra sulla card: per la
 * maggior parte dei tipi è semplicemente il nome della squadra, ma per
 * alcuni (es. rigore) ha senso una frase più contestuale.
 */
export const HIGHLIGHT_TYPES = {
  gol: {
    label: "Gol",
    color: "var(--accent)",
    soft: "var(--accent-soft)",
    hex: "#31e0a4",
    Icon: IconBallFootball,
    teamLabel: (team) => team,
  },
  rigore: {
    label: "Rigore",
    color: "var(--violet)",
    soft: "var(--violet-soft)",
    hex: "#8b7bff",
    Icon: IconCircleLetterP,
    teamLabel: (team) => `Rigore per il ${team}`,
  },
  occasione: {
    label: "Occasioni",
    color: "var(--gold)",
    soft: "var(--gold-soft)",
    hex: "#ffc857",
    Icon: IconTarget,
    teamLabel: (team) => team,
  },
  parata: {
    label: "Parate",
    color: "var(--blue)",
    soft: "var(--blue-soft)",
    hex: "#4fb2ff",
    Icon: IconHandStop,
    teamLabel: (team) => team,
  },
  cartellino: {
    label: "Cartellini",
    color: "var(--red)",
    soft: "var(--red-soft)",
    hex: "#ff5d6c",
    Icon: IconCards,
    teamLabel: (team) => team,
  },
};

// Ordine di visualizzazione dei chip filtro (oltre a "Tutti")
export const HIGHLIGHT_TYPE_ORDER = ["gol", "rigore", "occasione", "parata", "cartellino"];

export function getHighlightType(type) {
  return (
    HIGHLIGHT_TYPES[type] || {
      label: type || "Altro",
      color: "var(--text-dim)",
      soft: "rgba(255,255,255,0.08)",
      hex: "#93a0b5",
      Icon: IconTarget,
      teamLabel: (team) => team,
    }
  );
}
