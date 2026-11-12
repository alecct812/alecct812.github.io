import { describe, expect, it } from 'vitest';
import { next, prev, viewAt } from '../src/lib/lab/stepper';

describe('passo a passo do laboratório', () => {
  it('não sai do intervalo', () => {
    expect(prev(1)).toBe(1);
    expect(next(11)).toBe(11);
    expect(next(1)).toBe(2);
    expect(prev(11)).toBe(10);
    expect(viewAt(0).n).toBe(1);
    expect(viewAt(-3).n).toBe(1);
    expect(viewAt(99).n).toBe(11);
    expect(viewAt(Number.NaN).n).toBe(1);
    expect(viewAt(Number.POSITIVE_INFINITY).n).toBe(11);
    expect(viewAt(3.7).n).toBe(3);
  });

  it('marca primeiro e último', () => {
    expect(viewAt(1).isFirst).toBe(true);
    expect(viewAt(1).isLast).toBe(false);
    expect(viewAt(11).isLast).toBe(true);
    expect(viewAt(5).isFirst || viewAt(5).isLast).toBe(false);
  });

  it('acumula os elos alcançados', () => {
    expect(viewAt(3).elosReached).toEqual([]);
    expect(viewAt(4).elosReached).toEqual([1, 2]);
    expect(viewAt(5).elosReached).toEqual([1, 2, 3]);
    expect(viewAt(8).elosReached).toEqual([1, 2, 3, 4]);
    expect(viewAt(11).elosReached).toEqual([1, 2, 3, 4, 5]);
  });

  it('a rede interna só aparece como visitada a partir do passo 7', () => {
    const internos = ['host-db', 'host-arquivo', 'srv-financeiro'];
    expect(viewAt(6).visited.some((h) => internos.includes(h))).toBe(false);
    expect(viewAt(7).visited).toEqual(expect.arrayContaining(internos));
  });

  it('o passo ativo aponta a ligação usada', () => {
    expect(viewAt(5).from).toBe('atacante');
    expect(viewAt(5).activeHosts).toEqual(['srv-deploy']);
    expect(viewAt(6).from).toBeNull();
    expect(viewAt(8).from).toBe('srv-deploy');
    expect(viewAt(8).activeHosts).toEqual(['host-db']);
  });

  it('os hosts ativos de um passo já contam como visitados', () => {
    for (let n = 1; n <= 11; n++) {
      const v = viewAt(n);
      for (const h of v.activeHosts) expect(v.visited).toContain(h);
    }
  });

  it('a sub-rede interna só fica visível quando a segunda interface é descoberta', () => {
    expect(viewAt(5).internalVisible).toBe(false);
    expect(viewAt(6).internalVisible).toBe(true);
    expect(viewAt(11).internalVisible).toBe(true);
  });

  it('separa as ligações em uso das já usadas', () => {
    expect(viewAt(1).activeLinks).toEqual([
      'atacante>host-web',
      'atacante>host-glhf',
      'atacante>srv-deploy',
    ]);
    expect(viewAt(1).usedLinks).toEqual([]);
    expect(viewAt(6).activeLinks).toEqual([]);
    expect(viewAt(8).activeLinks).toEqual(['srv-deploy>host-db']);
    expect(viewAt(8).usedLinks).toEqual(
      expect.arrayContaining(['atacante>host-web', 'atacante>srv-deploy', 'srv-deploy>host-arquivo']),
    );
    expect(viewAt(8).usedLinks).not.toContain('srv-deploy>host-db');
    expect(viewAt(8).usedLinks).not.toContain('host-db>srv-financeiro');
  });

  it('o distrator nunca é o alvo do último passo', () => {
    expect(viewAt(11).activeHosts).not.toContain('host-glhf');
  });
});
