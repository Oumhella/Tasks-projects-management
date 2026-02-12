
import Keycloak from "keycloak-js";

// @ts-ignore
const keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "project-manager",
    clientId: "project-manager-frontend",
});

const initOptions = {
    onLoad: "check-sso",
    silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
    checkLoginIframe: false,
};



export { keycloak, initOptions };
