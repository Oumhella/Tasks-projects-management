package com.projectmanager.service.attachment;

import com.projectmanager.dto.request.AttachmentRequest;
import com.projectmanager.dto.response.AttachmentResponse;
import com.projectmanager.entity.Attachment;
import com.projectmanager.entity.Comment;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.User;
import com.projectmanager.repository.AttachmentRepository;
import com.projectmanager.service.comment.CommentService;
import com.projectmanager.service.minio.MinioService;
import com.projectmanager.service.task.TaskService;
import com.projectmanager.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.projectmanager.mapper.AttachmentMapper;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
    private final UserService userService;
    private final CommentService commentService;
    private final MinioService minioService;


    @Autowired
    public AttachmentServiceImpl(AttachmentRepository attachmentRepository, AttachmentMapper attachmentMapper, MinioService minioService , TaskService taskService, UserService userService, CommentService commentService) {
        this.attachmentRepository = attachmentRepository;
        this.attachmentMapper = attachmentMapper;
        this.taskService = taskService;
        this.userService = userService;
        this.commentService = commentService;
        this.minioService = minioService;
    }

    @Transactional
    public AttachmentResponse uploadAttachment(AttachmentRequest request) throws IOException {
        MultipartFile file = request.getFile();
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty file.");
        }

        String objectName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        minioService.uploadFile(objectName, file.getInputStream(), file.getContentType());

        Attachment attachment = new Attachment();
        attachment.setFileName(file.getOriginalFilename());
        attachment.setFilePath(objectName);
        attachment.setFileSize(file.getSize());
        attachment.setUploadedAt(LocalDateTime.now());

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
        if (request.getUploadedByUserId() != null) {
            User user = userService.findByKey(request.getUploadedByUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + request.getUploadedByUserId()));
            attachment.setUploadedBy(user);
        }

        Attachment savedAttachment = attachmentRepository.save(attachment);
        return attachmentMapper.toResponse(savedAttachment);
    }

    public List<AttachmentResponse> getAttachmentsForTask(UUID taskId) {
        List<Attachment> attachments = attachmentRepository.findByTaskId(taskId);
        return attachmentMapper.toResponseList(attachments);
    }

    public List<AttachmentResponse> getAttachmentsForComment(UUID commentId) {
        List<Attachment> attachments = attachmentRepository.findByCommentId(commentId);
        return attachmentMapper.toResponseList(attachments);
    }

    public Optional<Attachment> getAttachmentById(UUID id) {
        return attachmentRepository.findById(id);
    }

    @Transactional
    public void deleteAttachment(UUID id) throws IOException {
        Attachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Attachment not found with ID: " + id));

        minioService.deleteFile(attachment.getFilePath());
        attachmentRepository.deleteById(id);
    }

    @Override
    public String getPresignedDownloadUrl(UUID attachmentId) throws IOException {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new EntityNotFoundException("Attachment not found with ID: " + attachmentId));

        return minioService.getPresignedUrl(attachment.getFilePath());
    }
}
