import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WorkflowStep, ApplicationStats } from '../models/workflow.interface';
import { Candidate } from '../models/candidate.interface';
import { JobData } from '../models/job.interface';

// ✅ ADD INTERFACES HERE - After imports, before @Injectable
interface OfferTimeline {
  drafted: string | null;
  sent: string | null;
  viewed: string | null;
  responded: string | null;
}

interface OfferStatus {
  status: string;
  timeline: OfferTimeline;
  candidateResponse: string | null;
  lastActivity: string;
  expiryDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  // ✅ UPDATED: Start at Step 7 to show Send Offer page
  private currentStepSubject = new BehaviorSubject<number>(7);

  // ✅ UPDATED: Steps 1-6 completed, Step 7 current
  private workflowStepsSubject = new BehaviorSubject<WorkflowStep[]>([
    { id: 1, title: 'Create Job Description', subtitle: 'Define role requirements and company details', completed: true },
    { id: 2, title: 'Review & Approve', subtitle: 'Review generated job description', completed: true },
    { id: 3, title: 'Post Job', subtitle: 'Publish to job boards and platforms', completed: true },
    { id: 4, title: 'Monitor Applications', subtitle: 'Track incoming applications', completed: true },
    { id: 5, title: 'Shortlist Candidates', subtitle: 'Filter and select promising candidates', completed: true },
    { id: 6, title: 'Conduct Interviews', subtitle: 'Interview shortlisted candidates', completed: true },
    { id: 7, title: 'Send Offer', subtitle: 'Extend job offer to selected candidate', completed: false },
    { id: 8, title: 'Onboarding', subtitle: 'Welcome new hire', completed: false }
  ]);

  // ✅ Sample data matching your screenshot
  private jobDataSubject = new BehaviorSubject<JobData>({
    companyName: 'NVIDIA',
    department: 'Administration',
    jobTitle: 'Receptionist & Event Assistant',
    location: 'Jaipur, Rajasthan',
    employmentType: 'contract',
    minSalary: 120000,
    maxSalary: 300000,
    experienceLevel: 'senior experience level',
    education: 'masters degree preferred',
    keySkills: 'JAVA',
    benefits: ['Health Insurance', 'Remote Work'],
    jobDescription: `# Receptionist & Event Assistant

## About NVIDIA
Join our dynamic team at NVIDIA in Jaipur, Rajasthan.

## Job Description
null

## Key Responsibilities
- Lead innovative projects in product
- Collaborate with cross-functional teams
- Drive technical excellence and best practices
- Mentor junior team members

## Requirements
- senior experience level
- masters degree preferred
- Skills: JAVA

## Benefits
- Health Insurance, Remote Work

## Compensation
120000 - 300000`
  });

