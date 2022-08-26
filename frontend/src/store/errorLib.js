import * as Sentry from '@sentry/react';
import {BrowserTracing} from '@sentry/tracing';

import config from '../config';

const isLocal = process.env.NODE_ENV === 'development';

export const initSentry = () => {
  if (isLocal) return;

  Sentry.init({
    dsn: config.SENTRY_DSN,
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
};

export const logError = (error, errorInfo = null) => {
  if (isLocal) return;

  Sentry.withScope(scope => {
    errorInfo && scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
};

export const onError = err => {
  let errorInfo = {};
  let message = err.toString();

  // Auth errors
  if (!(err instanceof Error) && err.message) {
    errorInfo = err;
    message = err.message;
    err = new Error(message);
    // API errors
  } else if (err.config && err.config.url) {
    errorInfo.url = err.config.url;
  }

  logError(err, errorInfo);

  alert(message);
};
