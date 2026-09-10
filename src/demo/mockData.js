// Dati di comodo per sviluppare/mostrare il frontend senza un backend reale.
// Si attivano impostando VITE_DEMO_MODE=true in .env (vedi .env.example).
// Il JSON qui sotto rispetta esattamente il contratto ipotizzato in src/types.js.

/** @returns {import('../types.js').AnalysisResult} */
export function createMockResult({ fileName = "video.mp4", videoUrl } = {}) {
  return {
    id: "demo-" + Date.now(),
    title: "Milan vs Inter",
    competition: "Serie A, giornata 5",
    sport: "calcio",
    videoUrl: videoUrl || "https://example-bucket.s3.amazonaws.com/" + fileName,
    duration: 2090, // 34:50
    createdAt: new Date().toISOString(),
    stats: { highlightsFound: 8, totalClipDuration: 252, avgRelevance: 8.4 },
    highlights: [
      {
        id: "h1",
        type: "gol",
        team: "Milan",
        startTime: 724, // 12:04
        endTime: 758,
        relevanceScore: 9.4,
        description:
          "Azione sull'out di destra, cross basso e conclusione al volo sotto la traversa. Esultanza intensa del pubblico rilevata dall'audio.",
      },
      {
        id: "h2",
        type: "parata",
        team: "Inter",
        startTime: 1752, // 29:12
        endTime: 1774,
        relevanceScore: 8.1,
        description:
          "Riflesso su tiro ravvicinato in seguito a corner. Scoreboard OCR confirma situazione di parità al momento dell'azione.",
      },
      {
        id: "h3",
        type: "cartellino",
        team: "Milan",
        startTime: 2690, // 44:50
        endTime: 2705,
        relevanceScore: 8.0,
        description:
          "Entrata a due piedi a centrocampo, intervento considerato pericoloso: l'arbitro estrae il rosso diretto dopo revisione al VAR.",
      },
      {
        id: "h4",
        type: "rigore",
        team: "Milan",
        startTime: 3400, // 56:40
        endTime: 3432,
        relevanceScore: 9.1,
        description:
          "Fallo da rigore in area dopo un cross dalla destra: l'attaccante viene atterrato, l'arbitro assegna il penalty dopo revisione al VAR.",
      },
      {
        id: "h5",
        type: "gol",
        team: "Inter",
        startTime: 3800, // 63:20
        endTime: 3838,
        relevanceScore: 9.8,
        description:
          "Contropiede fulmineo dopo recupero palla a metà campo. Reazione del pubblico tra le più intense dell'intero match.",
      },
    ],
  };
}

/** @returns {import('../types.js').AnalysisResult[]} */
export function createMockHistory() {
  const milanInter = createMockResult({});
  milanInter.id = "demo-milan-inter";
  milanInter.createdAt = new Date(Date.now() - 3 * 86400000).toISOString();

  const sinnerAlcaraz = {
    ...milanInter,
    id: "demo-sinner-alcaraz",
    title: "Sinner vs Alcaraz",
    competition: "ATP Finals, semifinale",
    sport: "tennis",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    stats: { highlightsFound: 6, totalClipDuration: 190, avgRelevance: 8.6 },
  };

  const napoliJuve = {
    ...milanInter,
    id: "demo-napoli-juve",
    title: "Napoli vs Juventus",
    competition: "Serie A, giornata 4",
    sport: "calcio",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    stats: { highlightsFound: 5, totalClipDuration: 168, avgRelevance: 7.9 },
  };

  return [milanInter, sinnerAlcaraz, napoliJuve];
}
