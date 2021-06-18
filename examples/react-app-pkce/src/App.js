import React, { useState, useEffect } from 'react';
import { Container, Button } from 'semantic-ui-react';
import { fetchIssuerConfiguration } from './utils/provider';
import { getAuthorizationUrl, getAccessToken } from './utils/openid';
import { verifyToken } from './utils/jwt';

import ObjectTable from './ObjectTable';

const TOKEN_SESSION = 'tokens';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        await fetchIssuerConfiguration();

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        // Oauth callback endpoint
        if (code) {
          const tokens = await getAccessToken({ code, state });
          const verifiedIdToken = await verifyToken(tokens.id_token);

          if (verifiedIdToken) {
            sessionStorage.setItem(TOKEN_SESSION, JSON.stringify(tokens));
            window.location.href = '/';
          }
        }
        // main entrypoint
        else {
          const saveTokens = JSON.parse(sessionStorage.getItem(TOKEN_SESSION));
          const verifiedIdToken = await verifyToken(saveTokens.id_token);
          if (verifiedIdToken) {
            return setCurrentUser(verifiedIdToken);
          } else {
            sessionStorage.removeItem(TOKEN_SESSION);
            handleLogin();
          }
        }
      } catch (err) {
        setError(err);
      }
    }

    fetchUser();
  }, []);

  const handleLogin = async () => {
    const authUrl = await getAuthorizationUrl();
    window.location.href = authUrl;
  };

  const handleLogout = async () => {
    sessionStorage.removeItem(TOKEN_SESSION);
    window.location.reload();
  };

  console.log(error);

  if (!currentUser) {
    return (
      <Container>
        <Button primary onClick={handleLogin}>
          Login
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h3>ID Token</h3>
      <ObjectTable obj={currentUser} />

      <Button primary onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
}

export default App;
