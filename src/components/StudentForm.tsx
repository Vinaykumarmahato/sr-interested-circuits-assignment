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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateStudentDto>({
    defaultValues: initialData || { name: '', email: '', age: '' as any }
  });

  useEffect(() => {
    if (isOpen) {
      reset(initialData || { name: '', email: '', age: '' as any });
    }
  }, [isOpen, initialData, reset]);

  const onFormSubmit = (data: CreateStudentDto) => {
    onSubmit({
      ...data,
      age: Number(data.age)
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Student' : 'Add Student'}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
          <Input
            {...register('name', { required: 'Name is required' })}
            placeholder="John Doe"
            disabled={isLoading}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <Input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            placeholder="john@example.com"
            disabled={isLoading}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Age</label>
          <Input
            type="number"
            {...register('age', {
              required: 'Age is required',
              min: { value: 1, message: 'Age must be a positive number' },
              valueAsNumber: true
            })}
            placeholder="20"
            disabled={isLoading}
          />
          {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age.message}</p>}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
