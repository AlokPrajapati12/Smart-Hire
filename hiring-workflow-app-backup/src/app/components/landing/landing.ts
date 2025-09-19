import { Component, InjectionToken } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent {
  
  features = [
    { title: 'Smart Job Descriptions', description: 'Create comprehensive job descriptions with AI assistance and industry best practices', icon: 'description' },
    { title: 'Candidate Management', description: 'Track applications, shortlist candidates, and manage the entire selection process', icon: 'people' },
    { title: 'Interview Scheduling', description: 'Seamlessly schedule interviews and manage communication with candidates', icon: 'schedule' }
  ];

  workflowSteps = [
    { number: 1, title: 'Create JD', subtitle: 'Define requirements' },
    { number: 2, title: 'Review & Approve', subtitle: 'Finalize description' },
    { number: 3, title: 'Post Job', subtitle: 'Publish to boards' },
    { number: 4, title: 'Monitor Applications', subtitle: 'Track responses' },
    { number: 5, title: 'Shortlist Candidates', subtitle: 'Filter applicants' },
    { number: 6, title: 'Conduct Interviews', subtitle: 'Evaluate candidates' },
    { number: 7, title: 'Send Offer', subtitle: 'Extend job offer' },
    { number: 8, title: 'Onboarding', subtitle: 'Welcome new hire' }
  ];

  constructor(private router: Router) {}

  startWorkflow(): void {
    this.router.navigate(['/workflow', 1]);
  }
}
