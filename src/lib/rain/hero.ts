import gsap from 'gsap';
import { decodeFrame } from '../decode';
import {
  createRain,
  dissolveAmber,
  lockGreen,
  reviveAmber,
  stepRain,
  type RainState,
} from './engine';
import { draw, type RainColors } from './render';

const SEED = 7;
const NARROW = 720;
const FRAME_MS = 1000 / 30;
const QUIET_INTENSITY = 0.42;
const DECODE_POOL = 'ABCDEFGHKLMNOPRSTUVXYZ0123456789';

interface NodeRef {
  id: string;
  group: SVGGElement;
  circle: SVGCircleElement;
  label: SVGTextElement | null;
  x: number;
  y: number;
}

/**
 * Liga a simulação da chuva ao canvas, ao grafo em SVG e ao nome.
 * Devolve `stop()`, que pode ser chamado mais de uma vez.
 *
 * `intro: false` pula a sequência de abertura e mostra direto o estado final;
 * a abertura toca uma vez por carregamento, não a cada volta à página inicial.
 */
export function startHero(root: HTMLElement, opts: { intro?: boolean } = {}): () => void {
  const canvas = root.querySelector('canvas');
  const svg = root.querySelector<SVGSVGElement>('[data-graph]');
  const nameEl = root.querySelector<HTMLElement>('[data-name]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx || !svg) return () => {};

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = getComputedStyle(document.documentElement);
  const colors: RainColors = {
    verde: css.getPropertyValue('--verde').trim() || '#3dffa2',
    ambar: css.getPropertyValue('--ambar').trim() || '#ffb23e',
    head: css.getPropertyValue('--texto').trim() || '#eaf3ee',
  };
  const fontFamily = css.getPropertyValue('--font-mono').trim() || 'monospace';

  const nodes: NodeRef[] = [...svg.querySelectorAll<SVGGElement>('[data-node]')].flatMap((group) => {
    const circle = group.querySelector('circle');
    return circle
      ? [{ id: group.dataset.node ?? '', group, circle, label: group.querySelector('text'), x: 0, y: 0 }]
      : [];
  });
  const edges = [...svg.querySelectorAll<SVGLineElement>('[data-edge]')];
  const parts = nameEl ? [...nameEl.querySelectorAll<HTMLElement>('[data-part]')] : [];
  const fullName = parts.map((p) => p.textContent ?? '').join(' ');

  const view = { intensity: 1 };
  const abort = new AbortController();
  let state: RainState = createRain(0, 0, 18, SEED);
  let width = 0;
  let height = 0;
  let pointerX: number | null = null;
  let raf = 0;
  let last = 0;
  let onScreen = true;
  let stopped = false;
  let timeline: gsap.core.Timeline | null = null;
  let resizeTimer = 0;

  const render = () => draw(ctx, state, colors, { intensity: view.intensity, pointerX, fontFamily });

  function measure(): void {
    const rect = root.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas!.width = Math.round(width * dpr);
    canvas!.height = Math.round(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    state = createRain(width, height, width < NARROW ? 15 : 18, SEED);
  }

  function targets(): { x: number; y: number }[] {
    const narrow = width < NARROW;
    return nodes.map((n) => {
      const d = n.group.dataset;
      return {
        x: Number(narrow ? d.mx : d.x) * width,
        y: Number(narrow ? d.my : d.y) * height,
      };
    });
  }

  /** Posiciona nós e arestas; `xs` traz o x de cada nó quando ele foi preso a uma coluna. */
  function placeGraph(points: { x: number; y: number }[]): void {
    nodes.forEach((n, i) => {
      const p = points[i];
      if (!p) return;
      n.x = p.x;
      n.y = p.y;
      n.circle.setAttribute('cx', String(p.x));
      n.circle.setAttribute('cy', String(p.y));
      n.label?.setAttribute('x', String(p.x));
      n.label?.setAttribute('y', String(p.y));
    });
    const byId = new Map(nodes.map((n) => [n.id, n]));
    for (const e of edges) {
      const a = byId.get(e.dataset.a ?? '');
      const b = byId.get(e.dataset.b ?? '');
      if (!a || !b) continue;
      e.setAttribute('x1', String(a.x));
      e.setAttribute('y1', String(a.y));
      e.setAttribute('x2', String(b.x));
      e.setAttribute('y2', String(b.y));
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      e.style.strokeDasharray = String(len);
      e.dataset.len = String(len);
    }
  }

  /**
   * Trava uma coluna verde por nó e prende o nó ao x da coluna.
   * Mover um nó muda o comprimento das arestas; com `hideEdges` elas voltam a ficar
   * inteiramente escondidas, para não sobrar um pedaço visível antes de serem desenhadas.
   */
  function lockToGraph(hideEdges: boolean): void {
    const wanted = targets();
    const locked = lockGreen(state, wanted);
    placeGraph(wanted.map((p, i) => ({ x: state.cols[locked[i] ?? -1]?.x ?? p.x, y: p.y })));
    if (hideEdges) for (const e of edges) e.style.strokeDashoffset = e.dataset.len ?? '0';
  }

  function setName(text: string): void {
    const pieces = text.split(' ');
    parts.forEach((el, i) => {
      el.textContent = pieces[i] ?? '';
    });
  }

  function frame(now: number): void {
    raf = requestAnimationFrame(frame);
    const elapsed = now - last;
    if (elapsed < FRAME_MS) return;
    last = now;
    stepRain(state, elapsed / 1000);
    render();
  }

  function play(): void {
    if (stopped || reduce || raf !== 0 || !onScreen || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function pause(): void {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  /** O estado final, sem animação: grafo formado, chuva discreta. */
  function settle(): void {
    lockToGraph(false);
    dissolveAmber(state);
    for (let i = 0; i < 260; i++) stepRain(state, 0.03);
    reviveAmber(state);
    for (let i = 0; i < 120; i++) stepRain(state, 0.03);
    view.intensity = QUIET_INTENSITY;
    gsap.set(
      nodes.map((n) => n.group),
      { opacity: 1 },
    );
    for (const e of edges) e.style.strokeDashoffset = '0';
    setName(fullName);
    render();
  }

  function intro(): void {
    const groups = nodes.map((n) => n.group);
    gsap.set(groups, { opacity: 0 });
    placeGraph(targets());
    for (const e of edges) e.style.strokeDashoffset = e.dataset.len ?? '0';

    const decode = { p: 0 };
    let lastDecode = 0;
    timeline = gsap
      .timeline({ onComplete: () => (timeline = null) })
      .to(
        decode,
        {
          p: 1,
          duration: 1.5,
          ease: 'none',
          onUpdate: () => {
            const now = performance.now();
            if (decode.p < 1 && now - lastDecode < 45) return;
            lastDecode = now;
            setName(decodeFrame(fullName, decode.p, Math.random, DECODE_POOL));
          },
        },
        0,
      )
      .call(() => dissolveAmber(state), [], 0.9)
      .call(() => lockToGraph(true), [], 1.3)
      .to(groups, { opacity: 1, duration: 0.35, stagger: 0.07, ease: 'power2.out' }, 2.0)
      .to(
        edges,
        { strokeDashoffset: 0, duration: 0.7, stagger: 0.06, ease: 'power2.inOut' },
        2.15,
      )
      .to(view, { intensity: QUIET_INTENSITY, duration: 1.2, ease: 'power1.inOut' }, 2.6)
      .call(() => reviveAmber(state), [], 3.0);
  }

  function onResize(): void {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (stopped) return;
      const rect = root.getBoundingClientRect();
      if (Math.abs(rect.width - width) < 2 && Math.abs(rect.height - height) < 80) return;
      // Redimensionou: vai direto ao estado final, sem repetir a abertura.
      timeline?.kill();
      timeline = null;
      measure();
      settle();
    }, 150);
  }

  measure();
  if (reduce || opts.intro === false) settle();
  else intro();
  // O quadro parado também precisa ser redesenhado quando a fonte termina de carregar.
  void document.fonts?.ready.then(() => !stopped && render());

  const io = new IntersectionObserver(
    (entries) => {
      // Entradas chegam em lote; a última é o estado atual.
      onScreen = entries[entries.length - 1]?.isIntersecting ?? true;
      if (onScreen) play();
      else pause();
    },
    { threshold: 0 },
  );
  io.observe(root);

  const ro = new ResizeObserver(onResize);
  ro.observe(root);

  const { signal } = abort;
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()), { signal });
  root.addEventListener(
    'pointermove',
    (e) => {
      pointerX = e.clientX - root.getBoundingClientRect().left;
    },
    { signal, passive: true },
  );
  root.addEventListener('pointerleave', () => (pointerX = null), { signal });

  play();

  return function stop(): void {
    if (stopped) return;
    stopped = true;
    pause();
    window.clearTimeout(resizeTimer);
    timeline?.kill();
    timeline = null;
    io.disconnect();
    ro.disconnect();
    abort.abort();
    setName(fullName);
  };
}
