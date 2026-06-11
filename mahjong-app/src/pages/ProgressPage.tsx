import { TILES } from "@/data/tiles";
import { useProgress, type Lang } from "@/lib/store";
import { masteryPct } from "@/lib/srs";
import { RULE_STEPS } from "@/data/rules";

const LANGS: { key: Lang; label: string }[] = [
  { key: "both", label: "EN + 中文" },
  { key: "en", label: "English" },
  { key: "zh", label: "中文" },
];

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card col" style={{ gap: 2, flex: 1, minWidth: 120 }}>
      <span className="muted" style={{ fontSize: "0.8rem" }}>{label}</span>
      <strong style={{ fontSize: "1.4rem" }}>{value}</strong>
      {sub && <span className="muted" style={{ fontSize: "0.75rem" }}>{sub}</span>}
    </div>
  );
}

export function ProgressPage() {
  const { cards, quiz, setDrill, xp, lang, tutorialDone, setLang, reset } = useProgress();

  const mastered = Object.values(cards).filter((c) => c.reps >= 2 && masteryPct(c) >= 80).length;
  const seen = Object.values(cards).filter((c) => c.reps > 0).length;
  const quizAcc = quiz.attempts ? Math.round((quiz.correct / quiz.attempts) * 100) : 0;
  const drillAcc = setDrill.attempts ? Math.round((setDrill.correct / setDrill.attempts) * 100) : 0;
  const level = Math.floor(xp / 100) + 1;

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 className="page-title" style={{ margin: 0 }}>Progress</h1>

      <div className="row wrap" style={{ gap: 10 }}>
        <StatCard label="Level" value={`${level}`} sub={`${xp} XP`} />
        <StatCard label="Tiles mastered" value={`${mastered}/${TILES.length}`} sub={`${seen} seen`} />
        <StatCard label="Quiz accuracy" value={`${quizAcc}%`} sub={`${quiz.attempts} answered · best 🔥${quiz.bestStreak}`} />
        <StatCard label="Drill accuracy" value={`${drillAcc}%`} sub={`${setDrill.attempts} answered · best 🔥${setDrill.bestStreak}`} />
        <StatCard label="Rules" value={`${tutorialDone.length}/${RULE_STEPS.length}`} sub="steps complete" />
      </div>

      <section className="card col" style={{ gap: 10 }}>
        <strong>Language for labels</strong>
        <div className="row" style={{ gap: 8 }}>
          {LANGS.map((l) => (
            <button
              key={l.key}
              className={`btn grow ${lang === l.key ? "primary" : "ghost"}`}
              onClick={() => setLang(l.key)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card col" style={{ gap: 10 }}>
        <strong>Reset progress</strong>
        <span className="muted">Clears all flashcard, quiz and rules progress on this device.</span>
        <button
          className="btn"
          style={{ borderColor: "#7a2e2e" }}
          onClick={() => {
            if (confirm("Reset all progress on this device? This can't be undone.")) reset();
          }}
        >
          Reset everything
        </button>
      </section>
    </div>
  );
}
