import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentListComponent } from '../../components/student-list/student-list.component';
import { StudentFormComponent } from '../../components/student-form/student-form.component';
import { StudentService } from '../../../../core/services/student.service';
import { Student } from '../../../../core/models/student.model';
import { MatIcon } from "@angular/material/icon";
import { Router, ActivatedRoute } from '@angular/router';
import { GraduationCapMascotComponent } from '../../components/graduation-cap-mascot/graduation-cap-mascot.component';

@Component({
    selector: 'app-students-page',
    standalone: true,
    imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIcon,
    GraduationCapMascotComponent
],
    templateUrl: './students-page.component.html',
    styleUrls: ['./students-page.component.scss']
})
export class StudentsPageComponent implements OnInit {
  readonly studentService = inject(StudentService);
  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  
  students: Student[] = [];
  isLoading = true;
  
  get showStudentList(): boolean {
    return this.router.url.includes('/students');
  }

  ngOnInit(): void {
    this.loadStudents();
    
    this.router.events.subscribe(() => {
      if (this.showStudentList) {
        this.loadStudents();
      }
    });
  }

  loadStudents(): void {
    this.isLoading = true;
    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(this.getErrorMessage(error));
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
        
        this.viewStudentList();
      }
    });
  }

  viewStudentList(): void {
    this.router.navigate(['/students']);
  }

  goToWelcome(): void {
    this.router.navigate(['/']);
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

  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Cannot connect to server. Please check your internet connection.';
    }
    if (error.status === 404) {
      return 'Resource not found. Please try again.';
    }
    if (error.status === 500) {
      return 'Server error occurred. Please try again later.';
    }
    return error.error?.message || error.message || 'An unexpected error occurred. Please try again.';
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