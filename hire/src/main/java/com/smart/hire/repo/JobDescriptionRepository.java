package com.smart.hire.repo;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.smart.hire.model.JobDescription;

@Repository
public interface JobDescriptionRepository extends MongoRepository<JobDescription, String> {
}
