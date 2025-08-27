package com.projectmanager.controller;

import com.projectmanager.dto.request.CommentRequest;
import com.projectmanager.dto.response.CommentResponse;
import com.projectmanager.entity.Comment;
import com.projectmanager.mapper.CommentMapper;
import com.projectmanager.service.comment.CommentService;
import com.projectmanager.service.task.TaskService;
import com.projectmanager.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;
    private final CommentMapper commentMapper;

    @Autowired
    public CommentController(CommentService commentService, UserService userService, CommentMapper commentMapper) {
        this.commentService = commentService;
        this.userService = userService;
        this.commentMapper = commentMapper;
    }

    @GetMapping("{id}")
    public ResponseEntity<CommentResponse> getCommentById(@PathVariable UUID id) {
    Optional<Comment> comment = commentService.getCommentById(id);
    if (comment.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
       CommentResponse commentResponse = commentMapper.toResponse(comment.get());
        return ResponseEntity.ok(commentResponse);
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getAllComments() {
        List<CommentResponse> comments = commentService.getComments();
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(@RequestBody CommentRequest request, Principal principal) {
        String username = principal.getName();
//        UUID tstUserId = UUID.fromString("47f98275-1d5d-45b9-be9d-5e8f78a27b67");

        CommentResponse createdComment = commentService.createComment(request, username);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable UUID id, @RequestBody CommentRequest request) {
        CommentResponse updatedComment = commentService.updateComment(id, request);
        return ResponseEntity.ok(updatedComment);
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<List<CommentResponse>> getCommentsByTaskId(@PathVariable UUID id) {
        List<CommentResponse> taskComments = commentService.getCommentsForTask(id);
        return ResponseEntity.ok(taskComments);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<CommentResponse> deleteComment(@PathVariable UUID id) {
        commentService.deleteCommentById(id);
        return ResponseEntity.noContent().build();
    }


}
