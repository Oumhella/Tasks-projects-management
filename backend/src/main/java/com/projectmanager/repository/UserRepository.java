package com.projectmanager.repository;

import com.projectmanager.entity.Project;
import com.projectmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByKeycloakId(UUID key);
//    Set<User> findUsersByProjects(Set<Project> projects);

    @Query("SELECT u FROM User u JOIN FETCH u.projects p WHERE p.id = :projectId")
    Set<User> findMembersByProject_Id(@Param("projectId") UUID projectId);
}
