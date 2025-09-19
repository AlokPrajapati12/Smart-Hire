package com.smart.hire.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.smart.hire.model.JobDescription;
import com.smart.hire.services.JobDescriptionService;

@RestController
@RequestMapping("/api/job-descriptions")
public class JobDescriptionController {

    private final JobDescriptionService service;

    public JobDescriptionController(JobDescriptionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<JobDescription> create(@RequestBody JobDescription jd) {
        return ResponseEntity.ok(service.create(jd));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDescription> get(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<JobDescription> update(@PathVariable String id, @RequestBody JobDescription updates) {
        return ResponseEntity.ok(service.update(id, updates));
    }

    @PostMapping("/{id}/generate")
    public ResponseEntity<JobDescription> generate(@PathVariable String id) {
        return ResponseEntity.ok(service.generateContent(id));
    }
}
