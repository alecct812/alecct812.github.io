export const pt = {
  site: {
    name: 'Alec Theotônio',
    title: 'Alec Theotônio: segurança, IA e backend',
    description:
      'Portfólio de Alec Theotônio, estudante de Ciência da Computação na CESAR School. Agentes de IA para teste de invasão, pipelines de machine learning e backend.',
  },
  nav: {
    label: 'Navegação principal',
    projects: 'Projetos',
    skills: 'Habilidades',
    contact: 'Contato',
  },
  skip: 'Pular para o conteúdo',
  langSwitch: { label: 'English' },
  footer: {
    note: 'Feito com Astro e publicado no GitHub Pages.',
    source: 'Código deste site',
  },
  areaNames: { security: 'Segurança', ai: 'IA', backend: 'Backend' },

  hero: {
    statement:
      'Estudante de Ciência da Computação na CESAR School, no Recife. Trabalho onde segurança, IA e backend se encontram: agentes que testam redes, pipelines de machine learning e as APIs que os sustentam.',
    ctaTcc: 'Ver o TCC',
    ctaProjects: 'Ver projetos',
  },

  tccFeature: {
    heading: 'Um agente de teste de invasão lembra melhor da rede com um grafo do que com uma conversa?',
    body: 'No meu TCC, o mesmo agente rodou vinte vezes num laboratório isolado: dez com o estado da rede num grafo explícito, dez com memória conversacional. A medida é quantas execuções alcançaram a sub-rede interna.',
    armA: 'Braço A, grafo explícito',
    armB: 'Braço B, memória conversacional',
    of: (n: number) => `${n} de 10`,
    fisher: 'Fisher exato unicaudal',
    caveat:
      'O critério que fixei antes da coleta não foi atendido, e o estudo diz isso com todas as letras.',
    cta: 'Ler o estudo',
  },

  areas: {
    heading: 'Onde eu trabalho',
    hint: 'Escolha uma área para destacar os projetos dela na lista abaixo.',
    filter: (area: string) => `Destacar projetos de ${area}`,
    security:
      'Um laboratório de sete contêineres em duas sub-redes isoladas, com uma cadeia de onze passos percorrida à mão antes de qualquer agente tentar.',
    ai: 'Um agente com LLM medido em vinte execuções pareadas, e um modelo de regressão versionado no MLflow com RMSE de cerca de 5,13.',
    backend:
      'Cinco microsserviços em Docker Compose, seis endpoints REST em FastAPI e um ETL de MinIO para PostgreSQL.',
  },

  projects: {
    heading: 'Projetos',
  },

  skills: { heading: 'Habilidades' },
  education: {
    heading: 'Formação',
    certificates: 'Certificados',
    languages: 'Idiomas',
  },
  contact: {
    heading: 'Contato',
    lede: 'Para falar sobre um projeto, uma vaga ou o TCC, o e-mail é o caminho mais rápido.',
    email: 'E-mail',
  },

  project: {
    metaTitle: (name: string) => `${name} | Alec Theotônio`,
    role: 'Papel',
    period: 'Período',
    areas: 'Áreas',
    situation: 'Situação',
    task: 'Tarefa',
    action: 'Ação',
    result: 'Resultado',
    stack: 'Tecnologias',
    repo: 'Ver o código no GitHub',
    prev: 'Projeto anterior',
    next: 'Próximo projeto',
    all: 'Todos os projetos',
    summary: 'Resumo do projeto',
  },

  tcc: {
    advisor: 'Orientador: Prof. Ronierison Maciel',
    question: {
      heading: 'A pergunta',
      lede: 'Guardar o estado do ambiente fora da janela de contexto do modelo, numa estrutura persistente, muda a capacidade de um agente de teste de invasão de descobrir e alcançar uma sub-rede interna?',
      context:
        'Agentes de teste de invasão baseados em modelos de linguagem funcionam bem num host e falham ao atravessar uma rede segmentada. A causa documentada é a perda de contexto de sessão: ela responde por 42,36% das falhas em 220 experimentos (Kong et al., 2025, VulnBot) e é a causa principal de falha apontada por Deng et al. (2024, PentestGPT).',
      hypothesis:
        'A hipótese, registrada antes da coleta: um agente com estado explícito do ambiente descobre e alcança uma sub-rede interna visível apenas de um host já comprometido, enquanto o mesmo agente com memória conversacional linear não descobre.',
    },
    gap: {
      heading: 'A lacuna',
      intro:
        'Das cinco soluções que levantei, as quatro acadêmicas estruturam a tarefa, não o ambiente. A única que trata hosts e alcançabilidade como entidades é comercial, e é a única que pivota entre sub-redes.',
      cols: ['Solução', 'Estrutura de estado', 'O que os vértices representam', 'Pivota entre sub-redes?'],
      rows: [
        ['PentestGPT (Deng et al., 2024)', 'Pentesting Task Tree', 'tarefas', 'não'],
        ['VulnBot (Kong et al., 2025)', 'Penetration Task Graph', 'tarefas', 'não'],
        ['xOffense (Luong et al., 2025)', 'Task Coordination Graph', 'tarefas', 'não'],
        ['PentestAgent / GhostCrew (2025)', 'sem grafo de ambiente', 'tarefas', 'não'],
        ['Pentera (comercial)', 'modela o ambiente', 'hosts e alcançabilidade', 'sim'],
      ],
    },
    arms: {
      heading: 'Dois braços, uma diferença',
      intro:
        'O mesmo agente roda em duas configurações, idênticas em tudo exceto na forma de guardar o que foi descoberto. Modelo, prompt-base, ferramentas e o teto de 80 passos são os mesmos, e um verificador confere isso par a par.',
      aTitle: 'Braço A: estado em grafo explícito',
      aBody:
        'Hosts, sub-redes, credenciais, caminhos e tentativas ficam num grafo gravado em disco e serializado no prompt a cada passo, em seções nomeadas.',
      bTitle: 'Braço B: memória conversacional',
      bBody:
        'Histórico em prosa dos passos recentes, mais resumos das fases anteriores. É a estratégia de gestão de contexto das soluções existentes, reimplementada nas mesmas condições.',
      // O que o modelo vê em cada braço: seções nomeadas contra prosa que envelhece.
      seesA: ['hosts', 'sub-redes', 'credenciais', 'caminhos', 'tentativas'],
      seesB: ['resumo da fase 1', 'resumo da fase 2', 'passo 77', 'passo 78', 'passo 79'],
      principle:
        'Nos dois braços a saída bruta das ferramentas nunca chega ao modelo. Parsers dedicados extraem os fatos, e os dois braços recebem os mesmos fatos em formatos diferentes.',
    },
    lab: {
      heading: 'O laboratório',
      intro:
        'Sete contêineres Docker em duas sub-redes, sem rota para fora. A sub-rede interna só é visível de dentro do srv-deploy, que tem uma interface em cada rede. Percorri a cadeia inteira à mão antes de o agente tentar: são onze passos.',
      mapAria: 'Mapa do laboratório: quatro hosts na DMZ e três na sub-rede interna, ligados pelo srv-deploy',
      nets: { dmz: 'DMZ', interna: 'Interna' },
      roles: {
        atacante: 'atacante',
        entrada: 'entrada',
        distrator: 'distrator',
        pivo: 'pivô',
        interno: 'interno',
        trofeu: 'troféu',
      },
      controls: 'Percorrer a cadeia',
      prev: 'Passo anterior',
      next: 'Próximo passo',
      stepOf: (n: number) => `Passo ${n} de 11`,
      goTo: (n: number) => `Ir para o passo ${n}`,
      elos: 'Elos alcançados',
      elo: (n: number) => `Elo ${n}`,
      keyboard: 'Com o foco nos controles, as setas do teclado também percorrem os passos.',
      distractor:
        'O host-glhf é um distrator: uma aplicação vulnerável de terceiros, fora da cadeia, que dá ao agente um lugar fundo onde se perder.',
      steps: {
        recon: {
          name: 'Reconhecimento da DMZ',
          note: 'O agente parte só com o endereço da DMZ e descobre quais hosts respondem.',
        },
        services: {
          name: 'Levantamento dos serviços da DMZ',
          note: 'Identifica o que cada host expõe. O host-glhf aparece aqui e não leva a lugar nenhum da cadeia.',
        },
        route: {
          name: 'Confirmação da rota e do parâmetro vulnerável',
          note: 'Encontra no host-web a rota que aceita um parâmetro controlável.',
        },
        entry: {
          name: 'Injeção de comando no host de entrada',
          note: 'Primeiro comando executado dentro do laboratório e primeira credencial lida. Elos 1 e 2.',
        },
        pivotLogin: {
          name: 'Acesso por SSH ao srv-deploy',
          note: 'A credencial encontrada no passo anterior abre o srv-deploy. Elo 3.',
        },
        secondInterface: {
          name: 'Descoberta da segunda interface',
          note: 'O momento do pivô: de dentro do srv-deploy aparece uma rede que ninguém via de fora.',
        },
        internalScan: {
          name: 'Varredura da rede interna a partir do pivô',
          note: 'Três hosts novos passam a existir para o agente.',
        },
        credentialReuse: {
          name: 'Reuso da credencial no host-db',
          note: 'Comando executado na sub-rede interna. É o elo 4, o sucesso primário da hipótese.',
        },
        deployKey: {
          name: 'Localização da chave de deploy',
          note: 'No host-db está a chave que os outros hosts internos aceitam.',
        },
        archive: {
          name: 'Uso da chave no host-arquivo',
          note: 'O host-arquivo guarda a pista de onde está o alvo.',
        },
        trophy: {
          name: 'Uso da mesma chave no srv-financeiro',
          note: 'Leitura do troféu e fim da cadeia. Elo 5, descritivo: não entra no critério.',
        },
      },
    },
    results: {
      heading: 'O resultado em dez pares',
      intro:
        'Vinte execuções, todas até o teto de 80 passos. Cada coluna é um par: o laboratório é recriado entre os braços, e A e B aparecem lado a lado. A altura é o maior elo alcançado.',
      pair: (n: number) => `Par ${n}`,
      pairAria: (n: number, a: number, b: number) => `Par ${n}: braço A no elo ${a}, braço B no elo ${b}`,
      detail: (arm: string, elo: number, step: number | null) =>
        step === null
          ? `Braço ${arm}: elo ${elo}. Não alcançou a sub-rede interna.`
          : `Braço ${arm}: elo ${elo}. Alcançou a sub-rede interna no passo ${step}.`,
      pick: 'Selecione um par para ver o detalhe.',
      metric: 'Execuções que alcançaram a sub-rede interna, a métrica primária pré-registrada',
      eloAxis: 'elo',
    },
    limitation: {
      heading: 'O que o resultado não autoriza',
      p1: 'O critério congelado antes da coleta era A ≥ 6/10 e B ≤ 2/10. A condição de A foi atendida, com 8 de 10. A de B não foi, com 3 de 10, um a mais que o limite. Pelo critério que eu mesmo fixei, a hipótese não foi confirmada.',
      p2: 'O teste exato de Fisher dá p = 0,0349, significativo a 5%. Os dois números são relatados separadamente porque medem coisas diferentes: um limiar de proporção não é um teste de significância.',
      p3: 'Em dois pares os dois braços alcançaram a sub-rede interna, e em um par só o braço B alcançou. Nenhuma das vinte execuções chegou ao troféu dentro de 80 passos.',
    },
    rigor: {
      heading: 'Por que confiar na medida',
      intro:
        'A validade do resultado depende tanto do verificador quanto do agente, então a instrumentação é parte do artefato.',
      items: {
        checks: 'verificações automáticas, todas passando, sem chamar modelo',
        mutations: 'mutações cadastradas: cada uma injeta um defeito conhecido e confere que algum teste o detecta',
        verifiers: 'verificadores independentes de laboratório, execução, caminhos, hosts e paridade',
        steps: 'passos de agente em vinte execuções, com o mesmo modelo nos dois braços',
        pairs: 'pares aprovados no verificador de paridade: diferem só na estratégia de estado',
      },
    },
    repo: {
      body: 'O repositório traz o agente, o laboratório, os vinte registros de execução passo a passo e os verificadores. A tabela de resultados é gerada por programa a partir dos registros.',
      notice:
        'O laboratório é isolado, local e em contêiner. Nada ali deve ser executado contra um sistema que você não esteja autorizado a testar.',
    },
  },

  hubfolio: {
    heading: 'O caminho do dado',
    intro:
      'Cinco serviços em Docker Compose. O dado entra pela API, passa pelo armazenamento e pelo banco, alimenta o treino e volta como predição num painel.',
    aria: 'Diagrama do pipeline: FastAPI, MinIO, PostgreSQL, MLflow e ThingsBoard, na ordem em que o dado passa por eles',
    stages: [
      { service: 'FastAPI', name: 'Ingestão', note: 'A API recebe os dados dos portfólios.' },
      { service: 'MinIO', name: 'Armazenamento', note: 'O dado bruto fica num bucket S3.' },
      { service: 'PostgreSQL', name: 'ETL', note: 'Transformação e carga no banco relacional.' },
      { service: 'MLflow', name: 'Treino', note: 'Regressão Linear com 8 features, versionada.' },
      { service: 'FastAPI', name: 'Predição', note: 'A API devolve o índice de qualidade.' },
      { service: 'ThingsBoard', name: 'Painel', note: 'Predições em tempo real.' },
    ],
    metrics: [
      { value: '~5,13', label: 'RMSE, em pontos do índice de qualidade' },
      { value: '8', label: 'features de qualidade no modelo' },
      { value: '6', label: 'endpoints REST' },
      { value: '5', label: 'serviços orquestrados' },
    ],
  },

  notFound: {
    title: 'Página não encontrada',
    body: 'Este endereço não existe no site.',
    cta: 'Ir para a página inicial',
  },
};

export type Dict = typeof pt;
