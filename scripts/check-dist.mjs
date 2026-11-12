// Confere o site gerado. Uso: node scripts/check-dist.mjs [pasta]   (padrão: dist)
// Falha com código 1 e a lista do que encontrou.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { COST, PHONE, PORTUGUESE_ONLY } from './guards.mjs';

const root = process.argv[2] ?? 'dist';
const SLUGS = ['tcc', 'hubfolio', 'reconto', 'cesaride', 'arcos'];
const problems = [];
const fail = (msg) => problems.push(msg);

if (!existsSync(root)) {
  console.error(`check-dist: a pasta "${root}" não existe. Rode "npm run build" antes.`);
  process.exit(1);
}

const page = (...parts) => join(root, ...parts, 'index.html');
const read = (file) => readFileSync(file, 'utf8');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// 1. As doze páginas e a 404.
const pages = {
  pt: [page(), ...SLUGS.map((s) => page('projetos', s))],
  en: [page('en'), ...SLUGS.map((s) => page('en', 'projects', s))],
};
for (const file of [...pages.pt, ...pages.en, join(root, '404.html')]) {
  if (!existsSync(file)) fail(`página ausente: ${relative(root, file)}`);
}

// 2. Nenhum telefone e nenhum valor em dólares, nem no site gerado nem nos arquivos
//    versionados. Os padrões ficam em scripts/guards.mjs.
const TEXT = /\.(html|js|mjs|ts|astro|css|xml|txt|svg|json|ya?ml|md)$/;
const files = walk(root).filter((f) => TEXT.test(f));

let tracked = [];
if (root === 'dist') {
  try {
    tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
      .split(/\r?\n/)
      .filter((f) => TEXT.test(f) && f !== 'package-lock.json' && existsSync(f));
  } catch {
    // Fora de um repositório git só o site gerado é conferido.
  }
}

for (const [where, list] of [
  [root, files],
  ['repositório', tracked],
]) {
  for (const file of list) {
    const text = read(file);
    const name = where === root ? relative(root, file) : file;
    const phone = text.match(PHONE);
    if (phone) fail(`algo com formato de telefone em ${name} (${where}): "${phone[0]}"`);
    const cost = text.match(COST);
    if (cost) fail(`valor em dólares em ${name} (${where}): "${cost[0]}"`);
  }
}

// 3. O essencial está no HTML, sem depender de JavaScript.
const mustContain = (file, needles) => {
  if (!existsSync(file)) return;
  const html = read(file);
  for (const n of needles) if (!html.includes(n)) fail(`${relative(root, file)} não contém "${n}"`);
};
mustContain(page(), ['Alec', 'Theotônio', '8 de 10', '3 de 10']);
mustContain(page('en'), ['Alec', 'Theotônio', '8 of 10', '3 of 10']);
mustContain(page('projetos', 'tcc'), ['8 de 10', '3 de 10', 'Passo 1 de 11']);
mustContain(page('en', 'projects', 'tcc'), ['8 of 10', '3 of 10', 'Step 1 of 11']);

// 3b. As páginas em inglês não trazem texto em português.
for (const file of pages.en) {
  if (!existsSync(file)) continue;
  // Só o texto visível: sem marcação, scripts, estilos ou atributos.
  const visible = read(file)
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const hit = visible.match(PORTUGUESE_ONLY);
  if (hit) fail(`${relative(root, file)} tem texto em português: "${hit[0]}"`);
}

// 4. Cada página inicial lista os cinco projetos, e cada um leva à sua página.
for (const [lang, home, prefix] of [
  ['pt', page(), '/projetos/'],
  ['en', page('en'), '/en/projects/'],
]) {
  if (!existsSync(home)) continue;
  const html = read(home);
  // Projeto sem área sai com o atributo vazio, sem "=": conta-se o atributo, não o valor.
  const rows = (html.match(/<li[^>]*\sdata-project-areas[\s=>]/g) ?? []).length;
  // Todo projeto pertence a pelo menos uma área, senão some em qualquer filtro.
  const empty = (html.match(/<li[^>]*\sdata-project-areas(?:="")?[\s>]/g) ?? []).length;
  if (empty > 0) fail(`página inicial (${lang}) tem ${empty} projeto(s) sem área`);
  if (rows !== SLUGS.length) fail(`página inicial (${lang}) lista ${rows} projetos, esperados ${SLUGS.length}`);
  for (const s of SLUGS) {
    if (!html.includes(`href="${prefix}${s}/"`)) fail(`página inicial (${lang}) sem link para ${prefix}${s}/`);
  }
}

// 5. Toda página aponta para a sua versão no outro idioma, e o destino existe.
const SITE = 'https://alecct812.github.io';
for (const [lang, list] of Object.entries(pages)) {
  const other = lang === 'pt' ? 'en' : 'pt';
  for (const file of list) {
    if (!existsSync(file)) continue;
    const m = read(file).match(new RegExp(`<link rel="alternate" hreflang="${other}" href="([^"]+)"`));
    if (!m) {
      fail(`${relative(root, file)} sem hreflang para ${other}`);
      continue;
    }
    const path = m[1].startsWith(SITE) ? m[1].slice(SITE.length) : null;
    if (path === null || !existsSync(join(root, path, 'index.html'))) {
      fail(`${relative(root, file)}: hreflang ${other} aponta para página inexistente (${m[1]})`);
    }
  }
}

// 6. Nenhum recurso carregado de terceiros.
for (const file of files) {
  const text = read(file);
  if (file.endsWith('.html')) {
    if (/\s(?:src|srcset)=["']https?:\/\//.test(text)) fail(`${relative(root, file)} carrega recurso externo (src)`);
    if (/<link[^>]+rel=["']stylesheet["'][^>]+href=["']https?:\/\//.test(text))
      fail(`${relative(root, file)} carrega folha de estilo externa`);
  }
  if (file.endsWith('.css') && /url\(["']?https?:\/\//.test(text)) {
    fail(`${relative(root, file)} referencia recurso externo`);
  }
}

// 7. Todo link ou recurso interno citado num HTML existe no site gerado.
for (const file of files.filter((f) => f.endsWith('.html'))) {
  for (const m of read(file).matchAll(/\s(?:href|src)="(\/[^"#?]*)/g)) {
    const target = join(root, decodeURI(m[1]));
    const ok = existsSync(target) && (statSync(target).isFile() || existsSync(join(target, 'index.html')));
    if (!ok) fail(`${relative(root, file)} aponta para ${m[1]}, que não existe`);
  }
}

// 8. A página do TCC mostra nomes de ação, nunca comandos ou credenciais.
const FORBIDDEN = /\b(?:nmap|hydra|sqlmap|curl|ssh|nc)\s+-{1,2}\w|password|passwd|senha|BEGIN [A-Z ]*PRIVATE KEY/i;
for (const file of [page('projetos', 'tcc'), page('en', 'projects', 'tcc')]) {
  if (!existsSync(file)) continue;
  const hit = read(file).match(FORBIDDEN);
  if (hit) fail(`${relative(root, file)} contém algo que parece comando ou credencial: "${hit[0]}"`);
}

if (problems.length > 0) {
  console.error(`check-dist: ${problems.length} problema(s) em "${root}":`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`check-dist: ok (${files.length} arquivos de texto, ${pages.pt.length + pages.en.length} páginas e a 404).`);
