// Unicode Mahjong tile characters
// 🀇-🀏 = Man (Characters) 1-9
// 🀙-🀡 = Pin (Dots) 1-9
// 🀀-🀃 = Winds
// 🀄-🀆 = Dragons
// 🀐-🀘 = Sou (Bamboo) 1-9
// 🀇🀈🀉🀊🀋🀌🀍🀎🀏 = 1m-9m
// 🀙🀚🀛🀜🀝🀞🀟🀠🀡 = 1p-9p
// 🀐🀑🀒🀓🀔🀕🀖🀗🀘 = 1s-9s

export const TILE_CATEGORIES = {
  CHARACTERS: 'Characters',
  DOTS: 'Dots',
  BAMBOO: 'Bamboo',
  WINDS: 'Winds',
  DRAGONS: 'Dragons',
  FLOWERS: 'Flowers',
  SEASONS: 'Seasons',
};

export const SUITS = [TILE_CATEGORIES.CHARACTERS, TILE_CATEGORIES.DOTS, TILE_CATEGORIES.BAMBOO];

// Unicode codepoints for mahjong tiles
const MAN = ['🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏'];
const PIN = ['🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡'];
const SOU = ['🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘'];

export const ALL_TILES = [
  // Characters (Man) 1-9
  ...MAN.map((symbol, i) => ({
    id: `man-${i + 1}`,
    symbol,
    name: `${i + 1} Man`,
    shortName: `${i + 1}m`,
    category: TILE_CATEGORIES.CHARACTERS,
    number: i + 1,
    count: 4,
    description: `The ${i + 1} of Characters (Man/Manzu). Characters are represented by Chinese numerals above a kanji 万 (man, meaning "ten thousand"). There are 4 copies in a standard set.`,
    color: '#8B1A1A',
    bgColor: '#FFF8F0',
  })),

  // Dots (Pin) 1-9
  ...PIN.map((symbol, i) => ({
    id: `pin-${i + 1}`,
    symbol,
    name: `${i + 1} Pin`,
    shortName: `${i + 1}p`,
    category: TILE_CATEGORIES.DOTS,
    number: i + 1,
    count: 4,
    description: `The ${i + 1} of Dots (Pin/Pinzu). Dots tiles show ${i + 1} circular dot${i + 1 > 1 ? 's' : ''}. There are 4 copies in a standard set.`,
    color: '#1A5276',
    bgColor: '#F0F8FF',
  })),

  // Bamboo (Sou) 1-9
  ...SOU.map((symbol, i) => ({
    id: `sou-${i + 1}`,
    symbol,
    name: `${i + 1} Sou`,
    shortName: `${i + 1}s`,
    category: TILE_CATEGORIES.BAMBOO,
    number: i + 1,
    count: 4,
    description: `The ${i + 1} of Bamboo (Sou/Souzu). Bamboo tiles show stylized bamboo stalks${i === 0 ? ' (the 1 Sou often features a bird/sparrow instead of bamboo)' : ''}. There are 4 copies in a standard set.`,
    color: '#1E8449',
    bgColor: '#F0FFF4',
  })),

  // Winds
  {
    id: 'wind-east',
    symbol: '🀀',
    name: 'East Wind',
    shortName: 'Ew',
    category: TILE_CATEGORIES.WINDS,
    count: 4,
    description: 'East Wind (東, Ton). The most important wind — the first dealer is always East. East Wind is a yakuhai (value tile) when it matches the round wind or your seat wind. 4 copies exist.',
    color: '#784212',
    bgColor: '#FDF5E6',
    significance: 'The dealer is always East. Collecting 3 East Wind tiles scores a Pung.',
  },
  {
    id: 'wind-south',
    symbol: '🀁',
    name: 'South Wind',
    shortName: 'Sw',
    category: TILE_CATEGORIES.WINDS,
    count: 4,
    description: 'South Wind (南, Nan). Represents the player to the right of East in Riichi Mahjong. A value tile when matching the round or seat wind. 4 copies exist.',
    color: '#784212',
    bgColor: '#FDF5E6',
  },
  {
    id: 'wind-west',
    symbol: '🀂',
    name: 'West Wind',
    shortName: 'Ww',
    category: TILE_CATEGORIES.WINDS,
    count: 4,
    description: 'West Wind (西, Sha). Represents the player opposite East in Riichi Mahjong. A value tile when matching the round or seat wind. 4 copies exist.',
    color: '#784212',
    bgColor: '#FDF5E6',
  },
  {
    id: 'wind-north',
    symbol: '🀃',
    name: 'North Wind',
    shortName: 'Nw',
    category: TILE_CATEGORIES.WINDS,
    count: 4,
    description: 'North Wind (北, Pei). Represents the player to the left of East in Riichi Mahjong. A value tile when matching the round or seat wind. 4 copies exist.',
    color: '#784212',
    bgColor: '#FDF5E6',
  },

  // Dragons
  {
    id: 'dragon-red',
    symbol: '🀄',
    name: 'Red Dragon',
    shortName: 'Chun',
    category: TILE_CATEGORIES.DRAGONS,
    count: 4,
    description: 'Red Dragon (中, Chun — meaning "center/middle"). Always a value tile. Collecting 3 Red Dragons scores a Pung worth 1 han. One of the three "honor" dragon tiles. 4 copies exist.',
    color: '#C0392B',
    bgColor: '#FFF0F0',
    significance: 'Always a value tile — 3 of a kind always scores.',
  },
  {
    id: 'dragon-green',
    symbol: '🀅',
    name: 'Green Dragon',
    shortName: 'Hatsu',
    category: TILE_CATEGORIES.DRAGONS,
    count: 4,
    description: 'Green Dragon (發, Hatsu — meaning "prosperity/development"). Always a value tile. Collecting 3 Green Dragons scores a Pung worth 1 han. 4 copies exist.',
    color: '#1E8449',
    bgColor: '#F0FFF4',
    significance: 'Always a value tile — 3 of a kind always scores.',
  },
  {
    id: 'dragon-white',
    symbol: '🀆',
    name: 'White Dragon',
    shortName: 'Haku',
    category: TILE_CATEGORIES.DRAGONS,
    count: 4,
    description: 'White Dragon (白, Haku — meaning "white/blank"). Always a value tile. The White Dragon tile appears blank or with just a border. Collecting 3 scores a Pung worth 1 han. 4 copies exist.',
    color: '#555',
    bgColor: '#F8F8F8',
    significance: 'Always a value tile — 3 of a kind always scores.',
  },

  // Flowers (bonus tiles)
  {
    id: 'flower-plum',
    symbol: '🌸',
    name: 'Plum Blossom',
    shortName: 'F1',
    category: TILE_CATEGORIES.FLOWERS,
    count: 1,
    description: 'Flower tile #1 — Plum Blossom. In Riichi Mahjong, flower tiles are set aside and not used in the main game. In Chinese/Hong Kong rules, they are bonus tiles that score extra points. Only 1 copy.',
    color: '#8E44AD',
    bgColor: '#F9F0FF',
  },
  {
    id: 'flower-orchid',
    symbol: '🌺',
    name: 'Orchid',
    shortName: 'F2',
    category: TILE_CATEGORIES.FLOWERS,
    count: 1,
    description: 'Flower tile #2 — Orchid. Bonus tile used in some regional variants. In Riichi Mahjong, typically set aside before play. Only 1 copy.',
    color: '#8E44AD',
    bgColor: '#F9F0FF',
  },
  {
    id: 'flower-chrysanthemum',
    symbol: '🌼',
    name: 'Chrysanthemum',
    shortName: 'F3',
    category: TILE_CATEGORIES.FLOWERS,
    count: 1,
    description: 'Flower tile #3 — Chrysanthemum. Bonus tile used in some regional variants. Only 1 copy.',
    color: '#8E44AD',
    bgColor: '#F9F0FF',
  },
  {
    id: 'flower-bamboo-plant',
    symbol: '🎋',
    name: 'Bamboo Plant',
    shortName: 'F4',
    category: TILE_CATEGORIES.FLOWERS,
    count: 1,
    description: 'Flower tile #4 — Bamboo Plant. Bonus tile used in some regional variants. Only 1 copy.',
    color: '#8E44AD',
    bgColor: '#F9F0FF',
  },

  // Seasons (bonus tiles)
  {
    id: 'season-spring',
    symbol: '🌱',
    name: 'Spring',
    shortName: 'S1',
    category: TILE_CATEGORIES.SEASONS,
    count: 1,
    description: 'Season tile #1 — Spring. Bonus tile used in Chinese/Hong Kong Mahjong. In Riichi Mahjong, typically set aside before play. Only 1 copy.',
    color: '#117A65',
    bgColor: '#E8F8F5',
  },
  {
    id: 'season-summer',
    symbol: '☀️',
    name: 'Summer',
    shortName: 'S2',
    category: TILE_CATEGORIES.SEASONS,
    count: 1,
    description: 'Season tile #2 — Summer. Bonus tile used in Chinese/Hong Kong Mahjong. Only 1 copy.',
    color: '#117A65',
    bgColor: '#E8F8F5',
  },
  {
    id: 'season-autumn',
    symbol: '🍂',
    name: 'Autumn',
    shortName: 'S3',
    category: TILE_CATEGORIES.SEASONS,
    count: 1,
    description: 'Season tile #3 — Autumn (Fall). Bonus tile used in Chinese/Hong Kong Mahjong. Only 1 copy.',
    color: '#117A65',
    bgColor: '#E8F8F5',
  },
  {
    id: 'season-winter',
    symbol: '❄️',
    name: 'Winter',
    shortName: 'S4',
    category: TILE_CATEGORIES.SEASONS,
    count: 1,
    description: 'Season tile #4 — Winter. Bonus tile used in Chinese/Hong Kong Mahjong. Only 1 copy.',
    color: '#117A65',
    bgColor: '#E8F8F5',
  },
];

