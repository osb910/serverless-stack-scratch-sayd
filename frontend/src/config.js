const config = {
  SENTRY_DSN:
    'https://09693a633e1d46929fdeb4a73abf085a@o1376842.ingest.sentry.io/6686648',
  STRIPE_KEY:
    'pk_test_51LTzlTKBKIaskN21qoo598tFLSwz96qpHQegZHeFesYy3l9Cu94hnFW7IDjCoxUp5GTtjLcLr5UBBWBMTiALFAGM00BkXGrsOU',
  MAX_ATTACHMENT_SIZE: 5 * 1024 * 1024,
  // Backend config
  s3: {
    REGION: process.env.REACT_APP_REGION,
    BUCKET: process.env.REACT_APP_BUCKET,
  },
  apiGateway: {
    REGION: process.env.REACT_APP_REGION,
    URL: process.env.REACT_APP_API_URL,
  },
  cognito: {
    REGION: process.env.REACT_APP_REGION,
    USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
};

export default config;
