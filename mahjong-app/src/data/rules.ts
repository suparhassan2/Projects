/**
 * Rules tutorial content — traditional Chinese / Hong Kong mahjong.
 *
 * Sources cross-checked: HK Mahjong (Cantonese) common house rules. Where
 * tables differ (minimum faan, optional yaku, scoring tables) it is flagged
 * inline as a "house rule". Riichi / Taiwanese / American differences are
 * noted with a ⚑.
 */

export interface RuleStep {
  id: string;
  title: string;
  zh?: string;
  /** Paragraphs; lines starting with "⚑" are variant call-outs, "⚠" cautions. */
  body: string[];
  /** Optional tile ids to illustrate the step. */
  tiles?: string[];
}

export const RULE_STEPS: RuleStep[] = [
  {
    id: "goal",
    title: "The goal",
    zh: "目標",
    body: [
      "Mahjong is a game for 4 players. Each player holds a concealed hand and, on their turn, draws and discards one tile.",
      "You win (declare 食糊 / 'Mahjong') when your 14-tile hand forms 4 sets + 1 pair.",
      "A 'set' is a Chow, Pung, or Kong. The 'pair' (the eyes 眼) is two identical tiles.",
      "⚑ Taiwanese mahjong uses 16-tile hands (5 sets + 1 pair). Riichi uses 13-tile hands but the 4-sets-1-pair shape is the same.",
    ],
    tiles: ["bam-2", "bam-3", "bam-4", "cir-5", "cir-5", "cir-5", "dragon-red", "dragon-red"],
  },
  {
    id: "tiles",
    title: "The tiles",
    zh: "麻將牌",
    body: [
      "144 tiles in total. Three numbered suits run 1–9 with four copies each: Characters (萬), Bamboo (索) and Circles (筒).",
      "Honour tiles: four Winds (East 東, South 南, West 西, North 北) and three Dragons (Red 中, Green 發, White 白), four copies each.",
      "Eight bonus tiles: four Flowers and four Seasons, one of each. They never sit in your hand as part of a set — you set them aside for bonus points and draw a replacement.",
    ],
    tiles: ["char-1", "bam-1", "cir-1", "wind-east", "dragon-green", "flower-1", "season-1"],
  },
  {
    id: "sets",
    title: "Sets: Chow, Pung, Kong",
    zh: "順、刻、槓",
    body: [
      "Chow (順子): three consecutive tiles in the SAME suit, e.g. 3-4-5 Circles. Honours and bonus tiles can never form a chow.",
      "Pung (刻子): three identical tiles, e.g. three Red Dragons.",
      "Kong (槓子): four identical tiles. When you declare a kong you draw an extra replacement tile, because a kong still only counts as one set.",
      "⚠ You may only claim a Chow from the player to your LEFT (the one who discarded just before your turn). Pung and Kong can be claimed from anyone.",
    ],
    tiles: ["cir-3", "cir-4", "cir-5", "dragon-red", "dragon-red", "dragon-red"],
  },
  {
    id: "turn",
    title: "Turn flow & the wall",
    zh: "出牌次序",
    body: [
      "The 144 tiles are shuffled face-down and built into a square wall, then players draw from it. Play proceeds counter-clockwise.",
      "On your turn you draw one tile from the wall, then discard one tile face-up. The next player may either draw, or claim your discard to complete a set.",
      "The last 14 tiles form the 'dead wall' (in HK play, kong replacement tiles are drawn from the back of the wall). When the wall runs out with no winner, the hand is a draw (流局) and the dealer keeps the deal.",
    ],
  },
  {
    id: "calling",
    title: "Calling: Pung, Kong, Chow, Mahjong",
    zh: "上、碰、槓、食糊",
    body: [
      "When a tile you need is discarded, you may call it: say 'Pung' (碰) for a triplet, 'Kong' (槓) for a quad, or 'Chow' (上, left player only) for a run. Claimed sets are revealed face-up (exposed/melded).",
      "Calling Pung/Kong skips players between you and the discarder; play then continues to your right.",
      "Declaring a win is 'Mahjong' (食糊 / 胡). You can win by self-draw (自摸) or by claiming someone's discard (出銃 — that player often pays more).",
      "⚠ Priority: a win beats a Pung/Kong, which beats a Chow, when several players call the same discard.",
    ],
  },
  {
    id: "seating",
    title: "Seats, dealer & rounds",
    zh: "莊家與圈風",
    body: [
      "Seats are named after the winds. The dealer is always East (莊家). Play is East → South → West → North, counter-clockwise.",
      "If the dealer wins or the hand is a draw, the dealer keeps the deal; otherwise the deal passes to the next player (the East seat rotates).",
      "A full game cycles through a prevailing 'round wind' (圈風): the East round, then South, etc. Your Seat Wind and the Round Wind both matter for scoring — a pung of either scores extra faan.",
    ],
    tiles: ["wind-east", "wind-south", "wind-west", "wind-north"],
  },
  {
    id: "scoring",
    title: "Scoring with faan (番)",
    zh: "番數",
    body: [
      "HK scoring counts faan (番) — points for special patterns. Common faan: All one suit, a pung of dragons, a pung of your seat/round wind, a fully concealed self-drawn hand, all-pungs, etc.",
      "⚠ House rule: most tables require a MINIMUM faan to declare a win (commonly 3 faan, sometimes 1 or 0). Agree this before you start.",
      "Faan convert to payment on a doubling scale, usually capped at a 'limit' (滿糊). The winner collects from all three opponents (more if someone 'fed' the winning tile).",
      "⚑ This differs sharply from Riichi (han + fu, yaku required) and American (card-based hands). Keep to one rule set per game.",
    ],
  },
  {
    id: "hands",
    title: "Common winning hands",
    zh: "牌型",
    body: [
      "Mixed One Suit (混一色): one suit plus honours.",
      "All One Suit (清一色): a single suit only — a big faan hand.",
      "All Pungs (對對糊): four pungs/kongs + a pair, no chows.",
      "All Honours / Great or Small Dragons / Four Winds: rare limit hands worth the maximum.",
      "Thirteen Orphans (十三么) is a famous special hand: one of each terminal and honour plus a pair — though availability is a house rule in HK.",
    ],
    tiles: ["cir-1", "cir-1", "cir-3", "cir-4", "cir-5", "cir-7", "cir-8", "cir-9"],
  },
  {
    id: "etiquette",
    title: "Terminology & etiquette",
    zh: "禮儀",
    body: [
      "Announce your calls clearly and in order; don't discard before others have had the chance to claim.",
      "Keep your hand concealed, discard tiles neatly into the centre, and don't 'string' discards to confuse opponents.",
      "Key terms: 食糊 win, 自摸 self-draw, 詐糊 false win (penalised!), 聽牌 ready/waiting, 出銃 discarding the winning tile, 流局 a drawn hand.",
    ],
  },
];

