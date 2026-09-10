import { useRef, useState } from "react";
import {
  IconUpload,
  IconX,
  IconClock,
  IconBallFootball,
  IconClapperboard,
} from "./icons.jsx";
import { analyzeVideo } from "../api/analyze.js";

// Stati possibili del flusso di caricamento.
// Niente più fase di "upload separato": il backend fa upload + analisi
// in un'unica chiamata sincrona (vedi src/api/analyze.js), quindi qui ci
// limitiamo a mettere in staging il file scelto e a lanciare l'analisi.
const STATUS = {
  IDLE: "idle",
  READY: "ready",
  ANALYZING: "analyzing",
  ERROR_ANALYZE: "error_analyze",
};

export default function UploadScreen({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  function reset() {
    setFile(null);
    setProgress(0);
    setStatus(STATUS.IDLE);
    setErrorMsg("");
  }

  function selectFile(selectedFile) {
    setFile(selectedFile);
    setProgress(0);
    setErrorMsg("");
    setStatus(STATUS.READY);
  }

  async function handleDiscoverClick() {
    setStatus(STATUS.ANALYZING);
    setErrorMsg("");
    setProgress(0);
    try {
      const result = await analyzeVideo(file, { onProgress: setProgress });
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
    if (f) selectFile(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) selectFile(f);
  }

  const isBusy = status === STATUS.ANALYZING;

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

            {status === STATUS.ANALYZING && progress < 100 && (
              <div className="upload-progress">
                <div className="row">
                  <span>Caricamento video…</span>
                  <span>{progress}%</span>
                </div>
                <div className="bar">
                  <div className="fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {(status === STATUS.READY || status === STATUS.ANALYZING || status === STATUS.ERROR_ANALYZE) && (
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
                {status === STATUS.ANALYZING && progress >= 100 && (
                  <div className="state-note">
                    <IconClock style={{ width: 12, height: 12, verticalAlign: "-2px", marginRight: 4 }} />
                    L'agente sta analizzando il video, può richiedere qualche istante.
                  </div>
                )}
              </>
            )}

            {status === STATUS.ERROR_ANALYZE && (
              <div className="error-banner">
                {errorMsg}
                <button onClick={handleDiscoverClick}>Riprova</button>
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
