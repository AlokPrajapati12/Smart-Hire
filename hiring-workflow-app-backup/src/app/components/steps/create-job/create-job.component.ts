import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { JobData } from '../../../models/job.interface';
import { WorkflowService } from '../../../services/workflow.service';

@Component({
  selector: 'app-create-job',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.scss']
})
export class CreateJobComponent implements OnInit {
  jobForm!: FormGroup;
  selectedBenefits: string[] = [];

  departments = ['Engineering', 'Product', 'Marketing', 'HR'];
  employmentTypes = [
    { label: 'Full-time', value: 'full-time' },
    { label: 'Part-time', value: 'part-time' },
    { label: 'Contract', value: 'contract' }
  ];
  experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead'];
  educationLevels = ['High School', 'Bachelor', 'Master', 'PhD'];
  benefitOptions = ['Health Insurance', '401k', 'Paid Time Off', 'Flexible Hours', 'Remote Work'];

  constructor(
    private fb: FormBuilder,
    private workflowService: WorkflowService   // ✅ Injected here
  ) { }

  ngOnInit(): void {
    this.jobForm = this.fb.group({
      companyName: ['', Validators.required],
      department: [''],
      jobTitle: ['', Validators.required],
      location: [''],
      employmentType: ['full-time'],
      minSalary: [0],
      maxSalary: [0],
      experienceLevel: [''],
      education: [''],
      keySkills: [''],
      jobDescription: ['']
    });
    const saved = this.workflowService.currentJobData;
    if (saved) {
      this.jobForm.patchValue(saved);
      this.selectedBenefits = saved.benefits || [];
    }
  }


  isBenefitSelected(benefit: string): boolean {
    return this.selectedBenefits.includes(benefit);
  }

  onBenefitChange(benefit: string, checked: boolean): void {
    if (checked) {
      this.selectedBenefits.push(benefit);
    } else {
      this.selectedBenefits = this.selectedBenefits.filter(b => b !== benefit);
    }
  }

  saveDraft(): void {
    if (this.jobForm.valid) {
      this.workflowService.updateJobData(this.jobForm.value);
      alert('Draft saved!');
    }
  }

  generateJobDescription(): void {
    // 1. Prevent next if form is invalid
    if (this.jobForm.invalid) {
      alert('Please complete required fields before generating JD.');
      return; // stop here
    }

    // 2. Save form data including selected benefits
    const jobData: JobData = {
      ...this.jobForm.value,
      benefits: this.selectedBenefits
    };
    this.workflowService.updateJobData(jobData);

    // 3. Move to the next step (Review page)
    this.workflowService.nextStep(); // ONLY ONCE
  }

}
