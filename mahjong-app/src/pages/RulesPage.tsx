import { useState } from "react";
import { RULE_STEPS } from "@/data/rules";
import { TILES_BY_ID } from "@/data/tiles";
import { Tile } from "@/components/Tile";
import { useProgress } from "@/lib/store";

function renderLine(line: string, i: number) {
  if (line.startsWith("⚑")) {
    return (
      <p key={i} className="variant-note">
        {line}
      </p>
    );
  }
  if (line.startsWith("⚠")) {
    return (
      <p key={i} className="caution-note">
        {line}
      </p>
    );
  }
  return <p key={i}>{line}</p>;
}

export function RulesPage() {
  const [i, setI] = useState(0);
  const tutorialDone = useProgress((s) => s.tutorialDone);
  const complete = useProgress((s) => s.completeTutorial);

  const step = RULE_STEPS[i];
  const isLast = i === RULE_STEPS.length - 1;
  const done = tutorialDone.includes(step.id);

  function nextStep() {
    complete(step.id);
    if (!isLast) setI((n) => n + 1);
  }

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row between">
        <h1 className="page-title" style={{ margin: 0 }}>Rules tutorial</h1>
        <span className="pill">
          {i + 1} / {RULE_STEPS.length}
        </span>
      </div>

      <div className="row wrap" style={{ gap: 6 }}>
        {RULE_STEPS.map((s, idx) => (
          <button
            key={s.id}
            className="pill"
            style={
              idx === i
                ? { background: "var(--accent)", color: "#1a1205", borderColor: "var(--accent)" }
                : tutorialDone.includes(s.id)
                  ? { borderColor: "var(--accent-2)" }
                  : undefined
            }
            onClick={() => setI(idx)}
            aria-label={`Go to ${s.title}`}
          >
            {tutorialDone.includes(s.id) ? "✓ " : ""}
            {idx + 1}
          </button>
        ))}
      </div>

      <article className="card col" style={{ gap: 10 }}>
        <h2 style={{ margin: 0 }}>
          {step.title} {step.zh && <span className="muted">{step.zh}</span>}
        </h2>
        {step.tiles && (
          <div className="row wrap center" style={{ gap: 8 }}>
            {step.tiles.map((id, k) => (
              <Tile key={k} def={TILES_BY_ID[id]} size={52} />
            ))}
          </div>
        )}
        <div className="rule-body">{step.body.map(renderLine)}</div>
      </article>

      <div className="row" style={{ gap: 10 }}>
        <button className="btn grow" disabled={i === 0} onClick={() => setI((n) => n - 1)}>
          ← Back
        </button>
        <button className="btn primary grow" onClick={nextStep}>
          {isLast ? (done ? "Finish ✓" : "Mark complete ✓") : "Next →"}
        </button>
      </div>

      <p className="muted" style={{ textAlign: "center" }}>
        Rules reflect common Hong Kong house rules. Items marked ⚠ are table-agreed; ⚑ marks other variants.
      </p>
    </div>
  );
}
