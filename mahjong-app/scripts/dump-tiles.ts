/**
 * Emits the full tile data model to src/data/tiles.json as a static artifact
 * (handy for inspection, tests, or porting). Run: npm run gen:tiles
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { TILES, buildWall, wallStats } from "../src/data/tiles.ts";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "src", "data", "tiles.json");

const payload = {
  meta: { variant: "traditional-hk", ...wallStats() },
  tiles: TILES,
  wallCount: buildWall().length,
};

writeFileSync(out, JSON.stringify(payload, null, 2) + "\n");
console.log(`Wrote ${out}: ${payload.meta.distinct} distinct, ${payload.wallCount} in wall.`);
