import { apiClient, DEMO_MODE } from "./client.js";
import { createMockHistory } from "../demo/mockData.js";

/**
 * Recupera lo storico dei video già caricati/analizzati.
 *
 * ⚠️ CONTRATTO ASSUNTO (da confermare col backend, endpoint OPZIONALE):
 *   GET {VITE_API_BASE_URL}/videos
 *   risposta: AnalysisResult[]  (stesso shape di /analyze, uno per video)
 *
 * Se questo endpoint non esiste ancora sul backend, la chiamata fallirà:
 * l'app in tal caso mostra semplicemente lo storico costruito in sessione
 * (i video analizzati durante l'uso corrente), senza rompersi. Vedi App.jsx.
 *
 * @returns {Promise<import('../types.js').AnalysisResult[]>}
 */
export async function fetchVideoHistory() {
  if (DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 300));
    return createMockHistory();
  }
  const { data } = await apiClient.get("/videos");
  return data;
}
