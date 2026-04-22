# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm start:dev          # Start with file watching
pnpm build              # Generate Prisma client + compile TypeScript

# Testing
pnpm test               # Run all unit tests
pnpm test:watch         # Unit tests in watch mode
pnpm test:cov           # Coverage report
pnpm test:e2e           # End-to-end tests
pnpm test:debug         # Debug tests with Node inspector

# To run a single test file:
pnpm test -- --testPathPattern=products.service

# Code quality
pnpm lint               # ESLint with auto-fix
pnpm format             # Prettier on src/ and test/

# Observability (requires Docker)
pnpm jaeger:up          # Start Jaeger tracing services
pnpm jaeger:down        # Stop Docker Compose services
```

## Environment Setup

Copy `.env.example` to `.env`. The app validates env vars at startup using Zod and crashes with a clear error if required variables are missing.

Required: `DATABASE_URL` (defaults to `file:./prisma/dev.db` for local SQLite)  
Optional: `PORT`, `NODE_ENV`, `INTERNAL_API_KEY`, OpenTelemetry vars (`OTEL_*`)

Set `OTEL_SDK_DISABLED=true` to disable tracing during local development/testing.

## Architecture

**Stack**: NestJS + Apollo GraphQL (code-first) + Prisma + SQLite/LibSQL (Turso-compatible)

**GraphQL approach**: Code-first — TypeScript decorators generate `src/schema.gql`. Never edit `schema.gql` directly.

### Module Pattern

Every feature module (`products`, `categories`, `users`, `reviews`, `orders`) follows the same structure:
- `*.module.ts` — wires everything together, exports the service
- `*.service.ts` — business logic, injected with `PrismaService`
- `*.resolver.ts` — GraphQL queries and field resolvers, injected with both the service and `DataloaderService`
- `*.controller.ts` — REST endpoints (versioned: `/v1/...`)
- `entities/` — GraphQL `@ObjectType()` classes, also decorated with `@ApiProperty()` for Swagger

`PrismaModule` is global (`Global: true`), so `PrismaService` is available anywhere without importing the module.

### DataLoader Pattern

`DataloaderModule` is request-scoped. A fresh `DataloaderService` instance is created per GraphQL request, which creates batched loaders for every relation (e.g., `categoryById`, `reviewsByProductId`, `ratingByProductId`). This prevents N+1 queries.

Resolvers access loaders via the GraphQL context (`@Context() ctx`), not via direct service injection. The context interface is defined in `src/dataloader/gql-context.interface.ts`.

### Rate Limiting

`GqlThrottlerGuard` (`src/gql-throttler.guard.ts`) is applied globally. It works for both GraphQL and REST. To bypass throttling (e.g., for internal test apps), send the `X-API-Key` header matching the `INTERNAL_API_KEY` env var.

### API Versioning

REST endpoints use NestJS URI versioning. Controllers declare `@Controller({ version: '1', path: 'products' })`, resulting in paths like `/v1/products`.

### Observability

OpenTelemetry is initialized in `src/tracing.ts` and imported before the app bootstrap in `main.ts`. Traces and logs are exported to Jaeger. Disable with `OTEL_SDK_DISABLED=true`.

### Security

- Helmet middleware with CSP headers
- GraphQL query depth limited to 6
- Timing-safe comparison for API key validation
