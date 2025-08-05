package com.project_manager.service;

import com.project_manager.entity.Project;
import com.project_manager.repository.ProjectDAO.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public List<Project> findAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Optional<Project> findProjectById(UUID id) {
        return projectRepository.findById(id);
    }

    @Override
    public Project saveProject(Project project) {
        if (project.getCreatedAt() == null) {
            project.setCreatedAt(LocalDateTime.now());
        }
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    @Override
    public Project updateProject(UUID id, Project projectDetails) {
        Optional<Project> projectOptional = projectRepository.findById(id);
        if (projectOptional.isPresent()) {
            Project project = projectOptional.get();
            project.setName(projectDetails.getName());
            project.setDescription(projectDetails.getDescription());
            project.setStartDate(projectDetails.getStartDate());
            project.setEndDate(projectDetails.getEndDate());
            project.setStatus(projectDetails.getStatus());
            project.setColor(projectDetails.getColor());
            project.setIcon(projectDetails.getIcon());
            project.setUpdatedAt(LocalDateTime.now()); // Business logic to update timestamp
            return projectRepository.save(project);
        } else {

            return null;
        }
    }

    @Override
    public void deleteProject(UUID id) {
        projectRepository.deleteById(id);
    }
}