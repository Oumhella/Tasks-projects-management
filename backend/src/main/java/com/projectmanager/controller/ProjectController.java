package com.projectmanager.controller;



import com.projectmanager.dto.response.ProjectResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.User;
import com.projectmanager.service.project.ProjectService;
import com.projectmanager.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService ;
    @Autowired
    public ProjectController(ProjectService projectService, UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.findAllProjects();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable UUID id) {
        return projectService.findProjectById(id)
                .map(project -> new ResponseEntity<>(project, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

//    @PostMapping
//    public Project createProject(@RequestBody ProjectRequest request) {
//        HashSet<User> memberss = new HashSet<>();
//        for (UUID id : request.members){
//        memberss.add(userService.getUserById(id).orElseThrow());
//        }
//        Project project = new Project(request.name, request.description, request.startDate, request.endDate, request.status, request.color, request.icon, userService.getUserById(request.created_by_user_id).orElseThrow(), memberss, LocalDateTime.now(),LocalDateTime.now());
//        return projectService.saveProject(project);
//    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody ProjectResponse request, Principal principal) {
        // 1. Get the authenticated user ID (the creator) from the security context

        UUID idd = UUID.fromString("b4c9cb10-26f5-4dbc-ad43-637d81ce8cc1");

//        UUID creatorId = UUID.fromString(principal.getName());
        User createdBy = userService.getUserById(idd)
                .orElseThrow(() -> new EntityNotFoundException("Creator not found"));

        // 2. Fetch the member User objects from the provided UUIDs
        Set<User> members = request.getMembers().stream()
                .map(id -> userService.getUserById(id).orElseThrow(() -> new EntityNotFoundException("Member not found with ID: " + id)))
                .collect(Collectors.toSet());
       Project project = new Project(request.getName(), request.getDescription(), request.getStartDate(), request.getEndDate(), request.getStatus(), request.getColor(), request.getIcon(), createdBy, members, LocalDateTime.now(),LocalDateTime.now());


        Project savedProject = projectService.saveProject(project);
        return new ResponseEntity<>(savedProject, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable UUID id, @RequestBody Project projectDetails) {
        Project updatedProject = projectService.updateProject(id, projectDetails);
        if (updatedProject != null) {
            return new ResponseEntity<>(updatedProject, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteProject(@PathVariable UUID id) {
        try {
            projectService.deleteProject(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}