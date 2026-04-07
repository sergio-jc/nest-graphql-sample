import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const disabled =
  process.env.OTEL_SDK_DISABLED === 'true' || process.env.NODE_ENV === 'test';

if (!disabled) {
  const tracesUrl =
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ??
    'http://localhost:4318/v1/traces';
  console.log('🚀 ~ tracesUrl:', tracesUrl);

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]:
        process.env.OTEL_SERVICE_NAME ?? 'nest-graphql-sample',
    }),
    traceExporter: new OTLPTraceExporter({ url: tracesUrl }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });

  sdk.start();

  const shutdown = () => sdk.shutdown().catch(() => undefined);

  process.once('SIGTERM', shutdown as () => void);
  process.once('SIGINT', shutdown as () => void);
}
