import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Student, CreateStudentCommand, UpdateStudentCommand } from '../models/student.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private students = signal<Student[]>([]);
  private loading = signal<boolean>(false);
  private error = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  // Signals for component consumption
  readonly studentsList = this.students.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();

  // CRUD Operations
  getAllStudents(): Observable<Student[]> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.get<Student[]>(this.apiService.getEndpoint('students')).pipe(
      tap({
        next: (students) => {
          this.students.set(students);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(error.message || 'Failed to load students');
          this.loading.set(false);
        }
      })
    );
  }

  getStudentById(id: number): Observable<Student> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.get<Student>(this.apiService.getEndpoint(`students/${id}`)).pipe(
      tap({
        next: () => this.loading.set(false),
        error: (error) => {
          this.error.set(error.message || 'Failed to load student');
          this.loading.set(false);
        }
      })
    );
  }

createStudent(command: CreateStudentCommand): Observable<number> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.post<number>(this.apiService.getEndpoint('students'), command).pipe(
      tap({
        next: () => this.loading.set(false),
        error: (error) => {
          this.error.set(error.message || 'Failed to create student');
          this.loading.set(false);
        }
      })
    );
  }

  updateStudent(command: UpdateStudentCommand): Observable<void> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.put<void>(this.apiService.getEndpoint(`students/${command.id}`), command).pipe(
      tap({
        next: () => this.loading.set(false),
        error: (error) => {
          this.error.set(error.message || 'Failed to update student');
          this.loading.set(false);
        }
      })
    );
  }

  deleteStudent(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.delete<void>(this.apiService.getEndpoint(`students/${id}`)).pipe(
      tap({
        next: () => {
          // Remove the deleted student from the local list
          this.students.update(students => students.filter(s => s.id !== id));
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(error.message || 'Failed to delete student');
          this.loading.set(false);
        }
      })
    );
  }

  refreshStudents(): void {
    this.getAllStudents().subscribe();
  }

  clearError(): void {
    this.error.set(null);
  }
}