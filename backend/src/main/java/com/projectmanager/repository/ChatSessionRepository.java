package com.projectmanager.repository;

import com.projectmanager.entity.ChatSession;
import com.projectmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID> {
    
    List<ChatSession> findByUser_IdOrderByUpdatedAtDesc(UUID userId);
    
    Optional<ChatSession> findByIdAndUser_Id(UUID sessionId, UUID userId);
    
    @Query("SELECT cs FROM ChatSession cs JOIN FETCH cs.messages WHERE cs.id = :sessionId")
    Optional<ChatSession> findByIdWithMessages(@Param("sessionId") UUID sessionId);
    
    @Query("SELECT cs FROM ChatSession cs JOIN FETCH cs.user WHERE cs.user.id = :userId ORDER BY cs.updatedAt DESC")
    List<ChatSession> findByUser_IdWithUser(@Param("userId") UUID userId);
}

