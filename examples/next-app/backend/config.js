require('dotenv').config({ path: __dirname + '/../.env.local' });

module.exports = {
  HOSTNAME: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || 3000,
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID || '',
  COGNITO_DOMAIN_NAME_URL: process.env.COGNITO_DOMAIN_NAME_URL || '',
  COGNITO_LOGIN_GRANT_TYPE: process.env.COGNITO_LOGIN_GRANT_TYPE || '',
  COGNITO_LOGIN_REDIRECT_URL: process.env.COGNITO_LOGIN_REDIRECT_URL || '',
  COGNITO_LOGIN_RESPONSE_TYPE: process.env.COGNITO_LOGIN_RESPONSE_TYPE || '',
  COGNITO_LOGIN_SCOPE: process.env.COGNITO_LOGIN_SCOPE || '',
  COGNITO_LOGOUT_REDIRECT_URL: process.env.COGNITO_LOGOUT_REDIRECT_URL || '',
  COOKIE_SESSION_NAME: process.env.COOKIE_SESSION_NAME || '',
  COOKIE_SESSION_SECRET: process.env.COOKIE_SESSION_SECRET || 'verysecuresecret',
};
