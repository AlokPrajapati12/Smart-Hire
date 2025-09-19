import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowService } from '../../../services/workflow.service';
import { Candidate } from '../../../models/candidate.interface';
import { JobData } from '../../../models/job.interface';

interface OfferDetails {
  baseSalary: number;
  annualBonus: number;
  equity: number;
  benefits: {
    healthInsurance: boolean;
    retirement: boolean;
    remoteWork: boolean;
    stockOptions: boolean;
    paidTimeOff: boolean;
    learningBudget: boolean;
  };
  startDate: string;
  workLocation: string;
}

interface SendOptions {
  method: 'email' | 'portal';
  emailSubject: string;
  personalMessage: string;
  ccHR: boolean;
  ccManager: boolean;
}

interface OfferTimeline {
  drafted: string;
  sent?: string;
  viewed?: string;
  responded?: string;
}

@Component({
  selector: 'app-send-offer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-offer.component.html',
  styleUrls: ['./send-offer.component.scss']
})
export class SendOfferComponent implements OnInit {
  selectedCandidate: Candidate | null = null;
  jobData!: JobData;

  offerDetails: OfferDetails = {
    baseSalary: 150000,
    annualBonus: 25000,
    equity: 0.5,
    benefits: {
      healthInsurance: true,
      retirement: true,
      remoteWork: true,
      stockOptions: true,
      paidTimeOff: false,
      learningBudget: false
    },
    startDate: '',
    workLocation: 'Remote'
  };

  sendOptions: SendOptions = {
    method: 'email',
    emailSubject: '',
    personalMessage: '',
    ccHR: false,
    ccManager: true
  };

  approvalStatus = 'Approved';
  currentApprovalStep = 3;
  offerStatus = 'Draft';

  offerTimeline: OfferTimeline = {
    drafted: new Date().toISOString().split('T')[0]
  };

  constructor(private workflowService: WorkflowService) { }

  ngOnInit(): void {
    this.loadOfferData();
    this.setDefaultDates();
  }

  loadOfferData(): void {
    // Get the best candidate for offer
    this.workflowService.candidates$.subscribe(candidates => {
      const shortlisted = candidates.filter(c => c.status === 'Shortlisted');
      // Select highest scoring candidate
      this.selectedCandidate = shortlisted.reduce((prev, current) =>
        (prev.score > current.score) ? prev : current
      );
    });

    this.workflowService.jobData$.subscribe(jobData => {
      this.jobData = jobData;
      this.sendOptions.emailSubject = `Job Offer - ${jobData.jobTitle} Position`;
      this.sendOptions.personalMessage = `Dear ${this.selectedCandidate?.name},

We are excited to extend this offer for the ${jobData.jobTitle} position at ${jobData.companyName}. 

We believe your skills and experience make you an excellent fit for our team, and we look forward to working with you.

Please review the attached offer letter and let us know if you have any questions.

Best regards,
HR Team`;
    });
  }

  setDefaultDates(): void {
    // Set start date to 2 weeks from now
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 14);
    this.offerDetails.startDate = startDate.toISOString().split('T')[0];
  }

  calculateTotalPackage(): number {
    return this.offerDetails.baseSalary + this.offerDetails.annualBonus;
  }

  isStepCompleted(step: number): boolean {
    return step <= this.currentApprovalStep;
  }

  isStatusCompleted(status: string): boolean {
    const statusOrder = ['Draft', 'Sent', 'Viewed', 'Responded'];
    const currentIndex = statusOrder.indexOf(this.offerStatus);
    const targetIndex = statusOrder.indexOf(status);
    return targetIndex <= currentIndex;
  }

  canSendOffer(): boolean {
    return this.approvalStatus === 'Approved' &&
      this.selectedCandidate !== null &&
      this.sendOptions.emailSubject.trim() !== '';
  }

  reviewLegalTerms(): void {
    console.log('Review legal terms');
    // Open legal terms review modal or page
  }

  generatePDF(): void {
    console.log('Generate PDF offer letter');
    // Generate PDF using the offer details
    const pdfData = {
      candidate: this.selectedCandidate,
      job: this.jobData,
      offer: this.offerDetails,
      generatedDate: new Date()
    };

    // Simulate PDF generation
    alert('PDF generated successfully!');
  }

  scheduleCall(): void {
    console.log('Schedule call with candidate');
    // Open scheduling modal or navigate to calendar
  }

  previewOffer(): void {
    console.log('Preview offer letter');
    // Show offer letter preview modal
  }

  downloadOffer(): void {
    console.log('Download offer letter');
    // Download the generated PDF
  }

  sendOffer(): void {
    if (!this.canSendOffer()) return;

    console.log('Sending offer to:', this.selectedCandidate?.name);

    // ✅ FIXED: Update offer status properly
    this.workflowService.updateOfferStatus('Sent');

    // ✅ Get updated status if needed
    const updatedStatus = this.workflowService.getOfferStatus();
    console.log('Updated status:', updatedStatus);

    // Show success message
    alert(`Offer sent successfully to ${this.selectedCandidate?.name}!`);
  }

  // ✅ Simulate candidate viewing the offer
  simulateViewOffer(): void {
    this.workflowService.updateOfferStatus('Viewed');
  }

  // ✅ Simulate candidate response
  simulateResponse(response: 'accepted' | 'declined' | 'negotiating'): void {
    this.workflowService.updateOfferStatus('Responded', response);
  }
}
