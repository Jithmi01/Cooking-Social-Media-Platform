package com.example.cookingsystem.repositories;

import com.example.cookingsystem.models.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends MongoRepository<Group, String> {

    // Find groups where delete status is false (not deleted)
    List<Group> findByDeleteStatusFalse();

    // Find groups containing a specific member by user ID
    @Query("{'members._id': ?0, 'deleteStatus': false}")
    List<Group> findByMembersIdAndDeleteStatusFalse(String userId);

    // Find group by ID and ensure it's not deleted
    Group findByIdAndDeleteStatusFalse(String id);
}