  // ✅ ENHANCED: More candidates with detailed pipeline stages
  private candidatesSubject = new BehaviorSubject<Candidate[]>([
    { id: 1, name: 'Sarah Chen', title: 'Senior ML Engineer', score: 95, status: 'Shortlisted', interviewScore: 9.2, appliedDate: '2025-09-16', stage: 'Interview', location: 'Mumbai', experience: '8 years', avatar: '/assets/avatars/sarah.jpg', education: 'PhD in Computer Science' },
    { id: 2, name: 'Michael Rodriguez', title: 'AI Research Scientist', score: 92, status: 'Shortlisted', interviewScore: 8.8, appliedDate: '2025-09-15', stage: 'Interview', location: 'Delhi', experience: '6 years', avatar: '/assets/avatars/michael.jpg', education: 'MS in Machine Learning' },
    { id: 3, name: 'Emily Wang', title: 'Deep Learning Engineer', score: 88, status: 'Shortlisted', interviewScore: 0, appliedDate: '2025-09-14', stage: 'Screening', location: 'Bangalore', experience: '5 years', avatar: '/assets/avatars/emily.jpg', education: 'BS in Computer Science' },
    { id: 4, name: 'David Kim', title: 'Computer Vision Engineer', score: 87, status: 'Shortlisted', interviewScore: 8.1, appliedDate: '2025-09-13', stage: 'Interview', location: 'Hyderabad', experience: '7 years', avatar: '/assets/avatars/david.jpg', education: 'MS in Computer Vision' },
    { id: 5, name: 'Alex Johnson', title: 'NLP Specialist', score: 85, status: 'Shortlisted', interviewScore: 0, appliedDate: '2025-09-12', stage: 'Applied', location: 'Chennai', experience: '4 years', avatar: '/assets/avatars/alex.jpg', education: 'BS in Linguistics' },
    { id: 6, name: 'Jennifer Lee', title: 'Data Scientist', score: 89, status: 'Under Review', interviewScore: 0, appliedDate: '2025-09-11', stage: 'Screening', location: 'Pune', experience: '6 years', avatar: '/assets/avatars/jennifer.jpg', education: 'MS in Statistics' },
    { id: 7, name: 'Robert Smith', title: 'Software Engineer', score: 76, status: 'Rejected', interviewScore: 0, appliedDate: '2025-09-10', stage: 'Rejected', location: 'Kolkata', experience: '3 years', avatar: '/assets/avatars/robert.jpg', education: 'BS in Engineering' },
    { id: 8, name: 'Lisa Zhang', title: 'Product Manager', score: 91, status: 'Shortlisted', interviewScore: 8.9, appliedDate: '2025-09-09', stage: 'Offer', location: 'Gurgaon', experience: '9 years', avatar: '/assets/avatars/lisa.jpg', education: 'MBA in Product Management' },
    { id: 9, name: 'James Wilson', title: 'Backend Developer', score: 82, status: 'Under Review', interviewScore: 0, appliedDate: '2025-09-18', stage: 'Applied', location: 'Noida', experience: '4 years', avatar: '/assets/avatars/james.jpg', education: 'BS in Software Engineering' },
    { id: 10, name: 'Priya Sharma', title: 'Frontend Developer', score: 90, status: 'Shortlisted', interviewScore: 0, appliedDate: '2025-09-18', stage: 'Screening', location: 'Jaipur', experience: '5 years', avatar: '/assets/avatars/priya.jpg', education: 'BS in Computer Science' }
  ]);

  constructor() { }

  /** STEP MANAGEMENT **/
  get currentStep$(): Observable<number> {
    return this.currentStepSubject.asObservable();
  }

  get workflowSteps$(): Observable<WorkflowStep[]> {
    return this.workflowStepsSubject.asObservable();
  }

  setCurrentStep(step: number): void {
    if (step >= 1 && step <= 8) {
      this.currentStepSubject.next(step);
    }
  }

  completeStep(step: number): void {
    const steps = this.workflowStepsSubject.value;
    const index = steps.findIndex(s => s.id === step);
    if (index !== -1) {
      steps[index].completed = true;
      this.workflowStepsSubject.next([...steps]);
    }
  }

  // ✅ UPDATED: Get button text based on current step
  getNextButtonText(currentStep: number): string {
    switch (currentStep) {
      case 2:
        return 'Approve & Continue';
      case 3:
        return 'Start Monitoring';
      case 4:
        return 'Proceed to Shortlisting';
      case 5:
        return 'Start Interviews';
      case 6:
        return 'Prepare Offers';
      case 7:
        return 'Begin Onboarding';  // ✅ Added for Offer page
      case 8:
        return 'Complete Workflow';
      default:
        return 'Next';
    }
  }

  // ✅ UPDATED: Get button icon based on current step
  getNextButtonIcon(currentStep: number): string {
    switch (currentStep) {
      case 2:
        return '✓';
      case 3:
        return '📊';
      case 4:
        return '⭐';
      case 5:
        return '🎯';
      case 6:
        return '💼';
      case 7:
        return '🎉';  // ✅ Added celebration icon for Offer page
      case 8:
        return '✓✓';
      default:
        return '→';
    }
  }

  // ✅ Handle approval for step 2
  approveJobDescription(): void {
    this.completeStep(2);
    this.setCurrentStep(3);
  }

  // ✅ Handle start monitoring for step 3
  startMonitoring(): void {
    this.completeStep(3);
    this.setCurrentStep(4);
  }

  // ✅ Handle proceed to shortlisting for step 4
  proceedToShortlisting(): void {
    this.completeStep(4);
    this.setCurrentStep(5);
  }

  // ✅ Handle start interviews for step 5
  startInterviews(): void {
    this.completeStep(5);
    this.setCurrentStep(6);
  }

  // ✅ Handle prepare offers for step 6
  prepareOffers(): void {
    this.completeStep(6);
    this.setCurrentStep(7);
  }

