package com.projectmanager.service.comment;

import com.projectmanager.dto.request.CommentRequest;
import com.projectmanager.dto.response.CommentResponse;
import com.projectmanager.entity.Comment;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.User;
import com.projectmanager.mapper.CommentMapper;
import com.projectmanager.repository.CommentRepository;
import com.projectmanager.service.task.TaskService;
import com.projectmanager.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService{

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final TaskService taskService;
    private final UserService userService;

    @Autowired
    public CommentServiceImpl(CommentRepository commentRepository, CommentMapper commentMapper, TaskService taskService, UserService userService) {
        this.commentRepository = commentRepository;
        this.commentMapper = commentMapper;
        this.taskService = taskService;
        this.userService = userService;
    }

    @Override
    public List<CommentResponse> getCommentsForTask(UUID taskId) {
        return commentRepository.findByTaskId(taskId).stream()
                .map(commentMapper::toResponse)
                .collect(Collectors.toList());
    }
    @Override
    public Optional<Comment> getCommentById(UUID id) {
        return commentRepository.findById(id);
    }

    @Override
    public List<CommentResponse> getComments() {
        return commentRepository.findAll().stream().map(commentMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteCommentById(UUID id) {
        if(!commentRepository.existsById(id)) {
            throw new EntityNotFoundException("Comment not found");
        }
        commentRepository.deleteById(id);
    }

    @Override
    @Transactional
    public CommentResponse createComment(CommentRequest request, String userId) {
        Comment comment = commentMapper.toEntity(request);

        // 1. Fetch the user once from the authenticated userId
        UUID user_Id = UUID.fromString(userId);
        User user = userService.getUserById(user_Id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + user_Id));
        comment.setUser(user);

        // 2. Fetch and set the Task entity
        if (request.getTaskId() == null) {
            throw new IllegalArgumentException("Task ID cannot be null");
        }
        Task task = taskService.getTask(request.getTaskId())
                .orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + request.getTaskId()));
        comment.setTask(task);

        // The content is already mapped by the mapper

        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);

        return commentMapper.toResponse(savedComment);
    }


    @Override
    @Transactional
    public CommentResponse updateComment(UUID id, CommentRequest request) {
        Comment existingComment = commentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with ID: " + id));

        commentMapper.updateEntityFromRequest(request, existingComment);
        existingComment.setUpdatedAt(LocalDateTime.now());

        Comment updatedComment = commentRepository.save(existingComment);
        return commentMapper.toResponse(updatedComment);
    }

}
