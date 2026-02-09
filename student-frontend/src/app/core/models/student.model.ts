export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | string;
  age: number;
  fullName: string;
}

export interface CreateStudentCommand {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | string;
}

export interface UpdateStudentCommand {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | string;
}