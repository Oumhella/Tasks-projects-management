package com.projectmanager.controller;

import com.projectmanager.dto.request.AttachmentRequest;
import com.projectmanager.dto.response.AttachmentResponse;
import com.projectmanager.service.attachment.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/attachments")
public class AttachmentController {

    private final AttachmentService attachmentService;

    @Autowired
    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @PostMapping
    public ResponseEntity<AttachmentResponse> createAttachment(@RequestBody AttachmentRequest request) {
        AttachmentResponse createdAttachment = attachmentService.createAttachment(request);
        return new ResponseEntity<>(createdAttachment, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttachmentResponse> getAttachmentById(@PathVariable UUID id) {
        return attachmentService.findAttachmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
