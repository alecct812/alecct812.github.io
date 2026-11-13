import { describe, expect, it } from 'vitest';
import { CRITERION, PAIRS, STEPS, STEP_CEILING, pairStats, reached } from '../src/data/tcc';
import { en } from '../src/i18n/en';
import { pt } from '../src/i18n/pt';

// As frases do TCC são escritas à mão, em dois idiomas. Estes testes amarram cada número
// citado no texto aos dados: se um lado mudar sem o outro, o teste quebra.

const porExtenso = {
  pt: ['nenhum', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'],
  en: ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
};

describe('contagem dos pares', () => {
  it('separa os dez pares por quem alcançou a sub-rede interna', () => {
    const s = pairStats();
    expect(s.both + s.onlyA + s.onlyB + s.neither).toBe(PAIRS.length);
    expect(s).toEqual({ both: 2, onlyA: 6, onlyB: 1, neither: 1, trophy: 0 });
  });
});

describe.each([
  ['pt', pt, 'de'],
  ['en', en, 'of'],
] as const)('frases em %s', (lang, d, of) => {
  const s = pairStats();
  const words = porExtenso[lang];
  const { p1, p3 } = d.tcc.limitation;

  it('o critério e o resultado citados batem com os dados', () => {
    expect(p1).toContain(`A ≥ ${CRITERION.minA}/10`);
    expect(p1).toContain(`B ≤ ${CRITERION.maxB}/10`);
    expect(p1).toContain(`${reached('A')} ${of} 10`);
    expect(p1).toContain(`${reached('B')} ${of} 10`);
    expect(p1).toContain(words[reached('B') - CRITERION.maxB]);
  });

  it('a descrição dos pares bate com a contagem', () => {
    expect(p3).toContain(`${words[s.both]} `);
    expect(p3).toContain(`${words[s.onlyB]} `);
    expect(p3).toContain(String(STEP_CEILING));
    if (s.trophy === 0) expect(p3.toLowerCase()).toMatch(/nenhuma|none/);
  });

  it('o contador de passos usa o total de passos da cadeia', () => {
    expect(d.tcc.lab.stepOf(1).endsWith(String(STEPS.length))).toBe(true);
  });

  it('a introdução dos resultados cita o teto de passos', () => {
    expect(d.tcc.results.intro).toContain(String(STEP_CEILING));
  });
});
