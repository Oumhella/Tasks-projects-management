// import Keycloak from 'keycloak-js';
//
// // let keycloakInstance: any = null;
// //
// // const createKeycloakInstance = () => {
// //     if (!keycloakInstance) {
// //         keycloakInstance = new (Keycloak as any)({
// //             url: 'http://localhost:8080',
// //             realm: 'project-manager',
// //             clientId: 'project-manager-client',
// //         });
// //     }
// //     return keycloakInstance;
// // };
// const keycloak = new Keycloak({
//     url: 'http://localhost:8080',
//     realm: 'project-manager',
//     clientId: 'project-manager-client',
// });
// // const keycloak = createKeycloakInstance();
//
// export const keycloakInitOptions = {
//     // This is the URI Keycloak will redirect to after a successful login.
//     // It must match one of the 'Valid Redirect URIs' in the Keycloak client settings.
//     // For your setup, it should be the URL of your React app.
//     redirectUri: 'http://localhost:3000',
//
//     // Use 'login-required' to trigger the login flow immediately.
//     // Use 'check-sso' to check for an existing session without forcing a login.
//     onLoad: 'login-required'
// };
//
//
// export default keycloak;
// src/keycloak.ts

// src/config/keycloak.ts
// src/config/keycloak.ts
// src/config/keycloak.ts
// src/config/keycloak.ts
import Keycloak from 'keycloak-js';

// Define our own type for the config
interface MyKeycloakConfig {
    url: string;
    realm: string;
    clientId: string;
}

// Keycloak configuration
const keycloakConfig: MyKeycloakConfig = {
    url: 'http://localhost:8080',
    realm: 'project-manager',
    clientId: 'project_manager_client',
};

// Create ONE instance for the entire app
// @ts-ignore
const keycloak = new Keycloak(keycloakConfig as any);

export const keycloakInitOptions = {
    onLoad: 'login-required',
    redirectUri: 'http://localhost:3000',
};

export default keycloak;
