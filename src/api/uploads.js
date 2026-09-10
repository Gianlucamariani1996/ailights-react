import axios from "axios";
import { apiClient, DEMO_MODE } from "./client.js";

/**
 * Chiede al backend una presigned URL per l'upload diretto su S3.
 *
 * ⚠️ CONTRATTO ASSUNTO (da confermare col backend):
 *   POST {VITE_API_BASE_URL}/uploads/presign
 *   body: { fileName: string, fileType: string }
 *   risposta: { uploadUrl: string, fileUrl: string }
 *     - uploadUrl: URL firmata su cui fare PUT del file (valida per pochi minuti)
 *     - fileUrl:   URL pubblica/finale del file una volta caricato,
 *                  quella che passeremo poi all'endpoint di analisi
 *
 * @param {File} file
 * @returns {Promise<{uploadUrl: string, fileUrl: string}>}
 */
export async function getPresignedUrl(file) {
  if (DEMO_MODE) {
    await wait(300);
    const fakeUrl = `https://demo-bucket.s3.amazonaws.com/${Date.now()}-${file.name}`;
    return { uploadUrl: fakeUrl, fileUrl: fakeUrl };
  }
  const { data } = await apiClient.post("/uploads/presign", {
    fileName: file.name,
    fileType: file.type,
  });
  return data;
}

/**
 * Carica il file direttamente su S3 tramite la presigned URL.
 * Nota: questa richiesta NON passa dal nostro backend (va dritta su S3),
 * quindi usiamo un'istanza axios "pulita" e non l'apiClient con baseURL.
 *
 * @param {File} file
 * @param {string} uploadUrl
 * @param {(percent: number) => void} onProgress
 */
export async function uploadFileToS3(file, uploadUrl, onProgress) {
  if (DEMO_MODE) {
    // Simula un upload con progresso, senza fare rete
    for (let p = 0; p <= 100; p += 10) {
      onProgress?.(p);
      await wait(80);
    }
    return;
  }
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    },
  });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
