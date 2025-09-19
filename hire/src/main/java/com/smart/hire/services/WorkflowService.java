package com.smart.hire.services;

import org.springframework.stereotype.Service;

import com.smart.hire.model.Workflow;
import com.smart.hire.repo.WorkflowRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class WorkflowService {

    private final WorkflowRepository repository;

    public WorkflowService(WorkflowRepository repository) {
        this.repository = repository;
    }

    public Workflow create(Workflow workflow) {
        workflow.setCreatedAt(LocalDateTime.now());
        workflow.setUpdatedAt(LocalDateTime.now());
        workflow.setStatus("in-progress");
        workflow.setCurrentStep("create-jd");
        return repository.save(workflow);
    }

    public Optional<Workflow> getById(String id) {
        return repository.findById(id);
    }

    public Optional<Workflow> getByJobDescriptionId(String jobDescriptionId) {
        return repository.findByJobDescriptionId(jobDescriptionId);
    }

    public Workflow update(String id, Workflow updates) {
        Workflow wf = repository.findById(id).orElseThrow(() -> new RuntimeException("Workflow not found"));
        if (updates.getCurrentStep() != null) wf.setCurrentStep(updates.getCurrentStep());
        if (updates.getCompletedSteps() != null) wf.setCompletedSteps(updates.getCompletedSteps());
        wf.setUpdatedAt(LocalDateTime.now());
        return repository.save(wf);
    }
}

