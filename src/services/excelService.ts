import * as XLSX from 'xlsx';
import { Student } from '../types/student';

export const exportStudentsToExcel = (students: Student[], filename = 'students.xlsx') => {
  // Convert students array to worksheet
  const worksheet = XLSX.utils.json_to_sheet(students);
  
  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  
  // Write the file and trigger download
  XLSX.writeFile(workbook, filename);
};
