require('dotenv').config({ path: __dirname + '/../.env.local' });

const config = {
  HOSTNAME: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || 3000,
  COGNITO_REGION: process.env.COGNITO_REGION || 'ca-central-1',
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || '',
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID || '',
  COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET || '',
  COGNITO_LOGIN_REDIRECT_URL: process.env.COGNITO_LOGIN_REDIRECT_URL || '',
  COGNITO_LOGIN_RESPONSE_TYPE: process.env.COGNITO_LOGIN_RESPONSE_TYPE || '',
  COOKIE_SESSION_NAME: process.env.COOKIE_SESSION_NAME || '',
  COOKIE_SESSION_SECRET: process.env.COOKIE_SESSION_SECRET || 'verysecuresecret',
};

config.COGNITO_USER_POOL_URL = `https://cognito-idp.${config.COGNITO_REGION}.amazonaws.com/${config.COGNITO_USER_POOL_ID}`;

module.exports = config;
