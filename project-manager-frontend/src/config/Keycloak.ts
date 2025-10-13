
import Keycloak from "keycloak-js";

// @ts-ignore
const keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "project-manager",
    clientId: "project-manager-frontend",
});

const initOptions = {
    onLoad: "login-required",
    redirectUri: "http://localhost:3000/",
    checkLoginIframe: false,
    // Add theme configuration if using custom theme
    // theme: "auraflow"
};



export { keycloak, initOptions };
