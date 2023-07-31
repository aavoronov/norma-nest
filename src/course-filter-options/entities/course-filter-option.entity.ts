import { Course } from '@/src/courses/entities/course.entity';
import { Lesson } from '@/src/lessons/entities/lesson.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

@Table
export class CourseFilterOption extends Model<CourseFilterOption> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  title: string;

  @HasMany(() => Course)
  courses: Course;

  @HasMany(() => Lesson)
  lessons: Lesson;
}
