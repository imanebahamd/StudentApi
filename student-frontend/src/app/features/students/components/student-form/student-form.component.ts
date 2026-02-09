import { Component, Inject, inject, signal } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StudentService } from '../../../../core/services/student.service';
import { Student, CreateStudentCommand, UpdateStudentCommand } from '../../../../core/models/student.model';
import { differenceInYears, parseISO } from 'date-fns';

interface DialogData {
  mode: 'add' | 'edit';
  student?: Student;
}

@Component({
    selector: 'app-student-form',
    imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
],
    templateUrl: './student-form.component.html',
    styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private dialogRef = inject(MatDialogRef<StudentFormComponent>);

  isSubmitting = signal(false);

  studentForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      dateOfBirth: ['', [Validators.required, this.ageValidator]]
    });

    if (data.mode === 'edit' && data.student) {
      this.patchForm(data.student);
    }
  }

  private ageValidator(control: any) {
    if (!control.value) return null;

    const birthDate = new Date(control.value);
    const today = new Date();
    
    // Check if date is in the future
    if (birthDate > today) {
      return { maxDate: true };
    }
    
    // Check if student is at least 10 years old
    const age = differenceInYears(today, birthDate);
    if (age < 10) {
      return { ageValidation: true };
    }
    
    return null;
  }

  private patchForm(student: Student): void {
    const dateOfBirth = typeof student.dateOfBirth === 'string' 
      ? parseISO(student.dateOfBirth)
      : student.dateOfBirth;

    this.studentForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: dateOfBirth
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) return;

    this.isSubmitting.set(true);

    if (this.data.mode === 'add') {
      this.createStudent();
    } else {
      this.updateStudent();
    }
  }

  private createStudent(): void {
    const command: CreateStudentCommand = {
      firstName: this.studentForm.value.firstName.trim(),
      lastName: this.studentForm.value.lastName.trim(),
      dateOfBirth: this.formatDate(this.studentForm.value.dateOfBirth)
    };

    this.studentService.createStudent(command).subscribe({
      next: () => {
        this.dialogRef.close('success');
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  private updateStudent(): void {
    if (!this.data.student) return;

    const command: UpdateStudentCommand = {
      id: this.data.student.id,
      firstName: this.studentForm.value.firstName.trim(),
      lastName: this.studentForm.value.lastName.trim(),
      dateOfBirth: this.formatDate(this.studentForm.value.dateOfBirth)
    };

    this.studentService.updateStudent(command).subscribe({
      next: () => {
        this.dialogRef.close('success');
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}