package com.projectmanager.service.attachment;

import com.projectmanager.dto.request.AttachmentRequest;
import com.projectmanager.dto.response.AttachmentResponse;
import com.projectmanager.entity.Attachment;
import com.projectmanager.entity.Comment;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.User;
import com.projectmanager.repository.AttachmentRepository;
import com.projectmanager.service.comment.CommentService;
import com.projectmanager.service.task.TaskService;
import com.projectmanager.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.projectmanager.mapper.AttachmentMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AttachmentServiceImpl implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final AttachmentMapper attachmentMapper;
    private final TaskService taskService;
    private final CommentService commentService;
    private final UserService userService;

    @Autowired
    public AttachmentServiceImpl(AttachmentRepository attachmentRepository, AttachmentMapper attachmentMapper, TaskService taskService, CommentService commentService, UserService userService) {
        this.attachmentRepository = attachmentRepository;
        this.attachmentMapper = attachmentMapper;
        this.taskService = taskService;
        this.commentService = commentService;
        this.userService = userService;
    }


    @Override
    public Optional<AttachmentResponse> findAttachmentById(UUID id) {
        return attachmentRepository.findById(id).map(attachmentMapper::toResponse);
    }

    @Override
    public List<AttachmentResponse> findAllAttachments() {
        return attachmentRepository.findAll().stream().map(attachmentMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public AttachmentResponse createAttachment(AttachmentRequest request) {
        if (request.getTaskId() == null && request.getCommentId() == null) {
            throw new IllegalArgumentException("Attachment must be linked to a Task or a Comment.");
        }

        Attachment attachment = attachmentMapper.toEntity(request);

        // Fetch and set parent entities
        if (request.getTaskId() != null) {
            Task task = taskService.getTask(request.getTaskId())
                    .orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + request.getTaskId()));
            attachment.setTask(task);
        }
        if (request.getCommentId() != null) {
            Comment comment = commentService.getCommentById(request.getCommentId())
                    .orElseThrow(() -> new EntityNotFoundException("Comment not found with ID: " + request.getCommentId()));
            attachment.setComment(comment);
        }

        // Fetch and set the user who uploaded the attachment
        if (request.getUploadedByUserId() != null) {
            User user = userService.getUserById(request.getUploadedByUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + request.getUploadedByUserId()));
            attachment.setUploadedBy(user);
        }

        attachment.setUploadedAt(LocalDateTime.now());
        Attachment savedAttachment = attachmentRepository.save(attachment);

        return attachmentMapper.toResponse(savedAttachment);
    }

    @Override
    public void deleteAttachmentById(UUID id) {

    }
}
