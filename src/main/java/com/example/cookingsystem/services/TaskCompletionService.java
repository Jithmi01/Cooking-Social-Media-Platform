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

@Service
public class TaskCompletionService {

    private final TaskCompletionRepository taskCompletionRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

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

    // Get all completions
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

    // Check if user has completed a task
    public boolean hasUserCompletedTask(String userId, String taskId) {
        return taskCompletionRepository
                .findByTaskIdAndCompletedByIdAndDeleteStatusFalse(taskId, userId)
                .isPresent();
    }

    // Get completion by ID
    public Optional<TaskCompletion> getCompletionById(String id) {
        return taskCompletionRepository.findByIdAndDeleteStatusFalse(id);
    }

    // Create task completion
    public TaskCompletion createCompletion(String taskId, String userId, int spentTime) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        Optional<User> userOptional = userRepository.findById(userId);

        if (taskOptional.isPresent() && userOptional.isPresent()) {
            // Check if already completed
            if (hasUserCompletedTask(userId, taskId)) {
                return null;
            }

            TaskCompletion completion = new TaskCompletion();
            completion.setTask(taskOptional.get());
            completion.setCompletedBy(userOptional.get());
            completion.setSpentTime(spentTime);
            completion.setCompletedAt(new Date());
            completion.setDeleteStatus(false);

            // Send notification
            notificationService.createUserNotification(
                    userId,
                    "Task Completed!",
                    "You've completed the task: " + taskOptional.get().getTitle()
            );

            return taskCompletionRepository.save(completion);
        }
        return null;
    }

    // Update completion (only spent time can be updated)
    public TaskCompletion updateCompletion(String id, int newSpentTime) {
        return taskCompletionRepository.findById(id).map(completion -> {
            completion.setSpentTime(newSpentTime);
            return taskCompletionRepository.save(completion);
        }).orElse(null);
    }

    // Delete completion (soft delete)
    public boolean deleteCompletion(String id) {
        return taskCompletionRepository.findById(id).map(completion -> {
            completion.setDeleteStatus(true);
            taskCompletionRepository.save(completion);
            return true;
        }).orElse(false);
    }
}