  // ✅ NEW: Handle begin onboarding for step 7
  beginOnboarding(): void {
    this.completeStep(7);
    this.setCurrentStep(8);
  }

  nextStep(): void {
    const current = this.currentStepSubject.value;
    if (current < 8) {
      this.completeStep(current);
      this.setCurrentStep(current + 1);
    }
  }

  previousStep(): void {
    const current = this.currentStepSubject.value;
    if (current > 1) this.setCurrentStep(current - 1);
  }

  /** JOB DATA **/
  get jobData$(): Observable<JobData> {
    return this.jobDataSubject.asObservable();
  }

  get currentJobData(): JobData {
    return this.jobDataSubject.value;
  }

  updateJobData(data: Partial<JobData>): void {
    const newData = { ...this.jobDataSubject.value, ...data };

    if (newData.jobTitle && newData.companyName && newData.location) {
      newData.jobDescription = this.generateJobDescription(newData);
    }

    this.jobDataSubject.next(newData);
  }

  setJobData(data: JobData): void {
    this.jobDataSubject.next(data);
  }

  generateJobDescription(data: JobData): string {
    return `# ${data.jobTitle}

## About ${data.companyName}
Join our dynamic team at ${data.companyName} in ${data.location}.

## Job Description
${data.department ? `We are looking for a ${data.jobTitle} to join our ${data.department} team.` : 'null'}

## Key Responsibilities
- Lead innovative projects in ${data.keySkills || 'product'}
- Collaborate with cross-functional teams
- Drive technical excellence and best practices
- Mentor junior team members

## Requirements
- ${data.experienceLevel || 'Experience level not specified'}
- ${data.education || 'Education requirements not specified'}
- Skills: ${data.keySkills || 'Skills not specified'}

## Benefits
${(data.benefits && data.benefits.length > 0)
        ? data.benefits.join(', ')
        : 'Health Insurance, Remote Work'}

## Compensation
${data.minSalary && data.maxSalary ? `${data.minSalary} - ${data.maxSalary}` : 'Competitive salary'}`;
  }

  /** CANDIDATES **/
  get candidates$(): Observable<Candidate[]> {
    return this.candidatesSubject.asObservable();
  }

  updateCandidateStatus(candidateId: number, status: Candidate['status']): void {
    const candidates = this.candidatesSubject.value;
    const index = candidates.findIndex(c => c.id === candidateId);
    if (index !== -1) {
      candidates[index].status = status;
      this.candidatesSubject.next([...candidates]);
    }
  }

  /** APPLICATION STATS **/
  getApplicationStats(): ApplicationStats {
    return {
      totalApplications: 23,
      qualified: 8,
      underReview: 12,
      rejected: 3,
      views: 247,
      daysPosted: 7,
      responseTime: '24 hours avg',
      applicationRate: '3.3 per day',
      qualityScore: 'High'
    };
  }

  // ✅ Comprehensive Job Posting Status
  getJobPostingStatus() {
    const candidates = this.candidatesSubject.value;
    return {
      jobTitle: this.currentJobData.jobTitle,
      status: 'Open',
      totalApplicants: candidates.length,
      applicationsToday: 3,
      applicationsThisWeek: 8,
      views: 247,
      viewsToday: 12,
      daysActive: 7,
      conversionRate: '9.3%'
    };
  }

  // ✅ Pipeline Metrics - Candidates at Each Stage
  getPipelineMetrics() {
    const candidates = this.candidatesSubject.value;
    return {
      applied: candidates.filter(c => c.stage === 'Applied').length,
      screening: candidates.filter(c => c.stage === 'Screening').length,
      interview: candidates.filter(c => c.stage === 'Interview').length,
      offer: candidates.filter(c => c.stage === 'Offer').length,
      hired: candidates.filter(c => c.stage === 'Hired').length,
      rejected: candidates.filter(c => c.stage === 'Rejected').length
    };
  }

  // ✅ Candidate Activity - Real-time Updates
  getCandidateActivity() {
    return [
      { time: '10 minutes ago', activity: 'James Wilson submitted application', type: 'new_application' },
      { time: '1 hour ago', activity: 'Priya Sharma completed skills assessment', type: 'assessment' },
      { time: '2 hours ago', activity: 'Sarah Chen uploaded updated resume', type: 'document_update' },
      { time: '3 hours ago', activity: 'Michael Rodriguez scheduled for interview', type: 'interview_scheduled' },
      { time: '4 hours ago', activity: 'Emily Wang moved to screening stage', type: 'stage_update' },
      { time: '5 hours ago', activity: 'David Kim completed background check', type: 'verification' }
    ];
  }

