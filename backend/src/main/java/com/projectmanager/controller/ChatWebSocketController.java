package com.projectmanager.controller;

import com.projectmanager.dto.request.ChatMessageRequest;
import com.projectmanager.dto.response.ChatMessageResponse;
import com.projectmanager.service.chat.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatWebSocketController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/message")
    public void handleChatMessage(
            @Payload ChatMessageRequest request,
            Principal principal,
            SimpMessageHeaderAccessor headerAccessor) {

        String keycloakId = null;

        // Try to get user ID from Principal first
        // Try to get user ID from Principal first
        if (principal != null) {
            keycloakId = principal.getName();
            System.out.println("ChatWebSocketController: Resolved user from Principal: " + keycloakId);
        } else if (headerAccessor != null && headerAccessor.getSessionAttributes() != null) {
            // Fallback to session attributes (set by JwtHandshakeInterceptor)
            keycloakId = (String) headerAccessor.getSessionAttributes().get("username");
            System.out.println("ChatWebSocketController: Resolved user from Session Attributes: " + keycloakId);
        } else {
            System.out.println("ChatWebSocketController: Could not resolve user!");
        }

        // If still no user ID, return error
        if (keycloakId == null || keycloakId.isEmpty()) {
            ChatMessageResponse errorResponse = new ChatMessageResponse();
            errorResponse.setContent("Authentication error: User not identified");
            errorResponse.setRole("ASSISTANT");

            // Try to send error - if we can't identify user, log it
            if (headerAccessor != null && headerAccessor.getSessionId() != null) {
                messagingTemplate.convertAndSend("/queue/chat/messages", errorResponse);
            }
            System.err.println("WebSocket message received but user not authenticated");
            return;
        }

        try {
            // Process the message and get AI response
            ChatMessageResponse response = chatService.sendMessage(keycloakId, request);

            // Send response back to the user's private queue
            messagingTemplate.convertAndSendToUser(
                    keycloakId,
                    "/queue/chat/messages",
                    response);
        } catch (Exception e) {
            System.err.println("Error processing chat message: " + e.getMessage());
            e.printStackTrace();

            // Send error message to user
            ChatMessageResponse errorResponse = new ChatMessageResponse();
            errorResponse.setContent("Sorry, I encountered an error: " + e.getMessage());
            errorResponse.setRole("ASSISTANT");

            messagingTemplate.convertAndSendToUser(
                    keycloakId,
                    "/queue/chat/messages",
                    errorResponse);
        }
    }
}
