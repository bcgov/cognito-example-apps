const axios = require('axios');
const jwt = require('jsonwebtoken');
const jws = require('jws');
const jwkToPem = require('jwk-to-pem');

const { COGNITO_USER_POOL_URL, COGNITO_REGION, COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID } = require('./config');

const JWK_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

const isExpired = (exp) => {
  return Date.now() >= exp * 1000;
};

const getJWK = async () => {
  const jwk = await axios.get(JWK_URL).then(
    (res) => res.data,
    () => null
  );

  return jwk;
};

// see https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html#amazon-cognito-user-pools-using-tokens-step-2
const validateJWTSignature = async (token) => {
  // 1. Decode the ID token.
  const { header, payload, signature } = jws.decode(token);

  // 2. Compare the local key ID (kid) to the public kid.
  const jwk = await getJWK();
  const key = jwk.keys.find((key) => key.kid === header.kid);
  const isValidKid = !!key;

  if (!isValidKid) {
    return null;
  }

  // 3. Verify the signature using the public key to
  const pem = jwkToPem(key);
  const verified = jwt.verify(token, pem);

  return verified;
};

// see https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html#amazon-cognito-user-pools-using-tokens-step-3
const verifyIdTokenClaims = async (token) => {
  const payload = jwt.decode(token);

  // 1. Verify that the token is not expired.
  if (isExpired(payload.exp)) {
    console.error('claim exp', payload.exp);
    return false;
  }

  // 2. The audience (aud) claim should match the app client ID that was created in the Amazon Cognito user pool.
  if (payload.aud !== COGNITO_CLIENT_ID) {
    console.error('claim aud', payload.aud);
    return false;
  }

  // 3. The issuer (iss) claim should match your user pool.
  if (payload.iss !== COGNITO_USER_POOL_URL) {
    console.error('claim iss', payload.iss);
    return false;
  }

  // 4. Check the token_use claim.
  if (payload.token_use !== 'id') {
    console.error('claim token_use', payload.token_use);
    return false;
  }

  return true;
};

module.exports = { validateJWTSignature, verifyIdTokenClaims };
