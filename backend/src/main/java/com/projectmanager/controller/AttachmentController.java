package com.projectmanager.controller;

import com.projectmanager.dto.response.AttachmentResponse;
import com.projectmanager.entity.Attachment;
import com.projectmanager.service.attachment.AttachmentService;
import com.projectmanager.dto.request.AttachmentRequest;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;
import java.util.Map;
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



    @GetMapping("/comments/{commentId}")
    public ResponseEntity<List<AttachmentResponse>> getAttachmentsForComment(@PathVariable UUID commentId) {
        List<AttachmentResponse> commentAttachments = attachmentService.getAttachmentsForComment(commentId);
        return new ResponseEntity<>(commentAttachments, HttpStatus.OK);
    }
    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<List<AttachmentResponse>> getAttachmentsForTask(@PathVariable UUID taskId) {
        List<AttachmentResponse> taskAttachments = attachmentService.getAttachmentsForTask(taskId);
        return new ResponseEntity<>(taskAttachments, HttpStatus.OK);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentResponse> uploadAttachment(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "taskId", required = false) UUID taskId,
            @RequestParam(value = "commentId", required = false) UUID commentId,
            Principal principal) throws IOException {

        AttachmentRequest request = new AttachmentRequest();
        request.setFile(file);
        request.setTaskId(taskId);
        request.setCommentId(commentId);
//        UUID tstUserId = UUID.fromString("47f98275-1d5d-45b9-be9d-5e8f78a27b67");
        request.setUploadedByUserId(UUID.fromString(principal.getName()));
//        request.setUploadedByUserId(tstUserId);
        AttachmentResponse response = attachmentService.uploadAttachment(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/download-url")
    public ResponseEntity<Map<String, String>> getDownloadUrl(@PathVariable UUID id) throws IOException {
        String downloadUrl = attachmentService.getPresignedDownloadUrl(id);
        return ResponseEntity.ok(Map.of("downloadUrl", downloadUrl));
    }


//    @GetMapping("/{id}")
//    public ResponseEntity<Resource> downloadAttachment(@PathVariable UUID id) {
//        Optional<Attachment> attachmentOptional = attachmentService.getAttachmentById(id);
//        if (attachmentOptional.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        try {
//            Attachment attachment = attachmentOptional.get();
//            Path filePath = Paths.get(attachment.getFilePath());
//            Resource resource = new UrlResource(filePath.toUri());
//
//            if (resource.exists() || resource.isReadable()) {
//                HttpHeaders headers = new HttpHeaders();
//                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFileName() + "\"");
//                return ResponseEntity.ok()
//                        .headers(headers)
//                        .body(resource);
//            } else {
//                return ResponseEntity.notFound().build();
//            }
//        } catch (MalformedURLException e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable UUID id) throws IOException {
        attachmentService.deleteAttachment(id);
        return ResponseEntity.noContent().build();
    }
}