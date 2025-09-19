import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowService } from '../../../services/workflow.service';
import { ApplicationStats } from '../../../models/workflow.interface';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss']
})
export class PostJobComponent implements OnInit {
  applicationStats!: ApplicationStats;

  constructor(private workflowService: WorkflowService) {}

  ngOnInit(): void {
    this.applicationStats = this.workflowService.getApplicationStats();
  }

  reviewApplications(): void {
    // Navigate to review applications or open modal
    console.log('Review applications clicked');
  }

  updateRequirements(): void {
    // Navigate to edit job requirements
    console.log('Update requirements clicked');
  }

  scheduleScreening(): void {
    // Navigate to scheduling interface
    console.log('Schedule screening clicked');
  }
}
