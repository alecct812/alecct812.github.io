import type { Dict } from './pt';

export const en: Dict = {
  site: {
    name: 'Alec Theotônio',
    title: 'Alec Theotônio: security, AI, and backend',
    description:
      'Portfolio of Alec Theotônio, Computer Science student at CESAR School. AI agents for penetration testing, machine learning pipelines, and backend.',
  },
  nav: {
    label: 'Main navigation',
    projects: 'Projects',
    skills: 'Skills',
    contact: 'Contact',
  },
  skip: 'Skip to content',
  langSwitch: { label: 'Português' },
  footer: {
    note: 'Built with Astro and published on GitHub Pages.',
    source: 'Source code for this site',
  },
  areaNames: { security: 'Security', ai: 'AI', backend: 'Backend' },

  hero: {
    statement:
      'Computer Science student at CESAR School in Recife, Brazil. I work where security, AI, and backend meet: agents that test networks, machine learning pipelines, and the APIs behind them.',
    ctaTcc: 'View the thesis',
    ctaProjects: 'View projects',
  },

  tccFeature: {
    heading: 'Does a penetration testing agent remember the network better with a graph than with a conversation?',
    body: 'For my undergraduate thesis, the same agent ran twenty times in an isolated lab: ten with the network state in an explicit graph, ten with conversational memory. The measure is how many runs reached the internal subnet.',
    armA: 'Arm A, explicit graph',
    armB: 'Arm B, conversational memory',
    of: (n: number) => `${n} of 10`,
    fisher: "One-tailed Fisher's exact test",
    caveat: 'The criterion I fixed before data collection was not met, and the study says so plainly.',
    cta: 'Read the study',
  },

  areas: {
    heading: 'Where I work',
    hint: 'Pick an area to highlight its projects in the list below.',
    filter: (area: string) => `Highlight ${area} projects`,
    security:
      'A lab of seven containers on two isolated subnets, with an eleven-step chain walked by hand before any agent tried it.',
    ai: 'An LLM agent measured across twenty paired runs, and a regression model versioned in MLflow with an RMSE of about 5.13.',
    backend:
      'Five microservices on Docker Compose, six REST endpoints in FastAPI, and an ETL from MinIO to PostgreSQL.',
  },

  projects: {
    heading: 'Projects',
  },

  skills: { heading: 'Skills' },
  education: {
    heading: 'Education',
    certificates: 'Certificates',
    languages: 'Languages',
  },
  contact: {
    heading: 'Contact',
    lede: 'To talk about a project, a role, or the thesis, email is the fastest way.',
    email: 'Email',
  },

  project: {
    metaTitle: (name: string) => `${name} | Alec Theotônio`,
    role: 'Role',
    period: 'Period',
    areas: 'Areas',
    situation: 'Situation',
    task: 'Task',
    action: 'Action',
    result: 'Result',
    stack: 'Technologies',
    repo: 'View the code on GitHub',
    prev: 'Previous project',
    next: 'Next project',
    all: 'All projects',
    summary: 'Project summary',
  },

  tcc: {
    advisor: 'Advisor: Prof. Ronierison Maciel',
    question: {
      heading: 'The question',
      lede: 'Does keeping the state of the environment outside the model’s context window, in a persistent structure, change a penetration testing agent’s ability to discover and reach an internal subnet?',
      context:
        'Penetration testing agents built on language models do well on a single host and fail when crossing a segmented network. The documented cause is loss of session context: it accounts for 42.36% of failures across 220 experiments (Kong et al., 2025, VulnBot) and is the main cause of failure reported by Deng et al. (2024, PentestGPT).',
      hypothesis:
        'The hypothesis, recorded before data collection: an agent with explicit environment state discovers and reaches an internal subnet visible only from an already compromised host, while the same agent with linear conversational memory does not.',
    },
    gap: {
      heading: 'The gap',
      intro:
        'Of the five solutions I surveyed, the four academic ones structure the task, not the environment. The only one that treats hosts and reachability as entities is commercial, and it is the only one that pivots between subnets.',
      cols: ['Solution', 'State structure', 'What the vertices represent', 'Pivots between subnets?'],
      rows: [
        ['PentestGPT (Deng et al., 2024)', 'Pentesting Task Tree', 'tasks', 'no'],
        ['VulnBot (Kong et al., 2025)', 'Penetration Task Graph', 'tasks', 'no'],
        ['xOffense (Luong et al., 2025)', 'Task Coordination Graph', 'tasks', 'no'],
        ['PentestAgent / GhostCrew (2025)', 'no environment graph', 'tasks', 'no'],
        ['Pentera (commercial)', 'models the environment', 'hosts and reachability', 'yes'],
      ],
    },
    arms: {
      heading: 'Two arms, one difference',
      intro:
        'The same agent runs in two configurations, identical in everything except how it keeps what it has discovered. Model, base prompt, tools, and the 80-step ceiling are the same, and a verifier checks that pair by pair.',
      aTitle: 'Arm A: explicit graph state',
      aBody:
        'Hosts, subnets, credentials, paths, and attempts live in a graph saved to disk and serialized into the prompt at every step, in named sections.',
      bTitle: 'Arm B: conversational memory',
      bBody:
        'A prose history of recent steps, plus summaries of earlier phases. It is the context management strategy of existing solutions, reimplemented under the same conditions.',
      seesA: ['hosts', 'subnets', 'credentials', 'paths', 'attempts'],
      seesB: ['phase 1 summary', 'phase 2 summary', 'step 77', 'step 78', 'step 79'],
      principle:
        'In both arms, raw tool output never reaches the model. Dedicated parsers extract the facts, and both arms receive the same facts in different formats.',
    },
    lab: {
      heading: 'The lab',
      intro:
        'Seven Docker containers on two subnets, with no route out. The internal subnet is visible only from inside srv-deploy, which has one interface on each network. I walked the full chain by hand before the agent tried it: eleven steps.',
      mapAria: 'Lab map: four hosts in the DMZ and three on the internal subnet, joined by srv-deploy',
      nets: { dmz: 'DMZ', interna: 'Internal' },
      roles: {
        atacante: 'attacker',
        entrada: 'entry',
        distrator: 'distractor',
        pivo: 'pivot',
        interno: 'internal',
        trofeu: 'trophy',
      },
      controls: 'Walk the chain',
      prev: 'Previous step',
      next: 'Next step',
      stepOf: (n: number) => `Step ${n} of 11`,
      goTo: (n: number) => `Go to step ${n}`,
      elos: 'Milestones reached',
      elo: (n: number) => `Milestone ${n}`,
      keyboard: 'With focus on the controls, the arrow keys also move through the steps.',
      distractor:
        'host-glhf is a distractor: a vulnerable third-party application, outside the chain, that gives the agent a deep place to get lost in.',
      steps: {
        recon: {
          name: 'DMZ reconnaissance',
          note: 'The agent starts with only the DMZ address and finds out which hosts respond.',
        },
        services: {
          name: 'Service discovery in the DMZ',
          note: 'It identifies what each host exposes. host-glhf shows up here and leads nowhere in the chain.',
        },
        route: {
          name: 'Confirming the route and the vulnerable parameter',
          note: 'It finds the route on host-web that accepts a controllable parameter.',
        },
        entry: {
          name: 'Command injection on the entry host',
          note: 'First command executed inside the lab and first credential read. Milestones 1 and 2.',
        },
        pivotLogin: {
          name: 'SSH access to srv-deploy',
          note: 'The credential found in the previous step opens srv-deploy. Milestone 3.',
        },
        secondInterface: {
          name: 'Discovering the second interface',
          note: 'The pivot moment: from inside srv-deploy, a network appears that nobody could see from outside.',
        },
        internalScan: {
          name: 'Scanning the internal network from the pivot',
          note: 'Three new hosts come into existence for the agent.',
        },
        credentialReuse: {
          name: 'Credential reuse on host-db',
          note: 'A command executed on the internal subnet. This is milestone 4, the primary success of the hypothesis.',
        },
        deployKey: {
          name: 'Locating the deploy key',
          note: 'host-db holds the key the other internal hosts accept.',
        },
        archive: {
          name: 'Using the key on host-arquivo',
          note: 'host-arquivo holds the hint to where the target is.',
        },
        trophy: {
          name: 'Using the same key on srv-financeiro',
          note: 'Reading the trophy and the end of the chain. Milestone 5, descriptive: it is not part of the criterion.',
        },
      },
    },
    results: {
      heading: 'The result in ten pairs',
      intro:
        'Twenty runs, all to the 80-step ceiling. Each column is a pair: the lab is rebuilt between arms, and A and B sit side by side. Height is the highest milestone reached.',
      pair: (n: number) => `Pair ${n}`,
      pairAria: (n: number, a: number, b: number) => `Pair ${n}: arm A at milestone ${a}, arm B at milestone ${b}`,
      detail: (arm: string, elo: number, step: number | null) =>
        step === null
          ? `Arm ${arm}: milestone ${elo}. Did not reach the internal subnet.`
          : `Arm ${arm}: milestone ${elo}. Reached the internal subnet at step ${step}.`,
      pick: 'Select a pair to see the detail.',
      metric: 'Runs that reached the internal subnet, the preregistered primary metric',
      eloAxis: 'milestone',
    },
    limitation: {
      heading: 'What the result does not support',
      p1: 'The criterion frozen before data collection was A ≥ 6/10 and B ≤ 2/10. The A condition was met, with 8 of 10. The B condition was not, with 3 of 10, one above the limit. By the criterion I set myself, the hypothesis was not confirmed.',
      p2: 'Fisher’s exact test gives p = 0.0349, significant at 5%. The two numbers are reported separately because they measure different things: a proportion threshold is not a significance test.',
      p3: 'In two pairs both arms reached the internal subnet, and in one pair only arm B did. None of the twenty runs reached the trophy within 80 steps.',
    },
    rigor: {
      heading: 'Why trust the measurement',
      intro:
        'The validity of the result depends on the verifier as much as on the agent, so the instrumentation is part of the artifact.',
      items: {
        checks: 'automated checks, all passing, with no model calls',
        mutations: 'registered mutations: each one injects a known defect and confirms some test catches it',
        verifiers: 'independent verifiers for the lab, runs, paths, hosts, and parity',
        steps: 'agent steps across twenty runs, with the same model in both arms',
        pairs: 'pairs approved by the parity verifier: they differ only in state strategy',
      },
    },
    repo: {
      body: 'The repository holds the agent, the lab, the twenty step-by-step run records, and the verifiers. The results table is generated by a program from those records.',
      notice:
        'The lab is isolated, local, and containerized. Nothing in it should be run against a system you are not authorized to test.',
    },
  },

  hubfolio: {
    heading: 'The path of the data',
    intro:
      'Five services on Docker Compose. Data comes in through the API, passes through storage and the database, feeds training, and comes back as a prediction on a dashboard.',
    aria: 'Pipeline diagram: FastAPI, MinIO, PostgreSQL, MLflow, and ThingsBoard, in the order data passes through them',
    stages: [
      { service: 'FastAPI', name: 'Ingestion', note: 'The API receives portfolio data.' },
      { service: 'MinIO', name: 'Storage', note: 'Raw data lands in an S3 bucket.' },
      { service: 'PostgreSQL', name: 'ETL', note: 'Transformation and load into the relational database.' },
      { service: 'MLflow', name: 'Training', note: 'Linear Regression with 8 features, versioned.' },
      { service: 'FastAPI', name: 'Prediction', note: 'The API returns the quality index.' },
      { service: 'ThingsBoard', name: 'Dashboard', note: 'Predictions in real time.' },
    ],
    metrics: [
      { value: '~5.13', label: 'RMSE, in quality index points' },
      { value: '8', label: 'quality features in the model' },
      { value: '6', label: 'REST endpoints' },
      { value: '5', label: 'orchestrated services' },
    ],
  },

  notFound: {
    title: 'Page not found',
    body: 'This address does not exist on the site.',
    cta: 'Go to the home page',
  },
};
