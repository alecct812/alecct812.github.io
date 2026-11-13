import type { Lang } from '../i18n/routes';

type Text = Record<Lang, string>;

export interface SkillGroup {
  name: Text;
  items: Text[];
}

const same = (s: string): Text => ({ pt: s, en: s });

export const SKILLS: readonly SkillGroup[] = [
  {
    name: { pt: 'Linguagens', en: 'Languages' },
    items: ['Python', 'Java', 'JavaScript', 'C', 'SQL'].map(same),
  },
  {
    name: { pt: 'Frameworks e ferramentas', en: 'Frameworks and tools' },
    items: ['Django', 'FastAPI', 'PostgreSQL', 'Docker', 'MinIO'].map(same),
  },
  {
    name: { pt: 'Machine learning', en: 'Machine learning' },
    items: [same('MLflow'), same('Scikit-learn'), { pt: 'Análise estatística', en: 'Statistical analysis' }],
  },
  {
    name: { pt: 'Engenharia', en: 'Engineering' },
    items: [
      { pt: 'Engenharia de software', en: 'Software engineering' },
      { pt: 'Requisitos e arquitetura de software', en: 'Software requirements and architecture' },
      { pt: 'Análise estatística de dados', en: 'Statistical data analysis' },
    ],
  },
  {
    name: { pt: 'Metodologias', en: 'Methods' },
    items: ['ScrumBan', 'Jira', 'Pair Programming', 'UML'].map(same),
  },
];

export const EDUCATION = {
  school: 'CESAR School',
  place: { pt: 'Recife, PE', en: 'Recife, Brazil' } satisfies Text,
  degree: { pt: 'Bacharelado em Ciência da Computação', en: 'BSc in Computer Science' } satisfies Text,
  period: { pt: '2023 até hoje, 8º período', en: '2023 to present, 8th semester' } satisfies Text,
};

export const CERTIFICATES: readonly Text[] = [
  { pt: 'AWS Academy Graduate: Generative AI Foundations', en: 'AWS Academy Graduate: Generative AI Foundations' },
  { pt: 'AWS Academy Graduate: Cloud Foundations', en: 'AWS Academy Graduate: Cloud Foundations' },
  { pt: 'Monitoria em Fundamentos de Programação', en: 'Teaching assistant, Programming Fundamentals' },
  { pt: 'Participação na Tempest Academy Conference 2023', en: 'Attendance, Tempest Academy Conference 2023' },
];

export const LANGUAGES: readonly { name: Text; level: Text }[] = [
  { name: { pt: 'Português', en: 'Portuguese' }, level: { pt: 'nativo', en: 'native' } },
  { name: { pt: 'Inglês', en: 'English' }, level: { pt: 'avançado', en: 'advanced' } },
];

export const CONTACTS = {
  email: 'actheotonio@hotmail.com',
  linkedin: { label: 'linkedin.com/in/alectheotonio', url: 'https://www.linkedin.com/in/alectheotonio/' },
  github: { label: 'github.com/alecct812', url: 'https://github.com/alecct812' },
} as const;
