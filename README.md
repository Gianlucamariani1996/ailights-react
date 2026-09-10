# AILights — frontend React

Conversione in React del mockup AILights: upload video → analisi highlight →
risultati, più uno storico dei video già analizzati.

## Avvio rapido

```bash
npm install
npm run dev
```

Di default `VITE_DEMO_MODE=true` (vedi `.env`): l'app funziona subito **senza
alcun backend**, simulando upload e analisi con dati finti (`src/demo/mockData.js`).
Utile per lavorare sul frontend o fare una demo, prima che le API siano pronte.

Per collegare il backend reale:

1. Copia `.env.example` in `.env` (se non già presente) e imposta:
   ```
   VITE_API_BASE_URL=https://il-tuo-backend
   VITE_DEMO_MODE=false
   ```
2. Verifica/aggiorna i contratti API descritti sotto — sono **ipotesi** che ho
   dovuto assumere per poter scrivere il codice, dato che non erano ancora
   definiti al momento della conversione.

## ⚠️ Contratti API assunti (DA CONFERMARE col backend)

Ogni funzione in `src/api/*.js` ha un commento con l'ipotesi esatta. Riassunto:

### 1. Upload — richiesta presigned URL S3
```
POST {VITE_API_BASE_URL}/uploads/presign
body:     { fileName: string, fileType: string }
risposta: { uploadUrl: string, fileUrl: string }
```
`uploadUrl` è la URL firmata su cui il frontend fa un `PUT` diretto (va su S3,
non passa dal backend). `fileUrl` è la URL finale/pubblica del file, quella
che passiamo poi all'endpoint di analisi.

File: `src/api/uploads.js`

### 2. Analisi video (chiamata SINCRONA, come confermato)
```
POST {VITE_API_BASE_URL}/analyze
body:     { videoUrl: string }
risposta: AnalysisResult   ← vedi schema sotto
```
Il frontend aspetta questa risposta per popolare la schermata Risultati.
Non c'è polling/websocket: se l'analisi richiede molto tempo, il timeout
axios è impostato a 60s (`src/api/client.js`) — da alzare se necessario.

File: `src/api/analyze.js`

### 3. Storico (OPZIONALE, best-effort)
```
GET {VITE_API_BASE_URL}/videos
risposta: AnalysisResult[]
```
Se questo endpoint non esiste ancora, l'app non si rompe: lo storico mostra
solo i video analizzati durante la sessione corrente (in memoria). Quando
l'endpoint sarà pronto, basta che risponda con lo shape giusto: non serve
toccare altro codice.

File: `src/api/videos.js`

### Schema `AnalysisResult`
Documentato con JSDoc in `src/types.js`:

```js
{
  id: string,
  title: string,          // "Milan vs Inter"
  competition: string,    // "Serie A, giornata 5"
  sport: "calcio" | "tennis",
  videoUrl: string,       // URL S3 del video, usata dal <video> reale
  duration: number,       // secondi
  createdAt: string,      // ISO date
  stats: {
    highlightsFound: number,
    totalClipDuration: number, // secondi
    avgRelevance: number,      // 0-10
  },
  highlights: [
    {
      id: string,
      type: "gol" | "occasione" | "parata" | "cartellino" | "rigore",
      team: string | null,   // ora previsto su TUTTI i tipi, non solo "gol"
      startTime: number,      // secondi
      endTime: number,        // secondi
      relevanceScore: number, // 0-10
      description: string,
      clipUrl: string,        // opzionale
    },
  ],
}
```

Se il backend usa nomi di campo diversi, i punti da aggiornare sono solo due:
- `src/config/highlightTypes.js` — mappa `type` → icona/colore/etichetta
- `src/config/sports.js` — mappa `sport` → icona/etichetta

Tutto il resto (ResultsScreen, VideoPlayer, StoricoScreen) legge da questi
due file di configurazione, quindi non richiede modifiche.

### Autenticazione
Se le chiamate richiedono un token, l'unico punto da toccare è l'interceptor
commentato in `src/api/client.js`.

## Struttura del progetto

```
src/
  api/            chiamate HTTP (upload S3, analyze, storico)
  components/     NavBar, UploadScreen, ResultsScreen, VideoPlayer, StoricoScreen, icons
  config/         mapping tipo-evento → icona/colore, sport → icona/etichetta
  demo/           dati finti per DEMO MODE
  styles/         global.css (stesso design del mockup HTML originale)
  utils/          formattazione tempo/data
  types.js        JSDoc dei tipi condivisi col backend
  App.jsx         stato globale: schermata attiva, risultato corrente, storico
```

## Note implementative

- **Player video**: è un `<video>` reale (non decorativo), con controlli
  custom disegnati sopra per restare fedeli al mockup. I marker sulla barra
  di avanzamento sono posizionati in base a `highlight.startTime / duration`
  e mostrano l'icona dell'evento al passaggio del mouse (o al tocco).
- **Filtri per tipologia**: i chip "Gol / Occasioni / Parate / Cartellini"
  sono generati da `HIGHLIGHT_TYPE_ORDER` in `src/config/highlightTypes.js`,
  con i conteggi calcolati al volo dagli highlight ricevuti.
- **Squadre**: `team` è previsto su **tutti** i tipi di highlight (non solo
  "gol"). Il testo mostrato nel badge non è sempre il nome nudo della
  squadra: ogni tipo ha una sua `teamLabel(team)` in
  `src/config/highlightTypes.js` — per "rigore" diventa ad esempio
  `"Rigore per il Milan"` invece di solo `"Milan"`. Il colore del badge
  invece assume che `title` sia nel formato `"Squadra A vs Squadra B"`
  (vedi `splitTeams` in `src/utils/format.js`) per assegnare i due colori
  in modo generico (non più hard-coded su Milan/Inter).
- **Icone**: tutte da [Tabler Icons](https://tabler.io/icons) (MIT), convertite
  in componenti React in `src/components/icons.jsx`.
