package com.example.cookingsystem.repositories;

import com.example.cookingsystem.models.TaskCompletion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskCompletionRepository extends MongoRepository<TaskCompletion, String> {
    List<TaskCompletion> findByCompletedByIdAndDeleteStatusFalse(String userId);
    List<TaskCompletion> findByTaskIdAndDeleteStatusFalse(String taskId);
    List<TaskCompletion> findAllByDeleteStatusFalse();
    Optional<TaskCompletion> findByIdAndDeleteStatusFalse(String id);
    Optional<TaskCompletion> findByTaskIdAndCompletedByIdAndDeleteStatusFalse(String taskId, String userId);
}