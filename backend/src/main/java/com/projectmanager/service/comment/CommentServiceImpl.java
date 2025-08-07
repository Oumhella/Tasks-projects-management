package com.projectmanager.service.comment;

import com.projectmanager.entity.Comment;
import com.projectmanager.repository.CommentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CommentServiceImpl implements CommentService{

    private final CommentRepository commentRepository;

    @Autowired
    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public Optional<Comment> getCommentById(UUID id) {
        return commentRepository.findById(id);
    }

    @Override
    public List<Comment> getComments() {
        return commentRepository.findAll();
    }

    @Override
    public void deleteCommentById(UUID id) {
        commentRepository.deleteById(id);
    }

    @Override
    public Comment createComment(Comment comment) {
        if(comment.getId() != null) {
            throw new IllegalArgumentException("Id non valid");
        }
       return commentRepository.save(comment);
    }

    @Override
    public Comment editComment(UUID id, Comment editedComment) {
       Comment existingComment = commentRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Comment not found"));

       existingComment.setContent(editedComment.getContent());

        return commentRepository.save(existingComment);
    }


}
