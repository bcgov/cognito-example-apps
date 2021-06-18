import axios from 'axios';

import aws_exports from '../aws-exports';

const { aws_cognito_region, aws_user_pools_id } = aws_exports;

const ISSUER_URL = `https://cognito-idp.${aws_cognito_region}.amazonaws.com/${aws_user_pools_id}/.well-known/openid-configuration`;

export const meta = {};

export const fetchIssuerConfiguration = async () => {
  const { authorization_endpoint, token_endpoint, jwks_uri, userinfo_endpoint } = await axios.get(ISSUER_URL).then(
    (res) => res.data,
    () => null
  );

  Object.assign(meta, { authorization_endpoint, token_endpoint, jwks_uri, userinfo_endpoint });
};
