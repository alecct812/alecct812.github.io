import { describe, expect, it } from 'vitest';
import {
  columnCount,
  createRain,
  dissolveAmber,
  lockGreen,
  reviveAmber,
  stepRain,
} from '../src/lib/rain/engine';

const run = (s: ReturnType<typeof createRain>, steps: number, dt = 0.016) => {
  for (let i = 0; i < steps; i++) stepRain(s, dt);
};

describe('chuva', () => {
  it('limita as colunas pela largura e por um teto', () => {
    expect(columnCount(360, 18)).toBe(20);
    expect(columnCount(4000, 18)).toBe(90);
    expect(columnCount(0, 18)).toBe(0);
    expect(columnCount(-50, 18)).toBe(0);
  });

  it('é determinística para o mesmo seed', () => {
    const a = createRain(800, 600, 18, 7);
    const b = createRain(800, 600, 18, 7);
    run(a, 50);
    run(b, 50);
    expect(a.cols.map((c) => c.head)).toEqual(b.cols.map((c) => c.head));
  });

  it('tem as duas cores, com âmbar em minoria', () => {
    const s = createRain(1200, 600, 18, 7);
    const amber = s.cols.filter((c) => c.kind === 'ambar').length;
    expect(amber).toBeGreaterThan(0);
    expect(amber).toBeLessThan(s.cols.length / 2);
  });

  it('toda coluna cai enquanto ninguém interfere', () => {
    const s = createRain(1200, 600, 18, 7);
    const before = s.cols.map((c) => c.head);
    stepRain(s, 0.016);
    s.cols.forEach((c, i) => expect(c.head).toBeGreaterThan(before[i]!));
  });

  it('as colunas âmbar dissolvem até sumir e as verdes continuam', () => {
    const s = createRain(1200, 600, 18, 7);
    dissolveAmber(s);
    run(s, 200);
    for (const c of s.cols) {
      if (c.kind === 'ambar') expect(c.alpha).toBe(0);
      else expect(c.alpha).toBeGreaterThan(0);
    }
  });

  it('depois de voltar, o âmbar nunca passa do ponto em que esquece', () => {
    const s = createRain(1200, 600, 18, 7);
    dissolveAmber(s);
    run(s, 200);
    reviveAmber(s, 0.5);
    let seen = 0;
    for (let i = 0; i < 600; i++) {
      stepRain(s, 0.016);
      for (const c of s.cols) {
        if (c.kind !== 'ambar') continue;
        if (c.alpha > 0) seen++;
        if (c.head > 0.5 * s.height) expect(c.alpha).toBe(0);
      }
    }
    expect(seen).toBeGreaterThan(0);
  });

  it('trava uma coluna verde distinta por alvo e ela para de cair', () => {
    const s = createRain(1200, 600, 18, 7);
    const targets = [
      { x: 200, y: 300 },
      { x: 600, y: 200 },
      { x: 1000, y: 400 },
    ];
    const locked = lockGreen(s, targets);
    expect(new Set(locked).size).toBe(3);
    run(s, 300);
    locked.forEach((idx, i) => {
      const c = s.cols[idx]!;
      expect(c.kind).toBe('verde');
      expect(c.state).toBe('locked');
      expect(c.head).toBeCloseTo(targets[i]!.y, 0);
      expect(Math.abs(c.x - targets[i]!.x)).toBeLessThan(40);
    });
  });

  it('dois alvos no mesmo lugar recebem colunas diferentes', () => {
    const s = createRain(1200, 600, 18, 7);
    const locked = lockGreen(s, [
      { x: 600, y: 200 },
      { x: 600, y: 300 },
    ]);
    expect(new Set(locked).size).toBe(2);
  });

  it('não quebra com área zero nem com dt enorme ou negativo', () => {
    const s = createRain(0, 0, 18, 1);
    expect(() => stepRain(s, 10)).not.toThrow();
    expect(lockGreen(s, [{ x: 1, y: 1 }])).toEqual([]);
    const t = createRain(800, 600, 18, 1);
    const before = t.cols.map((c) => c.head);
    stepRain(t, -5);
    expect(t.cols.map((c) => c.head)).toEqual(before);
    stepRain(t, 1000);
    for (const c of t.cols) expect(Number.isFinite(c.head)).toBe(true);
  });
});
