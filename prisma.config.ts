// Prisma v7 configuration file — used by the Prisma CLI only (not runtime).
// The runtime adapter is configured in src/prisma/prisma.service.ts.
import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Local dev:  DATABASE_URL="file:./prisma/dev.db"
    // Turso prod: DATABASE_URL="libsql://<db-name>.turso.io?authToken=<token>"
    url: process.env['DATABASE_URL'] ?? 'file:./prisma/dev.db',
  },
});
