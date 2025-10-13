package com.projectmanager.repository;

import com.projectmanager.entity.Activity;
import com.projectmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {
     void deleteByTaskId(UUID taskId);

     @Query("SELECT a FROM Activity a " +
             "JOIN FETCH a.project p " +
             "JOIN FETCH p.members m " +
             "WHERE m.id = :userId " +
             "ORDER BY a.createdAt DESC")
     List<Activity> findActivitiesForUserProjects(@Param("userId") UUID userId);

     Activity findActivityByProjectId(UUID projectId);
}
