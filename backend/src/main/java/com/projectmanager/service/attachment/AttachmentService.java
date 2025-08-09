package com.projectmanager.service.attachment;

import com.projectmanager.dto.request.AttachmentRequest;
import com.projectmanager.dto.response.AttachmentResponse;
import com.projectmanager.entity.Attachment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttachmentService {

    Optional<AttachmentResponse> findAttachmentById(UUID id);
    List<AttachmentResponse> findAllAttachments();
    AttachmentResponse createAttachment(AttachmentRequest attachment);
    void deleteAttachmentById(UUID id);
//    Attachment updateTaskAttachment(UUID id,Attachment attachment);
//    void deleteTaskAttachment(UUID id);
//
//    Optional<Attachment> findCommentAttachmentById(UUID id);
//    List<Attachment> findAllCommentAttachments();
//    Attachment saveCommentAttachment(Attachment attachment);
//    Attachment updateCommentAttachment(UUID id,Attachment attachment);
//    void deleteCommentAttachment(UUID id);
}

