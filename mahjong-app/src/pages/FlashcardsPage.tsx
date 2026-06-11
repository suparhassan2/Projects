import { useMemo, useState } from "react";
import { TILES } from "@/data/tiles";
import { Tile } from "@/components/Tile";
import { useProgress } from "@/lib/store";
import { dueQueue, type Grade } from "@/lib/srs";
import { tileSubLabel } from "@/lib/labels";
import { speak } from "@/lib/speak";

const SESSION_SIZE = 15;

export function FlashcardsPage() {
  const cards = useProgress((s) => s.cards);
  const grade = useProgress((s) => s.grade);

  // Build the session once on mount (due tiles first, padded with new ones).
  const [queue] = useState<string[]>(() => {
    const due = dueQueue(Object.values(cards), Date.now(), SESSION_SIZE).map((c) => c.id);
    if (due.length >= SESSION_SIZE) return due;
    const rest = TILES.map((t) => t.id)
      .filter((id) => !due.includes(id))
      .sort(() => Math.random() - 0.5);
    return [...due, ...rest].slice(0, SESSION_SIZE);
  });

  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const lang = useProgress((s) => s.lang);

  const currentId = queue[idx];
  const def = useMemo(() => TILES.find((t) => t.id === currentId)!, [currentId]);
  const done = idx >= queue.length;

  function onGrade(g: Grade) {
    grade(currentId, g);
    setRevealed(false);
    setIdx((i) => i + 1);
  }

  if (done) {
    return (
      <div className="col center" style={{ gap: 16, paddingTop: 40 }}>
        <h1 className="page-title">Session complete 🎉</h1>
        <p className="muted">You reviewed {queue.length} tiles. Come back later for the next batch.</p>
        <button
          className="btn primary"
          onClick={() => {
            setIdx(0);
            setRevealed(false);
          }}
        >
          Review again
        </button>
      </div>
    );
  }

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row between">
        <h1 className="page-title" style={{ margin: 0 }}>Flashcards</h1>
        <span className="pill">
          {idx + 1} / {queue.length}
        </span>
      </div>
      <div className="bar">
        <span style={{ width: `${(idx / queue.length) * 100}%` }} />
      </div>

      <div
        className="card flashcard"
        role="button"
        tabIndex={0}
        onClick={() => setRevealed(true)}
        onKeyDown={(e) => e.key === "Enter" && setRevealed(true)}
      >
        <Tile def={def} size={120} />
        {revealed ? (
          <div className="col center" style={{ gap: 4 }}>
            <h2 style={{ margin: 0 }}>{def.names.en}</h2>
            <span style={{ fontSize: "1.4rem" }}>{def.names.zh}</span>
            <span className="muted">{tileSubLabel(def, lang)}</span>
            <button
              className="btn ghost"
              onClick={(e) => {
                e.stopPropagation();
                speak(def);
              }}
            >
              🔊 Hear it
            </button>
          </div>
        ) : (
          <p className="muted">Tap to reveal the name</p>
        )}
      </div>

      {revealed ? (
        <div className="row" style={{ gap: 10 }}>
          <button className="btn again grow" onClick={() => onGrade("again")}>
            Again
          </button>
          <button className="btn good grow" onClick={() => onGrade("good")}>
            Good
          </button>
          <button className="btn easy grow" onClick={() => onGrade("easy")}>
            Easy
          </button>
        </div>
      ) : (
        <button className="btn primary" onClick={() => setRevealed(true)}>
          Show answer
        </button>
      )}
    </div>
  );
}
