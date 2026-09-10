import { useRef, useState } from "react";
import {
  IconUpload,
  IconX,
  IconClock,
  IconBallFootball,
  IconClapperboard,
} from "./icons.jsx";
import { getPresignedUrl, uploadFileToS3 } from "../api/uploads.js";
import { analyzeVideo } from "../api/analyze.js";

// Stati possibili del flusso di caricamento
const STATUS = {
  IDLE: "idle",
  UPLOADING: "uploading",
  UPLOADED: "uploaded",
  ANALYZING: "analyzing",
  ERROR_UPLOAD: "error_upload",
  ERROR_ANALYZE: "error_analyze",
};

export default function UploadScreen({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  function reset() {
    setFile(null);
    setFileUrl(null);
    setProgress(0);
    setStatus(STATUS.IDLE);
    setErrorMsg("");
  }

  async function startUpload(selectedFile) {
    setFile(selectedFile);
    setStatus(STATUS.UPLOADING);
    setProgress(0);
    setErrorMsg("");
    try {
      const { uploadUrl, fileUrl: finalUrl } = await getPresignedUrl(selectedFile);
      await uploadFileToS3(selectedFile, uploadUrl, setProgress);
      setFileUrl(finalUrl);
      setStatus(STATUS.UPLOADED);
    } catch (err) {
      console.error("Errore upload S3:", err);
      setStatus(STATUS.ERROR_UPLOAD);
      setErrorMsg(
        "Non sono riuscito a caricare il video su S3. Controlla la connessione e riprova."
      );
    }
  }

  async function handleDiscoverClick() {
    setStatus(STATUS.ANALYZING);
    setErrorMsg("");
    try {
      const result = await analyzeVideo(fileUrl);
      onAnalysisComplete(result);
      reset();
    } catch (err) {
      console.error("Errore analisi video:", err);
      setStatus(STATUS.ERROR_ANALYZE);
      setErrorMsg(
        "L'analisi del video non è andata a buon fine. Puoi riprovare senza dover ricaricare il file."
      );
    }
  }

  function handleFileInputChange(e) {
    const f = e.target.files?.[0];
    if (f) startUpload(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) startUpload(f);
  }

  const isBusy = status === STATUS.UPLOADING || status === STATUS.ANALYZING;

  return (
    <section className="screen active">
      <div className="upload-hero">
        <div className="eyebrow">
          <IconBallFootball style={{ width: 12, height: 12 }} />
          AI Sports Highlight Agent
        </div>
        <h1>Carica la partita, trova i momenti che contano</h1>
        <p>
          AILights analizza il video, individua gol, parate e azioni chiave e
          li trasforma in clip pronte per l'editing.
        </p>
      </div>

      <div
        className={"dropzone" + (dragOver ? " dragover" : "")}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime"
          onChange={handleFileInputChange}
        />

        {status === STATUS.IDLE && (
          <>
            <div className="icon-ring">
              <IconUpload style={{ width: 32, height: 32 }} />
            </div>
            <h3>Trascina qui il tuo video</h3>
            <p className="sub">oppure scegli un file dal tuo computer</p>
            <button className="browse-btn" onClick={() => inputRef.current?.click()}>
              <IconUpload style={{ width: 15, height: 15 }} />
              Seleziona video
            </button>
            <div className="formats">
              Formati supportati: <b>MP4, MOV</b>
            </div>
          </>
        )}

        {status !== STATUS.IDLE && file && (
          <>
            <div className="file-chip">
              <IconClapperboard style={{ width: 15, height: 15 }} />
              <span>
                <b>{file.name}</b>
              </span>
              {!isBusy && (
                <button onClick={reset} title="Rimuovi e carica un altro video">
                  <IconX />
                </button>
              )}
            </div>

            {status === STATUS.UPLOADING && (
              <div className="upload-progress">
                <div className="row">
                  <span>Caricamento su S3…</span>
                  <span>{progress}%</span>
                </div>
                <div className="bar">
                  <div className="fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {(status === STATUS.UPLOADED || status === STATUS.ANALYZING || status === STATUS.ERROR_ANALYZE) && (
              <>
                <button
                  className="discover-btn"
                  disabled={status === STATUS.ANALYZING}
                  onClick={handleDiscoverClick}
                >
                  {status === STATUS.ANALYZING ? (
                    <>
                      <span className="spinner" />
                      Analisi in corso…
                    </>
                  ) : (
                    <>
                      <IconBallFootball style={{ width: 16, height: 16 }} />
                      SCOPRI TUTTI GLI HIGHLIGHTS
                    </>
                  )}
                </button>
                {status === STATUS.ANALYZING && (
                  <div className="state-note">
                    <IconClock style={{ width: 12, height: 12, verticalAlign: "-2px", marginRight: 4 }} />
                    L'agente sta analizzando il video, può richiedere qualche istante.
                  </div>
                )}
              </>
            )}

            {(status === STATUS.ERROR_UPLOAD || status === STATUS.ERROR_ANALYZE) && (
              <div className="error-banner">
                {errorMsg}
                <button
                  onClick={() =>
                    status === STATUS.ERROR_UPLOAD ? startUpload(file) : handleDiscoverClick()
                  }
                >
                  Riprova
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="feat-row">
        <div className="feat">
          <IconClock style={{ width: 18, height: 18 }} />
          <div className="t">Analisi rapida</div>
          <div className="d">Elaborazione multimodale di video, audio e telecronaca.</div>
        </div>
        <div className="feat">
          <IconBallFootball style={{ width: 18, height: 18 }} />
          <div className="t">Highlight automatici</div>
          <div className="d">Timestamp, tipologia evento e relevance score per ogni clip.</div>
        </div>
        <div className="feat">
          <IconClapperboard style={{ width: 18, height: 18 }} />
          <div className="t">Pronto per l'editor</div>
          <div className="d">Clip estratte e organizzate, pronte per la revisione.</div>
        </div>
      </div>
    </section>
  );
}
