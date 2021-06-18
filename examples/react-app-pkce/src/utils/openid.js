import axios from 'axios';
import qs from 'qs';

import aws_exports from '../aws-exports';

import { meta } from './provider';

import { getRandomString, encryptStringWithSHA256, hashToBase64url } from './helpers';

const {
  aws_user_pools_web_client_id,
  oauth: { scope, redirectSignIn, responseType },
} = aws_exports;

export const getAuthorizationUrl = async () => {
  // Create random "state"
  const state = getRandomString();
  sessionStorage.setItem('pkce_state', state);

  // Create PKCE code verifier
  const code_verifier = getRandomString();
  sessionStorage.setItem('code_verifier', code_verifier);

  // Create code challenge
  const arrayHash = await encryptStringWithSHA256(code_verifier);
  const code_challenge = hashToBase64url(arrayHash);
  sessionStorage.setItem('code_challenge', code_challenge);

  const params = {
    client_id: aws_user_pools_web_client_id,
    response_type: responseType,
    redirect_uri: redirectSignIn,
    scope,
    // PKCE workflow
    state,
    code_challenge_method: 'S256',
    code_challenge,
  };

  return `${meta.authorization_endpoint}?${qs.stringify(params, { encode: false })}`;
};

export const getAccessToken = async ({ code, state }) => {
  // PKCE workflow
  if (sessionStorage.getItem('pkce_state') !== state) {
    console.error('invalid state');
    return null;
  }

  const code_verifier = sessionStorage.getItem('code_verifier');

  const params = {
    grant_type: 'authorization_code',
    client_id: aws_user_pools_web_client_id,
    redirect_uri: redirectSignIn,
    code,
    // PKCE workflow
    code_verifier,
  };

  const url = `${meta.token_endpoint}`;

  const config = {
    url,
    method: 'post',
    data: qs.stringify(params),
  };

  return axios(config).then((res) => res.data, console.error);
};
