/**
 * Lightweight spaced-repetition scheduler (SM-2 derivative).
 *
 * Each card tracks an ease factor, the current interval (days) and the next
 * due timestamp. Grades are simplified to the three buttons a beginner needs:
 *   "again" (forgot), "good" (recalled), "easy" (instant).
 */

export type Grade = "again" | "good" | "easy";

export interface SrsCard {
  /** Tile id this card teaches. */
  id: string;
  ease: number; // 1.3 .. ~3.0
  intervalDays: number;
  due: number; // epoch ms
  reps: number;
  lapses: number;
  /** Recent correctness for a simple mastery %. */
  history: boolean[];
}

const MIN_EASE = 1.3;
const DAY = 24 * 60 * 60 * 1000;

export function newCard(id: string, now = Date.now()): SrsCard {
  return { id, ease: 2.5, intervalDays: 0, due: now, reps: 0, lapses: 0, history: [] };
}

export function review(card: SrsCard, grade: Grade, now = Date.now()): SrsCard {
  let { ease, intervalDays, reps, lapses } = card;
  const history = [...card.history, grade !== "again"].slice(-10);

  if (grade === "again") {
    lapses += 1;
    reps = 0;
    intervalDays = 0; // relearn: due again in ~1 min (handled via due below)
    ease = Math.max(MIN_EASE, ease - 0.2);
    return { ...card, ease, intervalDays, reps, lapses, history, due: now + 60 * 1000 };
  }

  reps += 1;
  if (grade === "easy") ease += 0.15;
  // "good" keeps ease as-is.

  if (reps === 1) intervalDays = grade === "easy" ? 3 : 1;
  else if (reps === 2) intervalDays = grade === "easy" ? 6 : 3;
  else intervalDays = Math.round(intervalDays * ease * (grade === "easy" ? 1.3 : 1));

  intervalDays = Math.max(1, intervalDays);
  return { ...card, ease, intervalDays, reps, lapses, history, due: now + intervalDays * DAY };
}

export function masteryPct(card: SrsCard): number {
  if (card.history.length === 0) return 0;
  const correct = card.history.filter(Boolean).length;
  return Math.round((correct / card.history.length) * 100);
}

export function isDue(card: SrsCard, now = Date.now()): boolean {
  return card.due <= now;
}

/** Pick the next batch of due (or new) cards, due-first then least-seen. */
export function dueQueue(cards: SrsCard[], now = Date.now(), limit = 20): SrsCard[] {
  return [...cards]
    .filter((c) => isDue(c, now))
    .sort((a, b) => a.due - b.due || a.reps - b.reps)
    .slice(0, limit);
}
