import axios from 'axios';
import { Student, CreateStudentDto, UpdateStudentDto } from '../types/student';

const API_URL = 'http://localhost:3000/api/students';

// Dual-Mode Approach:
// By default, we use in-memory state in App.tsx to ensure it works 100% on the frontend.
// Uncomment the Axios calls below to connect to the NestJS backend.

export const studentService = {
  // GET all students
  getAll: async (): Promise<Student[]> => {
    // BACKEND MODE:
    // const response = await axios.get<Student[]>(API_URL);
    // return response.data;
    
    // FRONTEND MODE: Handled in App.tsx state
    return [];
  },

  // POST new student
  create: async (data: CreateStudentDto): Promise<Student> => {
    // BACKEND MODE:
    // const response = await axios.post<Student>(API_URL, data);
    // return response.data;
    
    // FRONTEND MODE: Handled in App.tsx state
    return { id: Math.random().toString(36).substr(2, 9), ...data };
  },

  // PUT update student
  update: async (id: string, data: UpdateStudentDto): Promise<Student> => {
    // BACKEND MODE:
    // const response = await axios.put<Student>(`${API_URL}/${id}`, data);
    // return response.data;
    
    // FRONTEND MODE: Handled in App.tsx state
    return { id, ...data } as Student;
  },

  // DELETE student
  delete: async (id: string): Promise<void> => {
    // BACKEND MODE:
    // await axios.delete(`${API_URL}/${id}`);
    
    // FRONTEND MODE: Handled in App.tsx state
    return;
  }
};
