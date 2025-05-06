package com.example.cookingsystem.services;

import com.example.cookingsystem.models.Task;
import com.example.cookingsystem.models.TaskCompletion;
import com.example.cookingsystem.models.User;
import com.example.cookingsystem.repositories.TaskCompletionRepository;
import com.example.cookingsystem.repositories.TaskRepository;
import com.example.cookingsystem.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Service for handling task completion logic.
 */
@Service
public class TaskCompletionService {

    private final TaskCompletionRepository taskCompletionRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // Constructor injection
    @Autowired
    public TaskCompletionService(TaskCompletionRepository taskCompletionRepository,
                                 TaskRepository taskRepository,
                                 UserRepository userRepository,
                                 NotificationService notificationService) {
        this.taskCompletionRepository = taskCompletionRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    // Get all non-deleted completions
    public List<TaskCompletion> getAllCompletions() {
        return taskCompletionRepository.findAllByDeleteStatusFalse();
    }

    // Get completions by user ID
    public List<TaskCompletion> getCompletionsByUser(String userId) {
        return taskCompletionRepository.findByCompletedByIdAndDeleteStatusFalse(userId);
    }

    // Get completions by task ID
    public List<TaskCompletion> getCompletionsByTask(String taskId) {
        return taskCompletionRepository.findByTaskIdAndDeleteStatusFalse(taskId);
    }

    // Check if a user has already completed a task
    public boolean hasUserCompletedTask(String userId, String taskId) {
        return taskCompletionRepository
                .findByTaskIdAndCompletedByIdAndDeleteStatusFalse(taskId, userId)
                .isPresent();
    }

    // Get completion by ID
    public Optional<TaskCompletion> getCompletionById(String id) {
        return taskCompletionRepository.findByIdAndDeleteStatusFalse(id);
    }

    // Create a new task completion
    public TaskCompletion createCompletion(String taskId, String userId, int spentTime) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        Optional<User> userOptional = userRepository.findById(userId);

        if (taskOptional.isPresent() && userOptional.isPresent()) {
            // Prevent duplicate completions
            if (hasUserCompletedTask(userId, taskId)) {
                return null;
            }

            // Create and save completion record
            TaskCompletion completion = new TaskCompletion();
            completion.setTask(taskOptional.get());
            completion.setCompletedBy(userOptional.get());
            completion.setSpentTime(spentTime);
            completion.setCompletedAt(new Date());
            completion.setDeleteStatus(false);

            // Send a notification to the user
            notificationService.createUserNotification(
                    userId,
                    "Task Completed!",
                    "You've completed the task: " + taskOptional.get().getTitle()
            );

            return taskCompletionRepository.save(completion);
        }
        return null;
    }

    // Update only the spent time of a completion
    public TaskCompletion updateCompletion(String id, int newSpentTime) {
        return taskCompletionRepository.findById(id).map(completion -> {
            completion.setSpentTime(newSpentTime);
            return taskCompletionRepository.save(completion);
        }).orElse(null);
    }

    // Soft delete a task completion
    public boolean deleteCompletion(String id) {
        return taskCompletionRepository.findById(id).map(completion -> {
            completion.setDeleteStatus(true);
            taskCompletionRepository.save(completion);
            return true;
        }).orElse(false);
    }
}
