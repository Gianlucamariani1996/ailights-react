import { IconBolt } from "./icons.jsx";

export default function NavBar({ screen, onChangeScreen }) {
  return (
    <nav className="nav">
      <div className="logo">
        <IconBolt style={{ width: 26, height: 26 }} fill="#31e0a4" />
        <span className="logo-text">
          AI<span className="hl">Lights</span>
        </span>
      </div>
      <div className="segctrl">
        <button
          className={screen === "upload" ? "active" : ""}
          onClick={() => onChangeScreen("upload")}
        >
          Carica video
        </button>
        <button
          className={screen === "results" ? "active" : ""}
          onClick={() => onChangeScreen("results")}
        >
          Risultati
        </button>
        <button
          className={screen === "storico" ? "active" : ""}
          onClick={() => onChangeScreen("storico")}
        >
          Storico
        </button>
      </div>
    </nav>
  );
}
