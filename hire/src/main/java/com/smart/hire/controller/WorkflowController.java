package com.smart.hire.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.smart.hire.model.Workflow;
import com.smart.hire.services.WorkflowService;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowController {

    private final WorkflowService service;

    public WorkflowController(WorkflowService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Workflow> create(@RequestBody Workflow workflow) {
        return ResponseEntity.ok(service.create(workflow));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workflow> get(@PathVariable String id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Workflow> update(@PathVariable String id, @RequestBody Workflow updates) {
        return ResponseEntity.ok(service.update(id, updates));
    }

    @GetMapping("/by-job/{jobDescriptionId}")
    public ResponseEntity<Workflow> getByJob(@PathVariable String jobDescriptionId) {
        return service.getByJobDescriptionId(jobDescriptionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

