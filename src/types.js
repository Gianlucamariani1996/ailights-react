/**
 * Questo file non esporta nulla a runtime: serve solo a documentare
 * (via JSDoc) il contratto JSON che ci aspettiamo dal backend, così
 * l'editor dà autocompletamento anche in JavaScript puro.
 *
 * ⚠️ TUTTO QUESTO FILE È UN'IPOTESI DA CONFERMARE COL BACKEND.
 * Se i nomi dei campi cambiano, basta aggiornare qui + i due file in
 * src/config/ (highlightTypes.js e sports.js) che derivano icone/colori
 * da questi valori.
 */

/**
 * @typedef {Object} Highlight
 * @property {string} id
 * @property {"gol"|"rigore"|"occasione"|"parata"|"cartellino"} type
 * @property {string|null} team - nome della squadra (o null se non applicabile)
 * @property {number} startTime - secondi dall'inizio del video
 * @property {number} endTime - secondi dall'inizio del video
 * @property {number} relevanceScore - punteggio di rilevanza, 0-10
 * @property {string} description - breve descrizione generata dall'agente
 * @property {string} [clipUrl] - url della clip estratta (se già disponibile)
 */

/**
 * @typedef {Object} AnalysisStats
 * @property {number} highlightsFound
 * @property {number} totalClipDuration - secondi
 * @property {number} avgRelevance - 0-10
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {string} id
 * @property {string} title - es. "Milan vs Inter"
 * @property {string} competition - es. "Serie A, giornata 5"
 * @property {"calcio"|"tennis"} sport
 * @property {string} videoUrl - url pubblico (S3) del video sorgente
 * @property {number} duration - durata totale video, in secondi
 * @property {string} createdAt - data ISO di caricamento/analisi
 * @property {AnalysisStats} stats
 * @property {Highlight[]} highlights
 */

export {};
