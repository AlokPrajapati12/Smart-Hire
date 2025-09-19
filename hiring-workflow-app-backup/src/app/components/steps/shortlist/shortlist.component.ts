import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowService } from '../../../services/workflow.service';
import { Candidate } from '../../../models/candidate.interface';

@Component({
  selector: 'app-shortlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shortlist.component.html',
  styleUrls: ['./shortlist.component.scss']
})
export class ShortlistComponent implements OnInit {
  candidates: Candidate[] = [];
  shortlistedCandidates: Candidate[] = [];
  shortlistedCount = 0;

  constructor(private workflowService: WorkflowService) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.workflowService.candidates$.subscribe(candidates => {
      this.candidates = candidates;
      this.shortlistedCandidates = candidates.filter(c => c.status === 'Shortlisted');
      this.shortlistedCount = this.shortlistedCandidates.length;
    });
  }

  addToShortlist(candidateId: number): void {
    this.workflowService.markCandidateForShortlist(candidateId, true);
    console.log('Added candidate to shortlist:', candidateId);
  }

  removeFromShortlist(candidateId: number): void {
    this.workflowService.markCandidateForShortlist(candidateId, false);
    console.log('Removed candidate from shortlist:', candidateId);
  }

  scheduleInterviews(): void {
    console.log('Schedule interviews for shortlisted candidates');
    // Navigate to interview scheduling or show modal
  }

  sendNotifications(): void {
    console.log('Send notifications to shortlisted candidates');
    // Send notification emails to shortlisted candidates
  }

  isShortlisted(candidateId: number): boolean {
    const candidate = this.candidates.find(c => c.id === candidateId);
    return candidate?.status === 'Shortlisted';
  }

  getCandidateStatus(candidateId: number): string {
    const candidate = this.candidates.find(c => c.id === candidateId);
    return candidate?.status || 'Under Review';
  }
}
