import { en } from './en';
import { pt, type Dict } from './pt';
import type { Lang } from './routes';

export type { Dict } from './pt';
export type { Lang, Slug } from './routes';

const dicts: Record<Lang, Dict> = { pt, en };

export const t = (lang: Lang): Dict => dicts[lang];

/** Número no formato do idioma: 2.252 em português, 2,252 em inglês. */
export const num = (lang: Lang, n: number, digits = 0): string =>
  new Intl.NumberFormat(lang === 'pt' ? 'pt-BR' : 'en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
