import type { TileDef } from "@/data/tiles";
import type { Lang } from "./store";

/** Render a tile's name per the user's language preference. */
export function tileLabel(def: TileDef, lang: Lang): string {
  if (lang === "en") return def.names.en;
  if (lang === "zh") return def.names.zh;
  return `${def.names.en} · ${def.names.zh}`;
}

export function tileSubLabel(def: TileDef, lang: Lang): string {
  if (lang === "zh") return def.names.jyutping;
  return def.names.pinyin;
}
