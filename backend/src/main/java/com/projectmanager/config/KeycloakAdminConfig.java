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

    @Value("${keycloak.realm}")
    private String targetRealm;

    @Value("${keycloak.client_id}")
    private String clientId;
    @Value("${keycloak.username}")
    private String username;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    @Value("${keycloak.password}")
    private String password;


    @Bean
    public Keycloak keycloakAdminClient() {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(targetRealm)               // authenticate TO the target realm
                .clientId(clientId)               // project-manager-client
                .clientSecret(clientSecret)       // set client secret (use builder method below)
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                .build();
    }
//        return KeycloakBuilder.builder()
//                .serverUrl("http://localhost:8080/") // Your Keycloak URL
//                .realm("master") // If you're using master admin, otherwise use your realm
//                .clientId("admin-cli") // Built-in Keycloak client
//                .username("admin") // Keycloak admin username
//                .password("admin") // Keycloak admin password
//                .grantType(OAuth2Constants.PASSWORD)
//                .build();
//    }

    @Bean
    public String keycloakTargetRealm() {
        return targetRealm;
    }
}