import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WorkflowService } from '../../../services/workflow.service';
import { Observable } from 'rxjs';
import { JobData } from '../../../models/job.interface';

@Component({
  selector: 'app-review-approve',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './review-approve.component.html',
  styleUrls: ['./review-approve.component.scss']
})
export class ReviewApproveComponent implements OnInit {
  jobData$!: Observable<JobData>;
  isApproved = false;

  constructor(private workflowService: WorkflowService) {}

  ngOnInit(): void {
    this.jobData$ = this.workflowService.jobData$;
  }

  edit() {
    this.workflowService.setCurrentStep(1);
  }

  goToPrevious() {
    this.workflowService.setCurrentStep(1); // Go back to step 1
  }

  approveAndContinue() {
    // Mark step 2 as completed
    this.isApproved = true;
    this.workflowService.completeStep(2); // Mark step 2 as completed with checkmark
    this.workflowService.setCurrentStep(3); // Move to step 3
  }
}
