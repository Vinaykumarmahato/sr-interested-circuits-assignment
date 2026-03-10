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
