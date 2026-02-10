package com.projectmanager.service.chat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmanager.dto.request.ChatMessageRequest;
import com.projectmanager.dto.request.ChatSessionRequest;
import com.projectmanager.dto.response.ChatMessageResponse;
import com.projectmanager.dto.response.ChatSessionResponse;
import com.projectmanager.entity.ChatMessage;
import com.projectmanager.entity.ChatSession;
import com.projectmanager.entity.User;
import com.projectmanager.repository.ChatMessageRepository;
import com.projectmanager.repository.ChatSessionRepository;
import com.projectmanager.repository.UserRepository;
import com.projectmanager.service.user.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    
    @Value("${gemini.api-key}")
    private String geminiApiKey;

    // Using gemini-pro as it's the most stable and widely available model
    // Alternative models if this doesn't work: gemini-1.5-flash, gemini-1.5-pro
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";
    private final ObjectMapper objectMapper;

    public ChatService(ChatSessionRepository chatSessionRepository,
                      ChatMessageRepository chatMessageRepository,
                      UserService userService,
                      UserRepository userRepository) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.objectMapper = new ObjectMapper();
    }

    @Transactional
    public ChatSessionResponse createSession(String keycloakId, ChatSessionRequest request) {
        try {
            User user = getUserByKeycloakId(keycloakId);
            String sessionName = request.getSessionName() != null && !request.getSessionName().isEmpty() 
                ? request.getSessionName() 
                : "Chat " + LocalDateTime.now().toString();
            
            ChatSession session = new ChatSession(user, sessionName);
            ChatSession savedSession = chatSessionRepository.save(session);
            
            return toSessionResponse(savedSession);
        } catch (Exception e) {
            System.err.println("Error creating chat session: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create chat session: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<ChatSessionResponse> getUserSessions(String keycloakId) {
        try {
            User user = getUserByKeycloakId(keycloakId);
            List<ChatSession> sessions = chatSessionRepository.findByUser_IdWithUser(user.getId());
            return sessions.stream()
                    .map(this::toSessionResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getting user sessions: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to get user sessions: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public ChatSessionResponse getSession(String keycloakId, UUID sessionId) {
        User user = getUserByKeycloakId(keycloakId);
        Optional<ChatSession> session = chatSessionRepository.findByIdWithMessages(sessionId);
        
        if (session.isEmpty() || !session.get().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Session not found or access denied");
        }
        
        return toSessionResponse(session.get());
    }

    @Transactional
    public ChatMessageResponse sendMessage(String keycloakId, ChatMessageRequest request) throws IOException, InterruptedException {
        User user = getUserByKeycloakId(keycloakId);
        UUID sessionId = request.getSessionId();
        
        // Get or create session
        ChatSession session;
        if (sessionId != null) {
            Optional<ChatSession> existingSession = chatSessionRepository.findByIdAndUser_Id(sessionId, user.getId());
            if (existingSession.isEmpty()) {
                throw new RuntimeException("Session not found");
            }
            session = existingSession.get();
        } else {
            // Create new session if none provided
            session = new ChatSession(user, "Chat " + LocalDateTime.now().toString());
            chatSessionRepository.save(session);
        }

        // Save user message
        ChatMessage userMessage = new ChatMessage(session, request.getMessage(), ChatMessage.MessageRole.USER);
        chatMessageRepository.save(userMessage);
        session.getMessages().add(userMessage);

        // Load conversation history for context (Simple Memory)
        List<ChatMessage> history = chatMessageRepository.findMessagesBySessionId(session.getId());
        
        List<Map<String, Object>> chatHistory = new ArrayList<>();
        for (ChatMessage msg : history) {
            String role = msg.getRole() == ChatMessage.MessageRole.USER ? "user" : "model";
            chatHistory.add(Map.of(
                "role", role,
                "parts", List.of(Map.of("text", msg.getContent()))
            ));
        }

        // Add system context for project management
        String systemContext = "You are a helpful AI assistant for a Project Management System. " +
                "You help users manage their projects, tasks, and collaborate with team members. " +
                "Be friendly, professional, and provide actionable advice.";

        // Prepare API request
        Map<String, Object> payload = new HashMap<>();
        payload.put("contents", chatHistory);
        payload.put("systemInstruction", Map.of(
            "parts", List.of(Map.of("text", systemContext))
        ));

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(GEMINI_API_URL + geminiApiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient()
                .send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Gemini API error: " + response.statusCode() + " - " + response.body());
        }

        // Parse response
        JsonNode rootNode = objectMapper.readTree(response.body());
        String assistantMessage = rootNode.get("candidates").get(0)
                .get("content").get("parts").get(0).get("text").asText();

        // Save assistant response
        ChatMessage assistantMsg = new ChatMessage(session, assistantMessage, ChatMessage.MessageRole.ASSISTANT);
        chatMessageRepository.save(assistantMsg);
        session.getMessages().add(assistantMsg);
        
        // Update session timestamp
        session.onUpdate();
        chatSessionRepository.save(session);

        return toMessageResponse(assistantMsg, session.getId());
    }

    @Transactional
    public void deleteSession(String keycloakId, UUID sessionId) {
        User user = getUserByKeycloakId(keycloakId);
        Optional<ChatSession> session = chatSessionRepository.findByIdAndUser_Id(sessionId, user.getId());
        if (session.isPresent()) {
            chatSessionRepository.delete(session.get());
        } else {
            throw new RuntimeException("Session not found");
        }
    }

    private ChatSessionResponse toSessionResponse(ChatSession session) {
        try {
            List<ChatMessageResponse> messages = session.getMessages() != null 
                ? session.getMessages().stream()
                    .map(msg -> toMessageResponse(msg, session.getId()))
                    .collect(Collectors.toList())
                : new ArrayList<>();
            
            UUID userId = session.getUser() != null ? session.getUser().getId() : null;
            
            return new ChatSessionResponse(
                    session.getId(),
                    session.getSessionName(),
                    userId,
                    messages,
                    session.getCreatedAt(),
                    session.getUpdatedAt()
            );
        } catch (Exception e) {
            System.err.println("Error converting session to response: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to convert session to response: " + e.getMessage(), e);
        }
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message, UUID sessionId) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setId(message.getId());
        response.setContent(message.getContent());
        response.setRole(message.getRole() != null ? message.getRole().name() : null);
        response.setCreatedAt(message.getCreatedAt());
        response.setSessionId(sessionId);
        return response;
    }

    private User getUserByKeycloakId(String keycloakId) {
        try {
            UUID keycloakUuid = UUID.fromString(keycloakId);
            Optional<User> userOpt = userService.findByKey(keycloakUuid);
            
            if (userOpt.isPresent()) {
                return userOpt.get();
            }
            
            // Auto-create user if not exists (for chat functionality)
            // This allows users to use chat even if they haven't been explicitly created in the system
            System.out.println("Auto-creating user for Keycloak ID: " + keycloakUuid);
            User newUser = new User();
            newUser.setKeycloakId(keycloakUuid);
            newUser.setUsername("user_" + keycloakUuid.toString().substring(0, 8));
            newUser.setEmail("user@" + keycloakUuid.toString().substring(0, 8) + ".local");
            newUser.setRole("user");
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setUpdatedAt(LocalDateTime.now());
            
            User savedUser = userRepository.save(newUser);
            userRepository.flush(); // Ensure user is persisted before using in relationship
            System.out.println("User created successfully with ID: " + savedUser.getId());
            return savedUser;
        } catch (Exception e) {
            System.err.println("Error getting/creating user: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to get or create user: " + e.getMessage(), e);
        }
    }
}

