import React from 'react';
import { Edit2, Trash2, Users } from 'lucide-react';
import { Student } from '../types/student';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'motion/react';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function StudentTable({ students, onEdit, onDelete, isLoading }: StudentTableProps) {
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl">
        <div className="animate-pulse">
          <div className="h-14 border-b border-slate-100 bg-slate-50/50"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex h-16 items-center border-b border-slate-50 px-6">
              <div className="h-4 w-1/4 rounded-full bg-slate-200/60"></div>
              <div className="ml-4 h-4 w-1/3 rounded-full bg-slate-200/60"></div>
              <div className="ml-4 h-4 w-16 rounded-full bg-slate-200/60"></div>
              <div className="ml-auto flex space-x-2">
                <div className="h-8 w-8 rounded-full bg-slate-200/60"></div>
                <div className="h-8 w-8 rounded-full bg-slate-200/60"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-72 flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl"
      >
        <div className="mb-4 rounded-full bg-indigo-50 p-4 text-indigo-500">
          <Users className="h-8 w-8" />
        </div>
        <p className="text-lg font-medium text-slate-700">No students found</p>
        <p className="mt-1 text-sm text-slate-500">Add a new student to get started.</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-900/5">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 backdrop-blur-md">
          <tr>
            <th className="px-6 py-4 font-semibold">Name</th>
            <th className="px-6 py-4 font-semibold">Email</th>
            <th className="px-6 py-4 font-semibold">Age</th>
            <th className="px-6 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <AnimatePresence mode="popLayout">
            {students.map((student, index) => (
              <motion.tr
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={student.id}
                className="group transition-colors hover:bg-slate-50/80"
              >
                <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                <td className="px-6 py-4 text-slate-500">{student.email}</td>
                <td className="px-6 py-4 text-slate-500">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                    {student.age} yrs
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(student)}
                      className="h-8 w-8 rounded-full text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(student.id)}
                      className="h-8 w-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
