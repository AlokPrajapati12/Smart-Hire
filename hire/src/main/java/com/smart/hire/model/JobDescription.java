package com.smart.hire.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "job_descriptions")
@Getter
@Setter
public class JobDescription {

    @Id
    private String id;

    private String jobTitle;
    private String companyName;
    private String location;
    private String department;
    private String experienceLevel;
    private String education;
    private String jobDescriptionText;
    private String generatedContent;
    private String status;
    private Integer salaryMin;
    private Integer salaryMax;
    private List<String> keySkills;
    private List<String> benefits;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
}
