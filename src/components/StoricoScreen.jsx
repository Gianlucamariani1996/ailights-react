import { IconPlay, IconStar } from "./icons.jsx";
import { getSport } from "../config/sports.js";
import { formatDate } from "../utils/format.js";

export default function StoricoScreen({ history, onSelect }) {
  if (!history || history.length === 0) {
    return (
      <section className="screen active">
        <div className="empty-state">
          Nessun video analizzato ancora.
          <br />
          Caricane uno dalla tab "Carica video" per vederlo qui.
        </div>
      </section>
    );
  }

  return (
    <section className="screen active">
      <div className="storico-grid">
        {history.map((item) => {
          const sport = getSport(item.sport);
          return (
            <div className="storico-card" key={item.id} onClick={() => onSelect(item)}>
              <div className="storico-thumb">
                <span className={"storico-sport " + sport.className}>
                  <sport.Icon />
                  {sport.label}
                </span>
                <div className="play">
                  <IconPlay />
                </div>
              </div>
              <div className="storico-body">
                <h4>{item.title}</h4>
                <div className="storico-meta">
                  {item.competition} · caricato il {formatDate(item.createdAt)}
                </div>
                <div className="storico-foot">
                  <span className="storico-count">
                    <IconStar />
                    {item.stats.highlightsFound} highlight
                  </span>
                  <span className="storico-open">Apri →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
