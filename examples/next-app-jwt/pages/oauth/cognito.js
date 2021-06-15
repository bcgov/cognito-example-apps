import { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import store2 from 'store2';
import { getAccessToken } from '../../utils/cognito';
import { JWT_SECRET } from '../../utils/config';

const APP_TOKEN_EXPIRE = '1h';

export default function CognitoCallback({ appToken }) {
  store2('app-token', appToken);

  useEffect(() => {
    window.location = '/';
  }, []);

  return null;
}

export async function getServerSideProps({ req, res, query }) {
  try {
    const { code } = query;

    const tokens = await getAccessToken({ code });
    const { access_token } = tokens;
    const appToken = jwt.sign({ access_token }, JWT_SECRET, { expiresIn: APP_TOKEN_EXPIRE });

    return {
      props: { appToken },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {},
    };
  }
}
