import { useMemo, useState } from "react";
import { GLOSSARY } from "@/data/rules";

export function GlossaryPage() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return GLOSSARY;
    return GLOSSARY.filter((t) =>
      [t.term, t.zh, t.pinyin ?? "", t.def].join(" ").toLowerCase().includes(needle),
    );
  }, [q]);

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 className="page-title" style={{ margin: 0 }}>Glossary</h1>
      <input
        className="search"
        type="search"
        placeholder="Search terms, e.g. faan, 自摸, kong…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search glossary"
      />
      <div className="col" style={{ gap: 10 }}>
        {results.map((t) => (
          <div key={t.term} className="card col" style={{ gap: 4 }}>
            <div className="row between">
              <strong>{t.term}</strong>
              <span>
                {t.zh} {t.pinyin && <span className="muted">· {t.pinyin}</span>}
              </span>
            </div>
            <span className="muted">{t.def}</span>
          </div>
        ))}
        {results.length === 0 && <p className="muted">No terms match “{q}”.</p>}
      </div>
    </div>
  );
}
