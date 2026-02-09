import { Component, input, output, ViewChild, effect } from '@angular/core';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Student } from '../../../../core/models/student.model';
import { format } from 'date-fns';

@Component({
    selector: 'app-student-list',
    imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatCardModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
],
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent {
  students = input<Student[]>([]);
  edit = output<Student>();
  delete = output<number>();

  displayedColumns: string[] = ['fullName', 'dateOfBirth', 'age', 'actions'];
  dataSource = new MatTableDataSource<Student>([]);
  searchControl = new FormControl('');
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    // Update data source when students input changes
    effect(() => {
      this.dataSource.data = this.students();
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });

    // Setup search filter
    this.searchControl.valueChanges.subscribe(value => {
      this.applyFilter(value || '');
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  formatDate(date: Date | string): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  }
}