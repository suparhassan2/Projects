import { useCallback, useState } from "react";
import { TILES, type TileDef } from "@/data/tiles";
import { Tile } from "@/components/Tile";
import { useProgress } from "@/lib/store";
import { tileLabel } from "@/lib/labels";
import { speak } from "@/lib/speak";

type Mode = "imageToName" | "nameToImage";

interface Question {
  mode: Mode;
  answer: TileDef;
  options: TileDef[];
}

function sample<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function makeQuestion(): Question {
  const mode: Mode = Math.random() < 0.5 ? "imageToName" : "nameToImage";
  const answer = TILES[Math.floor(Math.random() * TILES.length)];
  // Prefer distractors from the same family so it's a real recognition test.
  const family = TILES.filter(
    (t) => t.id !== answer.id && (t.suit === answer.suit || t.category === answer.category),
  );
  const pool = family.length >= 3 ? family : TILES.filter((t) => t.id !== answer.id);
  const distractors = sample(pool, 3);
  const options = sample([answer, ...distractors], 4);
  return { mode, answer, options };
}

export function QuizPage() {
  const lang = useProgress((s) => s.lang);
  const recordQuiz = useProgress((s) => s.recordQuiz);
  const grade = useProgress((s) => s.grade);

  const [q, setQ] = useState<Question>(() => makeQuestion());
  const [picked, setPicked] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const next = useCallback(() => {
    setPicked(null);
    setQ(makeQuestion());
  }, []);

  function choose(opt: TileDef) {
    if (picked) return;
    const correct = opt.id === q.answer.id;
    setPicked(opt.id);
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordQuiz(correct, newStreak);
    // Feed the quiz result back into spaced repetition.
    grade(q.answer.id, correct ? "good" : "again");
    if (correct) speak(q.answer);
  }

  const answered = picked !== null;

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row between">
        <h1 className="page-title" style={{ margin: 0 }}>Quiz</h1>
        <div className="row" style={{ gap: 6 }}>
          <span className="pill">🔥 {streak}</span>
          <span className="pill">
            {score.correct}/{score.total}
          </span>
        </div>
      </div>

      <div className="card col center" style={{ gap: 14, paddingTop: 22, paddingBottom: 22 }}>
        {q.mode === "imageToName" ? (
          <>
            <p className="muted" style={{ margin: 0 }}>Which tile is this?</p>
            <Tile def={q.answer} size={120} onClick={() => speak(q.answer)} />
          </>
        ) : (
          <>
            <p className="muted" style={{ margin: 0 }}>Pick the tile for:</p>
            <h2 style={{ margin: 0, textAlign: "center" }}>
              {q.answer.names.en}
              <div style={{ fontSize: "1.6rem" }}>{q.answer.names.zh}</div>
            </h2>
          </>
        )}
      </div>

      <div className="choices">
        {q.options.map((opt) => {
          const isAnswer = opt.id === q.answer.id;
          const isPicked = opt.id === picked;
          const cls = answered
            ? isAnswer
              ? "feedback ok"
              : isPicked
                ? "feedback no"
                : ""
            : "";
          return (
            <button
              key={opt.id}
              className={`btn ${cls}`}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minHeight: 96 }}
              disabled={answered}
              onClick={() => choose(opt)}
            >
              {q.mode === "imageToName" ? (
                <span style={{ textAlign: "center" }}>{tileLabel(opt, lang)}</span>
              ) : (
                <Tile def={opt} size={64} />
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`feedback ${picked === q.answer.id ? "ok" : "no"}`}>
          {picked === q.answer.id ? "Correct! " : `Not quite — it's ${q.answer.names.en} (${q.answer.names.zh}). `}
          <button className="btn primary" style={{ marginTop: 10, width: "100%" }} onClick={next}>
            Next question →
          </button>
        </div>
      )}
    </div>
  );
}
