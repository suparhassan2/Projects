/**
 * Traditional Chinese / Hong Kong mahjong tile data model.
 *
 * 144 tiles total:
 *   - 3 suits x 9 ranks x 4 copies = 108
 *   - 4 winds x 4 + 3 dragons x 4   = 28  (honors)
 *   - 4 flowers + 4 seasons         = 8   (bonus, one of each)
 *
 * We store 42 DISTINCT tile definitions (each with a `copies` count) and
 * expand them to the full 144-tile wall with `buildWall()`. Honors and bonus
 * tiles never form chows; only the three numbered suits do.
 *
 * Romanisation: Mandarin pinyin + (where it differs and matters for HK play)
 * Cantonese Jyutping, since HK tables call tiles in Cantonese.
 *
 * Glyphs use the Unicode "Mahjong Tiles" block (U+1F000–U+1F029) as a
 * font-independent reference; the app draws its own SVG faces for clarity.
 */

export type TileCategory = "suit" | "wind" | "dragon" | "flower" | "season";
export type Suit = "characters" | "bamboo" | "circles";

export interface TileNames {
  /** Plain-English label, e.g. "3 Bamboo". */
  en: string;
  /** Chinese characters, e.g. "三索". */
  zh: string;
  /** Mandarin pinyin with tone marks. */
  pinyin: string;
  /** Cantonese Jyutping (HK tables call in Cantonese). */
  jyutping: string;
}

export interface TileDef {
  /** Stable unique id, e.g. "char-1", "wind-east", "dragon-red", "flower-1". */
  id: string;
  category: TileCategory;
  /** Present for the three numbered suits only. */
  suit?: Suit;
  /** 1–9 for suits; 1–4 ordering for winds/flowers/seasons; undefined for dragons. */
  rank?: number;
  /** Copies of this tile in a full set (4 for suits/honors, 1 for bonus). */
  copies: number;
  isHonor: boolean;
  isBonus: boolean;
  /** True for rank 1 and 9 of a suit (terminals); honors are NOT terminals. */
  isTerminal: boolean;
  names: TileNames;
  /** Reference glyph from the Unicode Mahjong Tiles block. */
  glyph: string;
  /** Short tip on how to say / recognise it. */
  pronunciationHint: string;
  /** Colorblind-safe accent color for the suit/honor family. */
  color: string;
  note?: string;
}

const ZH_NUM = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
const PINYIN_NUM = ["yī", "èr", "sān", "sì", "wǔ", "liù", "qī", "bā", "jiǔ"];
const JYUT_NUM = ["jat1", "ji6", "saam1", "sei3", "ng5", "luk6", "cat1", "baat3", "gau2"];

interface SuitMeta {
  suit: Suit;
  enName: string;
  zhChar: string;
  pinyin: string;
  jyutping: string;
  glyphBase: number; // code point of the rank-1 tile
  color: string;
  note: string;
}

// Colorblind-friendly accents (Okabe–Ito-derived): blue, bluish-green, vermillion.
const SUITS: SuitMeta[] = [
  {
    suit: "characters",
    enName: "Characters",
    zhChar: "萬",
    pinyin: "wàn",
    jyutping: "maan6",
    glyphBase: 0x1f007,
    color: "#0072b2",
    note: "Also called 'Myriads' or 'Ten-thousands'. The character 萬 means 10,000.",
  },
  {
    suit: "bamboo",
    enName: "Bamboo",
    zhChar: "索",
    pinyin: "suǒ",
    jyutping: "saak3",
    glyphBase: 0x1f010,
    color: "#009e73",
    note: "1 Bamboo is traditionally drawn as a bird, not a stick.",
  },
  {
    suit: "circles",
    enName: "Circles",
    zhChar: "筒",
    pinyin: "tǒng",
    jyutping: "tung4",
    glyphBase: 0x1f019,
    color: "#d55e00",
    note: "Also called 'Dots' or 'Wheels'. HK players often say 餅 (béng).",
  },
];

