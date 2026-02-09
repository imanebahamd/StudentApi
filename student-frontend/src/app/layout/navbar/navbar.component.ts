import { Component, inject } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { StudentFormComponent } from '../../features/students/components/student-form/student-form.component';
import { StudentService } from './../../core/services/student.service';

@Component({
    selector: 'app-navbar',
    imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule
],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  readonly dialog = inject(MatDialog);
  readonly studentService = inject(StudentService);
  readonly router = inject(Router);

  openAddDialog(): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        if (this.router.url === '/' || this.router.url === '/welcome') {
          window.location.reload(); 
        }
      }
    });
  }

  onViewStudentsClick(): void {
    this.router.navigate(['/students']).then(() => {
      window.location.reload(); 
    });
  }
}