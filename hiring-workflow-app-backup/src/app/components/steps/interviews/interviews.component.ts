import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowService } from '../../../services/workflow.service';
import { Candidate } from '../../../models/candidate.interface';
import { JobData } from '../../../models/job.interface';

interface InterviewForm {
  date: string;
  time: string;
  type: string;
  mode: string;
  meetingLink: string;
  location: string;
  interviewers: string[];
}

interface Interviewer {
  id: number;
  name: string;
  role: string;
  selected: boolean;
}

interface Evaluation {
  technicalSkills: number;
  communication: number;
  problemSolving: number;
  cultureFit: number;
  notes: string;
}

interface InterviewSchedule {
  candidateId: number;
  date: string;
  time: string;
  type: string;
  mode: string;
  status: string;
  interviewer: string;
}

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss']
})
export class InterviewsComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  selectedCandidate: Candidate | null = null;
  jobData!: JobData;
  selectedInterviewStatus = '';

  interviewForm: InterviewForm = {
    date: '',
    time: '',
    type: 'Technical',
    mode: 'Video',
    meetingLink: '',
    location: '',
    interviewers: []
  };

  evaluation: Evaluation = {
    technicalSkills: 0,
    communication: 0,
    problemSolving: 0,
    cultureFit: 0,
    notes: ''
  };

  availableInterviewers: Interviewer[] = [
    { id: 1, name: 'John Smith', role: 'Technical Lead', selected: false },
    { id: 2, name: 'Sarah Johnson', role: 'HR Manager', selected: false },
    { id: 3, name: 'Mike Chen', role: 'Senior Developer', selected: false },
    { id: 4, name: 'Lisa Wang', role: 'Product Manager', selected: false }
  ];

  interviewSchedules: InterviewSchedule[] = [
    { candidateId: 1, date: '2025-09-20', time: '10:00', type: 'Technical', mode: 'Video', status: 'Scheduled', interviewer: 'John Smith' },
    { candidateId: 2, date: '2025-09-21', time: '14:00', type: 'HR', mode: 'Video', status: 'Completed', interviewer: 'Sarah Johnson' }
  ];

  uploadedFiles: File[] = [];

  constructor(private workflowService: WorkflowService) {}

  ngOnInit(): void {
    this.loadData();
    this.setDefaultDateTime();
  }

  loadData(): void {
    // Load shortlisted candidates
    this.workflowService.candidates$.subscribe(candidates => {
      this.candidates = candidates.filter(c => c.status === 'Shortlisted');
      this.filteredCandidates = this.candidates;
    });

    // Load job data
    this.workflowService.jobData$.subscribe(jobData => {
      this.jobData = jobData;
    });
  }

  setDefaultDateTime(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.interviewForm.date = tomorrow.toISOString().split('T')[0];
    this.interviewForm.time = '10:00';
  }

  selectCandidate(candidate: Candidate): void {
    this.selectedCandidate = candidate;
    this.resetForms();
  }

  resetForms(): void {
    this.evaluation = {
      technicalSkills: 0,
      communication: 0,
      problemSolving: 0,
      cultureFit: 0,
      notes: ''
    };
    this.availableInterviewers.forEach(interviewer => interviewer.selected = false);
  }

  filterByStatus(): void {
    if (!this.selectedInterviewStatus) {
      this.filteredCandidates = this.candidates;
    } else {
      this.filteredCandidates = this.candidates.filter(candidate => 
        this.getInterviewStatus(candidate.id) === this.selectedInterviewStatus
      );
    }
  }

  getInterviewStatus(candidateId: number): string {
    const schedule = this.interviewSchedules.find(s => s.candidateId === candidateId);
    if (!schedule) return 'Not Scheduled';
    return schedule.status;
  }

  getInterviewStatusClass(candidateId: number): string {
    const status = this.getInterviewStatus(candidateId);
    switch (status) {
      case 'Scheduled': return 'scheduled';
      case 'Completed': return 'completed';
      case 'Feedback Pending': return 'pending';
      default: return 'not-scheduled';
    }
  }

  hasScheduledInterview(candidateId: number): boolean {
    return this.interviewSchedules.some(s => s.candidateId === candidateId);
  }

  scheduleInterview(): void {
    if (!this.selectedCandidate) return;

    const selectedInterviewers = this.availableInterviewers
      .filter(i => i.selected)
      .map(i => i.name);

    if (selectedInterviewers.length === 0) {
      alert('Please select at least one interviewer');
      return;
    }

    const newSchedule: InterviewSchedule = {
      candidateId: this.selectedCandidate.id,
      date: this.interviewForm.date,
      time: this.interviewForm.time,
      type: this.interviewForm.type,
      mode: this.interviewForm.mode,
      status: 'Scheduled',
      interviewer: selectedInterviewers.join(', ')
    };

    // Remove existing schedule for this candidate
    this.interviewSchedules = this.interviewSchedules.filter(s => s.candidateId !== this.selectedCandidate!.id);
    
    // Add new schedule
    this.interviewSchedules.push(newSchedule);

    alert('Interview scheduled successfully!');
    console.log('Interview scheduled:', newSchedule);
  }

  sendInvitation(): void {
    if (!this.selectedCandidate) return;

    const schedule = this.interviewSchedules.find(s => s.candidateId === this.selectedCandidate!.id);
    if (!schedule) {
      alert('Please schedule the interview first');
      return;
    }

    // Simulate sending invitation
    alert(`Invitation sent to ${this.selectedCandidate.name} and interviewers`);
    console.log('Invitation sent for interview:', schedule);
  }

  setRating(category: keyof Evaluation, rating: number): void {
    if (category !== 'notes') {
      this.evaluation[category] = rating;
    }
  }

  saveEvaluation(): void {
    if (!this.selectedCandidate) return;

    console.log('Evaluation saved:', {
      candidateId: this.selectedCandidate.id,
      evaluation: this.evaluation,
      files: this.uploadedFiles
    });

    // Update interview status to completed
    const schedule = this.interviewSchedules.find(s => s.candidateId === this.selectedCandidate!.id);
    if (schedule) {
      schedule.status = 'Completed';
    }

    alert('Evaluation saved successfully!');
  }

  onFileUpload(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.uploadedFiles = [...this.uploadedFiles, ...files];
  }

  removeFile(file: File): void {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
  }

  updateCandidateStatus(status: string): void {
    if (!this.selectedCandidate) return;

    console.log(`Candidate ${this.selectedCandidate.name} status updated to: ${status}`);
    
    // Update candidate status in the service
    switch (status) {
      case 'Pass to Next Round':
        this.workflowService.updateCandidateStatus(this.selectedCandidate.id, 'Shortlisted');
        break;
      case 'Reject':
        this.workflowService.updateCandidateStatus(this.selectedCandidate.id, 'Rejected');
        break;
      case 'Send Offer':
        // Navigate to offer step or update status
        this.workflowService.updateCandidateStatus(this.selectedCandidate.id, 'Shortlisted');
        break;
    }

    alert(`Candidate status updated to: ${status}`);
  }

  getInterviewHistory(candidateId: number): InterviewSchedule[] {
    return this.interviewSchedules.filter(s => s.candidateId === candidateId);
  }

  viewResume(): void {
    console.log('View resume for:', this.selectedCandidate?.name);
    // Open resume viewer or navigate to resume page
  }

  viewPortfolio(): void {
    console.log('View portfolio for:', this.selectedCandidate?.name);
    // Open portfolio viewer or navigate to portfolio page
  }
}
