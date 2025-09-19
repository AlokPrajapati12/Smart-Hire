package com.smart.hire.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Document(collection = "workflows")
public class Workflow {

    @Id
    private String id;
    private String name;
    private String status;
    private String currentStep;
    private List<String> completedSteps;
    private Map<String, String> workflowData;
    private String jobDescriptionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
}
