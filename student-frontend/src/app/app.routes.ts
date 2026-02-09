import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/students/pages/students-page/students-page.component')
      .then(m => m.StudentsPageComponent)
  },
  {
    path: 'students',
    loadComponent: () => import('./features/students/pages/student-list-page/student-list-page.component')  // ✅ Load the new page
      .then(m => m.StudentListPageComponent)
  },
  {
    path: 'students/:id',
    loadComponent: () => import('./features/students/components/student-details/student-details.component')
      .then(m => m.StudentDetailsComponent)
  },
  {
    path: 'welcome',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];