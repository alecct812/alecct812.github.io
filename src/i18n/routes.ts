export type Lang = 'pt' | 'en';

export const SLUGS = ['tcc', 'hubfolio', 'reconto', 'cesaride', 'arcos'] as const;
export type Slug = (typeof SLUGS)[number];

const isSlug = (s: string): s is Slug => (SLUGS as readonly string[]).includes(s);
const parts = (pathname: string) => pathname.split('/').filter(Boolean);

export const homePath = (lang: Lang): string => (lang === 'pt' ? '/' : '/en/');

export const projectPath = (lang: Lang, slug: Slug): string =>
  lang === 'pt' ? `/projetos/${slug}/` : `/en/projects/${slug}/`;

export const langOf = (pathname: string): Lang => (parts(pathname)[0] === 'en' ? 'en' : 'pt');

/** A mesma página no outro idioma; a página inicial quando o caminho não é reconhecido. */
export function switchLangPath(pathname: string): string {
  const from = langOf(pathname);
  const to: Lang = from === 'pt' ? 'en' : 'pt';
  const p = from === 'en' ? parts(pathname).slice(1) : parts(pathname);
  const section = from === 'pt' ? 'projetos' : 'projects';
  const slug = p[1];
  if (p.length === 2 && p[0] === section && slug !== undefined && isSlug(slug)) {
    return projectPath(to, slug);
  }
  return homePath(to);
}