export const TILE_BY_ID = Object.fromEntries(ALL_TILES.map(t => [t.id, t]));

// Only the main 34 tile types for quiz/hand-building
export const MAIN_TILES = ALL_TILES.filter(
  t => t.category !== TILE_CATEGORIES.FLOWERS && t.category !== TILE_CATEGORIES.SEASONS
);

// Helper to get tiles by category
export const getTilesByCategory = (category) =>
  ALL_TILES.filter(t => t.category === category);

// Example winning hands
export const EXAMPLE_HANDS = [
  {
    name: 'All Pungs',
    description: 'Four sets of 3 identical tiles (Pungs) plus one pair. All Pungs (Toitoi) is a valid winning hand!',
    tiles: ['man-1','man-1','man-1','pin-5','pin-5','pin-5','sou-9','sou-9','sou-9','dragon-red','dragon-red','dragon-red','wind-east','wind-east'],
    melds: [
      { type: 'Pung', tiles: ['man-1','man-1','man-1'], label: 'Pung of 1 Man' },
      { type: 'Pung', tiles: ['pin-5','pin-5','pin-5'], label: 'Pung of 5 Pin' },
      { type: 'Pung', tiles: ['sou-9','sou-9','sou-9'], label: 'Pung of 9 Sou' },
      { type: 'Pung', tiles: ['dragon-red','dragon-red','dragon-red'], label: 'Pung of Red Dragon' },
      { type: 'Pair', tiles: ['wind-east','wind-east'], label: 'Pair of East Wind' },
    ],
  },
  {
    name: 'Mixed Chows',
    description: 'Four sequences (Chows) across different suits plus a pair.',
    tiles: ['man-1','man-2','man-3','pin-4','pin-5','pin-6','sou-7','sou-8','sou-9','man-7','man-8','man-9','pin-2','pin-2'],
    melds: [
      { type: 'Chow', tiles: ['man-1','man-2','man-3'], label: 'Chow: 1-2-3 Man' },
      { type: 'Chow', tiles: ['pin-4','pin-5','pin-6'], label: 'Chow: 4-5-6 Pin' },
      { type: 'Chow', tiles: ['sou-7','sou-8','sou-9'], label: 'Chow: 7-8-9 Sou' },
      { type: 'Chow', tiles: ['man-7','man-8','man-9'], label: 'Chow: 7-8-9 Man' },
      { type: 'Pair', tiles: ['pin-2','pin-2'], label: 'Pair of 2 Pin' },
    ],
  },
  {
    name: 'Dragon\'s Pride',
    description: 'Three dragon Pungs plus a Chow and a pair.',
    tiles: ['dragon-red','dragon-red','dragon-red','dragon-green','dragon-green','dragon-green','dragon-white','dragon-white','dragon-white','sou-3','sou-4','sou-5','man-9','man-9'],
    melds: [
      { type: 'Pung', tiles: ['dragon-red','dragon-red','dragon-red'], label: 'Pung of Red Dragon' },
      { type: 'Pung', tiles: ['dragon-green','dragon-green','dragon-green'], label: 'Pung of Green Dragon' },
      { type: 'Pung', tiles: ['dragon-white','dragon-white','dragon-white'], label: 'Pung of White Dragon' },
      { type: 'Chow', tiles: ['sou-3','sou-4','sou-5'], label: 'Chow: 3-4-5 Sou' },
      { type: 'Pair', tiles: ['man-9','man-9'], label: 'Pair of 9 Man' },
    ],
  },
];

export default ALL_TILES;
