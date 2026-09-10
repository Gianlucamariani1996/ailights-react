import { apiClient, DEMO_MODE } from "./client.js";
import { MOCK_HIGHLIGHTS } from "../demo/mockData.js";
import { normalizeResult } from "../utils/normalizeResult.js";

/**
 * Carica il video sul backend e ne richiede l'analisi.
 *
 * Il backend Flask fa upload + analisi Gemini in un'unica chiamata
 * sincrona (nessun polling/websocket):
 *
 *   POST {VITE_API_BASE_URL}/analyze-video
 *   multipart/form-data, campo "video" con il file
 *   risposta 200: { result: RawHighlight[] }
 *   risposta 4xx/5xx: { error: string }
 *
 * Il risultato grezzo viene normalizzato in un AnalysisResult (vedi
 * src/utils/normalizeResult.js) prima di essere restituito al chiamante.
 *
 * @param {File} file
 * @param {{ onProgress?: (percent: number) => void }} [opts]
 * @returns {Promise<import('../types.js').AnalysisResult>}
 */
export async function analyzeVideo(file, { onProgress } = {}) {
  const videoUrl = file ? URL.createObjectURL(file) : null;

  if (DEMO_MODE) {
    for (let p = 0; p <= 90; p += 15) {
      onProgress?.(p);
      await wait(150);
    }
    await wait(400);
    onProgress?.(100);
    return normalizeResult(MOCK_HIGHLIGHTS, { videoUrl });
  }

  const formData = new FormData();
  formData.append("video", file);

  const { data } = await apiClient.post("/analyze-video", formData, {
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    },
  });

  if (data.error) throw new Error(data.error);
  return normalizeResult(data.result, { videoUrl });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
