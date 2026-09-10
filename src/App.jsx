import { useEffect, useState } from "react";
import NavBar from "./components/NavBar.jsx";
import UploadScreen from "./components/UploadScreen.jsx";
import ResultsScreen from "./components/ResultsScreen.jsx";
import StoricoScreen from "./components/StoricoScreen.jsx";
import { fetchVideoHistory } from "./api/videos.js";

export default function App() {
  const [screen, setScreen] = useState("upload");
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Storico: best-effort. Se l'endpoint GET /videos non esiste ancora sul
  // backend, semplicemente non lo popoliamo da remoto: restano visibili
  // solo i video analizzati durante questa sessione (vedi handleAnalysisComplete).
  useEffect(() => {
    fetchVideoHistory()
      .then(setHistory)
      .catch((err) => {
        console.warn("Storico non disponibile dal backend (ok, si può ignorare per ora):", err);
      });
  }, []);

  function handleAnalysisComplete(result) {
    setCurrentResult(result);
    setHistory((prev) => [result, ...prev.filter((r) => r.id !== result.id)]);
    setScreen("results");
  }

  function handleSelectFromHistory(item) {
    setCurrentResult(item);
    setScreen("results");
  }

  return (
    <>
      <NavBar screen={screen} onChangeScreen={setScreen} />
      <div className="wrap">
        {screen === "upload" && (
          <UploadScreen onAnalysisComplete={handleAnalysisComplete} />
        )}

        {screen === "results" &&
          (currentResult ? (
            <ResultsScreen result={currentResult} />
          ) : (
            <section className="screen active">
              <div className="empty-state">
                Nessun video analizzato ancora in questa sessione.
                <br />
                Caricane uno oppure aprine uno dallo Storico.
              </div>
            </section>
          ))}

        {screen === "storico" && (
          <StoricoScreen history={history} onSelect={handleSelectFromHistory} />
        )}
      </div>
    </>
  );
}