  // ✅ Recruiter Performance & SLA Metrics
  getRecruiterMetrics() {
    return {
      timeToScreen: '1.2 days avg',
      timeToInterview: '3.5 days avg',
      timeToOffer: '7.2 days avg',
      responseTime: '4.8 hours avg',
      screeningRate: '85%',
      interviewConversionRate: '67%',
      offerAcceptanceRate: '78%',
      efficiency: 'High'
    };
  }

  // ✅ Notifications & Alerts
  getNotificationsAndAlerts() {
    return [
      {
        type: 'urgent',
        message: '3 candidates waiting for feedback (>48 hours)',
        action: 'Review Now',
        count: 3
      },
      {
        type: 'reminder',
        message: '2 interviews scheduled for today',
        action: 'View Schedule',
        count: 2
      },
      {
        type: 'approval',
        message: '1 offer pending approval',
        action: 'Review Offer',
        count: 1
      },
      {
        type: 'followup',
        message: '5 candidates need follow-up emails',
        action: 'Send Emails',
        count: 5
      }
    ];
  }

  // ✅ Diversity & Compliance Stats
  getDiversityStats() {
    const candidates = this.candidatesSubject.value;
    return {
      genderMix: {
        male: 6,
        female: 4,
        other: 0
      },
      locationMix: {
        'Mumbai': 1,
        'Delhi': 1,
        'Bangalore': 1,
        'Hyderabad': 1,
        'Chennai': 1,
        'Pune': 1,
        'Kolkata': 1,
        'Gurgaon': 1,
        'Noida': 1,
        'Jaipur': 1
      },
      experienceLevels: {
        'Junior (1-3 years)': 1,
        'Mid (4-6 years)': 4,
        'Senior (7+ years)': 5
      },
      diversityScore: 'Good'
    };
  }

