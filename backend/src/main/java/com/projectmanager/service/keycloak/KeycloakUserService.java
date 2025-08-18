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
    private final String targetRealm;  // Changed from 'realm' to 'targetRealm'

    public KeycloakUserService(Keycloak keycloak, String targetRealm) {
        this.keycloak = keycloak;
        this.targetRealm = targetRealm;
    }

    public UUID createKeycloakUser(String username, String email, String password, String role) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setEnabled(true);
        user.setRealmRoles(Collections.singletonList(role));

        // Set credentials
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));

        // Create user in target realm
        try (Response response = keycloak.realm("master").users().create(user)) {
            if (response.getStatus() == Response.Status.CREATED.getStatusCode()) {
                String location = response.getLocation().getPath();
                String userId = location.substring(location.lastIndexOf('/') + 1);
                return UUID.fromString(userId);
            } else {
                throw new RuntimeException("Failed to create user: " + response.getStatus());
            }
        }
    }

    public void updateKeycloakUser(UUID keycloakId, String newUsername, String newEmail, String newRole) {
        UserResource userResource = keycloak.realm(targetRealm).users().get(keycloakId.toString());
        UserRepresentation user = userResource.toRepresentation();

        user.setUsername(newUsername);
        user.setEmail(newEmail);
        user.setRealmRoles(Collections.singletonList(newRole));

        userResource.update(user);
    }


    public void deleteKeycloakUser(UUID keycloakId) {
        keycloak.realm(targetRealm).users().delete(keycloakId.toString());
    }
}