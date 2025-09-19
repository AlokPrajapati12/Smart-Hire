package com.smart.hire.services;


import org.springframework.stereotype.Service;

import com.smart.hire.model.JobDescription;
import com.smart.hire.repo.JobDescriptionRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobDescriptionService {

    private final JobDescriptionRepository repository;

    public JobDescriptionService(JobDescriptionRepository repository) {
        this.repository = repository;
    }

    public JobDescription create(JobDescription jd) {
        jd.setCreatedAt(LocalDateTime.now());
        jd.setUpdatedAt(LocalDateTime.now());
        jd.setStatus("draft");
        return repository.save(jd);
    }

    public JobDescription update(String id, JobDescription updates) {
        JobDescription jd = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (updates.getJobTitle() != null) jd.setJobTitle(updates.getJobTitle());
        jd.setUpdatedAt(LocalDateTime.now());
        return repository.save(jd);
    }

    public JobDescription generateContent(String id) {
        JobDescription jd = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        String generated = String.format("""
                # %s

                ## About %s
                Join our dynamic team at %s in %s.

                ## Job Description
                %s

                ## Key Responsibilities
                - Lead innovative projects in %s
                - Collaborate with cross-functional teams
                - Drive technical excellence
                - Mentor junior team members

                ## Requirements
                - %s experience level
                - %s degree preferred
                - Skills: %s

                ## Benefits
                %s

                ## Compensation
                %s - %s
                """,
                jd.getJobTitle(),
                jd.getCompanyName(),
                jd.getCompanyName(),
                jd.getLocation(),
                jd.getJobDescriptionText(),
                jd.getDepartment(),
                jd.getExperienceLevel(),
                jd.getEducation(),
                String.join(", ", jd.getKeySkills() != null ? jd.getKeySkills() : List.of()),
                jd.getBenefits() != null ? String.join(", ", jd.getBenefits()) : "Competitive benefits package",
                jd.getSalaryMin() != null ? jd.getSalaryMin() : 0,
                jd.getSalaryMax() != null ? jd.getSalaryMax() : 0
        );

        jd.setGeneratedContent(generated);
        jd.setStatus("generated");
        jd.setUpdatedAt(LocalDateTime.now());

        return repository.save(jd);
    }

    public JobDescription getById(String id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
    }
}
