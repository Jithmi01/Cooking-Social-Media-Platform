package com.example.cookingsystem.services;

import com.example.cookingsystem.models.Task;
import com.example.cookingsystem.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAllByDeleteStatusFalse();
    }

    public List<Task> getTasksByType(String type) {
        return taskRepository.findByTypeAndDeleteStatusFalse(type);
    }

    public Optional<Task> getTaskById(String id) {
        return taskRepository.findByIdAndDeleteStatusFalse(id);
    }

    public Task createTask(Task task) {
        task.setDeleteStatus(false);
        return taskRepository.save(task);
    }

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

    public boolean deleteTask(String id) {
        return taskRepository.findById(id).map(task -> {
            task.setDeleteStatus(true);
            taskRepository.save(task);
            return true;
        }).orElse(false);
    }
}