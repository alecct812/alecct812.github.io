import { describe, expect, it } from 'vitest';
import { HOSTS, PAIRS, STEPS, reached } from '../src/data/tcc';

describe('dados do TCC conferem com docs/resultados/coleta.md', () => {
  it('tem dez pares, sete hosts e onze passos', () => {
    expect(PAIRS).toHaveLength(10);
    expect(PAIRS.map((p) => p.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(HOSTS).toHaveLength(7);
    expect(STEPS.map((s) => s.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it('A alcançou a interna em 8 de 10 e B em 3 de 10', () => {
    expect(reached('A')).toBe(8);
    expect(reached('B')).toBe(3);
  });

  it('quem tem passo do elo 4 alcançou o elo 4, e só esses', () => {
    for (const p of PAIRS) {
      for (const r of [p.A, p.B]) expect(r.elo4Step !== null).toBe(r.elo >= 4);
    }
  });

  it('nenhuma execução passou do teto de 80 passos nem do elo 5', () => {
    for (const p of PAIRS) {
      for (const r of [p.A, p.B]) {
        expect(r.elo).toBeGreaterThanOrEqual(0);
        expect(r.elo).toBeLessThanOrEqual(5);
        if (r.elo4Step !== null) expect(r.elo4Step).toBeLessThanOrEqual(80);
      }
    }
  });

  it('os elos de 1 a 5 aparecem uma vez, em ordem, ao longo da cadeia', () => {
    expect(STEPS.flatMap((s) => s.elos)).toEqual([1, 2, 3, 4, 5]);
  });

  it('todo passo aponta para hosts que existem', () => {
    const ids = new Set(HOSTS.map((h) => h.id));
    for (const s of STEPS) {
      if (s.from !== null) expect(ids.has(s.from)).toBe(true);
      expect(s.to.length).toBeGreaterThan(0);
      for (const h of s.to) expect(ids.has(h)).toBe(true);
    }
  });

  it('o distrator não é destino de nenhum passo que rende elo', () => {
    for (const s of STEPS) if (s.elos.length > 0) expect(s.to).not.toContain('host-glhf');
  });
});
