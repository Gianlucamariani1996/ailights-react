import { parseTimeToSeconds } from "./format.js";

// Il backend è istruito a usare esattamente questi valori per "type" (vedi
// SYSTEM_PROMPT in ailights-agent/service.py), ma un LLM può comunque
// scrivere varianti ("occasione" invece di "occasione da gol"): senza
// normalizzazione i chip filtro (che confrontano stringhe esatte, vedi
// config/highlightTypes.js) smettono di funzionare per quegli highlight.
const TYPE_ALIASES = {
  occasione: "occasione da gol",
};

function canonicalType(type) {
  const key = (type || "").trim().toLowerCase();
  return TYPE_ALIASES[key] || key;
}

/**
 * Il backend restituisce un array piatto di RawHighlight, senza metadati
 * sulla partita (titolo, competizione, durata...): li ricaviamo qui
 * lato client per ottenere la shape AnalysisResult che la UI si aspetta
 * (vedi src/types.js).
 *
 * @param {import('../types.js').RawHighlight[]} rawHighlights
 * @param {{ videoUrl?: string|null }} [meta]
 * @returns {import('../types.js').AnalysisResult}
 */
export function normalizeResult(rawHighlights, meta = {}) {
  const highlights = (rawHighlights || []).map((h, i) => ({
    id: `h${i}`,
    type: canonicalType(h.type),
    team: h.team ?? null,
    startTime: parseTimeToSeconds(h.start),
    endTime: parseTimeToSeconds(h.end),
    relevance: h.relevance,
    description: h.description,
  }));

  const teams = [...new Set(highlights.map((h) => h.team).filter(Boolean))];
  const title = teams.length === 2 ? `${teams[0]} vs ${teams[1]}` : teams[0] || "Video analizzato";

  // Il backend analizza solo calcio: il campo non è più nel JSON restituito.
  const sport = "calcio";
  const totalClipDuration = highlights.reduce(
    (sum, h) => sum + Math.max(0, h.endTime - h.startTime),
    0
  );
  const avgRelevance = highlights.length
    ? highlights.reduce((sum, h) => sum + (h.relevance || 0), 0) / highlights.length
    : 0;
  const duration = highlights.reduce((max, h) => Math.max(max, h.endTime), 0);

  return {
    id: `video-${Date.now()}`,
    title,
    competition: "",
    sport,
    videoUrl: meta.videoUrl ?? null,
    duration,
    createdAt: new Date().toISOString(),
    stats: {
      highlightsFound: highlights.length,
      totalClipDuration,
      avgRelevance,
    },
    highlights,
  };
}
