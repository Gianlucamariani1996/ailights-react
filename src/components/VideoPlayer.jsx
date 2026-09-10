import { useRef, useState } from "react";
import { IconPlay } from "./icons.jsx";
import { getHighlightType } from "../config/highlightTypes.js";
import { formatTime } from "../utils/format.js";

export default function VideoPlayer({ result, onSelectHighlight }) {
  const videoRef = useRef(null);
  const trackRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(result.duration || 0);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }

  function seekTo(seconds) {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = seconds;
    setCurrentTime(seconds);
  }

  function handleTrackClick(e) {
    if (!trackRef.current || !duration) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    seekTo(ratio * duration);
  }

  const fillPct = duration ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="player">
      <video
        ref={videoRef}
        src={result.videoUrl}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          // se il video reale espone una durata, la preferiamo a quella del backend
          if (e.currentTarget.duration && Number.isFinite(e.currentTarget.duration)) {
            setDuration(e.currentTarget.duration);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {!isPlaying && (
        <button className="playbtn" onClick={togglePlay} aria-label="Play">
          <IconPlay />
        </button>
      )}

      <div className="barbottom">
        <span className="time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <div className="track" ref={trackRef} onClick={handleTrackClick}>
          <div className="fill" style={{ width: `${fillPct}%` }} />
          <div className="marks">
            {result.highlights.map((h) => {
              const meta = getHighlightType(h.type);
              const left = duration ? Math.min(100, (h.startTime / duration) * 100) : 0;
              return (
                <div
                  key={h.id}
                  className="mark"
                  style={{ left: `${left}%` }}
                  aria-label={`${meta.label} — ${formatTime(h.startTime)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    seekTo(h.startTime);
                    onSelectHighlight?.(h);
                  }}
                >
                  <span className="dot" style={{ background: meta.hex }} />
                  <span className="icon" style={{ background: meta.soft, borderColor: meta.color }}>
                    <meta.Icon style={{ width: 15, height: 15, color: meta.hex }} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
