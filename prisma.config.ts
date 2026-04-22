// Prisma v7 configuration file — used by the Prisma CLI only (not runtime).
// The runtime adapter is configured in src/prisma/prisma.service.ts.
import 'dotenv/config';
import { defineConfig } from '@prisma/config';

function buildDatasourceUrl(): string {
  const url = process.env['DATABASE_URL'] ?? 'file:./prisma/dev.db';
  const authToken = process.env['DATABASE_AUTH_TOKEN'];

  // The Prisma CLI requires the token as a query param; the runtime adapter
  if (authToken && url.startsWith('libsql://') && !url.includes('authToken')) {
    const parsed = new URL(url);
    parsed.searchParams.set('authToken', authToken);
    return parsed.toString();
  }

  return url;
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: buildDatasourceUrl(),
  },
});
