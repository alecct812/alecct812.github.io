import { describe, expect, it } from 'vitest';
import { decodeFrame } from '../src/lib/decode';

const rand = () => 0.5;

describe('decodificação do nome', () => {
  it('em 1 devolve o alvo e em 0 nenhum caractere revelado', () => {
    expect(decodeFrame('Alec Theotônio', 1, rand, '01')).toBe('Alec Theotônio');
    const f = decodeFrame('Alec', 0, rand, '01');
    expect(f).toHaveLength(4);
    expect(f).not.toBe('Alec');
  });

  it('revela da esquerda para a direita e preserva espaços e comprimento', () => {
    const f = decodeFrame('Alec Theotônio', 0.5, rand, '01');
    expect(f).toHaveLength('Alec Theotônio'.length);
    expect(f.startsWith('Alec Th')).toBe(true);
    expect(f[4]).toBe(' ');
    expect(f.slice(7)).toMatch(/^[01]+$/);
  });

  it('aceita progresso fora de 0..1 e não numérico', () => {
    expect(decodeFrame('Alec', 2, rand, '01')).toBe('Alec');
    expect(decodeFrame('Alec', -1, rand, '01')).toHaveLength(4);
    expect(decodeFrame('Alec', Number.NaN, rand, '01')).toHaveLength(4);
  });

  it('com conjunto vazio de caracteres devolve o alvo', () => {
    expect(decodeFrame('Alec', 0, rand, '')).toBe('Alec');
  });
});
