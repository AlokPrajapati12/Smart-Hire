package com.smart.hire.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.smart.hire.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // You can define custom queries later
}
