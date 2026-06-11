import { create } from "zustand";
import { TILES } from "@/data/tiles";
import { load, save, clearAll } from "./storage";
import { newCard, review, masteryPct, type Grade, type SrsCard } from "./srs";

export type Lang = "en" | "zh" | "both";

export interface QuizStat {
  attempts: number;
  correct: number;
  bestStreak: number;
}

interface ProgressState {
  cards: Record<string, SrsCard>;
  quiz: QuizStat;
  setDrill: QuizStat;
  lang: Lang;
  /** Tutorial step ids the learner has completed. */
  tutorialDone: string[];
  xp: number;

  grade: (tileId: string, g: Grade) => void;
  recordQuiz: (correct: boolean, streak: number) => void;
  recordDrill: (correct: boolean, streak: number) => void;
  completeTutorial: (stepId: string) => void;
  setLang: (lang: Lang) => void;
  reset: () => void;

  masteredCount: () => number;
  cardFor: (tileId: string) => SrsCard;
}

const PERSIST_KEYS = ["cards", "quiz", "setDrill", "lang", "tutorialDone", "xp"] as const;

function initialCards(): Record<string, SrsCard> {
  const stored = load<Record<string, SrsCard>>("cards", {});
  const cards: Record<string, SrsCard> = {};
  for (const t of TILES) cards[t.id] = stored[t.id] ?? newCard(t.id);
  return cards;
}

const blankStat = (): QuizStat => ({ attempts: 0, correct: 0, bestStreak: 0 });

export const useProgress = create<ProgressState>((set, get) => {
  const persist = (state: ProgressState) => {
    for (const k of PERSIST_KEYS) save(k, (state as unknown as Record<string, unknown>)[k]);
  };

  return {
    cards: initialCards(),
    quiz: load<QuizStat>("quiz", blankStat()),
    setDrill: load<QuizStat>("setDrill", blankStat()),
    lang: load<Lang>("lang", "both"),
    tutorialDone: load<string[]>("tutorialDone", []),
    xp: load<number>("xp", 0),

    grade: (tileId, g) =>
      set((s) => {
        const card = s.cards[tileId] ?? newCard(tileId);
        const updated = review(card, g);
        const gainedXp = g === "again" ? 1 : g === "good" ? 5 : 8;
        const next = { ...s, cards: { ...s.cards, [tileId]: updated }, xp: s.xp + gainedXp };
        persist(next);
        return next;
      }),

    recordQuiz: (correct, streak) =>
      set((s) => {
        const quiz: QuizStat = {
          attempts: s.quiz.attempts + 1,
          correct: s.quiz.correct + (correct ? 1 : 0),
          bestStreak: Math.max(s.quiz.bestStreak, streak),
        };
        const next = { ...s, quiz, xp: s.xp + (correct ? 4 : 0) };
        persist(next);
        return next;
      }),

    recordDrill: (correct, streak) =>
      set((s) => {
        const setDrill: QuizStat = {
          attempts: s.setDrill.attempts + 1,
          correct: s.setDrill.correct + (correct ? 1 : 0),
          bestStreak: Math.max(s.setDrill.bestStreak, streak),
        };
        const next = { ...s, setDrill, xp: s.xp + (correct ? 6 : 0) };
        persist(next);
        return next;
      }),

    completeTutorial: (stepId) =>
      set((s) => {
        if (s.tutorialDone.includes(stepId)) return s;
        const next = { ...s, tutorialDone: [...s.tutorialDone, stepId], xp: s.xp + 10 };
        persist(next);
        return next;
      }),

    setLang: (lang) =>
      set((s) => {
        const next = { ...s, lang };
        persist(next);
        return next;
      }),

    reset: () => {
      clearAll();
      set((s) => ({
        ...s,
        cards: Object.fromEntries(TILES.map((t) => [t.id, newCard(t.id)])),
        quiz: blankStat(),
        setDrill: blankStat(),
        tutorialDone: [],
        xp: 0,
      }));
    },

    masteredCount: () =>
      Object.values(get().cards).filter((c) => c.reps >= 2 && masteryPct(c) >= 80).length,

    cardFor: (tileId) => get().cards[tileId] ?? newCard(tileId),
  };
});
