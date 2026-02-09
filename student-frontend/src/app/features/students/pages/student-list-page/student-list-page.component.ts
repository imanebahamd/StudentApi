import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentListComponent } from '../../components/student-list/student-list.component';
import { StudentFormComponent } from '../../components/student-form/student-form.component';
import { StudentService } from '../../../../core/services/student.service';
import { Student } from '../../../../core/models/student.model';

@Component({
    selector: 'app-student-list-page',
    standalone: true,
    imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    StudentListComponent
],
    templateUrl: './student-list-page.component.html',
    styleUrls: ['./student-list-page.component.scss']
})
export class StudentListPageComponent implements OnInit {
  private studentService = inject(StudentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  
  students: Student[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(error);
        this.showError(this.errorMessage);
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '500px',
      disableClose: true,
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadStudents();
      }
    });
  }

  onEditStudent(student: Student): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '500px',
      disableClose: true,
      data: { mode: 'edit', student }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadStudents();
      }
    });
  }

  onDeleteStudent(studentId: number): void {
    const student = this.students.find(s => s.id === studentId);
    const studentName = student ? student.fullName : 'this student';

    if (confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      this.studentService.deleteStudent(studentId).subscribe({
        next: () => {
          this.showSuccess(`${studentName} has been deleted successfully`);
          this.loadStudents();
        },
        error: (error) => {
          this.showError(this.getErrorMessage(error));
        }
      });
    }
  }

  retryLoad(): void {
    this.loadStudents();
  }

  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Cannot connect to server. Please check your internet connection.';
    }
    if (error.status === 404) {
      return 'Students not found. The resource may have been moved.';
    }
    if (error.status === 500) {
      return 'Server error occurred. Please try again later.';
    }
    return error.error?.message || error.message || 'Failed to load students. Please try again.';
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