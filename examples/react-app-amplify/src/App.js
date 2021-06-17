import React, { useState, useEffect } from 'react';
import Amplify from 'aws-amplify';
import { withOAuth } from 'aws-amplify-react';
import aws_exports from './aws-exports';

Amplify.configure(aws_exports);

function App({ OAuthSignIn }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await Amplify.Auth.currentAuthenticatedUser();
        setCurrentUser(user);
      } catch (err) {
        setError(err);
      }
    }

    fetchUser();
  }, []);

  return (
    <div>
      {currentUser ? (
        <>
          <h3>Hello, {currentUser.username}</h3>
          <button onClick={() => Amplify.Auth.signOut()}>Sign Out</button>
        </>
      ) : (
        <button onClick={OAuthSignIn}>Sign in</button>
      )}
    </div>
  );
}

export default withOAuth(App);
