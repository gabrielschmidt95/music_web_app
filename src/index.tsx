import { StrictMode } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { createRoot } from "react-dom/client";

import './assets/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './app';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement as HTMLElement);

root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: `https://${process.env.REACT_APP_AUDIENCE}`,
      scope: 'read:current_user profile email openid'
    }}
  >
    <StrictMode>
      <App />
    </StrictMode >

  </Auth0Provider>,
);