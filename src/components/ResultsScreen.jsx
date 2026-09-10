import { useMemo, useRef, useState } from "react";
import VideoPlayer from "./VideoPlayer.jsx";
import { IconBolt, IconLayoutGrid, IconPlay, IconDownload, IconStar } from "./icons.jsx";
import { HIGHLIGHT_TYPE_ORDER, getHighlightType } from "../config/highlightTypes.js";
import { getSport } from "../config/sports.js";
import { formatTime, splitTeams } from "../utils/format.js";
import { DEMO_MODE } from "../api/client.js";
import { generateReel } from "../api/videos.js";

export default function ResultsScreen({ result }) {
  const [filter, setFilter] = useState("tutti");
  const [reelState, setReelState] = useState({ status: "idle" });
  const playerRef = useRef(null);

  function handleWatchClip(h) {
    playerRef.current?.playFrom(h.startTime);
    playerRef.current?.scrollIntoView?.({ behavior: "smooth", block: "center" });
  }

  async function handleGenerateReel() {
    if (DEMO_MODE) {
      setReelState({
        status: "error",
        message: "La generazione del reel richiede un backend reale: non disponibile in demo mode.",
      });
      return;
    }
    setReelState({ status: "loading" });
    try {
      const url = await generateReel(result.id);
      setReelState({ status: "ready", url });
    } catch (err) {
      console.error("Errore generazione reel:", err);
      setReelState({
        status: "error",
        message: err.message || "Generazione del reel non riuscita.",
      });
    }
  }

  const [teamA, teamB] = useMemo(() => splitTeams(result.title), [result.title]);
  const teamClass = (team) => {
    if (team === teamA) return "a";
    if (team === teamB) return "b";
    return "";
  };

  const counts = useMemo(() => {
    const c = {};
    for (const h of result.highlights) c[h.type] = (c[h.type] || 0) + 1;
    return c;
  }, [result.highlights]);

  const filtered =
    filter === "tutti" ? result.highlights : result.highlights.filter((h) => h.type === filter);

  const sport = getSport(result.sport);

  return (
    <section className="screen active">
      <div className="res-top">
        <div>
          <VideoPlayer ref={playerRef} result={result} />

          <div className="video-meta">
            <div className="row1">
              <h2>
                {result.title}
                {result.competition && ` — ${result.competition}`}
              </h2>
              <span className="sportbadge">
                <sport.Icon style={{ width: 12, height: 12 }} />
                {sport.label}
              </span>
              <span className="aibadge">
                <IconBolt style={{ width: 12, height: 12 }} />
                Analizzato da AILights
              </span>
            </div>
            <p className="desc">
              Partita analizzata a livello multimodale: incrocio di computer vision,
              telecronaca e reazioni del pubblico. Individuati {result.stats.highlightsFound}{" "}
              momenti salienti.
            </p>
          </div>
        </div>

        <div className="stats-card">
          <h4>Riepilogo analisi</h4>
          <div className="stat-line">
            <span className="k">Highlight trovati</span>
            <span className="v">{result.stats.highlightsFound}</span>
          </div>
          <div className="stat-line">
            <span className="k">Durata totale clip</span>
            <span className="v">{formatTime(result.stats.totalClipDuration)}</span>
          </div>
          <button className="cta" onClick={handleGenerateReel} disabled={reelState.status === "loading"}>
            {reelState.status === "loading" ? (
              <>
                <span className="spinner" />
                Generazione in corso…
              </>
            ) : (
              <>
                <IconLayoutGrid style={{ width: 14, height: 14 }} />
                Genera highlight reel
              </>
            )}
          </button>

          {reelState.status === "error" && (
            <div className="error-banner" style={{ margin: "12px 0 0", maxWidth: "none" }}>
              {reelState.message}
            </div>
          )}

          {reelState.status === "ready" && (
            <div style={{ marginTop: 14 }}>
              <video
                src={reelState.url}
                controls
                style={{ width: "100%", borderRadius: 10, display: "block" }}
              />
              <a
                className="cta"
                href={reelState.url}
                download
                style={{ marginTop: 10, textDecoration: "none" }}
              >
                <IconDownload style={{ width: 14, height: 14 }} />
                Scarica il reel
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="chips">
        <div
          className={"chip" + (filter === "tutti" ? " on" : "")}
          onClick={() => setFilter("tutti")}
        >
          Tutti <span className="chip-count">– {result.highlights.length}</span>
        </div>
        {HIGHLIGHT_TYPE_ORDER.filter((type) => counts[type] > 0).map((type) => {
          const meta = getHighlightType(type);
          const count = counts[type];
          return (
            <div
              key={type}
              className={"chip" + (filter === type ? " on" : "")}
              onClick={() => setFilter(type)}
            >
              <meta.Icon />
              {meta.label} <span className="chip-count">– {count}</span>
            </div>
          );
        })}
      </div>

      <div className="hl-grid">
        {filtered.length === 0 && (
          <div className="hl-empty">Nessun highlight in questa categoria.</div>
        )}
        {filtered.map((h) => {
          const meta = getHighlightType(h.type);
          return (
            <div className="hl-card" key={h.id}>
              <div className="hl-top">
                <div className="hl-type">
                  <div className="hl-icon" style={{ background: meta.soft }}>
                    <meta.Icon style={{ color: meta.hex }} />
                  </div>
                  <div>
                    <div className="hl-name">
                      {meta.label}
                      {h.team && (
                        <span className={"team-tag " + teamClass(h.team)}>
                          {meta.teamLabel(h.team)}
                        </span>
                      )}
                    </div>
                    <div className="hl-time">
                      {formatTime(h.startTime)} – {formatTime(h.endTime)}
                    </div>
                  </div>
                </div>
                <span className="score">
                  <IconStar />
                  {h.relevance}
                </span>
              </div>
              <p className="hl-desc">{h.description}</p>
              <div className="hl-actions">
                <button className="primary" onClick={() => handleWatchClip(h)}>
                  <IconPlay style={{ width: 12, height: 12 }} />
                  Guarda clip
                </button>
                <button>
                  <IconDownload style={{ width: 12, height: 12 }} />
                  Scarica
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
