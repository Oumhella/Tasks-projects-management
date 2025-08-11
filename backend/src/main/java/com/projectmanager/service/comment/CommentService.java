package com.projectmanager.service.comment;

import com.projectmanager.dto.request.CommentRequest;
import com.projectmanager.dto.response.CommentResponse;
import com.projectmanager.entity.Comment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CommentService {
    List<CommentResponse> getCommentsForTask(UUID taskId);
    Optional<Comment> getCommentById(UUID id);
    List<CommentResponse> getComments();
    void deleteCommentById(UUID id);
    CommentResponse createComment(CommentRequest request, String userId);
    CommentResponse updateComment(UUID id, CommentRequest request);

    }
