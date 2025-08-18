package com.projectmanager.config;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakAdminConfig {

    @Value("${keycloak.auth-server-url}")
    private String serverUrl;

    @Value("${keycloak.target-realm}")  // Use project-manager for operations
    private String targetRealm;

    @Value("${keycloak.client-id}")
    private String clientId;

//    @Value("${keycloak.client-secret}")
//    private String clientSecret;

    @Value("${keycloak.username}")
    private String username;

    @Value("${keycloak.password}")
    private String password;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    @Bean
    public Keycloak keycloakAdminClient() {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(targetRealm)
                .clientId(clientId)
                .clientSecret(clientSecret)  // Add this
                .username(username)
                .password(password)
                .grantType(OAuth2Constants.PASSWORD)
                .build();
    }

    @Bean
    public String keycloakTargetRealm() {
        return targetRealm;  // project-manager
    }
}