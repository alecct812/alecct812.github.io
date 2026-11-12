/**
 * Um quadro da decodificação: os primeiros caracteres já são os do alvo,
 * o resto é sorteado de `pool`. Espaços e comprimento são preservados.
 */
export function decodeFrame(target: string, progress: number, rand: () => number, pool: string): string {
  const chars = [...target];
  const poolChars = [...pool];
  if (poolChars.length === 0) return target;
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  const revealed = Math.round(p * chars.length);
  return chars
    .map((ch, i) => {
      if (i < revealed || ch === ' ') return ch;
      return poolChars[Math.min(poolChars.length - 1, Math.floor(rand() * poolChars.length))] ?? ch;
    })
    .join('');
}
