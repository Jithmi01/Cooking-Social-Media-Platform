package com.example.cookingsystem.services;

import com.example.cookingsystem.models.Task;
import com.example.cookingsystem.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

<<<<<<< Updated upstream

/**
 * Service class for managing tasks.
=======
/**
 * Service layer for handling business logic related to Tasks.
>>>>>>> Stashed changes
 */
@Service
public class TaskService {



    private final TaskRepository taskRepository;

    // Inject TaskRepository through constructor
    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Get all non-deleted tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAllByDeleteStatusFalse();
    }

    // Get tasks by type (excluding deleted)
    public List<Task> getTasksByType(String type) {
        return taskRepository.findByTypeAndDeleteStatusFalse(type);
    }

    // Get a single task by ID (excluding deleted)
    public Optional<Task> getTaskById(String id) {
        return taskRepository.findByIdAndDeleteStatusFalse(id);
    }

    // Create a new task with deleteStatus set to false
    public Task createTask(Task task) {
        task.setDeleteStatus(false);
        return taskRepository.save(task);
    }

    // Update task by ID if it exists
    public Task updateTask(String id, Task taskDetails) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setType(taskDetails.getType());
            task.setEstimateTime(taskDetails.getEstimateTime());
            task.setImageUrl(taskDetails.getImageUrl());
            return taskRepository.save(task);
        }).orElse(null);
    }

    // Soft delete task by setting deleteStatus to true
    public boolean deleteTask(String id) {
        return taskRepository.findById(id).map(task -> {
            task.setDeleteStatus(true);
            taskRepository.save(task);
            return true;
        }).orElse(false);
    }
}
