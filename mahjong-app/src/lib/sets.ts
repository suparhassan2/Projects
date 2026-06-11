/**
 * Rules for valid mahjong sets (traditional / HK).
 *
 *   Pair  (對子): two identical tiles. The hand's single "eyes".
 *   Chow  (順子): three consecutive tiles of the SAME numbered suit.
 *                 Honours and bonus tiles can NEVER form a chow.
 *   Pung  (刻子): three identical tiles.
 *   Kong  (槓子): four identical tiles.
 *
 * A standard winning hand = 4 sets (chow/pung/kong) + 1 pair.
 */

import type { TileDef } from "@/data/tiles";

export type SetType = "pair" | "chow" | "pung" | "kong" | "invalid";

export function classifySet(tiles: TileDef[]): SetType {
  if (tiles.length === 2) return isPair(tiles) ? "pair" : "invalid";
  if (tiles.length === 3) {
    if (isIdentical(tiles)) return "pung";
    if (isChow(tiles)) return "chow";
    return "invalid";
  }
  if (tiles.length === 4) return isIdentical(tiles) ? "kong" : "invalid";
  return "invalid";
}

export function isPair(tiles: TileDef[]): boolean {
  return tiles.length === 2 && tiles[0].id === tiles[1].id;
}

export function isIdentical(tiles: TileDef[]): boolean {
  return tiles.length >= 2 && tiles.every((t) => t.id === tiles[0].id);
}

export function isPung(tiles: TileDef[]): boolean {
  return tiles.length === 3 && isIdentical(tiles);
}

export function isKong(tiles: TileDef[]): boolean {
  return tiles.length === 4 && isIdentical(tiles);
}

export function isChow(tiles: TileDef[]): boolean {
  if (tiles.length !== 3) return false;
  if (!tiles.every((t) => t.category === "suit")) return false;
  const suit = tiles[0].suit;
  if (!tiles.every((t) => t.suit === suit)) return false;
  const ranks = tiles.map((t) => t.rank!).sort((a, b) => a - b);
  return ranks[1] === ranks[0] + 1 && ranks[2] === ranks[1] + 1;
}

/** Human-readable explanation of why a selection is / isn't a valid set. */
export function explainSet(tiles: TileDef[]): { type: SetType; reason: string } {
  const type = classifySet(tiles);
  if (type === "invalid") {
    if (tiles.length < 2) return { type, reason: "A set needs at least 2 tiles (a pair)." };
    if (tiles.length > 4) return { type, reason: "A set is at most 4 tiles (a kong)." };
    const allSuited = tiles.every((t) => t.category === "suit");
    if (tiles.length === 3 && !allSuited && !isIdentical(tiles)) {
      return { type, reason: "Honours/bonus tiles can only form pungs or kongs, never runs." };
    }
    if (tiles.length === 3 && allSuited) {
      const suits = new Set(tiles.map((t) => t.suit));
      if (suits.size > 1) return { type, reason: "A chow must stay within one suit." };
      return { type, reason: "Three suited tiles must be consecutive (e.g. 3-4-5) to be a chow." };
    }
    return { type, reason: "These tiles don't form a legal set." };
  }
  const labels: Record<Exclude<SetType, "invalid">, string> = {
    pair: "Pair (對子) — two identical tiles, used as the hand's eyes.",
    chow: "Chow (順子) — a run of three consecutive tiles in one suit.",
    pung: "Pung (刻子) — three identical tiles.",
    kong: "Kong (槓子) — four identical tiles; draw a replacement after declaring.",
  };
  return { type, reason: labels[type] };
}
