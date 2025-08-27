// keycloak.ts
import Keycloak from "keycloak-js";

// Create the Keycloak instance
// @ts-ignore
const keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "project-manager",
    clientId: "project-manager-frontend",
});

// Init options for ReactKeycloakProvider
const initOptions = {
    onLoad: "login-required",
    redirectUri: "http://localhost:3000",
};

export { keycloak, initOptions };
