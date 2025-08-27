package com.projectmanager.repository;

import com.projectmanager.entity.Project;
import com.projectmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByName(String name);

    List<Project> findByCreatedBy_Id(UUID createdByUserId);


}