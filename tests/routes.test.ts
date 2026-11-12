import { describe, expect, it } from 'vitest';
import { homePath, langOf, projectPath, switchLangPath } from '../src/i18n/routes';

describe('rotas por idioma', () => {
  it('monta os caminhos', () => {
    expect(homePath('pt')).toBe('/');
    expect(homePath('en')).toBe('/en/');
    expect(projectPath('pt', 'tcc')).toBe('/projetos/tcc/');
    expect(projectPath('en', 'hubfolio')).toBe('/en/projects/hubfolio/');
  });

  it('reconhece o idioma pelo caminho', () => {
    expect(langOf('/')).toBe('pt');
    expect(langOf('/projetos/tcc/')).toBe('pt');
    expect(langOf('/en/')).toBe('en');
    expect(langOf('/en/projects/tcc/')).toBe('en');
    expect(langOf('/entrada/')).toBe('pt');
  });

  it('troca o idioma mantendo a página', () => {
    expect(switchLangPath('/')).toBe('/en/');
    expect(switchLangPath('/en/')).toBe('/');
    expect(switchLangPath('/projetos/tcc/')).toBe('/en/projects/tcc/');
    expect(switchLangPath('/en/projects/arcos/')).toBe('/projetos/arcos/');
    expect(switchLangPath('/projetos/tcc')).toBe('/en/projects/tcc/');
  });

  it('cai na página inicial do outro idioma quando não reconhece o caminho', () => {
    expect(switchLangPath('/404/')).toBe('/en/');
    expect(switchLangPath('/en/qualquer/')).toBe('/');
    expect(switchLangPath('/projetos/inexistente/')).toBe('/en/');
  });
});
