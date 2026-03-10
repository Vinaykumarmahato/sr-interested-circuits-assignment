export interface Student {
  id: string;
  name: string;
  email: string;
  age: number;
}

export type CreateStudentDto = Omit<Student, 'id'>;
export type UpdateStudentDto = Partial<CreateStudentDto>;
