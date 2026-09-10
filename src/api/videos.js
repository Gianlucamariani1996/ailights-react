import { apiClient, DEMO_MODE, resolveVideoUrl } from "./client.js";
import { createMockHistory } from "../demo/mockData.js";
import { normalizeResult } from "../utils/normalizeResult.js";

/**
 * Recupera lo storico dei video già caricati/analizzati dal DB del backend
 * (vedi db.py / GET /videos in ailights-agent/app.py).
 *
 *   GET {VITE_API_BASE_URL}/videos
 *   risposta: [{ id, title, created_at, result: RawHighlight[], video_url }, ...]
 *
 * Ogni record viene normalizzato in un AnalysisResult (vedi
 * src/utils/normalizeResult.js), riusando id/titolo/video_url già
 * calcolati dal backend invece di ricalcolarli — il video resta quindi
 * riproducibile anche dopo un refresh, non solo per la sessione corrente.
 *
 * @returns {Promise<import('../types.js').AnalysisResult[]>}
 */
export async function fetchVideoHistory() {
  if (DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 300));
    return createMockHistory();
  }
  const { data } = await apiClient.get("/videos");
  return data.map((record) =>
    normalizeResult(record.result, {
      id: record.id,
      title: record.title,
      createdAt: record.created_at,
      videoUrl: resolveVideoUrl(record.video_url),
    })
  );
}

/**
 * Chiede al backend di assemblare l'highlight reel per un video già
 * analizzato: ritaglia ogni highlight dal video sorgente e li concatena in
 * un unico mp4 con ffmpeg (vedi reel.py / POST /videos/<id>/reel in
 * ailights-agent/app.py). Se il reel esiste già, il backend lo riusa senza
 * rigenerarlo.
 *
 * Non disponibile in demo mode: non c'è un video sorgente reale da cui
 * ritagliare le clip.
 *
 * @param {string} videoId
 * @returns {Promise<string>} url del reel generato
 */
export async function generateReel(videoId) {
  const { data } = await apiClient.post(`/videos/${videoId}/reel`);
  if (data.error) throw new Error(data.error);
  return resolveVideoUrl(data.reel_url);
}
