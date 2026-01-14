/**
 * CI/CD Configuration Tests
 * Story 0.4: Setup CI/CD Pipeline (GitHub Actions)
 *
 * Tests that verify the CI/CD pipeline configuration is correct
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

const PROJECT_ROOT = join(__dirname, '../../..');
const CI_WORKFLOW_PATH = join(PROJECT_ROOT, '.github/workflows/ci.yml');
const PACKAGE_JSON_PATH = join(PROJECT_ROOT, 'package.json');
const DOCS_CI_PATH = join(PROJECT_ROOT, 'docs/ci-cd.md');

interface WorkflowConfig {
  name: string;
  on: {
    push: { branches: string[] };
    pull_request: { branches: string[] };
  };
  env: Record<string, string>;
  jobs: Record<string, JobConfig>;
}

interface JobConfig {
  'runs-on': string;
  'timeout-minutes': number;
  name?: string;
  services: Record<string, ServiceConfig>;
  steps: StepConfig[];
}

interface ServiceConfig {
  image: string;
  env?: Record<string, string>;
  options?: string;
  ports?: string[];
}

interface StepConfig {
  name?: string;
  uses?: string;
  run?: string;
  with?: Record<string, unknown>;
  if?: string;
  env?: Record<string, string>;
}

interface PackageJson {
  scripts: Record<string, string>;
}

describe('CI/CD Configuration', () => {
  describe('GitHub Actions Workflow', () => {
    let workflowConfig: WorkflowConfig;

    beforeAll(() => {
      expect(existsSync(CI_WORKFLOW_PATH)).toBe(true);
      const workflowContent = readFileSync(CI_WORKFLOW_PATH, 'utf8');
      workflowConfig = yaml.load(workflowContent) as WorkflowConfig;
    });

    test('workflow file exists at .github/workflows/ci.yml', () => {
      expect(existsSync(CI_WORKFLOW_PATH)).toBe(true);
    });

    test('workflow name is "CI/CD Pipeline"', () => {
      expect(workflowConfig.name).toBe('CI/CD Pipeline');
    });

    test('workflow triggers on push to main and develop branches', () => {
      expect(workflowConfig.on.push.branches).toContain('main');
      expect(workflowConfig.on.push.branches).toContain('develop');
    });

    test('workflow triggers on pull requests to main and develop', () => {
      expect(workflowConfig.on.pull_request.branches).toContain('main');
      expect(workflowConfig.on.pull_request.branches).toContain('develop');
    });

    test('workflow has environment variables configured', () => {
      expect(workflowConfig.env).toBeDefined();
      expect(workflowConfig.env.NODE_VERSION).toBe('20');
      expect(workflowConfig.env.DATABASE_URL).toContain('postgresql://');
      expect(workflowConfig.env.REDIS_URL).toContain('redis://');
      expect(workflowConfig.env.NODE_ENV).toBe('test');
    });

    test('workflow job is named "quality-checks"', () => {
      expect(workflowConfig.jobs['quality-checks']).toBeDefined();
    });

    test('workflow runs on ubuntu-latest', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      expect(job!['runs-on']).toBe('ubuntu-latest');
    });

    test('workflow has timeout configured (10 minutes)', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      expect(job!['timeout-minutes']).toBe(10);
    });

    test('workflow includes PostgreSQL service', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      expect(job!.services.postgres).toBeDefined();
      expect(job!.services.postgres?.image).toBe('postgres:15-alpine');
      expect(job!.services.postgres?.env?.POSTGRES_USER).toBe('testuser');
      expect(job!.services.postgres?.env?.POSTGRES_DB).toBe('secondbrain_test');
      expect(job!.services.postgres?.ports).toContain('5432:5432');
    });

    test('workflow includes Redis service', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      expect(job!.services.redis).toBeDefined();
      expect(job!.services.redis?.image).toBe('redis:7-alpine');
      expect(job!.services.redis?.ports).toContain('6379:6379');
    });

    test('workflow includes checkout step with actions/checkout@v4', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      const steps = job!.steps;
      const checkoutStep = steps.find((s) => s.name?.includes('Checkout'));
      expect(checkoutStep).toBeDefined();
      expect(checkoutStep?.uses).toBe('actions/checkout@v4');
    });

    test('workflow includes Node.js setup with caching', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      const steps = job!.steps;
      const nodeStep = steps.find((s) => s.name?.includes('Node.js'));
      expect(nodeStep).toBeDefined();
      expect(nodeStep?.uses).toBe('actions/setup-node@v4');
      expect(nodeStep?.with?.cache).toBe('npm');
    });

    test('workflow includes npm ci install step', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      const steps = job!.steps;
      const installStep = steps.find((s) => s.name?.includes('Installation des dépendances'));
      expect(installStep).toBeDefined();
      expect(installStep?.run).toBe('npm ci');
    });

    test('workflow includes database verification step', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      const steps = job!.steps;
      const verifyStep = steps.find((s) => s.name?.includes('Vérification connexion base de données'));
      expect(verifyStep).toBeDefined();
      expect(verifyStep?.run).toContain('PostgreSQL');
      expect(verifyStep?.run).toContain('Redis');
    });

    test('workflow includes ESLint step', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      const steps = job!.steps;
      const lintStep = steps.find((s) => s.name?.includes('Exécution ESLint'));
      expect(lintStep).toBeDefined();
      expect(lintStep?.run).toBe('npm run lint');
      expect(lintStep?.if).toBe('always()');
    });

    test('workflow includes TypeScript type check step', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      const steps = job!.steps;
      const typecheckStep = steps.find((s) => s.name?.includes('Validation TypeScript'));
      expect(typecheckStep).toBeDefined();
      expect(typecheckStep?.run).toBe('npm run typecheck');
      expect(typecheckStep?.if).toBe('always()');
    });

    test('workflow includes test coverage step', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      const steps = job!.steps;
      const testStep = steps.find((s) => s.name?.includes('Tests unitaires et couverture'));
      expect(testStep).toBeDefined();
      expect(testStep?.run).toBe('npm run test:coverage');
      expect(testStep?.if).toBe('always()');
    });

    test('workflow includes coverage upload step', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      const steps = job!.steps;
      const uploadStep = steps.find((s) => s.name?.includes('Upload rapport couverture'));
      expect(uploadStep).toBeDefined();
      expect(uploadStep?.uses).toBe('actions/upload-artifact@v4');
      expect(uploadStep?.with?.path).toBe('coverage/');
      expect((uploadStep?.with as Record<string, number> | undefined)?.['retention-days']).toBe(30);
    });

    test('workflow includes Next.js build step', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      const steps = job!.steps;
      const buildStep = steps.find((s) => s.name?.includes('Build application Next.js'));
      expect(buildStep).toBeDefined();
      expect(buildStep?.run).toBe('npm run build');
      expect(buildStep?.if).toBe('always()');
    });

    test('workflow includes PR comment step', () => {
      const job = workflowConfig.jobs['quality-checks'];
      expect(job).toBeDefined();
      const steps = job!.steps;
      const commentStep = steps.find((s) => s.name?.includes('Ajout commentaire PR'));
      expect(commentStep).toBeDefined();
      expect(commentStep?.uses).toBe('actions/github-script@v7');
      expect(commentStep?.if).toContain('pull_request');
    });
  });

  describe('Package.json Scripts', () => {
    let packageJson: PackageJson;

    beforeAll(() => {
      expect(existsSync(PACKAGE_JSON_PATH)).toBe(true);
      const packageContent = readFileSync(PACKAGE_JSON_PATH, 'utf8');
      packageJson = JSON.parse(packageContent) as PackageJson;
    });

    test('package.json has lint script', () => {
      expect(packageJson.scripts.lint).toBeDefined();
      expect(packageJson.scripts.lint).toContain('eslint');
    });

    test('package.json has typecheck script', () => {
      expect(packageJson.scripts.typecheck).toBeDefined();
      expect(packageJson.scripts.typecheck).toBe('tsc --noEmit');
    });

    test('package.json has test:coverage script', () => {
      expect(packageJson.scripts['test:coverage']).toBeDefined();
      expect(packageJson.scripts['test:coverage']).toContain('jest');
      expect(packageJson.scripts['test:coverage']).toContain('--coverage');
    });

    test('package.json has format:check script', () => {
      expect(packageJson.scripts['format:check']).toBeDefined();
      expect(packageJson.scripts['format:check']).toContain('prettier');
      expect(packageJson.scripts['format:check']).toContain('--check');
    });

    test('package.json has lint:fix script', () => {
      expect(packageJson.scripts['lint:fix']).toBeDefined();
      expect(packageJson.scripts['lint:fix']).toContain('eslint');
      expect(packageJson.scripts['lint:fix']).toContain('--fix');
    });

    test('package.json has format script', () => {
      expect(packageJson.scripts.format).toBeDefined();
      expect(packageJson.scripts.format).toContain('prettier');
      expect(packageJson.scripts.format).toContain('--write');
    });
  });

  describe('CI/CD Documentation', () => {
    test('docs/ci-cd.md exists', () => {
      expect(existsSync(DOCS_CI_PATH)).toBe(true);
    });

    test('docs/ci-cd.md contains branch protection instructions', () => {
      const docsContent = readFileSync(DOCS_CI_PATH, 'utf8');
      expect(docsContent).toContain('Branch Protection Rules');
      expect(docsContent).toContain('quality-checks');
      expect(docsContent).toContain('Settings → Branches');
    });

    test('docs/ci-cd.md contains troubleshooting section', () => {
      const docsContent = readFileSync(DOCS_CI_PATH, 'utf8');
      expect(docsContent).toContain('Troubleshooting');
      expect(docsContent).toContain('database connection');
    });

    test('docs/ci-cd.md contains environment variables documentation', () => {
      const docsContent = readFileSync(DOCS_CI_PATH, 'utf8');
      expect(docsContent).toContain('Environment Variables');
      expect(docsContent).toContain('DATABASE_URL');
      expect(docsContent).toContain('REDIS_URL');
    });

    test('docs/ci-cd.md contains coverage report information', () => {
      const docsContent = readFileSync(DOCS_CI_PATH, 'utf8');
      expect(docsContent).toContain('Coverage Report');
      expect(docsContent).toContain('artifact');
      // Test for 30 days/jours (documentation in French)
      expect(docsContent.toLowerCase()).toMatch(/30\s*(days|jours)/);
    });
  });

  describe('README.md Updates', () => {
    let readmeContent: string;

    beforeAll(() => {
      const readmePath = join(PROJECT_ROOT, 'README.md');
      readmeContent = readFileSync(readmePath, 'utf8');
    });

    test('README.md contains CI/CD badge', () => {
      expect(readmeContent).toContain('CI/CD Pipeline');
      expect(readmeContent).toContain('actions/workflows/ci.yml/badge.svg');
    });

    test('README.md lists typecheck script', () => {
      expect(readmeContent).toContain('typecheck');
      expect(readmeContent).toContain('TypeScript type checking');
    });

    test('README.md lists format scripts', () => {
      expect(readmeContent).toContain('format');
      expect(readmeContent).toContain('Prettier');
    });
  });
});
