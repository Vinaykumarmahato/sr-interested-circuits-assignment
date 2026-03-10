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
