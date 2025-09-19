export interface JobData {
  companyName: string;
  department: string;
  jobTitle: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'internship' | 'contract';
  minSalary: number;
  maxSalary: number;
  experienceLevel: string;
  education: string;
  keySkills: string;
  benefits: string[];
  jobDescription: string;
}



