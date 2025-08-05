package com.project_manager.repository.ProjectDAO;

import com.project_manager.entity.Project;
import org.apache.catalina.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    // You can add custom query methods here if needed,
    // Spring Data JPA will automatically generate the implementation.

    // Example: Find projects by name
    List<Project> findByName(String name);

    // Example: Find projects created by a specific user
    List<Project> findByCreatedBy_Id(UUID createdByUserId);
}