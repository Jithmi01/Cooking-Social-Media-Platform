package com.example.cookingsystem.repositories;

import com.example.cookingsystem.models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByReceiverIdAndDeleteStatusFalse(String receiverId);
    List<Notification> findAllByDeleteStatusFalse();
    Optional<Notification> findByIdAndDeleteStatusFalse(String id);
}