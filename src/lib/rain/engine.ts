/**
 * Simulação da chuva. Sem DOM e determinística dado o seed, para poder ser testada.
 *
 * Verde é o estado que persiste: uma coluna verde pode ser travada num ponto e virar nó do grafo.
 * Âmbar é a memória que esquece: dissolve, e quando volta some antes de chegar embaixo.
 */

export type Kind = 'verde' | 'ambar';
export type ColumnState = 'falling' | 'dissolving' | 'locked';

export interface Column {
  x: number;
  /** Posição vertical da cabeça da coluna, em pixels. */
  head: number;
  /** Pixels por segundo. */
  speed: number;
  /** Comprimento da cauda, em glifos. */
  length: number;
  kind: Kind;
  state: ColumnState;
  alpha: number;
  /** Fragmento que a coluna soletra de cima para baixo. */
  glyphs: string;
  lockY: number | null;
}

export interface RainState {
  cols: Column[];
  width: number;
  height: number;
  cell: number;
  t: number;
  /** Fração da altura em que o âmbar some; null enquanto o âmbar cai inteiro. */
  amberFade: number | null;
  rng: () => number;
}

/** Fragmentos reais do trabalho: ferramentas, endereços do laboratório, pilha do backend. */
export const TOKENS: readonly string[] = [
  'nmap',
  'ssh',
  'curl',
  'hydra',
  '172.21.0.2',
  '172.20.0.12',
  'FastAPI',
  'MLflow',
  'elo4',
  'grafo',
  'docker',
  'SQL',
  'pivô',
  'srv-deploy',
];

const MAX_COLUMNS = 90;
const MAX_DT = 0.05;
const LOCK_SPEED = 900;

export function columnCount(width: number, cell: number): number {
  if (!(width > 0) || !(cell > 0)) return 0;
  return Math.min(MAX_COLUMNS, Math.floor(width / cell));
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function refresh(c: Column, s: Pick<RainState, 'rng' | 'cell'>): void {
  c.speed = s.cell * (7 + s.rng() * 11);
  c.length = 6 + Math.floor(s.rng() * 13);
  c.glyphs = TOKENS[Math.floor(s.rng() * TOKENS.length)] ?? 'nmap';
}

export function createRain(width: number, height: number, cell: number, seed: number): RainState {
  const rng = mulberry32(seed);
  const n = columnCount(width, cell);
  const pitch = n > 0 ? width / n : 0;
  const s: RainState = { cols: [], width, height, cell, t: 0, amberFade: null, rng };
  for (let i = 0; i < n; i++) {
    const c: Column = {
      x: (i + 0.5) * pitch,
      head: (rng() * 1.6 - 0.8) * height,
      speed: 0,
      length: 0,
      kind: i % 5 === 3 ? 'ambar' : 'verde',
      state: 'falling',
      alpha: 1,
      glyphs: '',
      lockY: null,
    };
    refresh(c, s);
    s.cols.push(c);
  }
  return s;
}

export function stepRain(s: RainState, dt: number): void {
  const d = Number.isFinite(dt) ? Math.min(Math.max(dt, 0), MAX_DT) : 0;
  if (d === 0) return;
  s.t += d;

  for (const c of s.cols) {
    if (c.state === 'locked') {
      const y = c.lockY ?? c.head;
      if (c.head < y) {
        c.head = Math.min(y, c.head + Math.max(c.speed, LOCK_SPEED) * d);
      } else {
        // Chegou: a coluna é absorvida pelo nó.
        c.head = y;
        c.alpha = Math.max(0, c.alpha - 0.9 * d);
      }
      continue;
    }

    if (c.state === 'dissolving') {
      c.head += c.speed * d * 0.6;
      c.alpha = Math.max(0, c.alpha - 1.6 * d);
      continue;
    }

    c.head += c.speed * d;

    if (c.kind === 'ambar' && s.amberFade !== null) {
      const limit = s.amberFade * s.height;
      c.alpha = c.head <= 0 ? 1 : clamp01(1 - c.head / limit);
      if (c.alpha === 0) {
        // Esqueceu. Volta bem acima do topo, para o âmbar ficar raro.
        c.head = -(0.5 + s.rng() * 2.5) * s.height;
        c.alpha = 1;
        refresh(c, s);
      }
      continue;
    }

    if (c.head - c.length * s.cell > s.height) {
      c.head = -s.rng() * 0.6 * s.height - s.cell;
      refresh(c, s);
    }
  }
}

/** A memória conversacional esquece: toda coluna âmbar some. */
export function dissolveAmber(s: RainState): void {
  for (const c of s.cols) if (c.kind === 'ambar') c.state = 'dissolving';
}

/** O âmbar volta a cair, mas some ao chegar a `fadeAt` da altura. */
export function reviveAmber(s: RainState, fadeAt = 0.55): void {
  s.amberFade = Math.min(1, Math.max(0.05, fadeAt));
  for (const c of s.cols) {
    if (c.kind !== 'ambar') continue;
    c.state = 'falling';
    c.alpha = 1;
    c.head = -(0.2 + s.rng() * 2.5) * s.height;
    refresh(c, s);
  }
}

/**
 * O estado explícito persiste: para cada alvo, trava a coluna verde livre mais próxima.
 * Devolve os índices das colunas travadas, na ordem dos alvos atendidos.
 */
export function lockGreen(s: RainState, targets: readonly { x: number; y: number }[]): number[] {
  const used = new Set<number>();
  const locked: number[] = [];
  for (const target of targets) {
    let best = -1;
    let bestDist = Infinity;
    s.cols.forEach((c, i) => {
      if (c.kind !== 'verde' || c.state !== 'falling' || used.has(i)) return;
      const dist = Math.abs(c.x - target.x);
      if (dist < bestDist) {
        best = i;
        bestDist = dist;
      }
    });
    const c = s.cols[best];
    if (!c) continue;
    used.add(best);
    locked.push(best);
    c.state = 'locked';
    c.lockY = target.y;
    c.alpha = 1;
    // Uma coluna que já passou do alvo recomeça de cima, para chegar caindo.
    if (c.head > target.y) c.head = target.y - 0.35 * s.height;
  }
  return locked;
}
