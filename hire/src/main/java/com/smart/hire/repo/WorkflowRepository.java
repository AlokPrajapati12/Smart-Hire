package com.smart.hire.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.smart.hire.model.Workflow;

import java.util.Optional;

@Repository
public interface WorkflowRepository extends MongoRepository<Workflow, String> {
    Optional<Workflow> findByJobDescriptionId(String jobDescriptionId);
}

