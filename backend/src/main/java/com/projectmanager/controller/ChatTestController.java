package com.projectmanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

/**
 * Test controller to verify chat setup is working
 * Remove this after confirming everything works
 */
@RestController
@RequestMapping("/api/v1/chat/test")
public class ChatTestController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        response.put("message", "Chat API is accessible");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth")
    public ResponseEntity<Map<String, Object>> testAuth(Principal principal) {
        Map<String, Object> response = new HashMap<>();
        if (principal != null) {
            response.put("authenticated", true);
            response.put("principalName", principal.getName());
            response.put("message", "Authentication working");
        } else {
            response.put("authenticated", false);
            response.put("message", "Not authenticated");
        }
        return ResponseEntity.ok(response);
    }
}


