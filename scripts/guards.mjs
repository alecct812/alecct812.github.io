// Padrões que o site e o repositório não podem conter.
// Usados por scripts/check-dist.mjs e testados em tests/guards.test.ts.

/**
 * Qualquer coisa com formato de celular brasileiro: DDI opcional, DDD, 9 e oito dígitos,
 * com ou sem parênteses, espaços, pontos ou hífens. Só casa no início de uma sequência de
 * dígitos, para não confundir com endereços IP, datas ou constantes numéricas.
 * O número do autor não está escrito aqui nem em lugar nenhum do repositório.
 */
export const PHONE = /(?<![\d.])(?:\+?55[\s.-]?)?\(?\d{2}\)?[\s.-]?9[\s.-]?\d{4}[\s.-]?\d{4}(?!\d)/;

/** Valor em dólares. O custo da coleta do TCC não é publicado. */
export const COST = /US\$\s?\d|\$\s?\d+[.,]\d{2,}|\bUSD\b/;

/** Palavras que só existem em português; não podem aparecer nas páginas em inglês. */
export const PORTUGUESE_ONLY =
  /(?<!\p{L})(?:sub-redes|credenciais|caminhos|tentativas|não|você|também)(?!\p{L})|çã?o(?!\p{L})|ções(?!\p{L})/iu;