function makeSuitTiles(): TileDef[] {
  const tiles: TileDef[] = [];
  for (const s of SUITS) {
    for (let rank = 1; rank <= 9; rank++) {
      tiles.push({
        id: `${s.suit === "characters" ? "char" : s.suit === "bamboo" ? "bam" : "cir"}-${rank}`,
        category: "suit",
        suit: s.suit,
        rank,
        copies: 4,
        isHonor: false,
        isBonus: false,
        isTerminal: rank === 1 || rank === 9,
        names: {
          en: `${rank} ${s.enName}`,
          zh: `${ZH_NUM[rank - 1]}${s.zhChar}`,
          pinyin: `${PINYIN_NUM[rank - 1]} ${s.pinyin}`,
          jyutping: `${JYUT_NUM[rank - 1]} ${s.jyutping}`,
        },
        glyph: String.fromCodePoint(s.glyphBase + (rank - 1)),
        pronunciationHint: `Say the number, then "${s.pinyin}". HK: "${s.jyutping}".`,
        color: s.color,
        note: rank === 1 || rank === 9 ? `${s.note} Rank ${rank} is a terminal.` : s.note,
      });
    }
  }
  return tiles;
}

interface HonorMeta {
  id: string;
  rank?: number;
  en: string;
  zh: string;
  pinyin: string;
  jyutping: string;
  glyph: string;
  color: string;
  note: string;
}

const WINDS: HonorMeta[] = [
  { id: "wind-east", rank: 1, en: "East Wind", zh: "東", pinyin: "dōng", jyutping: "dung1", glyph: "🀀", color: "#332288", note: "The dealer is always East. Round 1 is the East round." },
  { id: "wind-south", rank: 2, en: "South Wind", zh: "南", pinyin: "nán", jyutping: "naam4", glyph: "🀁", color: "#332288", note: "Seat order goes counter-clockwise: East → South → West → North." },
  { id: "wind-west", rank: 3, en: "West Wind", zh: "西", pinyin: "xī", jyutping: "sai1", glyph: "🀂", color: "#332288", note: "" },
  { id: "wind-north", rank: 4, en: "North Wind", zh: "北", pinyin: "běi", jyutping: "bak1", glyph: "🀃", color: "#332288", note: "" },
];

const DRAGONS: HonorMeta[] = [
  { id: "dragon-red", en: "Red Dragon", zh: "中", pinyin: "zhōng", jyutping: "zung1", glyph: "🀄", color: "#cc3311", note: "中 = 'centre/hit'. A pung of any dragon scores faan." },
  { id: "dragon-green", en: "Green Dragon", zh: "發", pinyin: "fā", jyutping: "faat3", glyph: "🀅", color: "#009e73", note: "發 = 'prosper/get rich' (from 發財)." },
  { id: "dragon-white", en: "White Dragon", zh: "白", pinyin: "bái", jyutping: "baak6", glyph: "🀆", color: "#555555", note: "白 = 'white/blank'. Often shown as an empty blue frame." },
];

function makeHonorTiles(): TileDef[] {
  const make = (h: HonorMeta, category: "wind" | "dragon"): TileDef => ({
    id: h.id,
    category,
    rank: h.rank,
    copies: 4,
    isHonor: true,
    isBonus: false,
    isTerminal: false,
    names: {
      en: h.en,
      zh: h.zh,
      pinyin: h.pinyin,
      jyutping: h.jyutping,
    },
    glyph: h.glyph,
    pronunciationHint: `"${h.pinyin}" (HK: "${h.jyutping}").`,
    color: h.color,
    note: h.note || undefined,
  });
  return [...WINDS.map((w) => make(w, "wind")), ...DRAGONS.map((d) => make(d, "dragon"))];
}

interface BonusMeta {
  rank: number;
  en: string;
  zh: string;
  pinyin: string;
  jyutping: string;
  glyph: string;
}

