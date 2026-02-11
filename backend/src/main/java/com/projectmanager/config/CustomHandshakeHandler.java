package com.projectmanager.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(
            ServerHttpRequest request,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        // The provided code snippet seems to be intended for a different context (e.g., a WebSocket controller)
        // as it references 'principal', 'keycloakId', and 'headerAccessor' which are not available here.
        // It also contains logging for 'ChatWebSocketController'.
        //
        // The original instruction was to "Add logging to `handleChatMessage`", but this class does not have that method.
        //
        // Assuming the intent was to add more detailed logging within this `determineUser` method
        // and that the provided snippet was a misunderstanding of the context,
        // I will keep the existing, correct logic for `determineUser` and ensure it's syntactically valid.
        //
        // If the intention was to replace the existing logic with the provided snippet,
        // it would result in compilation errors due to undefined variables.
        //
        // Therefore, I will proceed by keeping the original, correct implementation of determineUser
        // as the provided snippet cannot be directly applied here without significant modification
        // and context from the user.

        String username = (String) attributes.get("username");
        System.out.println("CustomHandshakeHandler: Determining user for session. Username attribute: " + username);
        if (username != null) {
            return new StompPrincipal(username);
        }
        System.out.println("CustomHandshakeHandler: No username found in attributes");
        return null;
    }
}
