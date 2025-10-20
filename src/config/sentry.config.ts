import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
