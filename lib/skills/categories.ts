import type { SkillCategory, SkillCategorySlug } from './types'

/**
 * The dev-tool-centric taxonomy for the Skills Library — 24 categories,
 * matching the audience `/tools` and `/prompts` already serve. Each
 * category's `seedQueries` are the real skills.sh `/api/search` terms
 * `scripts/sync-skills.mjs` uses to discover and grow it: a combinatorial
 * mechanism (task × real stack/tool variant) so the library's size is a
 * function of real, existing skills rather than invented content.
 */
export const SKILL_CATEGORIES: readonly SkillCategory[] = [
  {
    slug: 'testing',
    name: 'Testing',
    blurb: 'Unit, integration, e2e, and property-based testing skills.',
    intro:
      'Skills for writing and running tests — framework-specific patterns for Jest, Vitest, pytest, Go testing, RSpec, JUnit, Playwright, Cypress, and more.',
    icon: 'TestTube',
    tile: 'green',
    seedQueries: [
      'testing',
      'jest testing',
      'vitest',
      'pytest',
      'go testing',
      'rspec',
      'junit',
      'playwright testing',
      'cypress testing',
      'e2e testing',
      'unit testing',
      'integration testing',
      'mutation testing',
      'property based testing',
      'snapshot testing',
      'load testing',
    ],
  },
  {
    slug: 'debugging',
    name: 'Debugging',
    blurb: 'Root-causing bugs, reading stack traces, bisecting regressions.',
    intro:
      'Skills for systematic debugging — reproducing bugs, reading stack traces, bisecting regressions, and diagnosing flaky failures.',
    icon: 'Bug',
    tile: 'yellow',
    seedQueries: [
      'debugging',
      'stack trace analysis',
      'bisect regression',
      'flaky test debugging',
      'memory leak debugging',
      'production debugging',
      'log analysis debugging',
    ],
  },
  {
    slug: 'git-workflows',
    name: 'Git Workflows',
    blurb: 'Branching strategy, commit hygiene, rebase, and merge conflicts.',
    intro:
      'Skills for git — commit message conventions, branching strategy, rebase workflows, merge conflict resolution, and git hooks.',
    icon: 'GitBranch',
    tile: 'blue',
    seedQueries: [
      'git workflow',
      'git commit conventions',
      'git rebase',
      'merge conflict resolution',
      'git hooks',
      'branching strategy',
      'monorepo git',
    ],
  },
  {
    slug: 'code-review',
    name: 'Code Review',
    blurb: 'Structured review checklists and PR-quality skills.',
    intro:
      'Skills for reviewing code well — structured checklists, spotting anti-patterns, and giving actionable feedback on pull requests.',
    icon: 'GitPullRequest',
    tile: 'lavender',
    seedQueries: [
      'code review',
      'pull request review',
      'code review checklist',
      'security code review',
      'performance code review',
    ],
  },
  {
    slug: 'refactoring',
    name: 'Refactoring',
    blurb: 'Safely restructuring code without changing behavior.',
    intro:
      'Skills for refactoring — extracting functions, untangling legacy code, and migrating patterns without breaking behavior.',
    icon: 'Wrench',
    tile: 'green',
    seedQueries: [
      'refactoring',
      'legacy code migration',
      'extract function refactor',
      'dead code removal',
      'code smell',
    ],
  },
  {
    slug: 'api-design',
    name: 'API Design',
    blurb: 'REST, GraphQL, versioning, and API contract skills.',
    intro:
      'Skills for designing APIs — REST conventions, GraphQL schema design, versioning strategy, rate limiting, and OpenAPI contracts.',
    icon: 'Network',
    tile: 'blue',
    seedQueries: [
      'rest api design',
      'graphql api design',
      'api versioning',
      'openapi spec',
      'rate limiting api',
      'webhook design',
      'grpc api',
    ],
  },
  {
    slug: 'database',
    name: 'Database',
    blurb: 'Schema design, migrations, query optimization.',
    intro:
      'Skills for databases — schema design, migrations, indexing, query optimization, and working with Postgres, MySQL, MongoDB, Redis.',
    icon: 'Database',
    tile: 'yellow',
    seedQueries: [
      'postgres',
      'mysql',
      'mongodb',
      'redis',
      'database migration',
      'query optimization',
      'database indexing',
      'sql schema design',
    ],
  },
  {
    slug: 'security',
    name: 'Security',
    blurb: 'Auditing, penetration testing, secrets, and encryption.',
    intro:
      'Skills for security — code auditing, penetration testing, secrets management, encryption, and dependency vulnerability scanning.',
    icon: 'ShieldCheck',
    tile: 'lavender',
    seedQueries: [
      'security audit',
      'penetration testing',
      'secrets management',
      'encryption',
      'dependency vulnerability',
      'owasp',
      'authentication security',
      'api security testing',
    ],
  },
  {
    slug: 'performance',
    name: 'Performance',
    blurb: 'Profiling, caching, and load-time optimization.',
    intro:
      'Skills for performance — profiling, caching strategy, database query tuning, and frontend load-time optimization.',
    icon: 'Gauge',
    tile: 'green',
    seedQueries: [
      'performance optimization',
      'caching strategy',
      'profiling',
      'core web vitals',
      'database performance tuning',
      'frontend performance',
    ],
  },
  {
    slug: 'deployment-cicd',
    name: 'Deployment & CI/CD',
    blurb: 'Pipelines, GitHub Actions, release management.',
    intro:
      'Skills for shipping — CI/CD pipelines, GitHub Actions, release management, feature flags, and rollback strategy.',
    icon: 'Rocket',
    tile: 'blue',
    seedQueries: [
      'ci cd pipeline',
      'github actions',
      'release management',
      'feature flags',
      'deployment strategy',
      'rollback strategy',
      'canary deployment',
    ],
  },
  {
    slug: 'observability',
    name: 'Observability',
    blurb: 'Logging, tracing, metrics, and incident response.',
    intro:
      'Skills for observability — structured logging, distributed tracing, metrics dashboards, alerting, and incident response runbooks.',
    icon: 'Activity',
    tile: 'yellow',
    seedQueries: [
      'observability',
      'structured logging',
      'distributed tracing',
      'incident response',
      'monitoring alerting',
      'on-call runbook',
    ],
  },
  {
    slug: 'accessibility',
    name: 'Accessibility',
    blurb: 'WCAG compliance, screen readers, and inclusive UI.',
    intro:
      'Skills for accessibility — WCAG compliance audits, screen-reader testing, keyboard navigation, and inclusive design patterns.',
    icon: 'Accessibility',
    tile: 'lavender',
    seedQueries: [
      'accessibility',
      'wcag compliance',
      'screen reader testing',
      'aria patterns',
      'keyboard navigation',
    ],
  },
  {
    slug: 'frontend-frameworks',
    name: 'Frontend Frameworks',
    blurb: 'React, Next.js, Vue, Angular, Svelte skills.',
    intro:
      'Framework-specific frontend skills — React hooks, Next.js App Router, Vue Composition API, Angular, Svelte, and state management.',
    icon: 'AppWindow',
    tile: 'green',
    seedQueries: [
      'react',
      'nextjs',
      'vue',
      'angular',
      'svelte',
      'react state management',
      'react hooks',
      'frontend testing',
    ],
  },
  {
    slug: 'backend-frameworks',
    name: 'Backend Frameworks',
    blurb: 'Django, FastAPI, Rails, Spring, Laravel, Go, Rust skills.',
    intro:
      'Framework-specific backend skills — Django, FastAPI, Ruby on Rails, Spring, Laravel, Go, and Rust service patterns.',
    icon: 'Container',
    tile: 'blue',
    seedQueries: [
      'django',
      'fastapi',
      'ruby on rails',
      'spring boot',
      'laravel',
      'go backend',
      'rust backend',
      'nodejs backend',
    ],
  },
  {
    slug: 'mobile',
    name: 'Mobile',
    blurb: 'iOS, Android, Flutter, React Native skills.',
    intro:
      'Skills for mobile development — Swift/iOS, Kotlin/Android, Flutter, and React Native patterns and testing.',
    icon: 'Smartphone',
    tile: 'yellow',
    seedQueries: [
      'swift ios',
      'kotlin android',
      'flutter',
      'react native',
      'mobile app testing',
      'ios testing',
    ],
  },
  {
    slug: 'devops-infra',
    name: 'DevOps & Infrastructure',
    blurb: 'Docker, Kubernetes, Terraform, cloud infra skills.',
    intro:
      'Skills for infrastructure — Docker, Kubernetes, Terraform, and provisioning on AWS, GCP, and Azure.',
    icon: 'Cloud',
    tile: 'lavender',
    seedQueries: [
      'docker',
      'kubernetes',
      'terraform',
      'aws infrastructure',
      'gcp infrastructure',
      'azure infrastructure',
      'serverless',
      'infrastructure as code',
    ],
  },
  {
    slug: 'ai-ml',
    name: 'AI & ML',
    blurb: 'LLM prompting, RAG, vector databases, agent workflows.',
    intro:
      'Skills for AI/ML work — LLM prompt engineering, RAG pipelines, vector databases, fine-tuning, and agent orchestration.',
    icon: 'BrainCircuit',
    tile: 'green',
    seedQueries: [
      'llm prompt engineering',
      'rag pipeline',
      'vector database',
      'fine tuning',
      'ai agent workflow',
      'langchain',
      'model context protocol',
    ],
  },
  {
    slug: 'data-engineering',
    name: 'Data Engineering',
    blurb: 'ETL, pipelines, Airflow, Spark, analytics skills.',
    intro:
      'Skills for data engineering — ETL pipelines, Airflow DAGs, Spark jobs, and data warehouse modeling.',
    icon: 'ChartScatter',
    tile: 'blue',
    seedQueries: [
      'etl pipeline',
      'apache airflow',
      'apache spark',
      'data warehouse',
      'data pipeline testing',
    ],
  },
  {
    slug: 'architecture',
    name: 'Architecture',
    blurb: 'System design, microservices, ADRs, scalability.',
    intro:
      'Skills for architecture — system design, microservices decomposition, architecture decision records, and scalability planning.',
    icon: 'Blocks',
    tile: 'yellow',
    seedQueries: [
      'system design',
      'microservices architecture',
      'architecture decision record',
      'monorepo architecture',
      'event driven architecture',
    ],
  },
  {
    slug: 'design-systems',
    name: 'Design Systems',
    blurb: 'Component libraries, tokens, theming, Figma-to-code.',
    intro:
      'Skills for design systems — component libraries, design tokens, theming, and turning Figma designs into code.',
    icon: 'Palette',
    tile: 'lavender',
    seedQueries: [
      'design system',
      'component library',
      'design tokens',
      'figma to code',
      'ui theming',
    ],
  },
  {
    slug: 'seo-marketing',
    name: 'SEO & Marketing',
    blurb: 'Technical SEO, analytics, growth, and content skills.',
    intro:
      'Skills for SEO and marketing — technical SEO audits, analytics instrumentation, A/B testing, and content workflows.',
    icon: 'TrendingUp',
    tile: 'green',
    seedQueries: [
      'seo audit',
      'technical seo',
      'ab testing',
      'analytics instrumentation',
      'marketing automation',
    ],
  },
  {
    slug: 'project-management',
    name: 'Project Management',
    blurb: 'Planning, estimation, onboarding, and team workflows.',
    intro:
      'Skills for project and team management — sprint planning, estimation, onboarding checklists, and standup/retro workflows.',
    icon: 'ClipboardCheck',
    tile: 'blue',
    seedQueries: [
      'sprint planning',
      'project estimation',
      'onboarding checklist',
      'retrospective facilitation',
      'agile workflow',
    ],
  },
  {
    slug: 'writing-docs',
    name: 'Writing & Documentation',
    blurb: 'READMEs, API docs, changelogs, technical writing.',
    intro:
      'Skills for technical writing — READMEs, API documentation, changelogs, ADRs, and release notes.',
    icon: 'BookOpen',
    tile: 'yellow',
    seedQueries: [
      'technical writing',
      'readme generator',
      'api documentation',
      'changelog generation',
      'release notes',
    ],
  },
  {
    slug: 'general',
    name: 'General & Other',
    blurb: 'Real skills outside the dev-tool categories above — legal, creative, business, and more.',
    intro:
      'Skills that are genuinely useful but don’t fit a dev-tool-specific bucket — legal and compliance, creative writing, finance, gaming, healthcare, and other domains the open skills.sh registry covers.',
    icon: 'Sparkles',
    tile: 'lavender',
    seedQueries: [
      'legal contract',
      'creative writing',
      'finance budgeting',
      'healthcare',
      'gaming',
      'customer service',
      'hr recruiting',
      'real estate',
    ],
  },
] as const

export const SKILL_CATEGORY_BY_SLUG: ReadonlyMap<SkillCategorySlug, SkillCategory> = new Map(
  SKILL_CATEGORIES.map((c) => [c.slug, c]),
)

export function getSkillCategory(slug: string): SkillCategory | undefined {
  return SKILL_CATEGORY_BY_SLUG.get(slug as SkillCategorySlug)
}
