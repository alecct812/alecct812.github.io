import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Um arquivo por projeto e por idioma: src/content/projects/<lang>/<slug>.yaml
const projects = defineCollection({
  loader: glob({
    pattern: '**/*.yaml',
    base: './src/content/projects',
    // O carregador usaria o campo `slug` como id, e os dois idiomas colidiriam.
    // O id passa a ser o caminho do arquivo: 'pt/tcc', 'en/tcc'.
    generateId: ({ entry }) => entry.replace(/\.yaml$/, ''),
  }),
  schema: z.object({
    slug: z.enum(['tcc', 'hubfolio', 'reconto', 'cesaride', 'arcos']),
    lang: z.enum(['pt', 'en']),
    order: z.number().int(),
    featured: z.boolean(),
    name: z.string(),
    tagline: z.string(),
    role: z.string(),
    period: z.string(),
    areas: z.array(z.enum(['security', 'ai', 'backend'])),
    stack: z.array(z.string()),
    repo: z.url(),
    situation: z.string(),
    task: z.string(),
    action: z.string(),
    result: z.string(),
  }),
});

export const collections = { projects };
