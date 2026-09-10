import axios from "axios";

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  // L'analisi video (upload su Gemini + attesa stato ACTIVE + generazione)
  // può richiedere diversi minuti: il backend stesso aspetta fino a 10
  // minuti solo per l'attivazione del file su Gemini.
  timeout: 10 * 60_000,
});

// ⚠️ Se le API richiedono autenticazione, è questo l'unico punto da toccare:
// apiClient.interceptors.request.use((config) => {
//   const token = getTokenFromWhereverItLives();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
