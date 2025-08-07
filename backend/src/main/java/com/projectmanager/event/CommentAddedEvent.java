package com.projectmanager.event;

import com.projectmanager.entity.Comment;
import org.springframework.context.ApplicationEvent;

public class CommentAddedEvent extends ApplicationEvent {
    private final Comment comment;

    public CommentAddedEvent(Object source, Comment comment) {
        super(source);
        this.comment = comment;
    }

    public Comment getComment() {
        return comment;
    }
}