// NOTE: flower NUMBERING printed on physical tiles varies by manufacturer.
// What matters for scoring is the seat pairing 1=East, 2=South, 3=West, 4=North.
// We follow the order Plum, Orchid, Chrysanthemum, Bamboo (per the spec); the
// Unicode glyphs happen to order Bamboo before Chrysanthemum, hence the mapping.
const FLOWERS: BonusMeta[] = [
  { rank: 1, en: "Plum", zh: "梅", pinyin: "méi", jyutping: "mui4", glyph: "🀢" },
  { rank: 2, en: "Orchid", zh: "蘭", pinyin: "lán", jyutping: "laan4", glyph: "🀣" },
  { rank: 3, en: "Chrysanthemum", zh: "菊", pinyin: "jú", jyutping: "guk1", glyph: "🀥" },
  { rank: 4, en: "Bamboo", zh: "竹", pinyin: "zhú", jyutping: "zuk1", glyph: "🀤" },
];

const SEASONS: BonusMeta[] = [
  { rank: 1, en: "Spring", zh: "春", pinyin: "chūn", jyutping: "ceon1", glyph: "🀦" },
  { rank: 2, en: "Summer", zh: "夏", pinyin: "xià", jyutping: "haa6", glyph: "🀧" },
  { rank: 3, en: "Autumn", zh: "秋", pinyin: "qiū", jyutping: "cau1", glyph: "🀨" },
  { rank: 4, en: "Winter", zh: "冬", pinyin: "dōng", jyutping: "dung1", glyph: "🀩" },
];

function makeBonusTiles(): TileDef[] {
  const seatNote = (rank: number) =>
    `Bonus tile. Pairs with seat ${["East", "South", "West", "North"][rank - 1]} (${rank}). When drawn, set it aside, score it, and draw a replacement.`;
  const flowers = FLOWERS.map<TileDef>((f) => ({
    id: `flower-${f.rank}`,
    category: "flower",
    rank: f.rank,
    copies: 1,
    isHonor: false,
    isBonus: true,
    isTerminal: false,
    names: { en: `${f.en} (Flower)`, zh: f.zh, pinyin: f.pinyin, jyutping: f.jyutping },
    glyph: f.glyph,
    pronunciationHint: `"${f.pinyin}" — one of the Four Flowers (四花).`,
    color: "#aa44aa",
    note: seatNote(f.rank),
  }));
  const seasons = SEASONS.map<TileDef>((s) => ({
    id: `season-${s.rank}`,
    category: "season",
    rank: s.rank,
    copies: 1,
    isHonor: false,
    isBonus: true,
    isTerminal: false,
    names: { en: `${s.en} (Season)`, zh: s.zh, pinyin: s.pinyin, jyutping: s.jyutping },
    glyph: s.glyph,
    pronunciationHint: `"${s.pinyin}" — one of the Four Seasons (四季).`,
    color: "#e69f00",
    note: seatNote(s.rank),
  }));
  return [...flowers, ...seasons];
}

/** All 42 distinct tile definitions. */
export const TILES: TileDef[] = [
  ...makeSuitTiles(),
  ...makeHonorTiles(),
  ...makeBonusTiles(),
];

export const TILES_BY_ID: Record<string, TileDef> = Object.fromEntries(
  TILES.map((t) => [t.id, t]),
);

/** Expand definitions into the full 144-tile wall (each instance keyed). */
export interface WallTile {
  /** e.g. "char-1#2" — the 2nd copy of 1 Characters. */
  instanceId: string;
  def: TileDef;
}

export function buildWall(): WallTile[] {
  const wall: WallTile[] = [];
  for (const def of TILES) {
    for (let c = 1; c <= def.copies; c++) {
      wall.push({ instanceId: `${def.id}#${c}`, def });
    }
  }
  return wall;
}

/** Quick integrity check used by tests / the data screen. */
export function wallStats() {
  const wall = buildWall();
  const suited = TILES.filter((t) => t.category === "suit").length;
  const honors = TILES.filter((t) => t.isHonor).length;
  const bonus = TILES.filter((t) => t.isBonus).length;
  return {
    distinct: TILES.length, // 42
    total: wall.length, // 144
    suited, // 27
    honors, // 7
    bonus, // 8
  };
}

export const SUIT_LABELS: Record<Suit, { en: string; zh: string }> = {
  characters: { en: "Characters", zh: "萬子" },
  bamboo: { en: "Bamboo", zh: "索子" },
  circles: { en: "Circles", zh: "筒子" },
};
