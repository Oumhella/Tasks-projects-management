package com.projectmanager.service.keycloak;

import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class KeycloakUserService {

    private final Keycloak keycloak;
    private final String realm;

    public KeycloakUserService(Keycloak keycloak, String realm) {
        this.keycloak = keycloak;
        this.realm = realm;
    }

    /**
     * Creates a new user in Keycloak and returns their Keycloak-generated UUID.
     */
    public UUID createKeycloakUser(String username, String email, String password, String role) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setEnabled(true);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setTemporary(false);
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        user.setCredentials(List.of(credential));
        user.setRealmRoles(List.of(role));

        try (Response response = keycloak.realm(realm).users().create(user)) {
            if (response.getStatus() == HttpStatus.CREATED.value()) {
                String locationHeader = response.getHeaderString("Location");
                String keycloakIdString = locationHeader.substring(locationHeader.lastIndexOf('/') + 1);
                return UUID.fromString(keycloakIdString);
            } else {
                throw new RuntimeException("Failed to create Keycloak user: " + response.getStatus());
            }
        }
    }


    public void updateKeycloakUser(UUID keycloakId, String newUsername, String newEmail, String newRole) {
        UserResource userResource = keycloak.realm(realm).users().get(keycloakId.toString());
        UserRepresentation user = userResource.toRepresentation();

        user.setUsername(newUsername);
        user.setEmail(newEmail);
        user.setRealmRoles(Collections.singletonList(newRole));

        userResource.update(user);
    }


    public void deleteKeycloakUser(UUID keycloakId) {
        keycloak.realm(realm).users().delete(keycloakId.toString());
    }
}