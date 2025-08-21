package com.projectmanager.service.project;

import com.projectmanager.dto.request.ProjectRequest;
import com.projectmanager.dto.response.ProjectResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.User;
import com.projectmanager.mapper.ProjectMapper;
import com.projectmanager.repository.ProjectRepository;
import com.projectmanager.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final UserService userService;

    @Autowired
    public ProjectServiceImpl(ProjectRepository projectRepository, ProjectMapper projectMapper, UserService userService) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
        this.userService = userService;
    }
    @Override
    public List<ProjectResponse> findAllProjects() {
        return projectRepository.findAll().stream().map(projectMapper::toResponse).collect(Collectors.toList());
    }


    @Override
    public Optional<Project> findProjectById(UUID id) {
        return projectRepository.findById(id);
    }

//    @PreAuthorize("hasAnyRole('admin','project-manager')")
    @Transactional
    @Override
    public ProjectResponse createProject(ProjectRequest request, String createdByUserIdString) {
        Project project = projectMapper.toEntity(request);

        UUID createdByUserId = UUID.fromString(createdByUserIdString);
        User creator = userService.getUserById(createdByUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + createdByUserId));
        project.setCreatedBy(creator);

        if (request.getMemberIds() != null && !request.getMemberIds().isEmpty()) {
            Set<User> members = new HashSet<>(userService.getUsersByIds(request.getMemberIds()));
            project.setMembers(members);
        }

        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        Project savedProject = projectRepository.save(project);

        return projectMapper.toResponse(savedProject);
    }
//    @PreAuthorize("hasAnyRole('admin','project-manager')")
    @Override
    @Transactional
    public ProjectResponse updateProject(UUID id, ProjectRequest request) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with ID: " + id));

        projectMapper.updateProjectFromDto(request, existingProject);

        if (request.getMemberIds() != null) {
            Set<User> members = new HashSet<>(userService.getUsersByIds(request.getMemberIds()));
            existingProject.setMembers(members);
        }

        existingProject.setUpdatedAt(LocalDateTime.now());
        Project savedProject = projectRepository.save(existingProject);

        return projectMapper.toResponse(savedProject);
    }


    @Override
    @Transactional
    public void deleteProject(UUID id) {
        if (!projectRepository.existsById(id)) {
            throw new EntityNotFoundException("Project not found with ID: " + id);
        }
        projectRepository.deleteById(id);
    }}