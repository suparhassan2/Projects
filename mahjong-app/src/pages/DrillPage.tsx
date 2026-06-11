import { useCallback, useState } from "react";
import { TILES, TILES_BY_ID, type TileDef } from "@/data/tiles";
import { Tile } from "@/components/Tile";
import { useProgress } from "@/lib/store";
import { classifySet, explainSet, type SetType } from "@/lib/sets";

const SUITED = TILES.filter((t) => t.category === "suit");
const ALL = TILES;

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate a candidate set that may or may not be legal. */
function makeCandidate(): TileDef[] {
  const kind = Math.floor(Math.random() * 6);
  switch (kind) {
    case 0: {
      // valid chow
      const base = rand(SUITED.filter((t) => t.rank! <= 7));
      return [1, 2, 3].map((d) => TILES_BY_ID[idOf(base.suit!, base.rank! + d - 1)]);
    }
    case 1: {
      // valid pung
      const t = rand(ALL.filter((x) => !x.isBonus));
      return [t, t, t];
    }
    case 2: {
      // valid kong
      const t = rand(ALL.filter((x) => !x.isBonus));
      return [t, t, t, t];
    }
    case 3: {
      // valid pair
      const t = rand(ALL);
      return [t, t];
    }
    case 4: {
      // invalid: non-consecutive suited
      const base = rand(SUITED.filter((t) => t.rank! <= 6));
      return [
        TILES_BY_ID[idOf(base.suit!, base.rank!)],
        TILES_BY_ID[idOf(base.suit!, base.rank! + 1)],
        TILES_BY_ID[idOf(base.suit!, base.rank! + 3)],
      ];
    }
    default: {
      // invalid: mixed-suit "run" or honour run
      if (Math.random() < 0.5) {
        const a = rand(SUITED.filter((t) => t.suit === "bamboo" && t.rank! <= 7));
        return [
          a,
          TILES_BY_ID[idOf("bamboo", a.rank! + 1)],
          rand(SUITED.filter((t) => t.suit === "circles")),
        ];
      }
      const honors = TILES.filter((t) => t.isHonor);
      const h = rand(honors);
      const others = honors.filter((x) => x.id !== h.id);
      return [h, rand(others), rand(others)];
    }
  }
}

function idOf(suit: string, rank: number): string {
  const prefix = suit === "characters" ? "char" : suit === "bamboo" ? "bam" : "cir";
  return `${prefix}-${rank}`;
}

const ANSWERS: { key: SetType; label: string }[] = [
  { key: "chow", label: "Chow 順" },
  { key: "pung", label: "Pung 刻" },
  { key: "kong", label: "Kong 槓" },
  { key: "pair", label: "Pair 對" },
  { key: "invalid", label: "Not legal ✗" },
];

export function DrillPage() {
  const recordDrill = useProgress((s) => s.recordDrill);
  const [tiles, setTiles] = useState<TileDef[]>(() => makeCandidate());
  const [picked, setPicked] = useState<SetType | null>(null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const truth = classifySet(tiles);
  const explanation = explainSet(tiles);

  const next = useCallback(() => {
    setPicked(null);
    setTiles(makeCandidate());
  }, []);

  function choose(answer: SetType) {
    if (picked) return;
    const correct = answer === truth;
    setPicked(answer);
    const ns = correct ? streak + 1 : 0;
    setStreak(ns);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordDrill(correct, ns);
  }

  const answered = picked !== null;

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row between">
        <h1 className="page-title" style={{ margin: 0 }}>Set drill</h1>
        <div className="row" style={{ gap: 6 }}>
          <span className="pill">🔥 {streak}</span>
          <span className="pill">
            {score.correct}/{score.total}
          </span>
        </div>
      </div>
      <p className="muted" style={{ marginTop: -6 }}>
        Is this a legal chow, pung, kong, pair — or not a set at all?
      </p>

      <div className="card row center wrap" style={{ gap: 10, paddingTop: 24, paddingBottom: 24 }}>
        {tiles.map((t, i) => (
          <Tile key={i} def={t} size={70} />
        ))}
      </div>

      <div className="row wrap" style={{ gap: 8 }}>
        {ANSWERS.map((a) => {
          const cls = answered
            ? a.key === truth
              ? "feedback ok"
              : a.key === picked
                ? "feedback no"
                : ""
            : "";
          return (
            <button
              key={a.key}
              className={`btn grow ${cls}`}
              style={{ minWidth: 96 }}
              disabled={answered}
              onClick={() => choose(a.key)}
            >
              {a.label}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`feedback ${picked === truth ? "ok" : "no"}`}>
          {picked === truth ? "✅ Correct. " : "❌ "}
          {explanation.reason}
          <button className="btn primary" style={{ marginTop: 10, width: "100%" }} onClick={next}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
