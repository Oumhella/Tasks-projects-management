package com.projectmanager.repository;

import com.projectmanager.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByName(String name);

    List<Project> findByCreatedBy_Id(UUID createdByUserId);
}