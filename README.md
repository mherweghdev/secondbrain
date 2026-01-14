# SecondBrain

![CI/CD Pipeline](https://github.com/mherweghdev/secondbrain/actions/workflows/ci.yml/badge.svg)

**Your personal knowledge capture and refinement system — from fleeting thoughts to structured insights.**

SecondBrain is a web application designed to help you capture notes effortlessly throughout the week, then refine them every Friday into organized, actionable knowledge. Built with Next.js, TypeScript, and modern tooling.

## Features (Planned)

- 📝 **Quick Note Capture**: Markdown-based editor for rapid note-taking
- 🤖 **AI-Powered Suggestions**: Automatic keyword extraction, connections, and metadata
- 🔍 **Connection-Aware Search**: Find notes by content, tags, and relationships
- 📅 **Friday Refinement Workflow**: Dedicated mode for weekly note organization
- 📊 **Weekly Digest**: Automated summaries of your knowledge growth

## Tech Stack

- **Framework**: Next.js 16.x with App Router
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 4.x
- **Build Tool**: Turbopack (stable)
- **Database**: PostgreSQL + Prisma (planned)
- **Authentication**: Supabase Auth (planned)
- **AI Integration**: Claude API (planned)

## Architecture & Decisions

All major architectural decisions are documented as Architecture Decision Records (ADRs) in [docs/decisions/](docs/decisions/). These documents explain the rationale behind key technology choices, including database strategy, authentication, deployment approach, and more.

Key ADRs:
- [ADR-001: Starter Template Selection](docs/decisions/adr-001-starter-template.md)
- [ADR-002: Database Strategy (Supabase PostgreSQL)](docs/decisions/adr-002-database-supabase-postgresql.md)
- [ADR-003: ORM Selection (Prisma)](docs/decisions/adr-003-orm-prisma.md)
- [ADR-004: Authentication Strategy (Supabase Auth)](docs/decisions/adr-004-authentication-supabase-auth.md)

See [docs/decisions/README.md](docs/decisions/README.md) for the complete ADR index.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun
- **Docker Desktop 20.x or higher** (for database testing)

### Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/secondbrain.git
cd secondbrain
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Services (Optional for Integration Tests)

Start PostgreSQL and Redis for local testing:
```bash
npm run docker:up
```

Stop services:
```bash
npm run docker:down
```

For more Docker commands and troubleshooting, see [docs/docker.md](docs/docker.md).

### Available Scripts

#### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

#### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run typecheck` - TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

#### Testing
- `npm test` - Run unit tests
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:coverage` - Run unit tests with coverage report
- `npm run test:integration` - Run integration tests (requires Docker)

#### Docker Services
- `npm run docker:up` - Start PostgreSQL + Redis containers
- `npm run docker:down` - Stop containers
- `npm run test:db:check` - Verify database connection

## Project Structure

```
secondbrain/
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   ├── components/       # React components (planned)
│   ├── lib/             # Utility functions (planned)
│   └── types/           # TypeScript types (planned)
├── public/              # Static assets
├── docs/                # Project documentation
└── _bmad-output/        # BMAD workflow artifacts
```

## Development Status

🚧 **In Active Development**

This project is currently in the infrastructure setup phase (Epic 0). See the [sprint status](/_bmad-output/implementation-artifacts/sprint-status.yaml) for current progress.

## License

MIT

## Contributing

This is a personal project, but feedback and suggestions are welcome via GitHub issues.
