package com.projectmanager.event;

import com.projectmanager.entity.Task;
import org.springframework.context.ApplicationEvent;

public class TaskUpdatedEvent extends ApplicationEvent {
    private final Task task;

    public TaskUpdatedEvent(Object source, Task task) {
        super(source);
        this.task = task;
    }
    public Task getTask() {
        return task;
    }
}
