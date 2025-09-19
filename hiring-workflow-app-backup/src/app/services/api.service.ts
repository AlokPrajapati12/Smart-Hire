import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface JobDescription {
  id?: string;
  jobTitle: string;
  companyName: string;
  location?: string;
  department?: string;
  experienceLevel?: string;
  education?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobDescription?: string;
  keySkills?: string;
  benefits?: string[];
  generatedContent?: string;
  status?: string;
}

export interface Workflow {
  id?: string;
  jobDescriptionId: string;
  currentStep?: string;
  completedSteps?: string[];
  status?: string;
  workflowData?: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';  // Spring Boot backend

  constructor(private http: HttpClient) {}

  // -------- Job Description APIs --------
  createJobDescription(jd: JobDescription): Observable<JobDescription> {
    return this.http.post<JobDescription>(`${this.baseUrl}/job-descriptions`, jd);
  }

  getJobDescription(id: string): Observable<JobDescription> {
    return this.http.get<JobDescription>(`${this.baseUrl}/job-descriptions/${id}`);
  }

  generateJobDescription(id: string): Observable<JobDescription> {
    return this.http.post<JobDescription>(`${this.baseUrl}/job-descriptions/${id}/generate`, {});
  }

  // -------- Workflow APIs --------
  createWorkflow(workflow: Workflow): Observable<Workflow> {
    return this.http.post<Workflow>(`${this.baseUrl}/workflows`, workflow);
  }

  getWorkflow(id: string): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.baseUrl}/workflows/${id}`);
  }

  updateWorkflow(id: string, updates: Partial<Workflow>): Observable<Workflow> {
    return this.http.patch<Workflow>(`${this.baseUrl}/workflows/${id}`, updates);
  }

  getWorkflowByJob(jobDescriptionId: string): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.baseUrl}/workflows/by-job/${jobDescriptionId}`);
  }
}
