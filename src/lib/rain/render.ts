import type { RainState } from './engine';

export interface RainColors {
  verde: string;
  ambar: string;
  head: string;
}

export interface DrawOptions {
  /** Multiplicador geral de opacidade, de 0 a 1. */
  intensity: number;
  /** Posição horizontal do cursor dentro do canvas; null quando está fora. */
  pointerX: number | null;
  fontFamily: string;
}

const POINTER_REACH = 120;

/** Desenha o estado da chuva. Os glifos ficam presos a uma grade de linhas, como no filme. */
export function draw(
  ctx: CanvasRenderingContext2D,
  s: RainState,
  colors: RainColors,
  opt: DrawOptions,
): void {
  ctx.clearRect(0, 0, s.width, s.height);
  if (s.cols.length === 0) return;

  ctx.font = `600 ${Math.round(s.cell * 0.7)}px ${opt.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (const c of s.cols) {
    if (c.alpha <= 0) continue;
    const glyphs = [...c.glyphs];
    const n = glyphs.length;
    if (n === 0) continue;

    let boost = 1;
    if (opt.pointerX !== null) {
      const dist = Math.abs(c.x - opt.pointerX);
      if (dist < POINTER_REACH) boost = 1 + (1 - dist / POINTER_REACH) * 1.4;
    }

    const headRow = Math.floor(c.head / s.cell);
    const body = c.kind === 'verde' ? colors.verde : colors.ambar;

    for (let k = 0; k < c.length; k++) {
      const row = headRow - k;
      const y = row * s.cell;
      if (y < -s.cell || y > s.height) continue;
      const tail = k === 0 ? 1 : Math.pow(1 - k / c.length, 1.4) * 0.7;
      const a = Math.min(1, c.alpha * opt.intensity * tail * boost);
      if (a < 0.02) continue;
      ctx.globalAlpha = a;
      ctx.fillStyle = k === 0 ? colors.head : body;
      ctx.fillText(glyphs[((row % n) + n) % n] ?? '', c.x, y);
    }
  }
  ctx.globalAlpha = 1;
}
