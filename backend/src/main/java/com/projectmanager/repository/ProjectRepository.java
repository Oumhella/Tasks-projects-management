package com.projectmanager.repository;

import com.projectmanager.entity.Project;
import com.projectmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByName(String name);


    @Query("SELECT p FROM Project p JOIN FETCH p.createdBy u WHERE u.id= :createdByUserId")
    List<Project> findByCreatedBy_Id(@Param("createdByUserId") UUID createdByUserId);

    @Query("SELECT p FROM Project p JOIN FETCH p.members u WHERE u.id= :userId")
    List<Project> findByMember_Id(@Param("userId") UUID memberId);



}