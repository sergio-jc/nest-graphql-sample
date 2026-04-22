# Mock Shop API

A production-ready REST + GraphQL API that simulates an e-commerce backend. Built as a reference project to demonstrate modern Node.js architecture patterns: dual-transport APIs, N+1 prevention with DataLoader, distributed tracing with OpenTelemetry, and edge-compatible databases.

**Live demo:** [mock-shop-api.onrender.com](https://mock-shop-api.onrender.com)
&nbsp;·&nbsp; GraphQL playground: `/graphql`
&nbsp;·&nbsp; REST + Swagger docs: `/api-docs`
&nbsp;·&nbsp; Health check: `/health`

>[!Note]
> This demo is hosted on an infrastructure tier that can sleep after prolonged inactivity. If the service is idle, the first request(s) may take a few minutes to wake the server up (cold start) before responses return normally.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [NestJS 11](https://nestjs.com/) |
| GraphQL | [Apollo Server 5](https://www.apollographql.com/) — code-first via decorators |
| ORM | [Prisma 7](https://www.prisma.io/) with LibSQL driver adapter |
| Database (dev) | SQLite via `@libsql/client` (local file) |
| Database (prod) | [Turso](https://turso.tech/) — edge-hosted distributed SQLite |
| REST docs | [Swagger / OpenAPI](https://swagger.io/) via `@nestjs/swagger` |
| Observability | [OpenTelemetry](https://opentelemetry.io/) — traces + logs exported via OTLP |
| Env validation | [Zod](https://zod.dev/) — schema validated at startup |
| Security | Helmet, rate limiting, timing-safe key comparison |
| Runtime | Node.js ≥ 22 · [pnpm](https://pnpm.io/) |

---

## Architecture - Dual-transport API

Every resource (`products`, `categories`, `users`, `reviews`, `orders`) is exposed through two independent transports that share the same service layer:

- **GraphQL** at `/graphql` — code-first schema generated from TypeScript decorators. Supports field-level resolution, nested queries, and real-time exploration via GraphiQL.
- **REST** at `/v1/...` — URI-versioned controllers with full Swagger documentation at `/api-docs`.


## Security

- **Helmet** with a strict Content Security Policy applied globally.
- **GraphQL depth limiting** — queries deeper than 6 levels are rejected, preventing resource exhaustion via deeply nested queries.
- **Rate limiting** — a global `GqlThrottlerGuard` enforces 60 requests/minute per IP across both GraphQL and REST endpoints.
- **Timing-safe API key bypass** — requests with a valid `X-API-Key` header skip the rate limiter. The comparison uses `crypto.timingSafeEqual` to prevent timing attacks.
- **Environment validation at startup** — a Zod schema validates all required env vars before the app bootstraps. Missing or malformed vars crash the process immediately with a clear error instead of failing silently at runtime.

## Getting Started

### Prerequisites

- Node.js ≥ 22
- pnpm (`npm install -g pnpm`)

### Local setup

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env
# DATABASE_URL defaults to file:./prisma/dev.db — no changes needed for local dev

# 3. Run migrations and start the dev server
pnpm prisma migrate dev
pnpm start:dev
```

The API will be available at `http://localhost:3000`.

### Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | `file:./prisma/dev.db` | SQLite file path (dev) or `libsql://` URL (prod) |
| `DATABASE_AUTH_TOKEN` | Prod only | — | Turso authentication token |
| `PORT` | No | `3000` | HTTP port |
| `NODE_ENV` | No | `development` | `development` / `production` / `test` |
| `INTERNAL_API_KEY` | No | — | Sent in `X-API-Key` header to bypass rate limiting |
| `OTEL_SERVICE_NAME` | No | `mock-shop-api` | Service name in trace spans |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | No | `http://localhost:4318/v1/traces` | OTLP traces endpoint |
| `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT` | No | `http://localhost:4318/v1/logs` | OTLP logs endpoint |
| `OTEL_SDK_DISABLED` | No | `false` | Set to `true` to disable tracing |

>[!Note]
> OpenTelemetry settings are currently configured for internal testing and observability experiments. The API works correctly without OTEL, so telemetry is optional and not required for normal development or production runtime.


## API Overview

### GraphQL — `/graphql`

GraphiQL playground and schema documentation are available at `/graphql`.

- **Code-First Schema Design:** The GraphQL schema is generated directly from TypeScript decorators in the application code. This keeps resolver logic and schema definitions in sync, reduces duplication, and makes refactoring safer as the API evolves.

- **DataLoader-Based N+1 Prevention:** Request-scoped DataLoaders batch and cache relation fetches during each GraphQL request, avoiding one-query-per-item resolver behavior and significantly reducing database round trips on nested queries.

- **Query Depth Protection (Max 6):** Incoming GraphQL operations are validated with a maximum depth of 6 levels. Deeply nested queries are rejected early to protect compute and database resources from abusive or overly expensive requests.


### REST - `/v1/...`
Full Swagger documentation available at `/api-docs`. 

- **Comprehensive API Exploration:** Instantly review available REST endpoints, request/response schemas, and error formats via a modern, interactive Swagger UI—no manual inspection needed.
The API implements robust contract management and scalability features:

- **Versioned Endpoints:** All REST endpoints are URI-versioned (e.g., `/v1/products`), enabling safe evolution of the API contract over time. This approach allows consumers to adopt new features or breaking changes at their own pace, minimizing integration risk and supporting long-term backward compatibility.

- **Global Throttling (Rate Limiting):** Both GraphQL and REST transports enforce request throttling at the gateway layer using a high-performance, distributed GqlThrottlerGuard. This mitigates abuse, enhances security, and ensures fair resource allocation across clients—critical for production reliability. Internal tools and trusted integrations can bypass these safeguards with a scoped API key for seamless automation.

Together, these best practices ensure a stable, evolvable, and well-governed API surface for all consumers.

## Deployment

The API is deployed on [Render](https://render.com/) with [Turso](https://turso.tech/) as the production database.

>[!Note]
> Prisma 7's migration engine does not support `libsql://` URLs. Because of this, `prisma migrate deploy` is **not** part of the production start script. The recommended workflow ([per Prisma v7 docs](https://www.prisma.io/docs/orm/overview/databases/turso)) is using: `turso db shell <your-db-name> < prisma/migrations/<timestamp>_<name>/migration.sql` to run manually the migrations on Turso.