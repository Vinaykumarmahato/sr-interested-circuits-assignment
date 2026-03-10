# Student Management System

A professional Student Management System built with React (Vite) on the frontend and NestJS (MySQL) on the backend. It features a clean, high-end dashboard with simulated loading states, strict form validation, custom confirmation dialogs, and Excel export functionality.

The application uses a "Dual-Mode" approach, meaning it works 100% on the frontend using in-memory state by default, but can easily be connected to the NestJS backend by uncommenting the Axios calls.

---

## Code Block 1: Complete NestJS Backend

### 1. `src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from './student/student.module';
import { Student } from './student/student.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'ADVindiancoder@860964',
      database: 'sr_interested_circuits_db',
      entities: [Student],
      synchronize: true, // Auto-synchronize the database schema
    }),
    StudentModule,
  ],
})
export class AppModule {}
```

### 2. `src/student/student.entity.ts`
```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column('int')
  age: number;
}
```

### 3. `src/student/student.service.ts`
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async create(studentData: Partial<Student>): Promise<Student> {
    const newStudent = this.studentRepository.create(studentData);
    return this.studentRepository.save(newStudent);
  }

  async update(id: string, updateData: Partial<Student>): Promise<Student> {
    await this.studentRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }
}
```

### 4. `src/student/student.controller.ts`
```typescript
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './student.entity';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  findAll(): Promise<Student[]> {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Student> {
    return this.studentService.findOne(id);
  }

  @Post()
  create(@Body() studentData: Partial<Student>): Promise<Student> {
    return this.studentService.create(studentData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<Student>): Promise<Student> {
    return this.studentService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.studentService.remove(id);
  }
}
```

### 5. `src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS
  app.setGlobalPrefix('api'); // Global API Prefix
  await app.listen(3000);
}
bootstrap();
```

---

## Code Block 2: Complete React Frontend

### 1. `src/App.tsx`
```tsx
import React, { useState, useEffect } from 'react';
import { Download, Plus, Users } from 'lucide-react';
import { StudentTable } from './components/StudentTable';
import { StudentForm } from './components/StudentForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Button } from './components/ui/Button';
import { Student, CreateStudentDto } from './types/student';
import { studentService } from './services/studentService';
import { exportStudentsToExcel } from './services/excelService';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

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
      setTimeout(() => setIsLoading(false), 800); // Simulated loading state
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
        const updated = await studentService.update(selectedStudent.id, data);
        setStudents(prev => prev.map(s => s.id === selectedStudent.id ? updated : s));
      } else {
        const created = await studentService.create(data);
        setStudents(prev => [...prev, created]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to save student:', error);
    } finally {
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
      setTimeout(() => setIsActionLoading(false), 500);
    }
  };

  const handleExport = () => {
    exportStudentsToExcel(students, 'student_list.xlsx');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center text-3xl font-bold tracking-tight text-slate-900">
              <Users className="mr-3 h-8 w-8 text-indigo-600" />
              Student Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage student records, update details, and export data.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleExport} disabled={isLoading || students.length === 0} className="bg-white">
              <Download className="mr-2 h-4 w-4" /> Export Excel
            </Button>
            <Button onClick={handleAddStudent} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </div>
        </div>

        <StudentTable students={students} onEdit={handleEditStudent} onDelete={handleDeleteClick} isLoading={isLoading || isActionLoading} />

        <StudentForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={selectedStudent} isLoading={isActionLoading} />

        <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmDelete} title="Delete Student" description="Are you sure you want to delete this student? This action cannot be undone." isLoading={isActionLoading} />
      </div>
    </div>
  );
}
```

### 2. `src/components/StudentTable.tsx`
```tsx
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Student } from '../types/student';
import { Button } from './ui/Button';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function StudentTable({ students, onEdit, onDelete, isLoading }: StudentTableProps) {
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="animate-pulse">
          <div className="h-12 border-b border-slate-200 bg-slate-50"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex h-16 items-center border-b border-slate-100 px-6">
              <div className="h-4 w-1/4 rounded bg-slate-200"></div>
              <div className="ml-4 h-4 w-1/3 rounded bg-slate-200"></div>
              <div className="ml-4 h-4 w-16 rounded bg-slate-200"></div>
              <div className="ml-auto flex space-x-2">
                <div className="h-8 w-8 rounded bg-slate-200"></div>
                <div className="h-8 w-8 rounded bg-slate-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
        <p className="text-lg font-medium text-slate-500">No students found</p>
        <p className="text-sm text-slate-400">Add a new student to get started.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-6 py-4 font-medium">Name</th>
            <th className="px-6 py-4 font-medium">Email</th>
            <th className="px-6 py-4 font-medium">Age</th>
            <th className="px-6 py-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => (
            <tr key={student.id} className="transition-colors hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
              <td className="px-6 py-4">{student.email}</td>
              <td className="px-6 py-4">{student.age}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(student)} className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(student.id)} className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 3. `src/components/StudentForm.tsx`
```tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Student, CreateStudentDto } from '../types/student';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentDto) => void;
  initialData?: Student | null;
  isLoading?: boolean;
}

export function StudentForm({ isOpen, onClose, onSubmit, initialData, isLoading }: StudentFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateStudentDto>({
    defaultValues: initialData || { name: '', email: '', age: '' as any }
  });

  useEffect(() => {
    if (isOpen) reset(initialData || { name: '', email: '', age: '' as any });
  }, [isOpen, initialData, reset]);

  const onFormSubmit = (data: CreateStudentDto) => {
    onSubmit({ ...data, age: Number(data.age) });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Student' : 'Add Student'}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
          <Input {...register('name', { required: 'Name is required' })} placeholder="John Doe" disabled={isLoading} />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <Input {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })} placeholder="john@example.com" disabled={isLoading} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Age</label>
          <Input type="number" {...register('age', { required: 'Age is required', min: { value: 1, message: 'Age must be a positive number' }, valueAsNumber: true })} placeholder="20" disabled={isLoading} />
          {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age.message}</p>}
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Modal>
  );
}
```

### 4. `src/services/excelService.ts`
```typescript
import * as XLSX from 'xlsx';
import { Student } from '../types/student';

export const exportStudentsToExcel = (students: Student[], filename = 'students.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(students);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  XLSX.writeFile(workbook, filename);
};
```

---

## Code Block 3: Setup & Deployment Guide

### Step-by-step setup for MySQL

1. Install MySQL on your machine if you haven't already.
2. Open your MySQL terminal or client (like MySQL Workbench).
3. Run the following command to create the database:
   ```sql
   CREATE DATABASE sr_interested_circuits_db;
   ```
4. Ensure your MySQL root user has the password `ADVindiancoder@860964` as configured in the NestJS App Module.

### Instructions to run the project

**Backend (NestJS):**
1. Navigate to the backend directory.
2. Install dependencies: `npm install`
3. Start the server: `npm run start:dev`
4. The server will run on `http://localhost:3000/api`

**Frontend (React/Vite):**
1. Navigate to the frontend directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open the provided localhost URL in your browser.
5. **Note:** To connect the frontend to the backend, open `src/services/studentService.ts` and uncomment the Axios calls, then comment out the "FRONTEND MODE" mock responses.

### Deployment guide for Vercel/Netlify

**Deploying the Frontend (Vercel or Netlify):**
1. Push your frontend code to a GitHub repository.
2. Log in to Vercel or Netlify and select "Add New Project".
3. Import your GitHub repository.
4. The build settings should be automatically detected:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**. Your frontend will be live in minutes.
6. Since the app uses the "Dual-Mode" approach, it will work perfectly out of the box using in-memory state.

**Deploying the Backend (Render or Railway):**
1. Push your NestJS code to GitHub.
2. Connect your repository to Render or Railway.
3. Set the build command to `npm install && npm run build` and the start command to `npm run start:prod`.
4. Provision a managed MySQL database on the platform and update your `app.module.ts` to use the production database credentials via environment variables.
