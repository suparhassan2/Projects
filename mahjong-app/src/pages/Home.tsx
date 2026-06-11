import { Link } from "react-router-dom";
import { TILES, wallStats } from "@/data/tiles";
import { useProgress } from "@/lib/store";
import { Tile } from "@/components/Tile";

export function Home() {
  const mastered = useProgress((s) => s.masteredCount());
  const xp = useProgress((s) => s.xp);
  const stats = wallStats();
  const pct = Math.round((mastered / TILES.length) * 100);

  const level = Math.floor(xp / 100) + 1;
  const path = [
    { label: "Recognise the tiles", done: pct >= 40, to: "/cards", cta: "Flashcards" },
    { label: "Test your recall", done: useProgress.getState().quiz.attempts >= 10, to: "/quiz", cta: "Quizzes" },
    { label: "Build legal sets", done: useProgress.getState().setDrill.attempts >= 10, to: "/drill", cta: "Set drills" },
    { label: "Learn the rules", done: useProgress.getState().tutorialDone.length >= 6, to: "/rules", cta: "Rules tutorial" },
  ];

  const sampleTiles = [TILES[2], TILES[12], TILES[20], TILES[27], TILES[31]];

  return (
    <div className="col" style={{ gap: 18 }}>
      <header>
        <div className="row between">
          <span className="pill">Traditional · 香港麻將</span>
          <span className="pill">Lv {level} · {xp} XP</span>
        </div>
        <h1 className="page-title" style={{ marginBottom: 4 }}>
          Learn Mahjong from zero
        </h1>
        <p className="muted" style={{ marginTop: 0 }}>
          All {stats.total} tiles and the rules to play a full game.
        </p>
      </header>

      <div className="row center" style={{ gap: 8 }}>
        {sampleTiles.map((t) => (
          <Tile key={t.id} def={t} size={52} />
        ))}
      </div>

      <section className="card col">
        <div className="row between">
          <strong>Tiles mastered</strong>
          <span className="muted">
            {mastered} / {TILES.length}
          </span>
        </div>
        <div className="bar">
          <span style={{ width: `${pct}%` }} />
        </div>
        <Link to="/cards" className="btn primary" style={{ textAlign: "center", textDecoration: "none" }}>
          Continue learning
        </Link>
      </section>

      <section className="col">
        <h2 style={{ fontSize: "1.1rem", margin: "4px 0" }}>Your path</h2>
        {path.map((step, i) => (
          <Link
            key={i}
            to={step.to}
            className="card row between"
            style={{ textDecoration: "none", color: "var(--text)" }}
          >
            <span className="row" style={{ gap: 10 }}>
              <span aria-hidden="true">{step.done ? "✅" : `${i + 1}️⃣`}</span>
              <span>{step.label}</span>
            </span>
            <span className="pill">{step.cta} →</span>
          </Link>
        ))}
      </section>

      <section className="row wrap" style={{ gap: 10 }}>
        <Link to="/glossary" className="btn ghost grow" style={{ textAlign: "center", textDecoration: "none" }}>
          📚 Glossary
        </Link>
        <Link to="/me" className="btn ghost grow" style={{ textAlign: "center", textDecoration: "none" }}>
          📈 Progress
        </Link>
      </section>
    </div>
  );
}
