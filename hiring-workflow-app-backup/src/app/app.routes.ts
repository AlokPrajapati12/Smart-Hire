import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing';
import { WorkflowComponent } from './components/workflow/workflow.component';

export const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'workflow', component: WorkflowComponent },
  { path: 'workflow/:step', component: WorkflowComponent },
  { path: '**', redirectTo: '' }
];
