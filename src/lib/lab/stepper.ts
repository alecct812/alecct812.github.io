import { STEPS } from '../../data/tcc';

/** O que o mapa do laboratório mostra num dado passo da cadeia. Sem DOM. */
export interface StepView {
  n: number;
  /** Hosts em que a ação do passo acontece. */
  activeHosts: string[];
  /** Host de onde a ação parte; null quando acontece dentro do próprio host. */
  from: string | null;
  /** Todo host que já apareceu até este passo, incluindo os ativos. */
  visited: string[];
  /** Ligações do passo atual, como 'origem>destino'. */
  activeLinks: string[];
  /** Ligações usadas em passos anteriores e que não estão em uso agora. */
  usedLinks: string[];
  elosReached: number[];
  /** A sub-rede interna só existe para o agente depois da segunda interface. */
  internalVisible: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const FIRST = 1;
const LAST = STEPS.length;
const PIVOT_STEP = STEPS.find((s) => s.key === 'secondInterface')?.n ?? LAST;

const clampStep = (n: number): number => {
  if (Number.isNaN(n)) return FIRST;
  return Math.min(LAST, Math.max(FIRST, Math.trunc(n)));
};

const linksOf = (s: (typeof STEPS)[number]): string[] =>
  s.from === null ? [] : s.to.map((to) => `${s.from}>${to}`);

export function viewAt(n: number): StepView {
  const k = clampStep(n);
  const upTo = STEPS.slice(0, k);
  const current = upTo[upTo.length - 1]!;
  const visited = new Set<string>();
  for (const s of upTo) {
    if (s.from !== null) visited.add(s.from);
    for (const h of s.to) visited.add(h);
  }
  const activeLinks = linksOf(current);
  const used = new Set(upTo.slice(0, -1).flatMap(linksOf));
  for (const l of activeLinks) used.delete(l);

  return {
    n: k,
    activeHosts: [...current.to],
    from: current.from,
    visited: [...visited],
    activeLinks,
    usedLinks: [...used],
    elosReached: upTo.flatMap((s) => s.elos),
    internalVisible: k >= PIVOT_STEP,
    isFirst: k === FIRST,
    isLast: k === LAST,
  };
}

export const next = (n: number): number => clampStep(clampStep(n) + 1);
export const prev = (n: number): number => clampStep(clampStep(n) - 1);
