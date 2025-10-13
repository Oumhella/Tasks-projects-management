package com.projectmanager.controller;



import com.projectmanager.dto.request.ProjectRequest;
import com.projectmanager.dto.request.UserRequest;
import com.projectmanager.dto.response.ProjectResponse;
import com.projectmanager.dto.response.UserResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.User;
import com.projectmanager.mapper.ProjectMapper;
import com.projectmanager.repository.ProjectRepository;
import com.projectmanager.repository.UserRepository;
import com.projectmanager.service.project.ProjectAnalysisService;
import com.projectmanager.service.project.ProjectService;
import com.projectmanager.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService ;
    private final ProjectMapper projectMapper;
    private final ProjectAnalysisService projectAnalysisService;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProjectController(ProjectService projectService, UserService userService, ProjectMapper projectMapper, ProjectAnalysisService projectAnalysisService, ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectService = projectService;
        this.userService = userService;
        this.projectMapper = projectMapper;
        this.projectAnalysisService = projectAnalysisService;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(Principal principal) {
        UUID keycloakId = UUID.fromString(principal.getName());
        Optional<User> user = userRepository.findByKeycloakId(keycloakId);
        if (user.isPresent()) {
            List<Project> projects = projectService.findProjectsByUserId(user.get().getId());
            return ResponseEntity.ok(projects);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable UUID id) {
        Optional<Project> projectOptional = projectService.findProjectById(id);

        if (projectOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ProjectResponse responseDto = projectMapper.toResponse(projectOptional.get());
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/debug")
    public String debugRoles(Authentication auth) {
        return auth.getAuthorities().toString();
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectRequest request, Principal principal) {
        // The principal object contains information about the authenticated user
        String userId = principal.getName();

        ProjectResponse createdProject = projectService.createProject(request, userId);
        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/add")
    public ResponseEntity<ProjectResponse> addProjectMember(@PathVariable UUID id, @RequestBody UserRequest request) {
        projectService.addProjectMember(id,request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable UUID id, @RequestBody ProjectRequest request) {
        ProjectResponse updatedProject = projectService.updateProject(id, request);
        return ResponseEntity.ok(updatedProject);
    }


    @GetMapping("/{id}/members")
    public ResponseEntity<Set<UserResponse>> getMembers(@PathVariable UUID id) {
    Set<UserResponse> members = userService.getProjectMembers(id);
    return ResponseEntity.ok(members);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PostMapping("/analyze/{id}")
    public ResponseEntity<?> analyzeProject(@PathVariable UUID id) {
        Optional<Project> project = projectService.findProjectById(id);
        if (project.isEmpty()){
            throw new EntityNotFoundException("Project not found");
        }

        try {
            List<Map<String, Object>> analyzedTasks = projectAnalysisService.analyzeProjectForNetworkMap(id);

            return ResponseEntity.ok(analyzedTasks);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace(); // Log the exception for debugging.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to perform AI analysis: " + e.getMessage());
        }
    }
}