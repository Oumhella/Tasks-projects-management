package com.projectmanager.service.attachment;

import com.projectmanager.dto.request.AttachmentRequest;
import com.projectmanager.dto.response.AttachmentResponse;
import com.projectmanager.entity.Attachment;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttachmentService {

    AttachmentResponse uploadAttachment(AttachmentRequest request) throws IOException;
    List<AttachmentResponse> getAttachmentsForTask(UUID taskId);
    List<AttachmentResponse> getAttachmentsForComment(UUID commentId);
    Optional<Attachment> getAttachmentById(UUID id);
    void deleteAttachment(UUID id);
}