export interface GlossaryTerm {
  term: string;
  zh: string;
  pinyin?: string;
  def: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  { term: "Chow", zh: "順子", pinyin: "shùnzǐ", def: "A run of three consecutive tiles in the same suit. Claimable only from the player on your left." },
  { term: "Pung", zh: "刻子 / 碰", pinyin: "kèzǐ", def: "Three identical tiles. Claimable from any player's discard." },
  { term: "Kong", zh: "槓", pinyin: "gàng", def: "Four identical tiles. Declaring one earns a replacement draw." },
  { term: "Pair / Eyes", zh: "對子 / 眼", pinyin: "duìzǐ", def: "Two identical tiles; every standard winning hand needs exactly one pair." },
  { term: "Dealer", zh: "莊家", pinyin: "zhuāngjiā", def: "The East seat. Keeps the deal on a win or draw." },
  { term: "Seat Wind", zh: "門風", pinyin: "ménfēng", def: "The wind matching your seat; a pung of it scores faan." },
  { term: "Round Wind", zh: "圈風", pinyin: "quānfēng", def: "The prevailing wind for the current round of play." },
  { term: "Faan", zh: "番", pinyin: "fān", def: "Hong Kong scoring unit awarded for special patterns; doubles on a scale up to the limit." },
  { term: "Limit hand", zh: "滿糊", pinyin: "mǎnhú", def: "A hand worth the maximum agreed score." },
  { term: "Self-draw", zh: "自摸", pinyin: "zìmō", def: "Winning on a tile you drew yourself rather than a discard." },
  { term: "Ready / Waiting", zh: "聽牌", pinyin: "tīngpái", def: "One tile away from a complete hand." },
  { term: "False win", zh: "詐糊", pinyin: "zhàhú", def: "Wrongly declaring a win — penalised by the table." },
  { term: "Drawn hand", zh: "流局", pinyin: "liújú", def: "The wall is exhausted with no winner; dealer keeps the deal." },
  { term: "Mahjong (win)", zh: "食糊 / 胡", pinyin: "hú", def: "The call announcing a completed, winning hand." },
];
