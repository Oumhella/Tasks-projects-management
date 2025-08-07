import Keycloak from 'keycloak-js';

let keycloakInstance: any = null;

const createKeycloakInstance = () => {
    if (!keycloakInstance) {
        keycloakInstance = new (Keycloak as any)({
            url: 'http://localhost:8080',
            realm: 'project-manager',
            clientId: 'project-manager-client',
        });
    }
    return keycloakInstance;
};

const keycloak = createKeycloakInstance();

export default keycloak;