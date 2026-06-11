import { memo } from "react";
import type { TileDef } from "@/data/tiles";
import "./tile.css";

interface TileProps {
  def: TileDef;
  /** Pixel width; height follows the 3:4 tile ratio. */
  size?: number;
  /** Show the EN/ZH caption under the face. */
  showLabel?: boolean;
  selected?: boolean;
  faceDown?: boolean;
  dim?: boolean;
  onClick?: () => void;
}

/** Dot positions (0–100 grid) for circle tiles, ranks 1–9. */
const CIRCLE_LAYOUTS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[50, 28], [50, 72]],
  3: [[28, 24], [50, 50], [72, 76]],
  4: [[32, 30], [68, 30], [32, 70], [68, 70]],
  5: [[30, 28], [70, 28], [50, 50], [30, 72], [70, 72]],
  6: [[32, 24], [68, 24], [32, 50], [68, 50], [32, 76], [68, 76]],
  7: [[30, 20], [50, 30], [70, 40], [32, 60], [68, 60], [32, 80], [68, 80]],
  8: [[32, 20], [68, 20], [32, 40], [68, 40], [32, 62], [68, 62], [32, 82], [68, 82]],
  9: [[28, 24], [50, 24], [72, 24], [28, 50], [50, 50], [72, 50], [28, 76], [50, 76], [72, 76]],
};

function CircleFace({ rank, color }: { rank: number; color: string }) {
  const dots = CIRCLE_LAYOUTS[rank] ?? [];
  return (
    <svg viewBox="0 0 100 100" className="tile-face-svg" aria-hidden="true">
      {dots.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={9} fill={color} />
          <circle cx={cx} cy={cy} r={4.5} fill="#fff" />
          <circle cx={cx} cy={cy} r={2} fill={color} />
        </g>
      ))}
    </svg>
  );
}

function BambooStick({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-3.2} y={-13} width={6.4} height={26} rx={3} fill={color} />
      <rect x={-5} y={-1.6} width={10} height={3.2} rx={1.6} fill="#0b1f17" opacity={0.85} />
    </g>
  );
}

function BambooFace({ rank, color }: { rank: number; color: string }) {
  if (rank === 1) {
    // 1 Bamboo is traditionally a bird.
    return (
      <svg viewBox="0 0 100 100" className="tile-face-svg" aria-hidden="true">
        <ellipse cx={50} cy={56} rx={20} ry={24} fill={color} />
        <circle cx={50} cy={30} r={13} fill={color} />
        <circle cx={46} cy={28} r={2.6} fill="#fff" />
        <path d="M50 30 L66 24 L52 36 Z" fill="#d55e00" />
        <path d="M50 78 L40 94 M50 78 L60 94" stroke={color} strokeWidth={3} fill="none" />
      </svg>
    );
  }
  const layouts: Record<number, [number, number][]> = {
    2: [[50, 32], [50, 68]],
    3: [[50, 24], [34, 64], [66, 64]],
    4: [[34, 32], [66, 32], [34, 68], [66, 68]],
    5: [[34, 30], [66, 30], [50, 50], [34, 72], [66, 72]],
    6: [[30, 30], [50, 30], [70, 30], [30, 70], [50, 70], [70, 70]],
    7: [[50, 22], [30, 48], [50, 48], [70, 48], [30, 76], [50, 76], [70, 76]],
    8: [[30, 26], [50, 26], [70, 26], [30, 52], [70, 52], [30, 78], [50, 78], [70, 78]],
    9: [[30, 26], [50, 26], [70, 26], [30, 52], [50, 52], [70, 52], [30, 78], [50, 78], [70, 78]],
  };
  const pts = layouts[rank] ?? [];
  return (
    <svg viewBox="0 0 100 100" className="tile-face-svg" aria-hidden="true">
      {pts.map(([x, y], i) => (
        <BambooStick key={i} x={x} y={y} color={color} />
      ))}
    </svg>
  );
}

function CharacterFace({ def }: { def: TileDef }) {
  const numeral = def.names.zh.charAt(0);
  return (
    <div className="tile-face-char" style={{ color: def.color }}>
      <span className="tile-char-num">{numeral}</span>
      <span className="tile-char-wan">萬</span>
    </div>
  );
}

function HonorFace({ def }: { def: TileDef }) {
  const isWhiteDragon = def.id === "dragon-white";
  return (
    <div
      className={`tile-face-honor ${isWhiteDragon ? "tile-white-dragon" : ""}`}
      style={{ color: def.color }}
    >
      {!isWhiteDragon && <span>{def.names.zh}</span>}
    </div>
  );
}

function BonusFace({ def }: { def: TileDef }) {
  return (
    <div className="tile-face-bonus" style={{ color: def.color }}>
      <span className="tile-bonus-num">{def.rank}</span>
      <span className="tile-bonus-char">{def.names.zh}</span>
    </div>
  );
}

function TileFace({ def }: { def: TileDef }) {
  if (def.category === "suit") {
    if (def.suit === "circles") return <CircleFace rank={def.rank!} color={def.color} />;
    if (def.suit === "bamboo") return <BambooFace rank={def.rank!} color={def.color} />;
    return <CharacterFace def={def} />;
  }
  if (def.category === "wind" || def.category === "dragon") return <HonorFace def={def} />;
  return <BonusFace def={def} />;
}

export const Tile = memo(function Tile({
  def,
  size = 72,
  showLabel = false,
  selected = false,
  faceDown = false,
  dim = false,
  onClick,
}: TileProps) {
  const height = Math.round((size * 4) / 3);
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      className={`tile ${selected ? "is-selected" : ""} ${dim ? "is-dim" : ""} ${onClick ? "is-clickable" : ""}`}
      style={{ width: size, height }}
      onClick={onClick}
      aria-label={`${def.names.en} — ${def.names.zh} (${def.names.pinyin})`}
    >
      {faceDown ? (
        <div className="tile-back" aria-hidden="true" />
      ) : (
        <>
          <div className="tile-face">
            <TileFace def={def} />
          </div>
          {showLabel && (
            <div className="tile-label">
              <span className="tile-label-en">{def.names.en}</span>
              <span className="tile-label-zh">{def.names.zh}</span>
            </div>
          )}
        </>
      )}
    </Wrapper>
  );
});
