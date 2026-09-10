import { apiClient, DEMO_MODE } from "./client.js";
import { createMockResult } from "../demo/mockData.js";

/**
 * Chiede al backend di analizzare il video e tornare gli highlight.
 * Chiamata SINCRONA: si aspetta che il backend risponda solo quando
 * l'analisi è completa (nessun polling/websocket, per scelta esplicita).
 *
 * ⚠️ CONTRATTO ASSUNTO (da confermare col backend):
 *   POST {VITE_API_BASE_URL}/analyze
 *   body: { videoUrl: string }
 *   risposta: AnalysisResult (vedi src/types.js)
 *
 * @param {string} videoUrl
 * @returns {Promise<import('../types.js').AnalysisResult>}
 */
export async function analyzeVideo(videoUrl) {
  if (DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 1400)); // simula il tempo di analisi
    return createMockResult({ videoUrl });
  }
  const { data } = await apiClient.post("/analyze", { videoUrl });
  return data;
}
