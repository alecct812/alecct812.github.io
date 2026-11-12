import { next, prev, viewAt } from './stepper';

/**
 * Liga o passo a passo ao mapa em SVG, aos controles e ao teclado.
 * Todo o conteúdo já está no HTML; aqui só se alterna o que aparece.
 * Devolve `stop()`, que pode ser chamado mais de uma vez.
 */
export function initLabMap(root: HTMLElement): () => void {
  const abort = new AbortController();
  const { signal } = abort;
  const all = <T extends Element>(sel: string) => [...root.querySelectorAll<T>(sel)];

  const hosts = all<SVGGElement>('[data-host]');
  const links = all<SVGLineElement>('[data-link]');
  const nets = all<SVGGElement>('[data-net]');
  const texts = all<HTMLElement>('[data-step]');
  const markers = all<HTMLButtonElement>('[data-goto]');
  const elos = all<HTMLElement>('[data-elo]');
  const counter = root.querySelector<HTMLElement>('[data-counter]');
  const prevBtn = root.querySelector<HTMLButtonElement>('[data-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-next]');
  const controls = root.querySelector<HTMLElement>('[data-controls]');

  let n = 1;

  function apply(): void {
    const v = viewAt(n);

    for (const g of hosts) {
      const id = g.dataset.host ?? '';
      g.dataset.state = v.activeHosts.includes(id) ? 'ativo' : v.visited.includes(id) ? 'visitado' : 'apagado';
    }
    for (const l of links) {
      const key = l.dataset.link ?? '';
      l.dataset.state = v.activeLinks.includes(key) ? 'ativo' : v.usedLinks.includes(key) ? 'usado' : 'apagado';
    }
    for (const g of nets) {
      g.dataset.state = g.dataset.net === 'interna' && !v.internalVisible ? 'oculta' : 'visivel';
    }
    for (const el of texts) el.hidden = Number(el.dataset.step) !== v.n;
    for (const b of markers) {
      const step = Number(b.dataset.goto);
      b.dataset.state = step === v.n ? 'atual' : step < v.n ? 'feito' : 'depois';
      if (step === v.n) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    }
    for (const el of elos) el.dataset.state = v.elosReached.includes(Number(el.dataset.elo)) ? 'aceso' : 'apagado';

    if (counter) {
      const template = counter.dataset.template ?? '{n}';
      counter.textContent = template.replace('{n}', String(v.n));
    }
    prevBtn?.setAttribute('aria-disabled', String(v.isFirst));
    nextBtn?.setAttribute('aria-disabled', String(v.isLast));
  }

  function go(to: number): void {
    const target = viewAt(to).n;
    if (target === n) return;
    n = target;
    apply();
  }

  prevBtn?.addEventListener('click', () => go(prev(n)), { signal });
  nextBtn?.addEventListener('click', () => go(next(n)), { signal });
  for (const b of markers) b.addEventListener('click', () => go(Number(b.dataset.goto)), { signal });

  controls?.addEventListener(
    'keydown',
    (e) => {
      const moves: Record<string, number> = {
        ArrowRight: next(n),
        ArrowLeft: prev(n),
        Home: 1,
        End: Number.POSITIVE_INFINITY,
      };
      const to = moves[e.key];
      if (to === undefined) return;
      e.preventDefault();
      go(to);
    },
    { signal },
  );

  root.dataset.enhanced = 'true';
  apply();

  return function stop(): void {
    abort.abort();
  };
}
