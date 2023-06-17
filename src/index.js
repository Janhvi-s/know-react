import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import { authConfig } from './auth0-config';

ReactDOM.render(
  <Auth0Provider
    domain={authConfig.domain}
    clientId={authConfig.clientId}
    redirectUri={window.location.origin}
    audience={authConfig.audience}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
