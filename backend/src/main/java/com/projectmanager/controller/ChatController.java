package com.projectmanager.controller;

import com.projectmanager.dto.request.ChatMessageRequest;
import com.projectmanager.dto.request.ChatSessionRequest;
import com.projectmanager.dto.response.ChatMessageResponse;
import com.projectmanager.dto.response.ChatSessionResponse;
import com.projectmanager.service.chat.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/v1/chat", produces = "application/json")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/sessions")
    public ResponseEntity<ChatSessionResponse> createSession(
            @RequestBody ChatSessionRequest request,
            Principal principal) {
        try {
            ChatSessionResponse session = chatService.createSession(principal.getName(), request);
            return new ResponseEntity<>(session, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSessionResponse>> getUserSessions(Principal principal) {
        try {
            List<ChatSessionResponse> sessions = chatService.getUserSessions(principal.getName());
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<ChatSessionResponse> getSession(
            @PathVariable UUID id,
            Principal principal) {
        ChatSessionResponse session = chatService.getSession(principal.getName(), id);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/messages")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @RequestBody ChatMessageRequest request,
            Principal principal) {
        try {
            ChatMessageResponse response = chatService.sendMessage(principal.getName(), request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable UUID id,
            Principal principal) {
        chatService.deleteSession(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }
}

