// Dati di comodo per sviluppare/mostrare il frontend senza un backend reale.
// Si attivano impostando VITE_DEMO_MODE=true in .env (vedi .env.example).
//
// Stessa shape "piatta" restituita dal backend reale — vedi anche il mock
// lato Flask attivabile con MOCK_ANALYSIS=1 in ailights-agent/.env, che usa
// esattamente questi stessi dati. src/utils/normalizeResult.js li trasforma
// entrambi nella shape AnalysisResult che la UI si aspetta.
import { normalizeResult } from "../utils/normalizeResult.js";

/** @type {import('../types.js').RawHighlight[]} */
export const MOCK_HIGHLIGHTS = [
  {
    type: "occasione da gol",
    start: "08:12",
    end: "08:24",
    team: "Juventus",
    description:
      "Contropiede rapido della Juventus: Vlahovic allarga per Cuadrado che calcia di potenza incrociando a fil di palo.",
    relevance: 72,
  },
  {
    type: "parata",
    start: "11:52",
    end: "12:06",
    team: "Juventus",
    description:
      "Azione corale della Juventus, velo di Vlahovic e conclusione mancina di prima intenzione di Milik, respinta da Tatarusanu.",
    relevance: 75,
  },
  {
    type: "occasione da gol",
    start: "12:54",
    end: "13:06",
    team: "Juventus",
    description:
      "Danilo approfitta dello spazio al limite dell'area e scaglia un violento diagonale destro che finisce di poco a lato.",
    relevance: 70,
  },
  {
    type: "palo",
    start: "20:03",
    end: "20:25",
    team: "Milan",
    description:
      "Sugli sviluppi di un calcio d'angolo di Tonali, colpo di tacco di Rafael Leão che si stampa direttamente sul palo a Szczesny battuto.",
    relevance: 88,
  },
  {
    type: "palo",
    start: "33:55",
    end: "34:15",
    team: "Milan",
    description:
      "Rafael Leão si accentra dalla sinistra e scocca una splendida conclusione da fuori area che colpisce in pieno la base del palo.",
    relevance: 89,
  },
  {
    type: "gol",
    start: "45:33",
    end: "46:10",
    team: "Milan",
    description:
      "Calcio d'angolo teso battuto da Theo Hernandez, conclusione al volo di Giroud controllata e girata in rete da distanza ravvicinata da Fikayo Tomori per l'1-0.",
    relevance: 95,
  },
];

/** @returns {import('../types.js').AnalysisResult[]} */
export function createMockHistory() {
  const juveMilan = normalizeResultForDemo(MOCK_HIGHLIGHTS, {
    id: "demo-juventus-milan",
    createdAtOffsetDays: 3,
  });

  const sinnerAlcaraz = {
    ...juveMilan,
    id: "demo-sinner-alcaraz",
    title: "Sinner vs Alcaraz",
    competition: "ATP Finals, semifinale",
    sport: "tennis",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  };

  const napoliJuve = {
    ...juveMilan,
    id: "demo-napoli-juve",
    title: "Napoli vs Juventus",
    competition: "Serie A, giornata 4",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  };

  return [juveMilan, sinnerAlcaraz, napoliJuve];
}

function normalizeResultForDemo(rawHighlights, { id, createdAtOffsetDays }) {
  const result = normalizeResult(rawHighlights);
  result.id = id;
  result.createdAt = new Date(Date.now() - createdAtOffsetDays * 86400000).toISOString();
  return result;
}
