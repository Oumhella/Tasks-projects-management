package com.projectmanager.listener.comment;

import com.projectmanager.entity.Comment;
import com.projectmanager.event.CommentAddedEvent;
import jakarta.persistence.PostPersist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class CommentActivityListener {

    private final ApplicationEventPublisher eventPublisher;

    public CommentActivityListener(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }



    @PostPersist
    public void onAddComment(Comment comment) {

        if (eventPublisher != null) {
            eventPublisher.publishEvent(new CommentAddedEvent(this, comment));
        }
    }
}