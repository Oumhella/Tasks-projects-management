package com.projectmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.projectmanager.entity.Attachment;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {
    List<Attachment> findByTaskId(UUID taskId);

    List<Attachment> findByCommentId(UUID commentId);
}
