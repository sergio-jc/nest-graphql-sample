import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),

  // Database — required. Use "file:./prisma/dev.db" for local SQLite.
  DATABASE_URL: z.string().min(1),
  // Only required when connecting to Turso in production.
  DATABASE_AUTH_TOKEN: z.string().optional(),

  // Optional API key for bypassing throttling in internal test apps.
  INTERNAL_API_KEY: z.string().optional(),

  // OpenTelemetry — all optional
  OTEL_SERVICE_NAME: z.string().optional(),
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: z.string().url().optional(),
  OTEL_EXPORTER_OTLP_LOGS_ENDPOINT: z.string().url().optional(),
  OTEL_SDK_DISABLED: z.coerce.boolean().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const messages = result.error.issues
      .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Config validation error:\n${messages}`);
  }
  return result.data;
}
