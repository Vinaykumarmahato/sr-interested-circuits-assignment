import axios from 'axios';
import { Student, CreateStudentDto, UpdateStudentDto } from '../types/student';

const API_URL = 'http://localhost:3000/api/students';

export const studentService = {
  // GET all students
  getAll: async (): Promise<Student[]> => {
    const response = await axios.get<Student[]>(API_URL);
    return response.data;
  },

  // POST new student
  create: async (data: CreateStudentDto): Promise<Student> => {
    const response = await axios.post<Student>(API_URL, data);
    return response.data;
  },

  // PUT update student
  update: async (id: string, data: UpdateStudentDto): Promise<Student> => {
    const response = await axios.put<Student>(`${API_URL}/${id}`, data);
    return response.data;
  },

  // DELETE student
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
