import React, { useState, useEffect } from 'react';
import { Download, Plus, GraduationCap } from 'lucide-react';
import { StudentTable } from './components/StudentTable';
import { StudentForm } from './components/StudentForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Button } from './components/ui/Button';
import { Student, CreateStudentDto } from './types/student';
import { studentService } from './services/studentService';
import { exportStudentsToExcel } from './services/excelService';
import { motion } from 'motion/react';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  // Selected student state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      // Simulate network delay for UX
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setStudentToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleFormSubmit = async (data: CreateStudentDto) => {
    setIsActionLoading(true);
    try {
      if (selectedStudent) {
        // Update
        const updated = await studentService.update(selectedStudent.id, data);
        setStudents(prev => prev.map(s => s.id === selectedStudent.id ? updated : s));
      } else {
        // Create
        const created = await studentService.create(data);
        setStudents(prev => [...prev, created]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to save student:', error);
    } finally {
      // Simulate network delay for UX
      setTimeout(() => setIsActionLoading(false), 500);
    }
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    
    setIsActionLoading(true);
    try {
      await studentService.delete(studentToDelete);
      setStudents(prev => prev.filter(s => s.id !== studentToDelete));
      setIsConfirmOpen(false);
    } catch (error) {
      console.error('Failed to delete student:', error);
    } finally {
      // Simulate network delay for UX
      setTimeout(() => setIsActionLoading(false), 500);
    }
  };

  const handleExport = () => {
    exportStudentsToExcel(students, 'student_list.xlsx');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 p-4 font-sans text-slate-900 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-5xl"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white/60 p-6 shadow-sm ring-1 ring-slate-900/5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Student Directory
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage student records, update details, and export data.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isLoading || students.length === 0}
              className="rounded-xl border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm hover:bg-slate-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button 
              onClick={handleAddStudent} 
              disabled={isLoading} 
              className="rounded-xl bg-indigo-600 shadow-md shadow-indigo-200 hover:bg-indigo-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <StudentTable
            students={students}
            onEdit={handleEditStudent}
            onDelete={handleDeleteClick}
            isLoading={isLoading || isActionLoading}
          />
        </motion.div>

        {/* Modals */}
        <StudentForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={selectedStudent}
          isLoading={isActionLoading}
        />

        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Student"
          description="Are you sure you want to delete this student? This action cannot be undone."
          isLoading={isActionLoading}
        />
      </motion.div>
    </div>
  );
}
