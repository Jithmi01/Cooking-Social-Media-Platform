package com.example.cookingsystem.controllers;

import com.example.cookingsystem.dtos.TaskCompletionDto;
import com.example.cookingsystem.models.TaskCompletion;
import com.example.cookingsystem.services.TaskCompletionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/task-completions")
public class TaskCompletionController {

    private final TaskCompletionService taskCompletionService;

    @Autowired
    public TaskCompletionController(TaskCompletionService taskCompletionService) {
        this.taskCompletionService = taskCompletionService;
    }

    // Get all task completions
    @GetMapping
    public ResponseEntity<List<TaskCompletion>> getAllCompletions() {
        List<TaskCompletion> completions = taskCompletionService.getAllCompletions();
        return new ResponseEntity<>(completions, HttpStatus.OK);
    }

    // Get all completions by a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskCompletion>> getMyCompletions(@PathVariable String userId) {
        List<TaskCompletion> completions = taskCompletionService.getCompletionsByUser(userId);
        return new ResponseEntity<>(completions, HttpStatus.OK);
    }

    // Get all completions for a specific task
    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<TaskCompletion>> getCompletionsByTask(@PathVariable String taskId) {
        List<TaskCompletion> completions = taskCompletionService.getCompletionsByTask(taskId);
        return new ResponseEntity<>(completions, HttpStatus.OK);
    }

    // Check if a specific user has completed a specific task
    @GetMapping("/task/status/{userId}/{taskId}")
    public ResponseEntity<Boolean> getCompletionStatus(
            @PathVariable String taskId,
            @PathVariable String userId) {

        boolean hasCompleted = taskCompletionService.hasUserCompletedTask(userId, taskId);
        return new ResponseEntity<>(hasCompleted, HttpStatus.OK);
    }

    // Get a single task completion by its ID
    @GetMapping("/{id}")
    public ResponseEntity<TaskCompletion> getCompletionById(@PathVariable String id) {
        Optional<TaskCompletion> completion = taskCompletionService.getCompletionById(id);
        return completion.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                         .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Create a new task completion
    @PostMapping("/task/{taskId}")
    public ResponseEntity<TaskCompletion> createCompletion(
            @PathVariable String taskId,
            @RequestBody TaskCompletionDto taskCompletionDto) {

        String userId = taskCompletionDto.getCompletedBy();
        TaskCompletion completion = taskCompletionService.createCompletion(taskId, userId, taskCompletionDto.getSpentTime());

        if (completion != null) {
            return new ResponseEntity<>(completion, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    // Update an existing task completion's spent time
    @PutMapping("/{id}")
    public ResponseEntity<TaskCompletion> updateCompletion(
            @PathVariable String id,
            @RequestParam int spentTime) {

        TaskCompletion updatedCompletion = taskCompletionService.updateCompletion(id, spentTime);

        if (updatedCompletion != null) {
            return new ResponseEntity<>(updatedCompletion, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete a task completion by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompletion(@PathVariable String id) {
        if (taskCompletionService.deleteCompletion(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
