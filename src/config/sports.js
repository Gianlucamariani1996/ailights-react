import { IconBallFootball, IconBallTennis } from "../components/icons.jsx";

// ⚠️ CONTRATTO DA CONFERMARE COL BACKEND: valore atteso nel campo `sport`.
export const SPORTS = {
  calcio: { label: "Calcio", Icon: IconBallFootball, className: "calcio" },
  tennis: { label: "Tennis", Icon: IconBallTennis, className: "tennis" },
};

export function getSport(sport) {
  return SPORTS[sport] || SPORTS.calcio;
}
