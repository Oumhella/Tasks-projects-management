package com.projectmanager.service.comment;

import com.projectmanager.entity.Comment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CommentService {
    Optional<Comment> getCommentById(UUID id);
    List<Comment> getComments();
    void deleteCommentById(UUID id);
    Comment createComment(Comment comment);
    Comment editComment(UUID id, Comment editedComment);

    }