  // ✅ Advanced Filters & Search Options
  getFilterOptions() {
    return {
      jobs: ['All Jobs', 'Receptionist & Event Assistant', 'Software Engineer', 'Data Scientist'],
      recruiters: ['All Recruiters', 'John Doe', 'Jane Smith', 'Mike Johnson'],
      statuses: ['All Status', 'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'],
      skills: ['All Skills', 'JAVA', 'Python', 'React', 'Node.js', 'ML/AI'],
      locations: ['All Locations', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'],
      experience: ['All Experience', '1-3 years', '4-6 years', '7+ years'],
      scores: ['All Scores', '90-100', '80-89', '70-79', 'Below 70'],
      dates: ['All Time', 'Today', 'This Week', 'This Month', 'Last 30 Days']
    };
  }

  // ✅ Integration Status Indicators
  getIntegrationStatus() {
    return [
      {
        platform: 'LinkedIn Jobs',
        status: 'Connected',
        lastSync: '5 minutes ago',
        newApplications: 2
      },
      {
        platform: 'Naukri.com',
        status: 'Connected',
        lastSync: '15 minutes ago',
        newApplications: 1
      },
      {
        platform: 'Indeed',
        status: 'Syncing',
        lastSync: '1 hour ago',
        newApplications: 0
      },
      {
        platform: 'Monster',
        status: 'Error',
        lastSync: '2 hours ago',
        newApplications: 0
      }
    ];
  }

  // ✅ Data for Shortlisting Transition
  getShortlistingData() {
    const candidates = this.candidatesSubject.value;
    const qualified = candidates.filter(c => c.score >= 85 && c.status !== 'Rejected');

    return {
      jobId: 1,
      jobTitle: this.currentJobData.jobTitle,
      totalCandidates: candidates.length,
      qualifiedCandidates: qualified.length,
      recommendedForShortlist: qualified.slice(0, 5), // Top 5 candidates
      shortlistCriteria: {
        minScore: 85,
        requiredSkills: ['JAVA'],
        preferredLocations: ['Jaipur', 'Delhi', 'Mumbai'],
        experienceRange: '4-8 years'
      }
    };
  }

  // ✅ Shortlist Data for Shortlist Candidates page
  getShortlistData() {
    const candidates = this.candidatesSubject.value;
    const shortlisted = candidates.filter(c => c.status === 'Shortlisted');

    return {
      allCandidates: candidates,
      shortlistedCandidates: shortlisted,
      shortlistedCount: shortlisted.length,
      readyForInterview: shortlisted.length,
      nextSteps: [
        {
          title: 'Schedule Interviews',
          description: `${shortlisted.length} candidates ready for interviews`,
          action: 'Schedule'
        },
        {
          title: 'Send Notifications',
          description: 'Notify shortlisted candidates',
          action: 'Send'
        }
      ]
    };
  }

  // ✅ Interview Data for Conduct Interviews page
  getInterviewData() {
    const candidates = this.candidatesSubject.value;
    const shortlisted = candidates.filter(c => c.status === 'Shortlisted');

    return {
      shortlistedCandidates: shortlisted,
      totalInterviews: 8,
      scheduledInterviews: 3,
      completedInterviews: 2,
      pendingFeedback: 1,
      interviewers: [
        { id: 1, name: 'John Smith', role: 'Technical Lead', selected: false },
        { id: 2, name: 'Sarah Johnson', role: 'HR Manager', selected: false },
        { id: 3, name: 'Mike Chen', role: 'Senior Developer', selected: false },
        { id: 4, name: 'Lisa Wang', role: 'Product Manager', selected: false }
      ],
      interviewTypes: [
        'Screening Interview',
        'Technical Interview',
        'HR / Behavioral Interview',
        'Final / Panel Interview'
      ],
      interviewModes: [
        'Video Call',
        'In-person',
        'Phone Call'
      ]
    };
  }

  // ✅ Get interview schedules
  getInterviewSchedules() {
    return [
      {
        candidateId: 1,
        candidateName: 'Sarah Chen',
        date: '2025-09-20',
        time: '10:00',
        type: 'Technical',
        mode: 'Video',
        status: 'Scheduled',
        interviewer: 'John Smith',
        meetingLink: 'https://zoom.us/j/123456789'
      },
      {
        candidateId: 2,
        candidateName: 'Michael Rodriguez',
        date: '2025-09-21',
        time: '14:00',
        type: 'HR',
        mode: 'Video',
        status: 'Completed',
        interviewer: 'Sarah Johnson',
        meetingLink: 'https://teams.microsoft.com/l/meetup-join/123'
      },
      {
        candidateId: 4,
        candidateName: 'David Kim',
        date: '2025-09-22',
        time: '11:00',
        type: 'Panel',
        mode: 'In-person',
        status: 'Scheduled',
        interviewer: 'John Smith, Mike Chen',
        location: 'Conference Room A'
      }
    ];
  }

  // ✅ Interview evaluation data
  getInterviewEvaluations() {
    return [
      {
        candidateId: 2,
        candidateName: 'Michael Rodriguez',
        interviewDate: '2025-09-21',
        interviewer: 'Sarah Johnson',
        ratings: {
          technicalSkills: 4,
          communication: 5,
          problemSolving: 4,
          cultureFit: 5
        },
        notes: 'Excellent communication skills and strong technical background. Shows great enthusiasm for the role.',
        recommendation: 'Hire',
        overallScore: 4.5
      }
    ];
  }

  // ✅ Available time slots for scheduling
  getAvailableTimeSlots() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      availableDates: [
        tomorrow.toISOString().split('T')[0],
        new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      ],
      timeSlots: [
        '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
      ]
    };
  }

  // ✅ NEW: Offer Data for Send Offer page
  getOfferData() {
    const candidates = this.candidatesSubject.value;
    const topCandidate = candidates
      .filter(c => c.status === 'Shortlisted')
      .reduce((prev, current) => (prev.score > current.score) ? prev : current);

    return {
      selectedCandidate: topCandidate,
      offerDetails: {
        baseSalary: 150000,
        annualBonus: 25000,
        equity: 0.5,
        totalPackage: 175000,
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        workLocation: 'Remote',
        benefits: {
          healthInsurance: true,
          retirement: true,
          remoteWork: true,
          stockOptions: true,
          paidTimeOff: false,
          learningBudget: false
        }
      },
      approvalStatus: 'Approved',
      approvalWorkflow: {
        hrReview: { completed: true, date: '2025-09-17' },
        managerApproval: { completed: true, date: '2025-09-17' },
        finalReview: { completed: true, date: '2025-09-18' }
      },
      legalDocuments: [
        'Offer Letter.pdf',
        'Employee Handbook.pdf',
        'NDA Agreement.pdf',
        'Benefits Guide.pdf'
      ],
      emailTemplate: {
        subject: `Job Offer - ${this.currentJobData.jobTitle} Position`,
        body: `Dear ${topCandidate.name},

We are excited to extend this offer for the ${this.currentJobData.jobTitle} position at ${this.currentJobData.companyName}. 

We believe your skills and experience make you an excellent fit for our team, and we look forward to working with you.

Please review the attached offer letter and let us know if you have any questions.

Best regards,
HR Team`
      }
    };
  }

  // ✅ FIXED: Offer status tracking - return proper type
  getOfferStatus(): OfferStatus {
    return {
      status: 'Draft',
      timeline: {
        drafted: '2025-09-18',
        sent: null,
        viewed: null,
        responded: null
      },
      candidateResponse: null,
      lastActivity: 'Offer drafted',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  }

  // ✅ FIXED: Update offer status method with proper typing
  updateOfferStatus(status: string, candidateResponse?: string): OfferStatus {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentStatus: OfferStatus = this.getOfferStatus();

    const updatedStatus: OfferStatus = {
      ...currentStatus,
      status: status,
      timeline: { ...currentStatus.timeline }
    };

    switch (status) {
      case 'Sent':
        updatedStatus.timeline.sent = currentDate;
        updatedStatus.lastActivity = 'Offer sent to candidate';
        break;

      case 'Viewed':
        updatedStatus.timeline.viewed = currentDate;
        updatedStatus.lastActivity = 'Candidate viewed offer';
        break;

      case 'Responded':
        updatedStatus.timeline.responded = currentDate;
        updatedStatus.candidateResponse = candidateResponse || null;
        updatedStatus.lastActivity = `Candidate ${candidateResponse || 'responded to'} offer`;
        break;
    }

    return updatedStatus;
  }

  // ✅ Mark candidates for shortlisting
  markCandidateForShortlist(candidateId: number, shortlisted: boolean = true): void {
    const candidates = this.candidatesSubject.value;
    const index = candidates.findIndex(c => c.id === candidateId);
    if (index !== -1) {
      candidates[index].status = shortlisted ? 'Shortlisted' : 'Under Review';
      this.candidatesSubject.next([...candidates]);
    }
  }

  // ✅ Existing methods...
  resetWorkflow(): void {
    this.setCurrentStep(1);
    const steps = this.workflowStepsSubject.value;
    steps.forEach(step => step.completed = false);
    this.workflowStepsSubject.next([...steps]);
  }

  getCurrentStepInfo(): WorkflowStep | null {
    const currentStep = this.currentStepSubject.value;
    const steps = this.workflowStepsSubject.value;
    return steps.find(step => step.id === currentStep) || null;
  }

  getJobPostingStats() {
    return {
      status: 'Live',
      daysPosted: 7,
      views: 247,
      applicationRate: '3.3 per day',
      qualityScore: 'High',
      responseTime: '24 hours avg'
    };
  }

  getRecommendedActions() {
    return [
      {
        title: 'Review New Applications',
        description: '5 new applications need review',
        action: 'Review'
      },
      {
        title: 'Update Job Requirements',
        description: 'Consider refining requirements if needed',
        action: 'Update'
      },
      {
        title: 'Schedule Screening Calls',
        description: '8 qualified candidates ready for screening',
        action: 'Schedule'
      }
    ];
  }
  getOnboardingData() {
    const candidates = this.candidatesSubject.value;
    const hiredCandidate = candidates
      .filter(c => c.status === 'Shortlisted')
      .reduce((prev, current) => (prev.score > current.score) ? prev : current);

    return {
      newHire: hiredCandidate,
      startDate: 'February 1, 2024',
      department: this.currentJobData.department,
      manager: 'John Smith',
      hrContact: 'Sarah Johnson',
      onboardingProgress: {
        completed: 3,
        total: 6,
        percentage: 50
      },
      nextSteps: [
        'Setup IT Equipment',
        'Security badge creation',
        'Benefits enrollment',
        'First day orientation'
      ]
    };
  }

  // Method to complete workflow
  completeWorkflow(): void {
    this.completeStep(8);
    console.log('Hiring workflow completed successfully!');
  }
}
