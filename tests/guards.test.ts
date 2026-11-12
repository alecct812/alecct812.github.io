import { describe, expect, it } from 'vitest';
// Módulo JavaScript compartilhado com scripts/check-dist.mjs.
import { COST, PHONE, PORTUGUESE_ONLY } from '../scripts/guards.mjs';

// Os números de exemplo são montados em partes, para que este arquivo
// não contenha nada com formato de telefone e não dispare a própria guarda.
const ddd = '11';
const a = '1234';
const b = '5678';
const shapes = [
  `(${ddd}) 9${a}-${b}`,
  `(${ddd})9${a}-${b}`,
  `${ddd} 9${a}-${b}`,
  `${ddd}9${a}${b}`,
  `+55 ${ddd} 9${a}-${b}`,
  `+55${ddd}9${a}${b}`,
  `55${ddd}9${a}${b}`,
  `${ddd} 9 ${a}-${b}`,
  `${ddd} 9${a} ${b}`,
  `${ddd}.9${a}.${b}`,
  `${ddd}-9${a}-${b}`,
  `(${ddd}) 9 ${a} ${b}`,
  `+55 (${ddd}) 9${a}-${b}`,
];

describe('guarda de telefone', () => {
  it.each(shapes)('pega o formato %#', (s) => {
    expect(PHONE.test(`fale comigo: ${s}.`)).toBe(true);
  });

  it('pega o número dentro de um link tel: ou wa.me', () => {
    expect(PHONE.test(`href="tel:+55${ddd}9${a}${b}"`)).toBe(true);
    expect(PHONE.test(`https://wa.me/55${ddd}9${a}${b}`)).toBe(true);
  });

  it.each([
    '172.21.0.2',
    '172.20.0.12 · 172.21.0.2',
    'p = 0,0349',
    '2026-11-12',
    '0.017453292519943295',
    '4294967296',
    '1794508272958',
    '2.252 verificações e 793 mutações',
    'font-weight: 200 800',
  ])('não confunde "%s" com telefone', (s) => {
    expect(PHONE.test(s)).toBe(false);
  });
});

describe('guarda de custo', () => {
  it('pega um valor em dólares', () => {
    // Montado em partes, para este arquivo não disparar a própria guarda.
    const usd = 'US' + '$';
    expect(COST.test(`a coleta custou ${usd} 12,34`)).toBe(true);
    expect(COST.test(`about ${usd}2 per run`)).toBe(true);
    expect(COST.test(['$', '1.4550 por execução'].join(' '))).toBe(true);
    expect(COST.test(['valor em', 'US' + 'D'].join(' '))).toBe(true);
  });

  it('não dispara em texto sem valor', () => {
    expect(COST.test('o braço B usa memória conversacional')).toBe(false);
    expect(COST.test('template ${n} de 11')).toBe(false);
  });
});

describe('guarda de português na versão em inglês', () => {
  it('pega palavras que só existem em português', () => {
    expect(PORTUGUESE_ONLY.test('<li>sub-redes</li>')).toBe(true);
    expect(PORTUGUESE_ONLY.test('credenciais')).toBe(true);
    expect(PORTUGUESE_ONLY.test('Não alcançou')).toBe(true);
  });

  it('aceita nomes próprios com acento', () => {
    expect(PORTUGUESE_ONLY.test('Alec Theotônio, HubFólio, srv-financeiro, host-arquivo')).toBe(false);
    expect(PORTUGUESE_ONLY.test('Português')).toBe(false);
  });
});
