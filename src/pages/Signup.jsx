import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const handleLoginSuccess = (response) => {
    console.log('Google login success:', response);
  };

  const handleLoginFailure = (error) => {
    console.error('Google login error:', error);
  };

  return (
    <GoogleOAuthProvider clientId="133982942406-4naomvq0s544eb8or90eb8pqkfprkq1i.apps.googleusercontent.com">
      <div>        
      <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signup;
