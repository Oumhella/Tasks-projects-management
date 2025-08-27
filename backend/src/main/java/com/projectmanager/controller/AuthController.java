//package com.projectmanager.controller;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.client.HttpClientErrorException;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/v1/auth")
//@CrossOrigin(origins = "http://localhost:3000")
//public class AuthController {
//
//    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
//
//    @Value("${keycloak.client-id}")
//    private String clientId;
//
//    @Value("${keycloak.client-secret}")
//    private String clientSecret;
//
//    @Value("${keycloak.token-uri}")
//    private String tokenUri;
//
//    @GetMapping("/debug")
//    public ResponseEntity<?> debugConfig() {
//        return ResponseEntity.ok(Map.of(
//                "clientId", clientId,
//                "tokenUri", tokenUri,
//                "hasClientSecret", clientSecret != null && !clientSecret.isEmpty()
//        ));
//    }
//
//    @PostMapping("/token")
//    public ResponseEntity<?> exchangeCode(@RequestParam Map<String, String> params) {
//        String code = params.get("code");
//        logger.info("Starting token exchange for code: {}", code.substring(0, Math.min(code.length(), 10)) + "...");
//        logger.info("Using clientId: {}", clientId);
//        logger.info("Using tokenUri: {}", tokenUri);
//        logger.info("Client secret present: {}", clientSecret != null && !clientSecret.isEmpty());
//
//        RestTemplate restTemplate = new RestTemplate();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//
//        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
//        body.add("grant_type", "authorization_code");
//        body.add("code", code);
//        body.add("redirect_uri", "http://localhost:3000/callback");
//        body.add("client_id", clientId);
//        body.add("client_secret", clientSecret);
//
//        logger.info("Request body: grant_type=authorization_code, code={}, redirect_uri=http://localhost:3000/callback, client_id={}, client_secret={}",
//                code.substring(0, Math.min(code.length(), 10)) + "...",
//                clientId,
//                clientSecret != null ? "***" : "null");
//
//        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
//
//        try {
//            logger.info("Making request to: {}", tokenUri);
//            ResponseEntity<String> response = restTemplate.postForEntity(tokenUri, request, String.class);
//            logger.info("Token exchange successful: {}", response.getStatusCode());
//            return ResponseEntity.ok(response.getBody());
//        } catch (HttpClientErrorException ex) {
//            logger.error("Token exchange failed with status: {} and body: {}",
//                    ex.getStatusCode(), ex.getResponseBodyAsString());
//            return ResponseEntity.status(ex.getStatusCode())
//                    .body(Map.of(
//                            "error", "Token exchange failed",
//                            "status", ex.getStatusCode().value(),
//                            "details", ex.getResponseBodyAsString(),
//                            "clientId", clientId,
//                            "tokenUri", tokenUri
//                    ));
//        } catch (Exception ex) {
//            logger.error("Unexpected error during token exchange", ex);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", "Internal server error", "message", ex.getMessage()));
//        }
//    }
//    @GetMapping("/test-keycloak")
//    public ResponseEntity<?> testKeycloakConnection() {
//        try {
//            logger.info("Testing connection to: {}", tokenUri);
//            RestTemplate restTemplate = new RestTemplate();
//            ResponseEntity<String> response = restTemplate.getForEntity(tokenUri.replace("/token", ""), String.class);
//            return ResponseEntity.ok(Map.of(
//                    "status", "SUCCESS",
//                    "keycloakUrl", tokenUri,
//                    "responseCode", response.getStatusCodeValue()
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of(
//                            "status", "FAILED",
//                            "keycloakUrl", tokenUri,
//                            "error", e.getMessage()
//                    ));
//        }
//    }
//    @PostMapping("/refresh")
//    public ResponseEntity<?> refreshToken(@RequestParam("refresh_token") String refreshToken) {
//        logger.info("Starting token refresh");
//
//        RestTemplate restTemplate = new RestTemplate();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//
//        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
//        body.add("grant_type", "refresh_token");
//        body.add("refresh_token", refreshToken);
//        body.add("client_id", clientId);
//        body.add("client_secret", clientSecret);
//
//        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
//
//        try {
//            logger.info("Making refresh request to: {}", tokenUri);
//            ResponseEntity<String> response = restTemplate.postForEntity(tokenUri, request, String.class);
//            logger.info("Token refresh successful: {}", response.getStatusCode());
//            return ResponseEntity.ok(response.getBody());
//        } catch (HttpClientErrorException ex) {
//            logger.error("Token refresh failed with status: {} and body: {}",
//                    ex.getStatusCode(), ex.getResponseBodyAsString());
//            return ResponseEntity.status(ex.getStatusCode())
//                    .body(Map.of(
//                            "error", "Token refresh failed",
//                            "status", ex.getStatusCode().value(),
//                            "details", ex.getResponseBodyAsString()
//                    ));
//        } catch (Exception ex) {
//            logger.error("Unexpected error during token refresh", ex);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", "Internal server error", "message", ex.getMessage()));
//        }
//    }
//}