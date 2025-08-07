package com.projectmanager.listener.task;

import com.projectmanager.entity.Activity;
import com.projectmanager.entity.Task;
import com.projectmanager.service.activity.ActivityService;
import jakarta.persistence.PostUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TaskActivityListener {

    private static ActivityService activityService;
    @Autowired
    public void init(ActivityService service) {
        TaskActivityListener.activityService = service;
    }

    @PostUpdate
    public void onPostUpdate(Task task) {
        // Logique pour déterminer les changements et créer un enregistrement d'activité
        // Par exemple, si le statut a changé
        // Note: L'accès à l'état précédent nécessite une approche plus avancée (comme @PreUpdate)

        // Simuler un enregistrement d'activité
        Activity activity = new Activity();
        activity.setAction("Task Updated");
        activity.setDetails("Task '" + task.getTitle() + "' was updated.");
        activity.setTask(task);
        activity.setCreatedAt(LocalDateTime.now());
        // L'utilisateur doit être récupéré du contexte de sécurité

        // Sauvegarder l'activité via le service
        if (activityService != null) {
            activityService.createActivity(activity);
        }
    }
}