import { Component, Inject, inject, signal } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import{MatSnackBar,MatSnackBarModule} from '@angular/material/snack-bar';
import { StudentService } from '../../../../core/services/student.service';
import { Student, CreateStudentCommand, UpdateStudentCommand } from '../../../../core/models/student.model';
import { differenceInYears, parseISO } from 'date-fns';

interface DialogData {
  mode: 'add' | 'edit';
  student?: Student;
}

@Component({
    selector: 'app-student-form',
    standalone: true,
    imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
],
    templateUrl: './student-form.component.html',
    styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private dialogRef = inject(MatDialogRef<StudentFormComponent>);
  private snackBar = inject(MatSnackBar);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

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
    
    if (birthDate > today) {
      return { maxDate: true };
    }
    
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


  getFisrtNameError(): string {
    const control = this.studentForm.get('firstName');
    if(control?.hasError('required')) {
      return 'First name cannot exceed 50 characters';
    }
    return '';
  }

  getLastNameError(): string {
    const control = this.studentForm.get('lastName');
    if(control?.hasError('required')) {
      return 'Last name cannot exceed 50 characters';
    }
    return '';
  }

  getDateOfBirthError():string {
    const control = this.studentForm.get('dateOfBirth');
    if (control?.hasError('required')) {
      return 'Date of birth is required';
    }
    if (control?.hasError('maxDate')) {
      return 'Date of birth cannot be in the future';
    }
    if (control?.hasError('ageValidation')) {
      return 'Student must be at least 10 years old';
    }
    return '';
  }

  onSubmit(): void {
    if (this.studentForm.invalid){
      Object.keys(this.studentForm.controls).forEach(key =>{
        this.studentForm.get(key)?.markAsTouched();
      });

      this.showError('Please fix all validation errors before submitting');
      return;
    } 

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

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
        this.showSuccess('Student created successfully!');
        this.dialogRef.close('success');
      },
      error: (error) => {
        this.isSubmitting.set(false);
        const errorMsg = this.getErrorMessage(error);
        this.errorMessage.set(errorMsg);
        this.showError(errorMsg);

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
        this.showSuccess('Student updated successfully!')
        this.dialogRef.close('success');
      },
      error: () => {
        this.isSubmitting.set(false);
        const errorMsg = this.getErrorMessage(Error);
        this.errorMessage.set(errorMsg);
        this.showError(errorMsg);
      }
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }


  private getErrorMessage(error: any): string {
    if(error.status === 0) {
      return 'Cannot connect to server.Plaese check your internet connection.';
    }
    if(error.status === 400) {
      return error.error?.message || 'Invalid data provided. Please check your inputs.';
    }
    if(error.status ===404) {
      return 'Student not found. It may have been deleted.';
    }
    if(error.status === 409) {
      return 'A student with this information already exists.';
    }
    if(error.status === 500) {
      return 'Server error occured. Please try again later.';
    }
    return error.error?.message || error.message || 'An unexpected error occured. Please try again.';
  }

  private showSuccess(message: string) : void {
    this.snackBar.open(message, 'Close',{
      duration : 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass:['success-snackbar']
    });
  }

  private showError(message: string) : void {
    this.snackBar.open(message,'Close', {
      duration: 3000,
      horizontalPosition : 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}