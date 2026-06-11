# Mahjong Learn — Traditional / Hong Kong style 🀄

A mobile-first, offline-capable PWA that takes a complete beginner from zero to
confidently recognising all **144 traditional mahjong tiles** and understanding
the rules well enough to play a full game.

> Variant: **traditional Chinese / Hong Kong** (144 tiles, faan scoring).
> Audience: casual beginner. Labels: **bilingual (EN + 中文)**. Progress: **local, offline**.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build (PWA)
npm run preview    # serve the production build
npm run gen:tiles  # regenerate src/data/tiles.json from the data model
```

## Why this stack

- **React + Vite + TypeScript** — fast HMR, tiny config, type-safe tile/rule
  models so mahjong correctness is enforced at compile time.
- **PWA (`vite-plugin-pwa` + Workbox)** — installable, fully **offline**; the
  whole app + tile art is precached. No backend, no accounts.
- **Zustand + localStorage** — all learner progress persists **on-device**.
- **SVG-drawn tiles** — every tile face is rendered programmatically (dots for
  circles, sticks for bamboo, characters for the rest). Infinitely scalable,
  font-independent, and **colorblind-friendly** (Okabe–Ito suit accents).

## App map

```
🏠 Home        Path / progress overview, jump-back-in
🀄 Tiles       Gallery of all 144 tiles, filter by suit/honour/bonus,
               tap for detail + audio pronunciation
🎴 Cards       Spaced-repetition flashcards (SM-2 lite)
✅ Quiz        Identification quizzes (image→name & name→image)
📖 Rules       8-step illustrated rules tutorial
   /drill      "Build a valid set" drills (chow/pung/kong/pair/invalid)
   /glossary   Searchable bilingual glossary
   /me         Progress dashboard, language toggle, reset
```

## Architecture

```
src/
  data/
    tiles.ts      # THE tile data model — 42 defs → 144-tile wall (typed)
    tiles.json    # generated artifact (npm run gen:tiles)
    rules.ts      # rules tutorial steps + glossary (HK rules, variants flagged)
  components/
    Tile.tsx      # SVG tile renderer (circles/bamboo/characters/honours/bonus)
  lib/
    srs.ts        # spaced-repetition scheduler
    sets.ts       # chow/pung/kong/pair validation + explanations
    store.ts      # zustand progress store (persisted)
    storage.ts    # localStorage wrapper
    speak.ts      # Web Speech pronunciation
    labels.ts     # EN / 中文 / bilingual label helper
  pages/          # Home, Tiles, Flashcards, Quiz, Drill, Rules, Glossary, Progress
```

### The tile data model (`src/data/tiles.ts`)

42 **distinct** `TileDef`s carrying EN / 中文 / pinyin / Jyutping names, a
colorblind-safe accent, a Unicode reference glyph, terminal/honour/bonus flags
and copy counts. `buildWall()` expands them to the full **144-tile** wall:

| Group    | Distinct | × copies | Total |
|----------|---------:|---------:|------:|
| Suits (萬/索/筒, 1–9) | 27 | 4 | 108 |
| Honours (4 winds + 3 dragons) | 7 | 4 | 28 |
| Bonus (4 flowers + 4 seasons) | 8 | 1 | 8 |
| **Total** | **42** | | **144** |

## Mahjong correctness

Rules correctness is the top priority. Content reflects **common Hong Kong
house rules**, with uncertainty flagged in-app:

- ⚠ = table-agreed conventions (e.g. minimum faan to win, Thirteen Orphans
  availability) — these legitimately vary between tables.
- ⚑ = where other variants diverge (Riichi han/fu + yaku, Taiwanese 16-tile,
  American card hands).
- **Flower numbering** is printed differently across physical sets; what matters
  for scoring is the seat pairing (1=East … 4=North), noted on each bonus tile.

Set rules are unit-checked: a chow must be three consecutive tiles of one suit,
honours/bonus tiles never form chows, pung = 3 identical, kong = 4 identical.

## Roadmap (next iterations)

- Guided practice game vs. a simple hinting AI (wall/draw/discard already
  modelled via `buildWall()` and `sets.ts`).
- Authentic raster tile art option alongside the SVG faces.
- Faan score calculator for completed hands.
