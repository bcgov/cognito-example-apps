import axios from 'axios';

import aws_exports from '../aws-exports';

import { meta } from './provider';

import { parseJWTPayload, parseJWTHeader } from './helpers';

const { aws_user_pools_web_client_id } = aws_exports;

export const verifyToken = async (token) => {
  const url = `${meta.jwks_uri}`;

  const data = await axios.get(url).then((res) => res.data, console.error);
  const keys = data?.keys;

  const tokenHeader = parseJWTHeader(token);

  // search for the kid key id in the Cognito Keys
  const key = keys.find((key) => key.kid === tokenHeader.kid);
  if (key === undefined) {
    console.error('public key not found in Cognito jwks.json');
    return false;
  }

  // verify JWT Signature
  const keyObj = window.KEYUTIL.getKey(key);
  const isValid = window.KJUR.jws.JWS.verifyJWT(token, keyObj, { alg: ['RS256'] });
  if (!isValid) {
    console.error('signature verification failed');
    return false;
  }

  // verify token has not expired
  const tokenPayload = parseJWTPayload(token);
  if (Date.now() >= tokenPayload.exp * 1000) {
    console.error('token expired');
    return false;
  }

  // verify app_client_id
  const n = tokenPayload.aud.localeCompare(aws_user_pools_web_client_id);
  if (n !== 0) {
    console.error('token was not issued for this audience');
    return false;
  }

  return tokenPayload;
};
