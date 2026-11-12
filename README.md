# Portfólio de Alec Theotônio

Site estático em [Astro](https://astro.build), em português e inglês, publicado em
<https://alecct812.github.io>.

## Rodar

Requer Node 22.23.4 ou superior.

```sh
npm install
npm run dev      # http://localhost:4321
```

## Verificar

```sh
npm run verify
```

Roda a checagem de tipos, os testes, gera o site e confere o resultado com
`scripts/check-dist.mjs`: as doze páginas, os links entre idiomas, a ausência de telefone e de
recursos de terceiros.

## Publicar

Cada `git push` em `main` gera e publica o site pelo GitHub Actions
(`.github/workflows/deploy.yml`).

## Onde editar

| O quê | Onde |
|---|---|
| Texto de um projeto | `src/content/projects/<idioma>/<projeto>.yaml` |
| Textos da interface e do TCC | `src/i18n/pt.ts` e `src/i18n/en.ts` |
| Habilidades, formação, contatos | `src/data/profile.ts` |
| Números do TCC | `src/data/tcc.ts` (com testes em `tests/tcc.test.ts`) |
| Cores e tipografia | `src/styles/tokens.css` |
| A chuva da abertura | `src/lib/rain/` |
| O mapa do laboratório | `src/lib/lab/` e `src/components/tcc/LabMap.astro` |

Para acrescentar um projeto: inclua o identificador em `SLUGS` (`src/i18n/routes.ts`) e no esquema
(`src/content.config.ts`), e crie um arquivo YAML por idioma.

## Regras do conteúdo

- Verde é o braço A do TCC e a ação principal. Âmbar é só o braço B.
- O mapa do laboratório mostra nomes de ação, nunca comandos ou credenciais.
- Nenhum telefone no repositório.
