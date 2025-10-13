//package com.projectmanager.service.keycloak;
//
//import com.projectmanager.config.KeycloakAdminConfig;
//import jakarta.ws.rs.core.Response;
//import org.keycloak.admin.client.Keycloak;
//import org.keycloak.admin.client.resource.UserResource;
//import org.keycloak.representations.idm.CredentialRepresentation;
//import org.keycloak.representations.idm.UserRepresentation;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//
//import java.util.Collections;
//import java.util.List;
//import java.util.UUID;
//
//@Service
//public class KeycloakUserService {
//    private final Keycloak keycloak;
//    private final KeycloakAdminConfig keycloakAdminConfig;
//
//    public KeycloakUserService(Keycloak keycloak, KeycloakAdminConfig keycloakAdminConfig) {
//        this.keycloak = keycloak;
//        this.keycloakAdminConfig = keycloakAdminConfig;
//    }
//
//    public UUID createKeycloakUser(String username, String email, String password, String role) {
//        UserRepresentation user = new UserRepresentation();
//        user.setUsername(username);
//        user.setEmail(email);
//        user.setEnabled(true);
//        user.setRealmRoles(Collections.singletonList(role));
//
//        // Set credentials
//        CredentialRepresentation credential = new CredentialRepresentation();
//        credential.setType(CredentialRepresentation.PASSWORD);
//        credential.setValue(password);
//        credential.setTemporary(false);
//        user.setCredentials(Collections.singletonList(credential));
//
//
//        Response resp = keycloak.realm(keycloakAdminConfig.keycloakTargetRealm())
//                .users()
//                .create(user);
//        try (resp) {
//            int status = resp.getStatus();
//            if (status == Response.Status.CREATED.getStatusCode()) {
//                String id = resp.getLocation().getPath();
//                String userId = id.substring(id.lastIndexOf('/') + 1);
//
//                // 3) Map realm role (optional)
//                if (role != null && !role.isBlank()) {
//                    var roles = keycloak.realm(keycloakAdminConfig.keycloakTargetRealm()).roles();
//                    var roleRep = roles.get(role).toRepresentation(); // throws 404 if role doesn't exist
//                    keycloak.realm(keycloakAdminConfig.keycloakTargetRealm())
//                            .users()
//                            .get(userId)
//                            .roles()
//                            .realmLevel()
//                            .add(Collections.singletonList(roleRep));
//                }
//
//                return UUID.fromString(userId);
//            }
//            if (status == Response.Status.CONFLICT.getStatusCode()) {
//                throw new IllegalStateException("User already exists: " + username);
//            }
//            throw new IllegalStateException("Failed to create user, HTTP " + status);
//        }
//    }
//
//    public void updateKeycloakUser(UUID keycloakId, String newUsername, String newEmail, String newRole) {
//        UserResource userResource = keycloak.realm(keycloakAdminConfig.keycloakTargetRealm()).users().get(keycloakId.toString());
//        UserRepresentation user = userResource.toRepresentation();
//
//        user.setUsername(newUsername);
//        user.setEmail(newEmail);
//        user.setRealmRoles(Collections.singletonList(newRole));
//
//        userResource.update(user);
//    }
//
//
//    public void deleteKeycloakUser(UUID keycloakId) {
//        keycloak.realm(keycloakAdminConfig.keycloakTargetRealm()).users().delete(keycloakId.toString());
//    }
//}
package com.projectmanager.service.keycloak;

import com.projectmanager.config.KeycloakAdminConfig;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class KeycloakUserService {
    private final Keycloak keycloak;
    private final KeycloakAdminConfig keycloakAdminConfig;

    public KeycloakUserService(Keycloak keycloak, KeycloakAdminConfig keycloakAdminConfig) {
        this.keycloak = keycloak;
        this.keycloakAdminConfig = keycloakAdminConfig;
    }
    public boolean userExistsByEmail(String email) {
        List<UserRepresentation> users = keycloak.realm(keycloakAdminConfig.keycloakTargetRealm())
                .users()
                .search(null, null, null, email, 0, 1);
        return !users.isEmpty();
    }

    public boolean userExistsByUsername(String username) {
        List<UserRepresentation> users = keycloak.realm(keycloakAdminConfig.keycloakTargetRealm())
                .users()
                .search(username, null, null, null, 0, 1);
        return !users.isEmpty();
    }

    public UUID inviteUser(String username, String email, String role) {
        if (userExistsByUsername(username)) {
            throw new IllegalStateException("User with username '" + username + "' already exists");
        }

        if (userExistsByEmail(email)) {
            throw new IllegalStateException("User with email '" + email + "' already exists");
        }

        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setEnabled(true);
        user.setRequiredActions(List.of("UPDATE_PASSWORD", "VERIFY_EMAIL"));

        Response resp = keycloak.realm(keycloakAdminConfig.keycloakTargetRealm())
                .users()
                .create(user);

        try (resp) {
            int status = resp.getStatus();
            if (status == Response.Status.CREATED.getStatusCode()) {
                String id = resp.getLocation().getPath();
                String userId = id.substring(id.lastIndexOf('/') + 1);

                // Assign role if provided
                if (role != null && !role.isBlank()) {
                    try {
                        var roles = keycloak.realm(keycloakAdminConfig.keycloakTargetRealm()).roles();
                        var roleRep = roles.get(role).toRepresentation();
                        keycloak.realm(keycloakAdminConfig.keycloakTargetRealm())
                                .users()
                                .get(userId)
                                .roles()
                                .realmLevel()
                                .add(Collections.singletonList(roleRep));
                    } catch (Exception e) {
                        // Log role assignment failure but don't fail user creation
                        System.err.println("Failed to assign role: " + e.getMessage());
                    }
                }

                // Send invitation email
                try {
                    keycloak.realm(keycloakAdminConfig.keycloakTargetRealm())
                            .users()
                            .get(userId)
                            .executeActionsEmail(List.of("UPDATE_PASSWORD", "VERIFY_EMAIL"));
                } catch (Exception e) {
                    // Log email failure but don't fail user creation
                    System.err.println("Failed to send invitation email: " + e.getMessage());
                }

                return UUID.fromString(userId);
            }

            if (status == Response.Status.CONFLICT.getStatusCode()) {
                String errorBody = resp.readEntity(String.class);
                throw new IllegalStateException("User already exists: " + username + ". Details: " + errorBody);
            }

            throw new IllegalStateException("Failed to create user, HTTP " + status);
        }
    }
    public void updateKeycloakUser(UUID keycloakId, String newUsername, String newEmail, String newRole) {
        UserResource userResource = keycloak.realm(keycloakAdminConfig.keycloakTargetRealm()).users().get(keycloakId.toString());
        UserRepresentation user = userResource.toRepresentation();

        user.setUsername(newUsername);
        user.setEmail(newEmail);

        userResource.update(user);

        if (newRole != null && !newRole.isBlank()) {
            var roles = keycloak.realm(keycloakAdminConfig.keycloakTargetRealm()).roles();
            var roleRep = roles.get(newRole).toRepresentation();
            userResource.roles().realmLevel().add(Collections.singletonList(roleRep));
        }
    }

    public void deleteKeycloakUser(UUID keycloakId) {
        keycloak.realm(keycloakAdminConfig.keycloakTargetRealm()).users().delete(keycloakId.toString());
    }
}
