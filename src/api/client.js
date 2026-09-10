import axios from "axios";

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 60_000,
});

// ⚠️ Se le API richiedono autenticazione, è questo l'unico punto da toccare:
// apiClient.interceptors.request.use((config) => {
//   const token = getTokenFromWhereverItLives();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
