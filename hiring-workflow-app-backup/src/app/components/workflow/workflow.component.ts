import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // ✅ ADD THIS
import { WorkflowService } from '../../services/workflow.service';
import { WorkflowStep } from '../../models/workflow.interface';

// Standalone components
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { CreateJobComponent } from '../steps/create-job/create-job.component';
import { ReviewApproveComponent } from '../steps/review-approve/review-approve.component';
import { PostJobComponent } from '../steps/post-job/post-job.component';
import { MonitorAppsComponent } from '../steps/monitor-apps/monitor-apps.component';
import { ShortlistComponent } from '../steps/shortlist/shortlist.component';
import { InterviewsComponent } from '../steps/interviews/interviews.component';
import { SendOfferComponent } from '../steps/send-offer/send-offer.component';
import { OnboardingComponent } from '../steps/onboarding/onboarding.component';

@Component({
  selector: 'app-workflow',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule, // ✅ ADD THIS
    SidebarComponent,
    CreateJobComponent,
    ReviewApproveComponent,
    PostJobComponent,
    MonitorAppsComponent,
    ShortlistComponent,
    InterviewsComponent,
    SendOfferComponent,
    OnboardingComponent
  ],
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {
  currentStep: number = 1;
  workflowSteps: WorkflowStep[] = [];

  @ViewChild(CreateJobComponent)
  createJobStep?: CreateJobComponent;

  constructor(
    private workflowService: WorkflowService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to workflow steps
    this.workflowService.workflowSteps$.subscribe(
      steps => this.workflowSteps = steps || []
    );

    this.workflowService.currentStep$.subscribe(step => {
      this.currentStep = step;
      this.router.navigate(['/workflow', step]);
    });

    // Read step from route
    this.route.paramMap.subscribe(params => {
      const step = params.get('step');
      if (step) {
        const stepNumber = parseInt(step, 10);
        this.workflowService.setCurrentStep(stepNumber);
        this.currentStep = stepNumber;
      }
    });
  }

  onStepClick(stepId: number): void {
    this.router.navigate(['/workflow', stepId]);
  }

  nextStep(): void {
    if (this.currentStep === 2) {
      this.workflowService.approveJobDescription();
    } else if (this.currentStep === 3) {
      this.workflowService.startMonitoring();
    } else if (this.currentStep === 4) {
      this.workflowService.proceedToShortlisting();
    } else if (this.currentStep === 5) {
      this.workflowService.startInterviews();
    } else if (this.currentStep === 6) {
      this.workflowService.prepareOffers();
    } else if (this.currentStep === 7) {
      // ✅ ADD THIS - For step 7, begin onboarding
      this.workflowService.beginOnboarding();
    } else {
      const newStep = Math.min(this.currentStep + 1, 8);
      this.workflowService.setCurrentStep(newStep);
    }
  }

  previousStep(): void {
    const newStep = Math.max(this.currentStep - 1, 1);
    this.workflowService.setCurrentStep(newStep);
    this.router.navigate(['/workflow', newStep]);
  }

  saveDraft(): void {
    if (this.currentStep === 1 && this.createJobStep) {
      this.createJobStep.saveDraft();
    }
  }

  generateJD(): void {
    if (this.currentStep === 1 && this.createJobStep) {
      this.createJobStep.generateJobDescription();
    } else {
      this.nextStep();
    }
  }

  // ✅ ADD THESE NEW METHODS
  get nextButtonText(): string {
    return this.workflowService.getNextButtonText(this.currentStep);
  }

  get nextButtonIcon(): string {
    return this.workflowService.getNextButtonIcon(this.currentStep);
  }

  // ✅ HELPER METHODS (implement the missing ones)
  isStepActive(stepId: number): boolean {
    return this.currentStep === stepId;
  }

  isStepCompleted(step: WorkflowStep): boolean {
    return step.completed;
  }

  canNavigateToStep(stepId: number): boolean {
    // Allow navigation to current step or completed steps or the next step
    return stepId <= this.currentStep || this.workflowSteps[stepId - 1]?.completed;
  }
}
