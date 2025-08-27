package com.projectmanager.service.project;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.projectmanager.dto.response.TaskResponse;
import com.projectmanager.entity.Task;
import com.projectmanager.service.task.TaskService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.HashMap;

@Service
public class ProjectAnalysisService {

    private final TaskService taskService;
    @Value("${gemini.api-key}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=";

    private final ObjectMapper objectMapper;

    public ProjectAnalysisService(TaskService taskService) {
        this.taskService = taskService;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    public List<Map<String, Object>> analyzeProjectForNetworkMap(UUID projectId) throws IOException, InterruptedException {
        try {
            List<TaskResponse> tasks = taskService.getTasksByProjectId(projectId);

            String prompt = "You are an expert Project Management AI. Your primary task is to first infer dependencies " +
                    "between the following project tasks based on their title, description, and type. " +
                    "A task can depend on another if it's a logical next step (e.g., 'Develop Login' depends on 'Design Login'). " +
                    "After you have identified the logical dependencies, perform an analysis to identify tasks " +
                    "that are on the critical path or are at risk of delay. " +
                    "A task is at risk if its due date is close, it's part of the critical path, or it's a foundational task " +
                    "that many other tasks depend on. " +
                    "For each task, provide the following: " +
                    "1. The 'dependencies' array, containing the IDs of tasks you have inferred it depends on. " +
                    "2. A 'riskScore' (0-100). " +
                    "3. A boolean 'isCriticalPath'. " +
                    "4. A brief 'aiInsightSummary' of your findings. " +
                    "Return your response as a JSON array of task objects. Do not include any other text or formatting.\n\n" +
                    "Project Tasks:\n" + objectMapper.writeValueAsString(tasks);

            Map<String, Object> properties = new HashMap<>();
            properties.put("id", Map.of("type", "STRING"));
            properties.put("title", Map.of("type", "STRING"));
            properties.put("description", Map.of("type", "STRING"));
            properties.put("priority", Map.of("type", "STRING"));
            properties.put("type", Map.of("type", "STRING"));
            properties.put("status", Map.of("type", "STRING"));
            properties.put("estimatedHours", Map.of("type", "NUMBER"));
            properties.put("dueDate", Map.of("type", "STRING"));
            properties.put("projectId", Map.of("type", "STRING"));
            properties.put("assignedToUserId", Map.of("type", "STRING"));
            properties.put("dependencies", Map.of(
                    "type", "ARRAY",
                    "items", Map.of("type", "STRING")
            ));
            properties.put("isAtRisk", Map.of("type", "BOOLEAN"));
            properties.put("riskScore", Map.of("type", "NUMBER"));
            properties.put("isCriticalPath", Map.of("type", "BOOLEAN"));
            properties.put("aiInsightSummary", Map.of("type", "STRING")); // Fixed typo here

            Map<String, Object> responseSchema = new HashMap<>();
            responseSchema.put("type", "ARRAY");
            responseSchema.put("items", Map.of(
                    "type", "OBJECT",
                    "properties", properties
            ));

            // Step 4: Build the API request payload and send it.
            Map<String, Object> payload = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", prompt)))
                    ),
                    "generationConfig", Map.of(
                            "responseMimeType", "application/json",
                            "responseSchema", responseSchema
                    )
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GEMINI_API_URL + geminiApiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Gemini API returned status: " + response.statusCode() +
                        " Body: " + response.body());
            }

            // Step 5: Parse the AI's response and return the result.
            JsonNode rootNode = objectMapper.readTree(response.body());
            String jsonResult = rootNode.get("candidates").get(0).get("content").get("parts").get(0).get("text").asText();

            return objectMapper.readValue(jsonResult, List.class);

        } catch (IOException | InterruptedException e) {
            System.err.println("Error in analyzeProjectForNetworkMap: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to analyze project: " + e.getMessage(), e);
        }
    }
}