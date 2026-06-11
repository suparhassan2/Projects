import { useMemo, useState } from "react";
import { TILES, type TileDef } from "@/data/tiles";
import { Tile } from "@/components/Tile";
import { useProgress } from "@/lib/store";
import { tileLabel, tileSubLabel } from "@/lib/labels";
import { masteryPct } from "@/lib/srs";
import { speak } from "@/lib/speak";

type Filter = "all" | "characters" | "bamboo" | "circles" | "honors" | "bonus";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All 144" },
  { key: "characters", label: "萬 Characters" },
  { key: "bamboo", label: "索 Bamboo" },
  { key: "circles", label: "筒 Circles" },
  { key: "honors", label: "Honours" },
  { key: "bonus", label: "Bonus" },
];

function matches(t: TileDef, f: Filter): boolean {
  if (f === "all") return true;
  if (f === "honors") return t.isHonor;
  if (f === "bonus") return t.isBonus;
  return t.suit === f;
}

export function TilesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<TileDef | null>(null);
  const lang = useProgress((s) => s.lang);
  const cards = useProgress((s) => s.cards);

  const shown = useMemo(() => TILES.filter((t) => matches(t, filter)), [filter]);

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 className="page-title">Tile gallery</h1>

      <div className="row wrap" style={{ gap: 8 }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`pill ${filter === f.key ? "active-pill" : ""}`}
            style={
              filter === f.key
                ? { background: "var(--accent)", color: "#1a1205", borderColor: "var(--accent)" }
                : undefined
            }
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="tile-grid">
        {shown.map((t) => {
          const mp = masteryPct(cards[t.id] ?? ({ history: [] } as never));
          return (
            <div key={t.id} className="col center" style={{ gap: 6 }}>
              <Tile def={t} size={84} onClick={() => { setActive(t); speak(t); }} />
              <div className="col center" style={{ gap: 2 }}>
                <span style={{ fontSize: "0.8rem", textAlign: "center" }}>{tileLabel(t, lang)}</span>
                {mp > 0 && (
                  <span className="pill" style={{ fontSize: "0.62rem", padding: "1px 7px" }}>
                    {mp}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {active && (
        <div className="tile-sheet" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <div className="card col center tile-sheet-inner" onClick={(e) => e.stopPropagation()}>
            <Tile def={active} size={130} />
            <h2 style={{ margin: "10px 0 0" }}>{active.names.en}</h2>
            <div className="row center" style={{ gap: 8 }}>
              <span style={{ fontSize: "1.4rem" }}>{active.names.zh}</span>
              <span className="muted">{tileSubLabel(active, lang)}</span>
            </div>
            <p className="muted" style={{ textAlign: "center" }}>{active.pronunciationHint}</p>
            {active.note && <p style={{ textAlign: "center" }}>{active.note}</p>}
            <div className="row" style={{ gap: 10 }}>
              <button className="btn" onClick={() => speak(active)}>🔊 Say it</button>
              <button className="btn primary" onClick={() => setActive(null)}>Close</button>
            </div>
            <span className="pill">
              {active.copies} {active.copies === 1 ? "copy" : "copies"} in a set
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
