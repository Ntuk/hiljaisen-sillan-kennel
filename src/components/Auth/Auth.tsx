import './Auth.scss';
import React, { useEffect } from 'react';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { auth, googleAuthProvider, emailAuthProvider } from '../../firebase/firebase.ts';

const AuthPage: React.FC = () => {
  useEffect(() => {
    const uiConfig: firebaseui.auth.Config = {
      signInSuccessUrl: '/',
      signInOptions: [
        googleAuthProvider.providerId,
        emailAuthProvider.providerId
      ],
      tosUrl: '<your-tos-url>',
      privacyPolicyUrl: '<your-privacy-policy-url>',
    };

    const ui = new firebaseui.auth.AuthUI(auth);

    ui.start('#firebaseui-auth-container', uiConfig);

    return () => {
      ui.delete();
    };
  }, []);

  return (
    <div className={'auth-container'}>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default AuthPage;
