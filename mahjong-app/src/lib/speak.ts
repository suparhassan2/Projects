import type { TileDef } from "@/data/tiles";

/**
 * Pronounce a tile name using the Web Speech API. Prefers a Mandarin voice so
 * the Chinese name sounds right; falls back silently if speech is unavailable
 * (e.g. offline with no installed voices).
 */
export function speak(def: TileDef): void {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(def.names.zh);
    u.lang = "zh-CN";
    u.rate = 0.85;
    const zhVoice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("zh"));
    if (zhVoice) u.voice = zhVoice;
    synth.speak(u);
  } catch {
    /* speech not supported — silent no-op */
  }
}
