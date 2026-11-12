import { defineConfig } from 'vitest/config';

// Os testes cobrem só módulos TypeScript puros (sem DOM e sem Astro),
// então não precisam da configuração do Astro.
export default defineConfig({
  test: { include: ['tests/**/*.test.ts'] },
});
