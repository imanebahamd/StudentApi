import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StudentService } from '../../../../core/services/student.service';
import { Student } from '../../../../core/models/student.model';
import { StudentFormComponent } from '../student-form/student-form.component';
import { format } from 'date-fns';
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
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
        this.error.set(err.message || 'Failed to load student details');
        this.loading.set(false);
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
      data: { mode: 'edit', student }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadStudent(); // Refresh student details
      }
    });
  }

  deleteStudent(): void {
    const student = this.student();
    if (!student) return;

    if (confirm(`Are you sure you want to delete ${student.fullName}?`)) {
      this.studentService.deleteStudent(student.id).subscribe({
        next: () => {
          this.router.navigate(['/students']);
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to delete student');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }
}