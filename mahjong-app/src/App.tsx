import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { TilesPage } from "./pages/TilesPage";
import { FlashcardsPage } from "./pages/FlashcardsPage";
import { QuizPage } from "./pages/QuizPage";
import { DrillPage } from "./pages/DrillPage";
import { RulesPage } from "./pages/RulesPage";
import { GlossaryPage } from "./pages/GlossaryPage";
import { ProgressPage } from "./pages/ProgressPage";

const TABS = [
  { to: "/", ico: "🏠", label: "Home", end: true },
  { to: "/tiles", ico: "🀄", label: "Tiles" },
  { to: "/cards", ico: "🎴", label: "Cards" },
  { to: "/quiz", ico: "✅", label: "Quiz" },
  { to: "/rules", ico: "📖", label: "Rules" },
];

export function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tiles" element={<TilesPage />} />
            <Route path="/cards" element={<FlashcardsPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/drill" element={<DrillPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/me" element={<ProgressPage />} />
          </Routes>
        </main>
        <nav className="tabbar" aria-label="Primary">
          <div className="tabbar-inner">
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
              >
                <span className="ico" aria-hidden="true">
                  {t.ico}
                </span>
                <span>{t.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </HashRouter>
  );
}
