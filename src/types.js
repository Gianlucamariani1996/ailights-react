/**
 * Questo file non esporta nulla a runtime: serve solo a documentare
 * (via JSDoc) le shape usate dal frontend, così l'editor dà
 * autocompletamento anche in JavaScript puro.
 *
 * Il backend (`POST /analyze-video`, vedi ailights-agent/service.py)
 * restituisce un array "piatto" di RawHighlight, senza metadati sulla
 * partita: `src/utils/normalizeResult.js` lo trasforma in un AnalysisResult
 * completo, che è la shape che i componenti (ResultsScreen, VideoPlayer,
 * StoricoScreen...) si aspettano.
 */

/**
 * @typedef {Object} RawHighlight
 * @property {string} type - "gol"|"rigore"|"palo"|"parata"|"occasione da gol"
 * @property {string} start - "mm:ss" o "hh:mm:ss"
 * @property {string} end - "mm:ss" o "hh:mm:ss"
 * @property {string|null} team
 * @property {string} description
 * @property {number} relevance - 0-100, quanto vale editorialmente il momento
 */

/**
 * @typedef {Object} Highlight
 * @property {string} id
 * @property {string} type
 * @property {string|null} team - nome della squadra (o null se non applicabile)
 * @property {number} startTime - secondi dall'inizio del video
 * @property {number} endTime - secondi dall'inizio del video
 * @property {number} relevance - 0-100
 * @property {string} description - breve descrizione generata dall'agente
 */

/**
 * @typedef {Object} AnalysisStats
 * @property {number} highlightsFound
 * @property {number} totalClipDuration - secondi
 * @property {number} avgRelevance - 0-100
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {string} id
 * @property {string} title - es. "Juventus vs Milan" (derivato client-side dalle squadre viste negli highlight)
 * @property {string} competition - non fornita dal backend: al momento sempre ""
 * @property {"calcio"} sport - il backend analizza solo calcio; il campo resta per compatibilità con la UI (sportbadge, StoricoScreen)
 * @property {string|null} videoUrl - URL del video servito dal backend (/uploads/... o l'URL remoto originale), risolto via resolveVideoUrl()
 * @property {number} duration - stima (max endTime degli highlight), poi corretta con la durata reale del <video>
 * @property {string} createdAt - data ISO di caricamento/analisi
 * @property {AnalysisStats} stats
 * @property {Highlight[]} highlights
 */

export {};
