package com.projectmanager.controller;

import com.projectmanager.dto.response.AttachmentResponse;
import com.projectmanager.entity.Attachment;
import com.projectmanager.service.attachment.AttachmentService;
import com.projectmanager.dto.request.AttachmentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/attachments")
public class AttachmentController {

    private final AttachmentService attachmentService;

    @Autowired
    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @GetMapping("/comments/{id}")
    public ResponseEntity<List<AttachmentResponse>> getAttachmentsForComment(@PathVariable UUID id) {
        List<AttachmentResponse> commentAttachments = attachmentService.getAttachmentsForComment(id);
        return new ResponseEntity<>(commentAttachments, HttpStatus.OK);
    }
    @GetMapping("/tasks/{id}")
    public ResponseEntity<List<AttachmentResponse>> getAttachmentsForTask(@PathVariable UUID id) {
        List<AttachmentResponse> taskAttachments = attachmentService.getAttachmentsForTask(id);
        return new ResponseEntity<>(taskAttachments, HttpStatus.OK);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentResponse> uploadAttachment(@RequestParam("file") MultipartFile file,
                                                               @RequestParam(value = "taskId", required = false) UUID taskId,
                                                               @RequestParam(value = "commentId", required = false) UUID commentId,
                                                               Principal principal) {
        AttachmentRequest request = new AttachmentRequest();
        request.setFile(file);
        request.setTaskId(taskId);
        request.setCommentId(commentId);
        request.setUploadedByUserId(UUID.fromString(principal.getName()));

        try {
            AttachmentResponse response = attachmentService.uploadAttachment(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable UUID id) {
        Optional<Attachment> attachmentOptional = attachmentService.getAttachmentById(id);
        if (attachmentOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Attachment attachment = attachmentOptional.get();
            Path filePath = Paths.get(attachment.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFileName() + "\"");
                return ResponseEntity.ok()
                        .headers(headers)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable UUID id) {
        attachmentService.deleteAttachment(id);
        return ResponseEntity.noContent().build();
    }
}