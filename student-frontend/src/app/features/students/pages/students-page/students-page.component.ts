// students-page.component.ts (UPDATED - Graduation Cap Version)
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StudentListComponent } from '../../components/student-list/student-list.component';
import { StudentFormComponent } from '../../components/student-form/student-form.component';
import { StudentService } from '../../../../core/services/student.service';
import { Student } from '../../../../core/models/student.model';
import { MatIcon } from "@angular/material/icon";
import { Router, ActivatedRoute } from '@angular/router';
import { GraduationCapMascotComponent } from '../../components/graduation-cap-mascot/graduation-cap-mascot.component';

@Component({
    selector: 'app-students-page',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
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
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadStudents();
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
      data: { mode: 'edit', student }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadStudents();
      }
    });
  }

  onDeleteStudent(studentId: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(studentId).subscribe(() => {
        this.loadStudents();
      });
    }
  }
}