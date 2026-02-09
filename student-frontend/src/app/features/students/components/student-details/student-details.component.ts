import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentService } from '../../../../core/services/student.service';
import { Student } from '../../../../core/models/student.model';
import { StudentFormComponent } from '../student-form/student-form.component';
import { format } from 'date-fns';
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
    selector: 'app-student-details',
    standalone: true,
    imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinner
],
    templateUrl: './student-details.component.html',
    styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  student = signal<Student | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadStudent();
  }

  loadStudent(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.error.set('Student ID not found');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.studentService.getStudentById(+id).subscribe({
      next: (student) => {
        this.student.set(student);
        this.loading.set(false);
      },
      error: (err) => {
        const errorMessage = this.getErrorMessage(err);
        this.error.set(errorMessage);
        this.loading.set(false);
        this.showError(errorMessage);
      }
    });
  }

  formatDate(date: Date | string): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'MMMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  }

  openEditDialog(): void {
    const student = this.student();
    if (!student) return;

    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '500px',
      disableClose: true,
      data: { mode: 'edit', student }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadStudent(); 
      }
    });
  }

  deleteStudent(): void {
    const student = this.student();
    if (!student) return;

    if (confirm(`Are you sure you want to delete ${student.fullName}? This action cannot be undone.`)) {
      this.studentService.deleteStudent(student.id).subscribe({
        next: () => {
          this.showSuccess(`${student.fullName} has been deleted successfully`);
          setTimeout(() => {
            this.router.navigate(['/students']);
          }, 1000);
        },
        error: (err) => {
          const errorMessage = this.getErrorMessage(err);
          this.error.set(errorMessage);
          this.showError(errorMessage);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }

  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Cannot connect to server. Please check your internet connection.';
    }
    if (error.status === 404) {
      return 'Student not found. It may have been deleted.';
    }
    if (error.status === 500) {
      return 'Server error occurred. Please try again later.';
    }
    return error.error?.message || error.message || 'Failed to load student details';
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}