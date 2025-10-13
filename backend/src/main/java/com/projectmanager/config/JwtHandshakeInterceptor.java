package com.projectmanager.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtDecoder jwtDecoder;

    public JwtHandshakeInterceptor(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) throws Exception {

        if (request instanceof ServletServerHttpRequest servletRequest) {
            String token = servletRequest.getServletRequest().getParameter("access_token");

            if (token == null) {
                String authHeader = servletRequest.getHeaders().getFirst("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    token = authHeader.substring(7);
                }
            }

            if (token != null) {
                try {
                    var jwt = jwtDecoder.decode(token);
                    // Store user information in WebSocket session attributes
                    attributes.put("username", jwt.getSubject());
                    attributes.put("jwt", jwt);
                    return true;
                } catch (JwtException e) {
                    System.err.println("Invalid JWT token: " + e.getMessage());
                    return false;
                }
            }
        }

        System.err.println("No valid JWT token found");
        return false;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
        // Nothing to do here
    }
}