package com.projectmanager.controller;

import com.projectmanager.dto.CommentRequest;
import com.projectmanager.entity.Comment;
import com.projectmanager.service.comment.CommentService;
import com.projectmanager.service.task.TaskService;
import com.projectmanager.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {

    private final CommentService commentService;
    private final TaskService taskService;
    private final UserService userService;

    @Autowired
    public CommentController(CommentService commentService, TaskService taskService, UserService userService) {
        this.commentService = commentService;
        this.taskService = taskService;
        this.userService = userService;
    }
    @GetMapping("{id}")
    public Optional<Comment> getCommentById(@PathVariable UUID id) {

       return commentService.getCommentById(id);
    }
    @GetMapping
    public List<Comment> getAllComments() {
        return commentService.getComments();
    }

    @PostMapping
    public Comment createComment(@RequestBody CommentRequest request) {


        Comment comment = new Comment(request.getContent(), taskService.getTask(request.getTaskId()).orElseThrow(), userService.getUserById(request.getUserId()).orElseThrow(), LocalDateTime.now(),LocalDateTime.now());

        return commentService.createComment(comment);
    }


}
