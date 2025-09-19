import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowService } from '../../../services/workflow.service';
import { Candidate } from '../../../models/candidate.interface';

interface JobPostingStatus {
  jobTitle: string;
  status: string;
  totalApplicants: number;
  applicationsToday: number;
  applicationsThisWeek: number;
  views: number;
  viewsToday: number;
  daysActive: number;
  conversionRate: string;
}

interface PipelineMetrics {
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  hired: number;
  rejected: number;
}

interface NotificationAlert {
  type: string;
  message: string;
  action: string;
  count: number;
}

interface RecruiterMetrics {
  timeToScreen: string;
  timeToInterview: string;
  timeToOffer: string;
  responseTime: string;
  screeningRate: string;
  interviewConversionRate: string;
  offerAcceptanceRate: string;
  efficiency: string;
}

interface CandidateActivity {
  time: string;
  activity: string;
  type: string;
}

interface IntegrationStatus {
  platform: string;
  status: string;
  lastSync: string;
  newApplications: number;
}

interface DiversityStats {
  genderMix: {
    male: number;
    female: number;
    other: number;
  };
  locationMix: Record<string, number>;
  experienceLevels: Record<string, number>;
  diversityScore: string;
}

@Component({
  selector: 'app-monitor-apps',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitor-apps.component.html',
  styleUrls: ['./monitor-apps.component.scss']
})
export class MonitorAppsComponent implements OnInit {
  jobPostingStatus!: JobPostingStatus;
  pipelineMetrics!: PipelineMetrics;
  notifications: NotificationAlert[] = [];
  recruiterMetrics!: RecruiterMetrics;
  candidateActivity: CandidateActivity[] = [];
  integrationStatus: IntegrationStatus[] = [];
  diversityStats!: DiversityStats;
  
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  totalCandidates = 0;
  
  selectedStatus = '';
  searchQuery = '';

  constructor(private workflowService: WorkflowService) {}

  ngOnInit(): void {
    this.loadMonitoringData();
  }

  loadMonitoringData(): void {
    // Load all monitoring data
    this.jobPostingStatus = this.workflowService.getJobPostingStatus();
    this.pipelineMetrics = this.workflowService.getPipelineMetrics();
    this.notifications = this.workflowService.getNotificationsAndAlerts();
    this.recruiterMetrics = this.workflowService.getRecruiterMetrics();
    this.candidateActivity = this.workflowService.getCandidateActivity();
    this.integrationStatus = this.workflowService.getIntegrationStatus();
    this.diversityStats = this.workflowService.getDiversityStats();
    
    // Load candidates
    this.workflowService.candidates$.subscribe(candidates => {
      this.candidates = candidates;
      this.filteredCandidates = candidates;
      this.totalCandidates = candidates.length;
    });
  }

  getScoreClass(score: number): string {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'poor';
  }

  getStageClass(stage: string): string {
    switch (stage.toLowerCase()) {
      case 'applied': return 'applied';
      case 'screening': return 'screening';
      case 'interview': return 'interview';
      case 'offer': return 'offer';
      case 'hired': return 'hired';
      case 'rejected': return 'rejected';
      default: return 'applied';
    }
  }

  filterCandidates(): void {
    let filtered = this.candidates;
    
    if (this.selectedStatus) {
      filtered = filtered.filter(candidate => 
        candidate.stage === this.selectedStatus || candidate.status === this.selectedStatus
      );
    }
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(query) ||
        candidate.title.toLowerCase().includes(query) ||
        candidate.location?.toLowerCase().includes(query)
      );
    }
    
    this.filteredCandidates = filtered;
  }

  searchCandidates(): void {
    this.filterCandidates();
  }

  reviewCandidate(candidate: Candidate): void {
    console.log('Review candidate:', candidate.name);
    // Navigate to candidate review page or open modal
  }

  shortlistCandidate(candidate: Candidate): void {
    if (candidate.status === 'Shortlisted') return;
    
    this.workflowService.markCandidateForShortlist(candidate.id, true);
    console.log('Shortlisted candidate:', candidate.name);
  }

  handleAlert(alert: NotificationAlert): void {
    console.log('Handle alert:', alert.type, alert.message);
    // Handle different alert types
    switch (alert.type) {
      case 'urgent':
        // Navigate to pending reviews
        break;
      case 'reminder':
        // Open calendar/schedule
        break;
      case 'approval':
        // Navigate to offers pending approval
        break;
      case 'followup':
        // Open email composer
        break;
    }
  }

  getExperienceArray(): Array<{level: string, count: number}> {
    return Object.entries(this.diversityStats.experienceLevels).map(([level, count]) => ({
      level,
      count
    }));
  }

  exportCandidates(): void {
    console.log('Export candidates data');
    // Implement export functionality
  }
}
