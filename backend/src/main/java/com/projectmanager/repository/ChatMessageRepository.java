package com.projectmanager.repository;

import com.projectmanager.entity.ChatMessage;
import com.projectmanager.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    
    List<ChatMessage> findBySession_IdOrderByCreatedAtAsc(UUID sessionId);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.session.id = :sessionId ORDER BY cm.createdAt ASC")
    List<ChatMessage> findMessagesBySessionId(@Param("sessionId") UUID sessionId);
}


