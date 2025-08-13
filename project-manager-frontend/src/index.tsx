// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { ReactKeycloakProvider } from '@react-keycloak/web';
// import keycloak from './config/Keycloak';
// import App from './App';
//
// const root = ReactDOM.createRoot(
//     document.getElementById('root') as HTMLElement
// );
//
// // Keycloak initialization options
// const initOptions = {
//     onLoad: 'check-sso' as const,
//     silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
//     pkceMethod: 'S256' as const,
// };
//
// root.render(
//     // Removed React.StrictMode temporarily for testing
//     <ReactKeycloakProvider
//         authClient={keycloak}
//         initOptions={initOptions}
//         LoadingComponent={<div>Loading authentication...</div>}
//         onEvent={(event, error) => {
//             console.log('Keycloak event:', event, error);
//         }}
//         onTokens={(tokens) => {
//             console.log('Keycloak tokens:', tokens);
//         }}
//     >
//         <App />
//     </ReactKeycloakProvider>
// );
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css'; // if you have this file

import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak, { keycloakInitOptions } from './config/Keycloak';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <React.StrictMode>
        {/*<ReactKeycloakProvider authClient={keycloak} initOptions={keycloakInitOptions}>*/}
            <App />
        {/*</ReactKeycloakProvider>*/}
    </React.StrictMode>
);
