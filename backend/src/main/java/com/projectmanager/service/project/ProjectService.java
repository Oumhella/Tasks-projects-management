package com.projectmanager.service.project;

import com.projectmanager.dto.request.ProjectRequest;
import com.projectmanager.dto.response.ProjectResponse;
import com.projectmanager.entity.Project;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface ProjectService {


    List<ProjectResponse> findAllProjects();


    Optional<Project> findProjectById(UUID id);

    ProjectResponse createProject(ProjectRequest request, String createdByUserIdString);

    ProjectResponse updateProject(UUID id, ProjectRequest request);

    void deleteProject(UUID id);


}