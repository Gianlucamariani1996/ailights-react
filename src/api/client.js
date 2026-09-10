import axios from "axios";

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // L'analisi video (upload su Gemini + attesa stato ACTIVE + generazione)
  // può richiedere diversi minuti: il backend stesso aspetta fino a 10
  // minuti solo per l'attivazione del file su Gemini.
  timeout: 10 * 60_000,
});

/**
 * Il backend restituisce `video_url` come path relativo (es.
 * "/uploads/xyz.mp4") per i video caricati come file — va risolto contro
 * l'origine del backend perché il <video> lo possa caricare. Se invece
 * l'analisi è partita da un URL remoto, `video_url` è già assoluto e va
 * usato così com'è.
 *
 * @param {string|null|undefined} url
 * @returns {string|null}
 */
export function resolveVideoUrl(url) {
  if (!url) return null;
  return url.startsWith("/") ? `${API_BASE_URL}${url}` : url;
}

// ⚠️ Se le API richiedono autenticazione, è questo l'unico punto da toccare:
// apiClient.interceptors.request.use((config) => {
//   const token = getTokenFromWhereverItLives();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
