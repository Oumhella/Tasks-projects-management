package com.projectmanager.service.project;

import com.projectmanager.entity.Project;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface ProjectService {


    List<Project> findAllProjects();

    Optional<Project> findProjectById(UUID id);

    Project saveProject(Project project);

    Project updateProject(UUID id, Project projectDetails);

    void deleteProject(UUID id);

    // You can add more business-logic-specific methods here
    // e.g., List<Project> findProjectsByStatus(String status);
}