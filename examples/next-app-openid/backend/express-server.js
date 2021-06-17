const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const _ = require('lodash');
const { Issuer } = require('openid-client');

const {
  COGNITO_USER_POOL_URL,
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET,
  COGNITO_LOGIN_REDIRECT_URL,
  COGNITO_LOGIN_RESPONSE_TYPE,
  COOKIE_SESSION_NAME,
  COOKIE_SESSION_SECRET,
} = require('./config');

const { validateJWTSignature, verifyIdTokenClaims } = require('./jwt');

const THIRTY_DAYS = 30 * 24 * (60 * 60 * 1000);

const logger = morgan('combined');

const initExpresss = async () => {
  const expressServer = express();

  expressServer.use(logger);
  expressServer.use(bodyParser.json());
  expressServer.use(bodyParser.urlencoded({ extended: false }));
  expressServer.use(cookieParser());

  const store = new MemoryStore({
    checkPeriod: THIRTY_DAYS,
  });

  expressServer.use(
    session({
      name: COOKIE_SESSION_NAME,
      secret: COOKIE_SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: THIRTY_DAYS,
        httpOnly: true,
        secure: false,
      },
      store,
    })
  );

  const issuer = await Issuer.discover(COGNITO_USER_POOL_URL);

  // see https://github.com/panva/node-openid-client/blob/main/docs/README.md#new-clientmetadata-jwks
  const client = new issuer.Client({
    client_id: COGNITO_CLIENT_ID,
    client_secret: COGNITO_CLIENT_SECRET,
    redirect_uris: [COGNITO_LOGIN_REDIRECT_URL],
    // see https://medium.com/@darutk/diagrams-of-all-the-openid-connect-flows-6968e3990660
    // one of "code", "id_token", "code id_token", "id_token token", "code token", "code id_token token", "none"
    response_types: [COGNITO_LOGIN_RESPONSE_TYPE],
    // see https://github.com/panva/node-openid-client/blob/master/docs/README.md#client-authentication-methods
    // one of "client_secret_basic", "client_secret_post", "client_secret_jwt", "private_key_jwt", "tls_client_auth", "self_signed_tls_client_auth", "none"
    token_endpoint_auth_method: COGNITO_CLIENT_SECRET ? 'client_secret_basic' : 'none',
  });

  expressServer.get('/oauth/cognito/login', async (req, res) => {
    try {
      if (req.session.user) {
        res.redirect(`/`);
      } else {
        const authUrl = await client.authorizationUrl({
          redirect_uri: client.redirect_uris[0],
          scope: 'openid email',
        });
        res.redirect(authUrl);
      }
    } catch (err) {
      console.error(err);
      res.json({ success: false, error: err.message || err });
    }
  });

  expressServer.get('/oauth/cognito', async (req, res) => {
    try {
      const tokenset = await client.callback(client.redirect_uris[0], req.query);
      req.session.tokens = tokenset;

      req.session.verified_tokens = {
        id_token: await validateJWTSignature(tokenset.id_token),
        access_token: await validateJWTSignature(tokenset.access_token),
      };

      req.session.claim_validity = {
        id_token: await verifyIdTokenClaims(tokenset.id_token),
      };

      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.json({ success: false, error: err.message || err });
    }
  });

  expressServer.get('/oauth/cognito/logout', (req, res) => {
    try {
      if (req.session.tokens) {
        req.session.tokens = undefined;
      }

      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.json({ success: false, error: err.message || err });
    }
  });

  expressServer.disable('x-powered-by');

  expressServer.set('trust proxy', 1);

  return expressServer;
};

module.exports = initExpresss;
