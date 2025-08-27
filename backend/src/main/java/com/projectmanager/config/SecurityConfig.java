package com.projectmanager.config;

//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.oauth2.jwt.JwtDecoder;
//import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
//import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
//import org.springframework.security.web.SecurityFilterChain;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Value("${keycloak.auth-server-url}")
//    private String keycloakServerUrl;
//
//    @Value("${keycloak.target-realm}")
//    private String realm;
//
//    @Bean
//    public JwtDecoder jwtDecoder() {
//        // Based on your JWT token, the issuer is http://localhost:8080/realms/project-manager
//        // So the JWK URI should be:
//        String jwkSetUri = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/certs";
//
//        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
//    }
//
//    @Bean
//    public JwtAuthenticationConverter jwtAuthenticationConverter() {
//        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
//
//        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
//            Collection<GrantedAuthority> authorities = new ArrayList<>();
//
//            // Extract realm roles from your JWT structure
//            Map<String, Object> realmAccess = jwt.getClaim("realm_access");
//            if (realmAccess != null) {
//                @SuppressWarnings("unchecked")
//                List<String> roles = (List<String>) realmAccess.get("roles");
//                if (roles != null) {
//                    authorities.addAll(roles.stream()
//                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
//                            .collect(Collectors.toList()));
//                }
//            }
//
//            // Extract resource access roles (like realm-management, account)
//            Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
//            if (resourceAccess != null) {
//                resourceAccess.forEach((clientId, clientRoles) -> {
//                    if (clientRoles instanceof Map) {
//                        @SuppressWarnings("unchecked")
//                        Map<String, Object> clientRoleMap = (Map<String, Object>) clientRoles;
//                        @SuppressWarnings("unchecked")
//                        List<String> roles = (List<String>) clientRoleMap.get("roles");
//                        if (roles != null) {
//                            authorities.addAll(roles.stream()
//                                    .map(role -> new SimpleGrantedAuthority("CLIENT_" + clientId.toUpperCase().replace("-", "_") + "_" + role.toUpperCase().replace("-", "_")))
//                                    .collect(Collectors.toList()));
//                        }
//                    }
//                });
//            }
//
//            return authorities;
//        });
//
//        return converter;
//    }
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .cors(Customizer.withDefaults())
//                .csrf(csrf -> csrf.disable())
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .oauth2ResourceServer(oauth2 -> oauth2
//                        .jwt(jwt -> jwt
//                                .decoder(jwtDecoder())
//                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
//                        )
//                )
//                .authorizeHttpRequests(authz -> authz
//                        .requestMatchers("/actuator/health", "/health").permitAll()
//                        .requestMatchers("/api/public/**").permitAll()
//                        .anyRequest().authenticated()
//                );
//
//        return http.build();
//    }
//}
//

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.oauth2.jwt.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                                .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                );

        return http.build();
    }


    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            List<String> roles = ((Map<String, Object>) jwt.getClaim("realm_access"))
                    .get("roles") instanceof List<?> l ? (List<String>) l : List.of();
            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());
        });
        return converter;
    }



    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

//    @Bean
//    public JwtDecoder jwtDecoder() {
//        NimbusJwtDecoder jwtDecoder = JwtDecoders.fromIssuerLocation(
//                "http://localhost:8080/realms/project-manager"
//        );
//
//        OAuth2TokenValidator<Jwt> withAudience = new JwtClaimValidator<List<String>>(
//                "aud",
//                aud -> aud.contains("project_manager_client")
//        );
//
//        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(
//                "http://localhost:8080/realms/project-manager"
//        );
//
//        OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(withIssuer, withAudience);
//        jwtDecoder.setJwtValidator(validator);
//
//        return jwtDecoder;
//    }
}
